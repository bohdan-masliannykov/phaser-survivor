export class InputSystem {
  private readonly scene: Phaser.Scene;
  private readonly keys: {
    UP: Phaser.Input.Keyboard.Key;
    DOWN: Phaser.Input.Keyboard.Key;
    LEFT: Phaser.Input.Keyboard.Key;
    RIGHT: Phaser.Input.Keyboard.Key;
  };

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.keys = this.scene.input.keyboard!.addKeys({
      UP: Phaser.Input.Keyboard.KeyCodes.W,
      DOWN: Phaser.Input.Keyboard.KeyCodes.S,
      LEFT: Phaser.Input.Keyboard.KeyCodes.A,
      RIGHT: Phaser.Input.Keyboard.KeyCodes.D,
    }) as InputSystem['keys'];
  }

  /** Returns normalized movement intent (diagonals aren't faster). */
  getMoveIntent(): { x: number; y: number } {
    let x = 0;
    let y = 0;

    if (this.keys.UP.isDown) y -= 1;
    if (this.keys.DOWN.isDown) y += 1;
    if (this.keys.LEFT.isDown) x -= 1;
    if (this.keys.RIGHT.isDown) x += 1;

    if (x === 0 && y === 0) return { x: 0, y: 0 };

    // Normalize without allocating Phaser vectors.
    const len = Math.hypot(x, y);
    return { x: x / len, y: y / len };
  }
}
