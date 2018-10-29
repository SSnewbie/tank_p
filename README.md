# 坦克大战？

一个随便写写的文档

## 啊~~

坦克大战相信大多数人都玩过,但是平常玩的坦克大战都是玩家控制的，玩都玩腻了，作为一个技术爱好者，我想给做一个给程序员玩的游戏。用代码控制坦克。

这个游戏很简单，但是没有用游戏引擎。而且是第一次做这样的游戏，代码可以说是一团糟，为了解决 bug 不惜用了很多垃圾代码。所以并没有将源码传 github 上，但是万幸的是玩家不需要去读懂码，我已经开放了部分 api 供玩家使用。
后续我将会重写代码，并传到 github 上

## 游戏的机制

### 观察对象

你会实时的获得一个`ob`对象,这是一个观察列表，这个列表里包含了你看到了所有信息包括几大类

1. 边界-border：就是你离边界多远，在实战中当 border 小于一个值的时候，玩家就应该控制转向了

2. 敌人-enemy：比如你的角度是（与正东方向的夹角）45°，视野角度是 60°，那么你可以观察到 15°-75° 的敌人。比如你的 46° 100m 有个敌人，50° 200m 有个敌人，180° 100m 有个敌人，你将会得到一个这样的信息

```json
[
  { "d": 20, "a": 100 },
  { "d": 10, "a": 100 } //[{方向:20°,距离:100m},{方向:10°,距离:100m}]
]
```

180° 的敌人不在你的观察范围，所以你得不到背后敌人的信息。你可以调整自己的角度去发射炮弹攻击敌人

3- 损伤-damage: 返回损伤的部位是（正面装甲、左侧装甲、右侧装甲、后面装甲），这样被打的时候可以大概知道敌人的方向。做出反击。所以在攻击敌人时也应该变攻击边移动。

### 玩家可以的操作

```js
//中文
tank.do('前进');
tank.do('后退');
tank.do('左拐');
tank.do('右拐');
tank.do('原地左转');
tank.do('原地右转');
tank.do('炮台左转'); //暂时没有做炮台朝向，炮台朝向和坦克朝向相同
tank.do('炮台右转');
tank.do('开火'); //额 虽然子弹和坦克的碰撞检测写好了 但是没写反馈 ...
tank.do('停止');

//英文
tank.do('forward');
tank.do('back');
tank.do('rotatLeft');
tank.do('rotatRight');
tank.do('spinLeft');
tank.do('spinRight');
tank.do('batteryRotatLeft');
tank.do('batteryRotatRight');
tank.do('shooting');
tank.do('stop');
```

### 示范代码

当 border<150m 时原地左转

```js
//  d为距离 a为方向
//  ob.get('border') 返回的是一个数组，因为border只有一个，所以取第0个，
//  ob.get('enemy') 返回的也是一个数组，因为enemy可能有多个，所以应该对数组进行遍历
const ZzYu = game.addTank('ZzYu');
ZzYu.run(ob => {
  console.log(ob.get('border'));
  if (ob.get('border') && ob.get('border')[0].d < 150) {
    ZzYu.do('原地左转');
  } else {
    ZzYu.do('前进');
  }
});
```

当 border<150m 时原地左转

```js
//  d为距离 a为方向
//  ob.get('border') 返回的是一个数组，因为border只有一个，所以取第0个，
//  ob.get('enemy') 返回的也是一个数组，因为enemy可能有多个，所以应该对数组进行遍历
const tank = game.addTank('tank');
const ZzYu = game.addTank('ZzYu');

tank.run(ob => {
  ZzYu.do('左转');
});
ZzYu.run(ob => {
  if (ob.get('enemy')) {
    ZzYu.do('开火');
  } else if (ob.get('border') && ob.get('border')[0].d < 150) {
    ZzYu.do('原地左转');
  } else {
    ZzYu.do('前进');
  }
});
```
