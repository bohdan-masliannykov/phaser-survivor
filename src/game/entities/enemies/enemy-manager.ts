import { ENEMY_SPAWN_INTERVAL_MS, SPAWN_MARGIN, ENEMY } from '@constants';
import type { Enemy } from './enemy';
import { EnemyPool } from '@system/enemy-pool';
import type { GameScene } from '@scenes/game-scene';

export class EnemyManager {
  declare scene: GameScene;

  private enemyPool: EnemyPool;
  private spawnTimer: Phaser.Time.TimerEvent | null = null;
  onEnemyDeath?: (x: number, y: number, enemyType: string) => void;

  constructor(
    scene: GameScene,
    onEnemyDeath?: (x: number, y: number, enemyType: string) => void
  ) {
    this.scene = scene;
    this.onEnemyDeath = onEnemyDeath;

    this.enemyPool = new EnemyPool(scene, {
      initialSize: 50,
      maxSize: 1000,
      enemyTypes: Object.keys(ENEMY) as (keyof typeof ENEMY)[],
      onEnemyDeath,
    });
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

    // Enemy-enemy collisions for separation, no player collider — enemies overlap player
    const enemiesGroup = this.enemyPool.getPhysicsGroup();
    this.scene.physics.add.collider(enemiesGroup, enemiesGroup);
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

    // Roll enemy type based on elapsed time
    const type = this.rollEnemyType();
    return this.enemyPool.acquire(x, y, type);
  }

  /**
   * Weighted enemy type selection based on elapsed time.
   * Min 0-1: 100% slimes
   * Min 1-3: skeletons start appearing (~10%)
   * Min 3+: orcs start appearing, skeletons increase, slimes decrease
   */
  private rollEnemyType(): keyof typeof ENEMY {
    const minutes = this.scene.progression.elapsedMs / 60_000;

    if (minutes < 1) return 'slime';

    const skeletonChance = Math.min(0.35, (minutes - 1) * 0.05);
    const orcChance = minutes < 3 ? 0 : Math.min(0.25, (minutes - 3) * 0.03);
    const slimeChance = 1 - skeletonChance - orcChance;

    const roll = Math.random();
    if (roll < slimeChance) return 'slime';
    if (roll < slimeChance + skeletonChance) return 'skeleton';
    return 'orc';
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
    const enemies = this.getEnemies();
    for (const enemy of enemies) {
      enemy.update(playerX, playerY, enemies);
    }
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

  pauseSpawning(): void {
    if (this.spawnTimer) this.spawnTimer.paused = true;
  }

  resumeSpawning(): void {
    if (this.spawnTimer) this.spawnTimer.paused = false;
  }

  updateSpawnRate(multiplier: number): void {
    if (!this.spawnTimer) return;
    const newDelay = Math.max(200, Math.round(ENEMY_SPAWN_INTERVAL_MS * multiplier));
    if (newDelay !== this.spawnTimer.delay) {
      this.spawnTimer.destroy();
      this.spawnTimer = this.scene.time.addEvent({
        delay: newDelay,
        loop: true,
        callback: () => {
          this.spawnEnemy();
        },
      });
    }
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
