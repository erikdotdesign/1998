import * as THREE from "three";
import { createGradientTexture, applyProps } from "./utils";

export interface BackgroundProps {
  tileCount: number;
  tileSize: number;
  colors: string[];
  visible: boolean;
}

export class Background {
  public mesh!: THREE.Mesh;

  constructor(
    private props: BackgroundProps
  ) {}

  init() {
    const { tileCount, tileSize, colors, visible } = this.props;
    const radius = tileCount * (tileSize + 1);
    const geometry = new THREE.SphereGeometry(radius, 64, 64);

    const texture = createGradientTexture(colors, 0.45, 0.6);

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      side: THREE.BackSide,
      fog: false,
    });

    this.mesh = new THREE.Mesh(geometry, material);
    this.mesh.visible = visible;
  }

  setVisible(visible: boolean) {
    if (!this.mesh) return;
    this.props.visible = visible;
    this.mesh.visible = this.props.visible;
  }

  setColors(colors: string[]) {
    if (!this.mesh) return;
    this.props.colors = colors;
    (this.mesh.material as THREE.MeshBasicMaterial).map = createGradientTexture(this.props.colors, 0.45, 0.6);
  }

  setBackground(props: Partial<BackgroundProps>) {
    const setterMap = {
      visible: "setVisible",
      colors: "setColors"
    };
    applyProps(props, this, setterMap);
  }
}