/**
 * [保护-固定-属性]
 * HP						   			| 坦克的血量        
 * ATK									| 坦克攻击力
 * SIZE									| 坦克的体积
 * SPEED				   			| 坦克的速度
 * STADIA								| 坦克的视距
 * BATTERY_REV		 			| 炮台的转速
 * FIRING_TATE     		  | 坦克的攻速
 * VIEW_ANGLES          | 坦克的视角
 * TURNING_RADIUS			  | 坦克转弯半径
 * 
 * [开放-固定-行为]
 * forward						 |前进
 * back							   |后退
 * shooting					   |射击
 * rotatRight					 |右转
 * rotatLeft					 |左转
 * batteryRotatRight	 |炮台右转
 * batteryRotatLeft		 |炮台左转
 * 
 * [开放-固定-事件]
 * beingHitHandle				|被击中   -返回 [前、后、左、右] 4个方向的一个
 * observeHandle				|观察变化	-返回一个列表 [{当前朝向的12点坐标系，大概距离}]
 * locationHandle				|当前朝向
 * 
 * [开放-自定义-信息]
 * information          |处理获取的信息
 * 
 * [保护-渲染-属性]
 * _local						    |位于场景中的位置 x，y
 * _tankAngular					|坦克角度
 * _batterAngular				|炮管角度		 					
 */
import { Local } from './Local';
import { Bullet } from './Bullet';
import { Control } from './../Control';

export class Tank {
  private _HP: number;
  private _ATK: number;
  private _SPEED: number;
  private _STADIA: number;
  private _BATTERY_REV: number;
  private _FIRING_TATE: number;
  private _VIEW_ANGLES: number;
  private _TURNING_RADIUS: number;

  private _tankAngular: number;
  private _batterAngular: number;

  private __local: Local;

  private cooling: boolean;
  private observeInfo: Array<Object>;
  private information: object;
  public name: string;


  private beingHitHandle: Event;
  private control: Control;

  constructor({
    HP, ATK, TURNING_RADIUS, SPEED, BATTERY_REV, STADIA, FIRING_TATE, VIEW_ANGLES
  }, name: string, config = { x: null, y: null, ta: null, ba: null }, control) {

    this._HP = HP;
    this._ATK = ATK;
    this._SPEED = SPEED;
    this._STADIA = STADIA;
    this._BATTERY_REV = BATTERY_REV;
    this._BATTERY_REV = BATTERY_REV;
    this._FIRING_TATE = FIRING_TATE;
    this._VIEW_ANGLES = VIEW_ANGLES;
    this._TURNING_RADIUS = TURNING_RADIUS;

    this.name = name;
    this.cooling = true;
    this._tankAngular = config.ta || 0;
    this._batterAngular = config.ba || 0;
    this.observeInfo = [];
    this.__local = new Local(config.x || 10, config.y || 10);
    this.control = control;
  }

  public hit() {
    this.HP -= 10;
  }

  public set tankAngular(a: number) {
    this._tankAngular = a % (Math.PI * 2);
  }

  public set batterAngular(a: number) {
    this._batterAngular = a % (Math.PI * 2);
  }

  public get tankAngular() {
    return this._tankAngular > 0 ? this._tankAngular : Math.PI * 2 + this._tankAngular;
  }

  public get batterAngular() {
    return this._batterAngular > 0 ? this._batterAngular : Math.PI * 2 + this._batterAngular;
  }

  public stop() { };
  public forward(n: number = 1) {
    if (n > 1 || n < 0) {
      n = 1;
    }
    this._setLocal(
      this.SPEED * Math.cos(this.tankAngular) * n,
      - this.SPEED * Math.sin(this.tankAngular) * n,
    )
  }

  public back(n: number = 1) {
    if (n > 1 || n < 0) {
      n = 1;
    }
    this._setLocal(
      -this.SPEED * Math.cos(this.tankAngular) * n,
      this.SPEED * Math.sin(this.tankAngular) * n,
    )
  }

  public shooting() {
    if (this.cooling) {
      this.cooling = false;
      // TODO 以后用炮管角度
      let bullet = new Bullet(this.name, this._getLocal().x, this._getLocal().y, this._tankAngular);
      
      // this.control.addBullet(bullet)
      this.control.addBullet(bullet);
    
      setTimeout(() => {this.cooling = true }, this.FIRING_TATE);
    } else {
    }
  }

  public rotatLeft(n: number = 1) {
    if (n > 1 || n < 0) {
      n = 1;
    }
    this.forward();
    this.tankAngular += this.SPEED / (this.TURNING_RADIUS / n);
  }

  public rotatRight(n: number = 1) {
    if (n > 1 || n < 0) {
      n = 1;
    }
    this.forward();
    this.tankAngular -= this.SPEED / (this.TURNING_RADIUS / n);
  }

  public spinLeft(n: number = 1) {
    if (n > 1 || n < 0) {
      n = 1;
    }
    this.tankAngular += this.SPEED * 2 / (this.TURNING_RADIUS / n);
  }

  public spinRight(n: number = 1) {
    if (n > 1 || n < 0) {
      n = 1;
    }
    this.tankAngular -= this.SPEED * 2 / (this.TURNING_RADIUS / n);
  }

  public batteryRotatLeft(n: number = 1) {
    if (n > 1 || n < 0) {
      n = 1;
    }
    this.batterAngular += this.BATTERY_REV * n;
  }

  public batteryRotatRight(n: number = 1) {
    if (n > 1 || n < 0) {
      n = 1;
    }
    this.batterAngular -= this.BATTERY_REV * n;
  }

  public addObserve(info) {
    this.observeInfo.push(info);
  }

  public getObserve() {
    return this.observeInfo;
  }

  public cleanObserve() {
    this.observeInfo = [];
  }


  public get HP(): number {
    return this._HP;
  }

  public set HP(hp) {
    this._HP = hp;
  }

  public get ATK(): number {
    return this._ATK;
  }

  public get SPEED(): number {
    return this._SPEED;
  }

  public get BATTERY_REV(): number {
    return this._BATTERY_REV;
  }

  public get FIRING_TATE(): number {
    return this._FIRING_TATE;
  }

  public get VIEW_ANGLES(): number {
    return this._VIEW_ANGLES;
  }

  public get TURNING_RADIUS(): number {
    return this._TURNING_RADIUS;
  }

  public _getLocal() {
    return this.__local;
  }

  public _setLocal(x: number, y: number) {
    this.__local.x += x;
    this.__local.y += y;
  }
}
