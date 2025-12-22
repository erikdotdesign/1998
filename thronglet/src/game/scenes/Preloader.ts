import { Scene } from 'phaser';

// Thronglet sprites
import THRONGLET_SPRITES from "../assets/images/thronglet/thronglet-sprites.png";
import THRONGLET_SPRITES_JSON from "../assets/images/thronglet/thronglet-sprites.json";
import THRONGLET_EGG_SPRITE from "../assets/images/thronglet/egg.png";
// Item sprites
import ITEM_SPRITES from "../assets/images/items/item-sprites.png"
import ITEM_SPRITES_JSON from "../assets/images/items/item-sprites.json";
// UI sprites
import TOOLBAR_SPRITE from "../assets/images/ui/toolbar.png";
import TOOLBAR_BUTTONS_SPRITE from "../assets/images/ui/toolbar-buttons.png";
import STATS_SPRITE from "../assets/images/ui/stats.png";
import STATS_AVATARS_SPRITE from "../assets/images/ui/stats-avatars.png";
import GAME_OVER_MODAL_SPRITE from "../assets/images/ui/game-over-modal.png";
import PLAY_AGAIN_BUTTON_SPRITE from "../assets/images/ui/play-again-button.png";
import SHARE_FRAME_SPRITE from "../assets/images/ui/share-frame.png";
import SHARE_BUTTON_SPRITE from "../assets/images/ui/share-button.png";
// Map
import TILES from "../assets/images/map/tiles.png";
import TILE_JSON from "../assets/maps/tilemap.json";
// Fonts
import PRESS_P_2_START_FONT from "../assets/fonts/PressStart2P-Regular.ttf";

export class Preloader extends Scene {
  constructor () {
    super('Preloader');
  }

  init () {
    //  A simple progress bar. This is the outline of the bar.
    this.add.rectangle(704/2, 704/2, 468, 32).setStrokeStyle(1, 0xffffff);

    //  This is the progress bar itself. It will increase in size from the left based on the % of progress.
    const bar = this.add.rectangle((704/2)-230, 704/2, 4, 28, 0xffffff);

    //  Use the 'progress' event emitted by the LoaderPlugin to update the loading bar
    this.load.on('progress', (progress: number) => {
      //  Update the progress bar (our bar is 464px wide, so 100% = 464px)
      bar.width = 4 + (460 * progress);
    });
  }

  preload () {
    // --- Load all your real assets here ---
    this.load.image("tiles", TILES);
    this.load.tilemapTiledJSON("map", TILE_JSON);
    // Thronglet sprites
    // multi-atlas does not work in figma sandbox
    // this.load.multiatlas(
    //   "thronglet",
    //   "/thronglet/thronglet-sprites.json",
    //   "/thronglet/"
    // );
    this.load.atlas('thronglet', THRONGLET_SPRITES, THRONGLET_SPRITES_JSON);
    this.load.spritesheet("egg", THRONGLET_EGG_SPRITE, { frameWidth: 440, frameHeight: 528 });
    // Item sprites
    this.load.atlas("item", ITEM_SPRITES, ITEM_SPRITES_JSON);
    // UI sprites
    this.load.spritesheet("ui_toolbar", TOOLBAR_SPRITE, { frameWidth: 1384, frameHeight: 448 });
    this.load.spritesheet("ui_toolbar-buttons", TOOLBAR_BUTTONS_SPRITE, { frameWidth: 272, frameHeight: 272 });
    this.load.spritesheet("ui_stats", STATS_SPRITE, { frameWidth: 448, frameHeight: 1056 });
    this.load.spritesheet("ui_stats-avatars", STATS_AVATARS_SPRITE, { frameWidth: 192, frameHeight: 192 });
    this.load.spritesheet("ui_game-over-modal", GAME_OVER_MODAL_SPRITE, { frameWidth: 456, frameHeight: 344 });
    this.load.spritesheet("ui_play-again-button", PLAY_AGAIN_BUTTON_SPRITE, { frameWidth: 208, frameHeight: 72 });
    this.load.spritesheet("ui_share-frame", SHARE_FRAME_SPRITE, { frameWidth: 176, frameHeight: 176 });
    this.load.spritesheet("ui_share-button", SHARE_BUTTON_SPRITE, { frameWidth: 136, frameHeight: 136 });
    // Fonts
    this.load.font('PressStart2P', PRESS_P_2_START_FONT);
  }

  create () {
    //  When all the assets have loaded, it's often worth creating global objects here that the rest of the game can use.
    //  For example, you can define global animations here, so we can use them in other scenes.
    let initialState = null;

    try {
      const raw = localStorage.getItem("thronglet-cache");
      if (raw) {
        initialState = JSON.parse(raw);
      }
    } catch (e) {
      console.error("Failed to load localStorage cache", e);
    }

    this.registry.set("initialState", initialState);
    this.scene.start("Game");
  }
}