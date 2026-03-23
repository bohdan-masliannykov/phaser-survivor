import { ENEMY } from '@constants';
import { Enemy } from './enemy';

export class Slime extends Enemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(
      scene,
      x,
      y,
      ENEMY.slime.key,
      {
        widthPercent: 0.21,
        heightPercent: 0.11,
        offsetXPercent: (1 - 0.21) / 2,
        offsetYPercent: 0.45,
      },
      {
        maxHealth: 6,
        barWidth: 24,
        barHeight: 3,
        barOffsetY: 18,
        show: true,
      },
      {
        idle: ENEMY.slime.animations.idle.key,
        walk: ENEMY.slime.animations.walk.key,
        death: ENEMY.slime.animations.death.key,
      }
    );
  }
}
