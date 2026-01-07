import type { Enemy } from '@entities/enemies/enemy';
import type { Weapon } from './weapon';
import type { Player } from '@entities/player/player';
import type { EnemyManager } from '@entities/enemies/enemy-manager';

export class WeaponManager {
  private weapons: Map<string, Weapon> = new Map();

  constructor() {}

  addWeapon(name: string, weapon: Weapon): void {
    this.weapons.set(name, weapon);
    console.log('Added weapon:', name);
  }

  getWeapon(name: string): Weapon | undefined {
    return this.weapons.get(name);
  }

  tryAttack(nearestEnemy: Enemy | undefined, player: Player): void {
    if (!nearestEnemy) return;
    this.weapons.forEach((weapon) => {
      weapon.attack(nearestEnemy, player);
    });
  }

  updateAttack(
    delta: number,
    player: Player,
    enemyManager: EnemyManager
  ): void {
    this.weapons.forEach((weapon) => {
      weapon.updateAttack(delta, player, enemyManager);
    });
  }
}
