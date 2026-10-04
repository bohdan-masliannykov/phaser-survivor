import type { Enemy } from '@entities/enemies/enemy';

export function getNearestEnemy(
  playerX: number,
  playerY: number,
  enemies: Enemy[],
  maxDistance: number = Infinity
): Enemy | null {
  let nearest: Enemy | null = null;
  let minDistance = maxDistance;

  for (const enemy of enemies) {
    const distance = Phaser.Math.Distance.Between(
      playerX,
      playerY,
      enemy.x,
      enemy.y
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearest = enemy;
    }
  }

  return nearest;
}
