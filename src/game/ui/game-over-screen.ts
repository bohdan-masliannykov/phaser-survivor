import type { ProgressionSystem } from '@system/progression-system';

export class GameOverScreen {
  private scene: Phaser.Scene;
  private elements: Phaser.GameObjects.GameObject[] = [];

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  show(progression: ProgressionSystem): void {
    const cx = this.scene.scale.width / 2;
    const cy = this.scene.scale.height / 2;

    const overlay = this.scene.add
      .rectangle(cx, cy, this.scene.scale.width, this.scene.scale.height, 0x000000, 0.75)
      .setScrollFactor(0)
      .setDepth(300);
    this.elements.push(overlay);

    const title = this.scene.add
      .text(cx, cy - 100, 'GAME OVER', {
        fontFamily: 'monospace',
        fontSize: '48px',
        color: '#ff4444',
        stroke: '#000',
        strokeThickness: 6,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(301);
    this.elements.push(title);

    const stats = [
      `Time: ${progression.getElapsedFormatted()}`,
      `Kills: ${progression.kills}`,
      `Level: ${progression.level}`,
    ];
    const statsText = this.scene.add
      .text(cx, cy - 10, stats.join('\n'), {
        fontFamily: 'monospace',
        fontSize: '20px',
        color: '#ffffff',
        stroke: '#000',
        strokeThickness: 3,
        align: 'center',
        lineSpacing: 8,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(301);
    this.elements.push(statsText);

    const btn = this.scene.add
      .rectangle(cx, cy + 100, 200, 50, 0x44aa44, 0.9)
      .setStrokeStyle(2, 0x66ff66)
      .setScrollFactor(0)
      .setDepth(302)
      .setInteractive({ useHandCursor: true });

    const btnText = this.scene.add
      .text(cx, cy + 100, 'RESTART', {
        fontFamily: 'monospace',
        fontSize: '22px',
        color: '#ffffff',
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(303);

    btn.on('pointerover', () => btn.setFillStyle(0x55bb55, 0.95));
    btn.on('pointerout', () => btn.setFillStyle(0x44aa44, 0.9));
    btn.on('pointerdown', () => {
      this.scene.scene.start('CharacterSelectionScene');
    });

    this.elements.push(btn, btnText);
  }

  isVisible(): boolean {
    return this.elements.length > 0;
  }
}
