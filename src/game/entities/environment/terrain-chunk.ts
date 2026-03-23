const CHUNK_SIZE = 512; // world pixels per chunk
const PROPS_PER_CHUNK = 12;
const DIRT_PATCHES_PER_CHUNK = 2;
const FLOWER_CLUSTERS_PER_CHUNK = 4;

const PROP_TYPES: readonly { key: string; scale: number; depth: number; weight: number }[] = [
  { key: 'tree', scale: 3.5, depth: 1, weight: 3 },
  { key: 'bush', scale: 2.5, depth: 0, weight: 4 },
  { key: 'rock-large', scale: 2.5, depth: 0, weight: 2 },
  { key: 'rock-small', scale: 2, depth: 0, weight: 3 },
];

const FLOWER_KEYS = ['flower-red', 'flower-blue', 'flower-yellow'] as const;

/** Seeded RNG so each chunk always looks the same */
function chunkRng(cx: number, cy: number, i: number): number {
  let s = ((cx * 73856093) ^ (cy * 19349663) ^ (i * 83492791)) >>> 0;
  s = ((s >> 16) ^ s) * 0x45d9f3b;
  s = ((s >> 16) ^ s) * 0x45d9f3b;
  s = (s >> 16) ^ s;
  return (s >>> 0) / 0xffffffff;
}

interface ChunkData {
  objects: Phaser.GameObjects.GameObject[];
}

/**
 * Manages procedural terrain decoration using a chunk system.
 * Generates props (trees, rocks, bushes, flowers) in chunks around the player,
 * and disposes chunks that move far off-screen.
 */
export class TerrainChunkManager {
  private scene: Phaser.Scene;
  private chunks = new Map<string, ChunkData>();
  private viewDistance: number;

  constructor(scene: Phaser.Scene, viewDistance = 2) {
    this.scene = scene;
    this.viewDistance = viewDistance;
  }

  update(playerX: number, playerY: number): void {
    const cx = Math.floor(playerX / CHUNK_SIZE);
    const cy = Math.floor(playerY / CHUNK_SIZE);

    // Generate nearby chunks
    for (let dx = -this.viewDistance; dx <= this.viewDistance; dx++) {
      for (let dy = -this.viewDistance; dy <= this.viewDistance; dy++) {
        const key = `${cx + dx},${cy + dy}`;
        if (!this.chunks.has(key)) {
          this.chunks.set(key, this.generateChunk(cx + dx, cy + dy));
        }
      }
    }

    // Remove distant chunks
    const removeDistance = this.viewDistance + 2;
    for (const [key, chunk] of this.chunks) {
      const [chunkX, chunkY] = key.split(',').map(Number);
      if (
        Math.abs(chunkX - cx) > removeDistance ||
        Math.abs(chunkY - cy) > removeDistance
      ) {
        for (const obj of chunk.objects) obj.destroy();
        this.chunks.delete(key);
      }
    }
  }

  private generateChunk(cx: number, cy: number): ChunkData {
    const objects: Phaser.GameObjects.GameObject[] = [];
    const originX = cx * CHUNK_SIZE;
    const originY = cy * CHUNK_SIZE;

    // Dirt patches (ground-level images)
    for (let i = 0; i < DIRT_PATCHES_PER_CHUNK; i++) {
      const r1 = chunkRng(cx, cy, i + 500);
      const r2 = chunkRng(cx, cy, i + 600);
      if (r1 < 0.4) continue; // not every chunk gets dirt
      const x = originX + r1 * CHUNK_SIZE;
      const y = originY + r2 * CHUNK_SIZE;
      const dirt = this.scene.add
        .image(x, y, 'ground-dirt')
        .setScale(2 + chunkRng(cx, cy, i + 700))
        .setAlpha(0.5 + chunkRng(cx, cy, i + 800) * 0.3)
        .setDepth(-0.5);
      objects.push(dirt);
    }

    // Props (trees, rocks, bushes)
    const totalWeight = PROP_TYPES.reduce((s, p) => s + p.weight, 0);
    for (let i = 0; i < PROPS_PER_CHUNK; i++) {
      const r1 = chunkRng(cx, cy, i);
      const r2 = chunkRng(cx, cy, i + 100);
      const r3 = chunkRng(cx, cy, i + 200);

      const x = originX + r1 * CHUNK_SIZE;
      const y = originY + r2 * CHUNK_SIZE;

      // Weighted random prop selection
      let roll = r3 * totalWeight;
      let prop = PROP_TYPES[0];
      for (const p of PROP_TYPES) {
        roll -= p.weight;
        if (roll <= 0) {
          prop = p;
          break;
        }
      }

      const scaleVariation = 0.8 + chunkRng(cx, cy, i + 300) * 0.4;
      const obj = this.scene.add
        .image(x, y, prop.key)
        .setScale(prop.scale * scaleVariation)
        .setDepth(prop.depth)
        .setAlpha(0.9);

      objects.push(obj);
    }

    // Flower clusters
    for (let i = 0; i < FLOWER_CLUSTERS_PER_CHUNK; i++) {
      const baseX = originX + chunkRng(cx, cy, i + 1000) * CHUNK_SIZE;
      const baseY = originY + chunkRng(cx, cy, i + 1100) * CHUNK_SIZE;
      const count = 2 + Math.floor(chunkRng(cx, cy, i + 1200) * 4);

      for (let j = 0; j < count; j++) {
        const fx = baseX + (chunkRng(cx, cy, i * 10 + j + 2000) - 0.5) * 40;
        const fy = baseY + (chunkRng(cx, cy, i * 10 + j + 3000) - 0.5) * 40;
        const flowerKey =
          FLOWER_KEYS[Math.floor(chunkRng(cx, cy, i * 10 + j + 4000) * 3)];
        const flower = this.scene.add
          .image(fx, fy, flowerKey)
          .setScale(1.5 + chunkRng(cx, cy, i * 10 + j + 5000) * 0.5)
          .setDepth(-0.2);
        objects.push(flower);
      }
    }

    return { objects };
  }

  destroy(): void {
    for (const chunk of this.chunks.values()) {
      for (const obj of chunk.objects) obj.destroy();
    }
    this.chunks.clear();
  }
}
