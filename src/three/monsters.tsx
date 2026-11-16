// The corrupted creatures of Meridaeia. Four use the shared Humanoid rig;
// the wolf has its own four-legged skeleton.
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import type { Group } from 'three';
import type { MonsterKey } from '../data';
import { Humanoid, type RigCfg } from './Humanoid';
import { seg } from './heroes';
import { Bob, DURATION, P, Spin, damp, kf, now, type Ctl } from './kit';

interface Props { ctl: Ctl; twist?: number }

/* ---------- Syntax Goblin: small, horned, quick with a jagged dagger ---------- */
function Goblin({ ctl, twist }: Props) {
  const skin = '#8d8794', cloth = '#5e1f24', eye = '#ff3030';
  const cfg: RigCfg = { style: 'melee', size: 0.78, hunch: 0.34, tempo: 1.7, twist };
  return (
    <Humanoid
      ctl={ctl} cfg={cfg} shoulder={0.32}
      torso={<>
        <P g="taper" c={skin} s={[0.5, 0.6, 0.4]} p={[0, 0.3, 0]} />
        <P g="box" c={cloth} s={[0.52, 0.2, 0.42]} p={[0, 0.02, 0]} />
        <P g="gem" c={eye} e={eye} ei={3} s={[0.1, 0.12, 0.05]} p={[0, 0.5, 0.2]} />
      </>}
      back={<>
        <P g="taper" c={cloth} s={[0.8, 1.0, 0.05]} p={[0, 0.1, -0.22]} r={[0.2, 0, Math.PI]} />
        <P g="flare" c={cloth} s={[0.7, 0.24, 0.5]} p={[0, 0.62, -0.02]} />
      </>}
      head={<>
        <P g="sphere" c={skin} s={[0.5, 0.46, 0.46]} p={[0, 0.2, 0.02]} />
        <P g="cone" c={skin} s={[0.14, 0.5, 0.06]} p={[0.38, 0.24, 0]} r={[0, 0, -1.3]} />
        <P g="cone" c={skin} s={[0.14, 0.5, 0.06]} p={[-0.38, 0.24, 0]} r={[0, 0, 1.3]} />
        <P g="spike" c="#3a3038" s={[0.1, 0.34, 0.1]} p={[0.16, 0.48, 0]} r={[-0.3, 0, -0.4]} />
        <P g="spike" c="#3a3038" s={[0.1, 0.34, 0.1]} p={[-0.16, 0.48, 0]} r={[-0.3, 0, 0.4]} />
        <P g="sphere" c={eye} e={eye} ei={3.6} s={[0.11, 0.08, 0.05]} p={[0.11, 0.24, 0.21]} />
        <P g="sphere" c={eye} e={eye} ei={3.6} s={[0.11, 0.08, 0.05]} p={[-0.11, 0.24, 0.21]} />
        <P g="box" c="#f3ead8" s={[0.22, 0.05, 0.04]} p={[0, 0.07, 0.22]} />
        <P g="cone" c={skin} s={[0.08, 0.16, 0.08]} p={[0, 0.16, 0.26]} r={[1.4, 0, 0]} />
      </>}
      upperArm={() => seg(skin, 0.13, 0.32)}
      foreArm={() => <>
        {seg(skin, 0.11, 0.32)}
        <P g="sphere" c={skin} s={0.14} p={[0, -0.34, 0]} />
      </>}
      handR={
        <group rotation={[-0.3, 0, 0]}>
          <P g="box" c="#2a2228" s={[0.14, 0.04, 0.05]} p={[0, 0, 0.06]} />
          <P g="spike" c="#c7c9d1" s={[0.1, 0.56, 0.03]} p={[0, 0, 0.36]} r={[Math.PI / 2, 0, 0]} m={0.8} ro={0.3} />
          <P g="box" c={eye} e={eye} ei={2.4} s={[0.015, 0.015, 0.4]} p={[0, 0, 0.3]} />
        </group>
      }
      thigh={() => seg(cloth, 0.16, 0.46)}
      shin={() => <>
        {seg(skin, 0.12, 0.4)}
        <P g="box" c={skin} s={[0.14, 0.08, 0.34]} p={[0, -0.43, 0.08]} />
      </>}
    />
  );
}

