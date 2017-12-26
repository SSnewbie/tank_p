/// <reference path="./../defs/phaser.d.ts" />
/// <reference path="./../defs/pixi.d.ts" />
/// <reference path="./../defs/phaser.comments.d.ts" />

import 'pixi';
import 'p2';
import 'phaser';
import { Game, CANVAS, AUTO} from 'phaser';

import { gameconfig } from './../config';
import GameScene from './scenes/GameScene';
import StartScene from './scenes/StartScene';
import TankTestScene from './scenes/TankTestScene';
import BattlefieldScene from './scenes/BattlefieldScene';

const WIDTH = gameconfig.width;
const HEIGHT = gameconfig.height;
const SCENE = gameconfig.scenceSelector;

const game = new Game(WIDTH, HEIGHT, AUTO, SCENE, {}, true);

game.state.add('StartScene', StartScene);
game.state.add('GameScene', GameScene);
game.state.add('TankTestScene', TankTestScene);
game.state.add('BattlefieldScene', BattlefieldScene);

game.state.start("StartScene");

export default game;