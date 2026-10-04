import { PLAYER } from '@constants';
import { Soldier } from './soldier';
import { Wizzard } from './wizzard';
import { Archer } from './archer';
import { Priest } from './priest';

export class PlayerFactory {
  static createPlayer(
    scene: Phaser.Scene,
    x: number,
    y: number,
    characterType: keyof typeof PLAYER
  ) {
    switch (characterType) {
      case PLAYER.soldier.key:
        return new Soldier(scene, x, y);
      case PLAYER.wizzard.key:
        return new Wizzard(scene, x, y);
      case PLAYER.archer.key:
        return new Archer(scene, x, y);
      case PLAYER.priest.key:
        return new Priest(scene, x, y);
      default:
        throw new Error(`Unknown character type: ${characterType}`);
    }
  }
}
