import { ENEMY, PLAYER } from '@constants';
import { generateTerrainTextures } from '@entities/environment/terrain-textures';

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

    this.load.image('arrow', '/assets/arrow.png');
    this.load.image('xp-gem-green', '/assets/xp-gem-green.png');
    this.load.image('xp-gem-blue', '/assets/xp-gem-blue.png');
    this.load.image('xp-gem-red', '/assets/xp-gem-red.png');
  }

  create(): void {
    const graphics = this.make.graphics({ x: 0, y: 0 });
    graphics.fillStyle(0xff6600, 1);
    graphics.fillCircle(8, 8, 8); // Small 16x16 circle
    graphics.generateTexture('fire-particle', 16, 16);
    graphics.destroy();

    const g = this.make.graphics({ x: 0, y: 0 });
    g.fillStyle(0xffff66, 1);
    g.fillCircle(4, 4, 4);
    g.generateTexture('projectile', 8, 8);
    g.destroy();

    // Soft glow circle for gem aura
    const glow = this.make.graphics({ x: 0, y: 0 });
    const glowSize = 32;
    const half = glowSize / 2;
    for (let r = half; r > 0; r--) {
      const alpha = 0.3 * (r / half);
      glow.fillStyle(0xffffff, alpha);
      glow.fillCircle(half, half, r);
    }
    glow.generateTexture('glow', glowSize, glowSize);
    glow.destroy();

    // Generate procedural terrain textures (ground, trees, rocks, etc.)
    generateTerrainTextures(this);

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
