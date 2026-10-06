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

import type { ENEMY } from '@constants';
import type { Enemy } from '@entities/enemies/enemy';
import { EnemyFactory } from '@entities/enemies/enemy-factory';
import type { GameScene } from '@scenes/game-scene';

export interface PoolConfig {
  initialSize: number;
  maxSize: number;
  enemyTypes: (keyof typeof ENEMY)[];
  onEnemyDeath?: (x: number, y: number, enemyType: string) => void;
}

export interface EnemyScaling {
  hpMultiplier: number;
  speedMultiplier: number;
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

  // Enemies playing their death animation: no longer in play, not yet reusable
  private dyingEnemies: Set<Enemy> = new Set();
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
  }

  /**
   * Pre-create all enemies and add them to the pool
   */
  private initializePool(): void {
    for (let i = 0; i < this.poolConfig.initialSize; i++) {
      // Randomly distribute among enemy types
      const randomType =
        this.poolConfig.enemyTypes[Math.floor(Math.random() * this.poolConfig.enemyTypes.length)];

      // Create enemy at dummy position (0, 0) - will be moved when activated
      const enemy = EnemyFactory.createEnemyByType(this.scene, 0, 0, randomType);

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
  public acquire(
    x: number,
    y: number,
    preferredType?: keyof typeof ENEMY,
    scaling?: EnemyScaling
  ): Enemy | null {
    let enemy: Enemy;

    // Find a matching type in the pool, or fall back to any available
    const matchIdx = preferredType
      ? this.availableEnemies.findIndex((e) => e.texture.key === preferredType)
      : -1;

    if (matchIdx >= 0) {
      enemy = this.availableEnemies.splice(matchIdx, 1)[0];
    } else if (this.allEnemies.length < this.poolConfig.maxSize) {
      const type =
        preferredType ??
        this.poolConfig.enemyTypes[Math.floor(Math.random() * this.poolConfig.enemyTypes.length)];

      enemy = EnemyFactory.createEnemyByType(this.scene, x, y, type);
      this.allEnemies.push(enemy);
      this.enemiesGroup.add(enemy);

      console.warn(`⚠️ Pool expanded! Now at ${this.allEnemies.length}/${this.poolConfig.maxSize}`);
    } else {
      return null;
    }

    enemy.restore(x, y, scaling?.hpMultiplier, scaling?.speedMultiplier);
    this.activeEnemies.add(enemy);
    this.activeCacheDirty = true;
    enemy.onDying = () => {
      this.activeEnemies.delete(enemy);
      this.dyingEnemies.add(enemy);
      this.activeCacheDirty = true;
    };
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
    const wasActive = this.activeEnemies.delete(enemy);
    const wasDying = this.dyingEnemies.delete(enemy);
    if (!wasActive && !wasDying) {
      return; // Already released
    }

    this.activeCacheDirty = true;

    enemy.deactivate();

    // Add back to available pool
    this.availableEnemies.push(enemy);
  }

  /**
   * Get all living enemies (excludes those playing their death animation)
   */
  public getActive(): Enemy[] {
    if (this.activeCacheDirty) {
      this.activeCache = Array.from(this.activeEnemies);
      this.activeCacheDirty = false;
    }
    return this.activeCache;
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
    this.dyingEnemies.clear();
    this.activeCache.length = 0;
    this.activeCacheDirty = false;
    this.availableEnemies.length = 0;
    for (const enemy of this.allEnemies) {
      enemy.destroy();
    }
    this.allEnemies.length = 0;
    this.enemiesGroup.destroy();
  }
}
