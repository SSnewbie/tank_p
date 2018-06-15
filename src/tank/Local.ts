export class Local {
  private _x: number;
  private _y: number;
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }
  get x(): number {
    return this._x;
  }
  get y(): number {
    return this._y;
  }
  set x(x: number) {
    x = x > 800 ? 800 : x;
    this._x = x;
  }
  set y(y: number) {
    y = y > 600 ? 600 : y;
    this._y = y;
  }
}