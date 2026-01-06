import {
  ARRIVE_RADIUS,
  ENEMY_SPEED,
  MIN_VELOCITY_THRESHOLD,
  SPRITE_SCALE,
} from '@constants';
import { GameObject } from '@entities/core/game-object';

export class Enemy extends GameObject {
  // When close enough to the target, stop moving to avoid overshoot/flip jitter.
  private readonly arriveRadius = ARRIVE_RADIUS;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'enemy', ENEMY_SPEED, SPRITE_SCALE, {
      maxHealth: 50,
      barWidth: 24,
      barHeight: 3,
      barOffsetY: 18,
    });
    this.play('enemy-walk');
  }

  update(targetX: number, targetY: number, delta: number): void {
    // Chase behavior (no physics):
    // 1) direction = (target - me)
    // 2) normalize so diagonals aren't faster
    // 3) move using speed * delta in seconds
    const dx = targetX - this.x;
    const dy = targetY - this.y;

    // If we reached the target (or are extremely close), stop.
    if (dx * dx + dy * dy <= this.arriveRadius * this.arriveRadius) {
      this.velocity.set(0, 0);
      return;
    }

    this.velocity.set(dx, dy).normalize();

    // Only flip when horizontal movement is meaningful.
    if (Math.abs(this.velocity.x) > MIN_VELOCITY_THRESHOLD) {
      this.setFlipX(this.velocity.x < 0);
    }

    super.move(delta);
  }
}
