import { ENEMY, type EnemyKey } from '@constants';
import type { Enemy } from './enemy';
import { Orc } from './orc';
import { Skeleton } from './skeleton';
import { Slime } from './slime';

export class EnemyFactory {
  static createEnemyByType(scene: Phaser.Scene, x: number, y: number, type: EnemyKey): Enemy {
    switch (type) {
      case ENEMY.orc.key:
        return new Orc(scene, x, y);
      case ENEMY.slime.key:
        return new Slime(scene, x, y);
      case ENEMY.skeleton.key:
        return new Skeleton(scene, x, y);
      default:
        throw new Error(`Unknown enemy type: ${type}`);
    }
  }
}
