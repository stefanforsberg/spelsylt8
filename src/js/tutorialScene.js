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

    this.player = this.physics.add.image(300, 200, "player");
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
      this.canDash = true;

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
        const starAnim = this.add.sprite(s.x, s.y, "starAnim");
        this.tweens.add({
          targets: starAnim,
          duration: 200,
          y: s.y + 20,
          x: s.x + s.body.velocity.x / 4,
          alpha: 0,
        });

        s.alpha -= 1;
        if (s.alpha <= 0) {
          s.destroy();
        }
      } else if (!s.moving) {
        this.tweens.add({
          targets: s,
          y: s.y + 5,
          duration: 150,
          yoyo: true,
          ease: Phaser.Math.Easing.Bounce.InOut,
        });
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
      this.timerScene.showEnd(true);
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

    let lastPointerDown = this.time.now;
    this.isMoving = false;
    this.isDashing = false;
    this.canDash = true;
    this.input.on(
      "pointerdown",
      (pointer) => {
        this.isMoving = true;

        if (!this.planet && !this.isDashing) {
          let clickDelay = this.time.now - lastPointerDown;
          lastPointerDown = this.time.now;
          if (clickDelay < 250 && this.canDash) {
            this.canDash = false;

            this.move(-300 * 6);
            this.isDashing = true;
            this.player.setVelocityY(0);
            this.player.body.setAllowGravity(false);

            const d = this.add.sprite(this.player.x - 80, this.player.y, "dash").setOrigin(0.5, 0);
            this.tweens.add({
              targets: d,
              x: this.player.x - 300,
              alpha: 0,
              duration: 400,
              scale: 2,
            });

            this.time.addEvent({
              delay: 200,
              callback: () => {
                this.isDashing = false;
                this.move(this.isMoving ? -300 : 0);
                this.player.body.setAllowGravity(true);
              },
              loop: false,
            });
          } else {
            this.move(-300);
          }
        } else {
          this.planetAltitude = this.planetAltitude == 80 ? 0 : 80;
        }
      },
      this
    );

    this.input.on(
      "pointerup",
      (pointer) => {
        this.isMoving = false;
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
    s.setImmovable(true);
  }

  addMoving(x, y, deltaY, duration) {
    const s = this.platforms.create(x * 80, y, "star");
    s.moving = true;
    s.setImmovable(true);
    this.tweens.add({
      targets: s,
      y: y + deltaY,
      yoyo: true,
      duration: duration,
      loop: -1,
    });
  }

  addFading(x, y) {
    const s = this.platforms.create(x * 80, y, "star");
    s.setTint(0xff0000);
    s.setImmovable(true);
    s.fade = true;
  }

  move(speed) {
    if (this.isDashing) return;
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
      var distanceFromCenter = this.planet.size / 2 + 1 + 40 + this.planetAltitude;
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
