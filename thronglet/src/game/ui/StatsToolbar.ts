import { Game } from "../scenes/Game";

export class StatsToolbar {
  private scene: Game;
  private container: Phaser.GameObjects.Container;
  private frame: Phaser.GameObjects.Image;

  private avatar!: Phaser.GameObjects.Image;
  private statGroups: {
    label: Phaser.GameObjects.Text;
    bg: Phaser.GameObjects.Rectangle;
    bar: Phaser.GameObjects.Rectangle;
  }[] = [];

  private ageLabel!: Phaser.GameObjects.Text;
  private ageValue!: Phaser.GameObjects.Text;

  private readonly BAR_WIDTH = 56;
  private readonly BAR_HEIGHT = 12;

  constructor(scene: Game) {
    this.scene = scene;

    this.container = this.scene.add.container(0, 0)
      .setScrollFactor(0)
      .setDepth(9999);

    this.frame = this.scene.add.image(0, 0, "ui_stats", 0)
      .setOrigin(0)
      .setDisplaySize(112, 264);

    this.container.add(this.frame);

    this.createAvatar();
    this.createStats();
    this.createAgeLine();

    this.setupResizeListener();

    // Hook into scene.update loop
    this.scene.events.on("update", this.update, this);
  }

  // ----------------------------------------------------------
  // AVATAR
  // ----------------------------------------------------------
  private createAvatar() {
    this.avatar = this.scene.add.image(32, 32, "ui_stats-avatars", 0)
      .setOrigin(0)
      .setDisplaySize(48, 48);

    this.container.add(this.avatar);
  }

  private updateAvatar() {
    const data = this.scene.thronglet.data;

    if (data.get("fed") === 0 && this.scene.thronglet.currentAction === "dead") {
      this.avatar.setFrame(3);
    } else if (data.get("fed") < 30) {
      this.avatar.setFrame(1);
    } else if (data.get("amused") < 30) {
      this.avatar.setFrame(2);
    } else {
      this.avatar.setFrame(0);
    }
  }

  // ----------------------------------------------------------
  // STATS GROUPS (fed, amused, clean)
  // ----------------------------------------------------------
  private createStats() {
    const labels = ["Fed", "Amused", "Clean"];
    const x = 28;
    let y = 120;

    labels.forEach(labelText => {
      const label = this.scene.add.text(x, y, labelText, {
        fontSize: 8,
        lineSpacing: 16,
        color: "#ffffff",
        fontFamily: "PressStart2P"
      });

      const bg = this.scene.add.rectangle(
        x,
        y + 16,
        this.BAR_WIDTH,
        this.BAR_HEIGHT,
        0xB8B8B8
      ).setOrigin(0);

      const bar = this.scene.add.rectangle(
        bg.x,
        bg.y,
        this.BAR_WIDTH,
        this.BAR_HEIGHT,
        0x3b82f6 // blue (normal)
      ).setOrigin(0);

      this.container.add(label);
      this.container.add(bg);
      this.container.add(bar);

      this.statGroups.push({ label, bg, bar });

      y += 40; // spacing
    });
  }

  private updateStats() {
    const data = this.scene.thronglet.data;
    const fed = data.get("fed");
    const amused = data.get("amused");
    const clean = data.get("clean");

    const values = [fed, amused, clean];

    this.statGroups.forEach((g, i) => {
      const value = Phaser.Math.Clamp(values[i], 0, 100);

      const width = (value / 100) * this.BAR_WIDTH;
      g.bar.width = width;

      // color logic
      const color = value < 30 ? 0xF20000 : 0x00BEF4; // red danger / blue normal
      g.bar.fillColor = color;
    });
  }

  // ----------------------------------------------------------
  // AGE
  // ----------------------------------------------------------
  private createAgeLine() {
    const y = 238;

    this.ageLabel = this.scene.add.text(28, y, "Age", {
      fontSize: 8,
      lineSpacing: 16,
      color: "#ffffff",
      fontFamily: "PressStart2P"
    });

    this.ageValue = this.scene.add.text(84, y, "0", {
      fontSize: 8,
      lineSpacing: 16,
      color: "#ffffff",
      fontFamily: "PressStart2P",
      align: "right"
    }).setOrigin(1, 0);

    this.container.add(this.ageLabel);
    this.container.add(this.ageValue);
  }

  private updateAge() {
    const ageDays = this.scene.thronglet.stats.getAgeDays();
    this.ageValue.setText(ageDays.toString());
  }

  // ----------------------------------------------------------
  // UPDATE LOOP
  // ----------------------------------------------------------
  public update() {
    if (!this.scene.thronglet) return;
    this.updateAvatar();
    this.updateStats();
    this.updateAge();
  }

  // ----------------------------------------------------------
  // POSITIONING
  // ----------------------------------------------------------
  private setupResizeListener() {
    this.scene.scale.on("resize", () => this.position());
    this.position();
  }

  private position() {
    const padding = 12;

    this.container.setPosition(
      padding,
      padding
    );
  }

  // ----------------------------------------------------------
  // DESTROY
  // ----------------------------------------------------------
  public destroy() {
    this.scene.scale.off("resize", () => this.position());
    this.scene.events.off("update", this.update, this);
    this.container.destroy();
  }
}