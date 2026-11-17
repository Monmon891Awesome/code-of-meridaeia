// The six playable characters, sculpted from simple shapes to echo their
// portraits. Each one plugs its body parts into the shared Humanoid rig.
import type { ReactNode } from 'react';
import type { HeroKey } from '../data';
import { Humanoid, type RigCfg } from './Humanoid';
import { Bob, P, Spin, type Ctl } from './kit';

type Side = 1 | -1;

/** A limb segment hanging down from its joint. */
export function seg(c: string, w: number, len: number, opts: Record<string, unknown> = {}) {
  return <P g="cyl" c={c} s={[w, len, w]} p={[0, -len / 2, 0]} {...opts} />;
}

const joint = (c: string, w: number, opts: Record<string, unknown> = {}) => <P g="sphere" c={c} s={w} {...opts} />;

interface HeroProps { ctl: Ctl; twist?: number }

/* ---------- Grom: orc barbarian, dark plate, glowing great-axe ---------- */
function Grom({ ctl, twist }: HeroProps) {
  const skin = '#5c9442', plate = '#434152', trim = '#a83a32', fur = '#8a7f72';
  const cfg: RigCfg = { style: 'melee', size: 1.12, hunch: 0.12, tempo: 0.9, twist };
  return (
    <Humanoid
      ctl={ctl} cfg={cfg} shoulder={0.43}
      torso={<>
        <P g="taper" c={plate} s={[0.72, 0.5, 0.48]} p={[0, 0.2, 0]} m={0.5} ro={0.5} />
        <P g="flare" c={plate} s={[0.82, 0.34, 0.54]} p={[0, 0.5, 0]} m={0.5} ro={0.5} />
        <P g="box" c={trim} s={[0.5, 0.06, 0.5]} p={[0, 0.02, 0]} />
        <P g="gem" c="#ff8a3c" e="#ff6a1c" ei={2.2} s={[0.14, 0.18, 0.08]} p={[0, 0.42, 0.27]} />
        <P g="sphere" c={fur} s={[0.98, 0.3, 0.62]} p={[0, 0.66, -0.02]} ro={1} />
        <P g="spike" c="#c9c2b4" s={[0.1, 0.3, 0.1]} p={[0.5, 0.74, 0]} r={[0, 0, -0.7]} />
        <P g="spike" c="#c9c2b4" s={[0.1, 0.3, 0.1]} p={[-0.5, 0.74, 0]} r={[0, 0, 0.7]} />
      </>}
      hips={<>
        <P g="cyl" c={plate} s={[0.56, 0.2, 0.42]} p={[0, -0.04, 0]} m={0.4} />
        <P g="box" c={trim} s={[0.22, 0.42, 0.06]} p={[0, -0.26, 0.2]} />
        <P g="box" c={fur} s={[0.5, 0.36, 0.06]} p={[0, -0.24, -0.2]} ro={1} />
      </>}
      head={<>
        <P g="sphere" c={skin} s={[0.38, 0.42, 0.4]} p={[0, 0.16, 0]} />
        <P g="box" c={skin} s={[0.3, 0.14, 0.2]} p={[0, 0.04, 0.14]} />
        <P g="spike" c="#efe6cf" s={[0.05, 0.14, 0.05]} p={[0.1, 0.1, 0.24]} />
        <P g="spike" c="#efe6cf" s={[0.05, 0.14, 0.05]} p={[-0.1, 0.1, 0.24]} />
        <P g="box" c="#1b1a20" s={[0.34, 0.05, 0.1]} p={[0, 0.24, 0.17]} />
        <P g="sphere" c="#ffd76a" e="#ffb020" ei={2.5} s={0.05} p={[0.08, 0.2, 0.2]} />
        <P g="sphere" c="#ffd76a" e="#ffb020" ei={2.5} s={0.05} p={[-0.08, 0.2, 0.2]} />
        <P g="sphere" c="#1b1a20" s={[0.4, 0.3, 0.42]} p={[0, 0.28, -0.06]} />
        <P g="cyl" c="#1b1a20" s={[0.08, 0.34, 0.08]} p={[0, 0.2, -0.26]} r={[0.5, 0, 0]} />
      </>}
      upperArm={() => <>
        <P g="sphere" c={plate} s={[0.34, 0.3, 0.34]} m={0.5} ro={0.5} />
        <P g="spike" c={trim} s={[0.1, 0.22, 0.1]} p={[0, 0.18, 0]} />
        {seg(skin, 0.19, 0.32)}
      </>}
      foreArm={() => <>
        {joint(skin, 0.19)}
        {seg(plate, 0.2, 0.3, { m: 0.5 })}
        <P g="sphere" c={skin} s={0.17} p={[0, -0.34, 0]} />
      </>}
      handR={
        <group rotation={[-0.25, 0, 0]}>
          <P g="cyl" c="#4a3524" s={[0.05, 1.5, 0.05]} p={[0, 0, 0.35]} r={[Math.PI / 2, 0, 0]} />
          <group position={[0, 0, 0.95]}>
            <P g="axe" c="#ff8a3c" e="#ff5a10" ei={2.4} s={[0.7, 0.7, 0.5]} r={[0, -Math.PI / 2, 0]} />
            <P g="axe" c="#555766" s={[0.62, 0.62, 1.3]} r={[0, -Math.PI / 2, 0]} m={0.85} ro={0.3} />
            <P g="box" c="#2b2a33" s={[0.12, 0.2, 0.24]} m={0.6} />
            <P g="spike" c="#3a3a44" s={[0.08, 0.2, 0.08]} p={[0, 0, 0.26]} r={[Math.PI / 2, 0, 0]} m={0.8} />
          </group>
        </group>
      }
      thigh={() => seg(plate, 0.22, 0.46, { m: 0.4 })}
      shin={() => <>
        {joint(trim, 0.2)}
        {seg(plate, 0.19, 0.4, { m: 0.4 })}
        <P g="box" c="#1b1a20" s={[0.2, 0.1, 0.34]} p={[0, -0.43, 0.06]} />
      </>}
    />
  );
}

