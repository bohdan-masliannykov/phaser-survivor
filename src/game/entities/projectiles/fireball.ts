import { Projectile } from './projectile';

export class Fireball extends Projectile {
  pierce: number = 1; // TODO test piercing

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    direction: { x: number; y: number }
  ) {
    super(scene, x, y, direction, 150, 8000);
    const dx = direction.x;
    const dy = direction.y;
    const angle = Math.atan2(dy, dx);
    this.rotation = angle;

    this.setTexture('fireball');
    this.setScale(1.3);
    this.setDepth(5);

    this.play('fireball_launch');
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
