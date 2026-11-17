// Building blocks for the code-built 3D art: shared shapes, cached
// materials, a compact primitive component, and animation helpers.
import * as THREE from 'three';
import { useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';

/** Double-bitted axe head: two crescents, drawn flat then given thickness. */
function axeBlade() {
  const shape = new THREE.Shape();
  shape.moveTo(-0.1, 0.04);
  shape.lineTo(-0.3, 0.42);
  shape.quadraticCurveTo(0, 0.62, 0.3, 0.42);
  shape.lineTo(0.1, 0.04);
  shape.lineTo(0.1, -0.04);
  shape.lineTo(0.3, -0.42);
  shape.quadraticCurveTo(0, -0.62, -0.3, -0.42);
  shape.lineTo(-0.1, -0.04);
  shape.closePath();
  const geometry = new THREE.ExtrudeGeometry(shape, { depth: 0.06, bevelEnabled: true, bevelSize: 0.02, bevelThickness: 0.02, bevelSegments: 1 });
  geometry.translate(0, 0, -0.03);
  return geometry;
}

export const GEO = {
  box: new THREE.BoxGeometry(1, 1, 1),
  sphere: new THREE.IcosahedronGeometry(0.5, 2),
  rock: new THREE.DodecahedronGeometry(0.5, 0),
  gem: new THREE.OctahedronGeometry(0.5, 0),
  shard: new THREE.TetrahedronGeometry(0.5, 0),
  cyl: new THREE.CylinderGeometry(0.5, 0.5, 1, 10),
  taper: new THREE.CylinderGeometry(0.32, 0.5, 1, 10),
  flare: new THREE.CylinderGeometry(0.5, 0.3, 1, 10),
  cone: new THREE.ConeGeometry(0.5, 1, 10),
  spike: new THREE.ConeGeometry(0.5, 1, 5),
  torus: new THREE.TorusGeometry(0.5, 0.06, 8, 28),
  ring: new THREE.TorusGeometry(0.5, 0.02, 6, 40),
  capsule: new THREE.CapsuleGeometry(0.5, 1, 4, 10),
  disc: new THREE.CylinderGeometry(0.5, 0.5, 1, 28),
  plane: new THREE.PlaneGeometry(1, 1),
  axe: axeBlade(),
  arc: new THREE.TorusGeometry(1, 0.05, 6, 28, Math.PI * 0.95),
  wave: new THREE.RingGeometry(0.8, 1, 40),
};
export type GeoName = keyof typeof GEO;

type V3 = [number, number, number];

interface MatOpts {
  e?: string;
  ei?: number;
  m?: number;
  ro?: number;
  flat?: boolean;
  o?: number;
  side?: THREE.Side;
  /** Edge glow; switch off for floors and other large flat surfaces. */
  rim?: boolean;
}

/**
 * Shader add-ons for every material: an optional soft glow on edges facing
 * away from the camera (keeps shapes readable on dark backdrops), and a guard
 * that stops a broken pixel from blacking out the whole screen through bloom.
 */
function extend(material: THREE.MeshStandardMaterial, rim: boolean) {
  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <opaque_fragment>',
      `${rim ? `float rimK = pow(1.0 - saturate(dot(normalize(normal), normalize(vViewPosition))), 2.6);
       outgoingLight += (diffuseColor.rgb * 0.9 + vec3(0.16, 0.2, 0.32)) * rimK * 0.85;` : ''}
       if (!(outgoingLight.r >= 0.0) || !(outgoingLight.g >= 0.0) || !(outgoingLight.b >= 0.0)) outgoingLight = vec3(0.0);
       outgoingLight = min(outgoingLight, vec3(40.0));
       #include <opaque_fragment>`,
    );
  };
  material.customProgramCacheKey = () => (rim ? 'rim' : 'plain');
}

const cache = new Map<string, THREE.MeshStandardMaterial>();

/** Cached standard material. Emissive colours above intensity ~1 pick up bloom. */
export function mat(color: string, opts: MatOpts = {}): THREE.MeshStandardMaterial {
  const key = color + JSON.stringify(opts);
  let material = cache.get(key);
  if (!material) {
    material = new THREE.MeshStandardMaterial({
      color,
      roughness: opts.ro ?? 0.72,
      metalness: opts.m ?? 0,
      flatShading: opts.flat ?? true,
      emissive: opts.e ?? '#000000',
      emissiveIntensity: opts.e ? opts.ei ?? 1.6 : 0,
      transparent: opts.o !== undefined,
      opacity: opts.o ?? 1,
      side: opts.side ?? THREE.FrontSide,
      depthWrite: opts.o === undefined || opts.o > 0.6,
    });
    extend(material, opts.o === undefined && opts.rim !== false);
    cache.set(key, material);
  }
  return material;
}

