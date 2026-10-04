import { PLAYER } from '@constants';
import { Sword } from '@entities/weapons/sword';
import { Player } from './player';

export class ArmoredAxeman extends Player {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(
      scene,
      x,
      y,
      PLAYER.armoredAxeman.key,
      {
        widthPercent: 0.15,
        heightPercent: 0.22,
        offsetXPercent: (1 - 0.15) / 2,
        offsetYPercent: 0.36,
      },
      {
        idle: PLAYER.armoredAxeman.animations.idle.key,
        walk: PLAYER.armoredAxeman.animations.walk.key,
        death: PLAYER.armoredAxeman.animations.death.key,
      }
    );

    this.weaponManager.addWeapon('sword', new Sword(PLAYER.armoredAxeman.weaponStats as any));
  }
}
