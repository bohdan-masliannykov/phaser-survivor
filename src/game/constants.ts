export const PLAYER_SPEED = 150; // pixels per second
export const ENEMY_SPEED = 50; // pixels per second
export const ENEMY_SPAWN_INTERVAL_MS = 600; // milliseconds
export const SPAWN_MARGIN = 40; // pixels outside of view

export const PROJECTILE_HIT_RADIUS = 14; // simple distance-based collision
export const AUTO_FIRE_RANGE = 400; // weapon engagement range

/**
 * Returns the start and end frame indices for a row in a sprite sheet.
 * @param columnsPerRow - Total columns in the sprite sheet row
 * @param framesInRow - Number of frames in the current row
 * @param rowIndex - The row number (0-based)
 */
function getRowFrameRange(columnsPerRow: number, framesInRow: number, rowIndex: number) {
  const start = rowIndex * columnsPerRow;
  const end = start + framesInRow - 1;
  return { start, end };
}

// XP & Leveling
export const XP_GEM_PICKUP_RADIUS = 80; // magnetic pull starts
export const XP_GEM_COLLECT_RADIUS = 25; // instant pickup
export const XP_GEM_MAGNETIC_SPEED = 350; // px/s when being pulled
export const XP_THRESHOLDS = [
  3, 6, 12, 20, 35, 55, 80, 110, 150, 200, 260, 330, 400, 470, 550, 640, 740, 850, 970, 1100,
]; // XP needed to reach level 2, 3, 4, ...

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
    weapon: 'sword',
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
    weaponStats: {
      minDamage: 8,
      maxDamage: 12,
      cooldownMs: 1200,
      radius: 80,
      slashDuration: 300,
    },
  },
  wizzard: {
    key: 'wizzard',
    weapon: 'fire-wand',
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
    weaponStats: {
      minDamage: 6,
      maxDamage: 12,
      cooldownMs: 2000,
      projectileCount: 1,
      basePierce: 1,
    },
  },
  archer: {
    key: 'archer',
    weapon: 'bow',
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
    weaponStats: {
      minDamage: 6,
      maxDamage: 12,
      cooldownMs: 1200,
      projectileCount: 1,
      basePierce: 1,
    },
  },
  armoredAxeman: {
    key: 'armored-axeman',
    weapon: 'sword',
    animations: {
      idle: {
        key: 'armored-axeman-idle',
        ...getRowFrameRange(12, 6, 0),
        frameRate: 8,
        repeat: -1,
      },
      walk: {
        key: 'armored-axeman-walk',
        ...getRowFrameRange(12, 8, 1),
        frameRate: 13,
        repeat: -1,
      },
      death: {
        key: 'armored-axeman-death',
        ...getRowFrameRange(12, 4, 6),
        frameRate: 14,
        repeat: 0,
      },
    },
    weaponStats: {
      minDamage: 10,
      maxDamage: 16,
      cooldownMs: 1400,
      radius: 90,
      slashDuration: 350,
    },
  },
  priest: {
    key: 'priest',
    weapon: 'aura',
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
    weaponStats: {
      minDamage: 2,
      maxDamage: 4,
      cooldownMs: 0,
      radius: 60,
      damageIntervalMs: 600,
    },
  },
};
