export const MIN_VELOCITY_THRESHOLD = 0.001;
export const PLAYER_SPEED = 150; // pixels per second
export const ENEMY_SPEED = 50; // pixels per second
export const ARRIVE_RADIUS = 6; // pixels
export const SPRITE_SCALE = 2.5; // scaling factor for sprites
export const ENEMY_SPAWN_INTERVAL_MS = 1000; // milliseconds
export const SPAWN_MARGIN = 40; // pixels outside of view

export const FIRE_INTERVAL_MS = 500; // auto-shot cadence
export const PROJECTILE_SPEED = 450; // pixels per second
export const PROJECTILE_LIFETIME_MS = 900; // despawn after this time
export const PROJECTILE_HIT_RADIUS = 18; // simple distance-based collision

/**
 * Returns the start and end frame indices for a row in a sprite sheet.
 * @param columnsPerRow - Total columns in the sprite sheet row
 * @param framesInRow - Number of frames in the current row
 * @param rowIndex - The row number (0-based)
 */
export function getRowFrameRange(
  columnsPerRow: number,
  framesInRow: number,
  rowIndex: number
) {
  const start = rowIndex * columnsPerRow;
  const end = start + framesInRow - 1;
  return { start, end };
}

export const ENEMY = {
  slime: {
    key: 'slime',
    animations: {
      idle: {
        key: 'slime-idle',
        ...getRowFrameRange(12, 6, 0),
        frameRate: 6,
        repeat: -1,
      },
      walk: {
        key: 'slime-walk',
        ...getRowFrameRange(12, 6, 1),
        frameRate: 8,
        repeat: -1,
      },
      death: {
        key: 'slime-death',
        ...getRowFrameRange(12, 4, 5),
        frameRate: 8,
        repeat: 0,
      },
    },
  },
  orc: {
    key: 'orc',
    animations: {
      idle: {
        key: 'orc-idle',
        ...getRowFrameRange(8, 6, 0),
        frameRate: 6,
        repeat: -1,
      },
      walk: {
        key: 'orc-walk',
        ...getRowFrameRange(8, 8, 1),
        frameRate: 8,
        repeat: -1,
      },
      death: {
        key: 'orc-death',
        ...getRowFrameRange(8, 6, 5),
        frameRate: 8,
        repeat: 0,
      },
    },
  },
  skeleton: {
    key: 'skeleton',
    animations: {
      idle: {
        key: 'skeleton-idle',
        ...getRowFrameRange(8, 6, 0),
        frameRate: 6,
        repeat: -1,
      },
      walk: {
        key: 'skeleton-walk',
        ...getRowFrameRange(8, 8, 1),
        frameRate: 8,
        repeat: -1,
      },
      death: {
        key: 'skeleton-death',
        ...getRowFrameRange(8, 4, 6),
        frameRate: 8,
        repeat: 0,
      },
    },
  },
};

export const PLAYER = {
  soldier: {
    key: 'soldier',
    animations: {
      idle: {
        key: 'soldier-idle',
        ...getRowFrameRange(9, 6, 0),
        frameRate: 8,
        repeat: -1,
      },
      walk: {
        key: 'soldier-walk',
        ...getRowFrameRange(9, 8, 1),
        frameRate: 13,
        repeat: -1,
      },
      death: {
        key: 'soldier-death',
        ...getRowFrameRange(9, 4, 6),
        frameRate: 8,
        repeat: 0,
      },
    },
  },
  wizzard: {
    key: 'wizzard',
    animations: {
      idle: {
        key: 'wizzard-idle',
        ...getRowFrameRange(15, 6, 0),
        frameRate: 8,
        repeat: -1,
      },
      walk: {
        key: 'wizzard-walk',
        ...getRowFrameRange(15, 8, 1),
        frameRate: 13,
        repeat: -1,
      },
      death: {
        key: 'wizzard-death',
        ...getRowFrameRange(15, 4, 9),
        frameRate: 8,
        repeat: 0,
      },
    },
  },
};