/* ---------- Malloc: horned void wizard, cyan flame in each palm ---------- */
function Malloc({ ctl, twist }: HeroProps) {
  const robe = '#563a94', dark = '#2a1f48', glow = '#4de8e0';
  const cfg: RigCfg = { style: 'cast', float: true, size: 1.05, tempo: 0.8, twist };
  const flame = (
    <Bob speed={5} height={0.03} pulse={0.18}>
      <P g="gem" c={glow} e={glow} ei={3.2} s={[0.16, 0.26, 0.16]} p={[0, -0.12, 0.05]} />
      <P g="sphere" c={glow} e={glow} ei={1.5} o={0.3} s={0.34} p={[0, -0.1, 0.05]} />
    </Bob>
  );
  return (
    <Humanoid
      ctl={ctl} cfg={cfg}
      skirt={<>
        <P g="cone" c={robe} s={[0.95, 1.15, 0.85]} p={[0, -0.45, 0]} />
        <P g="cone" c={dark} s={[0.6, 1.0, 0.5]} p={[0, -0.44, 0.14]} />
        <P g="torus" c={glow} e={glow} ei={2} s={[0.9, 0.9, 0.5]} p={[0, -0.96, 0]} r={[Math.PI / 2, 0, 0]} o={0.8} />
      </>}
      torso={<>
        <P g="taper" c={robe} s={[0.6, 0.62, 0.42]} p={[0, 0.3, 0]} />
        <P g="box" c={dark} s={[0.18, 0.6, 0.06]} p={[0, 0.3, 0.2]} />
        <P g="gem" c={glow} e={glow} ei={3} s={[0.12, 0.16, 0.06]} p={[0, 0.46, 0.23]} />
        <P g="cyl" c="#7a5cc0" s={[0.6, 0.07, 0.44]} p={[0, 0.03, 0]} />
        <P g="flare" c={dark} s={[0.9, 0.2, 0.5]} p={[0, 0.6, 0]} />
        <P g="spike" c={dark} s={[0.2, 0.42, 0.2]} p={[0.46, 0.72, 0]} r={[0, 0, -0.5]} />
        <P g="spike" c={dark} s={[0.2, 0.42, 0.2]} p={[-0.46, 0.72, 0]} r={[0, 0, 0.5]} />
      </>}
      back={<P g="box" c={dark} s={[0.66, 1.3, 0.05]} p={[0, -0.05, -0.24]} r={[0.12, 0, 0]} />}
      head={<>
        <P g="sphere" c="#15101f" s={[0.36, 0.42, 0.38]} p={[0, 0.17, 0]} m={0.6} ro={0.4} />
        <P g="box" c="#0a0810" s={[0.06, 0.26, 0.06]} p={[0, 0.14, 0.18]} />
        <P g="box" c={glow} e={glow} ei={3.5} s={[0.09, 0.03, 0.03]} p={[0.09, 0.2, 0.185]} r={[0, 0, 0.3]} />
        <P g="box" c={glow} e={glow} ei={3.5} s={[0.09, 0.03, 0.03]} p={[-0.09, 0.2, 0.185]} r={[0, 0, -0.3]} />
        <P g="spike" c="#2a2140" s={[0.1, 0.46, 0.1]} p={[0.2, 0.44, 0]} r={[0, 0, -0.45]} m={0.5} />
        <P g="spike" c="#2a2140" s={[0.1, 0.46, 0.1]} p={[-0.2, 0.44, 0]} r={[0, 0, 0.45]} m={0.5} />
        <P g="spike" c="#2a2140" s={[0.08, 0.3, 0.08]} p={[0, 0.46, 0]} m={0.5} />
      </>}
      upperArm={() => <>
        {joint(robe, 0.24)}
        {seg(robe, 0.2, 0.34)}
      </>}
      foreArm={() => <>
        <P g="flare" c={robe} s={[0.3, 0.34, 0.3]} p={[0, -0.17, 0]} />
        <P g="sphere" c="#c9b8e8" s={0.12} p={[0, -0.36, 0]} />
      </>}
      handR={flame}
      handL={flame}
      aura={
        <Spin speed={0.9} position={[0, 0.5, 0]} rotation={[0.25, 0, 0.1]}>
          <P g="ring" c="#3dff8a" e="#3dff8a" ei={2.6} s={1.9} r={[Math.PI / 2, 0, 0]} />
          <P g="box" c="#3dff8a" e="#3dff8a" ei={3} s={[0.1, 0.04, 0.02]} p={[0.95, 0, 0]} />
          <P g="box" c="#3dff8a" e="#3dff8a" ei={3} s={[0.1, 0.04, 0.02]} p={[-0.95, 0, 0]} />
        </Spin>
      }
    />
  );
}

