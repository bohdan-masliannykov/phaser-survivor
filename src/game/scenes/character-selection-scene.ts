import { PLAYER } from '@constants';

export class CharacterSelectionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CharacterSelectionScene' });
  }

  preload(): void {
    this.load.image('soldier', 'assets/soldier.png');
    this.load.image('wizzard', 'assets/wizzard.png');
  }

  create(): void {
    const characterList = [
      { key: PLAYER.soldier.key },
      { key: PLAYER.wizzard.key },
    ];

    characterList.forEach((char, index) => {
      //TODO REFACTOR DONT LIKE THIS for now just to quickly finish
      const x = 200 + index * 400;
      const y = 300;
      const characterImage = this.add.image(x, y, char.key).setInteractive();
      characterImage.setScale(5);

      const minX = characterImage.displayWidth / 2;
      const maxX = this.scale.width - characterImage.displayWidth / 2;
      characterImage.x = Phaser.Math.Clamp(characterImage.x, minX, maxX);

      characterImage.on('pointerdown', () => {
        this.startGame(char.key);
      });
    });

    this.add.text(200, 100, 'Select Your Character', {
      fontSize: '32px',
      color: '#ffffff',
    });
  }

  private startGame(characterType: string): void {
    this.scene.start('GameScene', { characterType });
  }
}
