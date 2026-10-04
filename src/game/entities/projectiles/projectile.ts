import { gameClock } from '@system/game-clock';

export interface ProjectileDef {
  texture: string;
  speed: number; // pixels per second
  lifetimeMs: number;
  scale: number;
  animation?: string;
}

export const PROJECTILES = {
  arrow: { texture: 'arrow', speed: 300, lifetimeMs: 8000, scale: 1.2 },
  fireball: {
    texture: 'fireball',
    speed: 250,
    lifetimeMs: 8000,
    scale: 1.5,
    animation: 'fireball_launch',
  },
} satisfies Record<string, ProjectileDef>;

export class Projectile extends Phaser.Physics.Arcade.Sprite {
  readonly hitEnemies: Set<string> = new Set();
  private pierce: number;
  private readonly birthTime: number;
  private readonly lifetimeMs: number;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    direction: { x: number; y: number },
    def: ProjectileDef,
    pierce: number = 1
  ) {
    super(scene, x, y, def.texture, 0);
    this.setOrigin(0.5, 0.5);
    this.setScale(def.scale);
    this.setDepth(5);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.pierce = pierce;
    this.birthTime = gameClock.now;
    this.lifetimeMs = def.lifetimeMs;
    this.rotation = Math.atan2(direction.y, direction.x);
    if (def.animation) this.play(def.animation);

    const length = Math.hypot(direction.x, direction.y) || 1;
    this.setVelocity((direction.x / length) * def.speed, (direction.y / length) * def.speed);
  }

  isExpired(): boolean {
    return gameClock.now - this.birthTime >= this.lifetimeMs;
  }

  isAlive(): boolean {
    return this.pierce > 0;
  }

  onEnemyHit(): void {
    this.pierce--;
    if (!this.isAlive()) {
      this.destroy();
    }
  }
}
