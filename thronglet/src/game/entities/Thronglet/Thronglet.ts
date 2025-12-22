import Phaser from "phaser";
import { ThrongletStats } from "./ThrongletStats";
import { ThrongletAppearance } from "./ThrongletAppearance";
import { ThrongletMovement } from "./ThrongletMovement";
import { ThrongletBehavior } from "./ThrongletBehavior";
import { Game } from "../../scenes/Game";
import { WorldItem } from "../items/WorldItem";

export type ThrongletAction =
  | "idle"
  | "seeking"
  | "pathing"
  | "hungry"
  | "bored"
  | "happy-jump"
  | "eating"
  | "playing"
  | "cleaning"
  | "singing"
  | "dead";

export type ThrongletDirection =
  | "up-left"
  | "up-right"
  | "down-left"
  | "down-right"
  | "idle";

export class Thronglet extends Phaser.GameObjects.Sprite {
  // private map!: Phaser.Tilemaps.Tilemap;
  public stats: ThrongletStats;
  public appearance: ThrongletAppearance;
  public movement!: ThrongletMovement;
  public behavior!: ThrongletBehavior;

  public currentAction: ThrongletAction = "idle";
  public direction: ThrongletDirection = "idle";

  constructor(scene: Phaser.Scene, position?: { x: number; y: number }) {
    const map = (scene as Game).map;
    const { x, y } = position ?? {
      x: map.getTileAt(Math.floor(map.width / 2), Math.floor(map.height / 2), true, "floor")!.getCenterX(),
      y: map.getTileAt(Math.floor(map.width / 2), Math.floor(map.height / 2), true, "floor")!.getCenterY(),
    };
    super(scene, x, y, "thronglet", "thronglet-clean/walk/walk-0002.png");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setOrigin(0.5, 1).setDisplaySize(44, 44);

    // Submodules
    this.stats = new ThrongletStats(this);
    this.appearance = new ThrongletAppearance(this);
    this.movement = new ThrongletMovement(this);
    this.behavior = new ThrongletBehavior(this);

    // Updates
    this.scene.events.on("update", this.update, this);
  }

  /**
   * Set the current action and optionally direction.
   * Higher-priority actions (like dead) cannot be overridden.
   */
  public setAction(action: ThrongletAction, direction: ThrongletDirection = "idle") {
    if (this.currentAction === "dead" && action !== "dead") return; // dead always wins
    this.currentAction = action;
    this.direction = direction;
  }

  public eatApple(apple: WorldItem) {
    this.setAction("eating", this.faceTargetDirection(apple));
    apple.playInteractAnimation(() => {
      // Cleanup apple
      (this.scene as Game).removeWorldItem(apple);
      apple.destroy();
      // Update stats
      const fed = this.data.get("fed") || 0;
      this.data.set("fed", Math.min(100, fed + 35));
      this.stats.markCaredFor();
      // Optionally reset to pathing
      this.setAction("pathing");
    });
  }

  public playWithBall(ball: WorldItem) {
    const direction = this.faceTargetDirection(ball);
    this.setAction("playing", direction);
    ball.playInteractAnimation(() => {
      // Cleanup apple
      (this.scene as Game).removeWorldItem(ball);
      ball.destroy();
      // Update stats
      const amused = this.data.get("amused") || 0;
      this.data.set("amused", Math.min(100, amused + 35));
      this.stats.markCaredFor();
      // Optionally reset to pathing
      this.setAction("pathing");
    }, { direction });
  }
  
  public spongeBath() {
    this.setAction("cleaning");
    const cleanliness = this.data.get("clean") || 0;
    this.data.set("clean", Math.min(100, cleanliness + 4));
    this.stats.markCaredFor();
  }

  private faceTargetDirection(target: Phaser.GameObjects.Sprite) {
    if (target.x < this.x) {
      return "down-left";
    } else {
      return "down-right";
    }
  }

  /**
   * Update should be called every frame from the scene.
   */
  public update(time: number, delta: number) {
    if (this.currentAction === "dead") return;
    this.stats.update(delta);
    this.appearance.update();
  }
}