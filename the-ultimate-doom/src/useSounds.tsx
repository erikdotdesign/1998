import { useEffect } from "react";
import { soundManager } from "./soundManager";

import ammoSfx from "./sounds/ammo.wav";
import chainsawSfx from "./sounds/chainsaw.wav";
import itemPickupSfx from "./sounds/item-pickup.wav";
import powerUpSfx from "./sounds/power-up.wav";
import shotSfx from "./sounds/shot.wav";
import switchOnSfx from "./sounds/switch-on.wav";
import switchOffSfx from "./sounds/switch-off.wav";
import teleportSfx from "./sounds/teleport.wav";

const SOUNDS: [string, string][] = [
  ["ammo", ammoSfx],
  ["chainsaw", chainsawSfx],
  ["item-pickup", itemPickupSfx],
  ["power-up", powerUpSfx],
  ["shot", shotSfx],
  ["switch-on", switchOnSfx],
  ["switch-off", switchOffSfx],
  ["teleport", teleportSfx],
];

const useSounds = () => {
  useEffect(() => {
    SOUNDS.forEach(([name, src]) => soundManager.load(name, src, 0.5));
  }, []);
};

export default useSounds;