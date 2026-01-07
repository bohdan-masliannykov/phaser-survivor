import { ENEMY } from '@constants';
import { Enemy } from './enemy';

export class Skeleton extends Enemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(
      scene,
      x,
      y,
      {
        maxHealth: 40,
        barWidth: 24,
        barHeight: 3,
        barOffsetY: 18,
      },
      {
        idle: ENEMY.skeleton.animations.idle.key,
        walk: ENEMY.skeleton.animations.walk.key,
        death: ENEMY.skeleton.animations.death.key,
      }
    );

    const body = this.body as Phaser.Physics.Arcade.Body;

    body.setSize(6 * this.scale, 7.5 * this.scale);
    body.setOffset(17.5 * this.scale, 15.5 * this.scale);
  }

  setFacingDirection(isLeft: boolean): void {
    this.setFlipX(isLeft);
    //todo flip offset adjustment if needed
  }
}
