// ThrongletBehavior.ts
import type { Thronglet } from "./Thronglet";
import type { WorldItem } from "../items/WorldItem";
import { Game } from "../../scenes/Game";

export class ThrongletBehavior {
  private thronglet: Thronglet;
  private scene: Phaser.Scene;
  public currentTarget: WorldItem | null = null;

  private scanTimer!: Phaser.Time.TimerEvent;

  constructor(thronglet: Thronglet) {
    this.thronglet = thronglet;
    this.scene = thronglet.scene;

    // Scan environment every X ms
    this.scanTimer = this.scene.time.addEvent({
      delay: 1000, // scan every 1.5 seconds
      loop: true,
      callback: this.scanForItems,
      callbackScope: this
    });
  }

  /** Find nearest apple/ball and send the thronglet to it */
  private scanForItems() {
    if (!["pathing", "hungry", "bored"].includes(this.thronglet.currentAction)) return;

    const items = this.getAllInteractableItems();
    if (items.length === 0) return;

    const nearest = this.findClosestItem(items);
    if (!nearest) return;

    this.goToItem(nearest);
  }

  private getAllInteractableItems(): WorldItem[] {
    return (this.scene as Game).worldItems;
  }

  private findClosestItem(items: WorldItem[]): WorldItem | null {
    const data = this.thronglet.data;
    const fed = data.get("fed");
    const amused = data.get("amused");

    const desiredType = fed < amused ? "apple" : "ball";

    const filtered = items.filter(i => i.type === desiredType && i.active);

    const pool = filtered.length > 0 ? filtered : items.filter(i => i.active);

    const origin = new Phaser.Math.Vector2(this.thronglet.x, this.thronglet.y);

    let best = null;
    let minDist = Infinity;

    for (const it of pool) {
      const d = Phaser.Math.Distance.Between(it.x, it.y, origin.x, origin.y);
      if (d < minDist) {
        minDist = d;
        best = it;
      }
    }

    return best;
  }

  /** Move to the item, then interact */
  private goToItem(item: WorldItem) {
    this.currentTarget = item;
    const scene = this.thronglet.scene as Game;
    const map = scene.map;

    // What tile is the item on?
    const itemTile = map.getTileAtWorldXY(item.x, item.y, true, scene.cameras.main, "floor");
    if (!itemTile) return;

    // Adjacent iso neighbors (same offsets your movement uses)
    const offsets = [
      { dx: -2, dy: 0 }, // up-left
      { dx: 0, dy: -2 }, // up-right
      { dx: 0, dy: +2 }, // down-left
      { dx: +2, dy: 0 }, // down-right
    ];

    // Build list of candidate tiles
    const adjacentTiles = offsets
      .map(o => map.getTileAt(itemTile.x + o.dx, itemTile.y + o.dy, false, "floor"))
      .filter(Boolean); // remove nulls

    if (adjacentTiles.length === 0) {
      console.warn("No walkable adjacent tiles near item");
      return;
    }

    // Pick nearest tile to thronglet
    const best = (adjacentTiles as Phaser.Tilemaps.Tile[]).reduce((closest, tile) => {
      const dist = Phaser.Math.Distance.Between(
        this.thronglet.x, this.thronglet.y,
        tile.getCenterX(), tile.getCenterY()
      );

      if (!closest || dist < closest.dist) {
        return { tile, dist };
      }
      return closest;
    }, null as null | { tile: Phaser.Tilemaps.Tile, dist: number });

    const targetTile = best!.tile;

    this.thronglet.setAction("seeking");

    this.thronglet.movement.queueMove({
      targetTileX: targetTile.x, 
      targetTileY: targetTile.y,
      onComplete: () => {
        // Now we’re next to the item → interact
        item.interact(this.thronglet);
        this.currentTarget = null;
      },
      target: item,
    });
  }
}