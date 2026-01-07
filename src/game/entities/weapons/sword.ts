import type { Enemy } from '@entities/enemies/enemy';
import { Weapon } from './weapon';
import type { Player } from '@entities/player/player';
import type { EnemyManager } from '@entities/enemies/enemy-manager';

//TODO finish sword attack logic
export class Sword extends Weapon {
  constructor() {
    super();
    this.minDamage = 8;
    this.maxDamage = 15;
    this.cooldownMs = 400;
  }

  attack(target: Enemy, player: Player): void {}

  updateAttack(
    delta: number,
    player: Player,
    enemyManager: EnemyManager
  ): void {
    // Sword does not have a continuous attack effect to update
  }
}
