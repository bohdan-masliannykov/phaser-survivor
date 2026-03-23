import { PLAYER } from '@constants';
import { Player } from './player';
import { FireWand } from '@entities/weapons/fire-wand';

export class Wizzard extends Player {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(
      scene,
      x,
      y,
      PLAYER.wizzard.key,
      {
        widthPercent: 0.14,
        heightPercent: 0.2,
        offsetXPercent: (1 - 0.14) / 2,
        offsetYPercent: 0.38,
      },
      {
        idle: PLAYER.wizzard.animations.idle.key,
        walk: PLAYER.wizzard.animations.walk.key,
        death: PLAYER.wizzard.animations.death.key,
      }
    );

    this.weaponManager.addWeapon('fire-wand', new FireWand(PLAYER.wizzard.weaponStats as any));
  }
}
