import * as THREE from "three";
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { loadModel } from "./utils";

import PALM_PATH from "../assets/textures/palm.glb";

export type PalmsProps = {
  tileSize: number;
  color: string;
  emissive: { color: string };
  visible: boolean;
  bloomEffect?: any;
};

export class Palms {
  public group: THREE.Group = new THREE.Group();
  private meshes: THREE.Mesh[] = [];
  private materials: THREE.MeshStandardMaterial[] = [];

  constructor(private props: PalmsProps) {}

  async init() {
    const palmModel = await loadModel(PALM_PATH);
    const { tileSize, color, emissive, visible, bloomEffect } = this.props;

    // Map from material UUID to list of geometries that share it
    const geomMap = new Map<string, { material: THREE.MeshStandardMaterial; geometries: THREE.BufferGeometry[] }>();

    palmModel.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const origMat = mesh.material as THREE.MeshStandardMaterial;
        const key = origMat.uuid;

        // Create shared material if it doesn’t exist yet
        if (!geomMap.has(key)) {
          const mat = origMat.clone();
          mat.color = new THREE.Color(color);
          mat.emissive = new THREE.Color(emissive.color);
          mat.emissiveIntensity = 1;
          mat.metalness = 0.96;
          mat.roughness = 0.5;
          geomMap.set(key, { material: mat, geometries: [] });
          this.materials.push(mat);
        }

        // Collect geometry
        const entry = geomMap.get(key)!;
        entry.geometries.push(mesh.geometry.clone());

        bloomEffect?.selection.add(mesh);
      }
    });

    const countPerSide = 3;
    const totalCount = countPerSide * 2;
    const offsetX = tileSize / 2.1;
    const spacingZ = tileSize / countPerSide;
    const dummy = new THREE.Object3D();
    dummy.scale.set(tileSize / 50, tileSize / 40, tileSize / 50);

    // Merge geometries per material and create instanced meshes
    geomMap.forEach(({ material, geometries }) => {
      const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries, false);

      const instanced = new THREE.InstancedMesh(mergedGeometry, material, totalCount);
      let index = 0;

      for (let i = 0; i < countPerSide; i++) {
        const zPos = -tileSize / 2 + i * spacingZ;

        // Left
        dummy.position.set(-offsetX, 0, zPos);
        dummy.rotation.set(0, Math.PI / 2, 0);
        dummy.updateMatrix();
        instanced.setMatrixAt(index++, dummy.matrix);

        // Right
        dummy.position.set(offsetX, 0, zPos);
        dummy.rotation.set(0, -Math.PI / 2, 0);
        dummy.updateMatrix();
        instanced.setMatrixAt(index++, dummy.matrix);
      }

      instanced.instanceMatrix.needsUpdate = true;
      this.group.visible = visible;
      this.group.add(instanced);
      this.meshes.push(instanced);
    });
  }

  setVisible(visible: boolean) {
    this.props.visible = visible;
    this.group.visible = visible;
  }

  setColor(color: string) {
    this.props.color = color;
    this.materials.forEach((mat) => mat.color.set(color));
  }

  setEmissiveColor(color: string) {
    this.props.emissive.color = color;
    this.materials.forEach((mat) => mat.emissive.set(color));
  }
}