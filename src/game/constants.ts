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

// XP & Leveling
export const XP_GEM_PICKUP_RADIUS = 60; // magnetic pull starts
export const XP_GEM_COLLECT_RADIUS = 20; // instant pickup
export const XP_GEM_MAGNETIC_SPEED = 300; // px/s when being pulled
export const XP_PER_ENEMY: Record<string, number> = {
  slime: 1,
  orc: 3,
  skeleton: 2,
};
export const XP_THRESHOLDS = [
  5, 10, 20, 30, 50, 75, 100, 140, 180, 230, 280, 340, 400, 470, 550,
  640, 740, 850, 970, 1100,
]; // XP needed to reach level 2, 3, 4, ...

// Sword AoE
export const SWORD_RADIUS = 80; // px around player
export const SWORD_SLASH_DURATION = 300; // visual duration ms

// Priest Aura
export const AURA_RADIUS = 120; // px around priest
export const AURA_DAMAGE_INTERVAL_MS = 400; // tick interval

// Difficulty scaling
export const DIFFICULTY_INTERVAL_MS = 60_000; // scale every 60s
export const DIFFICULTY_HP_MULT = 0.15; // +15% HP per interval
export const DIFFICULTY_SPEED_MULT = 0.05; // +5% speed per interval
export const DIFFICULTY_SPAWN_MULT = 0.90; // spawn delay *0.9 per interval (faster)

// Player damage from enemies
export const ENEMY_CONTACT_DAMAGE = 5;
export const ENEMY_CONTACT_COOLDOWN_MS = 500; // invulnerability frames

export const RARITY_COLORS: Record<string, number> = {
  common: 0xffffff,
  magic: 0x4da6ff,
  rare: 0xffd700,
  legendary: 0x8b4513,
};

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
        frameRate: 14,
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
        frameRate: 14,
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
        frameRate: 14,
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
        frameRate: 14,
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
        frameRate: 14,
        repeat: 0,
      },
    },
  },
  archer: {
    key: 'archer',
    animations: {
      idle: {
        key: 'archer-idle',
        ...getRowFrameRange(12, 6, 0),
        frameRate: 8,
        repeat: -1,
      },
      walk: {
        key: 'archer-walk',
        ...getRowFrameRange(12, 8, 1),
        frameRate: 13,
        repeat: -1,
      },
      death: {
        key: 'archer-death',
        ...getRowFrameRange(12, 4, 4),
        frameRate: 14,
        repeat: 0,
      },
    },
  },
  priest: {
    key: 'priest',
    animations: {
      idle: {
        key: 'priest-idle',
        ...getRowFrameRange(9, 6, 0),
        frameRate: 8,
        repeat: -1,
      },
      walk: {
        key: 'priest-walk',
        ...getRowFrameRange(9, 8, 1),
        frameRate: 13,
        repeat: -1,
      },
      death: {
        key: 'priest-death',
        ...getRowFrameRange(9, 4, 4),
        frameRate: 14,
        repeat: 0,
      },
    },
  },
};
