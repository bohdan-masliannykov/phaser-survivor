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
    maxHealth: 6,
    hitbox: {
      widthPercent: 0.21,
      heightPercent: 0.11,
      offsetXPercent: (1 - 0.21) / 2,
      offsetYPercent: 0.45,
    },
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
    maxHealth: 25,
    hitbox: {
      widthPercent: 0.15,
      heightPercent: 0.15,
      offsetXPercent: (1 - 0.15) / 2,
      offsetYPercent: 0.41,
    },
    // Share of spawns: 0 before `fromMinute`, then grows per minute up to `maxChance`
    spawn: { fromMinute: 3, chancePerMinute: 0.03, maxChance: 0.25 },
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
    maxHealth: 20,
    hitbox: {
      widthPercent: 0.15,
      heightPercent: 0.15,
      offsetXPercent: (1 - 0.15) / 2,
      offsetYPercent: 0.42,
    },
    // Share of spawns: 0 before `fromMinute`, then grows per minute up to `maxChance`
    spawn: { fromMinute: 1, chancePerMinute: 0.05, maxChance: 0.35 },
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
} as const;

export type EnemyKey = keyof typeof ENEMY;
export type EnemyDef = (typeof ENEMY)[EnemyKey];

// Spawns whenever no `spawn` rule above claims the roll
export const DEFAULT_ENEMY: EnemyKey = 'slime';

export const PLAYER = {
  soldier: {
    key: 'soldier',
    // Selection screen card; ratings are stars out of 4 and purely descriptive
    card: {
      name: 'Soldier',
      description: 'Swift melee fighter with spinning slash',
      damage: 3,
      speed: 3,
      range: 1,
    },
    hitbox: {
      widthPercent: 0.13,
      heightPercent: 0.2,
      offsetXPercent: (1 - 0.13) / 2,
      offsetYPercent: 0.38,
    },
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
    // Selection screen card; ratings are stars out of 4 and purely descriptive
    card: {
      name: 'Wizard',
      description: 'Ranged spellcaster with piercing fireballs',
      damage: 3,
      speed: 2,
      range: 3,
    },
    hitbox: {
      widthPercent: 0.14,
      heightPercent: 0.2,
      offsetXPercent: (1 - 0.14) / 2,
      offsetYPercent: 0.38,
    },
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
    // Selection screen card; ratings are stars out of 4 and purely descriptive
    card: {
      name: 'Archer',
      description: 'Precise archer with rapid arrows',
      damage: 2,
      speed: 3,
      range: 3,
    },
    hitbox: {
      widthPercent: 0.12,
      heightPercent: 0.18,
      offsetXPercent: (1 - 0.12) / 2,
      offsetYPercent: 0.4,
    },
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
    // Selection screen card; ratings are stars out of 4 and purely descriptive
    card: {
      name: 'Armored Axeman',
      description: 'Heavy armored warrior with devastating cleave',
      damage: 4,
      speed: 2,
      range: 1,
    },
    hitbox: {
      widthPercent: 0.15,
      heightPercent: 0.22,
      offsetXPercent: (1 - 0.15) / 2,
      offsetYPercent: 0.36,
    },
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
    // Selection screen card; ratings are stars out of 4 and purely descriptive
    card: {
      name: 'Priest',
      description: 'Holy aura dealer with damage over time',
      damage: 2,
      speed: 2,
      range: 2,
    },
    hitbox: {
      widthPercent: 0.14,
      heightPercent: 0.2,
      offsetXPercent: (1 - 0.14) / 2,
      offsetYPercent: 0.38,
    },
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
} as const;

export type CharacterDef = (typeof PLAYER)[keyof typeof PLAYER];
export type CharacterKey = CharacterDef['key'];

export function getCharacter(key: CharacterKey): CharacterDef {
  const def = Object.values(PLAYER).find((character) => character.key === key);
  if (!def) throw new Error(`Unknown character: ${key}`);
  return def;
}
