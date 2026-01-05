export class Landscape extends Phaser.GameObjects.TileSprite {
  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    super(scene, x, y, width, height, 'grass');
    scene.add.existing(this);

    this.setOrigin(0)
      // Keep the background fixed to the camera (so it always covers the viewport).
      // We'll manually scroll the tile texture using tilePositionX/Y.
      .setScrollFactor(0)
      .setDepth(-1);
  }

  update(camera: Phaser.Cameras.Scene2D.Camera): void {
    this.tilePositionX = Math.floor(camera.scrollX);
    this.tilePositionY = Math.floor(camera.scrollY);
  }
}
