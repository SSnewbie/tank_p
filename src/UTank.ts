import { Tank } from "./tank/Tank";
import { Control } from "./Control";
import { Render } from "./Render";
import { ObserveHelper } from "./tank/ObserveHelper";

export class UTank {
  private render: Render;
  private control: Control;
  private operations: any;
  private operationQueue: Array<string>;
  //TODO 上线后关闭
  public tank: Tank;
  constructor(control: Control, render: Render) {
    this.control = control;
    this.render = render;
    this.operations = [];
    this.operationQueue = [];
    this.tank = new Tank(
      {
        HP: 100,
        ATK: 10,
        TURNING_RADIUS: 100,
        SPEED: 3,
        BATTERY_REV: 1,
        STADIA: 1,
        FIRING_TATE: 1000,
        VIEW_ANGLES: 1
      },
      name,
      { x: 300, y: 300, ta: 0, ba: 0 },
      this.control
    );
    this.init();
  }

  private init() {
    //初始化操作
    this.operations = {
      stop: () => {
        this.tank.stop();
      },
      forward: () => {
        this.tank.forward();
      },
      back: () => {
        this.tank.back();
      },
      rotatLeft: n => {
        this.tank.rotatLeft(n);
      },
      rotatRight: n => {
        this.tank.rotatRight(n);
      },
      spinLeft: n => {
        this.tank.spinLeft(n);
      },
      spinRight: n => {
        this.tank.spinRight(n);
      },
      shooting: () => {
        this.tank.shooting();
      },
      batteryRotatLeft: () => {
        this.tank.batteryRotatLeft();
      },
      batteryRotatRight: () => {
        this.tank.batteryRotatRight();
      },

      /** 中文接口 */
      停止: () => {
        this.tank.stop();
      },
      前进: n => {
        this.tank.forward(n);
      },
      后退: n => {
        this.tank.back(n);
      },
      左转: n => {
        this.tank.rotatLeft(n);
      },
      右转: n => {
        this.tank.rotatRight(n);
      },
      原地左转: n => {
        this.tank.spinLeft(n);
      },
      原地右转: n => {
        this.tank.spinRight(n);
      },
      开火: () => {
        this.tank.shooting();
      },
      炮台左转: () => {
        this.tank.batteryRotatLeft();
      },
      炮台右转: () => {
        this.tank.batteryRotatRight();
      }
    };
    this.render.renderTank(this.tank);
    this.control.addTank(this.tank);
  }

  do(operation: string) {
    this.operationQueue.push(operation);
  }

  run(cb: Function) {
    const observeHelper = new ObserveHelper();
    this.render.app.ticker.add(() => {
      let operation = this.operationQueue.shift();
      if (operation) {
        try {
          // 执行命令
          this.operations[operation]();
        } catch (e) {
          console.error("不存在的操作");
        }
      } else {
        // 更新 observer
        observeHelper.updated(this.tank.getObserve());
        cb(observeHelper);
      }
    });
  }
}
