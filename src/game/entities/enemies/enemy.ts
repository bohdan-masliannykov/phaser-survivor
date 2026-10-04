import { ENEMY_SPEED, type EnemyDef } from '@constants';
import { GameObject } from '@entities/core/game-object';

export class Enemy extends GameObject {
  readonly id: string = Phaser.Utils.String.UUID();
  /** Fired the moment health reaches zero, before the death animation. */
  onDying?: () => void;
  /** Fired when the death animation has finished. */
  onDeath?: () => void;
  private baseMaxHealth: number;

  constructor(scene: Phaser.Scene, x: number, y: number, def: EnemyDef) {
    const rndScale = Phaser.Math.Between(20, 23) / 10;

    super(scene, x, y, def.key, ENEMY_SPEED, rndScale, {
      maxHealth: def.maxHealth,
      barWidth: 24,
      barHeight: 3,
      barOffsetY: 18,
      show: true,
    });

    this.baseMaxHealth = def.maxHealth;
    this.applyDefinition(def);
    this.playDefaultAnimation();
    //TODO implement glow effect depending on rarity
    // this.postFX.addGlow(RARITY_COLORS['legendary'], 5, 0, false, 0.1, 5);
  }

  /** Turns this (possibly recycled) sprite into the given enemy type. */
  private applyDefinition(def: EnemyDef): void {
    this.setTexture(def.key);
    this.baseMaxHealth = def.maxHealth;
    this.hitboxConfig = def.hitbox;
    this.animations = {
      idle: def.animations.idle.key,
      walk: def.animations.walk.key,
      death: def.animations.death.key,
    };
    this.updateBodyForScale(this.flipX, def.hitbox);
  }

  playDefaultAnimation(): void {
    this.play(this.animations.walk);
  }

  private static readonly SEPARATION_RADIUS = 30;
  private static readonly SEPARATION_FORCE = 0.4;
  private static readonly FLIP_DEAD_ZONE = 5;
  private static readonly FLASH_MS = 80;
  private static readonly BURN_FLASH_MS = 150;
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
    const r2 = Enemy.SEPARATION_RADIUS * Enemy.SEPARATION_RADIUS;

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
    if (this.isDead()) return;

    this.takeDamage(amount);
    this.applyKnockback(fromX, fromY, knockbackForce);

    if (effectType === 'burn') {
      this.showBurnEffect();
    } else {
      this.showDamageFlash();
    }

    if (this.isDead()) {
      this.setVelocity(0, 0);
      this.setBodyEnabled(false);
      this.onDying?.();
      this.releaseObjectWithAnimation(undefined, () => this.onDeath?.());
    }
  }

  private showDamageFlash(): void {
    this.setTintFill(0xffffff);
    this.clearTintLater(Enemy.FLASH_MS);
  }

  private showBurnEffect(): void {
    this.setTint(0xff6644);
    this.clearTintLater(Enemy.BURN_FLASH_MS);
  }

  private clearTintLater(delayMs: number): void {
    this.scene.time.delayedCall(delayMs, () => this.clearTint());
  }

  restore(
    x: number,
    y: number,
    def: EnemyDef,
    hpMultiplier: number = 1,
    speedMultiplier: number = 1
  ): void {
    this.applyDefinition(def);
    this.maxHealth = Math.round(this.baseMaxHealth * hpMultiplier);
    this.speed = ENEMY_SPEED * speedMultiplier;

    this.setPosition(x, y);
    this.setVelocity(0, 0);
    this.setBodyEnabled(true);
    this.clearTint();

    this.heal(this.maxHealth);
    this.healthBar?.showBar();

    this.setActive(true);
    this.setVisible(true);
    this.playDefaultAnimation();
  }

  private setBodyEnabled(enabled: boolean): void {
    (this.body as Phaser.Physics.Arcade.Body).enable = enabled;
  }

  startInactive(): void {
    // Pooled enemies are parked at (0, 0); without this they would all collide there every frame
    this.setBodyEnabled(false);
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
