import { Player } from '@entities/player/player';
import { Landscape } from '@entities/environment/landscape';
import { InputSystem } from '@system/input-system';
import { PlayerFactory } from '@entities/player/player-factory';
import { EnemyManager } from '@entities/enemies/enemy-manager';
import { getNearestEnemy } from '@entities/utils/pathfinding';
import type { PLAYER } from '@constants';

export class GameScene extends Phaser.Scene {
  inputSystem!: InputSystem;
  player!: Player;
  enemyManager!: EnemyManager;
  landscape!: Landscape;

  constructor() {
    super({ key: 'GameScene' });
  }

  init(data: { characterType: keyof typeof PLAYER }) {
    this.player = PlayerFactory.createPlayer(
      this,
      this.scale.width / 2,
      this.scale.height / 2,
      data.characterType
    );
  }

  create() {
    this.enemyManager = new EnemyManager(this);
    this.cameras.main.startFollow(this.player);
    // Helps avoid 1px seams with pixel-art tiles when camera scrolls at sub-pixel values.
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

    this.events.once('shutdown', () => {
      this.enemyManager.destroy();
    });
  }

  update(): void {
    const move = this.inputSystem.getMoveIntent();

    this.player.update(move);
    this.enemyManager.updateEnemies(this.player.x, this.player.y);

    // Auto-fire: only scan for nearest enemy when a weapon is off cooldown
    const enemies = this.enemyManager.getEnemies();
    if (this.player.weaponManager.hasReadyWeapon(this.time.now)) {
      const nearest = getNearestEnemy(
        this.player.x,
        this.player.y,
        enemies,
        600
      );

      if (nearest?.active && nearest?.visible) {
        this.player.weaponManager.tryAttack(nearest, this.player);
      }
    }

    this.player.weaponManager.updateAttack(this.player, enemies);
    this.landscape.update(this.cameras.main);
  }
}
