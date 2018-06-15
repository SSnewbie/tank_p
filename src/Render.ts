/**
 * renderTank
 */
import { Application, autoDetectRenderer, Container, Sprite, Graphics, loaders, Rectangle } from 'pixi.js';
import { Tank } from './tank/Tank';
import { Bullet } from './tank/Bullet';

const sprite = new Sprite();

export class Render {
	private loader: loaders.Loader;
	public app: Application;
	constructor(app: Application, loader: loaders.Loader) {
		this.app = app;
		this.loader = loader;
	}

	public renderTank(tank: Tank): void {
		const app = this.app;
		const textures = this.loader.resources['/static/img/tank.json'].textures;
		const textures2 = this.loader.resources['/static/img/shape.json'].textures;
		const tankSprite = app.stage.addChild(new Sprite(textures['tank-default.png']));
		const line = app.stage.addChild(new Sprite(textures2['line.png']));
		const sector =  app.stage.addChild(new Sprite(textures2['sector.png']));
		tankSprite.width = 50;
		tankSprite.height = 50;
		tankSprite.x = tank._getLocal().x;
		tankSprite.y = tank._getLocal().y;
		tankSprite.anchor.x = 0.5;
		tankSprite.anchor.y = 0.5;

		// 水平线
		line.x = tankSprite.x;
		line.y = tankSprite.y - 3;
		line.anchor.x = 0;
		line.anchor.y = 0;
		line.rotation = Math.PI / 2;

		//扇形
		sector.x = tankSprite.x;
		sector.y = tankSprite.x;
		sector.anchor.x = 0;
		sector.anchor.y = 0.5;


		app.ticker.add(() => {
			tankSprite.x = tank._getLocal().x;
			tankSprite.y = tank._getLocal().y;
			line.x = tankSprite.x;
			line.y = tankSprite.y - 1;
			sector.x = tankSprite.x;
			sector.y = tankSprite.y;
			tankSprite.rotation = -tank.tankAngular;
			line.rotation = -tank.tankAngular;
			sector.rotation =  -tank.tankAngular;
		});

	}

	public renderBullet(bullet: Bullet): void {
		const app = this.app;
		const textures = this.loader.resources['/static/img/tank.json'].textures;
		const tankSprite = app.stage.addChild(new Sprite(textures['bullet.png']));
		tankSprite.width = 50;
		tankSprite.height = 50;
		tankSprite.x = bullet.x;
		tankSprite.y = bullet.y;
		tankSprite.anchor.x = 0.5;
		tankSprite.anchor.y = 0.5;
		tankSprite.rotation = Math.PI / 2;
		app.ticker.add(() => {
			if (bullet) {
				tankSprite.x = bullet.x;
				tankSprite.y = bullet.y;
				tankSprite.rotation = -bullet.d;
			} else {
				tankSprite.removeAllListeners();
			}

		});
	}
}