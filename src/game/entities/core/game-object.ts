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

export type HitboxConfig = {
  widthPercent: number;
  heightPercent: number;
  offsetXPercent: number;
  offsetYPercent: number;
};

export class GameObject extends Phaser.Physics.Arcade.Sprite {
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

  move(directions: { x: number; y: number }): void {
    const norm = Math.sqrt(
      directions.x * directions.x + directions.y * directions.y
    );

    if (norm > 0) {
      const vx = (directions.x / (norm || 1)) * this.speed;
      const vy = (directions.y / (norm || 1)) * this.speed;
      this.setVelocity(vx, vy);
    } else {
      this.setVelocity(0, 0);
    }

    // Update health bar position to follow sprite
    if (this.healthBar && this.body) {
      this.healthBar.setPosition(
        this.body.center.x,
        this.body.bottom + this.barOffsetY
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

  /**
   * Updates the body size and offset based on the current scale and facing direction.
   * Optionally pass isLeft to flip the offset horizontally.
   * Accepts a config object for hitbox percentages.
   */
  updateBodyForScale(isLeft: boolean = false, config: HitboxConfig): void {
    const body = this.body as Phaser.Physics.Arcade.Body;

    const frameWidth = this.width / this.scaleX;
    const frameHeight = this.height / this.scaleY;

    const { widthPercent, heightPercent, offsetXPercent, offsetYPercent } =
      config;

    const bodyWidth = frameWidth * widthPercent * this.scaleX;
    const bodyHeight = frameHeight * heightPercent * this.scaleY;
    const offsetY = frameHeight * offsetYPercent * this.scaleY;
    const offsetX = isLeft
      ? frameWidth * (1 - offsetXPercent - widthPercent) * this.scaleX
      : frameWidth * offsetXPercent * this.scaleX;

    body.setSize(bodyWidth, bodyHeight);
    body.setOffset(offsetX, offsetY);
  }

  destroyWithAnimation(deathAnimKey?: string, fromScene?: boolean): void {
    this.setVelocity(0, 0);
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
