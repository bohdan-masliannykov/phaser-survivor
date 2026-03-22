import type { Enemy } from '@entities/enemies/enemy';
import type { Weapon } from './weapon';
import type { Player } from '@entities/player/player';

export class WeaponManager {
  private weapons: Map<string, Weapon> = new Map();

  addWeapon(name: string, weapon: Weapon): void {
    this.weapons.set(name, weapon);
  }

  getWeapon(name: string): Weapon | undefined {
    return this.weapons.get(name);
  }

  hasReadyWeapon(currentTime: number): boolean {
    for (const weapon of this.weapons.values()) {
      if (weapon.isOffCooldown(currentTime)) return true;
    }
    return false;
  }

  tryAttack(nearestEnemy: Enemy | undefined, player: Player): void {
    if (!nearestEnemy) return;
    this.weapons.forEach((weapon) => {
      weapon.attack(nearestEnemy, player);
    });
  }

  updateAttack(player: Player, enemies: Enemy[]): void {
    this.weapons.forEach((weapon) => {
      weapon.updateAttack(player, enemies);
    });
  }
}
