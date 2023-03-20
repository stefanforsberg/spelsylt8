import Phaser from "phaser";
import imgPlanet from "../img/planet.png";
import imgPlayer from "../img/player.png";
import imgStar from "../img/star.png";
import imgCoin from "../img/coin.png";
import imgSpike from "../img/spike.png";
import imgExit from "../img/exit.png";
import imgBg from "../img/bg.png";

export default class StartScene extends Phaser.Scene {
  constructor() {
    super({
      key: "StartScene",
    });
  }

  preload() {
    this.load.image("planet", imgPlanet);
    this.load.image("player", imgPlayer);
    this.load.image("star", imgStar);
    this.load.image("coin", imgCoin);
    this.load.image("spike", imgSpike);
    this.load.image("exit", imgExit);
    this.load.image("bg", imgBg);

    this.load.script("webfont", "https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js");
  }

  create() {
    WebFont.load({
      google: {
        families: ["Bebas Neue"],
      },
      active: () => {
        this.scene.launch("BgScene", { parent: this });
        this.scene.sendToBack("BgScene");
        // add.text(16, 0, "The face of the\nmoon was in\nshadow.", { fontFamily: "Freckle Face", fontSize: 80, color: "#ffffff" }).setShadow(2, 2, "#333333", 2, false, true);
        // add.text(250, 450, "Waves flung themselves\nat the blue evening.", { fontFamily: "Finger Paint", fontSize: 40, color: "#5656ee" });

        // var t = add.text(330, 200, "R.I.P", { fontFamily: "Nosifer", fontSize: 150, color: "#ff3434" });

        this.scene.launch("TimerScene", { parent: this, showMenu: true });
      },
    });
  }
}
