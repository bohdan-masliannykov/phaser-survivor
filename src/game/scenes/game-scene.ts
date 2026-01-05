import { Enemy } from '@entities/enemy';
import { Player } from '@entities/player';
import { ENEMY_SPAWN_INTERVAL_MS, SPAWN_MARGIN } from '../constants';
import { Landscape } from '@entities/landscape';

type MovementKeys = {
  UP: Phaser.Input.Keyboard.Key;
  DOWN: Phaser.Input.Keyboard.Key;
  LEFT: Phaser.Input.Keyboard.Key;
  RIGHT: Phaser.Input.Keyboard.Key;
};

export class GameScene extends Phaser.Scene {
  player!: Player;
  directions!: MovementKeys;
  enemies: Enemy[] = [];
  landscape!: Landscape;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    this.player = new Player(this, this.scale.width / 2, this.scale.height / 2);
    this.cameras.main.startFollow(this.player); // Camera follow moves the *view* (camera), not the world
    // Helps avoid 1px seams with pixel-art tiles when camera scrolls at sub-pixel values.
    this.cameras.main.roundPixels = true;
    this.landscape = new Landscape(
      this,
      0,
      0,
      this.scale.width,
      this.scale.height
    );

    this.directions = this.input.keyboard!.addKeys({
      UP: Phaser.Input.Keyboard.KeyCodes.W,
      DOWN: Phaser.Input.Keyboard.KeyCodes.S,
      LEFT: Phaser.Input.Keyboard.KeyCodes.A,
      RIGHT: Phaser.Input.Keyboard.KeyCodes.D,
    }) as MovementKeys;

    this.time.addEvent({
      delay: ENEMY_SPAWN_INTERVAL_MS,
      loop: true,
      callback: () => {
        // IMPORTANT: when camera follows the player, screen coordinates (0..width/height)
        // are NOT the same as world coordinates. GameObjects use world coordinates.
        // To spawn enemies just outside what the player currently sees, use camera.worldView.
        const view = this.cameras.main.worldView;

        const left = view.x;
        const top = view.y;
        const right = view.x + view.width;
        const bottom = view.y + view.height;

        // Spawn a bit outside the visible rectangle so enemies walk into view.
        const margin = SPAWN_MARGIN;
        const side = Phaser.Math.Between(0, 3);

        let x: number;
        let y: number;

        switch (side) {
          case 0: // top
            x = Phaser.Math.FloatBetween(left, right);
            y = top - margin;
            break;
          case 1: // right
            x = right + margin;
            y = Phaser.Math.FloatBetween(top, bottom);
            break;
          case 2: // bottom
            x = Phaser.Math.FloatBetween(left, right);
            y = bottom + margin;
            break;
          default: // left
            x = left - margin;
            y = Phaser.Math.FloatBetween(top, bottom);
            break;
        }

        // For now we keep enemies in a plain array and update them manually.
        // Later (when/if you switch to Arcade Physics), this often becomes a physics group.
        this.enemies.push(new Enemy(this, x, y));
      },
    });
  }

  update(_time: number, delta: number): void {
    const directions = { x: 0, y: 0 };

    if (this.directions.UP.isDown) {
      directions.y -= 1;
    }

    if (this.directions.DOWN.isDown) {
      directions.y += 1;
    }

    if (this.directions.LEFT.isDown) {
      directions.x -= 1;
    }

    if (this.directions.RIGHT.isDown) {
      directions.x += 1;
    }

    this.player.update(directions, delta);
    this.enemies.forEach((enemy) =>
      enemy.update(this.player.x, this.player.y, delta)
    );

    this.landscape.update(this.cameras.main);
  }
}
