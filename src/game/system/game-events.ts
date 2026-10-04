/**
 * Events emitted on the game scene's event bus (`scene.events`).
 * Systems announce what happened; anything interested subscribes,
 * so emitters do not need a reference to their listeners.
 */
export const GameEvents = {
  /** An enemy finished dying. Args: `(x: number, y: number, enemyType: string)` */
  ENEMY_DIED: 'enemy-died',
  /** The player gained a level. No args. */
  LEVEL_UP: 'level-up',
} as const;
