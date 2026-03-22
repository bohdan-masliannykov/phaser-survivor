import {
  XP_THRESHOLDS,
  DIFFICULTY_INTERVAL_MS,
  DIFFICULTY_HP_MULT,
  DIFFICULTY_SPEED_MULT,
  DIFFICULTY_SPAWN_MULT,
} from '@constants';

export class ProgressionSystem {
  xp: number = 0;
  level: number = 1;
  kills: number = 0;
  elapsedMs: number = 0;
  difficultyTier: number = 0;

  // Difficulty multipliers (applied by enemy manager)
  hpMultiplier: number = 1;
  speedMultiplier: number = 1;
  spawnDelayMultiplier: number = 1;

  private onLevelUp?: () => void;

  constructor(onLevelUp: () => void) {
    this.onLevelUp = onLevelUp;
  }

  addXp(amount: number): void {
    this.xp += amount;
    const threshold = this.getXpThreshold();
    if (this.xp >= threshold) {
      this.xp -= threshold;
      this.level++;
      this.onLevelUp?.();
    }
  }

  addKill(): void {
    this.kills++;
  }

  getXpThreshold(): number {
    const idx = this.level - 1;
    if (idx < XP_THRESHOLDS.length) return XP_THRESHOLDS[idx];
    // Past defined thresholds, scale linearly
    return XP_THRESHOLDS[XP_THRESHOLDS.length - 1] + (idx - XP_THRESHOLDS.length + 1) * 200;
  }

  getXpProgress(): number {
    return this.xp / this.getXpThreshold();
  }

  update(deltaMs: number): void {
    this.elapsedMs += deltaMs;

    const newTier = Math.floor(this.elapsedMs / DIFFICULTY_INTERVAL_MS);
    if (newTier > this.difficultyTier) {
      this.difficultyTier = newTier;
      this.hpMultiplier = 1 + this.difficultyTier * DIFFICULTY_HP_MULT;
      this.speedMultiplier = 1 + this.difficultyTier * DIFFICULTY_SPEED_MULT;
      this.spawnDelayMultiplier = Math.pow(DIFFICULTY_SPAWN_MULT, this.difficultyTier);
    }
  }

  getElapsedFormatted(): string {
    const totalSec = Math.floor(this.elapsedMs / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }
}