interface PProps extends MatOpts {
  g?: GeoName;
  c?: string;
  p?: V3;
  r?: V3;
  s?: number | V3;
  shadow?: boolean;
  children?: ReactNode;
}

/** One primitive shape. `g` shape, `c` colour, `p` position, `r` rotation, `s` scale, `e` glow. */
export function P({ g = 'box', c = '#888888', p, r, s = 1, shadow = true, children, ...opts }: PProps) {
  return (
    <mesh
      geometry={GEO[g]}
      material={mat(c, opts)}
      position={p}
      rotation={r}
      scale={s}
      castShadow={shadow && opts.o === undefined}
      receiveShadow={shadow && !opts.e}
    >
      {children}
    </mesh>
  );
}

export type AnimName = 'idle' | 'attack' | 'cast' | 'hit' | 'block' | 'death' | 'down' | 'spawn' | 'victory';

/** Mutable animation handle. The stage director writes it; the rig reads it each frame. */
export interface Ctl {
  state: AnimName;
  t0: number;
  rest: AnimName;
  reach: number;
}

export const now = () => performance.now() / 1000;

export function newCtl(state: AnimName = 'idle'): Ctl {
  return { state, t0: now(), rest: 'idle', reach: 2.8 };
}

export function play(ctl: Ctl, state: AnimName, rest?: AnimName) {
  ctl.state = state;
  ctl.t0 = now();
  if (rest) ctl.rest = rest;
}

/** Length of one-shot animations (seconds). Looping/held states are absent. */
export const DURATION: Partial<Record<AnimName, number>> = {
  attack: 1.05, cast: 1.0, hit: 0.55, block: 0.7, spawn: 0.85,
};

/** Moment within the animation when the blow lands / the projectile leaves. */
export const IMPACT = { attack: 0.45, cast: 0.4, projectile: 0.24 };

const smooth = (x: number) => x * x * (3 - 2 * x);

/** Keyframe lookup with smooth easing: kf(t, [[time, value], ...]). */
export function kf(t: number, frames: [number, number][]): number {
  if (t <= frames[0][0]) return frames[0][1];
  for (let i = 1; i < frames.length; i++) {
    const [t1, v1] = frames[i];
    if (t <= t1) {
      const [t0, v0] = frames[i - 1];
      return v0 + (v1 - v0) * smooth((t - t0) / (t1 - t0));
    }
  }
  return frames[frames.length - 1][1];
}

export const damp = THREE.MathUtils.damp;

/** Small deterministic random generator so scenery is identical on every load. */
export function seeded(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Steadily rotates its children (orbiting runes, gears, halos). */
export function Spin({ speed = 1, axis = 'y', children, ...rest }: {
  speed?: number; axis?: 'x' | 'y' | 'z'; children?: ReactNode; position?: V3; rotation?: V3; scale?: number | V3;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => { if (ref.current) ref.current.rotation[axis] += dt * speed; });
  return <group {...rest}><group ref={ref}>{children}</group></group>;
}

/** Gently floats and pulses its children (flames, crystals, orbs). */
export function Bob({ speed = 2, height = 0.08, pulse = 0, phase = 0, children, ...rest }: {
  speed?: number; height?: number; pulse?: number; phase?: number; children?: ReactNode; position?: V3; rotation?: V3; scale?: number | V3;
}) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    const t = now() * speed + phase;
    ref.current.position.y = Math.sin(t) * height;
    if (pulse) ref.current.scale.setScalar(1 + Math.sin(t * 2.3) * pulse);
  });
  return <group {...rest}><group ref={ref}>{children}</group></group>;
}

/** Sways its children back and forth like cloth in a breeze (capes, hair, tails). */
export function Sway({ speed = 1.6, amount = 0.1, phase = 0, children }: { speed?: number; amount?: number; phase?: number; children?: ReactNode }) {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (!ref.current) return;
    const t = now() * speed + phase;
    ref.current.rotation.x = Math.sin(t) * amount + amount * 0.6;
    ref.current.rotation.z = Math.sin(t * 0.7) * amount * 0.4;
  });
  return <group ref={ref}>{children}</group>;
}