/* ---------- Ser Handshake: silver-gold paladin, round shield, light blade ---------- */
function Handshake({ ctl, twist }: HeroProps) {
  const steel = '#c9ced6', gold = '#d6a83c', cloth = '#e9dfc8', glow = '#7fd4ff';
  const metal = { m: 0.85, ro: 0.3 };
  const cfg: RigCfg = { style: 'melee', size: 1.1, tempo: 0.75, twist };
  return (
    <Humanoid
      ctl={ctl} cfg={cfg} shoulder={0.41}
      torso={<>
        <P g="taper" c={steel} s={[0.66, 0.5, 0.46]} p={[0, 0.2, 0]} {...metal} />
        <P g="flare" c={steel} s={[0.74, 0.3, 0.5]} p={[0, 0.5, 0]} {...metal} />
        <P g="box" c={gold} s={[0.1, 0.6, 0.06]} p={[0, 0.34, 0.24]} {...metal} />
        <P g="box" c={gold} s={[0.4, 0.1, 0.06]} p={[0, 0.46, 0.25]} {...metal} />
        <P g="cyl" c={gold} s={[0.6, 0.08, 0.46]} p={[0, 0.0, 0]} {...metal} />
        <P g="sphere" c="#efe9dd" s={[0.92, 0.28, 0.6]} p={[0, 0.68, -0.04]} ro={1} />
      </>}
      back={<P g="box" c={cloth} s={[0.74, 1.4, 0.05]} p={[0, -0.1, -0.27]} r={[0.14, 0, 0]} />}
      hips={<>
        <P g="box" c={cloth} s={[0.3, 0.6, 0.05]} p={[0, -0.32, 0.2]} />
        <P g="box" c={gold} s={[0.3, 0.06, 0.06]} p={[0, -0.6, 0.2]} {...metal} />
        <P g="flare" c={steel} s={[0.62, 0.26, 0.46]} p={[0, -0.12, 0]} {...metal} />
      </>}
      head={<>
        <P g="cyl" c={steel} s={[0.36, 0.36, 0.38]} p={[0, 0.14, 0]} {...metal} />
        <P g="sphere" c={steel} s={[0.37, 0.3, 0.39]} p={[0, 0.3, 0]} {...metal} />
        <P g="box" c="#11151c" s={[0.26, 0.04, 0.06]} p={[0, 0.2, 0.17]} />
        <P g="box" c={glow} e={glow} ei={2.5} s={[0.22, 0.015, 0.02]} p={[0, 0.2, 0.2]} />
        <P g="box" c={gold} s={[0.05, 0.34, 0.06]} p={[0, 0.2, 0.19]} {...metal} />
        <P g="spike" c={gold} s={[0.08, 0.26, 0.08]} p={[0, 0.54, 0]} {...metal} />
        <P g="spike" c={gold} s={[0.07, 0.2, 0.07]} p={[0.16, 0.46, 0]} r={[0, 0, -0.5]} {...metal} />
        <P g="spike" c={gold} s={[0.07, 0.2, 0.07]} p={[-0.16, 0.46, 0]} r={[0, 0, 0.5]} {...metal} />
      </>}
      upperArm={() => <>
        <P g="sphere" c={steel} s={[0.34, 0.3, 0.36]} {...metal} />
        <P g="torus" c={gold} s={[0.34, 0.34, 0.5]} r={[Math.PI / 2, 0, 0]} p={[0, -0.06, 0]} {...metal} />
        {seg(steel, 0.18, 0.32, metal)}
      </>}
      foreArm={() => <>
        {joint(gold, 0.19, metal)}
        {seg(steel, 0.19, 0.3, metal)}
        <P g="sphere" c={steel} s={0.17} p={[0, -0.34, 0]} {...metal} />
      </>}
      handR={
        <group rotation={[-0.3, 0, 0]}>
          <P g="cyl" c={gold} s={[0.05, 0.26, 0.05]} p={[0, 0, -0.02]} r={[Math.PI / 2, 0, 0]} {...metal} />
          <P g="box" c={gold} s={[0.34, 0.06, 0.08]} p={[0, 0, 0.14]} {...metal} />
          <P g="box" c="#dff4ff" e={glow} ei={2.4} s={[0.1, 0.03, 1.15]} p={[0, 0, 0.75]} />
          <P g="spike" c="#dff4ff" e={glow} ei={2.4} s={[0.1, 0.2, 0.03]} p={[0, 0, 1.42]} r={[Math.PI / 2, 0, 0]} />
        </group>
      }
      handL={
        <group position={[0.1, 0.1, 0.06]} rotation={[0, 1.2, 0]}>
          <P g="disc" c={steel} s={[0.8, 0.06, 0.8]} r={[Math.PI / 2, 0, 0]} {...metal} />
          <P g="torus" c={gold} s={[0.8, 0.8, 0.8]} {...metal} />
          <P g="torus" c={glow} e={glow} ei={2.2} s={[0.5, 0.5, 0.4]} p={[0, 0, 0.04]} />
          <P g="sphere" c={gold} s={[0.2, 0.2, 0.12]} p={[0, 0, 0.05]} {...metal} />
        </group>
      }
      thigh={() => seg(steel, 0.21, 0.46, metal)}
      shin={() => <>
        {joint(gold, 0.2, metal)}
        {seg(steel, 0.18, 0.4, metal)}
        <P g="box" c={steel} s={[0.19, 0.1, 0.34]} p={[0, -0.43, 0.06]} {...metal} />
      </>}
    />
  );
}

