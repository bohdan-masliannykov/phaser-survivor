export class HealthBar extends Phaser.GameObjects.Container {
  private maxHealth: number;
  private health: number;
  private readonly barWidth: number;
  private readonly bar: Phaser.GameObjects.Rectangle;
  private readonly show: boolean = false;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    maxHealth: number,
    show: boolean = false
  ) {
    super(scene, x, y);
    scene.add.existing(this);
    this.show = show;
    this.barWidth = width;
    this.maxHealth = maxHealth;
    this.health = maxHealth;
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

  private updateBar(): void {
    if (!this.show) return;
    const ratio = Phaser.Math.Clamp(this.health / this.maxHealth, 0, 1);
    this.bar.displayWidth = this.barWidth * ratio;
  }

  takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
    this.updateBar();

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

  heal(amount: number): void {
    this.health = Math.min(this.maxHealth, this.health + amount);
    this.updateBar();
  }

  isDead(): boolean {
    return this.health <= 0;
  }
}
