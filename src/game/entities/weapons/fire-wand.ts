import type { Enemy } from '@entities/enemies/enemy';
import { Weapon } from './weapon';
import { Fireball } from '@entities/projectiles/fireball';
import type { Player } from '@entities/player/player';
import { PROJECTILE_HIT_RADIUS, AUTO_FIRE_RANGE } from '@constants';

interface FireWandStats {
  minDamage: number;
  maxDamage: number;
  cooldownMs: number;
  projectileCount?: number;
  basePierce?: number;
}

export class FireWand extends Weapon {
  projectiles: Fireball[] = [];
  basePierce: number = 1;

  constructor(stats?: FireWandStats) {
    super();
    if (stats) {
      this.minDamage = stats.minDamage;
      this.maxDamage = stats.maxDamage;
      this.cooldownMs = stats.cooldownMs;
      this.projectileCount = stats.projectileCount ?? 1;
      this.basePierce = stats.basePierce ?? 1;
    } else {
      // Defaults
      this.projectileCount = 1;
      this.minDamage = 6;
      this.maxDamage = 12;
      this.cooldownMs = 500;
      this.basePierce = 1;
    }
  }

  addProjectile(): void {
    this.projectileCount++;
  }

  addPierce(): void {
    this.basePierce++;
  }

  attack(nearestEnemy: Enemy, player: Player, allEnemies?: Enemy[]): void {
    if (!this.isOffCooldown(player.scene.time.now)) {
      return;
    }
    this.updateCooldown(player.scene.time.now);

    // Sort enemies by distance and pick unique targets for each projectile
    const targets = this.pickTargets(player, nearestEnemy, allEnemies ?? []);

    for (const target of targets) {
      const dx = target.x - player.x;
      const dy = target.y - player.y;
      const length = Math.sqrt(dx * dx + dy * dy) || 1;
      const velocity = { x: dx / length, y: dy / length };
      this.projectiles.push(
        new Fireball(target.scene, player.x, player.y, velocity, this.basePierce)
      );
    }
  }

  /**
   * Pick up to projectileCount different targets.
   * If fewer enemies than projectiles, remaining fire in random directions.
   */
  private pickTargets(
    player: Player,
    nearest: Enemy,
    allEnemies: Enemy[]
  ): { x: number; y: number; scene: Phaser.Scene }[] {
    const maxRange = AUTO_FIRE_RANGE;
    const targets: { x: number; y: number; scene: Phaser.Scene }[] = [];

    if (this.projectileCount === 1) {
      targets.push(nearest);
      return targets;
    }

    // Sort by distance, pick closest N unique enemies
    const sorted = allEnemies
      .filter((e) => e.active && e.visible && !e.isDead())
      .map((e) => {
        const dx = e.x - player.x;
        const dy = e.y - player.y;
        return { enemy: e, dist2: dx * dx + dy * dy };
      })
      .filter((e) => e.dist2 <= maxRange * maxRange)
      .sort((a, b) => a.dist2 - b.dist2)
      .slice(0, this.projectileCount);

    for (const { enemy } of sorted) {
      targets.push(enemy);
    }

    // Fill remaining projectiles with random directions
    const remaining = this.projectileCount - targets.length;
    for (let i = 0; i < remaining; i++) {
      const angle = Math.random() * Math.PI * 2;
      targets.push({
        x: player.x + Math.cos(angle) * 200,
        y: player.y + Math.sin(angle) * 200,
        scene: player.scene,
      });
    }

    return targets;
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
          if (p.isAlive() === false) {
            this.projectiles.splice(pIndex, 1);
          }
          break;
        }
      }
    }
  }
}
