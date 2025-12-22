import { Game } from "../scenes/Game";

export class GameOverModal {
  private scene: Game;
  private container: Phaser.GameObjects.Container;
  private frame: Phaser.GameObjects.Image;
  private playAgainButton!: Phaser.GameObjects.Image;

  constructor(scene: Game) {
    this.scene = scene;

    this.container = this.scene.add.container(0, 0)
      .setScrollFactor(0)
      .setDepth(9999)
      .setVisible(false);

    this.frame = this.scene.add.image(0, 0, "ui_game-over-modal", 0)
      .setOrigin(0.5,0.5);

    this.frame.setDisplaySize(
      this.frame.width / 2, this.frame.height / 2
    );

    this.container.add(this.frame);

    this.createPlayAgainButton();
    this.setupResizeListener();
  }


  // ----------------------------------------------------------
  // PLAY AGAIN BUTTON
  // ----------------------------------------------------------
  private createPlayAgainButton() {
    this.playAgainButton = this.scene.add.image(0, 0, "ui_play-again-button", 0)
      .setOrigin(0.5, 0.5)
      .setInteractive({ useHandCursor: true });

    this.playAgainButton.setDisplaySize(
      this.playAgainButton.width / 2, this.playAgainButton.height / 2
    );

    const frameHeight = this.frame.displayHeight;
    const bottomPadding = 38; // adjust as needed

    // position: bottom center of modal
    this.playAgainButton.y = (frameHeight / 2) - bottomPadding;

    this.playAgainButton
      .on("pointerover", () => this.playAgainButton.setFrame(1))
      .on("pointerout", () => this.playAgainButton.setFrame(0))
      .on("pointerdown", () => this.playAgainButton.setFrame(2))
      .on("pointerup", () => {
        this.playAgainButton.setFrame(1); // return to hover state
        this.onPlayAgain();
      });

    this.container.add(this.playAgainButton);
  }

  // ----------------------------------------------------------
  // SHOW / HIDE
  // ----------------------------------------------------------
  public show() {
    this.container.setVisible(true);
    this.position();
  }

  public hide() {
    this.container.setVisible(false);
  }

  private onPlayAgain() {
    this.scene.registry.destroy();
    this.scene.scene.restart();
    this.scene.destroyUI();
    try {
      localStorage.removeItem("thronglet-cache");
    } catch (e) {
      console.error("Failed to clear localStorage cache", e);
    }
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

    this.container.setPosition(
      cam.midPoint.x,
      cam.midPoint.y + 16
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