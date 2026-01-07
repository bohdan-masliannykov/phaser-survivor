import { ENEMY } from '@constants';
import { Orc } from './orc';
import { Slime } from './slime';
import { Skeleton } from './skeleton';
import type { Enemy } from './enemy';

export class EnemyFactory {
  static createRandomEnemy(scene: Phaser.Scene, x: number, y: number): Enemy {
    const enemyTypes = Object.keys(ENEMY) as (keyof typeof ENEMY)[];
    const randomType =
      enemyTypes[Math.floor(Math.random() * enemyTypes.length)];

    switch (randomType) {
      case ENEMY.orc.key:
        return new Orc(scene, x, y);
      case ENEMY.slime.key:
        return new Slime(scene, x, y);
      case ENEMY.skeleton.key:
        return new Skeleton(scene, x, y);
      default:
        throw new Error(`Unknown enemy type: ${randomType}`);
    }
  }
}
