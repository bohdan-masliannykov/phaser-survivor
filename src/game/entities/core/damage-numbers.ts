const STYLE: Phaser.Types.GameObjects.Text.TextStyle = {
  font: '16px monospace',
  color: '#fff',
  stroke: '#000',
  strokeThickness: 3,
};
const RISE_PX = 20;
const DURATION_MS = 500;

// Finished texts waiting to be reused, per scene
const freeTexts = new WeakMap<Phaser.Scene, Phaser.GameObjects.Text[]>();

function getFreeTexts(scene: Phaser.Scene): Phaser.GameObjects.Text[] {
  let free = freeTexts.get(scene);
  if (!free) {
    free = [];
    freeTexts.set(scene, free);
    // The scene destroys its texts on shutdown, so the pool must not outlive it
    scene.events.once('shutdown', () => freeTexts.delete(scene));
  }
  return free;
}

/**
 * Shows a floating damage number. Text objects are reused, because creating
 * one allocates a canvas texture and a busy fight shows dozens per second.
 */
export function showDamageNumber(scene: Phaser.Scene, x: number, y: number, amount: number): void {
  const free = getFreeTexts(scene);
  const text = free.pop() ?? scene.add.text(0, 0, '', STYLE);

  text.setText(amount.toString()).setPosition(x, y).setAlpha(1).setVisible(true);

  scene.tweens.add({
    targets: text,
    y: y - RISE_PX,
    alpha: 0,
    duration: DURATION_MS,
    onComplete: () => {
      text.setVisible(false);
      free.push(text);
    },
  });
}
