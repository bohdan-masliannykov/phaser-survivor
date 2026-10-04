# Phaser Survivor

## Project
- Phaser 3 + TypeScript game
- Build: `pnpm dev` (dev server), `pnpm build` (production)
- Goal: a real Vampire-Survivors-like game. Non-commercial, solo portfolio project.
- Engine stays Phaser 3 — do not suggest migrating (e.g. to Godot).

## Working agreement
- Plan first: analyse, agree a plan with the owner, then work through it step by step. Stick to the plan — raise off-plan ideas instead of implementing them.
- Explain game-dev concepts in frontend-architecture terms; guide rather than dump code.
- Keep the code prototype friendly: adding a weapon, enemy, character or upgrade should be a data entry plus at most one small class; tunable numbers live in data, not in logic.
- Apply SOLID, DRY and KISS. Prefer the simplest thing that works; no speculative abstractions.

## Git and PRs
- Never add `Co-Authored-By`, "Generated with Claude Code" or any other AI attribution to commits or PRs.
- PRs are clean and minimal: one concern per PR, no drive-by changes, branch from `main`.
- Commit messages follow Conventional Commits (`feat:`, `fix:`, `refactor:`, `chore:`).
