import Phaser from "phaser";

import Levels from "./levels";

export default class TutorialScene extends Phaser.Scene {
  constructor() {
    super({
      key: "TutorialScene",
    });
  }

  init(data) {
    this.currentLevel = data.level;
  }

  create() {
    this.scene.launch("BgScene", { parent: this });
    this.scene.sendToBack("BgScene");

    this.player = this.physics.add.image(200, 200, "player");
    this.player.body.checkCollision.down = true;
    this.player.body.checkCollision.up = true;
    this.player.body.checkCollision.left = false;
    this.player.body.checkCollision.right = false;
    this.player.setOrigin(0.5, 0);
    this.player.setGravityY(1000);

    this.playerNoPhysics = this.physics.add.sprite(0, 0, "player");
    this.playerNoPhysics.visible = false;

    this.texts = this.physics.add.group();
    this.platforms = this.physics.add.group();
    this.coins = this.physics.add.group();
    this.spikes = this.physics.add.group();
    this.planets = this.physics.add.group();
    this.exits = this.physics.add.group();

    this.scene.launch("TimerScene", { parent: this });
    this.timerScene = this.scene.get("TimerScene");

    this.moving = false;

    console.log("cl: " + this.currentLevel);
    this.levels = new Levels(this);

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
        s.alpha -= 1;
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
      var distanceFromCenter = (this.planet.size / 2 + 80 * 2 + 70 + this.planetAltitude) / 2;
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
