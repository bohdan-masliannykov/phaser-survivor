import { PLAYER_SPEED, SPRITE_SCALE } from '@constants';
import { GameObject } from '@entities/core/game-object';
import { WeaponManager } from '@entities/weapons/weapon-manager';

export abstract class Player extends GameObject {
  readonly id: string = Phaser.Utils.String.UUID();
  weaponManager: WeaponManager = new WeaponManager();

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    animations?: GameObject['animations']
  ) {
    super(scene, x, y, 'player', PLAYER_SPEED, SPRITE_SCALE, {
      maxHealth: 100,
      barWidth: 40,
      barHeight: 6,
      barOffsetY: 16,
      show: true,
    });
    this.animations = animations ?? this.animations;
    this.play(this.animations.idle);
    this.setImmovable(true);
  }

  update(directions: { x: number; y: number }) {
    const isMoving = directions.x !== 0 || directions.y !== 0;
    const desired = isMoving ? this.animations.walk : this.animations.idle;

    if (this.anims.currentAnim?.key !== desired) {
      this.play(desired);
    }

    if (directions.x !== 0) {
      this.setFacingDirection(directions.x < 0);
    }
    super.move(directions);
  }

  abstract setFacingDirection(isLeft: boolean): void;
}
