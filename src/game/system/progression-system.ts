import { XP_THRESHOLDS } from '@constants';

export class ProgressionSystem {
  xp: number = 0;
  level: number = 1;
  kills: number = 0;
  elapsedMs: number = 0;
  difficultyTier: number = 0;

  // Difficulty multipliers: hp and speed are applied to enemies as they spawn
  hpMultiplier: number = 1;
  damageMultiplier: number = 1;
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
    const minutes = this.elapsedMs / 60_000;
    this.difficultyTier = Math.floor(minutes);

    // Exponential curve: gentle first 5 min, steep after 10 min
    this.hpMultiplier = 1 + (minutes / 5) ** 2 * 0.5;
    this.damageMultiplier = 1 + (minutes / 5) ** 2 * 0.5;
    this.speedMultiplier = 1 + (minutes / 10) ** 1.5 * 0.25;
    this.spawnDelayMultiplier = Math.max(0.1, 1 - (minutes / 18) ** 2);
  }

  getElapsedFormatted(): string {
    const totalSec = Math.floor(this.elapsedMs / 1000);
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  }
}
