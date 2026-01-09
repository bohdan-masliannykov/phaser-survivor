import { PLAYER } from '@constants';
import { Player } from './player';
import { Sword } from '@entities/weapons/sword';
import type { HitboxConfig } from '@entities/core/game-object';

const hitboxConfig: HitboxConfig = {
  widthPercent: 0.13,
  heightPercent: 0.2,
  offsetXPercent: (1 - 0.13) / 2,
  offsetYPercent: 0.38,
};
export class Soldier extends Player {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, {
      idle: PLAYER.soldier.animations.idle.key,
      walk: PLAYER.soldier.animations.walk.key,
      death: PLAYER.soldier.animations.death.key,
    });

    this.updateBodyForScale(false, hitboxConfig);
    this.weaponManager.addWeapon('sword', new Sword());
  }

  setFacingDirection(isLeft: boolean): void {
    this.setFlipX(isLeft);
    this.updateBodyForScale(isLeft, hitboxConfig);
  }
}
