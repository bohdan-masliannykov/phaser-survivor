import { ENEMY_SPEED } from '@constants';
import { GameObject, type HitboxConfig } from '@entities/core/game-object';

export abstract class Enemy extends GameObject {
  readonly id: string = Phaser.Utils.String.UUID();
  onDeath?: () => void;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    hitboxConfig: HitboxConfig,
    healthOptions?: GameObject['healthOptions'],
    animations?: GameObject['animations']
  ) {
    const rndScale = Phaser.Math.Between(20, 23) / 10;

    super(
      scene,
      x,
      y,
      texture,
      ENEMY_SPEED,
      rndScale,
      healthOptions,
      animations
    );

    this.hitboxConfig = hitboxConfig;
    this.updateBodyForScale(false, hitboxConfig);
    this.playDefaultAnimation();
    //TODO implement glow effect depending on rarity
    // this.postFX.addGlow(RARITY_COLORS['legendary'], 5, 0, false, 0.1, 5);
  }

  playDefaultAnimation(): void {
    this.play(this.animations.walk);
  }

  private static readonly SEPARATION_RADIUS = 24;
  private static readonly SEPARATION_FORCE = 0.6;
  private static readonly FLIP_DEAD_ZONE = 5;
  private static readonly _moveVec = { x: 0, y: 0 };

  update(targetX: number, targetY: number, allEnemies: Enemy[]): void {
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const seekLen = Math.sqrt(dx * dx + dy * dy) || 1;

    // Gentle separation — only pushes apart when bodies overlap heavily
    let sepX = 0;
    let sepY = 0;
    const r2 =
      Enemy.SEPARATION_RADIUS * Enemy.SEPARATION_RADIUS;

    for (const other of allEnemies) {
      if (other === this) continue;
      const ox = this.x - other.x;
      const oy = this.y - other.y;
      const dist2 = ox * ox + oy * oy;
      if (dist2 < r2 && dist2 > 0) {
        const dist = Math.sqrt(dist2);
        sepX += ox / dist;
        sepY += oy / dist;
      }
    }

    Enemy._moveVec.x = dx / seekLen + sepX * Enemy.SEPARATION_FORCE;
    Enemy._moveVec.y = dy / seekLen + sepY * Enemy.SEPARATION_FORCE;

    // Only flip facing when clearly to the left/right — avoids
    // oscillation when the enemy is directly on top of the player.
    if (Math.abs(dx) > Enemy.FLIP_DEAD_ZONE) {
      this.setFacingDirection(dx < 0);
    }

    super.move(Enemy._moveVec);
  }

  receiveDamage(
    amount: number,
    fromX: number,
    fromY: number,
    knockbackForce: number
  ): void {
    this.takeDamage(amount);
    this.applyKnockback(fromX, fromY, knockbackForce);
    if (this.isDead()) {
      this.releaseObjectWithAnimation(undefined, () => this.onDeath?.());
    }
  }

  restore(x: number, y: number): void {
    this.setPosition(x, y);
    this.setVelocity(0, 0);

    this.heal(this.maxHealth);
    this.healthBar?.showBar();

    this.setActive(true);
    this.setVisible(true);
    this.playDefaultAnimation();
  }

  startInactive(): void {
    this.setActive(false);
    this.setVisible(false);
    this.healthBar?.hideBar();
  }

  deactivate(): void {
    this.setVelocity(0, 0);
    this.setPosition(0, 0);

    this.startInactive();
  }
}
