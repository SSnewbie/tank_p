import config from 'config/index';
export default class BaseTank {
  constructor({
    HP,
    ATK,
    SPEED,
    STADIA,
    BATTERY_AV,
    VIEW_ANGLES,
    TURNING_RADIUS,
    FIRING_INTERVAL,
  }) {
    this._HP = HP || 100;
    this._ATK = ATK || 10;
    this._SPEED = SPEED || 1;
    this._STADIA = STADIA || 500;
    this._BATTERY_AV = BATTERY_AV || 2;
    this._TURNING_RADIUS = TURNING_RADIUS || 100;
    this._FIRING_INTERVAL = FIRING_INTERVAL || 1000;
    this._VIEW_ANGLES = VIEW_ANGLES || Math.PI / 3 * 2;

    // 保存可改变状态
    this.state = {
      x: 0,
      y: 0,
      cooling: true,
      tankAngular: 0,
      batterAngular: 0,
    };

    // 对玩家开放的命名空间
    this.user = {

    };
  };

  get HP() { return this._HP; }
  get ATK() { return this._ATK; }
  get SPEED() { return this._SPEED; }
  get STADIA() { return this._STADIA; }
  get BATTERY_AV() { return this._BATTERY_AV; }
  get VIEW_ANGLES() { return this._VIEW_ANGLES; }
  get TURNING_RADIUS() { return this._TURNING_RADIUS; }
  get FIRING_INTERVAL() { return this._FIRING_INTERVAL; }

  get localX() { return this.state.x; }
  set localX(x) { this.state.x = x < 0 && x > config.gameconfig.width ? this.state.x : x; }

  get localY() { return this.state.y; }
  set localX(x) { this.state.y = y < 0 && y > config.gameconfig.height ? this.state.y : y; }

  get tankAngular() { return this.state.tankAngular; }
  set tankAngular(a) { this.state.tankAngular = (a + Math.PI * 2) % (Math.PI * 2); }

  get batterAngular() { return this.state.batterAngular; }
  set batterAngular(a) { this.state.batterAngular = (a + Math.PI * 2) % (Math.PI * 2); }

  stop() {};

  forward() {
    this.localX += this.SPEED * Math.cos(this.tankAngular);
    this.localY -= this.SPEED * Math.cos(this.tankAngular);
  }

  back() {
    this.localX -= this.SPEED * Math.cos(this.tankAngular);
    this.localY += this.SPEED * Math.cos(this.tankAngular);
  }

  shooting() {
    if (this.cooling) {
      this.cooling = false;
      // TODO 射击
      setTimeout(() => { this.cooling = true }, this.FIRING_TATE);
    }
  }

  rotatLefe() {
    this.localX += this.SPEED * Math.cos(this.tankAngular);
    this.localY -= this.SPEED * Math.cos(this.tankAngular);
    this.tankAngular += this.SPEED / this.TURNING_RADIUS;
  }

  rotatLefe() {
    this.localX += this.SPEED * Math.cos(this.tankAngular);
    this.localY -= this.SPEED * Math.cos(this.tankAngular);
    this.tankAngular -= this.SPEED / this.TURNING_RADIUS;
  }

  spinLeft() {
    // TODO 加暂停
    this.tankAngular += this.SPEED / this.TURNING_RADIUS;
  }

  spinRight() {
    // TODO 加暂停
    this.tankAngular -= this.SPEED / this.TURNING_RADIUS;
  }

  batteryRotatLeft() {
    this.batterAngular += this.BATTERY_REV;
  }

  batteryRotatLeft() {
    this.batterAngular -= this.BATTERY_REV;
  }
}