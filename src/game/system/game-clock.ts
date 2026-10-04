/**
 * Milliseconds of unpaused play in the current run.
 *
 * Unlike `scene.time.now`, it stands still while the game is paused, so
 * cooldowns and lifetimes measured against it do not run down behind a menu.
 * GameScene resets it on start and advances it every unpaused frame.
 */
export const gameClock = { now: 0 };
