import { Enemy } from '@entities/enemies/enemy';
import { Player } from '@entities/player/player';
import {
  ENEMY_SPAWN_INTERVAL_MS,
  FIRE_INTERVAL_MS,
  PROJECTILE_HIT_RADIUS,
  PROJECTILE_LIFETIME_MS,
  PROJECTILE_SPEED,
  SPAWN_MARGIN,
} from '@constants';
import { Landscape } from '@entities/environment/landscape';
import { InputSystem } from '@system/input-system';
import { Projectile } from '@entities/projectiles/projectile';

export class GameScene extends Phaser.Scene {
  inputSystem!: InputSystem;
  player!: Player;
  enemies: Enemy[] = [];
  projectiles: Projectile[] = [];
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

    this.inputSystem = new InputSystem(this);

    // Auto-fire: shoot toward the nearest enemy on an interval.
    this.time.addEvent({
      delay: FIRE_INTERVAL_MS,
      loop: true,
      callback: () => this.fireAtNearestEnemy(),
    });

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
    const move = this.inputSystem.getMoveIntent();

    this.player.update(move, delta);
    this.enemies.forEach((enemy) =>
      enemy.update(this.player.x, this.player.y, delta)
    );

    this.updateProjectiles(delta);

    this.landscape.update(this.cameras.main);
  }

  private fireAtNearestEnemy(): void {
    if (this.enemies.length === 0) return;

    const px = this.player.x;
    const py = this.player.y;

    let nearest: Enemy | undefined;
    let bestD2 = Number.POSITIVE_INFINITY;

    for (const enemy of this.enemies) {
      const dx = enemy.x - px;
      const dy = enemy.y - py;
      const d2 = dx * dx + dy * dy;
      if (d2 < bestD2) {
        bestD2 = d2;
        nearest = enemy;
      }
    }

    if (!nearest) return;

    const dx = nearest.x - px;
    const dy = nearest.y - py;

    const projectile = new Projectile(
      this,
      px,
      py,
      { x: dx, y: dy },
      PROJECTILE_SPEED,
      PROJECTILE_LIFETIME_MS
    );
    this.projectiles.push(projectile);
  }

  private updateProjectiles(delta: number): void {
    const hitR2 = PROJECTILE_HIT_RADIUS * PROJECTILE_HIT_RADIUS;

    // Iterate backwards so we can remove items safely.
    for (let pIndex = this.projectiles.length - 1; pIndex >= 0; pIndex--) {
      const p = this.projectiles[pIndex];
      const alive = p.update(delta);

      if (!alive) {
        p.destroy();
        this.projectiles.splice(pIndex, 1);
        continue;
      }

      // Naive collision: bullet vs all enemies (fine for early prototype).
      for (let eIndex = this.enemies.length - 1; eIndex >= 0; eIndex--) {
        const e = this.enemies[eIndex];
        const dx = e.x - p.x;
        const dy = e.y - p.y;

        if (dx * dx + dy * dy <= hitR2) {
          // Prototype behavior: delete enemy on hit.
          e.takeDamage(25);
          if (e.isDead()) {
            e.destroyWithAnimation('enemy-death', true);
            this.enemies.splice(eIndex, 1);
          }

          p.destroy();
          this.projectiles.splice(pIndex, 1);
          break;
        }
      }
    }
  }
}
