import Phaser from 'phaser';
import { config } from './game/game-config';

const createGame = () => {
  return new Phaser.Game(config);
};

createGame();
