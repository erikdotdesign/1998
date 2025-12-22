import { Boot } from "./scenes/Boot";
import { Game } from 'phaser';
import { Preloader } from "./scenes/Preloader";
import { Game as MainGame } from "./scenes/Game";

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 704,
  height: 704,
  backgroundColor: "#000",
  physics: { default: "arcade" },
  parent: 'game-container',
  scene: [
    Boot,
    Preloader,
    MainGame
  ],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_VERTICALLY
  }
};

const StartGame = (parent: string) => {
  return new Game({ ...config, parent });
}

export default StartGame;