/* ---------- Memory Leak Demon: tall, dripping, never completing ---------- */
function Demon({ ctl, twist }: Props) {
  const body = '#1b1730', deep = '#0e0b1c', leak = '#8a6cff', eye = '#f4eeff';
  const cfg: RigCfg = { style: 'melee', size: 1.28, hunch: 0.3, tempo: 0.6, twist };
  const drip = (x: number, z: number, phase: number) => (
    <Bob speed={1.6} height={0.5} phase={phase} position={[x, -0.2, z]}>
      <P g="gem" c={leak} e={leak} ei={2.6} s={[0.05, 0.14, 0.05]} />
    </Bob>
  );
  const claws = (
    <group>
      {[-0.07, 0, 0.07].map((x) => (
        <P key={x} g="spike" c={deep} s={[0.05, 0.36, 0.05]} p={[x, -0.16, 0.04]} r={[Math.PI + 0.2, 0, x * 3]} />
      ))}
    </group>
  );
  return (
    <Humanoid
      ctl={ctl} cfg={cfg} shoulder={0.36}
      torso={<>
        <P g="taper" c={body} s={[0.44, 0.5, 0.34]} p={[0, 0.2, 0]} r={[Math.PI, 0, 0]} />
        <P g="rock" c={body} s={[0.78, 0.5, 0.5]} p={[0, 0.5, 0]} />
        <P g="sphere" c={leak} e={leak} ei={2.8} s={[0.16, 0.24, 0.08]} p={[0, 0.42, 0.24]} />
        {[[-0.2, 0.62], [0.24, 0.5], [0.05, 0.7], [-0.3, 0.4]].map(([x, y], i) => (
          <P key={i} g="shard" c={deep} s={0.22} p={[x, y, -0.2]} r={[i, i * 2, 0]} />
        ))}
        {drip(0.2, 0.1, 0)}{drip(-0.24, 0.05, 2)}{drip(0, -0.15, 4)}
      </>}
      hips={<P g="rock" c={deep} s={[0.42, 0.3, 0.34]} p={[0, -0.04, 0]} />}
      head={<>
        <P g="rock" c={body} s={[0.34, 0.42, 0.36]} p={[0, 0.14, 0.04]} />
        <P g="sphere" c={eye} e={eye} ei={4} s={[0.07, 0.07, 0.04]} p={[0.08, 0.18, 0.2]} />
        <P g="sphere" c={eye} e={eye} ei={4} s={[0.07, 0.07, 0.04]} p={[-0.08, 0.18, 0.2]} />
        <P g="box" c={leak} e={leak} ei={2} s={[0.14, 0.02, 0.02]} p={[0, 0.04, 0.2]} />
        {[-0.14, 0, 0.14].map((x, i) => (
          <P key={x} g="spike" c={deep} s={[0.08, 0.3 + i * 0.05, 0.08]} p={[x, 0.4, -0.06]} r={[-0.5, 0, -x * 2]} />
        ))}
      </>}
      upperArm={() => <>
        <P g="rock" c={body} s={0.28} />
        {seg(body, 0.13, 0.36)}
      </>}
      foreArm={() => <>
        {seg(deep, 0.11, 0.5)}
        <group position={[0, -0.18, 0]}>{claws}</group>
        {drip(0, 0, 1)}
      </>}
      handR={null}
      handL={null}
      thigh={() => seg(body, 0.17, 0.46)}
      shin={() => <>
        {seg(deep, 0.13, 0.42)}
        <P g="rock" c={deep} s={[0.2, 0.12, 0.36]} p={[0, -0.42, 0.06]} />
      </>}
      aura={<P g="disc" c={leak} e={leak} ei={1.4} o={0.35} s={[1.5, 0.01, 1.5]} p={[0, 0.02, 0]} shadow={false} />}
    />
  );
}

