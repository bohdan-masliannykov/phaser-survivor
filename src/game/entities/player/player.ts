import { PLAYER_SPEED } from '@constants';
import { GameObject, type HitboxConfig } from '@entities/core/game-object';
import { WeaponManager } from '@entities/weapons/weapon-manager';

export abstract class Player extends GameObject {
  readonly id: string = Phaser.Utils.String.UUID();
  weaponManager: WeaponManager = new WeaponManager();
  pickupRadiusMultiplier: number = 1;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    hitboxConfig: HitboxConfig,
    animations?: GameObject['animations']
  ) {
    super(scene, x, y, texture, PLAYER_SPEED, 2, {
      maxHealth: 100,
      barWidth: 40,
      barHeight: 6,
      barOffsetY: 16,
      show: true,
    });
    this.hitboxConfig = hitboxConfig;
    this.animations = animations ?? this.animations;
    this.play(this.animations.idle);
    this.setImmovable(true);
    this.updateBodyForScale(false, hitboxConfig);
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
}
