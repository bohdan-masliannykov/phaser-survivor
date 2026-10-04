import { PROJECTILE_HIT_RADIUS } from '@constants';
import type { Enemy } from '@entities/enemies/enemy';
import type { Player } from '@entities/player/player';
import { Projectile, type ProjectileDef } from '@entities/projectiles/projectile';
import { Weapon } from './weapon';

export interface ProjectileWeaponStats {
  minDamage: number;
  maxDamage: number;
  cooldownMs: number;
  projectileCount?: number;
  basePierce?: number;
}

/**
 * A weapon that fires projectiles. Subclasses decide where to aim in `attack`;
 * flight, hits, pierce and expiry are handled here.
 */
export abstract class ProjectileWeapon extends Weapon {
  protected projectiles: Projectile[] = [];
  protected basePierce: number;
  private readonly projectileDef: ProjectileDef;

  constructor(stats: ProjectileWeaponStats, projectileDef: ProjectileDef) {
    super();
    this.minDamage = stats.minDamage;
    this.maxDamage = stats.maxDamage;
    this.cooldownMs = stats.cooldownMs;
    this.projectileCount = stats.projectileCount ?? 1;
    this.basePierce = stats.basePierce ?? 1;
    this.projectileDef = projectileDef;
  }

  addProjectile(): void {
    this.projectileCount++;
  }

  addPierce(): void {
    this.basePierce++;
  }

  protected fire(player: Player, direction: { x: number; y: number }): void {
    this.projectiles.push(
      new Projectile(
        player.scene,
        player.x,
        player.y,
        direction,
        this.projectileDef,
        this.basePierce
      )
    );
  }

  updateAttack(_: Player, enemies: Enemy[]): void {
    const hitR2 = PROJECTILE_HIT_RADIUS * PROJECTILE_HIT_RADIUS;

    for (let pIndex = this.projectiles.length - 1; pIndex >= 0; pIndex--) {
      const p = this.projectiles[pIndex];

      if (p.isExpired()) {
        p.destroy();
        this.projectiles.splice(pIndex, 1);
        continue;
      }

      for (let eIndex = enemies.length - 1; eIndex >= 0; eIndex--) {
        const e = enemies[eIndex];
        if (e.isDead() || p.hitEnemies.has(e.id)) continue;

        const dx = e.x - p.x;
        const dy = e.y - p.y;

        if (dx * dx + dy * dy <= hitR2) {
          p.hitEnemies.add(e.id);
          e.receiveDamage(this.getDamage(), p.x, p.y, 10);

          p.onEnemyHit();
          if (!p.isAlive()) {
            this.projectiles.splice(pIndex, 1);
          }
          break;
        }
      }
    }
  }
}
