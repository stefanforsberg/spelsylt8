import Phaser from "phaser";
import Planet from "./planet";

export default class TutorialScene extends Phaser.Scene {
  constructor() {
    super({
      key: "TutorialScene",
    });
  }

  create() {
    this.scene.launch("BgScene", { parent: this });
    this.scene.sendToBack("BgScene");

    this.player = this.physics.add.image(200, 200, "player");
    this.player.body.checkCollision.down = true;
    this.player.body.checkCollision.up = true;
    this.player.body.checkCollision.left = false;
    this.player.body.checkCollision.right = false;

    this.texts = this.physics.add.group();

    this.platforms = this.physics.add.group();

    this.coins = this.physics.add.group();
    this.spikes = this.physics.add.group();
    this.planets = this.physics.add.group();
    this.exits = this.physics.add.group();

    this.player.setOrigin(0.5, 0);
    this.player.setGravityY(1000);

    this.playerNoPhysics = this.physics.add.sprite(0, 0, "player");
    this.playerNoPhysics.visible = false;

    this.scene.launch("TimerScene", { parent: this });

    this.timerScene = this.scene.get("TimerScene");

    this.moving = false;

    const textSettings = { fontFamily: "Bebas Neue", fontSize: 40, color: "#ffffff" };

    this.texts.add(this.add.text(100, 200, "You can bounce on stars\nPress and hold button to move forward\nRelease to stop moving", textSettings));
    this.texts.add(this.add.text(80 * 10 - 50, 500, "Mind the gap", textSettings));
    this.texts.add(this.add.text(80 * 18 - 30, 200, "Certain stars are unstable\nBounce away before they fade away", textSettings));
    this.texts.add(this.add.text(80 * 35 - 30, 200, "Jump unto planets to orbit around\nand collect taxes.", textSettings));
    this.texts.add(this.add.text(80 * 40 - 30, 800, "Press button to switch orbit\naround planet", textSettings));

    this.addStandard(2, 600);
    this.addStandard(3, 600);
    this.addStandard(4, 600);
    this.addStandard(5, 600);
    this.addStandard(6, 600);
    this.addStandard(7, 600);
    this.addStandard(8, 600);
    this.addStandard(9, 600);

    this.addStandard(12, 600);
    this.addStandard(13, 600);

    this.addStandard(16, 500);
    this.addStandard(17, 500);

    this.addFading(20, 500);

    this.addStandard(23, 600);
    this.addStandard(24, 600);
    this.addStandard(25, 600);
    this.addStandard(26, 600);

    this.texts.add(this.add.text(80 * 28 - 30, 200, "Collect coins and watch out\n for spikes.", { fontFamily: "Bebas Neue", fontSize: 40, color: "#ffffff" }));
    this.addStandard(29, 600);
    this.addStandard(30, 600);
    this.coins.create(30 * 80, 550, "coin");
    this.addStandard(31, 500);
    this.spikes.create(31 * 80, 470, "spike");
    this.addStandard(32, 600);

    this.addStandard(35, 600);
    this.addStandard(36, 600);
    this.addStandard(37, 600);
    this.addStandard(38, 600);

    this.addStandard(43, 600);

    this.planets.add(
      new Planet(this, 43 * 80, 600, "planet", 300, 3, (p) => {
        p.addCoin(0, 0);
        p.addCoin(45, 0);
        p.addCoin(230, 1);
      }).sprite
    );

    this.exits.create(47 * 80 + 40, 550, "exit");

    this.addStandard(45, -300);
    this.coins.create(47 * 80, -550, "coin");
    this.exits.create(49 * 80 + 40, -300, "exit");

    this.planet = null;
    this.onPlanet = false;
    this.totalPlanetAngle = 0;

    this.physics.add.collider(this.player, this.platforms, (p, s) => {
      if (p.body.touching.up) {
        p.setVelocity(0, 800);
      } else {
        p.setVelocity(0, -800);
      }

      this.cameras.main.stopFollow();

      if (p.scaleX === 1) {
        this.tweens.add({
          targets: p,
          scaleX: 1.3,
          duration: 150,
          yoyo: true,
          ease: Phaser.Math.Easing.Bounce.InOut,
        });
      }

      if (s.fade) {
        s.alpha -= 0.5;
        if (s.alpha <= 0) {
          s.destroy();
        }
      }
    });

    this.physics.add.overlap(this.player, this.coins, (p, c) => {
      c.destroy(true);
      this.timerScene.coins++;
    });

    this.physics.add.overlap(this.playerNoPhysics, this.coins, (p, c) => {
      c.destroy(true);

      this.timerScene.coins++;
    });

    this.physics.add.overlap(this.player, this.spikes, (p, c) => {
      this.scene.restart();
    });

    this.physics.add.overlap(this.playerNoPhysics, this.spikes, (p, c) => {
      this.scene.restart();
    });

    this.physics.add.overlap(this.player, this.exits, (p, c) => {
      this.scene.pause();
      this.timerScene.showEnd();
    });

    this.physics.add.collider(this.player, this.planet, () => {
      console.log("crash planet");
      this.onPlanet = true;
      this.player.body.enable = false;
      this.player.visible = false;
      this.playerNoPhysics.setX(this.player.x);
      this.playerNoPhysics.setY(this.player.y);
      this.currentAngle = -90;
      this.stopMovement();
      this.planetAltitude = 0;

      this.tweens.add({
        targets: [this.cameras.main],
        duration: 300,
        zoom: 0.7,
      });
    });

    this.input.on(
      "pointerdown",
      (pointer) => {
        if (!this.planet) {
          this.move(-300);
        } else {
          this.planetAltitude = this.planetAltitude == 80 ? 0 : 80;
        }
      },
      this
    );

    this.input.on(
      "pointerup",
      (pointer) => {
        if (!this.planet) {
          this.stopMovement();
        } else {
        }
      },
      this
    );
  }

