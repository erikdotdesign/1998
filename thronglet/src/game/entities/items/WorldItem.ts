import { Game } from "../../scenes/Game";
import { Thronglet } from "../Thronglet/Thronglet";

export abstract class WorldItem extends Phaser.GameObjects.Sprite {
  public type: string;
  protected sceneRef: Phaser.Scene;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame: string, type: string) {
    super(scene, x, y, texture, frame);
    this.type = type;
    this.sceneRef = scene;

    const tile = (this.scene as Game).map.getTileAtWorldXY(this.x, this.y);

    this.setOrigin(0.5, 1);
    this.setDepth((tile as Phaser.Tilemaps.Tile).y);
    this.setDisplaySize(44, this.height * (44 / this.width));

    scene.add.existing(this);
  }

  abstract playSpawnAnimation(): void;
  abstract playInteractAnimation(onComplete: () => void, opts?: any): void;
  abstract interact(thronglet: Thronglet): void;
}