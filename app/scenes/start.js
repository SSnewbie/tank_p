export default class StartScene {
  constructor(game) {
    this.gmae = game;
  }
  preload() {}
  create() {
    const game = this.gmae;
    let text = game.add.text(game.world.centerX, game.world.centerY - 80, "欢迎来到坦克世界", {
      fill: "#000",
      fontSize: "32pt"
    });
    text.anchor.set(0.5);
    let startButton = game.add.text(game.world.centerX, game.world.centerY, "开始游戏", { fill: "#333", fontSize: "24pt" });
    startButton.anchor.set(0.5);
    startButton.inputEnabled = true;
    startButton.events.onInputDown.add(function() {
      game.state.start("GameScene");
    }, this)
  }
  update() {}
}