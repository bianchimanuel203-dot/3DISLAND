"use client";

import { useRef, useEffect, useMemo } from "react";
import {
  Clock, PerspectiveCamera, Scene, WebGLRenderer, SRGBColorSpace, MathUtils,
  Vector2, Vector3, MeshPhysicalMaterial, Color, Object3D, InstancedMesh,
  PMREMGenerator, SphereGeometry, AmbientLight, PointLight, ACESFilmicToneMapping,
  Raycaster, Plane,
} from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// Three.js boilerplate
class ThreeApp {
  canvas: HTMLCanvasElement;
  camera: PerspectiveCamera;
  scene: Scene;
  renderer: WebGLRenderer;
  size: any = {};
  onBeforeRender: (s: { elapsed: number; delta: number }) => void = () => {};
  onAfterResize: (s: any) => void = () => {};
  #clock = new Clock();
  #animState = { elapsed: 0, delta: 0 };
  #rafId = 0;
  #resizeObs?: ResizeObserver;
  #interObs?: IntersectionObserver;
  #isVisible = false;
  #isAnimating = false;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.camera = new PerspectiveCamera(50, 1, 0.1, 100);
    this.scene = new Scene();
    this.renderer = new WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    this.renderer.outputColorSpace = SRGBColorSpace;
    this.renderer.toneMapping = ACESFilmicToneMapping;
    this.canvas.style.display = "block";
    this.#resizeObs = new ResizeObserver(() => this.resize());
    this.#resizeObs.observe(canvas.parentElement!);
    this.#interObs = new IntersectionObserver((e) => {
      this.#isAnimating = e[0].isIntersecting;
      this.#isAnimating ? this.#start() : this.#stop();
    });
    this.#interObs.observe(canvas);
    document.addEventListener("visibilitychange", () => {
      if (this.#isAnimating) document.hidden ? this.#stop() : this.#start();
    });
    this.resize();
  }

  resize() {
    const p = this.canvas.parentElement!;
    const w = p.offsetWidth, h = p.offsetHeight;
    this.size = { width: w, height: h, ratio: w / h };
    this.camera.aspect = this.size.ratio;
    this.camera.updateProjectionMatrix();
    const fovRad = (this.camera.fov * Math.PI) / 180;
    this.size.wHeight = 2 * Math.tan(fovRad / 2) * this.camera.position.z;
    this.size.wWidth = this.size.wHeight * this.camera.aspect;
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.onAfterResize(this.size);
  }

  #start() {
    if (this.#isVisible) return;
    this.#isVisible = true;
    this.#clock.start();
    const f = () => {
      this.#rafId = requestAnimationFrame(f);
      this.#animState.delta = this.#clock.getDelta();
      this.#animState.elapsed += this.#animState.delta;
      this.onBeforeRender(this.#animState);
      this.renderer.render(this.scene, this.camera);
    };
    f();
  }

  #stop() {
    if (!this.#isVisible) return;
    cancelAnimationFrame(this.#rafId);
    this.#isVisible = false;
    this.#clock.stop();
  }

  dispose() {
    this.#stop();
    this.#resizeObs?.disconnect();
    this.#interObs?.disconnect();
    this.scene.clear();
    this.renderer.dispose();
  }
}

// Physics
const _obj = new Object3D();

class Physics {
  pos: Float32Array;
  vel: Float32Array;
  sizes: Float32Array;
  center = new Vector3();
  cfg: any;

  constructor(cfg: any) {
    this.cfg = cfg;
    this.pos = new Float32Array(3 * cfg.count);
    this.vel = new Float32Array(3 * cfg.count);
    this.sizes = new Float32Array(cfg.count);
    for (let i = 1; i < cfg.count; i++) {
      this.pos[i * 3] = MathUtils.randFloatSpread(2 * cfg.maxX);
      this.pos[i * 3 + 1] = MathUtils.randFloatSpread(2 * cfg.maxY);
      this.pos[i * 3 + 2] = MathUtils.randFloatSpread(2 * cfg.maxZ);
    }
    this.sizes[0] = cfg.size0;
    for (let i = 1; i < cfg.count; i++) this.sizes[i] = MathUtils.randFloat(cfg.minSize, cfg.maxSize);
  }

  update(dt: number) {
    const { pos, vel, sizes, cfg, center } = this;
    new Vector3().fromArray(pos, 0).lerp(center, 0.1).toArray(pos, 0);
    for (let i = 1; i < cfg.count; i++) {
      const b = i * 3;
      const p = new Vector3().fromArray(pos, b);
      const v = new Vector3().fromArray(vel, b);
      v.y -= dt * cfg.gravity * sizes[i];
      v.multiplyScalar(cfg.friction);
      v.clampLength(0, cfg.maxVelocity);
      p.add(v);
      if (Math.abs(p.x) + sizes[i] > cfg.maxX) { p.x = Math.sign(p.x) * (cfg.maxX - sizes[i]); v.x *= -cfg.wallBounce; }
      if (p.y - sizes[i] < -cfg.maxY) { p.y = -cfg.maxY + sizes[i]; v.y *= -cfg.wallBounce; }
      if (Math.abs(p.z) + sizes[i] > cfg.maxZ) { p.z = Math.sign(p.z) * (cfg.maxZ - sizes[i]); v.z *= -cfg.wallBounce; }
      p.toArray(pos, b); v.toArray(vel, b);
    }
  }
}

class Spheres extends InstancedMesh {
  physics: Physics;
  light: PointLight;
  cfg: any;

  constructor(renderer: WebGLRenderer, cfg: any) {
    const pmrem = new PMREMGenerator(renderer);
    const env = pmrem.fromScene(new RoomEnvironment(renderer)).texture;
    pmrem.dispose();
    const mat = new MeshPhysicalMaterial({ envMap: env, metalness: 0.7, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.2 });
    super(new SphereGeometry(1, 24, 24), mat, cfg.count);
    this.cfg = cfg;
    this.physics = new Physics(cfg);
    const ambient = new AmbientLight(0xffffff, 1.5);
    this.add(ambient);
    this.light = new PointLight(0xffffff, 3, 100, 1);
    this.add(this.light);
    const colors = cfg.colors.map((c: string) => new Color(c));
    for (let i = 0; i < this.count; i++) this.setColorAt(i, colors[i % colors.length]);
    if (this.instanceColor) this.instanceColor.needsUpdate = true;
  }

  update(dt: number) {
    this.physics.update(dt);
    for (let i = 0; i < this.count; i++) {
      _obj.position.fromArray(this.physics.pos, i * 3);
      _obj.scale.setScalar(this.physics.sizes[i]);
      _obj.updateMatrix();
      this.setMatrixAt(i, _obj.matrix);
    }
    this.instanceMatrix.needsUpdate = true;
    this.light.position.fromArray(this.physics.pos, 0);
  }
}

const pointer = new Vector2();

interface BallpitBgProps {
  colors?: string[];
  count?: number;
}

export default function BallpitBg({ colors = ["#e2e8f0", "#cbd5e1", "#94a3b8", "#f1f5f9"], count = 80 }: BallpitBgProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const cfg = useMemo(() => ({
    count, colors, size0: 1.0, minSize: 0.3, maxSize: 0.8,
    gravity: 0.4, friction: 0.995, wallBounce: 0.2, maxVelocity: 0.1,
    maxX: 10, maxY: 10, maxZ: 10,
  }), [colors, count]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const app = new ThreeApp(canvas);
    app.camera.position.set(0, 0, 20);

    const spheres = new Spheres(app.renderer, cfg);
    app.scene.add(spheres);

    const raycaster = new Raycaster();
    const plane = new Plane(new Vector3(0, 0, 1), 0);
    const hit = new Vector3();

    const onMove = (e: PointerEvent) => {
      pointer.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    };
    window.addEventListener("pointermove", onMove);

    app.onBeforeRender = ({ delta }) => {
      raycaster.setFromCamera(pointer, app.camera);
      if (raycaster.ray.intersectPlane(plane, hit)) spheres.physics.center.copy(hit);
      spheres.update(delta);
    };

    app.onAfterResize = (size) => {
      spheres.physics.cfg.maxX = size.wWidth / 2;
      spheres.physics.cfg.maxY = size.wHeight / 2;
      spheres.physics.cfg.maxZ = size.wWidth / 4;
    };

    return () => {
      window.removeEventListener("pointermove", onMove);
      app.dispose();
    };
  }, [cfg]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}