/* ---------- Artemis: visored archer with a bow of violet light ---------- */
function Artemis({ ctl, twist }: HeroProps) {
  const armor = '#34344a', trim = '#6a6390', skin = '#e2c2a8', glow = '#b07cff', hair = '#101018';
  const cfg: RigCfg = { style: 'bow', size: 1.0, tempo: 1.0, twist };
  const metal = { m: 0.6, ro: 0.4 };
  return (
    <Humanoid
      ctl={ctl} cfg={cfg} shoulder={0.3}
      torso={<>
        <P g="taper" c={armor} s={[0.46, 0.34, 0.34]} p={[0, 0.14, 0]} {...metal} />
        <P g="flare" c={armor} s={[0.54, 0.34, 0.38]} p={[0, 0.46, 0]} {...metal} />
        <P g="gem" c={glow} e={glow} ei={2.6} s={[0.1, 0.14, 0.06]} p={[0, 0.44, 0.2]} />
        <P g="cyl" c={trim} s={[0.46, 0.07, 0.36]} p={[0, 0.0, 0]} />
        <group position={[0.14, 0.4, -0.22]} rotation={[0, 0, -0.4]}>
          <P g="cyl" c="#3a2c22" s={[0.13, 0.5, 0.13]} />
          <P g="box" c={glow} e={glow} ei={2.4} s={[0.02, 0.2, 0.02]} p={[0.03, 0.34, 0]} />
          <P g="box" c={glow} e={glow} ei={2.4} s={[0.02, 0.2, 0.02]} p={[-0.03, 0.32, 0.02]} />
        </group>
      </>}
      hips={<>
        <P g="flare" c={armor} s={[0.5, 0.2, 0.38]} p={[0, -0.08, 0]} {...metal} />
        <P g="box" c={trim} s={[0.14, 0.4, 0.04]} p={[0.22, -0.3, 0.02]} r={[0, 0, 0.12]} />
        <P g="box" c={trim} s={[0.14, 0.4, 0.04]} p={[-0.22, -0.3, 0.02]} r={[0, 0, -0.12]} />
      </>}
      head={<>
        <P g="sphere" c={skin} s={[0.3, 0.36, 0.32]} p={[0, 0.16, 0]} flat={false} />
        <P g="sphere" c={hair} s={[0.36, 0.36, 0.38]} p={[0, 0.22, -0.05]} />
        <P g="taper" c={hair} s={[0.3, 0.75, 0.14]} p={[0, -0.16, -0.17]} r={[0.12, 0, 0]} />
        <P g="box" c="#ffffff" e="#e8f4ff" ei={3.5} s={[0.3, 0.06, 0.06]} p={[0, 0.2, 0.14]} />
        <P g="box" c={glow} e={glow} ei={2} s={[0.34, 0.02, 0.08]} p={[0, 0.25, 0.13]} />
      </>}
      upperArm={() => <>
        <P g="sphere" c={armor} s={[0.24, 0.22, 0.24]} {...metal} />
        {seg(armor, 0.13, 0.32, metal)}
      </>}
      foreArm={() => <>
        {joint(trim, 0.14)}
        {seg(armor, 0.13, 0.3, metal)}
        <P g="sphere" c={skin} s={0.12} p={[0, -0.34, 0]} />
      </>}
      handL={
        <group position={[0, 0, 0.04]} rotation={[0.1, 0, 0]}>
          <P g="torus" c={glow} e={glow} ei={2.8} s={[1.5, 1.5, 0.7]} p={[0, 0, -0.6]} r={[0, Math.PI / 2, 0]} />
          <P g="box" c="#f0e4ff" e={glow} ei={2} s={[0.012, 1.4, 0.012]} p={[0, 0, -0.34]} />
          <P g="gem" c="#f0e4ff" e={glow} ei={3} s={[0.07, 0.14, 0.07]} p={[0, 0.72, -0.3]} />
          <P g="gem" c="#f0e4ff" e={glow} ei={3} s={[0.07, 0.14, 0.07]} p={[0, -0.72, -0.3]} />
        </group>
      }
      thigh={() => seg(armor, 0.17, 0.46, metal)}
      shin={() => <>
        {joint(trim, 0.16)}
        {seg(armor, 0.14, 0.4, metal)}
        <P g="box" c={armor} s={[0.14, 0.09, 0.3]} p={[0, -0.43, 0.05]} />
      </>}
    />
  );
}

