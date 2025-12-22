import Phaser from "phaser";
import type { Thronglet, ThrongletDirection } from "./Thronglet";
import type { WorldItem } from "../items/WorldItem";
import { Game } from "../../scenes/Game";

type MoveRequest = {
  targetTileX: number;
  targetTileY: number;
  direction?: ThrongletDirection;
  target?: WorldItem;
  onComplete?: () => void;
};

export class ThrongletMovement {
  private thronglet: Thronglet;
  private randomMoveEvent?: Phaser.Time.TimerEvent;
  private movementQueue: MoveRequest[] = [];
  private isMoving = false;
  private currentTarget: WorldItem | null = null;

  constructor(thronglet: Thronglet) {
    this.thronglet = thronglet;
    this.startRandomMoveTimer();
  }

  /** START / STOP random movement */
  private startRandomMoveTimer() {
    if (this.randomMoveEvent) return;

    this.randomMoveEvent = this.thronglet.scene.time.addEvent({
      delay: 1000,
      loop: true,
      callback: this.randomMove,
      callbackScope: this,
    });
  }

  private stopRandomMoveTimer() {
    if (this.randomMoveEvent) {
      this.randomMoveEvent.remove(true);
      this.randomMoveEvent = undefined;
    }
  }

  /** RANDOM movement tick */
  private randomMove() {
    // Only queue random moves if idle and nothing in the queue
    if (this.isMoving || this.movementQueue.length > 0) return;

    const { thronglet } = this;
    const map = (thronglet.scene as Game).map;

    // if (["hungry", "bored", "dead", "eating"].includes(thronglet.currentAction)) return;

    const currentTile = map.getTileAtWorldXY(
      thronglet.x,
      thronglet.y,
      true,
      thronglet.scene.cameras.main,
      "floor"
    );
    if (!currentTile) return;

    const neighbors = [
      { dx: -1, dy: 0, dir: "up-left" },
      { dx: 0, dy: -1, dir: "up-right" },
      { dx: 0, dy: +1, dir: "down-left" },
      { dx: +1, dy: 0, dir: "down-right" },
      { dx: 0, dy: 0, dir: "idle" },
    ];

    const validMoves = neighbors.filter((n) =>
      map.getTileAt(currentTile.x + n.dx, currentTile.y + n.dy, false, "floor")
    );

    const choice = Phaser.Utils.Array.GetRandom(validMoves);
    if (!choice) return;

    this.queueMove({
      targetTileX: currentTile.x + choice.dx,
      targetTileY: currentTile.y + choice.dy,
      direction: choice.dir as ThrongletDirection,
    });
  }

  /** QUEUE a movement */
  public queueMove(request: MoveRequest) {
    this.movementQueue.push(request);
    if (!this.isMoving) {
      this.processNextMove();
    }
  }

  /** PROCESS the next move in the queue */
  private processNextMove() {
    if (!["pathing", "seeking"].includes(this.thronglet.currentAction)) {
      this.isMoving = false;
      this.currentTarget = null;
      this.movementQueue = [];
      this.startRandomMoveTimer();
      return;
    }
    const next = this.movementQueue.shift();
    if (!next) {
      this.isMoving = false;
      this.currentTarget = null;
      this.thronglet.setAction("pathing", "idle");
      this.startRandomMoveTimer();
      return;
    }

    this.isMoving = true;
    this.currentTarget = next.target ?? null;
    this.stopRandomMoveTimer();

    const { thronglet } = this;
    const map = (thronglet.scene as Game).map;

    const startTile = map.getTileAtWorldXY(
      thronglet.x,
      thronglet.y,
      true,
      thronglet.scene.cameras.main,
      "floor"
    );
    const targetTile = map.getTileAt(next.targetTileX, next.targetTileY, true, "floor");

    if (!startTile || !targetTile) {
      if (next.onComplete) next.onComplete();
      this.processNextMove();
      return;
    }

    const path = this.getIsoPath(startTile, targetTile);
    this.followPath(path, next.direction, next.onComplete);
  }

  /** FOLLOW a path step by step */
  private followPath(
    path: { x: number; y: number; direction: ThrongletDirection }[],
    directionOverride?: ThrongletDirection,
    onComplete?: () => void
  ) {
    if (path.length === 0) {
      if (onComplete) onComplete();
      this.processNextMove();
      return;
    }

    const { thronglet } = this;
    const map = (thronglet.scene as Game).map;
    const nextStep = path.shift()!;
    const worldX = map.getTileAt(nextStep.x, nextStep.y)!.getCenterX();
    const worldY = map.getTileAt(nextStep.x, nextStep.y)!.getCenterY();

    thronglet.setAction(this.currentTarget ? "seeking" : "pathing", directionOverride || nextStep.direction);

    thronglet.scene.tweens.add({
      targets: thronglet,
      x: worldX,
      y: worldY,
      duration: 300,
      ease: "Sine.easeInOut",
      onComplete: () => this.followPath(path, directionOverride, onComplete),
    });
  }

  /** SIMPLE ISO PATHFINDING */
  public getIsoPath(current: Phaser.Tilemaps.Tile, target: Phaser.Tilemaps.Tile) {
    const path: { x: number; y: number; direction: ThrongletDirection }[] = [];
    let x = current.x;
    let y = current.y;

    let safety = 0;
    while ((x !== target.x || y !== target.y) && safety < 1000) {
      safety++;
      let dx = 0,
        dy = 0,
        direction: ThrongletDirection = "idle";

      const xDiff = target.x - x;
      const yDiff = target.y - y;

      // diagonal step if both axes differ
      if (xDiff > 0 && yDiff > 0) dx = 1, dy = 0, direction = "down-right";
      else if (xDiff > 0 && yDiff < 0) dx = 0, dy = -1, direction = "up-right";
      else if (xDiff < 0 && yDiff > 0) dx = 0, dy = 1, direction = "down-left";
      else if (xDiff < 0 && yDiff < 0) dx = -1, dy = 0, direction = "up-left";
      // one axis differs
      else if (xDiff > 0) dx = 1, dy = 0, direction = "down-right";
      else if (xDiff < 0) dx = -1, dy = 0, direction = "up-left";
      else if (yDiff > 0) dx = 0, dy = 1, direction = "down-left";
      else if (yDiff < 0) dx = 0, dy = -1, direction = "up-right";

      if (dx === 0 && dy === 0) break;

      x += dx;
      y += dy;
      path.push({ x, y, direction });
    }

    return path;
  }
}