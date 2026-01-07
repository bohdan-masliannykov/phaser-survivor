import { HealthBar } from './healthbar';

type HealthOptions = {
  maxHealth?: number;
  barWidth?: number;
  barHeight?: number;
  barOffsetY?: number;
  show?: boolean;
};

type ObjectAnimation = {
  idle: string;
  walk: string;
  death: string;
};

export class GameObject extends Phaser.Physics.Arcade.Sprite {
  velocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);
  speed: number = 0; // pixels per second
  maxHealth: number = 100;
  health: number = 100;
  healthBar?: HealthBar;
  private barOffsetY: number = 12;
  animations: ObjectAnimation = {
    idle: 'idle',
    walk: 'walk',
    death: 'death',
  };
  healthOptions?: HealthOptions;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    speed: number,
    scale: number = 1,
    healthOptions?: HealthOptions,
    animations?: ObjectAnimation
  ) {
    super(scene, x, y, texture);

    this.animations = animations ?? {
      idle: 'idle',
      walk: 'walk',
      death: 'death',
    };
    this.speed = speed;
    this.setScale(scale);

    if (healthOptions) {
      this.maxHealth = healthOptions.maxHealth ?? this.maxHealth;
      this.health = this.maxHealth;
      this.barOffsetY = healthOptions.barOffsetY ?? this.barOffsetY;
      this.healthBar = new HealthBar(
        scene,
        x,
        y - this.barOffsetY,
        healthOptions.barWidth ?? 24,
        healthOptions.barHeight ?? 4,
        this.maxHealth,
        healthOptions.show
      );
    }
    this.setOrigin(0.5, 0.5);
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }

  move(delta: number): void {
    const deltaSeconds = Math.min(delta / 1000, 1 / 15);
    this.x += this.velocity.x * deltaSeconds * this.speed;
    this.y += this.velocity.y * deltaSeconds * this.speed;
    if (this.healthBar) {
      this.healthBar.setPosition(
        this.x - this.healthBar.width / 2,
        this.y - this.barOffsetY
      );
    }
  }

  takeDamage(amount: number): void {
    this.health = Math.max(0, this.health - amount);
    this.healthBar?.takeDamage(amount);
  }

  heal(amount: number): void {
    this.health = Math.min(this.maxHealth, this.health + amount);
    this.healthBar?.heal(amount);
  }

  isDead(): boolean {
    return this.health <= 0;
  }

  destroy(fromScene?: boolean): void {
    this.healthBar?.destroy();
    super.destroy(fromScene);
  }

  applyKnockback(fromX: number, fromY: number, force: number) {
    const dx = this.x - fromX;
    const dy = this.y - fromY;
    const length = Math.sqrt(dx * dx + dy * dy) || 1;
    const knockbackX = (dx / length) * force;
    const knockbackY = (dy / length) * force;

    this.x += knockbackX;
    this.y += knockbackY;
  }

  destroyWithAnimation(deathAnimKey?: string, fromScene?: boolean): void {
    this.velocity.set(0, 0);
    this.healthBar?.setVisible(false);

    this.play(deathAnimKey ?? this.animations.death).once(
      'animationcomplete',
      () => {
        this.healthBar?.destroy();
        super.destroy(fromScene);
      }
    );
  }
}
