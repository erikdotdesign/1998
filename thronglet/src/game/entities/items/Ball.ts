import { WorldItem } from "./WorldItem";
import type { Thronglet } from "../Thronglet/Thronglet";

export class Ball extends WorldItem {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "item", "ball/spawn/ball-spawn-0001.png", "ball");
    this.playSpawnAnimation();
  }

  playSpawnAnimation() {
    this.sceneRef.anims.play("ball_spawn", this);
  }

  playInteractAnimation(onComplete: any, opts: { direction: any }) {
    this.sceneRef.anims.play("ball_play", this);
    this.scene.tweens.add({
      targets: this,
      y: this.y - 10,
      duration: 250,
      yoyo: true,
      delay: 250
    });
    this.scene.tweens.add({
      targets: this,
      x: this.x + (opts.direction.includes('left') ? -50 : 50),
      duration: 1000,
      yoyo: false,
      delay: 250
    });
    this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      if (onComplete) onComplete();
    });
  }

  interact(thronglet: Thronglet) {
    thronglet.playWithBall(this);
  }
}