import * as THREE from "three";
import type { SelectiveBloomEffect } from "postprocessing";
import { createGradientTexture, loadTexture, applyProps } from "./utils";

import SUN_PATH from "../assets/textures/sun.png";

export interface SunProps {
  tileCount: number;
  tileSize: number;
  colors: string[];
  visible: boolean;
  bloomEffect: SelectiveBloomEffect | undefined;
}

export class Sun {
  private props: SunProps;
  public mesh!: THREE.Mesh;

  constructor(props: SunProps) {
    this.props = props;
  }

  async init() {
    const { colors, tileCount, tileSize, visible, bloomEffect } = this.props;

    const sunRadius = (tileCount * tileSize) / 6;
    const sunMask = await loadTexture(SUN_PATH);
    const gradientTex = createGradientTexture(colors);
    const sunGeometry = new THREE.CircleGeometry(sunRadius, 128);
    const sunMaterial = new THREE.MeshBasicMaterial({ 
      map: gradientTex,
      alphaMap: sunMask,
      transparent: true,
      toneMapped: false,
      fog: false,
    });

    this.mesh = new THREE.Mesh(sunGeometry, sunMaterial);

    const tileTopY = 0;
    const centerY = tileTopY + sunRadius;

    this.mesh.position.set(0, centerY, -tileCount * tileSize);
    this.mesh.visible = visible;

    bloomEffect?.selection.add(this.mesh);
  }

  setVisible(visible: boolean) {
    if (!this.mesh) return;
    this.props.visible = visible;
    this.mesh.visible = this.props.visible;
  }

  setColors(colors: string[]) {
    if (!this.mesh) return;
    this.props.colors = colors;
    (this.mesh.material as THREE.MeshBasicMaterial).map = createGradientTexture(this.props.colors);
  }

  setSun(props: Partial<SunProps>) {
    const setterMap = {
      visible: "setVisible",
      colors: "setColors"
    };
    applyProps(props, this, setterMap);
  }
}