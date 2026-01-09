import { ENEMY } from '@constants';
import { Enemy } from './enemy';
import type { HitboxConfig } from '@entities/core/game-object';

const hitboxConfig: HitboxConfig = {
  widthPercent: 0.15,
  heightPercent: 0.15,
  offsetXPercent: (1 - 0.15) / 2,
  offsetYPercent: 0.41,
};
export class Orc extends Enemy {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(
      scene,
      x,
      y,
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

    this.updateBodyForScale(false, hitboxConfig);
  }

  setFacingDirection(isLeft: boolean): void {
    this.setFlipX(isLeft);
    this.updateBodyForScale(isLeft, hitboxConfig);
  }
}
