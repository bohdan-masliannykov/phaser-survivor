import { ENEMY, PLAYER } from '@constants';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload(): void {
    Object.values(PLAYER).forEach((char) => {
      this.load.spritesheet(char.key, `/assets/${char.key}.png`, {
        frameWidth: 100,
        frameHeight: 100,
      });
    });

    Object.values(ENEMY).forEach((char) => {
      this.load.spritesheet(char.key, `/assets/${char.key}.png`, {
        frameWidth: 100,
        frameHeight: 100,
      });
    });

    this.load.spritesheet('fireball', '/assets/fireball.png', {
      frameWidth: 100,
      frameHeight: 100,
    });

    this.load.image('grass', '/assets/grass.png');
  }

  create(): void {
    const g = this.make.graphics({ x: 0, y: 0 });
    g.fillStyle(0xffff66, 1);
    g.fillCircle(4, 4, 4);
    g.generateTexture('projectile', 8, 8);
    g.destroy();

    this.anims.create({
      key: 'fireball_launch',
      frames: this.anims.generateFrameNumbers('fireball', {
        start: 1,
        end: 3,
      }),
      frameRate: 10,
      repeat: -1,
    });

    // Create player animations from PLAYER config
    Object.values(PLAYER).forEach((char) => {
      Object.values(char.animations).forEach((anim) => {
        this.anims.create({
          key: anim.key,
          frames: this.anims.generateFrameNumbers(char.key, {
            start: anim.start,
            end: anim.end,
          }),
          frameRate: anim.frameRate,
          repeat: anim.repeat,
        });
      });
    });

    // Create enemy animations from ENEMY config
    Object.values(ENEMY).forEach((char) => {
      Object.values(char.animations).forEach((anim) => {
        this.anims.create({
          key: anim.key,
          frames: this.anims.generateFrameNumbers(char.key, {
            start: anim.start,
            end: anim.end,
          }),
          frameRate: anim.frameRate,
          repeat: anim.repeat,
        });
      });
    });

    this.scene.start('CharacterSelectionScene');
  }
}
