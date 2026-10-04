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

import { DEFAULT_ENEMY, ENEMY, type EnemyKey } from '@constants';
import { Enemy } from '@entities/enemies/enemy';
import type { GameScene } from '@scenes/game-scene';
import { GameEvents } from './game-events';

export interface PoolConfig {
  initialSize: number;
  maxSize: number;
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
      // Created off-screen as a placeholder type; `restore` sets the real one on spawn
      const enemy = new Enemy(this.scene, 0, 0, ENEMY[DEFAULT_ENEMY]);

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
  public acquire(x: number, y: number, type: EnemyKey, scaling?: EnemyScaling): Enemy | null {
    let enemy = this.availableEnemies.pop();

    if (!enemy) {
      if (this.allEnemies.length >= this.poolConfig.maxSize) return null;

      enemy = new Enemy(this.scene, x, y, ENEMY[type]);
      this.allEnemies.push(enemy);
      this.enemiesGroup.add(enemy);
    }

    enemy.restore(x, y, ENEMY[type], scaling?.hpMultiplier, scaling?.speedMultiplier);
    this.activeEnemies.add(enemy);
    this.activeCacheDirty = true;
    enemy.onDying = () => {
      this.activeEnemies.delete(enemy);
      this.dyingEnemies.add(enemy);
      this.activeCacheDirty = true;
    };
    enemy.onDeath = () => {
      this.scene.events.emit(GameEvents.ENEMY_DIED, enemy.x, enemy.y, enemy.texture.key);
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
