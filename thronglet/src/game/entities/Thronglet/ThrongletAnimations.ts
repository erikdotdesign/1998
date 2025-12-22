type AnimationDef = {
  prefix: string;
  start: number;
  end: number;
  frameRate: number;
  repeat: number;
  variants?: boolean;
};

const THRONGLET_ANIMATIONS: Record<string, AnimationDef> = {
  idle: { prefix: 'walk/walk-', start: 2, end: 2, frameRate: 8, repeat: -1, variants: true },
  walk: { prefix: 'walk/walk-', start: 2, end: 4, frameRate: 8, repeat: -1, variants: true },
  walkBack: { prefix: 'walk/walk-', start: 5, end: 6, frameRate: 8, repeat: -1, variants: true },
  hungry: { prefix: 'hungry/hungry-', start: 1, end: 3, frameRate: 3, repeat: -1, variants: true },
  bored: { prefix: 'bored/bored-', start: 1, end: 8, frameRate: 6, repeat: -1, variants: true },
  eating: { prefix: 'eating/eating-', start: 1, end: 2, frameRate: 2, repeat: -1, variants: true },
  cleaning: { prefix: 'cleaning/cleaning-', start: 1, end: 4, frameRate: 6, repeat: -1, variants: true },
  happyJump: { prefix: 'happy/happy-', start: 1, end: 9, frameRate: 8, repeat: 0, variants: true },
  death: { prefix: 'thronglet-death/death-', start: 1, end: 14, frameRate: 6, repeat: 0 },
  singingToThrongA: { prefix: 'singing-a/side/singing-a-side-', start: 1, end: 6, frameRate: 8, repeat: 0, variants: true },
  singingToUserA: { prefix: 'singing-a/front/singing-a-front-', start: 1, end: 6, frameRate: 8, repeat: 0, variants: true },
  singingToThrongB: { prefix: 'singing-b/side/singing-b-side-', start: 1, end: 8, frameRate: 8, repeat: 0, variants: true },
  singingToUserB: { prefix: 'singing-b/front/singing-b-front-', start: 1, end: 8, frameRate: 8, repeat: 0, variants: true },
  singingToThrongC: { prefix: 'singing-c/side/singing-c-side-', start: 1, end: 8, frameRate: 8, repeat: 0, variants: true },
  singingToUserC: { prefix: 'singing-c/front/singing-c-front-', start: 1, end: 8, frameRate: 8, repeat: 0, variants: true },
  singingToThrongD: { prefix: 'singing-d/side/singing-d-side-', start: 1, end: 8, frameRate: 8, repeat: 0, variants: true },
  singingToUserD: { prefix: 'singing-d/front/singing-d-front-', start: 1, end: 8, frameRate: 8, repeat: 0, variants: true },
  singingToThrongE: { prefix: 'singing-e/side/singing-e-side-', start: 1, end: 7, frameRate: 8, repeat: 0, variants: true },
  singingToUserE: { prefix: 'singing-e/front/singing-e-front-', start: 1, end: 7, frameRate: 8, repeat: 0, variants: true },
};

export function registerThrongletAnimations(scene: Phaser.Scene) {
  const variants = ['clean', 'dirty'];

  for (const [name, anim] of Object.entries(THRONGLET_ANIMATIONS)) {
    const keys = anim.variants ? variants.map(v => `thronglet_${name}-${v}`) : [`thronglet_${name}`];

    keys.forEach(key => {
      const prefix = anim.variants ? `thronglet-${key.split('-')[1]}/${anim.prefix}` : anim.prefix;
      const frames = scene.anims.generateFrameNames('thronglet', {
        start: anim.start,
        end: anim.end,
        zeroPad: 4,
        prefix,
        suffix: '.png',
      });

      scene.anims.create({
        key,
        frames,
        frameRate: anim.frameRate,
        repeat: anim.repeat,
      });
    });
  }
}