import type { ProgressionSystem } from '@system/progression-system';
import type { Player } from '@entities/player/player';

const TEXT_STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
  fontFamily: 'monospace',
  fontSize: '16px',
  color: '#ffffff',
  stroke: '#000000',
  strokeThickness: 3,
};

export class GameHud {
  private timerText: Phaser.GameObjects.Text;
  private killsText: Phaser.GameObjects.Text;
  private levelText: Phaser.GameObjects.Text;
  private xpBarBg: Phaser.GameObjects.Rectangle;
  private xpBarFill: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene) {
    const pad = 12;

    this.timerText = scene.add
      .text(scene.scale.width / 2, pad, '0:00', {
        ...TEXT_STYLE,
        fontSize: '22px',
      })
      .setOrigin(0.5, 0)
      .setScrollFactor(0)
      .setDepth(100);

    this.killsText = scene.add
      .text(scene.scale.width - pad, pad, 'Kills: 0', TEXT_STYLE)
      .setOrigin(1, 0)
      .setScrollFactor(0)
      .setDepth(100);

    this.levelText = scene.add
      .text(pad, pad, 'Lv 1', TEXT_STYLE)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(100);

    // XP bar across top
    const barWidth = scene.scale.width - pad * 2;
    const barY = pad + 28;
    this.xpBarBg = scene.add
      .rectangle(pad, barY, barWidth, 8, 0x333333)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(100);

    this.xpBarFill = scene.add
      .rectangle(pad, barY, 0, 8, 0x00ff88)
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(100);
  }

  update(progression: ProgressionSystem, _player: Player): void {
    this.timerText.setText(progression.getElapsedFormatted());
    this.killsText.setText(`Kills: ${progression.kills}`);
    this.levelText.setText(`Lv ${progression.level}`);

    const progress = progression.getXpProgress();
    const maxWidth = this.xpBarBg.width;
    this.xpBarFill.width = maxWidth * progress;
  }

  destroy(): void {
    this.timerText.destroy();
    this.killsText.destroy();
    this.levelText.destroy();
    this.xpBarBg.destroy();
    this.xpBarFill.destroy();
  }
}
