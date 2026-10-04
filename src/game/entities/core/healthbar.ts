import { showDamageNumber } from './damage-numbers';

export class HealthBar extends Phaser.GameObjects.Container {
  private readonly barWidth: number;
  private readonly bar: Phaser.GameObjects.Rectangle;
  private readonly show: boolean = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    show: boolean = false
  ) {
    super(scene, x, y);
    scene.add.existing(this);
    this.show = show;
    this.barWidth = width;
    const background = scene.add
      .rectangle((width / 2) * -1, -15, width, height, 0x555555)
      .setOrigin(0, 0);
    this.bar = scene.add.rectangle((width / 2) * -1, -15, width, height, 0x00ff00).setOrigin(0, 0);

    background.setVisible(this.show);
    this.bar.setVisible(this.show);
    this.add([background, this.bar]);
  }

  updateDisplay(ratio: number): void {
    if (!this.show) return;
    const clamped = Phaser.Math.Clamp(ratio, 0, 1);
    this.bar.displayWidth = this.barWidth * clamped;
  }

  showDamageText(amount: number): void {
    showDamageNumber(this.scene, this.x, this.y, amount);
  }

  hideBar(): void {
    this.setVisible(false);
  }

  showBar() {
    this.setVisible(true);
  }
}
