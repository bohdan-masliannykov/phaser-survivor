import { PLAYER, SPRITE_SCALE } from '@constants';
import { Player } from './player';
import { FireWand } from '@entities/weapons/fire-wand';

export class Wizzard extends Player {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, {
      idle: PLAYER.wizzard.animations.idle.key,
      walk: PLAYER.wizzard.animations.walk.key,
      death: PLAYER.wizzard.animations.death.key,
    });

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(6 * SPRITE_SCALE, 7.5 * SPRITE_SCALE);
    body.setOffset(17.5 * SPRITE_SCALE, 15.5 * SPRITE_SCALE);

    this.weaponManager.addWeapon('fire-wand', new FireWand());
  }

  setFacingDirection(isLeft: boolean): void {
    this.setFlipX(isLeft);

    const body = this.body as Phaser.Physics.Arcade.Body;
    if (isLeft) {
      body.setOffset(16.5 * SPRITE_SCALE, 15.5 * SPRITE_SCALE);
    } else {
      body.setOffset(17.5 * SPRITE_SCALE, 15.5 * SPRITE_SCALE);
    }
  }
}
