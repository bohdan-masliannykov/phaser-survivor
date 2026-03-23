import {
  XP_GEM_PICKUP_RADIUS,
  XP_GEM_COLLECT_RADIUS,
  XP_GEM_MAGNETIC_SPEED,
} from '@constants';

const BOB_AMPLITUDE = 2;
const BOB_SPEED = 3;

const GLOW_PULSE_SPEED = 2;
const GLOW_ALPHA_MIN = 0.3;
const GLOW_ALPHA_MAX = 0.7;

const GEM_TIERS = [
  { minXp: 5, texture: 'xp-gem-red', scale: 0.65, glowColor: 0xff4444 },
  { minXp: 2, texture: 'xp-gem-blue', scale: 0.55, glowColor: 0x4488ff },
] as const;
const DEFAULT_TIER = { texture: 'xp-gem-green', scale: 0.45, glowColor: 0x44ff88 };

export class XpGem extends Phaser.GameObjects.Image {
  xpValue: number = 1;
  private collected = false;
  private baseY = 0;
  private phaseOffset = 0;
  private glow: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, DEFAULT_TIER.texture);
    this.setDepth(-0.1);
    scene.add.existing(this);

    this.glow = scene.add.image(0, 0, 'glow');
    this.glow.setDepth(-0.15);
    this.glow.setBlendMode(Phaser.BlendModes.ADD);
    this.glow.setActive(false);
    this.glow.setVisible(false);

    this.setActive(false);
    this.setVisible(false);
  }

  spawn(x: number, y: number, xpValue: number): void {
    this.xpValue = xpValue;
    this.collected = false;
    this.setPosition(x, y);
    this.baseY = y;
    this.phaseOffset = Math.random() * Math.PI * 2;
    this.setActive(true);
    this.setVisible(true);

    const tier = GEM_TIERS.find((t) => xpValue >= t.minXp) ?? DEFAULT_TIER;
    this.setTexture(tier.texture);
    this.setScale(tier.scale);

    this.glow.setPosition(x, y);
    this.glow.setTint(tier.glowColor);
    this.glow.setScale(tier.scale * 1.2);
    this.glow.setActive(true);
    this.glow.setVisible(true);
  }

  deactivate(): void {
    this.collected = false;
    this.setActive(false);
    this.setVisible(false);
    this.setPosition(0, 0);
    this.glow.setActive(false);
    this.glow.setVisible(false);
  }

  isCollected(): boolean {
    return this.collected;
  }

  update(playerX: number, playerY: number, pickupRadius?: number): boolean {
    if (!this.active || this.collected) return false;

    // Gentle floating bob
    const time = this.scene.time.now / 1000;
    this.y = this.baseY + Math.sin(time * BOB_SPEED + this.phaseOffset) * BOB_AMPLITUDE;

    // Pulsing glow
    const glowAlpha = GLOW_ALPHA_MIN +
      (GLOW_ALPHA_MAX - GLOW_ALPHA_MIN) *
      (0.5 + 0.5 * Math.sin(time * GLOW_PULSE_SPEED + this.phaseOffset));
    this.glow.setAlpha(glowAlpha);
    this.glow.setPosition(this.x, this.y);

    const dx = playerX - this.x;
    const dy = playerY - this.baseY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Instant collect
    if (dist < XP_GEM_COLLECT_RADIUS) {
      this.collected = true;
      this.setActive(false);
      this.setVisible(false);
      this.glow.setActive(false);
      this.glow.setVisible(false);
      return true;
    }

    // Magnetic pull
    const magnetRange = pickupRadius ?? XP_GEM_PICKUP_RADIUS;
    if (dist < magnetRange && dist > 0) {
      const speed = XP_GEM_MAGNETIC_SPEED * (1 / 60);
      const nx = dx / dist;
      const ny = dy / dist;
      this.x += nx * speed;
      this.baseY += ny * speed;
    }

    return false;
  }

  destroy(fromScene?: boolean): void {
    this.glow.destroy(fromScene);
    super.destroy(fromScene);
  }
}
