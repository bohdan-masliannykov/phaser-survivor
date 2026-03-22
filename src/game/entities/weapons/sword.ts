import type { Enemy } from '@entities/enemies/enemy';
import { Weapon } from './weapon';
import type { Player } from '@entities/player/player';

//TODO finish sword attack logic
export class Sword extends Weapon {
  constructor() {
    super();
    this.minDamage = 8;
    this.maxDamage = 15;
    this.cooldownMs = 400;
  }

  attack(_target: Enemy, _player: Player): void {}

  updateAttack(_player: Player, _enemies: Enemy[]): void {
    // Sword does not have a continuous attack effect to update
  }
}
