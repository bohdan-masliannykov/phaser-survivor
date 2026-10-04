import { TerrainChunkManager } from './terrain-chunk';

export class Landscape extends Phaser.GameObjects.TileSprite {
  private chunkManager: TerrainChunkManager;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    super(scene, x, y, width, height, 'ground-grass');
    scene.add.existing(this);

    this.setOrigin(0).setScrollFactor(0).setDepth(-1);
    this.chunkManager = new TerrainChunkManager(scene);
  }

  update(camera: Phaser.Cameras.Scene2D.Camera): void {
    this.tilePositionX = Math.floor(camera.scrollX);
    this.tilePositionY = Math.floor(camera.scrollY);

    // Generate/recycle terrain props around the camera center
    this.chunkManager.update(
      camera.scrollX + camera.width / 2,
      camera.scrollY + camera.height / 2
    );
  }

  destroy(fromScene?: boolean): void {
    this.chunkManager.destroy();
    super.destroy(fromScene);
  }
}
