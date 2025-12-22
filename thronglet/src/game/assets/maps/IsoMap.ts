import Phaser from "phaser";
import { Game } from "../../scenes/Game";

export function createIsoMap(scene: Game) {
  const windowWidth = 704;
  const windowHeight = 704;

  const map = scene.make.tilemap({ key: "map" });
  const tileset = map.addTilesetImage("thronglet-tiles", "tiles") as Phaser.Tilemaps.Tileset;

  const mapPixelWidth = map.widthInPixels;
  const mapPixelHeight = map.heightInPixels;

  const offsetX = windowWidth / 2 - map.tileWidth / 2;
  const offsetY = (windowHeight / 2) - (mapPixelHeight / 2);

  const floorLayer = map.createLayer("floor", tileset, offsetX, offsetY + 16) as Phaser.Tilemaps.TilemapLayer;
  floorLayer.setDepth(0);

  scene.map = map;
};