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
      barOffsetY: -38,
      show: true,
    });
    this.animations = animations ?? this.animations;
    this.play(this.animations.idle);
  }

  update(directions: { x: number; y: number }, delta: number) {
    const isMoving = directions.x !== 0 || directions.y !== 0;
    const desired = isMoving ? this.animations.walk : this.animations.idle;

    if (this.anims.currentAnim?.key !== desired) {
      this.play(desired);
    }

    if (isMoving) {
      this.velocity.set(directions.x, directions.y).normalize();
    } else {
      this.velocity.set(0, 0);
    }

    if (this.velocity.x !== 0) {
      this.setFacingDirection(this.velocity.x < 0);
    }

    super.move(delta);
  }

  abstract setFacingDirection(isLeft: boolean): void;
}
