import { Player } from '@entities/player/player';
import { Landscape } from '@entities/environment/landscape';
import { InputSystem } from '@system/input-system';
import { Projectile } from '@entities/projectiles/projectile';
import { PlayerFactory } from '@entities/player/player-factory';
import { EnemyManager } from '@entities/enemies/enemy-manager';
import { getNearestEnemy } from '@entities/utils/pathfinding';
import type { PLAYER } from '@constants';

export class GameScene extends Phaser.Scene {
  inputSystem!: InputSystem;
  player!: Player;
  enemyManager!: EnemyManager;
  projectiles: Projectile[] = [];
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
    this.cameras.main.startFollow(this.player); // Camera follow moves the *view* (camera), not the world
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

    // Auto-fire: shoot toward the nearest enemy on an interval.
    this.time.addEvent({
      delay: 50,
      loop: true,
      callback: () => {
        const nearestEnemy = getNearestEnemy(
          this.player.x,
          this.player.y,
          this.enemyManager.getEnemies()
        );
        if (nearestEnemy) {
          this.player.weaponManager.tryAttack(nearestEnemy, this.player);
        }
      },
    });

    this.enemyManager.initializeSpawner();
  }

  update(_time: number, delta: number): void {
    const move = this.inputSystem.getMoveIntent();

    this.player.update(move, delta);
    this.enemyManager.updateEnemies(this.player.x, this.player.y, delta);
    this.player.weaponManager.updateAttack(
      delta,
      this.player,
      this.enemyManager
    );

    this.landscape.update(this.cameras.main);
  }
}
