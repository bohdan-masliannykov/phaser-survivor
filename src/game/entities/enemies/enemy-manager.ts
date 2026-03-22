import { ENEMY_SPAWN_INTERVAL_MS, SPAWN_MARGIN, ENEMY } from '@constants';
import type { Enemy } from './enemy';
import { EnemyPool } from '@system/enemy-pool';
import type { GameScene } from '@scenes/game-scene';

export class EnemyManager {
  declare scene: GameScene;

  private enemyPool: EnemyPool;
  private spawnTimer: Phaser.Time.TimerEvent | null = null;

  constructor(scene: GameScene) {
    this.scene = scene;

    // Initialize the object pool with configuration
    this.enemyPool = new EnemyPool(scene, {
      initialSize: 50, // Start with 100 pre-created enemies
      maxSize: 1000, // Max 1000 active enemies at once
      enemyTypes: [ENEMY.slime.key, ENEMY.skeleton.key, ENEMY.orc.key],
    });

    console.log(
      '🛠️ Enemy Manager initialized with pooling system',
      this.enemyPool.getPoolStats()
    );
  }

  initializeSpawner() {
    this.spawnTimer = this.scene.time.addEvent({
      delay: ENEMY_SPAWN_INTERVAL_MS,
      loop: true,
      callback: () => {
        const enemy = this.spawnEnemy();
        if (!enemy) {
          console.warn('⚠️ Failed to spawn enemy - pool exhausted');
        }
      },
    });

    // Set up collisions with the physics group from the pool
    const enemiesGroup = this.enemyPool.getPhysicsGroup();
    this.scene.physics.add.collider(enemiesGroup, enemiesGroup);
    this.scene.physics.add.collider(enemiesGroup, this.scene.player);
  }

  /**
   * Spawn an enemy using the pool system
   */
  private spawnEnemy(): Enemy | null {
    // Get camera view to spawn outside screen
    const view = this.scene.cameras.main.worldView;
    const left = view.x;
    const top = view.y;
    const right = view.x + view.width;
    const bottom = view.y + view.height;

    // Spawn a bit outside the visible rectangle so enemies walk into view.
    const margin = SPAWN_MARGIN;
    const side = Phaser.Math.Between(0, 3);

    let x: number;
    let y: number;

    switch (side) {
      case 0: // top
        x = Phaser.Math.FloatBetween(left, right);
        y = top - margin;
        break;
      case 1: // right
        x = right + margin;
        y = Phaser.Math.FloatBetween(top, bottom);
        break;
      case 2: // bottom
        x = Phaser.Math.FloatBetween(left, right);
        y = bottom + margin;
        break;
      default: // left
        x = left - margin;
        y = Phaser.Math.FloatBetween(top, bottom);
        break;
    }

    // Acquire an enemy from the pool
    return this.enemyPool.acquire(x, y);
  }

  /**
   * Get all currently active enemies
   */
  getEnemies(): Enemy[] {
    return this.enemyPool.getActive();
  }

  /**
   * Update all active enemies
   */
  updateEnemies(playerX: number, playerY: number): void {
    this.getEnemies().forEach((enemy) => enemy.update(playerX, playerY));
  }

  /**
   * Remove an enemy (return it to the pool)
   */
  removeEnemy(enemy: Enemy): void {
    this.enemyPool.release(enemy);
  }

  /**
   * Get pool statistics for debugging
   */
  getPoolStats() {
    return this.enemyPool.getPoolStats();
  }

  /**
   * Clean up the manager
   */
  destroy(): void {
    if (this.spawnTimer) {
      this.spawnTimer.destroy();
    }
    this.enemyPool.destroy();
  }
}
