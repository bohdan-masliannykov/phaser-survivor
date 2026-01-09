import type { HitboxConfig } from '@entities/core/game-object';

export class Projectile extends Phaser.Physics.Arcade.Sprite {
  private direction: { x: number; y: number };
  private readonly speed: number; // pixels per second
  // private remainingMs: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    direction: { x: number; y: number },
    speed: number,
    _lifetimeMs: number
  ) {
    super(scene, x, y, 'projectile', 0);
    this.setOrigin(0.5, 0.5);
    this.setScale(1);
    this.setDepth(5);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.speed = speed;
    // this.remainingMs = lifetimeMs;
    this.direction = direction;
    this.move();
  }

  move() {
    const norm = Math.sqrt(
      this.direction.x * this.direction.x + this.direction.y * this.direction.y
    );

    if (norm > 0) {
      const vx = (this.direction.x / (norm || 1)) * this.speed;
      const vy = (this.direction.y / (norm || 1)) * this.speed;
      this.setVelocity(vx, vy);
    } else {
      this.setVelocity(0, 0);
    }
  }

  updateBodyForScale(isLeft: boolean = false, config: HitboxConfig): void {
    const body = this.body as Phaser.Physics.Arcade.Body;

    const frameWidth = this.width / this.scaleX;
    const frameHeight = this.height / this.scaleY;

    const { widthPercent, heightPercent, offsetXPercent, offsetYPercent } =
      config;

    const bodyWidth = frameWidth * widthPercent * this.scaleX;
    const bodyHeight = frameHeight * heightPercent * this.scaleY;
    const offsetY = frameHeight * offsetYPercent * this.scaleY;
    const offsetX = isLeft
      ? frameWidth * (1 - offsetXPercent - widthPercent) * this.scaleX
      : frameWidth * offsetXPercent * this.scaleX;

    body.setSize(bodyWidth, bodyHeight);
    body.setOffset(offsetX, offsetY);
  }
}
