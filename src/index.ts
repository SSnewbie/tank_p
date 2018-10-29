import {Application, autoDetectRenderer, Container, Graphics, loaders, Rectangle, Sprite} from 'pixi.js';

import {Control} from './Control';
import {Render} from './Render';
import {UTank} from './UTank';

var game = null;

export default class TankGame {
  loader: loaders.Loader;
  app: Application;
  render: Render;
  control: Control;
  ticker: any;

  constructor(render, control) {
    this.app = new Application();
    this.loader = new loaders.Loader();
    this.render = render;
    this.control = control;
    this.ticker = this.render.app.ticker;
  }
  public addTank(name: string): UTank {
    return new UTank(this.control, this.render);
  }
}

function deleteGame(game) {
  game = null;
  if (game != null) {
    document.querySelector('.sence').innerHTML = '';
  }
}

// 加载资源
export function GameFactory(cb: Function, config: any) {
  let loader = new loaders.Loader();
  let app = new Application({backgroundColor: 0x1b1c17});
  deleteGame(game);
  loader.add('/static/img/tank.json').add('/static/img/shape.json').load(() => {
    document.querySelector('.sence').appendChild(app.view);
    let render = new Render(app, loader);
    let control = new Control(render);
    game = new TankGame(render, control);
    cb(game);
  });
}
