import { type CharacterKey, PLAYER } from '@constants';
import type { GameScene } from '@scenes/game-scene';

const SPAWN_BURST = 50;
const HELP = '[L] level up  [T] +1 min  [N] spawn 50  [K] kill all  [G] god mode  [P] hitboxes';

/**
 * Dev builds only: `?char=archer` skips character selection.
 */
export function getDevCharacter(): CharacterKey | null {
  if (!import.meta.env.DEV) return null;
  const key = new URLSearchParams(window.location.search).get('char');
  return Object.values(PLAYER).find((character) => character.key === key)?.key ?? null;
}

/**
 * Hotkeys and a readout for fast iteration. Only created in dev builds.
 * `?t=300` starts the run at 300 seconds.
 */
export class DevTools {
  private scene: GameScene;
  private godMode = false;
  private readout: Phaser.GameObjects.Text;

  constructor(scene: GameScene) {
    this.scene = scene;

    const startSeconds = Number(new URLSearchParams(window.location.search).get('t'));
    if (startSeconds > 0) scene.progression.elapsedMs = startSeconds * 1000;

    this.readout = scene.add
      .text(12, scene.scale.height - 12, '', {
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#ffff66',
        stroke: '#000000',
        strokeThickness: 3,
      })
      .setOrigin(0, 1)
      .setScrollFactor(0)
      .setDepth(300);

    const keyboard = scene.input.keyboard!;
    keyboard.on('keydown-L', () => this.levelUp());
    keyboard.on('keydown-T', () => this.skipMinute());
    keyboard.on('keydown-N', () => scene.enemyManager.spawnBurst(SPAWN_BURST));
    keyboard.on('keydown-K', () => this.killAll());
    keyboard.on('keydown-G', () => this.toggleGodMode());
    keyboard.on('keydown-P', () => this.toggleHitboxes());

    scene.events.on('update', this.update, this);
    scene.events.once('shutdown', () => scene.events.off('update', this.update, this));
  }

  private update(): void {
    const { scene } = this;
    if (this.godMode) scene.player.heal(scene.player.maxHealth);

    const fps = Math.round(scene.game.loop.actualFps);
    const enemies = scene.enemyManager.getEnemies().length;
    const god = this.godMode ? 'on' : 'off';
    this.readout.setText(`DEV  fps ${fps}  enemies ${enemies}  god ${god}\n${HELP}`);
  }

  private levelUp(): void {
    const { progression, upgradePicker } = this.scene;
    if (upgradePicker.isVisible()) return;
    progression.addXp(progression.getXpThreshold() - progression.xp);
  }

  private skipMinute(): void {
    this.scene.progression.elapsedMs += 60_000;
  }

  private killAll(): void {
    for (const enemy of this.scene.enemyManager.getEnemies()) {
      enemy.receiveDamage(enemy.health, enemy.x, enemy.y, 0);
    }
  }

  private toggleGodMode(): void {
    this.godMode = !this.godMode;
  }

  private toggleHitboxes(): void {
    const world = this.scene.physics.world;
    if (!world.debugGraphic) {
      world.createDebugGraphic();
      return;
    }
    world.drawDebug = !world.drawDebug;
    if (!world.drawDebug) world.debugGraphic.clear();
  }
}
