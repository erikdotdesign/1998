import * as THREE from "three";
import { loadTexture } from "./utils";

import TEXTURE_PATH from "../assets/textures/grid.png";
import DISPLACEMENT_PATH_2 from "../assets/textures/displacement.png";
import METALNESS_PATH_2 from "../assets/textures/metalness.png";
import CHECK_TEXTURE_PATH from "../assets/textures/check.png";

export type PlaneProps = {
  tileSize: number;
  color: string;
  emissive: { color: string };
  check: boolean;
  displacement: { scale: number };
  bloomEffect?: any;
};

export class Plane {
  public mesh!: THREE.Mesh;
  static sharedGeometry?: THREE.PlaneGeometry;
  static sharedMaterial?: THREE.MeshStandardMaterial;

  constructor(private props: PlaneProps) {
    if (!Plane.sharedGeometry) {
      Plane.sharedGeometry = new THREE.PlaneGeometry(
        props.tileSize,
        props.tileSize,
        48,
        48
      );
    }
    this.mesh = new THREE.Mesh(
      Plane.sharedGeometry,
      Plane.sharedMaterial || new THREE.MeshStandardMaterial()
    );
  }

  async init() {
    const { color, emissive, check, displacement, bloomEffect } = this.props;
    
    if (!Plane.sharedMaterial) {
      // load textures + create material once
      const [gridTexture, terrainTexture, metalnessTexture, checkTexture] =
        await Promise.all([
          loadTexture(TEXTURE_PATH),
          loadTexture(DISPLACEMENT_PATH_2),
          loadTexture(METALNESS_PATH_2),
          loadTexture(CHECK_TEXTURE_PATH),
        ]);

      Plane.sharedMaterial = new THREE.MeshStandardMaterial({
        emissiveMap: check ? checkTexture : gridTexture,
        emissive: new THREE.Color(emissive.color),
        color: new THREE.Color(color),
        emissiveIntensity: 3,
        displacementMap: terrainTexture,
        displacementScale: displacement.scale,
        metalnessMap: check ? undefined : metalnessTexture,
        metalness: 0.96,
        roughness: 0.5,
      });
    }

    // assign the shared material
    this.mesh.material = Plane.sharedMaterial;
    this.mesh.rotation.x = -Math.PI / 2;

    // add bloom to all meshes
    bloomEffect?.selection.add(this.mesh);
  }

  // ⚠️ With shared material, these change ALL planes at once
  setDisplacementScale(scale: number) {
    if (!Plane.sharedMaterial) return;
    this.props.displacement.scale = scale;
    Plane.sharedMaterial.displacementScale = scale;
  }

  setColor(color: string) {
    if (!Plane.sharedMaterial) return;
    this.props.color = color;
    Plane.sharedMaterial.color = new THREE.Color(color);
  }

  setEmissiveColor(color: string) {
    if (!Plane.sharedMaterial) return;
    this.props.emissive.color = color;
    Plane.sharedMaterial.emissive = new THREE.Color(color);
  }

  async setPlaneCheck(check: boolean) {
    if (!Plane.sharedMaterial) return;
    this.props.check = check;

    const [gridTexture, checkTexture, metalnessTexture] = await Promise.all([
      loadTexture(TEXTURE_PATH),
      loadTexture(CHECK_TEXTURE_PATH),
      loadTexture(METALNESS_PATH_2),
    ]);

    Plane.sharedMaterial.emissiveMap = (check ? checkTexture : gridTexture) as THREE.Texture;
    Plane.sharedMaterial.metalnessMap = (check ? null : metalnessTexture) as THREE.Texture | null;
    Plane.sharedMaterial.needsUpdate = true;
  }

  dispose() {
    // only dispose once
    if (Plane.sharedMaterial) {
      Plane.sharedMaterial.dispose();
      Plane.sharedMaterial = undefined;
    }
    if (Plane.sharedGeometry) {
      Plane.sharedGeometry.dispose();
      Plane.sharedGeometry = undefined;
    }
  }
};