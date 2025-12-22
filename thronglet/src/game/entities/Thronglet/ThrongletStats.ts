import Phaser from "phaser";
import type { Thronglet } from "./Thronglet";
import { EventBus } from "../../EventBus";

export class ThrongletStats {
  private thronglet: Thronglet;
  private decayTimer = 0;

  constructor(thronglet: Thronglet) {
    const cache = thronglet.scene.registry.get("initialState");
    this.thronglet = thronglet;

    thronglet.setDataEnabled();

    if (cache) {
      const thrCache = cache.thronglet;

      // 1. Set birth/death first
      thronglet.data.set({
        birth: thrCache.birth,
        death: thrCache.death,
        lastCaredFor: thrCache.lastCaredFor
      });

      // 2. Now safely compute aged stats
      const agedStats = this.getAgedStats();

      // 3. Apply stat values
      thronglet.data.set({
        amused: thrCache.death ? 0 : agedStats,
        fed:    thrCache.death ? 0 : agedStats,
        clean:  thrCache.death ? 0 : agedStats
      });
    } else {
      const birth = Date.now();
      const death = null;
      const lastCaredFor = birth;

      thronglet.data.set({
        birth,
        death,
        lastCaredFor,
        amused: 100,
        fed: 100,
        clean: 100
      });

      // Only write once during creation
      this.saveCache(birth, death, lastCaredFor);
    }
  }

  update(delta: number) {
    this.decayTimer += delta;
    if (this.decayTimer >= 1000) {
      this.decayTimer = 0;
      this.decay("fed", 1);
      this.decay("amused", 0.75);
      this.decay("clean", 0.5);
    }

    // Dont set next action until current action is finished
    if (["seeking", "playing", "eating", "cleaning"].includes(this.thronglet.currentAction)) return;

    const fed = this.thronglet.data.get("fed");
    const amused = this.thronglet.data.get("amused");

    if (fed <= 0) {
      this.thronglet.setAction("dead");
      EventBus.emit("thronglet-died");

      if (!this.thronglet.data.get("death")) {
        const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;

        const lastCaredFor = this.thronglet.data.get("lastCaredFor");
        const now = Date.now();

        let death: number;

        if (
          typeof lastCaredFor === "number" &&
          now - lastCaredFor >= THREE_DAYS_MS
        ) {
          // Death occurred 3 days after last care
          death = lastCaredFor + THREE_DAYS_MS;
        } else {
          // Still within care window → death is now
          death = now;
        }

        this.thronglet.data.set("death", death);

        this.saveCache(
          this.thronglet.data.get("birth"),
          death,
          lastCaredFor
        );
      }
    } else if (fed < 30) {
      this.thronglet.setAction("hungry");
    };

    if (amused < 30 && this.thronglet.currentAction !== "hungry") {
      this.thronglet.setAction("bored");
    }
  }

  private saveCache(birth: number, death: number | null, lastCaredFor?: number) {
    try {
      localStorage.setItem("thronglet-cache", JSON.stringify({
        thronglet: { birth, death, lastCaredFor }
      }));
    } catch (e) {
      console.error("Failed to save localStorage cache", e);
    }
  }

  private decay(key: string, rate: number) {
    const newValue = Phaser.Math.Clamp(this.thronglet.data.get(key) - rate, 0, 100);
    this.thronglet.data.set(key, newValue);
  }

  private getAgedStats(daysSinceCare = this.getDaysSinceLastCare()) {
    if (daysSinceCare === 0) {
      return 75;
    } else if (daysSinceCare === 1) {
      return 50;
    } else if (daysSinceCare === 2) {
      return 25;
    } else if (daysSinceCare >= 3) {
      return 0;
    }
  }

  public getHygiene(): "clean" | "dirty" {
    return this.thronglet.data.get("clean") < 50 ? "dirty" : "clean";
  }

  public getMood() {
    const fed = this.thronglet.data.get("fed");
    const amused = this.thronglet.data.get("amused");

    if (fed <= 0) {
      return "dead";
    } else if (fed < 30) {
      return "hungry";
    } else if (amused < 30) {
      return "bored";
    } else {
      return "normal";
    }
  }

  public getAgeDays(): number {
    const birth = this.thronglet.data.get("birth");
    const death = this.thronglet.data.get("death");

    const end = death ?? Date.now();
    const ms = end - birth;

    return Math.floor(ms / (1000 * 60 * 60 * 24));
  }

  public getDaysSinceLastCare(): number {
    const lastCaredFor = this.thronglet.data.get("lastCaredFor");
    return Math.floor((Date.now() - lastCaredFor) / (1000 * 60 * 60 * 24));
  }

  public markCaredFor() {
    const now = Date.now();
    this.thronglet.data.set("lastCaredFor", now);
    this.saveCache(
      this.thronglet.data.get("birth"),
      this.thronglet.data.get("death"),
      now
    );
  }
}