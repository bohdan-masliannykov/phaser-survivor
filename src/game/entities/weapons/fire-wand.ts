import { AUTO_FIRE_RANGE } from '@constants';
import type { Enemy } from '@entities/enemies/enemy';
import type { Player } from '@entities/player/player';
import { PROJECTILES } from '@entities/projectiles/projectile';
import { gameClock } from '@system/game-clock';
import { ProjectileWeapon, type ProjectileWeaponStats } from './projectile-weapon';

export class FireWand extends ProjectileWeapon {
  constructor(stats: ProjectileWeaponStats) {
    super(stats, PROJECTILES.fireball);
  }

  attack(nearestEnemy: Enemy, player: Player, allEnemies?: Enemy[]): void {
    if (!this.isOffCooldown(gameClock.now)) {
      return;
    }
    this.updateCooldown(gameClock.now);

    // Sort enemies by distance and pick unique targets for each projectile
    const targets = this.pickTargets(player, nearestEnemy, allEnemies ?? []);

    for (const target of targets) {
      const dx = target.x - player.x;
      const dy = target.y - player.y;
      const length = Math.sqrt(dx * dx + dy * dy) || 1;
      this.fire(player, { x: dx / length, y: dy / length });
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
}
