import type { Enemy } from '@entities/enemies/enemy';
import { Weapon } from './weapon';
import type { Player } from '@entities/player/player';

interface SwordStats {
  minDamage: number;
  maxDamage: number;
  cooldownMs: number;
  radius: number;
  slashDuration: number;
}

export class Sword extends Weapon {
  private radius: number;
  private slashDuration: number;
  private slashGraphics: Phaser.GameObjects.Graphics | null = null;
  private hitEnemies: Set<string> = new Set();

  constructor(stats?: SwordStats) {
    super();
    if (stats) {
      this.minDamage = stats.minDamage;
      this.maxDamage = stats.maxDamage;
      this.cooldownMs = stats.cooldownMs;
      this.radius = stats.radius;
      this.slashDuration = stats.slashDuration;
    } else {
      // Defaults
      this.minDamage = 8;
      this.maxDamage = 12;
      this.cooldownMs = 300;
      this.radius = 80;
      this.slashDuration = 300;
    }
  }

  increaseRadius(multiplier: number): void {
    this.radius = Math.round(this.radius * multiplier);
  }

  attack(_target: Enemy, player: Player): void {
    if (!this.isOffCooldown(player.scene.time.now)) return;
    this.updateCooldown(player.scene.time.now);

    this.hitEnemies.clear();
    this.showSlashEffect(player);
  }

  updateAttack(player: Player, enemies: Enemy[]): void {
    if (!this.slashGraphics) return;

    const r2 = this.radius * this.radius;
    for (const enemy of enemies) {
      if (!enemy.active || !enemy.visible || enemy.isDead()) continue;
      if (this.hitEnemies.has(enemy.id)) continue;
      const dx = enemy.x - player.x;
      const dy = enemy.y - player.y;
      if (dx * dx + dy * dy <= r2) {
        this.hitEnemies.add(enemy.id);
        enemy.receiveDamage(this.getDamage(), player.x, player.y, 15);
      }
    }

    this.slashGraphics = null;
  }

  private showSlashEffect(player: Player): void {
    const gfx = player.scene.add.graphics();
    gfx.setDepth(10);
    this.slashGraphics = gfx;

    // Draw rotating arc
    let elapsed = 0;
    const duration = this.slashDuration;
    const update = (_event: Phaser.Time.TimerEvent, delta: number) => {
      elapsed += delta;
      const progress = elapsed / duration;

      gfx.clear();
      gfx.lineStyle(3, 0xffffff, 1 - progress * 0.7);
      const startAngle = Phaser.Math.DegToRad(-90 + progress * 360);
      const endAngle = startAngle + Phaser.Math.DegToRad(120);
      gfx.beginPath();
      gfx.arc(player.x, player.y, this.radius, startAngle, endAngle, false);
      gfx.strokePath();

      if (elapsed >= duration) {
        gfx.destroy();
      }
    };

    player.scene.time.addEvent({
      delay: 16,
      repeat: Math.ceil(duration / 16),
      callback: function (this: Phaser.Time.TimerEvent) {
        update(this, 16);
      },
    });
  }
}
