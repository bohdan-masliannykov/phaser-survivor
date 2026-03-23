import { Player } from '@entities/player/player';
import { Landscape } from '@entities/environment/landscape';
import { InputSystem } from '@system/input-system';
import { PlayerFactory } from '@entities/player/player-factory';
import { EnemyManager } from '@entities/enemies/enemy-manager';
import { getNearestEnemy } from '@entities/utils/pathfinding';
import { XpGemPool } from '@system/xp-gem-pool';
import { ProgressionSystem } from '@system/progression-system';
import { GameHud } from '@ui/game-hud';
import { UpgradePicker } from '@ui/upgrade-picker';
import { GameOverScreen } from '@ui/game-over-screen';
import {
  type PLAYER,
  XP_GEM_PICKUP_RADIUS,
  ENEMY_CONTACT_DAMAGE,
  ENEMY_CONTACT_COOLDOWN_MS,
  AUTO_FIRE_RANGE,
} from '@constants';

export class GameScene extends Phaser.Scene {
  inputSystem!: InputSystem;
  player!: Player;
  enemyManager!: EnemyManager;
  landscape!: Landscape;
  gemPool!: XpGemPool;
  progression!: ProgressionSystem;
  hud!: GameHud;
  upgradePicker!: UpgradePicker;
  gameOverScreen!: GameOverScreen;

