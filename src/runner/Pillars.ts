import * as THREE from "three";
import type { SelectiveBloomEffect } from "postprocessing";
import { loadModel, createGradientTexture } from "./utils";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import PILLAR_PATH from "../assets/textures/pillar.glb";

export type PillarsProps = {
  tileSize: number;
  colors: string[];
  visible: boolean;
  bloomEffect?: SelectiveBloomEffect;
};

export class Pillars {
  private props: PillarsProps;
  public mesh!: THREE.InstancedMesh;
  private modelGeometry!: THREE.BufferGeometry;
  private material!: THREE.MeshStandardMaterial;

  constructor(props: PillarsProps) {
    this.props = props;
  }

  async init() {
    const pillarModel = await loadModel(PILLAR_PATH);
    const { tileSize, colors, visible, bloomEffect } = this.props;

    // --- Extract geometry from model ---
    pillarModel.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        this.modelGeometry = mesh.geometry.clone();

        // shared material with gradient
        const gradientTex = createGradientTexture(colors);
        gradientTex.wrapS = THREE.RepeatWrapping;
        gradientTex.wrapT = THREE.RepeatWrapping;
        gradientTex.needsUpdate = true;

        this.material = new THREE.MeshStandardMaterial({
          map: gradientTex,
          emissiveMap: gradientTex,
          emissive: new THREE.Color("#ffffff"),
          emissiveIntensity: 2,
          metalness: 1,
          roughness: 0.2,
        });

        bloomEffect?.selection.add(mesh);
      }
    });

    const countPerSide = 3;
    const totalCount = countPerSide * 2;
    this.mesh = new THREE.InstancedMesh(this.modelGeometry, this.material, totalCount);

    const offsetX = tileSize / 6;
    const spacingZ = tileSize / countPerSide;

    const dummy = new THREE.Object3D();

    // --- Scale once for all instances ---
    const scaleFactor = tileSize / 5000;
    dummy.scale.set(scaleFactor, scaleFactor, scaleFactor);

    let index = 0;
    for (let i = 0; i < countPerSide; i++) {
      const zPos = -tileSize / 2 + (i + 0.5) * spacingZ;

      // Left pillar
      dummy.position.set(-offsetX, 0, zPos);
      dummy.updateMatrix();
      this.mesh.setMatrixAt(index++, dummy.matrix);

      // Right pillar
      dummy.position.set(offsetX, 0, zPos);
      dummy.updateMatrix();
      this.mesh.setMatrixAt(index++, dummy.matrix);
    }

    this.mesh.instanceMatrix.needsUpdate = true;
    this.mesh.visible = visible;
  }

  setVisible(visible: boolean) {
    this.props.visible = visible;
    this.mesh.visible = visible;
  }

  setColors(colors: string[]) {
    this.props.colors = colors;
    if (this.material?.map) {
      const gradientTex = createGradientTexture(colors);
      gradientTex.wrapS = THREE.RepeatWrapping;
      gradientTex.wrapT = THREE.RepeatWrapping;
      gradientTex.needsUpdate = true;

      this.material.map = gradientTex;
      this.material.emissiveMap = gradientTex;
      this.material.needsUpdate = true;
    }
  }
}