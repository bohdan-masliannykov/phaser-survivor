import type { Player } from '@entities/player/player';
import type { FireWand } from '@entities/weapons/fire-wand';
import type { Bow } from '@entities/weapons/bow';
import type { Sword } from '@entities/weapons/sword';
import type { Aura } from '@entities/weapons/aura';

export interface UpgradeOption {
  id: string;
  name: string;
  description: string;
  color: number;
  canApply: (player: Player) => boolean;
  apply: (player: Player) => void;
}

const MIN_COOLDOWN_MS = 400;

const hasRangedWeapon = (player: Player) =>
  !!player.weaponManager.getWeapon('fire-wand') ||
  !!player.weaponManager.getWeapon('bow');

const ALL_UPGRADES: UpgradeOption[] = [
  // ── Universal upgrades ──────────────────────────────
  {
    id: 'damage_up',
    name: 'Damage Up',
    description: '+20% weapon damage',
    color: 0xff4444,
    canApply: () => true,
    apply: (player) => {
      for (const weapon of player.weaponManager.getAllWeapons()) {
        weapon.scaleDamage(1.2);
      }
    },
  },
  {
    id: 'speed_up',
    name: 'Speed Up',
    description: '+10% move speed',
    color: 0x44aaff,
    canApply: () => true,
    apply: (player) => {
      player.speed = Math.round(player.speed * 1.1);
    },
  },
  {
    id: 'max_hp',
    name: 'Max HP Up',
    description: '+25 max HP',
    color: 0x44ff44,
    canApply: () => true,
    apply: (player) => {
      player.maxHealth += 25;
      player.heal(25);
    },
  },
  {
    id: 'heal',
    name: 'Heal',
    description: 'Restore 30% HP',
    color: 0x66ff66,
    canApply: (player) => player.health < player.maxHealth,
    apply: (player) => {
      player.heal(Math.round(player.maxHealth * 0.3));
    },
  },
  {
    id: 'cooldown_down',
    name: 'Cooldown Down',
    description: '-10% weapon cooldown',
    color: 0xffaa44,
    canApply: () => true,
    apply: (player) => {
      for (const weapon of player.weaponManager.getAllWeapons()) {
        weapon.reduceCooldown(0.9, MIN_COOLDOWN_MS);
      }
    },
  },
  {
    id: 'pickup_range',
    name: 'Magnet',
    description: '+30% gem pickup range',
    color: 0x88ffaa,
    canApply: () => true,
    apply: (player) => {
      player.pickupRadiusMultiplier = (player.pickupRadiusMultiplier ?? 1) * 1.3;
    },
  },

  // ── Projectile upgrades (fire-wand & bow) ───────────
  {
    id: 'extra_projectile',
    name: 'Extra Projectile',
    description: '+1 projectile',
    color: 0xff8800,
    canApply: hasRangedWeapon,
    apply: (player) => {
      const wand = player.weaponManager.getWeapon('fire-wand') as FireWand | undefined;
      const bow = player.weaponManager.getWeapon('bow') as Bow | undefined;
      if (wand) wand.addProjectile();
      if (bow) bow.addProjectile();
    },
  },
  {
    id: 'pierce_up',
    name: 'Pierce Up',
    description: '+1 pierce',
    color: 0xcc44ff,
    canApply: hasRangedWeapon,
    apply: (player) => {
      const wand = player.weaponManager.getWeapon('fire-wand') as FireWand | undefined;
      const bow = player.weaponManager.getWeapon('bow') as Bow | undefined;
      if (wand) wand.addPierce();
      if (bow) bow.addPierce();
    },
  },

  // ── Sword upgrades ──────────────────────────────────
  {
    id: 'aoe_up',
    name: 'Slash Range Up',
    description: '+20% sword radius',
    color: 0xffdd44,
    canApply: (player) => !!player.weaponManager.getWeapon('sword'),
    apply: (player) => {
      const sword = player.weaponManager.getWeapon('sword') as Sword | undefined;
      if (sword) sword.increaseRadius(1.2);
    },
  },

  // ── Aura upgrades ──────────────────────────────────
  {
    id: 'aura_radius',
    name: 'Aura Radius',
    description: '+20px aura radius',
    color: 0xffaa88,
    canApply: (player) => !!player.weaponManager.getWeapon('aura'),
    apply: (player) => {
      const aura = player.weaponManager.getWeapon('aura') as Aura | undefined;
      if (aura) aura.addRadius();
    },
  },
];

export class UpgradePicker {
  private scene: Phaser.Scene;
  private elements: Phaser.GameObjects.GameObject[] = [];
  private onPicked?: () => void;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  show(player: Player, onPicked: () => void): void {
    this.onPicked = onPicked;

    const applicable = ALL_UPGRADES.filter((u) => u.canApply(player));
    const shuffled = Phaser.Utils.Array.Shuffle([...applicable]);
    const choices = shuffled.slice(0, 3);

    const cx = this.scene.scale.width / 2;
    const cy = this.scene.scale.height / 2;

    // Dim overlay — added directly to scene, not a container
    const overlay = this.scene.add
      .rectangle(cx, cy, this.scene.scale.width, this.scene.scale.height, 0x000000, 0.6)
      .setScrollFactor(0)
      .setDepth(200);
    this.elements.push(overlay);

    // Title
    const title = this.scene.add
      .text(cx, cy - 140, 'LEVEL UP!', {
        fontFamily: 'monospace',
        fontSize: '32px',
        color: '#ffdd44',
        stroke: '#000',
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(201);
    this.elements.push(title);

    // Cards
    const cardWidth = 180;
    const cardHeight = 160;
    const gap = 20;
    const totalWidth = choices.length * cardWidth + (choices.length - 1) * gap;
    const startX = cx - totalWidth / 2 + cardWidth / 2;

    choices.forEach((upgrade, i) => {
      const cardX = startX + i * (cardWidth + gap);
      const cardY = cy + 20;

      const bg = this.scene.add
        .rectangle(cardX, cardY, cardWidth, cardHeight, 0x222222, 0.9)
        .setStrokeStyle(2, upgrade.color)
        .setScrollFactor(0)
        .setDepth(202)
        .setInteractive({ useHandCursor: true });

      const name = this.scene.add
        .text(cardX, cardY - 40, upgrade.name, {
          fontFamily: 'monospace',
          fontSize: '16px',
          color: '#ffffff',
          stroke: '#000',
          strokeThickness: 2,
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(203);

      const desc = this.scene.add
        .text(cardX, cardY + 10, upgrade.description, {
          fontFamily: 'monospace',
          fontSize: '12px',
          color: '#cccccc',
          wordWrap: { width: cardWidth - 20 },
        })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(203);

      bg.on('pointerover', () => bg.setFillStyle(0x333344, 0.95));
      bg.on('pointerout', () => bg.setFillStyle(0x222222, 0.9));

      bg.on('pointerdown', () => {
        upgrade.apply(player);
        this.hide();
        this.onPicked?.();
      });

      this.elements.push(bg, name, desc);
    });
  }

  hide(): void {
    for (const el of this.elements) {
      el.destroy();
    }
    this.elements.length = 0;
  }

  isVisible(): boolean {
    return this.elements.length > 0;
  }
}
