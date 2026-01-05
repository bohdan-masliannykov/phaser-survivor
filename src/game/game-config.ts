import { GameScene } from '@scenes/game-scene';
import { PreloadScene } from '@scenes/preload-scene';

export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 800,
  height: 800,
  scene: [PreloadScene, GameScene],
  pixelArt: true,
};
