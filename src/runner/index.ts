import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer, EffectPass, RenderPass, SelectiveBloomEffect } from "postprocessing";

import { type RunnerState } from "../runnerReducer";

import { Tile } from "./Tile";
import { type PlaneProps } from "./Plane";
import { type PalmsProps } from "./Palms";
import { type PillarsProps } from "./Pillars";
import { Background, type BackgroundProps } from "./Background";
import { Sun, type SunProps } from "./Sun";
import { Fog, type FogProps } from "./Fog";

const CAMERA_CONFIG = { fov: 50, near: 0.01, far: 1000 };

export interface RunnerOptions {
  width?: number;
  height?: number;
  controls?: boolean;
  onZoomChange?: (zoom: number) => void;
}

export class SynthwaveRunner {
  private scene = new THREE.Scene();
  private camera = new THREE.PerspectiveCamera(CAMERA_CONFIG.fov, 1, CAMERA_CONFIG.near, CAMERA_CONFIG.far);
  private renderer?: THREE.WebGLRenderer;

  private composer?: EffectComposer;
  private controls?: OrbitControls;

  private bloomEffect?: SelectiveBloomEffect;

  private fog?: Fog;
  private background?: Background;
  private sun?: Sun;

  private tileGroup!: THREE.Group;
  private tiles: Tile[] = [];
  private tileSize = 6;
  private tileCount = 3;
  private tilesReady = false;

  private clock = new THREE.Clock();
  private playing = true;
  private pausedAt = 0;
  private timeOffset = 0;

  private frameId?: number;

  constructor(private host: HTMLCanvasElement, opts: RunnerOptions = {}) {
    const { 
      width = host.clientWidth, 
      height = host.clientHeight, 
      controls = true, 
      onZoomChange 
    } = opts;

    this.initRenderer(host, width, height);
    this.initCamera(width, height);
    if (controls) this.initControls(onZoomChange);
    this.initComposer(width, height);
    this.initLights();
    this.initResizeObserver();
  }

