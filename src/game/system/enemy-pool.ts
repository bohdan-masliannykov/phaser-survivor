/**
 * Object Pool for Enemies
 *
 * Instead of creating and destroying enemies constantly (expensive),
 * we pre-create a pool of enemies and reuse them by:
 * - Setting position
 * - Making them active/visible
 *
 * When enemies die or leave the map:
 * - We deactivate them (not destroy)
 * - Reset their state
 * - Return them to the pool for reuse
 *
 * This dramatically improves performance for 1000+ enemies
 */

import type { Enemy } from '@entities/enemies/enemy';
import { EnemyFactory } from '@entities/enemies/enemy-factory';
import type { GameScene } from '@scenes/game-scene';
import type { ENEMY } from '@constants';

export interface PoolConfig {
  initialSize: number;
  maxSize: number;
  enemyTypes: (keyof typeof ENEMY)[];
  onEnemyDeath?: (x: number, y: number, enemyType: string) => void;
}

export class EnemyPool {
  private scene: GameScene;
  private poolConfig: PoolConfig;

  // All pooled enemies (active and inactive)
  private allEnemies: Enemy[] = [];

  // Available enemies ready to spawn (inactive)
  private availableEnemies: Enemy[] = [];

  // Currently active enemies in the game
  private activeEnemies: Set<Enemy> = new Set();
  private activeCache: Enemy[] = [];
  private activeCacheDirty: boolean = false;

  // Physics group for collision detection
  private enemiesGroup: Phaser.Physics.Arcade.Group;

  constructor(scene: GameScene, config: PoolConfig) {
    this.scene = scene;
    this.poolConfig = config;
    this.enemiesGroup = this.scene.physics.add.group();

    // Initialize the pool by pre-creating enemies
    this.initializePool();

    console.log(
      `🎮 Enemy Pool initialized: ${this.allEnemies.length} enemies pre-created`
    );
  }

  /**
   * Pre-create all enemies and add them to the pool
   */
  private initializePool(): void {
    for (let i = 0; i < this.poolConfig.initialSize; i++) {
      // Randomly distribute among enemy types
      const randomType =
        this.poolConfig.enemyTypes[
          Math.floor(Math.random() * this.poolConfig.enemyTypes.length)
        ];

      // Create enemy at dummy position (0, 0) - will be moved when activated
      const enemy = EnemyFactory.createEnemyByType(
        this.scene,
        0,
        0,
        randomType
      );

      // Start as inactive
      enemy.startInactive();

      this.allEnemies.push(enemy);
      this.availableEnemies.push(enemy);
      this.enemiesGroup.add(enemy);
    }
  }

  /**
   * Get an enemy from the pool and activate it at a specific position
   * Returns null if pool is exhausted
   */
  public acquire(x: number, y: number): Enemy | null {
    // If no available enemies, we could:
    // 1. Create new ones (but limit by maxSize)
    // 2. Recycle oldest active enemy
    // 3. Return null (don't spawn)

    let enemy: Enemy;

    if (this.availableEnemies.length > 0) {
      enemy = this.availableEnemies.pop()!;
      enemy.restore(x, y);
    } else if (this.allEnemies.length < this.poolConfig.maxSize) {
      const randomType =
        this.poolConfig.enemyTypes[
          Math.floor(Math.random() * this.poolConfig.enemyTypes.length)
        ];

      enemy = EnemyFactory.createEnemyByType(this.scene, x, y, randomType);
      this.allEnemies.push(enemy);
      this.enemiesGroup.add(enemy);

      console.warn(
        `⚠️ Pool expanded! Now at ${this.allEnemies.length}/${this.poolConfig.maxSize}`
      );
    } else {
      return null;
    }

    this.activeEnemies.add(enemy);
    this.activeCacheDirty = true;
    enemy.onDeath = () => {
      this.poolConfig.onEnemyDeath?.(enemy.x, enemy.y, enemy.texture.key);
      this.release(enemy);
    };
    return enemy;
  }

  /**
   * Return an enemy to the pool (when it dies or leaves the map)
   */
  public release(enemy: Enemy): void {
    if (!this.activeEnemies.has(enemy)) {
      return; // Already released
    }

    this.activeEnemies.delete(enemy);
    this.activeCacheDirty = true;

    enemy.deactivate();

    // Add back to available pool
    this.availableEnemies.push(enemy);
  }

  /**
   * Release all active enemies back to pool
   */
  public releaseAll(): void {
    const activeList = Array.from(this.activeEnemies);
    activeList.forEach((enemy) => this.release(enemy));
  }

  /**
   * Get all currently active enemies
   */
  public getActive(): Enemy[] {
    if (this.activeCacheDirty) {
      this.activeCache = Array.from(this.activeEnemies);
      this.activeCacheDirty = false;
    }
    return this.activeCache;
  }

  /**
   * Get active enemy count
   */
  public getActiveCount(): number {
    return this.activeEnemies.size;
  }

  /**
   * Get available enemy count (waiting to be spawned)
   */
  public getAvailableCount(): number {
    return this.availableEnemies.length;
  }

  /**
   * Get pool status for debugging
   */
  public getPoolStats(): {
    total: number;
    active: number;
    available: number;
    utilization: string;
  } {
    return {
      total: this.allEnemies.length,
      active: this.activeEnemies.size,
      available: this.availableEnemies.length,
      utilization: `${(
        (this.activeEnemies.size / this.allEnemies.length) *
        100
      ).toFixed(1)}%`,
    };
  }

  /**
   * Get the physics group for collision setup
   */
  public getPhysicsGroup(): Phaser.Physics.Arcade.Group {
    return this.enemiesGroup;
  }

  /**
   * Clean up the pool
   */
  public destroy(): void {
    this.activeEnemies.clear();
    this.activeCache.length = 0;
    this.activeCacheDirty = false;
    this.availableEnemies.length = 0;
    this.allEnemies.forEach((enemy) => enemy.destroy());
    this.allEnemies.length = 0;
    this.enemiesGroup.destroy();
  }
}
