import type { HitboxConfig } from '@entities/core/game-object';
import { Projectile } from './projectile';

const hitboxConfig: HitboxConfig = {
  widthPercent: 0.19,
  heightPercent: 0.19,
  offsetXPercent: (1 - 0.19) / 2,
  offsetYPercent: (1 - 0.19) / 2,
};

export class Fireball extends Projectile {
  pierce: number = 1;
  readonly hitEnemies: Set<string> = new Set();

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    direction: { x: number; y: number },
    pierce: number = 1
  ) {
    super(scene, x, y, direction, 250, 8000);
    this.pierce = pierce;
    const dx = direction.x;
    const dy = direction.y;
    const angle = Math.atan2(dy, dx);
    this.rotation = angle;

    this.setTexture('fireball');
    this.setScale(1.5);
    this.setDepth(5);

    this.play('fireball_launch');
    this.updateBodyForScale(false, hitboxConfig);
  }

  isAlive(): boolean {
    return this.pierce > 0;
  }

  onEnemyHit(): void {
    this.pierce--;
    if (this.isAlive() === false) {
      this.destroy();
    }
  }
}
