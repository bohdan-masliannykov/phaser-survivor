import { ENEMY_SPEED, MIN_VELOCITY_THRESHOLD } from '@constants';
import { GameObject } from '@entities/core/game-object';

export abstract class Enemy extends GameObject {
  readonly id: string = Phaser.Utils.String.UUID();

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    healthOptions?: GameObject['healthOptions'],
    animations?: GameObject['animations']
  ) {
    const rndScale = Phaser.Math.Between(20, 23) / 10;

    super(
      scene,
      x,
      y,
      'enemy',
      ENEMY_SPEED,
      rndScale,
      healthOptions,
      animations
    );
    this.play(this.animations.walk);
  }
  update(targetX: number, targetY: number): void {
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const directions = { x: dx, y: dy };

    if (Math.abs(directions.x) > MIN_VELOCITY_THRESHOLD) {
      this.setFlipX(directions.x < 0);
    }

    super.move(directions);
  }

  abstract setFacingDirection(isLeft: boolean): void;
}
