export class Weapon {
  private minDamage: number = 5;
  private maxDamage: number = 10;
  private cooldownMs: number = 500;
  private lastAttackTime: number = 0;

  behavior: any; // TODO behavior class

  constructor() {}

  getDamage(): number {
    // Simple random damage between min and max
    return 0;
  }

  canAttack(currentTime: number): boolean {
    // Check if enough time has passed since last attack
    return true;
  }
}
