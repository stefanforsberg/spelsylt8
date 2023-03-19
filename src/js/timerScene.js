export default class TimerScene extends Phaser.Scene {
  constructor(parent) {
    super({
      key: "TimerScene",
    });
  }

  init(data) {
    this.parent = data.parent;
  }

  create() {
    this.bgDimmer = this.add.rectangle(0, 0, this.cameras.main.width, this.cameras.main.height, 0x000000, 0.9).setOrigin(0);
    this.bgDimmer.alpha = 0;
    this.timerText = this.add.text(900, 50, "asd", { fontFamily: "Bebas Neue", fontSize: 40, color: "#ffffff" });

    this.levelStart = Date.now();
    this.running = true;
    this.coins = 0;

    this.container = this.add.container();

    const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

    this.restart = this.add
      .text(screenCenterX, screenCenterY - 120, "Restart", { fontFamily: "Bebas Neue", fontSize: 40, color: "#ffffff" })
      .setOrigin(0.5)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => this.parent.scene.restart());

    this.l1 = this.add.text(screenCenterX, screenCenterY, "Level 1", { fontFamily: "Bebas Neue", fontSize: 40, color: "#ffffff" }).setOrigin(0.5);
    this.l2 = this.add.text(screenCenterX, screenCenterY + 60, "Level 2", { fontFamily: "Bebas Neue", fontSize: 40, color: "#ffffff" }).setOrigin(0.5);

    this.l1.on("pointerdown", () => {
      console.log("p1");
      this.scene.start("TutorialScene");
    });

    this.container.add(this.restart);
    this.container.add(this.l1);
    this.container.add(this.l2);

    this.container.visible = false;
  }

  showEnd() {
    this.parent.stopMovement();
    this.parent.scene.pause();
    this.running = false;
    this.bgDimmer.alpha = 1;
    this.container.visible = true;
  }

  update() {
    if (this.running) {
      const elapsed = Date.now() - this.levelStart;
      const seconds = Math.floor(elapsed / 1000);
      const milliseconds = elapsed % 1000;
      this.timerText.setText(`${seconds}:${milliseconds}\n${this.coins} Coin(s)`);
    }
  }
}