/* ---------- Vulkun: dragonoid of black rock and living lava ---------- */
function Vulkun({ ctl, twist }: HeroProps) {
  const rock = '#3a343f', dark = '#221f27', lava = '#ff6a1c', eye = '#ffd23c';
  const cfg: RigCfg = { style: 'melee', size: 1.2, hunch: 0.22, tempo: 0.7, twist };
  const crack = (p: [number, number, number], s: [number, number, number], r: [number, number, number] = [0, 0, 0]) =>
    <P g="box" c={lava} e={lava} ei={3} s={s} p={p} r={r} />;
  const claws = (
    <group position={[0, -0.02, 0.04]}>
      {[-0.07, 0, 0.07].map((x) => (
        <P key={x} g="spike" c="#0d0c10" s={[0.06, 0.26, 0.06]} p={[x, -0.1, 0.08]} r={[2.4, 0, 0]} />
      ))}
      <P g="sphere" c={lava} e={lava} ei={2} s={0.1} p={[0, 0, 0]} />
    </group>
  );
  return (
    <Humanoid
      ctl={ctl} cfg={cfg} shoulder={0.46}
      torso={<>
        <P g="rock" c={rock} s={[0.8, 0.62, 0.6]} p={[0, 0.2, 0]} />
        <P g="rock" c={rock} s={[0.98, 0.56, 0.66]} p={[0, 0.52, 0]} r={[0, 0.6, 0]} />
        <P g="gem" c={lava} e="#ff4a10" ei={2.6} s={[0.18, 0.24, 0.1]} p={[0, 0.44, 0.31]} />
        {crack([0.16, 0.24, 0.3], [0.03, 0.3, 0.03], [0, 0, 0.5])}
        {crack([-0.16, 0.24, 0.3], [0.03, 0.3, 0.03], [0, 0, -0.5])}
        {crack([0, 0.1, 0.29], [0.03, 0.22, 0.03])}
        {[0.2, 0.42, 0.62].map((y, i) => (
          <P key={y} g="spike" c={dark} s={[0.14, 0.4 - i * 0.05, 0.14]} p={[0, y, -0.34]} r={[-1.1, 0, 0]} />
        ))}
      </>}
      hips={<>
        <P g="rock" c={rock} s={[0.62, 0.36, 0.5]} p={[0, -0.06, 0]} />
        <group position={[0, -0.1, -0.24]} rotation={[-0.9, 0, 0]}>
          <P g="taper" c={rock} s={[0.26, 0.6, 0.26]} p={[0, -0.3, 0]} r={[Math.PI, 0, 0]} />
          <group position={[0, -0.58, 0]} rotation={[-0.5, 0, 0]}>
            <P g="cone" c={dark} s={[0.18, 0.6, 0.18]} p={[0, -0.28, 0]} r={[Math.PI, 0, 0]} />
            {crack([0, -0.2, 0.08], [0.03, 0.26, 0.03])}
          </group>
        </group>
      </>}
      head={<>
        <P g="rock" c={rock} s={[0.4, 0.38, 0.44]} p={[0, 0.16, 0.02]} />
        <P g="box" c={dark} s={[0.26, 0.18, 0.34]} p={[0, 0.08, 0.26]} />
        <P g="box" c={lava} e={lava} ei={3} s={[0.2, 0.03, 0.26]} p={[0, 0.0, 0.3]} />
        <P g="sphere" c={eye} e={eye} ei={3.6} s={[0.08, 0.05, 0.05]} p={[0.11, 0.22, 0.2]} />
        <P g="sphere" c={eye} e={eye} ei={3.6} s={[0.08, 0.05, 0.05]} p={[-0.11, 0.22, 0.2]} />
        <P g="spike" c={dark} s={[0.1, 0.44, 0.1]} p={[0.17, 0.4, -0.1]} r={[-0.7, 0, -0.35]} />
        <P g="spike" c={dark} s={[0.1, 0.44, 0.1]} p={[-0.17, 0.4, -0.1]} r={[-0.7, 0, 0.35]} />
        <P g="spike" c={dark} s={[0.08, 0.26, 0.08]} p={[0, 0.4, -0.02]} r={[-0.5, 0, 0]} />
      </>}
      upperArm={(side: Side) => <>
        <P g="rock" c={rock} s={[0.4, 0.36, 0.4]} />
        <P g="spike" c={dark} s={[0.12, 0.34, 0.12]} p={[side * 0.08, 0.22, 0]} r={[0, 0, -side * 0.5]} />
        {seg(rock, 0.22, 0.34)}
        {crack([0, -0.16, 0.11], [0.03, 0.2, 0.03])}
      </>}
      foreArm={() => <>
        {joint(lava, 0.16, { e: lava, ei: 2 })}
        <P g="flare" c={rock} s={[0.2, 0.32, 0.2]} p={[0, -0.16, 0]} r={[Math.PI, 0, 0]} />
        <P g="rock" c={dark} s={0.26} p={[0, -0.34, 0]} />
      </>}
      handR={claws}
      handL={claws}
      thigh={() => <P g="taper" c={rock} s={[0.3, 0.46, 0.3]} p={[0, -0.23, 0]} r={[Math.PI, 0, 0]} />}
      shin={() => <>
        {joint(lava, 0.17, { e: lava, ei: 2 })}
        {seg(rock, 0.2, 0.4)}
        <P g="rock" c={dark} s={[0.28, 0.16, 0.42]} p={[0, -0.42, 0.08]} />
      </>}
    />
  );
}

