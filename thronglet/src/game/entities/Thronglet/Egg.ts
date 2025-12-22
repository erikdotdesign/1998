import Phaser from "phaser";
import { Game } from "../../scenes/Game";

export class Egg extends Phaser.GameObjects.Sprite {
  private cracked = false;

  constructor(scene: Phaser.Scene) {
    const map = (scene as Game).map;
    const { x, y } = {
      x: map.getTileAt(Math.floor(map.width / 2), Math.floor(map.height / 2), true, "floor")!.getCenterX(),
      y: map.getTileAt(Math.floor(map.width / 2), Math.floor(map.height / 2), true, "floor")!.getCenterY(),
    };
    super(scene, x, y, "egg", 0);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setOrigin(0.5, 1).setDisplaySize(44, 52.8);

    this.registerAnimations(scene);
    this.play("egg_wobble");

    this.setInteractive({ useHandCursor: true });
    this.on("pointerdown", () => this.handleClick());
  }

  private registerAnimations(scene: Phaser.Scene) {
    scene.anims.create({
      key: 'egg_wobble',
      frames: this.anims.generateFrameNumbers('egg', { frames: [0,1,0,2] }),
      frameRate: 2,
      repeat: -1,
    });

    scene.anims.create({
      key: 'egg_wobble-cracked',
      frames: this.anims.generateFrameNumbers('egg', { frames: [3,4,3,5] }),
      frameRate: 2,
      repeat: -1,
    });
  }

  private handleClick() {
    if (!this.cracked) {
      // FIRST CLICK → crack it
      this.cracked = true;
      this.play("egg_wobble-cracked");
      return;
    }

    // SECOND CLICK → hatch!
    this.hatch();
  }

  private hatch() {
    const game = this.scene as Game;
    // Spawn a new thronglet
    game.spawnThronglet();
    // Remove egg
    this.destroy();
  }
}