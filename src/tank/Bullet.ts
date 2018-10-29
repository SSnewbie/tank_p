const SPEED = 8;
import {guid} from './../utils';
/**
 * 子弹
 */
export class Bullet {
  public x: number;
  public y: number;
  public d: number;
  public name: number;
  public uid: string;

  /**
   *
   * @param x 坐标x
   * @param y 坐标y
   * @param d 方向
   */

  constructor(name, x, y, d) {
    this.uid = guid();
    this.name = name;
    this.d = d;
    this.x = x + Math.cos(this.d) * 50;
    this.y = y - Math.sin(this.d) * 50;
  }

  fly() {
    this.x += Math.cos(this.d) * SPEED;
    this.y -= Math.sin(this.d) * SPEED;
    if (this.x > 1000 || this.y > 1000) {
      return true;
    }
  }
}
