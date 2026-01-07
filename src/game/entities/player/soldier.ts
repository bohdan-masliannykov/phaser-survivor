import { PLAYER, SPRITE_SCALE } from '@constants';
import { Player } from './player';
import { Sword } from '@entities/weapons/sword';

export class Soldier extends Player {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, {
      idle: PLAYER.soldier.animations.idle.key,
      walk: PLAYER.soldier.animations.walk.key,
      death: PLAYER.soldier.animations.death.key,
    });

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(6 * SPRITE_SCALE, 7.5 * SPRITE_SCALE);
    body.setOffset(16.75 * SPRITE_SCALE, 15.5 * SPRITE_SCALE);

    this.weaponManager.addWeapon('sword', new Sword());
  }

  setFacingDirection(isLeft: boolean): void {
    this.setFlipX(isLeft);

    const body = this.body as Phaser.Physics.Arcade.Body;
    if (isLeft) {
      body.setOffset(17 * SPRITE_SCALE, 15.5 * SPRITE_SCALE);
    } else {
      body.setOffset(16.75 * SPRITE_SCALE, 15.5 * SPRITE_SCALE);
    }
  }
}