  addStandard(x, y) {
    const s = this.platforms.create(x * 80, y, "star");
    // r1.setTint(0xff00ff);
    s.setImmovable(true);
  }

  addFading(x, y) {
    const s = this.platforms.create(x * 80, y, "star");
    s.setTint(0xff0000);
    s.setImmovable(true);
    s.fade = true;
  }

  move(speed) {
    this.moving = speed != 0;
    this.platforms.setVelocityX(speed);
    this.planets.setVelocityX(speed);
    this.texts.setVelocityX(speed);
    this.coins.setVelocityX(speed);
    this.spikes.setVelocityX(speed);
    this.exits.setVelocityX(speed);
  }

  moveTo(x) {
    this.planets.children.entries.forEach((o) => o.setX(o.x - x));
    this.platforms.children.entries.forEach((o) => o.setX(o.x - x));
    this.texts.children.entries.forEach((o) => o.setX(o.x - x));
    this.coins.children.entries.forEach((o) => o.setX(o.x - x));
    this.spikes.children.entries.forEach((o) => o.setX(o.x - x));
    this.exits.children.entries.forEach((o) => o.setX(o.x - x));
  }

  stopMovement() {
    this.move(0);
  }

  update() {
    if (this.player.y > 900) {
      this.timerScene.showEnd();
    }

    this.texts.children.entries.forEach((t) => {
      const pos = t.x + t.width / 2;
      if (pos > 800) {
        t.alpha = 0;
      } else if (pos < 800 && pos > 100) {
        t.alpha = (600 - pos) / 200;
      } else if (pos < 100) {
        t.alpha = pos / 100;
      }
    });

    if (this.planet) {
      this.currentAngle = Phaser.Math.Angle.WrapDegrees(this.currentAngle + 2);
      this.totalPlanetAngle += 2;
      var radians = Phaser.Math.DegToRad(this.currentAngle);
      var distanceFromCenter = (150 + 80 * 2 + 70 + this.planetAltitude) / 2;
      this.playerNoPhysics.angle = this.currentAngle + 90;
      this.playerNoPhysics.setX(this.planet.sprite.x + distanceFromCenter * Math.cos(radians));
      this.playerNoPhysics.setY(this.planet.sprite.y + distanceFromCenter * Math.sin(radians));

      if (this.totalPlanetAngle > 360) {
        this.planet.completed();

        this.player.setPosition(this.playerNoPhysics.x, this.playerNoPhysics.y);
        this.player.body.enable = true;

        if (this.timerScene.coins >= this.planet.numberOfCoinsForBoost) {
          this.cameras.main.startFollow(this.player, true, 0, 0.5);
          this.player.setVelocity(0, -1400);
        } else {
          this.player.setVelocity(0, -800);
        }

        this.planet = null;

        this.player.visible = true;
        this.playerNoPhysics.visible = false;
        this.playerNoPhysics.setPosition(0, 0);
        this.playerNoPhysics.visible = false;
      }
    }
  }
}
