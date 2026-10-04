import type { Player } from '@entities/player/player';
import { rollUpgrades } from '../upgrades';

const CHOICE_COUNT = 3;

export class UpgradePicker {
  private scene: Phaser.Scene;
  private elements: Phaser.GameObjects.GameObject[] = [];
  private onPicked?: () => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  show(player: Player, onPicked: () => void): void {
    this.onPicked = onPicked;

    const choices = rollUpgrades(player, CHOICE_COUNT);

    const cx = this.scene.scale.width / 2;
    const cy = this.scene.scale.height / 2;

    // Dim overlay — added directly to scene, not a container
    const overlay = this.scene.add
      .rectangle(cx, cy, this.scene.scale.width, this.scene.scale.height, 0x000000, 0.6)
      .setScrollFactor(0)
      .setDepth(200);
    this.elements.push(overlay);

    // Title
    const title = this.scene.add
      .text(cx, cy - 140, 'LEVEL UP!', {
        fontFamily: 'monospace',
        fontSize: '32px',
        color: '#ffdd44',
        stroke: '#000',
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(201);
    this.elements.push(title);

    // Cards
    const cardWidth = 180;
    const cardHeight = 160;
    const gap = 20;
    const totalWidth = choices.length * cardWidth + (choices.length - 1) * gap;
    const startX = cx - totalWidth / 2 + cardWidth / 2;

    choices.forEach((upgrade, i) => {
      const cardX = startX + i * (cardWidth + gap);
      const cardY = cy + 20;

      const bg = this.scene.add
        .rectangle(cardX, cardY, cardWidth, cardHeight, 0x222222, 0.9)
        .setStrokeStyle(2, upgrade.color)
        .setScrollFactor(0)
        .setDepth(202)
        .setInteractive({ useHandCursor: true });

      const name = this.scene.add
        .text(cardX, cardY - 40, upgrade.name, {
          fontFamily: 'monospace',
          fontSize: '16px',
          color: '#ffffff',
          stroke: '#000',
          strokeThickness: 2,
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(203);

      const desc = this.scene.add
        .text(cardX, cardY + 10, upgrade.description, {
          fontFamily: 'monospace',
          fontSize: '12px',
          color: '#cccccc',
          wordWrap: { width: cardWidth - 20 },
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(203);

      bg.on('pointerover', () => bg.setFillStyle(0x333344, 0.95));
      bg.on('pointerout', () => bg.setFillStyle(0x222222, 0.9));

      bg.on('pointerdown', () => {
        upgrade.apply(player);
        this.hide();
        this.onPicked?.();
      });

      this.elements.push(bg, name, desc);
    });
  }

  hide(): void {
    for (const el of this.elements) {
      el.destroy();
    }
    this.elements.length = 0;
  }

  isVisible(): boolean {
    return this.elements.length > 0;
  }
}
