import * as THREE from "three";
import { applyProps } from "./utils";

import { Plane, type PlaneProps } from "./Plane";
import { Palms, type PalmsProps } from "./Palms";
import { Pillars, type PillarsProps } from "./Pillars";

export interface TileProps {
  plane: PlaneProps;
  palms: PalmsProps;
  pillars: PillarsProps;
}

export class Tile {
  public group: THREE.Group = new THREE.Group();
  public plane: Plane;
  public palms: Palms;
  public pillars: Pillars;

  constructor(private props: TileProps) {
    this.plane = new Plane(this.props.plane);
    this.palms = new Palms(this.props.palms);
    this.pillars = new Pillars(this.props.pillars);
  }

  async init() {
    await this.plane.init();
    await this.palms.init();
    await this.pillars.init();
    this.group.add(this.plane.mesh, this.palms.group, this.pillars.mesh);
  }

  setPlane(props: Partial<PlaneProps>) {
    const setterMap = {
      color: "setColor",
      emissive: { color: "setEmissiveColor" },
      displacement: { scale: "setDisplacementScale" },
      check: "setPlaneCheck"
    };
    applyProps(props, this.plane, setterMap);
  }

  setPalms(props: Partial<PalmsProps>) {
    const setterMap = {
      color: "setColor",
      emissive: { color: "setEmissiveColor" },
      visible: "setVisible"
    };
    applyProps(props, this.palms, setterMap);
  }

  setPillars(props: Partial<PillarsProps>) {
    const setterMap = {
      colors: "setColors",
      visible: "setVisible"
    };
    applyProps(props, this.pillars, setterMap);
  }
}