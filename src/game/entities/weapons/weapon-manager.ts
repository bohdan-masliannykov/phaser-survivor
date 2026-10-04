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

  getAllWeapons(): Weapon[] {
    return Array.from(this.weapons.values());
  }

  hasReadyWeapon(currentTime: number): boolean {
    for (const weapon of this.weapons.values()) {
      if (weapon.isOffCooldown(currentTime)) return true;
    }
    return false;
  }

  tryAttack(nearestEnemy: Enemy | undefined, player: Player, allEnemies?: Enemy[]): void {
    if (!nearestEnemy) return;
    this.weapons.forEach((weapon) => {
      weapon.attack(nearestEnemy, player, allEnemies);
    });
  }

  updateAttack(player: Player, enemies: Enemy[]): void {
    this.weapons.forEach((weapon) => {
      weapon.updateAttack(player, enemies);
    });
  }
}
