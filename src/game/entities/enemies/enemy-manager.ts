import { ENEMY_SPAWN_INTERVAL_MS, SPAWN_MARGIN } from '@constants';
import type { Enemy } from './enemy';
import { EnemyFactory } from './enemy-factory';
import type { GameScene } from '@scenes/game-scene';

// TODO : convert to Phaser.Group when switching to Arcade Physics
// add different behaviors for enemies spawning (waves, boss fights, etc)

export class EnemyManager {
  declare scene: GameScene;

  private enemiesGroup: Phaser.GameObjects.Group;

  constructor(scene: GameScene) {
    this.scene = scene;
    this.enemiesGroup = this.scene.physics.add.group();
  }

  initializeSpawner() {
    this.scene.time.addEvent({
      delay: ENEMY_SPAWN_INTERVAL_MS,
      loop: true,
      callback: () => {
        // IMPORTANT: when camera follows the player, screen coordinates (0..width/height)
        // are NOT the same as world coordinates. GameObjects use world coordinates.
        // To spawn enemies just outside what the player currently sees, use camera.worldView.
        const view = this.scene.cameras.main.worldView;

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
        const enemy = EnemyFactory.createRandomEnemy(this.scene, x, y);

        this.addEnemy(enemy);
      },
    });

    this.scene.physics.add.collider(this.enemiesGroup, this.enemiesGroup);
    this.scene.physics.add.collider(this.enemiesGroup, this.scene.player);
  }

  getEnemies(): Enemy[] {
    return this.enemiesGroup.getChildren() as Enemy[];
  }

  updateEnemies(playerX: number, playerY: number): void {
    this.getEnemies().forEach((enemy) =>
      (enemy as Enemy).update(playerX, playerY)
    );
  }

  addEnemy(enemy: Enemy): void {
    this.enemiesGroup.add(enemy);
  }

  removeEnemy(enemy: Enemy): void {
    this.enemiesGroup.remove(enemy);
  }
}
