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
    this.bg = this.add.sprite(0, 0, "bg").setOrigin(0);
  }

  update() {
    if (this.parent.moving) {
      this.bg.x--;
    }
  }
}
