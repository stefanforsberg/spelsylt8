export default class BgScene extends Phaser.Scene {
  constructor(parent) {
    super({
      key: "BgScene",
    });
  }

  init(data) {
    this.parent = data.parent;
  }

  create() {
    if (Phaser.Math.RND.between(1, 100) > 50) {
      this.bg = this.add.sprite(0, 0, "bg").setOrigin(0);
    } else {
      this.bg = this.add.sprite(0, 0, "bg2").setOrigin(0);
    }
  }

  update() {
    if (this.parent.moving) {
      this.bg.x--;
    }
  }
}
