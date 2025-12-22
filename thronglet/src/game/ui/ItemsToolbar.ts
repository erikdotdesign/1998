import { Game } from "../scenes/Game";

export class ItemsToolbar {
  private scene: Game;
  private container: Phaser.GameObjects.Container;
  private frame: Phaser.GameObjects.Image;
  private scrubCooldown = { value: 0 };

  constructor(scene: Game) {
    this.scene = scene;

    this.container = this.scene.add.container(0, 0)
      .setScrollFactor(0)
      .setDepth(9999);

    this.frame = this.scene.add.image(0, 0, "ui_toolbar", 2)
      .setOrigin(0)
      .setDisplaySize(346, 112);

    this.container.add(this.frame);

    this.createButtons();
    this.setupResizeListener();
  }

  private createButtons() {
    const buttons = [
      this.createButton(0),
      this.createButton(1),
      this.createButton(2),
    ];

    // position buttons
    buttons.forEach((btn, i) => {
      btn.x = 10 + i * (68 + 2);
      btn.y = this.frame.displayHeight / 2;
      this.container.add(btn);
    });
  }

  private createButton(startFrame: number) {
    const btn = this.scene.add.image(0, 0, "ui_toolbar-buttons", startFrame)
      .setOrigin(0, 0.5)
      .setDisplaySize(68, 68)
      .setInteractive({ cursor: "pointer" });

    const normal = startFrame;
    const hover = startFrame + 3;
    const down = startFrame + 6;

    btn.on("pointerover", () => btn.setFrame(hover));
    btn.on("pointerout", () => btn.setFrame(normal));

    btn.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      btn.setFrame(down);
      this.startDraggingTool(btn, startFrame, pointer);
    });

    btn.on("pointerup", () => btn.setFrame(hover));

    return btn;
  }

  private getItemKey(startFrame: number) {
    switch (startFrame) {
      case 0: return "apple/spawn/apple-spawn-0001.png";
      case 1: return "ball/spawn/ball-spawn-0001.png";
      case 2: return "sponge/clean/sponge-clean-0001.png";
    }
  }

  private startDraggingTool(
    btn: Phaser.GameObjects.Image,
    startFrame: number,
    pointer: Phaser.Input.Pointer
  ) {
    if (!this.scene.thronglet) return;
    const matrix = btn.getWorldTransformMatrix();
    const worldX = matrix.tx;
    const worldY = matrix.ty;

    const itemKey = this.getItemKey(startFrame);

    const clone = this.scene.add.sprite(worldX, worldY, "item", itemKey)
      .setOrigin(0.5, 1)
      .setDisplaySize(44, startFrame === 2 ? 44 : 88)
      .setDepth(5000)
      .setAlpha(0.95);

    clone.setData("itemIndex", startFrame);
    clone.setData("itemKey", itemKey);

    const onMove = (ptr: Phaser.Input.Pointer) => {
      clone.x = ptr.worldX;
      clone.y = ptr.worldY;

      // Only if sponge
      if (startFrame === 2) {
        this.handleSpongeScrub(clone, this.scrubCooldown);
      }
    };

    const onUp = (ptr: Phaser.Input.Pointer) => {
      this.scene.input.off("pointermove", onMove);
      this.scene.input.off("pointerup", onUp);

      this.tryDrop(clone, ptr);

      if (clone.scene) clone.destroy();
    };

    clone.x = pointer.worldX;
    clone.y = pointer.worldY;

    this.scene.input.on("pointermove", onMove);
    this.scene.input.on("pointerup", onUp);
  }

  private tryDrop(clone: Phaser.GameObjects.Image, pointer: Phaser.Input.Pointer) {
    if (!this.scene.thronglet) return;
    
    const worldX = pointer.worldX;
    const worldY = pointer.worldY;

    // Reset appearence if cleaning
    if ((this.scene as Game).thronglet.currentAction === "cleaning") {
      (this.scene as Game).thronglet.setAction("pathing", "idle");
    }

    const itemTile = (this.scene as Game).map.getTileAtWorldXY(worldX, worldY);

    if (!itemTile) return;

    // Normalize into item type names
    const itemIndex = clone.getData("itemIndex"); 
    const itemType = itemIndex === 0 ? "apple" :
                    itemIndex === 1 ? "ball"  :
                    itemIndex === 2 ? "sponge" : "";

    if (itemType !== "sponge")
      this.scene.spawnWorldItem(itemType, itemTile.getCenterX(), itemTile.getCenterY());
  }

  private handleSpongeScrub(
    clone: Phaser.GameObjects.Sprite,
    cooldown: { value: number }
  ) {
    const scene = this.scene as Game;
    const thronglet = scene.thronglet;

    if (["dead", "playing", "eating", "seeking"].includes(thronglet.currentAction)) return;

    // reduce cooldown
    if (cooldown.value > 0) {
      cooldown.value -= scene.game.loop.delta; 
      return;
    }

    // clear cleaning action if no overlap
    if (!Phaser.Geom.Intersects.RectangleToRectangle(clone.getBounds(), thronglet.getBounds())) {
      if (thronglet.currentAction === "cleaning") {
        thronglet.setAction("pathing", "idle");
      }
      return;
    }

    // reset cooldown (ms)
    cooldown.value = 120;

    thronglet.spongeBath();
  }

  private setupResizeListener() {
    this.scene.scale.on("resize", () => this.position());
    this.position();
  }

  private position() {
    const cam = this.scene.cameras.main;
    const bounds = this.container.getBounds();

    const padding = 12;

    this.container.setPosition(
      cam.width - bounds.width - padding,
      cam.height - bounds.height - padding
    );
  }

  // ----------------------------------------------------------
  // DESTROY
  // ----------------------------------------------------------
  public destroy() {
    this.scene.scale.off("resize", () => this.position());
    this.container.destroy();
  }
}