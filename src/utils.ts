/**
 * 计算a,b的夹角
 * @param a
 * @param b
 */
export function computingAngle(a, b) {
  a = a < 0 ? a + 2 * Math.PI : a
  b = b < 0 ? b + 2 * Math.PI : b
  return Math.abs(a - b) < Math.abs(a + b - 2 * Math.PI) ?
      Math.abs(a - b) :
      Math.abs(a + b - 2 * Math.PI);
}

/**
 * 计算两点距离
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 */
export function computingDistance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}
/**
 *
 * @param w 观测角
 * @param a 小角度
 * @param b 大角度
 */
export function inView(w, a, b) {
  //将是负数的角变为正数
  a = (a + 2 * Math.PI) % (2 * Math.PI)
  b = (b + 2 * Math.PI) % (2 * Math.PI)

  // a为小角度
  if (a > b) {
    let t = a;
    a = b;
    b = t;
  }

  if (b - a < 2 * Math.PI - (b - a)) {
    if (b > w && a < w) {
      return true
    }
  } else {
    if (w > Math.PI && b < w && a < w) {
      return true
    }
    if (w < Math.PI && b > w && a > w) {
      return true
    }
  }
}

/**
 * 生成uuid
 */
export function guid() {
  return 'xxxx-xxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
