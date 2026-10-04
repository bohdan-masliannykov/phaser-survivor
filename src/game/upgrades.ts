import type { Player } from '@entities/player/player';
import { Aura } from '@entities/weapons/aura';
import { ProjectileWeapon } from '@entities/weapons/projectile-weapon';
import { Sword } from '@entities/weapons/sword';
import type { Weapon } from '@entities/weapons/weapon';

interface UpgradeOption {
  id: string;
  name: string;
  description: string;
  color: number;
  canApply: (player: Player) => boolean;
  apply: (player: Player) => void;
}

const MIN_COOLDOWN_MS = 400;

/** The player's weapons of a given kind, e.g. `weaponsOf(player, Sword)`. */
const weaponsOf = <T extends Weapon>(
  player: Player,
  kind: abstract new (...args: never[]) => T
): T[] =>
  player.weaponManager.getAllWeapons().filter((weapon): weapon is T => weapon instanceof kind);

const has = (player: Player, kind: abstract new (...args: never[]) => Weapon) =>
  weaponsOf(player, kind).length > 0;

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

  // ── Projectile upgrades (any projectile weapon) ─────
  {
    id: 'extra_projectile',
    name: 'Extra Projectile',
    description: '+1 projectile',
    color: 0xff8800,
    canApply: (player) => has(player, ProjectileWeapon),
    apply: (player) => {
      for (const weapon of weaponsOf(player, ProjectileWeapon)) weapon.addProjectile();
    },
  },
  {
    id: 'pierce_up',
    name: 'Pierce Up',
    description: '+1 pierce',
    color: 0xcc44ff,
    canApply: (player) => has(player, ProjectileWeapon),
    apply: (player) => {
      for (const weapon of weaponsOf(player, ProjectileWeapon)) weapon.addPierce();
    },
  },

  // ── Sword upgrades ──────────────────────────────────
  {
    id: 'aoe_up',
    name: 'Slash Range Up',
    description: '+20% sword radius',
    color: 0xffdd44,
    canApply: (player) => has(player, Sword),
    apply: (player) => {
      for (const sword of weaponsOf(player, Sword)) sword.increaseRadius(1.2);
    },
  },

  // ── Aura upgrades ──────────────────────────────────
  {
    id: 'aura_radius',
    name: 'Aura Radius',
    description: '+20px aura radius',
    color: 0xffaa88,
    canApply: (player) => has(player, Aura),
    apply: (player) => {
      for (const aura of weaponsOf(player, Aura)) aura.addRadius();
    },
  },
];

/** Picks up to `count` random upgrades the player can currently use. */
export function rollUpgrades(player: Player, count: number): UpgradeOption[] {
  const applicable = ALL_UPGRADES.filter((upgrade) => upgrade.canApply(player));
  return Phaser.Utils.Array.Shuffle(applicable).slice(0, count);
}
