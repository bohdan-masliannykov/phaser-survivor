import type { Enemy } from '@entities/enemies/enemy';

export function getNearestEnemy(
  sourceX: number,
  sourceY: number,
  enemies: Enemy[]
): Enemy | undefined {
  let nearest: Enemy | undefined;
  let bestD2 = Number.POSITIVE_INFINITY;

  for (const enemy of enemies) {
    const dx = enemy.x - sourceX;
    const dy = enemy.y - sourceY;
    const d2 = dx * dx + dy * dy;
    if (d2 < bestD2) {
      bestD2 = d2;
      nearest = enemy;
    }
  }
  return nearest;
}