/* ---------- Segfault Wraith: hooded ghost of a crashed program ---------- */
function Wraith({ ctl, twist }: Props) {
  const robe = '#3a1626', deep = '#12070f', glow = '#4de8e0', red = '#ff4a5a';
  const cfg: RigCfg = { style: 'cast', float: true, size: 1.15, tempo: 0.7, twist };
  const bits = [];
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2;
    bits.push(
      <P key={i} g="box" c={i % 3 ? glow : red} e={i % 3 ? glow : red} ei={3}
        s={[0.12 + (i % 3) * 0.05, 0.025, 0.02]} p={[Math.cos(a) * 0.95, ((i * 37) % 10) * 0.16 - 0.6, Math.sin(a) * 0.95]} />,
    );
  }
  return (
    <Humanoid
      ctl={ctl} cfg={cfg} shoulder={0.32}
      skirt={<>
        <P g="cone" c={robe} s={[0.8, 1.3, 0.7]} p={[0, -0.5, 0]} />
        {[-0.24, 0, 0.24].map((x, i) => (
          <P key={x} g="spike" c={deep} s={[0.22, 0.5, 0.1]} p={[x, -1.02, 0.05 * i]} r={[Math.PI, 0, 0]} />
        ))}
      </>}
      torso={<>
        <P g="taper" c={robe} s={[0.56, 0.62, 0.4]} p={[0, 0.3, 0]} />
        <Bob speed={3} height={0.01} pulse={0.14} position={[0, 0.36, 0.2]}>
          <P g="sphere" c={glow} e={glow} ei={3.6} s={0.2} />
          <P g="torus" c={glow} e={glow} ei={2.4} s={0.34} />
        </Bob>
        <P g="flare" c={deep} s={[0.8, 0.22, 0.5]} p={[0, 0.62, 0]} />
      </>}
      back={<P g="taper" c={deep} s={[0.8, 1.5, 0.05]} p={[0, -0.2, -0.22]} r={[0.2, 0, Math.PI]} />}
      head={<>
        <P g="cone" c={robe} s={[0.5, 0.62, 0.52]} p={[0, 0.26, -0.03]} />
        <P g="sphere" c="#050308" s={[0.3, 0.32, 0.26]} p={[0, 0.14, 0.08]} />
        <P g="sphere" c={glow} e={glow} ei={4} s={[0.06, 0.04, 0.03]} p={[0.07, 0.16, 0.2]} />
        <P g="sphere" c={glow} e={glow} ei={4} s={[0.06, 0.04, 0.03]} p={[-0.07, 0.16, 0.2]} />
      </>}
      upperArm={() => <P g="flare" c={robe} s={[0.24, 0.36, 0.24]} p={[0, -0.16, 0]} />}
      foreArm={() => <>
        <P g="flare" c={robe} s={[0.32, 0.3, 0.3]} p={[0, -0.14, 0]} />
        {seg('#b9c4cc', 0.05, 0.42)}
        {[-0.05, 0, 0.05].map((x) => (
          <P key={x} g="spike" c="#b9c4cc" s={[0.03, 0.2, 0.03]} p={[x, -0.5, 0.02]} r={[Math.PI, 0, x * 4]} />
        ))}
      </>}
      aura={<Spin speed={0.7} position={[0, 1.1, 0]}>{bits}</Spin>}
    />
  );
}

