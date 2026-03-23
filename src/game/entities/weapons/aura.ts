import type { Enemy } from '@entities/enemies/enemy';
import { Weapon } from './weapon';
import type { Player } from '@entities/player/player';

interface AuraStats {
  minDamage: number;
  maxDamage: number;
  cooldownMs: number;
  radius: number;
  damageIntervalMs: number;
}

export class Aura extends Weapon {
  auraRadius: number;
  lastDamageTime: number = 0;
  damageTickIntervalMs: number;
  private auraGraphics?: Phaser.GameObjects.Graphics;

  constructor(stats?: AuraStats) {
    super();
    if (stats) {
      this.minDamage = stats.minDamage;
      this.maxDamage = stats.maxDamage;
      this.cooldownMs = stats.cooldownMs;
      this.auraRadius = stats.radius;
      this.damageTickIntervalMs = stats.damageIntervalMs;
    } else {
      // Defaults
      this.minDamage = 2;
      this.maxDamage = 4;
      this.cooldownMs = 0;
      this.auraRadius = 60;
      this.damageTickIntervalMs = 600;
    }
  }

  initializeVisuals(scene: Phaser.Scene): void {
    // Create aura circle graphics
    this.auraGraphics = scene.add.graphics();
    this.auraGraphics.setDepth(0);
    this.auraGraphics.setScrollFactor(1, 1);
  }

  setAuraPosition(x: number, y: number): void {
    if (!this.auraGraphics) return;

    // Draw aura circle
    this.auraGraphics.clear();

    // Inner glow (transparent orange/yellow)
    this.auraGraphics.fillStyle(0xffaa44, 0.15);
    this.auraGraphics.fillCircle(x, y, this.auraRadius);

    // Border glow
    this.auraGraphics.lineStyle(2, 0xff8800, 0.6);
    this.auraGraphics.strokeCircle(x, y, this.auraRadius);

    // Outer border
    this.auraGraphics.lineStyle(1, 0xffdd44, 0.3);
    this.auraGraphics.strokeCircle(x, y, this.auraRadius + 8);
  }

  addRadius(): void {
    this.auraRadius += 20;
  }

  attack(_: Enemy, _player: Player): void {
    // Aura doesn't have discrete attacks, it's continuous
    // This method is called but we handle damage in updateAttack
  }

  updateAttack(player: Player, enemies: Enemy[]): void {
    // Update visual position
    this.setAuraPosition(player.x, player.y);

    const now = player.scene.time.now;

    // Check if it's time to deal damage
    if (now - this.lastDamageTime < this.damageTickIntervalMs) {
      return;
    }
    this.lastDamageTime = now;

    const radiusSquared = this.auraRadius * this.auraRadius;

    for (const enemy of enemies) {
      if (enemy.isDead()) continue;

      const dx = enemy.x - player.x;
      const dy = enemy.y - player.y;
      const distSquared = dx * dx + dy * dy;

      if (distSquared <= radiusSquared) {
        enemy.receiveDamage(this.getDamage(), player.x, player.y, 5, 'burn');
      }
    }
  }

  cleanup(): void {
    if (this.auraGraphics) {
      this.auraGraphics.destroy();
    }
  }
}
