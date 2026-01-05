export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload(): void {
    this.load.spritesheet('player', '/assets/soldier.png', {
      frameWidth: 100,
      frameHeight: 100,
    });
    this.load.spritesheet('enemy', '/assets/orc.png', {
      frameWidth: 100,
      frameHeight: 100,
    });
  }

  create(): void {
    const cols = 9; // frames per row
    const index = 1;
    ///TODO: fix magic numbers
    // also enhance to read from spritesheet metadata if possible

    this.anims.create({
      key: 'player-idle',
      frames: this.anims.generateFrameNumbers('player', {
        start: 0 * cols,
        end: 0 * cols + (cols - 3 - index), // last 3 frames are missing
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: 'player-walk',
      frames: this.anims.generateFrameNumbers('player', {
        start: 1 * cols,
        end: cols + (cols - 1 - index), // last frame is missing
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'enemy-walk',
      frames: this.anims.generateFrameNumbers('enemy', {
        start: 8,
        end: 8 * 2 - 1, // last 3 frames are missing
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.scene.start('GameScene');
  }
}
