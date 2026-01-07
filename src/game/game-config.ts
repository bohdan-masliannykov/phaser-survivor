import { CharacterSelectionScene } from '@scenes/character-selection-scene';
import { GameScene } from '@scenes/game-scene';
import { PreloadScene } from '@scenes/preload-scene';

export const MIN_WIDTH = 800;
export const MIN_HEIGHT = 600;

export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: Math.max(window.innerWidth, MIN_WIDTH),
  height: Math.max(window.innerHeight, MIN_HEIGHT),
  scene: [PreloadScene, CharacterSelectionScene, GameScene],
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: MIN_WIDTH,
      height: MIN_HEIGHT,
    },
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
};
