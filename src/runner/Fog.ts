import * as THREE from "three";
import { applyProps } from "./utils";

export interface FogProps {
  tileCount: number;
  color: string;
  density: number;
}

export class Fog {
  private props: FogProps
  public fog!: THREE.FogExp2;

  constructor(props: FogProps) {
    this.props = props;
  }

  init() {
    const { color, density } = this.props;
    this.fog = new THREE.FogExp2(color, density);
  }

  setColor(color: string) {
    if (!this.fog) return;
    this.props.color = color;
    this.fog.color = new THREE.Color(color);
  }

  setDensity(density: number) {
    if (!this.fog) return;
    this.props.density = density;
    this.fog.density = density;
  }

  setFog(props: Partial<FogProps>) {
    const setterMap = {
      color: "setColor",
      density: "setDensity"
    };
    applyProps(props, this, setterMap);
  }
}