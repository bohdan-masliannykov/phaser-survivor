import { PLAYER_SPEED, SPRITE_SCALE } from '../constants';

export class Player extends Phaser.GameObjects.Sprite {
  velocity: Phaser.Math.Vector2 = new Phaser.Math.Vector2(0, 0);
  speed = PLAYER_SPEED; // pixels per second

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player', 0);
    this.setScale(SPRITE_SCALE);
    scene.add.existing(this);

    this.play('player-idle');
  }

  update(directions: { x: number; y: number }, delta: number) {
    const isMoving = directions.x !== 0 || directions.y !== 0;
    const desired = isMoving ? 'player-walk' : 'player-idle';

    if (this.anims.currentAnim?.key !== desired) {
      this.play(desired);
    }

    this.velocity.set(directions.x, directions.y).normalize();
    this.setFlipX(this.velocity.x < 0);

    const deltaSeconds = delta / 1000;
    this.x += this.velocity.x * deltaSeconds * this.speed;
    this.y += this.velocity.y * deltaSeconds * this.speed;
  }
}
