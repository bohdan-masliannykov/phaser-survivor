import { PLAYER } from '@constants';

interface CharacterInfo {
  key: string;
  name: string;
  description: string;
  stats: {
    damage: string;
    speed: string;
    range: string;
  };
}

const CHARACTERS: CharacterInfo[] = [
  {
    key: PLAYER.soldier.key,
    name: 'Soldier',
    description: 'Swift melee fighter with spinning slash',
    stats: {
      damage: '⭐⭐⭐',
      speed: '⭐⭐⭐',
      range: '⭐',
    },
  },
  {
    key: PLAYER.wizzard.key,
    name: 'Wizard',
    description: 'Ranged spellcaster with piercing fireballs',
    stats: {
      damage: '⭐⭐⭐',
      speed: '⭐⭐',
      range: '⭐⭐⭐',
    },
  },
  {
    key: PLAYER.archer.key,
    name: 'Archer',
    description: 'Precise archer with rapid arrows',
    stats: {
      damage: '⭐⭐',
      speed: '⭐⭐⭐',
      range: '⭐⭐⭐',
    },
  },
  {
    key: PLAYER.priest.key,
    name: 'Priest',
    description: 'Holy aura dealer with damage over time',
    stats: {
      damage: '⭐⭐',
      speed: '⭐⭐',
      range: '⭐⭐',
    },
  },
];

export class CharacterSelectionScene extends Phaser.Scene {
  constructor() {
    super({ key: 'CharacterSelectionScene' });
  }

  preload(): void {
    // Load spritesheets if not already loaded (should be from PreloadScene, but just in case)
    this.load.spritesheet(PLAYER.soldier.key, `/assets/${PLAYER.soldier.key}.png`, {
      frameWidth: 100,
      frameHeight: 100,
    });
    this.load.spritesheet(PLAYER.wizzard.key, `/assets/${PLAYER.wizzard.key}.png`, {
      frameWidth: 100,
      frameHeight: 100,
    });
    this.load.spritesheet(PLAYER.archer.key, `/assets/${PLAYER.archer.key}.png`, {
      frameWidth: 100,
      frameHeight: 100,
    });
    this.load.spritesheet(PLAYER.priest.key, `/assets/${PLAYER.priest.key}.png`, {
      frameWidth: 100,
      frameHeight: 100,
    });
  }

  create(): void {
    // Background
    this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x1a1a2e)
      .setOrigin(0, 0)
      .setDepth(0);

    // Create animations for idle walk
    this.createCharacterAnimations();

    // Title
    this.add
      .text(this.scale.width / 2, 30, 'PHASER SURVIVOR', {
        fontFamily: 'monospace',
        fontSize: '42px',
        color: '#ffdd44',
        stroke: '#000',
        strokeThickness: 6,
      })
      .setOrigin(0.5, 0);

    this.add
      .text(this.scale.width / 2, 80, 'Select Your Character', {
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#cccccc',
        stroke: '#000',
        strokeThickness: 2,
      })
      .setOrigin(0.5, 0);

    // Character cards - side by side
    const cardWidth = 300;
    const gap = 30;
    const totalWidth = cardWidth * CHARACTERS.length + gap * (CHARACTERS.length - 1);
    const startX = (this.scale.width - totalWidth) / 2;

