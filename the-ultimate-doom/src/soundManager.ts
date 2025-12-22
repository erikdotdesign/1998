// soundManager.ts
type SoundMap = Record<string, HTMLAudioElement>;

class SoundManager {
  private sounds: SoundMap = {};
  private volume = 1;

  load(name: string, src: string, volume = 1) {
    if (this.sounds[name]) return; // don’t reload
    const audio = new Audio(src);
    audio.preload = "auto";
    audio.volume = volume;
    this.sounds[name] = audio;
  }

  play(name: string) {
    const sound = this.sounds[name];
    if (!sound) {
      console.warn(`Sound '${name}' not loaded`);
      return;
    }

    // Reset to start to allow repeated playback
    sound.currentTime = 0;

    // Clone node for overlapping playbacks
    const clone = sound.cloneNode() as HTMLAudioElement;
    clone.volume = sound.volume * this.volume;
    clone.play().catch(() => {});
  }

  setGlobalVolume(value: number) {
    this.volume = Math.max(0, Math.min(1, value));
  }

  muteAll() {
    this.volume = 0;
  }

  unmuteAll() {
    this.volume = 1;
  }
}

export const soundManager = new SoundManager();