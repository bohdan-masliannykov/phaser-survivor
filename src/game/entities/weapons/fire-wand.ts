import type { Enemy } from '@entities/enemies/enemy';
import { Weapon } from './weapon';
import { Fireball } from '@entities/projectiles/fireball';
import type { Player } from '@entities/player/player';
import { PROJECTILE_HIT_RADIUS } from '@constants';
import type { EnemyManager } from '@entities/enemies/enemy-manager';

export class FireWand extends Weapon {
  projectiles: Fireball[] = [];

  constructor() {
    super();

    this.minDamage = 8;
    this.maxDamage = 15;
    this.cooldownMs = 1100;
  }

  attack(nearestEnemy: Enemy, player: Player): void {
    if (!this.isOffCooldown(player.scene.time.now)) {
      return;
    }
    this.updateCooldown(player.scene.time.now);

    const numProjectiles = this.projectileCount;
    if (numProjectiles === 1) {
      // Direct shot
      const dx = nearestEnemy.x - player.x;
      const dy = nearestEnemy.y - player.y;
      const length = Math.sqrt(dx * dx + dy * dy) || 1;
      const velocity = { x: dx / length, y: dy / length };
      this.projectiles.push(
        new Fireball(nearestEnemy.scene, player.x, player.y, velocity)
      );
    } else {
      // Spread shot
      const minSpread = Phaser.Math.DegToRad(25);
      const maxSpread = Phaser.Math.DegToRad(90);
      const totalSpread = Phaser.Math.Linear(
        minSpread,
        maxSpread,
        (numProjectiles - 3) / (10 - 3)
      );
      const baseAngle = Math.atan2(
        nearestEnemy.y - player.y,
        nearestEnemy.x - player.x
      );
      const startAngle = baseAngle - totalSpread / 2;
      const angleStep = totalSpread / (numProjectiles - 1);

      for (let i = 0; i < numProjectiles; i++) {
        const angle = startAngle + i * angleStep;
        const velocity = { x: Math.cos(angle), y: Math.sin(angle) };
        this.projectiles.push(
          new Fireball(nearestEnemy.scene, player.x, player.y, velocity)
        );
      }
    }
  }

  updateAttack(
    delta: number,
    player: Player,
    enemyManager: EnemyManager
  ): void {
    const hitR2 = PROJECTILE_HIT_RADIUS * PROJECTILE_HIT_RADIUS;

    const enemies = enemyManager.getEnemies();
    // Iterate backwards so we can remove items safely.
    for (let pIndex = this.projectiles.length - 1; pIndex >= 0; pIndex--) {
      const p = this.projectiles[pIndex];
      const alive = p.update(delta);

      if (!alive) {
        p.destroy();
        this.projectiles.splice(pIndex, 1);
        continue;
      }

      // Naive collision: bullet vs all enemies (fine for early prototype).
      for (let eIndex = enemies.length - 1; eIndex >= 0; eIndex--) {
        const e = enemies[eIndex];
        const dx = e.x - p.x;
        const dy = e.y - p.y;

        if (dx * dx + dy * dy <= hitR2) {
          // Prototype behavior: delete enemy on hit.
          e.takeDamage(this.getDamage());
          e.applyKnockback(p.x, p.y, 10);
          if (e.isDead()) {
            e.destroyWithAnimation();
            enemyManager.removeEnemy(e);
          }

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
