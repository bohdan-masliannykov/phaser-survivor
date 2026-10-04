/**
 * Procedurally generates all terrain textures (ground tiles, trees, rocks, bushes, flowers).
 * Call once during PreloadScene.create().
 */
export function generateTerrainTextures(scene: Phaser.Scene): void {
  generateGroundTiles(scene);
  generateTreeTexture(scene);
  generateRockTextures(scene);
  generateBushTexture(scene);
  generateFlowerTextures(scene);
}

// ── Ground tiles ──────────────────────────────────────────────

function generateGroundTiles(scene: Phaser.Scene): void {
  // Main grass tile (richer version of existing)
  const g1 = scene.make.graphics({ x: 0, y: 0 });
  g1.fillStyle(0x4a7c3f); // base green
  g1.fillRect(0, 0, 64, 64);
  // Subtle variation pixels
  const rng = seedRng(42);
  for (let i = 0; i < 80; i++) {
    const x = Math.floor(rng() * 64);
    const y = Math.floor(rng() * 64);
    const shade = rng() > 0.5 ? 0x5a8c4f : 0x3a6c2f;
    g1.fillStyle(shade, 0.6);
    g1.fillRect(x, y, 2, 2);
  }
  g1.generateTexture('ground-grass', 64, 64);
  g1.destroy();

  // Dirt patch tile
  const g2 = scene.make.graphics({ x: 0, y: 0 });
  g2.fillStyle(0x8b6f47); // brown base
  g2.fillRect(0, 0, 64, 64);
  const rng2 = seedRng(77);
  for (let i = 0; i < 60; i++) {
    const x = Math.floor(rng2() * 64);
    const y = Math.floor(rng2() * 64);
    const shade = rng2() > 0.5 ? 0x9b7f57 : 0x7b5f37;
    g2.fillStyle(shade, 0.5);
    g2.fillRect(x, y, 2, 2);
  }
  // Some grass blades on edges
  for (let i = 0; i < 12; i++) {
    const x = Math.floor(rng2() * 64);
    const y = Math.floor(rng2() * 8);
    g2.fillStyle(0x4a7c3f, 0.7);
    g2.fillRect(x, y, 2, 3);
    g2.fillRect(x, 64 - y - 3, 2, 3);
  }
  g2.generateTexture('ground-dirt', 64, 64);
  g2.destroy();
}

// ── Tree ──────────────────────────────────────────────────────

function generateTreeTexture(scene: Phaser.Scene): void {
  const g = scene.make.graphics({ x: 0, y: 0 });
  const w = 32;
  const h = 48;

  // Trunk
  g.fillStyle(0x6b4226);
  g.fillRect(13, 28, 6, 20);
  // Trunk highlights
  g.fillStyle(0x7b5236, 0.7);
  g.fillRect(15, 30, 2, 16);

  // Canopy — layered circles for fullness
  g.fillStyle(0x2d6e1e);
  g.fillCircle(16, 20, 14);
  g.fillStyle(0x3a8a28);
  g.fillCircle(12, 16, 10);
  g.fillCircle(20, 18, 10);
  // Highlights
  g.fillStyle(0x4da63a, 0.6);
  g.fillCircle(14, 13, 6);
  g.fillCircle(20, 15, 5);
  // Dark shadows
  g.fillStyle(0x1a5010, 0.4);
  g.fillCircle(16, 24, 8);

  g.generateTexture('tree', w, h);
  g.destroy();
}

// ── Rocks ─────────────────────────────────────────────────────

function generateRockTextures(scene: Phaser.Scene): void {
  // Large rock
  const g = scene.make.graphics({ x: 0, y: 0 });
  g.fillStyle(0x808080);
  g.fillRoundedRect(2, 6, 20, 14, 4);
  g.fillStyle(0x999999, 0.7);
  g.fillRoundedRect(4, 7, 14, 8, 3);
  g.fillStyle(0x666666, 0.5);
  g.fillRoundedRect(6, 14, 10, 4, 2);
  g.generateTexture('rock-large', 24, 22);
  g.destroy();

  // Small rock
  const g2 = scene.make.graphics({ x: 0, y: 0 });
  g2.fillStyle(0x707070);
  g2.fillRoundedRect(1, 3, 12, 9, 3);
  g2.fillStyle(0x909090, 0.6);
  g2.fillRoundedRect(3, 4, 7, 5, 2);
  g2.generateTexture('rock-small', 14, 14);
  g2.destroy();
}

// ── Bush ──────────────────────────────────────────────────────

function generateBushTexture(scene: Phaser.Scene): void {
  const g = scene.make.graphics({ x: 0, y: 0 });

  // Base
  g.fillStyle(0x2d7a1e);
  g.fillCircle(10, 14, 9);
  g.fillCircle(18, 12, 8);
  // Highlights
  g.fillStyle(0x3d9a2e, 0.6);
  g.fillCircle(12, 10, 5);
  g.fillCircle(19, 9, 4);
  // Shadow
  g.fillStyle(0x1a5010, 0.4);
  g.fillCircle(14, 16, 6);

  g.generateTexture('bush', 28, 22);
  g.destroy();
}

// ── Flowers ───────────────────────────────────────────────────

function generateFlowerTextures(scene: Phaser.Scene): void {
  const colors = [
    { name: 'flower-red', petal: 0xe63946, center: 0xffd166 },
    { name: 'flower-blue', petal: 0x457b9d, center: 0xf1faee },
    { name: 'flower-yellow', petal: 0xf4a261, center: 0xe76f51 },
  ];

  for (const { name, petal, center } of colors) {
    const g = scene.make.graphics({ x: 0, y: 0 });
    // Stem
    g.fillStyle(0x4a7c3f);
    g.fillRect(4, 6, 2, 6);
    // Petals
    g.fillStyle(petal);
    g.fillCircle(5, 4, 3);
    g.fillCircle(3, 5, 2);
    g.fillCircle(7, 5, 2);
    // Center
    g.fillStyle(center);
    g.fillCircle(5, 4, 1.5);

    g.generateTexture(name, 10, 12);
    g.destroy();
  }
}

// ── Simple seeded RNG (for deterministic texture variation) ───

function seedRng(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}
