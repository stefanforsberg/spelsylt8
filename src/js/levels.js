import Planet from "./planet";

export default class Levels {
  constructor(scene) {
    this.scene = scene;

    console.log(this.scene.currentLevel);
    if (this.scene.currentLevel == "level3") {
      this.level3();
    } else if (this.scene.currentLevel == "level2") {
      this.level2();
    } else {
      this.level1();
    }
  }

  level1() {
    const textSettings = { fontFamily: "Bebas Neue", fontSize: 40, color: "#ffffff" };

    this.scene.texts.add(this.scene.add.text(100, 200, "You can bounce on stars\nPress and hold button to move forward\nRelease to stop moving", textSettings));
    this.scene.texts.add(this.scene.add.text(80 * 10 - 50, 500, "Mind the gap", textSettings));
    this.scene.texts.add(this.scene.add.text(80 * 18 - 30, 200, "Certain stars are unstable\nBounce away before they fade away", textSettings));
    this.scene.texts.add(this.scene.add.text(80 * 35 - 30, 200, "Jump unto planets to orbit around\nand collect taxes.", textSettings));
    this.scene.texts.add(this.scene.add.text(80 * 40 - 30, 800, "Press button to switch orbit\naround planet", textSettings));
    this.scene.texts.add(this.scene.add.text(80 * 40 - 30, 800, "Press button to switch orbit\naround planet", textSettings));

    this.scene.addStandard(2, 600);
    this.scene.addStandard(3, 600);
    this.scene.addStandard(4, 600);
    this.scene.addStandard(5, 600);
    this.scene.addStandard(6, 600);
    this.scene.addStandard(7, 600);
    this.scene.addStandard(8, 600);
    this.scene.addStandard(9, 600);

    this.scene.addStandard(12, 600);
    this.scene.addStandard(13, 600);

    this.scene.addStandard(16, 500);
    this.scene.addStandard(17, 500);

    this.scene.addFading(20, 500);

    this.scene.addStandard(23, 600);
    this.scene.addStandard(24, 600);
    this.scene.addStandard(25, 600);
    this.scene.addStandard(26, 600);

    this.scene.texts.add(this.scene.add.text(80 * 28 - 30, 200, "Collect coins and watch out\n for spikes.", { fontFamily: "Bebas Neue", fontSize: 40, color: "#ffffff" }));
    this.scene.addStandard(29, 600);
    this.scene.addStandard(30, 600);
    this.scene.coins.create(30 * 80, 550, "coin");
    this.scene.addStandard(31, 500);
    this.scene.spikes.create(31 * 80, 470, "spike");
    this.scene.addStandard(32, 600);

    this.scene.addStandard(35, 600);
    this.scene.addStandard(36, 600);
    this.scene.addStandard(37, 600);
    this.scene.addStandard(38, 600);

    this.scene.addStandard(43, 600);

    this.scene.planets.add(
      new Planet(this.scene, 43 * 80, 600, "planet", 300, 3, (p) => {
        p.addCoin(0, 0);
        p.addCoin(45, 0);
        p.addCoin(230, 1);
      }).sprite
    );

    this.scene.exits.create(47 * 80 + 40, 550, "exit");

    this.scene.addStandard(45, -300);
    this.scene.coins.create(47 * 80, -550, "coin");
    this.scene.exits.create(49 * 80 + 40, -300, "exit");
  }

  level2() {
    this.scene.addStandard(2, 600);
    this.scene.addStandard(3, 600);
    this.scene.addStandard(4, 600);

    this.scene.addStandard(9, 600);
    this.scene.addStandard(10, 400);
    this.scene.addStandard(10, 400);
    this.scene.addStandard(10, 600);
    this.scene.addStandard(11, 400);
    this.scene.addStandard(11, 600);
    this.scene.addStandard(12, 400);
    this.scene.addStandard(12, 600);
    this.scene.coins.create(12 * 80, 550, "coin");
    this.scene.addStandard(13, 600);

    this.scene.addFading(15, 600);
    this.scene.addFading(18, 400);
    this.scene.addFading(21, 500);
    this.scene.coins.create(21 * 80, 250, "coin");
    this.scene.addFading(25, 500);

    this.scene.exits.create(30 * 80 + 40, 300, "exit");
  }

  level3() {
    this.scene.addStandard(2, 600);
    this.scene.addStandard(3, 600);
    this.scene.addStandard(4, 600);

    this.scene.planets.add(
      new Planet(this.scene, 8 * 80, 600, "planet", 300, 3, (p) => {
        p.addCoin(230, 0);
      }).sprite
    );

    this.scene.planets.add(
      new Planet(this.scene, 14 * 80, 600, "planet", 300, 3, (p) => {
        p.addSpike(65, 0);
        p.addCoin(110, 0);
        p.addSpike(200, 0);
      }).sprite
    );

    this.scene.addStandard(18, 600);

    this.scene.addFading(21, 600);
    this.scene.addFading(25, 500);

    // this.scene.addStandard(9, 600);
    // this.scene.addStandard(10, 400);
    // this.scene.addStandard(10, 400);
    // this.scene.addStandard(10, 600);
    // this.scene.addStandard(11, 400);
    // this.scene.addStandard(11, 600);
    // this.scene.addStandard(12, 400);
    // this.scene.addStandard(12, 600);
    // this.scene.coins.create(12 * 80, 550, "coin");
    // this.scene.addStandard(13, 600);

    // this.scene.addFading(15, 600);
    // this.scene.addFading(18, 400);
    // this.scene.addFading(21, 500);
    // this.scene.coins.create(21 * 80, 250, "coin");
    // this.scene.addFading(25, 500);

    this.scene.exits.create(29 * 80 + 40, 300, "exit");
  }
}
