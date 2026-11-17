// A jointed two-legged (or floating) figure with code-driven animation.
// Characters supply the shapes for each body part; this file supplies the
// skeleton and every movement: idle, attack, cast, hit, block, death, etc.
import { useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import { DURATION, Sway, damp, kf, now, type Ctl } from './kit';

export interface RigCfg {
  /** How this character strikes: weapon swing, two-handed spell, or bow shot. */
  style: 'melee' | 'cast' | 'bow';
  /** Floating characters have a robe instead of walking legs. */
  float?: boolean;
  /** Overall size multiplier. */
  size?: number;
  /** Resting forward lean of the upper body, in radians. */
  hunch?: number;
  /** Idle animation speed multiplier. */
  tempo?: number;
  /** Turn of the body toward the camera, in radians. */
  twist?: number;
}

type Side = 1 | -1;

export interface HumanoidProps {
  ctl: Ctl;
  cfg: RigCfg;
  torso?: ReactNode;
  hips?: ReactNode;
  head?: ReactNode;
  back?: ReactNode;
  upperArm?: (side: Side) => ReactNode;
  foreArm?: (side: Side) => ReactNode;
  handR?: ReactNode;
  handL?: ReactNode;
  thigh?: (side: Side) => ReactNode;
  shin?: (side: Side) => ReactNode;
  /** Replaces the legs (robes, ghostly tails). */
  skirt?: ReactNode;
  /** Extras that follow the body but not the joints (orbiting runes etc). */
  aura?: ReactNode;
  shoulder?: number;
}

interface Pose {
  z: number; y: number; fall: number; scale: number;
  bodyX: number; bodyY: number; bodyZ: number;
  headX: number; headY: number;
  armRX: number; armRZ: number; foreR: number;
  armLX: number; armLZ: number; foreL: number;
  legR: number; legL: number; kneeR: number; kneeL: number;
}

function basePose(cfg: RigCfg, time: number): Pose {
  const w = time * 2 * (cfg.tempo ?? 1);
  const breathe = Math.sin(w);
  return {
    z: 0,
    y: cfg.float ? 0.28 + Math.sin(w * 0.8) * 0.1 : breathe * 0.015,
    fall: 0, scale: 1,
    bodyX: (cfg.hunch ?? 0) + breathe * 0.025, bodyY: Math.sin(w * 0.5) * 0.04, bodyZ: 0,
    headX: -(cfg.hunch ?? 0) * 0.7 + Math.sin(w * 0.5 + 1) * 0.03, headY: Math.sin(w * 0.37) * 0.12,
    armRX: -0.3 + breathe * 0.04, armRZ: -0.16, foreR: -0.55 + breathe * 0.04,
    armLX: 0.06 - breathe * 0.04, armLZ: 0.16, foreL: -0.3,
    legR: 0.1, legL: -0.14, kneeR: 0.05, kneeL: 0.12,
  };
}

/** Works out where every joint should be for the current animation moment. */
function poseFor(cfg: RigCfg, ctl: Ctl, time: number): Pose {
  const p = basePose(cfg, time);
  const t = time - ctl.t0;
  const reach = ctl.reach;

  switch (ctl.state) {
    case 'attack': {
      p.z = kf(t, [[0, 0], [0.3, reach], [0.58, reach], [0.98, 0]]);
      p.y += kf(t, [[0, 0], [0.15, 0.4], [0.3, 0], [0.58, 0], [0.78, 0.3], [0.98, 0]]);
      p.armRX = kf(t, [[0, -0.3], [0.26, -3.3], [0.36, -3.45], [0.47, -0.45], [0.62, -0.6], [0.98, -0.3]]);
      p.armRZ = kf(t, [[0, -0.16], [0.3, -0.5], [0.47, 0.1], [0.98, -0.16]]);
      p.foreR = kf(t, [[0, -0.5], [0.3, -1.2], [0.47, -0.05], [0.98, -0.5]]);
      p.armLX = kf(t, [[0, 0], [0.3, 0.7], [0.47, -0.5], [0.98, 0]]);
      p.bodyX += kf(t, [[0, 0], [0.3, -0.3], [0.47, 0.55], [0.62, 0.3], [0.98, 0]]);
      p.bodyY = kf(t, [[0, 0], [0.3, -0.55], [0.47, 0.5], [0.98, 0]]);
      p.legL = kf(t, [[0, -0.14], [0.3, -0.75], [0.6, -0.6], [0.98, -0.14]]);
      p.legR = kf(t, [[0, 0.1], [0.3, 0.6], [0.6, 0.45], [0.98, 0.1]]);
      p.kneeR = kf(t, [[0, 0.05], [0.3, 0.6], [0.98, 0.05]]);
      break;
    }
    case 'cast': {
      if (cfg.style === 'bow') {
        p.armLX = kf(t, [[0, 0], [0.2, -1.55], [0.7, -1.55], [1, 0]]);
        p.armLZ = 0.05;
        p.foreL = -0.05;
        p.armRX = kf(t, [[0, -0.3], [0.2, -1.5], [0.7, -1.45], [1, -0.3]]);
        p.foreR = kf(t, [[0, -0.5], [0.22, -1.2], [0.38, -2.2], [0.42, -0.4], [0.7, -0.6], [1, -0.5]]);
        p.bodyY = kf(t, [[0, 0], [0.25, 0.75], [0.7, 0.75], [1, 0]]);
        p.headY = -p.bodyY * 0.8;
        p.bodyX += kf(t, [[0, 0], [0.38, -0.12], [0.44, 0.06], [1, 0]]);
        p.legL = -0.45; p.legR = 0.4;
      } else {
        p.y += kf(t, [[0, 0], [0.35, 0.22], [0.5, 0.08], [1, 0]]);
        p.armRX = kf(t, [[0, -0.3], [0.28, -3.0], [0.36, -3.0], [0.44, -1.45], [0.72, -1.5], [1, -0.3]]);
        p.armLX = kf(t, [[0, 0], [0.28, -2.9], [0.36, -2.9], [0.44, -1.4], [0.72, -1.45], [1, 0]]);
        p.armRZ = kf(t, [[0, -0.16], [0.3, -0.6], [0.44, 0.15], [1, -0.16]]);
        p.armLZ = kf(t, [[0, 0.16], [0.3, 0.6], [0.44, -0.15], [1, 0.16]]);
        p.foreR = kf(t, [[0, -0.5], [0.3, -0.9], [0.44, -0.1], [1, -0.5]]);
        p.foreL = kf(t, [[0, -0.3], [0.3, -0.9], [0.44, -0.1], [1, -0.3]]);
        p.bodyX += kf(t, [[0, 0], [0.3, -0.3], [0.44, 0.35], [0.72, 0.2], [1, 0]]);
        p.z = kf(t, [[0, 0], [0.3, -0.15], [0.44, 0.3], [1, 0]]);
      }
      break;
    }
    case 'hit': {
      const k = kf(t, [[0, 0], [0.08, 1], [0.55, 0]]);
      p.z = -0.55 * k;
      p.bodyX += -0.5 * k;
      p.headX = -0.45 * k;
      p.armRZ -= 0.7 * k; p.armLZ += 0.7 * k;
      p.armRX += 0.4 * k; p.armLX += 0.3 * k;
      p.bodyZ = Math.sin(t * 40) * 0.08 * k;
      p.scale = 1 - 0.06 * k;
      break;
    }
    case 'block': {
      const k = kf(t, [[0, 0], [0.12, 1], [0.5, 1], [0.7, 0]]);
      p.armLX = -1.5 * k; p.foreL = -1.3 * k; p.armLZ = 0.16 - 0.5 * k;
      p.bodyX += 0.15 * k; p.z = -0.12 * k;
      p.legL = -0.4 * k; p.legR = 0.35 * k;
      break;
    }
    case 'death': {
      const k = kf(t, [[0, 0], [0.7, 1]]);
      p.fall = -1.45 * k;
      p.z = -0.5 * k;
      p.y = (cfg.float ? 0.28 * (1 - k) : 0) + Math.sin(k * Math.PI) * 0.25;
      p.bodyX = -0.4 * k; p.headX = -0.5 * k;
      p.armRZ = -1.2 * k; p.armLZ = 1.2 * k; p.armRX = -0.4 * k;
      p.bodyZ = Math.sin(t * 34) * 0.1 * (1 - k);
      p.scale = kf(t, [[0, 1], [0.75, 1], [1.5, 0.001]]);
      break;
    }
    case 'down': {
      const k = kf(t, [[0, 0], [0.6, 1]]);
      p.y = -0.42 * k;
      p.bodyX = 0.75 * k; p.headX = 0.55 * k; p.headY = 0;
      p.armRX = -0.5 * k; p.foreR = -0.3; p.armLX = -0.4 * k;
      p.armRZ = -0.3; p.armLZ = 0.3;
      p.legL = -1.35 * k; p.kneeL = 1.5 * k;
      p.legR = 0.25 * k; p.kneeR = 1.55 * k;
      break;
    }
    case 'spawn': {
      p.scale = kf(t, [[0, 0.001], [0.5, 1.12], [0.85, 1]]);
      p.y += kf(t, [[0, -0.7], [0.5, 0.15], [0.85, 0]]);
      p.armRZ = -kf(t, [[0, 1.3], [0.85, 0.16]]);
      p.armLZ = kf(t, [[0, 1.3], [0.85, 0.16]]);
      break;
    }
    case 'victory': {
      const hop = Math.abs(Math.sin(t * 4.2));
      p.y += hop * 0.22;
      p.armRX = -2.95 + Math.sin(t * 8.4) * 0.12; p.armRZ = -0.3; p.foreR = -0.2;
      p.armLX = cfg.style === 'melee' ? -0.6 : -2.8; p.armLZ = 0.4;
      p.bodyX -= 0.12; p.headX = -0.25;
      p.legL = -0.2 - hop * 0.2; p.legR = 0.2 + hop * 0.2;
      break;
    }
    default:
      break;
  }
  return p;
}

export function Humanoid(props: HumanoidProps) {
  const { ctl, cfg } = props;
  const size = cfg.size ?? 1;
  const sh = props.shoulder ?? 0.34;
  const root = useRef<Group>(null);
  const body = useRef<Group>(null);
  const head = useRef<Group>(null);
  const armR = useRef<Group>(null);
  const armL = useRef<Group>(null);
  const foreR = useRef<Group>(null);
  const foreL = useRef<Group>(null);
  const legR = useRef<Group>(null);
  const legL = useRef<Group>(null);
  const kneeR = useRef<Group>(null);
  const kneeL = useRef<Group>(null);

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const time = now();
    const length = DURATION[ctl.state];
    if (length !== undefined && time - ctl.t0 > length) {
      ctl.state = ctl.rest;
      ctl.t0 = time;
    }
    const p = poseFor(cfg, ctl, time);
    const L = 20;
    const r = root.current;
    if (r) {
      r.position.z = damp(r.position.z, p.z, 26, dt);
      r.position.y = damp(r.position.y, p.y, 22, dt);
      r.rotation.x = damp(r.rotation.x, p.fall, 12, dt);
      const s = damp(r.scale.x / size, p.scale, 18, dt) * size;
      r.scale.setScalar(Math.max(s, 0.0001));
      r.visible = s > 0.02;
    }
    const set = (g: Group | null, x: number, y = 0, z = 0) => {
      if (!g) return;
      g.rotation.x = damp(g.rotation.x, x, L, dt);
      g.rotation.y = damp(g.rotation.y, y, L, dt);
      g.rotation.z = damp(g.rotation.z, z, L, dt);
    };
    set(body.current, p.bodyX, p.bodyY, p.bodyZ);
    set(head.current, p.headX, p.headY);
    set(armR.current, p.armRX, 0, p.armRZ);
    set(armL.current, p.armLX, 0, p.armLZ);
    set(foreR.current, p.foreR);
    set(foreL.current, p.foreL);
    set(legR.current, p.legR);
    set(legL.current, p.legL);
    set(kneeR.current, p.kneeR);
    set(kneeL.current, p.kneeL);
  });

  const arm = (side: Side) => (
    <group ref={side === -1 ? armR : armL} position={[side * sh, 0.52, 0]}>
      {props.upperArm?.(side)}
      <group ref={side === -1 ? foreR : foreL} position={[0, -0.32, 0]}>
        {props.foreArm?.(side)}
        <group position={[0, -0.34, 0]}>{side === -1 ? props.handR : props.handL}</group>
      </group>
    </group>
  );

  const leg = (side: Side) => (
    <group ref={side === -1 ? legR : legL} position={[side * 0.16, 0, 0]}>
      {props.thigh?.(side)}
      <group ref={side === -1 ? kneeR : kneeL} position={[0, -0.46, 0]}>
        {props.shin?.(side)}
      </group>
    </group>
  );

  return (
    <group ref={root} scale={size}>
      <group rotation={[0, cfg.twist ?? 0, 0]}>
        <group position={[0, 0.96, 0]}>
          {props.skirt ?? (
            <>
              {leg(-1)}
              {leg(1)}
            </>
          )}
          {props.hips}
          <group ref={body}>
            {props.torso}
            {props.back && <group position={[0, 0.6, 0]}><Sway><group position={[0, -0.6, 0]}>{props.back}</group></Sway></group>}
            <group ref={head} position={[0, 0.7, 0]}>{props.head}</group>
            {arm(-1)}
            {arm(1)}
          </group>
        </group>
        {props.aura}
      </group>
    </group>
  );
}
