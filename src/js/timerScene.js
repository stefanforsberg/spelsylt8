export default class TimerScene extends Phaser.Scene {
  constructor(parent) {
    super({
      key: "TimerScene",
    });
  }

  init(data) {
    this.parent = data.parent;
    this.showMenu = data.showMenu;
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

    const textSettings = { fontFamily: "Bebas Neue", fontSize: 40, color: "#ffffff" };

    this.restart = this.add
      .text(screenCenterX, screenCenterY - 120, "Restart level", textSettings)
      .setOrigin(0.5)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => this.parent.scene.start("TutorialScene", { level: this.parent.scene.currentLevel }))
      .on("pointerover", () => this.restart.setTint(0xff0000))
      .on("pointerout", () => this.restart.clearTint());

    this.l1 = this.add
      .text(screenCenterX, screenCenterY, "Tutorial Level", textSettings)
      .setOrigin(0.5)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => this.parent.scene.start("TutorialScene", { level: "level1" }))
      .on("pointerover", () => this.l1.setTint(0xff0000))
      .on("pointerout", () => this.l1.clearTint());

    this.l2 = this.add
      .text(screenCenterX, screenCenterY + 60, "Level 2", textSettings)
      .setOrigin(0.5)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => this.parent.scene.start("TutorialScene", { level: "level2" }))
      .on("pointerover", () => this.l2.setTint(0xff0000))
      .on("pointerout", () => this.l2.clearTint());

    this.l3 = this.add
      .text(screenCenterX, screenCenterY + 120, "Level 3", textSettings)
      .setOrigin(0.5)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => this.parent.scene.start("TutorialScene", { level: "level3" }))
      .on("pointerover", () => this.l3.setTint(0xff0000))
      .on("pointerout", () => this.l3.clearTint());

    this.container.add(this.restart);
    this.container.add(this.l1);
    this.container.add(this.l2);
    this.container.add(this.l3);

    if (!this.showMenu) {
      this.container.visible = false;
    } else {
      this.timerText.visible = false;
      this.restart.visible = false;
    }
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