    CHARACTERS.forEach((char, index) => {
      const cardX = startX + index * (cardWidth + gap) + cardWidth / 2;
      const cardY = this.scale.height / 2 + 40;
      this.drawCharacterCard(cardX, cardY, char);
    });
  }

  private createCharacterAnimations(): void {
    // Soldier idle
    if (!this.anims.exists('soldier-select-idle')) {
      const soldierIdle = PLAYER.soldier.animations.idle;
      this.anims.create({
        key: 'soldier-select-idle',
        frames: this.anims.generateFrameNumbers(PLAYER.soldier.key, {
          start: soldierIdle.start,
          end: soldierIdle.end,
        }),
        frameRate: 6,
        repeat: -1,
      });
    }

    // Soldier walk
    if (!this.anims.exists('soldier-select-walk')) {
      const soldierWalk = PLAYER.soldier.animations.walk;
      this.anims.create({
        key: 'soldier-select-walk',
        frames: this.anims.generateFrameNumbers(PLAYER.soldier.key, {
          start: soldierWalk.start,
          end: soldierWalk.end,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    // Wizard idle
    if (!this.anims.exists('wizzard-select-idle')) {
      const wizardIdle = PLAYER.wizzard.animations.idle;
      this.anims.create({
        key: 'wizzard-select-idle',
        frames: this.anims.generateFrameNumbers(PLAYER.wizzard.key, {
          start: wizardIdle.start,
          end: wizardIdle.end,
        }),
        frameRate: 6,
        repeat: -1,
      });
    }

    // Wizard walk
    if (!this.anims.exists('wizzard-select-walk')) {
      const wizardWalk = PLAYER.wizzard.animations.walk;
      this.anims.create({
        key: 'wizzard-select-walk',
        frames: this.anims.generateFrameNumbers(PLAYER.wizzard.key, {
          start: wizardWalk.start,
          end: wizardWalk.end,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    // Archer idle
    if (!this.anims.exists('archer-select-idle')) {
      const archerIdle = PLAYER.archer.animations.idle;
      this.anims.create({
        key: 'archer-select-idle',
        frames: this.anims.generateFrameNumbers(PLAYER.archer.key, {
          start: archerIdle.start,
          end: archerIdle.end,
        }),
        frameRate: 6,
        repeat: -1,
      });
    }

    // Archer walk
    if (!this.anims.exists('archer-select-walk')) {
      const archerWalk = PLAYER.archer.animations.walk;
      this.anims.create({
        key: 'archer-select-walk',
        frames: this.anims.generateFrameNumbers(PLAYER.archer.key, {
          start: archerWalk.start,
          end: archerWalk.end,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }

    // Priest idle
    if (!this.anims.exists('priest-select-idle')) {
      const priestIdle = PLAYER.priest.animations.idle;
      this.anims.create({
        key: 'priest-select-idle',
        frames: this.anims.generateFrameNumbers(PLAYER.priest.key, {
          start: priestIdle.start,
          end: priestIdle.end,
        }),
        frameRate: 6,
        repeat: -1,
      });
    }

    // Priest walk
    if (!this.anims.exists('priest-select-walk')) {
      const priestWalk = PLAYER.priest.animations.walk;
      this.anims.create({
        key: 'priest-select-walk',
        frames: this.anims.generateFrameNumbers(PLAYER.priest.key, {
          start: priestWalk.start,
          end: priestWalk.end,
        }),
        frameRate: 10,
        repeat: -1,
      });
    }
  }

  private drawCharacterCard(x: number, y: number, char: CharacterInfo): void {
    const cardWidth = 300;
    const cardHeight = 400;

    // Card background
    const bg = this.add
      .rectangle(x, y, cardWidth, cardHeight, 0x222244, 0.85)
      .setStrokeStyle(3, 0x4da6ff)
      .setInteractive({ useHandCursor: true });

    // Glow on hover
    bg.on('pointerover', () => {
      bg.setStrokeStyle(4, 0xffdd44);
      bg.setFillStyle(0x333355, 0.95);
    });
    bg.on('pointerout', () => {
      bg.setStrokeStyle(3, 0x4da6ff);
      bg.setFillStyle(0x222244, 0.85);
    });

    bg.on('pointerdown', () => {
      this.scene.start('GameScene', { characterType: char.key });
    });

    // Character portrait with walk animation
    const idleAnim = char.key === 'soldier' ? 'soldier-select-idle' : char.key === 'wizzard' ? 'wizzard-select-idle' : char.key === 'archer' ? 'archer-select-idle' : 'priest-select-idle';
    const walkAnim = char.key === 'soldier' ? 'soldier-select-walk' : char.key === 'wizzard' ? 'wizzard-select-walk' : char.key === 'archer' ? 'archer-select-walk' : 'priest-select-walk';

    const portrait = this.add
      .sprite(x, y - 80, char.key)
      .setScale(3.5)
      .play(idleAnim);

    // Walking animation on hover
    bg.on('pointerover', () => {
      portrait.play(walkAnim);
    });
    bg.on('pointerout', () => {
      portrait.play(idleAnim);
    });

    // Character name
    this.add
      .text(x, y + 40, char.name, {
        fontFamily: 'monospace',
        fontSize: '26px',
        color: '#ffdd44',
        stroke: '#000',
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    // Description
    this.add
      .text(x, y + 70, char.description, {
        fontFamily: 'monospace',
        fontSize: '11px',
        color: '#bbbbbb',
        wordWrap: { width: cardWidth - 40 },
        align: 'center',
      })
      .setOrigin(0.5);

    // Stats section
    const statsY = y + 120;

    // Damage
    this.add
      .text(x - 80, statsY, 'DMG', {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#ffaa44',
        stroke: '#000',
        strokeThickness: 2,
      })
      .setOrigin(0.5);
    this.add
      .text(x - 80, statsY + 20, char.stats.damage, {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    // Speed
    this.add
      .text(x, statsY, 'SPD', {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#44aaff',
        stroke: '#000',
        strokeThickness: 2,
      })
      .setOrigin(0.5);
    this.add
      .text(x, statsY + 20, char.stats.speed, {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    // Range
    this.add
      .text(x + 80, statsY, 'RNG', {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#44ff44',
        stroke: '#000',
        strokeThickness: 2,
      })
      .setOrigin(0.5);
    this.add
      .text(x + 80, statsY + 20, char.stats.range, {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    // Click hint
    this.add
      .text(x, y + 175, 'Click to Play', {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#888888',
        fontStyle: 'italic',
        stroke: '#000',
        strokeThickness: 1,
      })
      .setOrigin(0.5);
  }
}
