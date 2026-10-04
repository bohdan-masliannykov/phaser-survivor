import { type CharacterKey, PLAYER } from '@constants';
import { Archer } from './archer';
import { ArmoredAxeman } from './armored-axeman';
import { Priest } from './priest';
import { Soldier } from './soldier';
import { Wizzard } from './wizzard';

export class PlayerFactory {
  static createPlayer(scene: Phaser.Scene, x: number, y: number, characterType: CharacterKey) {
    switch (characterType) {
      case PLAYER.soldier.key:
        return new Soldier(scene, x, y);
      case PLAYER.armoredAxeman.key:
        return new ArmoredAxeman(scene, x, y);
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
