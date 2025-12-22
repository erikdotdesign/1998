export function registerItemAnimations(scene: Phaser.Scene) {
  // APPLE -------------------------------------------------
  scene.anims.create({
    key: "apple_spawn",
    frames: scene.anims.generateFrameNames("item", {
      prefix: "apple/spawn/apple-spawn-",
      start: 1,
      end: 6,
      zeroPad: 4,
      suffix: ".png"
    }),
    frameRate: 8,
    repeat: 0
  });

  scene.anims.create({
    key: "apple_eat",
    frames: scene.anims.generateFrameNames("item", {
      prefix: "apple/eat/apple-eat-",
      start: 1,
      end: 4,
      zeroPad: 4,
      suffix: ".png"
    }),
    frameRate: 1,
    repeat: 0
  });

  // BALL ---------------------------------------------------
  scene.anims.create({
    key: "ball_spawn",
    frames: scene.anims.generateFrameNames("item", {
      prefix: "ball/spawn/ball-spawn-",
      start: 1,
      end: 6,
      zeroPad: 4,
      suffix: ".png"
    }),
    frameRate: 8,
    repeat: 0
  });

  scene.anims.create({
    key: "ball_play",
    frames: scene.anims.generateFrameNames('item', {
      start: 1, 
      end: 6, 
      zeroPad: 4,
      prefix: `ball/play/ball-play-`, suffix: '.png'
    }),
    frameRate: 4,
    repeat: 0
  });

  // SPONGE -------------------------------------------------
  scene.anims.create({
    key: "sponge_clean",
    frames: scene.anims.generateFrameNames("item", {
      prefix: "sponge/clean/sponge-clean-",
      start: 1,
      end: 2,
      zeroPad: 4,
      suffix: ".png"
    }),
    frameRate: 6,
    repeat: -1
  });
}