/* ---------- Corrupted Compiler: a war-machine shard of the Great Compiler ---------- */
function Compiler({ ctl, twist }: Props) {
  const iron = '#55505c', dark = '#2a272e', red = '#ff2d3d';
  const metal = { m: 0.85, ro: 0.35 };
  const cfg: RigCfg = { style: 'cast', size: 1.2, hunch: 0.1, tempo: 0.5, twist };
  const gear = (
    <Spin speed={2} axis="z">
      <P g="disc" c={iron} s={[0.26, 0.05, 0.26]} r={[Math.PI / 2, 0, 0]} {...metal} />
      {[0, 1, 2, 3].map((i) => (
        <P key={i} g="box" c={iron} s={[0.36, 0.07, 0.05]} r={[0, 0, (i * Math.PI) / 4]} {...metal} />
      ))}
    </Spin>
  );
  return (
    <Humanoid
      ctl={ctl} cfg={cfg} shoulder={0.52}
      torso={<>
        <P g="box" c={iron} s={[0.7, 0.46, 0.5]} p={[0, 0.2, 0]} {...metal} />
        <P g="box" c={iron} s={[1.0, 0.4, 0.6]} p={[0, 0.54, 0]} {...metal} />
        <P g="sphere" c={red} e={red} ei={4} s={[0.2, 0.2, 0.1]} p={[0, 0.48, 0.3]} />
        <P g="torus" c={dark} s={[0.34, 0.34, 0.6]} p={[0, 0.48, 0.3]} {...metal} />
        <P g="box" c={red} e={red} ei={3} s={[0.03, 0.5, 0.02]} p={[0, 0.14, 0.26]} />
        <P g="box" c={red} e={red} ei={3} s={[0.5, 0.03, 0.02]} p={[0, 0.28, 0.26]} />
        <group position={[0.36, 0.2, 0.27]}>{gear}</group>
        <group position={[-0.36, 0.2, 0.27]}>{gear}</group>
        {[-0.3, 0, 0.3].map((x) => (
          <P key={x} g="spike" c={dark} s={[0.14, 0.4, 0.14]} p={[x, 0.86, -0.12]} {...metal} />
        ))}
      </>}
      hips={<>
        <P g="box" c={dark} s={[0.6, 0.24, 0.44]} p={[0, -0.06, 0]} {...metal} />
        <P g="box" c={red} e={red} ei={2.4} s={[0.3, 0.03, 0.02]} p={[0, -0.06, 0.23]} />
      </>}
      head={<>
        <P g="box" c={iron} s={[0.36, 0.34, 0.38]} p={[0, 0.1, 0.02]} {...metal} />
        <P g="spike" c={iron} s={[0.34, 0.3, 0.36]} p={[0, 0.4, 0.02]} {...metal} />
        <P g="box" c={red} e={red} ei={4} s={[0.28, 0.05, 0.03]} p={[0, 0.14, 0.2]} />
        <P g="box" c={red} e={red} ei={3} s={[0.03, 0.16, 0.03]} p={[0, 0.03, 0.2]} />
      </>}
      upperArm={(side) => <>
        <P g="box" c={iron} s={[0.42, 0.34, 0.44]} p={[side * 0.04, 0.04, 0]} {...metal} />
        <P g="spike" c={dark} s={[0.14, 0.4, 0.14]} p={[side * 0.1, 0.36, 0]} r={[0, 0, -side * 0.3]} {...metal} />
        {seg(dark, 0.2, 0.34, metal)}
      </>}
      foreArm={() => <>
        <P g="sphere" c={red} e={red} ei={2.4} s={0.18} />
        <P g="box" c={iron} s={[0.3, 0.4, 0.3]} p={[0, -0.24, 0]} {...metal} />
        <P g="box" c={dark} s={[0.36, 0.2, 0.36]} p={[0, -0.5, 0]} {...metal} />
        <P g="box" c={red} e={red} ei={3} s={[0.2, 0.03, 0.37]} p={[0, -0.5, 0]} />
      </>}
      thigh={() => <P g="box" c={dark} s={[0.26, 0.46, 0.28]} p={[0, -0.23, 0]} {...metal} />}
      shin={() => <>
        <P g="sphere" c={red} e={red} ei={2.4} s={0.16} />
        <P g="box" c={iron} s={[0.3, 0.4, 0.32]} p={[0, -0.22, 0]} {...metal} />
        <P g="box" c={dark} s={[0.34, 0.1, 0.46]} p={[0, -0.43, 0.06]} {...metal} />
      </>}
      aura={<>
        <Spin speed={1.1} position={[0, 1.45, 0]} rotation={[0.5, 0, 0.2]}>
          <P g="ring" c={red} e={red} ei={3} s={2.5} r={[Math.PI / 2, 0, 0]} />
          <P g="gem" c={red} e={red} ei={3} s={0.12} p={[1.25, 0, 0]} />
        </Spin>
        <Spin speed={-0.8} position={[0, 1.45, 0]} rotation={[-0.4, 0, -0.3]}>
          <P g="ring" c={red} e={red} ei={3} s={2.9} r={[Math.PI / 2, 0, 0]} />
          <P g="gem" c={red} e={red} ei={3} s={0.12} p={[-1.45, 0, 0]} />
        </Spin>
      </>}
    />
  );
}

