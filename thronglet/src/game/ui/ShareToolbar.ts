import { Game } from "../scenes/Game";

export class ShareToolbar {
  private scene: Game;
  private container: Phaser.GameObjects.Container;
  private frame: Phaser.GameObjects.Image;
  private shareButton!: Phaser.GameObjects.Image;

  constructor(scene: Game) {
    this.scene = scene;

    this.container = this.scene.add.container(0, 0)
      .setScrollFactor(0)
      .setDepth(9999);

    this.frame = this.scene.add.image(0, 0, "ui_share-frame", 0)
      .setOrigin(0.5,0.5);

    this.frame.setDisplaySize(
      this.frame.width / 2, this.frame.height / 2
    );

    this.container.add(this.frame);

    this.createShareButton();
    this.setupResizeListener();
  }


  // ----------------------------------------------------------
  // PLAY AGAIN BUTTON
  // ----------------------------------------------------------
  private createShareButton() {
    this.shareButton = this.scene.add.image(0, 0, "ui_share-button", 0)
      .setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true });

    this.shareButton.setDisplaySize(
      this.shareButton.width / 2, this.shareButton.height / 2
    );

    // position: bottom center of modal
    this.shareButton.setPosition(
      this.frame.originX,
      this.frame.originY
    )

    this.shareButton
      .on("pointerover", () => this.shareButton.setFrame(1))
      .on("pointerout", () => this.shareButton.setFrame(0))
      .on("pointerdown", () => this.shareButton.setFrame(2))
      .on("pointerup", () => {
        this.shareButton.setFrame(1); // return to hover state
        this.onShare();
      });

    this.container.add(this.shareButton);
  }

  private onShare() {
    const throngletStats = this.scene.thronglet.data.getAll();
    parent.postMessage(
      {
        pluginMessage: {
          type: "share-thronglet",
          value: {
            img: this.getThrongletBase64(),
            birth: throngletStats.birth,
            death: throngletStats.death,
            nurtured: throngletStats.lastCaredFor,
            age: this.scene.thronglet.stats.getAgeDays()
          }
        }
      },
      "*"
    );
  }

  private getThrongletBase64(): string {
    // Get the texture from the texture manager
    const texture = this.scene.textures.get("thronglet"); // or the key you used to load the image
    if (!texture) return "";

    // Get the frame (usually "0" or the filename)
    const hygine = this.scene.thronglet.stats.getHygiene();
    const mood = this.scene.thronglet.stats.getMood();

    let frameName;
    switch(mood) {
      case "dead":
        frameName = `thronglet-death/death-0001.png`;
        break;
      case "hungry":
      case "bored":
        frameName = `thronglet-${hygine}/${mood}/${mood}-0001.png`;
        break;
      case "normal":
        frameName = `thronglet-${hygine}/walk/walk-0002.png`;
        break;
    }

    const frame = texture.get(frameName);

    // Create a temporary canvas
    const canvas = document.createElement("canvas");
    canvas.width = frame.width;
    canvas.height = frame.height;

    const ctx = canvas.getContext("2d")!;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    ctx.drawImage(frame.source.image as any, frame.cutX, frame.cutY, frame.width, frame.height, 0, 0, frame.width, frame.height);

    // Convert to base64 PNG
    return canvas.toDataURL("image/png");
  }

  // ----------------------------------------------------------
  // POSITIONING
  // ----------------------------------------------------------
  private setupResizeListener() {
    this.scene.scale.on("resize", () => this.position());
    this.position();
  }

  private position() {
    const cam = this.scene.cameras.main;
    const padding = 24;

    // Get the size of the frame inside the container
    const bounds = this.container.getBounds();

    // Position container so that the frame's top-right corner is padded from the camera
    this.container.setPosition(
      cam.width - bounds.width / 2 - padding, // container's origin is center, so subtract half width
      bounds.height / 2 + padding             // top + padding
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