/* ---------- Marakathalessa: the witch — playable when redeemed, vast as the boss ---------- */
export function Mara({ ctl, twist, boss = false }: HeroProps & { boss?: boolean }) {
  const gown = boss ? '#2a1246' : '#4a2a7a', dark = '#160a26', skin = '#b9a2e0';
  const glow = boss ? '#d264ff' : '#e9a8ff';
  const cfg: RigCfg = { style: 'cast', float: true, size: boss ? 1.45 : 1.05, tempo: 0.7, twist };
  const orb = (
    <Bob speed={4} height={0.03} pulse={0.2}>
      <P g="sphere" c={glow} e={glow} ei={3.4} s={0.18} p={[0, -0.12, 0.04]} />
      <P g="sphere" c={glow} e={glow} ei={1.4} o={0.28} s={0.4} p={[0, -0.12, 0.04]} />
    </Bob>
  );
  const runes: ReactNode[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    runes.push(
      <P key={i} g={i % 2 ? 'gem' : 'box'} c={glow} e={glow} ei={3}
        s={i % 2 ? [0.1, 0.18, 0.04] : [0.05, 0.2, 0.02]} p={[Math.cos(a) * 1.05, Math.sin(a * 2) * 0.15, Math.sin(a) * 1.05]} />,
    );
  }
  return (
    <Humanoid
      ctl={ctl} cfg={cfg} shoulder={0.3}
      skirt={<>
        <P g="cone" c={gown} s={[1.1, 1.3, 1.0]} p={[0, -0.5, 0]} />
        <P g="cone" c={dark} s={[0.7, 1.2, 0.6]} p={[0, -0.5, 0.16]} />
        <P g="cone" c={gown} s={[1.3, 0.5, 1.2]} p={[0, -0.95, -0.05]} o={0.85} />
      </>}
      torso={<>
        <P g="taper" c={gown} s={[0.44, 0.36, 0.32]} p={[0, 0.16, 0]} />
        <P g="flare" c={gown} s={[0.5, 0.3, 0.34]} p={[0, 0.46, 0]} />
        <P g="box" c={glow} e={glow} ei={2.4} s={[0.03, 0.5, 0.03]} p={[0, 0.3, 0.17]} />
        <P g="gem" c={glow} e={glow} ei={3.2} s={[0.12, 0.16, 0.06]} p={[0, 0.5, 0.19]} />
        <P g="spike" c={dark} s={[0.16, 0.5, 0.16]} p={[0.36, 0.66, -0.04]} r={[0, 0, -0.9]} />
        <P g="spike" c={dark} s={[0.16, 0.5, 0.16]} p={[-0.36, 0.66, -0.04]} r={[0, 0, 0.9]} />
      </>}
      back={<P g="taper" c={dark} s={[0.9, 1.5, 0.06]} p={[0, -0.2, -0.22]} r={[0.16, 0, Math.PI]} />}
      head={<>
        <P g="sphere" c={skin} s={[0.28, 0.34, 0.3]} p={[0, 0.16, 0]} flat={false} />
        <P g="sphere" c="#1d0f33" s={[0.34, 0.34, 0.36]} p={[0, 0.2, -0.05]} />
        <P g="taper" c="#1d0f33" s={[0.34, 0.9, 0.14]} p={[0, -0.24, -0.16]} r={[0.1, 0, 0]} />
        <P g="sphere" c={glow} e={glow} ei={4} s={[0.07, 0.035, 0.04]} p={[0.07, 0.19, 0.13]} />
        <P g="sphere" c={glow} e={glow} ei={4} s={[0.07, 0.035, 0.04]} p={[-0.07, 0.19, 0.13]} />
        {[-0.14, -0.07, 0, 0.07, 0.14].map((x, i) => (
          <P key={x} g="spike" c={boss ? glow : '#d6a83c'} e={boss ? glow : undefined} ei={2.4}
            s={[0.05, i === 2 ? 0.3 : 0.2, 0.05]} p={[x, 0.42 - Math.abs(x) * 0.5, 0.06]} m={0.6} />
        ))}
      </>}
      upperArm={() => <>
        {joint(gown, 0.18)}
        {seg(gown, 0.13, 0.32)}
      </>}
      foreArm={() => <>
        <P g="flare" c={gown} s={[0.3, 0.36, 0.3]} p={[0, -0.18, 0]} />
        <P g="sphere" c={skin} s={0.11} p={[0, -0.36, 0]} />
      </>}
      handR={orb}
      handL={orb}
      aura={<>
        <Spin speed={boss ? 0.8 : 0.5} position={[0, 1.2, 0]}>{runes}</Spin>
        {boss && (
          <Spin speed={-0.5} position={[0, 0.5, 0]} rotation={[0.3, 0, 0]}>
            <P g="ring" c={glow} e={glow} ei={1.6} s={2.6} r={[Math.PI / 2, 0, 0]} />
          </Spin>
        )}
      </>}
    />
  );
}

export function HeroModel({ hero, ctl, twist = 0 }: { hero: HeroKey; ctl: Ctl; twist?: number }) {
  switch (hero) {
    case 'java': return <Grom ctl={ctl} twist={twist} />;
    case 'cpp': return <Malloc ctl={ctl} twist={twist} />;
    case 'networking': return <Handshake ctl={ctl} twist={twist} />;
    case 'dataEngineering': return <Artemis ctl={ctl} twist={twist} />;
    case 'kernel': return <Vulkun ctl={ctl} twist={twist} />;
    default: return <Mara ctl={ctl} twist={twist} />;
  }
}

/** Colour and shape of each hero's ranged attack (melee heroes have none). */
export const HERO_SHOT: Partial<Record<HeroKey, { color: string; arrow?: boolean }>> = {
  cpp: { color: '#4de8e0' },
  dataEngineering: { color: '#b07cff', arrow: true },
  marakathalessa: { color: '#e9a8ff' },
};
