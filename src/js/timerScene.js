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

  loadScores() {
    if (!localStorage.getItem("spelsylt8-skattmas-i-rymden")) {
      localStorage.setItem("spelsylt8-skattmas-i-rymden", JSON.stringify({ level1: 100000, level2: 100000, level3: 100000, level4: 100000 }));
    }

    this.scores = JSON.parse(localStorage.getItem("spelsylt8-skattmas-i-rymden"));
  }

  saveScores() {
    localStorage.setItem("spelsylt8-skattmas-i-rymden", JSON.stringify(this.scores));
  }

  setScores() {
    this.l1.setText(`Level 1 - (best ${this.formatTime(this.scores.level1)} s)`);
    this.l2.setText(`Level 2 - (best ${this.formatTime(this.scores.level2)} s)`);
    this.l3.setText(`Level 3 - (best ${this.formatTime(this.scores.level3)} s)`);
    this.l4.setText(`Level 4 - (best ${this.formatTime(this.scores.level4)} s)`);
  }

  create() {
    this.loadScores();
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

    this.l1 = this.add
      .text(screenCenterX, screenCenterY - 60, "Tutorial Level", textSettings)
      .setOrigin(0.5)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => this.parent.scene.start("TutorialScene", { level: "level1" }))
      .on("pointerover", () => this.l1.setTint(0xff0000))
      .on("pointerout", () => this.l1.clearTint());

    this.l2 = this.add
      .text(screenCenterX, screenCenterY, "Level 2", textSettings)
      .setOrigin(0.5)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => this.parent.scene.start("TutorialScene", { level: "level2" }))
      .on("pointerover", () => this.l2.setTint(0xff0000))
      .on("pointerout", () => this.l2.clearTint());

    this.l3 = this.add
      .text(screenCenterX, screenCenterY + 60, "Level 3", textSettings)
      .setOrigin(0.5)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => this.parent.scene.start("TutorialScene", { level: "level3" }))
      .on("pointerover", () => this.l3.setTint(0xff0000))
      .on("pointerout", () => this.l3.clearTint());

    this.l4 = this.add
      .text(screenCenterX, screenCenterY + 120, "Level 4", textSettings)
      .setOrigin(0.5)
      .setInteractive({ cursor: "pointer" })
      .on("pointerdown", () => this.parent.scene.start("TutorialScene", { level: "level4" }))
      .on("pointerover", () => this.l4.setTint(0xff0000))
      .on("pointerout", () => this.l4.clearTint());

    this.endLevelText = this.add
      .text(screenCenterX, screenCenterY + -240, ``, textSettings)
      .setOrigin(0.5)
      .setVisible(false);

    this.container.add(this.l1);
    this.container.add(this.l2);
    this.container.add(this.l3);
    this.container.add(this.l4);

    this.setScores();

    if (!this.showMenu) {
      this.container.visible = false;
    } else {
      this.timerText.visible = false;
    }
  }

  showEnd(completed) {
    this.running = false;

    this.timerText.visible = false;
    this.endLevelText.setVisible(true);

    if (completed) {
      const coinAntiBonus = this.parent.levelCoins - this.coins;

      const elapsed = Date.now() - this.levelStart;
      const totalTime = elapsed + 4000 * coinAntiBonus;

      if (totalTime < this.scores[this.parent.currentLevel]) {
        this.scores[this.parent.currentLevel] = totalTime;
        this.saveScores();
        this.setScores();
      }

      this.endLevelText.setText(`Total time: ${this.formatTime(totalTime)}\n(Missed coins: ${coinAntiBonus})`);
    } else {
      this.endLevelText.setText("TRY AGAIN");
    }

    this.parent.stopMovement();
    this.parent.scene.pause();

    this.bgDimmer.alpha = 1;
    this.container.visible = true;
  }

  formatTime(elapsedTime) {
    const seconds = Math.floor(elapsedTime / 1000);
    const milliseconds = elapsedTime % 1000;
    return `${seconds}:${milliseconds}`;
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
