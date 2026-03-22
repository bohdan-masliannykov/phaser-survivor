import type { Enemy } from '@entities/enemies/enemy';
import type { Player } from '@entities/player/player';

export abstract class Weapon {
  protected minDamage: number = 5;
  protected maxDamage: number = 10;
  protected cooldownMs: number = 500;
  protected _lastAttackTime: number = 0;
  protected projectileCount: number = 1;

  constructor() {}

  getDamage(): number {
    return Phaser.Math.Between(this.minDamage, this.maxDamage);
  }

  updateCooldown(currentTime: number): void {
    this._lastAttackTime = currentTime;
  }

  isOffCooldown(currentTime: number): boolean {
    return currentTime - this._lastAttackTime >= this.cooldownMs;
  }

  scaleDamage(multiplier: number): void {
    this.minDamage = Math.round(this.minDamage * multiplier);
    this.maxDamage = Math.round(this.maxDamage * multiplier);
  }

  reduceCooldown(multiplier: number): void {
    this.cooldownMs = Math.round(this.cooldownMs * multiplier);
  }

  abstract attack(target: Enemy, player: Player): void;
  abstract updateAttack(player: Player, enemies: Enemy[]): void;
}
