import { WorldItem } from "./WorldItem";
import type { Thronglet } from "../Thronglet/Thronglet";

export class Apple extends WorldItem {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "item", "apple/spawn/apple-spawn-0001.png", "apple");
    this.playSpawnAnimation();
  }

  playSpawnAnimation() {
    this.sceneRef.anims.play("apple_spawn", this);
  }

  playInteractAnimation(onComplete: any) {
    this.sceneRef.anims.play("apple_eat", this);
    this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      if (onComplete) onComplete();
    });
  }

  interact(thronglet: Thronglet) {
    thronglet.eatApple(this);
  }
}