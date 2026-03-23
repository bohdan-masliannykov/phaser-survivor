import { PLAYER } from '@constants';
import { Player } from './player';
import { Aura } from '@entities/weapons/aura';

export class Priest extends Player {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(
      scene,
      x,
      y,
      PLAYER.priest.key,
      {
        widthPercent: 0.14,
        heightPercent: 0.2,
        offsetXPercent: (1 - 0.14) / 2,
        offsetYPercent: 0.38,
      },
      {
        idle: PLAYER.priest.animations.idle.key,
        walk: PLAYER.priest.animations.walk.key,
        death: PLAYER.priest.animations.death.key,
      }
    );

    const aura = new Aura(PLAYER.priest.weaponStats as any);
    aura.initializeVisuals(scene);
    this.weaponManager.addWeapon('aura', aura);
  }
}
