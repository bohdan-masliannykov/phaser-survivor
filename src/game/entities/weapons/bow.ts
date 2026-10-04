import type { Enemy } from '@entities/enemies/enemy';
import type { Player } from '@entities/player/player';
import { PROJECTILES } from '@entities/projectiles/projectile';
import { gameClock } from '@system/game-clock';
import { ProjectileWeapon, type ProjectileWeaponStats } from './projectile-weapon';

export class Bow extends ProjectileWeapon {
  constructor(stats: ProjectileWeaponStats) {
    super(stats, PROJECTILES.arrow);
  }

  attack(nearestEnemy: Enemy, player: Player): void {
    if (!this.isOffCooldown(gameClock.now)) {
      return;
    }
    this.updateCooldown(gameClock.now);

    const numProjectiles = this.projectileCount;
    if (numProjectiles === 1) {
      const dx = nearestEnemy.x - player.x;
      const dy = nearestEnemy.y - player.y;
      const length = Math.sqrt(dx * dx + dy * dy) || 1;
      this.fire(player, { x: dx / length, y: dy / length });
    } else {
      // Spread shot
      const minSpread = Phaser.Math.DegToRad(15);
      const maxSpread = Phaser.Math.DegToRad(35);
      const totalSpread = Phaser.Math.Linear(minSpread, maxSpread, (numProjectiles - 1) / (5 - 1));
      const baseAngle = Math.atan2(nearestEnemy.y - player.y, nearestEnemy.x - player.x);
      const startAngle = baseAngle - totalSpread / 2;
      const angleStep = totalSpread / (numProjectiles - 1);

      for (let i = 0; i < numProjectiles; i++) {
        const angle = startAngle + i * angleStep;
        this.fire(player, { x: Math.cos(angle), y: Math.sin(angle) });
      }
    }
  }
}
