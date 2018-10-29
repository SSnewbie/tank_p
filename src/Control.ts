import { Tank } from "./tank/Tank";
import { Bullet } from "./tank/Bullet";
import { computingAngle, inView, computingDistance } from "./utils";
import { Render } from "./Render";
const S_WIDTH = 800;
const S_HEIGHT = 600;

/**
 * 碰撞检测 和 刷新全局观测 信息
 */
export class Control {
  private render: Render;
  private ticker: PIXI.ticker.Ticker;
  public tanks: Array<Tank>;
  public bullets: Array<Bullet>;
  constructor(render: Render) {
    this.tanks = new Array<Tank>();
    this.bullets = new Array<Bullet>();
    this.render = render;
    this.ticker = this.render.app.ticker;
    this.init();
  }

  init() {
    this.ticker.add(() => {
      this.observe();
      this.bulletsHit();
    });
  }

  public addTank(tank: Tank) {
    this.tanks.push(tank);
  }

  public addBullet(bullet: Bullet) {
    this.bullets.push(bullet);
    this.render.renderBullet(bullet);

    this.ticker.add(() => {
      if (!bullet || bullet.fly()) {
        this.removeBullent(bullet);
        bullet = null;
      }
    });
  }

  public removeBullent(bullet) {
    this.bullets.splice(this.bullets.indexOf(bullet), 1);
  }

  public getTank(name: string): Tank {
    let tank = null;
    this.tanks.forEach(item => {
      if (item.name === name) {
        return (tank = item);
      }
    });
    return tank;
  }

  //碰撞检测
  public bulletsHit() {
    for (let i = 0; i < this.bullets.length; i++) {
      let bullet = this.bullets[i];
      if (!bullet) {
        continue;
      }
      for (let j = 0; j < this.tanks.length; j++) {
        if (
          collision(
            this.tanks[j]._getLocal().x,
            this.tanks[j]._getLocal().y,
            bullet.x,
            bullet.y,
            30
          )
        ) {
          this.tanks[j].hit();
          this.removeBullent(bullet);
          console.log(this.tanks[j].name, "被击中");
        }
      }
    }
  }

  // 刷新每个坦克的观察信息
  public observe() {
    for (let i = 0; i < this.tanks.length; i++) {
      this.tanks[i].cleanObserve();
      let mTank = this.tanks[i];
      let x1 = mTank._getLocal().x;
      let y1 = mTank._getLocal().y;
      //判断与边界的距离
      let borderDistance = 100;
      let ba = [
        Math.atan(y1 / (S_WIDTH - x1)),
        Math.atan(y1 / -x1) + Math.PI,
        Math.atan(-(S_HEIGHT - y1) / -x1) + Math.PI,
        Math.atan(-(S_HEIGHT - y1) / (S_WIDTH - x1))
      ];
      for (let i = 0; i < 4; i++) {
        if (inView(mTank.tankAngular, ba[i], ba[(i + 1) % 4])) {
          if (i === 0) {
            borderDistance = y1 / Math.sin(mTank.tankAngular);
          } else if (i === 1) {
            borderDistance = x1 / Math.cos(mTank.tankAngular);
          } else if (i === 2) {
            borderDistance = -(S_HEIGHT - y1) / Math.sin(mTank.tankAngular);
          } else if (i === 3) {
            borderDistance = -(S_WIDTH - x1) / Math.cos(mTank.tankAngular);
          }
          break;
        }
      }

      mTank.addObserve({
        type: "border",
        a: mTank.tankAngular,
        d: Math.abs(borderDistance)
      });
      //判断与其他坦克的位置关系
      for (let j = 0; j < this.tanks.length; j++) {
        if (i !== j) {
          let dTank = this.tanks[j];
          let x2 = dTank._getLocal().x;
          let y2 = dTank._getLocal().y;
          let a = Math.atan((y2 - y1) / (x1 - x2));
          if (x1 > x2) {
            a += Math.PI;
          }
          if (x1 < x2 && y2 > y1) {
            a += Math.PI * 2;
          }
          a = Math.abs(a);
          //判断是否在视野里 a 为敌方坦克与我方的夹角
          // console.assert(i === 0, a + '', mTank.tankAngular - mTank.VIEW_ANGLES / 2, mTank.tankAngular + mTank.VIEW_ANGLES / 2)
          if (
            inView(
              a,
              mTank.tankAngular - mTank.VIEW_ANGLES / 2,
              mTank.tankAngular + mTank.VIEW_ANGLES / 2
            )
          ) {
            if (i === 1)
              console.log(
                a,
                mTank.tankAngular - mTank.VIEW_ANGLES / 2,
                mTank.tankAngular + mTank.VIEW_ANGLES / 2
              );
            mTank.addObserve({
              type: "enemy",
              a: computingAngle(a, mTank.tankAngular),
              d: computingDistance(x1, y1, x2, y2)
            });
          }
        }
      }
    }
  }
}

function min(a, b) {
  return a < b ? a : b;
}

function collision(tx, ty, bx, by, size) {
  if (Math.abs(tx - bx) < size && Math.abs(ty - by) < size) {
    return true;
  }
}
