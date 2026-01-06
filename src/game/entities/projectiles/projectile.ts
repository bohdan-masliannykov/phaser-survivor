export class Projectile extends Phaser.GameObjects.Sprite {
  private readonly velocity: Phaser.Math.Vector2;
  private readonly speed: number; // pixels per second
  private remainingMs: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    direction: { x: number; y: number },
    speed: number,
    lifetimeMs: number
  ) {
    super(scene, x, y, 'projectile', 0);
    this.setScale(1);
    this.setDepth(5);
    scene.add.existing(this);

    const len = Math.hypot(direction.x, direction.y);
    this.velocity =
      len === 0
        ? new Phaser.Math.Vector2(0, 0)
        : new Phaser.Math.Vector2(direction.x / len, direction.y / len);
    this.speed = speed;
    this.remainingMs = lifetimeMs;
  }

  update(delta: number): boolean {
    this.remainingMs -= delta;
    if (this.remainingMs <= 0) return false;

    const deltaSeconds = delta / 1000;
    this.x += this.velocity.x * deltaSeconds * this.speed;
    this.y += this.velocity.y * deltaSeconds * this.speed;

    return true;
  }
}
