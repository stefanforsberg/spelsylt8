import Phaser from "phaser";

export default class Planet {
  constructor(scene, x, y, texture, size, numberOfCoinsForBoost, addItems) {
    this.scene = scene;
    this.size = size;
    this.sprite = scene.physics.add.sprite(x, y, texture);
    this.sprite.angle = Phaser.Math.RND.between(0, 359);
    this.sprite.displayWidth = size;
    this.sprite.displayHeight = size;
    this.sprite.setCircle(size / 2);
    this.sprite.setImmovable(true);
    this.numberOfCoinsForBoost = numberOfCoinsForBoost;

    this.spritesAdded = [];

    console.log(this);
    const self = this;

    if (addItems) addItems(self);

    scene.physics.add.overlap(scene.player, this.sprite, () => {
      console.log("crash planet");

      scene.totalPlanetAngle = 0;

      scene.stopMovement();

      scene.planet = this;
      scene.onPlanet = true;
      scene.player.body.enable = false;
      scene.player.visible = false;
      scene.playerNoPhysics.setX(scene.player.x);
      scene.playerNoPhysics.setY(scene.player.y);
      scene.playerNoPhysics.visible = true;
      scene.currentAngle = -90;
      scene.planetAltitude = 0;

      scene.tweens.add({
        targets: [scene.cameras.main],
        duration: 300,
        zoom: 0.7,
      });
    });
  }

  addCoin(angle, vertical) {
    const radians = Phaser.Math.DegToRad(angle - 90);
    const distanceFromCenter = (this.size / 2 + 80 * 2 + 15 + 250 * vertical) / 2;

    const c = this.scene.coins.create(this.sprite.x + distanceFromCenter * Math.cos(radians), this.sprite.y + distanceFromCenter * Math.sin(radians), "coin");
    this.spritesAdded.push(c);
  }

  addSpike(angle, vertical) {
    const radians = Phaser.Math.DegToRad(angle - 90);
    const distanceFromCenter = this.size / 2 + 50 * vertical;

    const s = this.scene.spikes.create(this.sprite.x + distanceFromCenter * Math.cos(radians), this.sprite.y + distanceFromCenter * Math.sin(radians), "spike");
    s.setAngle(angle);
    this.spritesAdded.push(s);
  }

  completed() {
    this.spritesAdded.forEach((s) => s.destroy());
    this.sprite.destroy();

    this.scene.tweens.add({
      targets: [this.scene.cameras.main],
      duration: 300,
      zoom: 1,
    });
  }
}