  // === Initialization Helpers ===
  private initRenderer(host: HTMLCanvasElement, width: number, height: number) {
    this.renderer = new THREE.WebGLRenderer({
      canvas: host,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.setSize(width, height, false);
  }


  private initCamera(width: number, height: number) {
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.camera.position.set(0, 0.2, 2);
    this.camera.lookAt(0, 0, 0);
  }

  private initControls(onZoomChange?: (zoom: number) => void) {
    this.controls = new OrbitControls(this.camera, this.renderer?.domElement);
    Object.assign(this.controls, { 
      enableDamping: true, 
      dampingFactor: 0.1, 
      enablePan: false, 
      enableZoom: true,
      // minDistance: 0,
      // maxDistance: 1
    });
    if (onZoomChange) {
      this.controls.addEventListener("change", () => 
        onZoomChange(this.camera.position.distanceTo(this.controls!.target))
      );
    }
  }

  private initResizeObserver() {
    new ResizeObserver(() => {
      const { clientWidth: w, clientHeight: h } = this.host;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer?.setSize(w, h, false);
      this.composer?.setSize(w, h);
    }).observe(this.host);
  }

  private initComposer(width: number, height: number) {
    this.composer = new EffectComposer(this.renderer, { multisampling: 4 });
    const renderPass = new RenderPass(this.scene, this.camera);

    this.bloomEffect = new SelectiveBloomEffect(this.scene, this.camera, { 
      luminanceThreshold: 0, 
      intensity: 1, 
      radius: 0.6
    });
    const effectPass = new EffectPass(this.camera, this.bloomEffect);

    this.composer.addPass(renderPass);
    this.composer.addPass(effectPass);
    this.composer.setSize(width, height);
  }

  private initLights() {
    const ambientLight = new THREE.AmbientLight("#fff", 20);
    this.scene.add(ambientLight);
  }

  setZoomLevel(distance: number) {
    const dir = new THREE.Vector3();
    this.camera.getWorldDirection(dir);
    this.camera.position.copy(dir.multiplyScalar(-distance));
    this.camera.updateProjectionMatrix();
  }

  updateFog(props: Partial<FogProps>) {
    this.fog?.setFog(props);
  }

  updateBackground(props: Partial<BackgroundProps>) {
    this.background?.setBackground(props);
  }

  updateSun(props: Partial<SunProps>) {
    this.sun?.setSun(props);
  }

  private updateTiles(updater: (tile: Tile) => void) {
    if (!this.tilesReady) return;
    this.tiles.forEach(updater);
  }

  updatePlane(props: Partial<PlaneProps>) {
    if (!this.tilesReady) return;
    this.updateTiles(tile => tile.setPlane(props));
  }

  updatePalms(props: Partial<PalmsProps>) {
    if (!this.tilesReady) return;
    this.updateTiles(tile => tile.setPalms(props));
  }

  updatePillars(props: Partial<PillarsProps>) {
    if (!this.tilesReady) return;
    this.updateTiles(tile => tile.setPillars(props));
  }

  async initTiles(state: RunnerState) {
    const totalTiles = this.tileCount * 3; // 3 sets (back, middle, front)
    this.tileGroup = new THREE.Group();
    this.scene.add(this.tileGroup);
    for (let i = 0; i < totalTiles; i++) {
      const tile = new Tile({
        plane: {
          ...state.plane,
          tileSize: this.tileSize,
          bloomEffect: this.bloomEffect
        },
        palms: {
          ...state.palms,
          tileSize: this.tileSize,
          bloomEffect: this.bloomEffect
        },
        pillars: {
          ...state.pillars,
          tileSize: this.tileSize,
          bloomEffect: this.bloomEffect
        }
      });
      await tile.init();

      tile.group.position.set(0, 0, -i * this.tileSize);
      this.tileGroup.add(tile.group);
      this.tiles.push(tile);
    }
    this.tileGroup.position.z += (this.tileCount * this.tileSize); // space for back set
    this.tilesReady = true;
  }

  initFog(state: RunnerState) {
    this.fog = new Fog({
      ...state.fog,
      tileCount: this.tileCount
    });
    this.fog.init();
    this.scene.fog = this.fog.fog;
  }

  initBackground(state: RunnerState) {
    this.background = new Background({
      ...state.background,
      tileCount: this.tileCount,
      tileSize: this.tileSize
    });
    this.background.init();
    this.scene.add(this.background.mesh);
  }

  async initSun(state: RunnerState) {
    this.sun = new Sun({
      ...state.sun,
      tileCount: this.tileCount,
      tileSize: this.tileSize,
      bloomEffect: this.bloomEffect
    });
    await this.sun.init();
    this.scene.add(this.sun.mesh);
  }

  // === Synthwave scene ===
  async setScene(state: RunnerState) {
    this.initFog(state);
    this.initBackground(state);
    await this.initSun(state);
    await this.initTiles(state);
  }

  // === Animation ===
  startLoop() {
    const tick = () => {
      const elapsedTime = this.clock.getElapsedTime() - this.timeOffset;
      this.controls?.update();

      if (this.playing && this.tileGroup) {
        const scrollSpeed = 1; // units per second
        const stripLength = this.tileCount * this.tileSize;

        // shift after moving 1 tileSize w/ back tiles offset
        this.tileGroup.position.z = ((elapsedTime * scrollSpeed) % this.tileSize) + stripLength;
      }

      this.composer?.render();
      this.frameId = requestAnimationFrame(tick);
    };

    if (!this.frameId) this.frameId = requestAnimationFrame(tick);
  }

  stopLoop(fullStop = false) {
    if (fullStop && this.frameId) cancelAnimationFrame(this.frameId);
    this.frameId = undefined;
  }

  setPlaying(state: boolean) {
    if (!state && this.playing) {
      // going into pause
      this.pausedAt = this.clock.getElapsedTime();
      this.playing = false;
    } else if (state && !this.playing) {
      // resuming
      this.timeOffset += this.clock.getElapsedTime() - this.pausedAt;
      this.playing = true;
    }
  }
}