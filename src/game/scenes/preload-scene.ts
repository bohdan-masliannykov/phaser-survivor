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

    this.load.image('grass', '/assets/grass.png');
  }

  create(): void {
    this.anims.create({
      key: 'player-idle',
      frames: this.anims.generateFrameNumbers('player', {
        start: 0,
        end: 5,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: 'player-walk',
      frames: this.anims.generateFrameNumbers('player', {
        start: 9,
        end: 16,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'enemy-walk',
      frames: this.anims.generateFrameNumbers('enemy', {
        start: 8,
        end: 15,
      }),
      frameRate: 8,
      repeat: -1,
    });

    this.scene.start('GameScene');
  }
}
