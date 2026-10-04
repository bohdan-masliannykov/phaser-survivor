import { type CharacterDef, PLAYER_SPEED } from '@constants';
import { GameObject } from '@entities/core/game-object';
import { Aura } from '@entities/weapons/aura';
import { Bow } from '@entities/weapons/bow';
import { FireWand } from '@entities/weapons/fire-wand';
import { Sword } from '@entities/weapons/sword';
import { WeaponManager } from '@entities/weapons/weapon-manager';

export class Player extends GameObject {
  readonly id: string = Phaser.Utils.String.UUID();
  weaponManager: WeaponManager = new WeaponManager();
  pickupRadiusMultiplier: number = 1;

  constructor(scene: Phaser.Scene, x: number, y: number, def: CharacterDef) {
    super(scene, x, y, def.key, PLAYER_SPEED, 2, {
      maxHealth: 100,
      barWidth: 40,
      barHeight: 6,
      barOffsetY: 16,
      show: true,
    });
    this.hitboxConfig = def.hitbox;
    this.animations = {
      idle: def.animations.idle.key,
      walk: def.animations.walk.key,
      death: def.animations.death.key,
    };
    this.play(this.animations.idle);
    this.setImmovable(true);
    this.updateBodyForScale(false, def.hitbox);
    this.equipStartingWeapon(def);
  }

  private equipStartingWeapon(def: CharacterDef): void {
    switch (def.weapon) {
      case 'sword':
        this.weaponManager.addWeapon(def.weapon, new Sword(def.weaponStats));
        break;
      case 'bow':
        this.weaponManager.addWeapon(def.weapon, new Bow(def.weaponStats));
        break;
      case 'fire-wand':
        this.weaponManager.addWeapon(def.weapon, new FireWand(def.weaponStats));
        break;
      case 'aura': {
        const aura = new Aura(def.weaponStats);
        aura.initializeVisuals(this.scene);
        this.weaponManager.addWeapon(def.weapon, aura);
        break;
      }
    }
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