  private paused = false;
  private gameOver = false;
  private lastContactDamageTime = 0;
  private pauseOverlay: Phaser.GameObjects.GameObject[] = [];

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: { characterType: keyof typeof PLAYER }) {
    this.paused = false;
    this.gameOver = false;
    this.lastContactDamageTime = 0;

    this.player = PlayerFactory.createPlayer(
      this,
      this.scale.width / 2,
      this.scale.height / 2,
      data.characterType
    );
  }

  create() {
    // Progression
    this.progression = new ProgressionSystem(() => this.onLevelUp());

    // Enemy manager with gem drop callback
    this.enemyManager = new EnemyManager(this, (x, y) => {
      const xpValue = this.rollGemTier();
      this.gemPool.spawn(x, y, xpValue);
      this.progression.addKill();
    });

    this.cameras.main.startFollow(this.player);
    this.cameras.main.roundPixels = true;

    this.landscape = new Landscape(
      this,
      0,
      0,
      this.scale.width,
      this.scale.height
    );

    this.inputSystem = new InputSystem(this);
    this.enemyManager.initializeSpawner();

    // Gems
    this.gemPool = new XpGemPool(this);

    // UI
    this.hud = new GameHud(this);
    this.upgradePicker = new UpgradePicker(this);
    this.gameOverScreen = new GameOverScreen(this);

    // Pause on ESC
    this.input.keyboard!.on('keydown-ESC', () => {
      if (this.gameOver) return;
      if (this.upgradePicker.isVisible()) return;
      this.togglePause();
    });

    this.events.once('shutdown', () => {
      this.enemyManager.destroy();
      this.gemPool.destroy();
      this.hud.destroy();
    });
  }

  update(_time: number, delta: number): void {
    if (this.gameOver) return;
    if (this.paused) return;

    // Progression timer + difficulty
    this.progression.update(delta);
    this.enemyManager.updateSpawnRate(this.progression.spawnDelayMultiplier);

    const move = this.inputSystem.getMoveIntent();
    this.player.update(move);

    this.enemyManager.updateEnemies(this.player.x, this.player.y);

    // Enemy contact damage
    this.handleContactDamage();

    // Check player death
    if (this.player.isDead()) {
      this.handleGameOver();
      return;
    }

    // Auto-fire
    const enemies = this.enemyManager.getEnemies();
    if (this.player.weaponManager.hasReadyWeapon(this.time.now)) {
      const nearest = getNearestEnemy(
        this.player.x,
        this.player.y,
        enemies,
        AUTO_FIRE_RANGE
      );

      if (nearest?.active && nearest?.visible) {
        this.player.weaponManager.tryAttack(nearest, this.player, enemies);
      }
    }

    this.player.weaponManager.updateAttack(this.player, enemies);

    // Gem collection
    const pickupRadius = XP_GEM_PICKUP_RADIUS * this.player.pickupRadiusMultiplier;
    const collectedXp = this.gemPool.update(this.player.x, this.player.y, pickupRadius);
    if (collectedXp > 0) {
      this.progression.addXp(collectedXp);
    }

    // HUD
    this.hud.update(this.progression, this.player);

    this.landscape.update(this.cameras.main);
  }

  private handleContactDamage(): void {
    if (this.time.now - this.lastContactDamageTime < ENEMY_CONTACT_COOLDOWN_MS) return;

    const enemies = this.enemyManager.getEnemies();
    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;

    for (const enemy of enemies) {
      if (!enemy.active || !enemy.visible) continue;
      const enemyBody = enemy.body as Phaser.Physics.Arcade.Body;
      if (!enemyBody) continue;

      const dx = this.player.x - enemy.x;
      const dy = this.player.y - enemy.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const touchDist = (playerBody.halfWidth + enemyBody.halfWidth) * 0.8;

      if (dist < touchDist) {
        const scaledDamage = Math.round(
          ENEMY_CONTACT_DAMAGE * this.progression.hpMultiplier
        );
        this.player.takeDamage(scaledDamage);
        this.lastContactDamageTime = this.time.now;

        // Flash player red
        this.player.setTint(0xff4444);
        this.time.delayedCall(150, () => this.player.clearTint());
        break;
      }
    }
  }

  private togglePause(): void {
    if (this.paused) {
      this.paused = false;
      this.physics.resume();
      this.enemyManager.resumeSpawning();
      for (const el of this.pauseOverlay) el.destroy();
      this.pauseOverlay.length = 0;
    } else {
      this.paused = true;
      this.physics.pause();
      this.enemyManager.pauseSpawning();

      const cx = this.scale.width / 2;
      const cy = this.scale.height / 2;

      const bg = this.add
        .rectangle(cx, cy, this.scale.width, this.scale.height, 0x000000, 0.5)
        .setScrollFactor(0)
        .setDepth(250);

      const text = this.add
        .text(cx, cy, 'PAUSED', {
          fontFamily: 'monospace',
          fontSize: '40px',
          color: '#ffffff',
          stroke: '#000',
          strokeThickness: 4,
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(251);

      this.pauseOverlay.push(bg, text);
    }
  }

  private onLevelUp(): void {
    this.paused = true;
    this.physics.pause();
    this.enemyManager.pauseSpawning();
    this.upgradePicker.show(this.player, () => {
      this.paused = false;
      this.physics.resume();
      this.enemyManager.resumeSpawning();
    });
  }

  /**
   * Roll gem XP tier based on elapsed time.
   * Early game: mostly green (1 XP). Over time blue (2) and red (5) appear more.
   */
  private rollGemTier(): number {
    const minutes = this.progression.elapsedMs / 60_000;

    // Green chance starts at 95%, decays to ~40% by minute 15
    // Blue chance starts at 4%, grows to ~35%
    // Red chance starts at 1%, grows to ~25%
    const greenChance = Math.max(0.4, 0.95 - minutes * 0.037);
    const redChance = Math.min(0.25, 0.01 + minutes * 0.016);
    const blueChance = 1 - greenChance - redChance;

    const roll = Math.random();
    if (roll < greenChance) return 1;
    if (roll < greenChance + blueChance) return 2;
    return 5;
  }

  private handleGameOver(): void {
    this.gameOver = true;
    this.physics.pause();
    this.player.setVelocity(0, 0);
    this.player.releaseObjectWithAnimation(undefined, () => {
      this.gameOverScreen.show(this.progression);
    });
  }
}
