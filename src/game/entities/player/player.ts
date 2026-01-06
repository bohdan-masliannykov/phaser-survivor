import { PLAYER_SPEED, SPRITE_SCALE } from '@constants';
import { GameObject } from '@entities/core/game-object';

export class Player extends GameObject {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'player', PLAYER_SPEED, SPRITE_SCALE, {
      maxHealth: 100,
      barWidth: 28,
      barHeight: 4,
      barOffsetY: 20,
    });
    this.play('player-idle');
  }

  update(directions: { x: number; y: number }, delta: number) {
    const isMoving = directions.x !== 0 || directions.y !== 0;
    const desired = isMoving ? 'player-walk' : 'player-idle';

    if (this.anims.currentAnim?.key !== desired) {
      this.play(desired);
    }

    if (isMoving) {
      this.velocity.set(directions.x, directions.y).normalize();
    } else {
      this.velocity.set(0, 0);
    }

    if (this.velocity.x !== 0) {
      this.setFlipX(this.velocity.x < 0);
    }

    super.move(delta);
  }
}
