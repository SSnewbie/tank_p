import 'pixi';
import 'p2';
import 'phaser';
import { Game, CANVAS, AUTO } from 'phaser';
import { gameconfig } from './../config';

import StartScene from './scenes/start';

const WIDTH = gameconfig.width;
const HEIGHT = gameconfig.height;
const SCENE = gameconfig.scenceSelector;
const game = new Game(WIDTH, HEIGHT, AUTO, SCENE, {}, true);
game.state.add("StartScene", StartScene);
game.state.start("StartScene");
export default game;