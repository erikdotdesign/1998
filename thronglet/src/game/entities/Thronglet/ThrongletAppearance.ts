import Phaser from "phaser";
import type { Thronglet } from "./Thronglet";
import { Game } from "../../scenes/Game";

export class ThrongletAppearance {
  private thronglet: Thronglet;
  private currentKey: string | null = null;
  private temporaryAnimation = false;

  constructor(thronglet: Thronglet) {
    this.thronglet = thronglet;
  }

  update() {
    if (this.temporaryAnimation) return;

    const action = this.thronglet.currentAction;
    const dir = this.thronglet.direction;
    const hygiene = this.thronglet.stats.getHygiene();
    const tile = (this.thronglet.scene as Game).map.getTileAtWorldXY(this.thronglet.x, this.thronglet.y);

    if (tile) this.thronglet.setDepth((tile as Phaser.Tilemaps.Tile).y);
    
    let animKey = "";

    switch (action) {
      case "dead": animKey = "thronglet_death"; break;
      case "hungry": animKey = `thronglet_hungry-${hygiene}`; break;
      case "bored": animKey = `thronglet_bored-${hygiene}`; break;
      case "pathing":
      case "seeking": 
        if (dir.includes("up")) animKey = `thronglet_walkBack-${hygiene}`;
        else if  (dir === "idle") animKey = `thronglet_idle-${hygiene}`;
        else animKey = `thronglet_walk-${hygiene}`;
        break;
      case "eating": animKey = `thronglet_eating-${hygiene}`; break;
      case "cleaning": animKey = `thronglet_cleaning-${hygiene}`; break;
      case "playing": animKey = `thronglet_happyJump-${hygiene}`; break;
      case "singing": animKey = `thronglet_singing-${hygiene}`; break;
      case "idle":
      default: 
        animKey = `thronglet_idle-${hygiene}`; 
        break;
    }

    if (animKey && animKey !== this.currentKey) {
      this.thronglet.play(animKey, true);
      this.currentKey = animKey;
    }

    this.thronglet.setFlipX(dir.includes("left"));
  }

  playTemporaryAnimation(key: string, onComplete?: () => void) {
    this.temporaryAnimation = true;
    this.thronglet.play(key, true);

    const handler = (anim: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) => {
      if (anim.key === key) {
        this.thronglet.off(Phaser.Animations.Events.ANIMATION_COMPLETE, handler);
        this.temporaryAnimation = false;
        if (onComplete) onComplete();
      }
    };

    this.thronglet.on(Phaser.Animations.Events.ANIMATION_COMPLETE, handler);
  }
}