import { ENEMY } from '@constants';
import { Enemy } from './enemy';

export class Orc extends Enemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(
      scene,
      x,
      y,
      ENEMY.orc.key,
      {
        widthPercent: 0.15,
        heightPercent: 0.15,
        offsetXPercent: (1 - 0.15) / 2,
        offsetYPercent: 0.41,
      },
      {
        maxHealth: 50,
        barWidth: 24,
        barHeight: 3,
        barOffsetY: 18,
        show: true,
      },
      {
        idle: ENEMY.orc.animations.idle.key,
        walk: ENEMY.orc.animations.walk.key,
        death: ENEMY.orc.animations.death.key,
      }
    );
  }
}
