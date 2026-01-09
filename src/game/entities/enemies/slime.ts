import { ENEMY } from '@constants';
import { Enemy } from './enemy';
import type { HitboxConfig } from '@entities/core/game-object';

const hitboxConfig: HitboxConfig = {
  widthPercent: 0.21,
  heightPercent: 0.11,
  offsetXPercent: (1 - 0.21) / 2,
  offsetYPercent: 0.45,
};
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
        show: true,
      },
      {
        idle: ENEMY.slime.animations.idle.key,
        walk: ENEMY.slime.animations.walk.key,
        death: ENEMY.slime.animations.death.key,
      }
    );

    this.updateBodyForScale(false, hitboxConfig);
  }

  setFacingDirection(isLeft: boolean): void {
    this.setFlipX(isLeft);
    this.updateBodyForScale(isLeft, hitboxConfig);
  }
}
