import Phaser from "phaser";
import StartScene from "./startScene";
import TutorialScene from "./tutorialScene";
import TimerScene from "./timerScene";
import BgScene from "./bgScene";

const config = {
  type: Phaser.AUTO,
  transparent: true,
  scale: {
    parent: "game",
    width: 1024,
    height: 768,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    mode: Phaser.Scale.FIT,
  },
  parent: "game",
  scene: [StartScene, TutorialScene, TimerScene, BgScene],
  pixelArt: false,
  physics: {
    default: "arcade",
    arcade: {
      debug: false,
    },
  },
};

const game = new Phaser.Game(config);

export default game;
