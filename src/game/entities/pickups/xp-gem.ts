import {
  XP_GEM_PICKUP_RADIUS,
  XP_GEM_COLLECT_RADIUS,
  XP_GEM_MAGNETIC_SPEED,
} from '@constants';

export class XpGem extends Phaser.GameObjects.Arc {
  xpValue: number = 1;
  private collected = false;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 5, 0, 360, false, 0x00ff88, 1);
    this.setDepth(1);
    scene.add.existing(this);
    this.setActive(false);
    this.setVisible(false);
  }

  spawn(x: number, y: number, xpValue: number): void {
    this.xpValue = xpValue;
    this.collected = false;
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);

    // Color by value: green(1), blue(2-3), purple(5+)
    if (xpValue >= 5) {
      this.setFillStyle(0xbb66ff); // purple
      this.setRadius(7);
    } else if (xpValue >= 2) {
      this.setFillStyle(0x4da6ff); // blue
      this.setRadius(6);
    } else {
      this.setFillStyle(0x00ff88); // green
      this.setRadius(5);
    }
  }

  deactivate(): void {
    this.collected = false;
    this.setActive(false);
    this.setVisible(false);
    this.setPosition(0, 0);
  }

  isCollected(): boolean {
    return this.collected;
  }

  update(playerX: number, playerY: number, pickupRadius?: number): boolean {
    if (!this.active || this.collected) return false;

    const dx = playerX - this.x;
    const dy = playerY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Instant collect
    if (dist < XP_GEM_COLLECT_RADIUS) {
      this.collected = true;
      this.setActive(false);
      this.setVisible(false);
      return true;
    }

    // Magnetic pull
    const magnetRange = pickupRadius ?? XP_GEM_PICKUP_RADIUS;
    if (dist < magnetRange && dist > 0) {
      const speed = XP_GEM_MAGNETIC_SPEED * (1 / 60);
      const nx = dx / dist;
      const ny = dy / dist;
      this.x += nx * speed;
      this.y += ny * speed;
    }

    return false;
  }
}
