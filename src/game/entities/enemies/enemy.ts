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

  private static readonly SEPARATION_RADIUS = 30;
  private static readonly SEPARATION_FORCE = 0.4;
  private static readonly FLIP_DEAD_ZONE = 5;
  private static readonly _moveVec = { x: 0, y: 0 };

  // Lateral wobble — each enemy gets unique phase & frequency
  private wobblePhase = Math.random() * Math.PI * 2;
  private wobbleSpeed = 2.5 + Math.random() * 1.5; // 2.5-4 Hz
  private static readonly WOBBLE_STRENGTH = 0.35;

  update(targetX: number, targetY: number, allEnemies: Enemy[]): void {
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const seekLen = Math.sqrt(dx * dx + dy * dy) || 1;

    // Separation
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

    // Lateral wobble perpendicular to seek direction
    const time = this.scene.time.now / 1000;
    const wobble = Math.sin(time * this.wobbleSpeed + this.wobblePhase) * Enemy.WOBBLE_STRENGTH;
    // Perpendicular to (dx, dy) is (-dy, dx)
    const perpX = -dy / seekLen;
    const perpY = dx / seekLen;

    Enemy._moveVec.x = dx / seekLen + sepX * Enemy.SEPARATION_FORCE + perpX * wobble;
    Enemy._moveVec.y = dy / seekLen + sepY * Enemy.SEPARATION_FORCE + perpY * wobble;

    if (Math.abs(dx) > Enemy.FLIP_DEAD_ZONE) {
      this.setFacingDirection(dx < 0);
    }

    super.move(Enemy._moveVec);
  }

  receiveDamage(
    amount: number,
    fromX: number,
    fromY: number,
    knockbackForce: number,
    effectType?: 'default' | 'burn'
  ): void {
    this.takeDamage(amount);
    this.applyKnockback(fromX, fromY, knockbackForce);

    if (effectType === 'burn') {
      this.showBurnEffect();
    } else {
      this.showDamageFlash();
    }

    if (this.isDead()) {
      this.releaseObjectWithAnimation(undefined, () => this.onDeath?.());
    }
  }

  private showDamageFlash(): void {
    const originalTint = this.tint;
    this.setTint(0xffffff); // Flash white
    this.scene.tweens.add({
      targets: this,
      tint: originalTint,
      duration: 100,
      onComplete: () => {
        this.setTint(originalTint);
      },
    });
  }

  private showBurnEffect(): void {
    this.setTint(0xff6644); // Flash orange/red for burn
    this.scene.tweens.add({
      targets: this,
      tint: 0xffffff,
      duration: 150,
      delay: 0,
      onComplete: () => {
        this.setTint(0xffffff);
      },
    });
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
