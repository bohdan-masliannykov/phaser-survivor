import { PLAYER } from '@constants';
import { Player } from './player';
import { Sword } from '@entities/weapons/sword';

export class Soldier extends Player {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(
      scene,
      x,
      y,
      PLAYER.soldier.key,
      {
        widthPercent: 0.13,
        heightPercent: 0.2,
        offsetXPercent: (1 - 0.13) / 2,
        offsetYPercent: 0.38,
      },
      {
        idle: PLAYER.soldier.animations.idle.key,
        walk: PLAYER.soldier.animations.walk.key,
        death: PLAYER.soldier.animations.death.key,
      }
    );

    this.weaponManager.addWeapon('sword', new Sword(PLAYER.soldier.weaponStats as any));
  }
}
