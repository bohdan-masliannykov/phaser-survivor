import { type CharacterDef, PLAYER } from '@constants';

const CARD_WIDTH = 300;
const CARD_HEIGHT = 400;
const CARD_GAP = 30;
const SCREEN_MARGIN = 30;
const FONT = 'monospace';

const RATINGS = [
  { label: 'DMG', stat: 'damage', color: '#ffaa44', offsetX: -80 },
  { label: 'SPD', stat: 'speed', color: '#44aaff', offsetX: 0 },
  { label: 'RNG', stat: 'range', color: '#44ff44', offsetX: 80 },
] as const;

export class CharacterSelectionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CharacterSelectionScene' });
  }

  create(): void {
    const characters = Object.values(PLAYER);
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor(0x1a1a2e);

    this.add
      .text(width / 2, 30, 'PHASER SURVIVOR', {
        fontFamily: FONT,
        fontSize: '42px',
        color: '#ffdd44',
        stroke: '#000',
        strokeThickness: 6,
      })
      .setOrigin(0.5, 0);

    this.add
      .text(width / 2, 80, 'Select Your Character', {
        fontFamily: FONT,
        fontSize: '20px',
        color: '#cccccc',
        stroke: '#000',
        strokeThickness: 2,
      })
      .setOrigin(0.5, 0);

    // Cards side by side, centred
    const totalWidth = CARD_WIDTH * characters.length + CARD_GAP * (characters.length - 1);
    const startX = (width - totalWidth) / 2;

    characters.forEach((character, index) => {
      const cardX = startX + index * (CARD_WIDTH + CARD_GAP) + CARD_WIDTH / 2;
      this.drawCharacterCard(cardX, height / 2 + 40, character);
    });

    // Zoom out when the row is wider than the window
    this.cameras.main.setZoom(Math.min(1, width / (totalWidth + SCREEN_MARGIN * 2)));
  }

  private drawCharacterCard(x: number, y: number, character: CharacterDef): void {
    const { card, animations } = character;

    const bg = this.add
      .rectangle(x, y, CARD_WIDTH, CARD_HEIGHT, 0x222244, 0.85)
      .setStrokeStyle(3, 0x4da6ff)
      .setInteractive({ useHandCursor: true });

    const portrait = this.add
      .sprite(x, y - 80, character.key)
      .setScale(3.5)
      .play(animations.idle.key);

    // Highlight and walk on hover
    bg.on('pointerover', () => {
      bg.setStrokeStyle(4, 0xffdd44);
      bg.setFillStyle(0x333355, 0.95);
      portrait.play(animations.walk.key);
    });
    bg.on('pointerout', () => {
      bg.setStrokeStyle(3, 0x4da6ff);
      bg.setFillStyle(0x222244, 0.85);
      portrait.play(animations.idle.key);
    });
    bg.on('pointerdown', () => {
      this.scene.start('GameScene', { characterType: character.key });
    });

    this.add
      .text(x, y + 40, card.name, {
        fontFamily: FONT,
        fontSize: '26px',
        color: '#ffdd44',
        stroke: '#000',
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    this.add
      .text(x, y + 70, card.description, {
        fontFamily: FONT,
        fontSize: '11px',
        color: '#bbbbbb',
        wordWrap: { width: CARD_WIDTH - 40 },
        align: 'center',
      })
      .setOrigin(0.5);

    const ratingsY = y + 120;
    for (const { label, stat, color, offsetX } of RATINGS) {
      this.add
        .text(x + offsetX, ratingsY, label, {
          fontFamily: FONT,
          fontSize: '12px',
          color,
          stroke: '#000',
          strokeThickness: 2,
        })
        .setOrigin(0.5);
      this.add
        .text(x + offsetX, ratingsY + 20, '⭐'.repeat(card[stat]), {
          fontFamily: FONT,
          fontSize: '12px',
          color: '#ffffff',
        })
        .setOrigin(0.5);
    }

    this.add
      .text(x, y + 175, 'Click to Play', {
        fontFamily: FONT,
        fontSize: '12px',
        color: '#888888',
        fontStyle: 'italic',
        stroke: '#000',
        strokeThickness: 1,
      })
      .setOrigin(0.5);
  }
}
