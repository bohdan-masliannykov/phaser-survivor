# Phaser Survivor

A Vampire Survivors-style game built with Phaser 3 and TypeScript. Pick a character, survive the horde, collect XP gems and choose an upgrade every level.

## Run it

```bash
pnpm install
pnpm dev
```

## Controls

- `W` `A` `S` `D` — move
- `Esc` — pause

Weapons fire on their own at the nearest enemy.

## Scripts

| Script | What it does |
| --- | --- |
| `pnpm dev` | Start the dev server |
| `pnpm build` | Type-check and build for production |
| `pnpm typecheck` | Type-check only |
| `pnpm lint` | Lint and format check (Biome) |
| `pnpm lint:fix` | Apply safe lint and format fixes |

## Project layout

```
src/game/
  constants.ts   tuning values and character / enemy data
  scenes/        preload, character selection, game
  entities/      player, enemies, weapons, projectiles, pickups, terrain
  system/        input, progression, object pools
  ui/            HUD, upgrade picker, game-over screen
```

## License

MIT
