export class HealthBar extends Phaser.GameObjects.Container {
  private maxHealth: number;
  private health: number;
  private readonly barWidth: number;
  private readonly bar: Phaser.GameObjects.Rectangle;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    maxHealth: number
  ) {
    super(scene, x, y);
    scene.add.existing(this);
    this.barWidth = width;
    this.maxHealth = maxHealth;
    this.health = maxHealth;

    const background = scene.add
      .rectangle((width / 2) * -1, -15, width, height, 0x555555)
      .setOrigin(0, 0);
    this.bar = scene.add
      .rectangle((width / 2) * -1, -15, width, height, 0x00ff00)
      .setOrigin(0, 0);

    this.add([background, this.bar]);
  }

  private updateBar(): void {
    const ratio = Phaser.Math.Clamp(this.health / this.maxHealth, 0, 1);
    this.bar.displayWidth = this.barWidth * ratio;
  }

  takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
    this.updateBar();
  }

  heal(amount: number): void {
    this.health = Math.min(this.maxHealth, this.health + amount);
    this.updateBar();
  }

  isDead(): boolean {
    return this.health <= 0;
  }
}