/* ---------- Null Pointer Wolf: spectral, icy, four-legged ---------- */
function Wolf({ ctl, twist = 0 }: Props) {
  const fur = '#5d8fc4', pale = '#a9d4f5', deep = '#274a78', glow = '#9be4ff';
  const root = useRef<Group>(null);
  const body = useRef<Group>(null);
  const head = useRef<Group>(null);
  const tail = useRef<Group>(null);
  const legs = useRef<(Group | null)[]>([]);

  useFrame((_, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const time = now();
    const length = DURATION[ctl.state];
    if (length !== undefined && time - ctl.t0 > length) { ctl.state = ctl.rest; ctl.t0 = time; }
    const t = time - ctl.t0;
    const breathe = Math.sin(time * 2.4);
    let z = 0, y = breathe * 0.015, pitch = 0, fall = 0, scale = 1, headX = 0.1 + breathe * 0.03, headY = Math.sin(time * 0.8) * 0.2;
    let front = 0, rear = 0, tailX = 0.5 + breathe * 0.1;
    const tailY = Math.sin(time * 5) * 0.25;

    switch (ctl.state) {
      case 'attack':
      case 'cast':
        z = kf(t, [[0, 0], [0.12, -0.3], [0.42, ctl.reach], [0.6, ctl.reach], [1.0, 0]]);
        y += kf(t, [[0, 0], [0.12, -0.12], [0.3, 0.9], [0.45, 0.25], [0.6, 0], [0.8, 0.3], [1.0, 0]]);
        pitch = kf(t, [[0, 0], [0.12, 0.2], [0.3, -0.55], [0.45, 0.35], [0.6, 0], [1.0, 0]]);
        front = kf(t, [[0, 0], [0.3, -1.2], [0.46, 0.4], [1.0, 0]]);
        rear = kf(t, [[0, 0], [0.3, 0.9], [0.6, 0], [1.0, 0]]);
        headX = kf(t, [[0, 0.1], [0.3, -0.4], [0.46, 0.5], [1.0, 0.1]]);
        headY = 0;
        break;
      case 'hit': {
        const k = kf(t, [[0, 0], [0.08, 1], [0.55, 0]]);
        z = -0.5 * k; pitch = -0.3 * k; headX = -0.5 * k; scale = 1 - 0.06 * k; tailX = -0.4 * k;
        break;
      }
      case 'death': {
        const k = kf(t, [[0, 0], [0.6, 1]]);
        fall = 1.5 * k; y = Math.sin(k * Math.PI) * 0.2; z = -0.3 * k;
        front = -0.6 * k; rear = 0.6 * k;
        scale = kf(t, [[0, 1], [0.75, 1], [1.5, 0.001]]);
        break;
      }
      case 'spawn':
        scale = kf(t, [[0, 0.001], [0.5, 1.12], [0.85, 1]]);
        y += kf(t, [[0, -0.6], [0.5, 0.2], [0.85, 0]]);
        headX = kf(t, [[0, -0.9], [0.85, 0.1]]);
        break;
      case 'victory':
        headX = -0.9 + Math.sin(t * 3) * 0.05; headY = 0; pitch = -0.2;
        break;
      default:
        break;
    }

    const r = root.current;
    if (r) {
      r.position.z = damp(r.position.z, z, 26, dt);
      r.position.y = damp(r.position.y, y, 22, dt);
      r.rotation.z = damp(r.rotation.z, fall, 12, dt);
      r.scale.setScalar(Math.max(damp(r.scale.x, scale, 18, dt), 0.0001));
    }
    if (body.current) body.current.rotation.x = damp(body.current.rotation.x, pitch, 20, dt);
    if (head.current) {
      head.current.rotation.x = damp(head.current.rotation.x, headX, 20, dt);
      head.current.rotation.y = damp(head.current.rotation.y, headY, 8, dt);
    }
    if (tail.current) {
      tail.current.rotation.x = damp(tail.current.rotation.x, tailX, 14, dt);
      tail.current.rotation.y = tailY;
    }
    legs.current.forEach((leg, i) => {
      if (leg) leg.rotation.x = damp(leg.rotation.x, i < 2 ? front : rear, 20, dt);
    });
  });

  const leg = (i: number, x: number, z: number) => (
    <group key={i} ref={(g) => { legs.current[i] = g; }} position={[x, 0, z]}>
      <P g="taper" c={fur} s={[0.17, 0.4, 0.2]} p={[0, -0.2, 0]} r={[Math.PI, 0, 0]} />
      <P g="cyl" c={deep} s={[0.09, 0.34, 0.09]} p={[0, -0.52, 0.02]} />
      <P g="sphere" c={pale} s={[0.14, 0.09, 0.2]} p={[0, -0.7, 0.05]} />
    </group>
  );

  return (
    <group ref={root}>
      <group rotation={[0, twist, 0]}>
        <group ref={body} position={[0, 0.76, 0]}>
          <P g="capsule" c={fur} s={[0.42, 0.42, 0.4]} r={[Math.PI / 2, 0, 0]} />
          <P g="sphere" c={pale} s={[0.5, 0.52, 0.56]} p={[0, 0.04, 0.34]} />
          {[0.36, 0.16, -0.06, -0.28].map((zz, i) => (
            <P key={zz} g="spike" c={glow} e={glow} ei={2.2} s={[0.1, 0.34 - i * 0.04, 0.1]} p={[0, 0.3, zz]} r={[-0.5, 0, 0]} />
          ))}
          <P g="shard" c={pale} s={0.3} p={[0.2, 0.14, 0.4]} r={[1, 0, 2]} />
          <P g="shard" c={pale} s={0.3} p={[-0.2, 0.14, 0.4]} r={[2, 1, 0]} />
          {leg(0, 0.17, 0.36)}{leg(1, -0.17, 0.36)}{leg(2, 0.17, -0.42)}{leg(3, -0.17, -0.42)}
          <group ref={head} position={[0, 0.22, 0.62]}>
            <P g="sphere" c={fur} s={[0.36, 0.34, 0.36]} p={[0, 0.06, 0.06]} />
            <P g="taper" c={pale} s={[0.2, 0.3, 0.18]} p={[0, 0, 0.3]} r={[Math.PI / 2, 0, 0]} />
            <P g="sphere" c="#0e1a2a" s={0.07} p={[0, 0.02, 0.46]} />
            <P g="spike" c={fur} s={[0.12, 0.26, 0.06]} p={[0.12, 0.3, 0]} r={[0, 0, -0.2]} />
            <P g="spike" c={fur} s={[0.12, 0.26, 0.06]} p={[-0.12, 0.3, 0]} r={[0, 0, 0.2]} />
            <P g="sphere" c="#ffffff" e={glow} ei={4} s={[0.07, 0.04, 0.04]} p={[0.1, 0.12, 0.2]} />
            <P g="sphere" c="#ffffff" e={glow} ei={4} s={[0.07, 0.04, 0.04]} p={[-0.1, 0.12, 0.2]} />
            <P g="spike" c="#ffffff" s={[0.03, 0.09, 0.03]} p={[0.05, -0.08, 0.36]} r={[Math.PI, 0, 0]} />
            <P g="spike" c="#ffffff" s={[0.03, 0.09, 0.03]} p={[-0.05, -0.08, 0.36]} r={[Math.PI, 0, 0]} />
          </group>
          <group ref={tail} position={[0, 0.1, -0.62]}>
            <P g="cone" c={fur} s={[0.2, 0.66, 0.2]} p={[0, 0, -0.3]} r={[-Math.PI / 2, 0, 0]} />
            <P g="cone" c={glow} e={glow} ei={2} s={[0.12, 0.3, 0.12]} p={[0, 0, -0.58]} r={[-Math.PI / 2, 0, 0]} />
          </group>
        </group>
        <P g="disc" c={glow} e={glow} ei={1.2} o={0.3} s={[1.6, 0.01, 1.6]} p={[0, 0.02, 0]} shadow={false} />
      </group>
    </group>
  );
}

export function MonsterModel({ monster, ctl, twist = 0 }: { monster: MonsterKey; ctl: Ctl; twist?: number }) {
  switch (monster) {
    case 'goblin': return <Goblin ctl={ctl} twist={twist} />;
    case 'wolf': return <Wolf ctl={ctl} twist={twist} />;
    case 'demon': return <Demon ctl={ctl} twist={twist} />;
    case 'wraith': return <Wraith ctl={ctl} twist={twist} />;
    default: return <Compiler ctl={ctl} twist={twist} />;
  }
}

/** How each monster strikes: `shot` monsters fire a bolt, the rest charge in. */
export const MONSTER_SHOT: Partial<Record<MonsterKey, string>> = {
  wraith: '#4de8e0',
  compiler: '#ff2d3d',
};
