import { ENEMY } from '@constants';
import { Enemy } from './enemy';

export class Slime extends Enemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(
      scene,
      x,
      y,
      {
        maxHealth: 20,
        barWidth: 24,
        barHeight: 3,
        barOffsetY: 18,
      },
      {
        idle: ENEMY.slime.animations.idle.key,
        walk: ENEMY.slime.animations.walk.key,
        death: ENEMY.slime.animations.death.key,
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
