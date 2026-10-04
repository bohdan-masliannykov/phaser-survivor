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
    this.bar = scene.add
      .rectangle((width / 2) * -1, -15, width, height, 0x00ff00)
      .setOrigin(0, 0);

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
    const dmgText = this.scene.add.text(this.x, this.y, amount.toString(), {
      font: '16px monospace',
      color: '#fff',
      stroke: '#000',
      strokeThickness: 3,
    });
    this.scene.tweens.add({
      targets: dmgText,
      y: this.y - 20,
      alpha: 0,
      duration: 500,
      onComplete: () => dmgText.destroy(),
    });
  }

  hideBar(): void {
    this.setVisible(false);
  }

  showBar() {
    this.setVisible(true);
  }
}
