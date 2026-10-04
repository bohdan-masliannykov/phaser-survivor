import { XpGem } from '@entities/pickups/xp-gem';

export class XpGemPool {
  private scene: Phaser.Scene;
  private gems: XpGem[] = [];
  private activeGems: Set<XpGem> = new Set();

  constructor(scene: Phaser.Scene, initialSize: number = 30) {
    this.scene = scene;
    for (let i = 0; i < initialSize; i++) {
      this.gems.push(new XpGem(scene));
    }
  }

  spawn(x: number, y: number, xpValue: number): void {
    let gem = this.gems.find((g) => !g.active && !g.isCollected());
    if (!gem) {
      gem = new XpGem(this.scene);
      this.gems.push(gem);
    }
    gem.spawn(x, y, xpValue);
    this.activeGems.add(gem);
  }

  update(playerX: number, playerY: number, pickupRadius?: number): number {
    let totalXp = 0;
    for (const gem of this.activeGems) {
      const collected = gem.update(playerX, playerY, pickupRadius);
      if (collected) {
        totalXp += gem.xpValue;
        gem.deactivate();
        this.activeGems.delete(gem);
      }
    }
    return totalXp;
  }

  destroy(): void {
    for (const gem of this.gems) {
      gem.destroy();
    }
    this.gems.length = 0;
    this.activeGems.clear();
  }
}