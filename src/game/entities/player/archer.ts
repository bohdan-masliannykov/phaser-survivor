import { PLAYER } from '@constants';
import { Player } from './player';
import { Bow } from '@entities/weapons/bow';

export class Archer extends Player {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(
      scene,
      x,
      y,
      PLAYER.archer.key,
      {
        widthPercent: 0.12,
        heightPercent: 0.18,
        offsetXPercent: (1 - 0.12) / 2,
        offsetYPercent: 0.4,
      },
      {
        idle: PLAYER.archer.animations.idle.key,
        walk: PLAYER.archer.animations.walk.key,
        death: PLAYER.archer.animations.death.key,
      }
    );

    this.weaponManager.addWeapon('bow', new Bow(PLAYER.archer.weaponStats as any));
  }
}
