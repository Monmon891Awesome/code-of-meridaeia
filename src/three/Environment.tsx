// The six battlegrounds, built from shapes: sky, fog, light, ground, the
// rune-ringed arena, and scenery unique to each region.
import { useMemo, useRef, type ReactNode } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sparkles, Stars } from '@react-three/drei';
import * as THREE from 'three';
import type { EnvKey } from '../data';
import { Bob, P, Spin, seeded } from './kit';

interface EnvLook {
  top: string; bottom: string; fog: string; fogFar: number;
  ground: string; stone: string; rune: string;
  key: string; keyPower: number; fill: string; rim: string;
  sparkle: string; sparkleSpeed: number; stars: boolean;
}

const LOOKS: Record<EnvKey, EnvLook> = {
  wasteland: {
    top: '#150d18', bottom: '#8a3b22', fog: '#4a2420', fogFar: 46,
    ground: '#3b2a25', stone: '#4a3d3a', rune: '#ff8a3c',
    key: '#ffc9a0', keyPower: 2.4, fill: '#7a4a5a', rim: '#ff6a2a',
    sparkle: '#ffa050', sparkleSpeed: 0.5, stars: true,
  },
  forest: {
    top: '#04101a', bottom: '#1c5a4c', fog: '#0f3a36', fogFar: 38,
    ground: '#16302a', stone: '#35504a', rune: '#5dffc0',
    key: '#bfeee0', keyPower: 2.0, fill: '#2a6a7a', rim: '#4de8c0',
    sparkle: '#9dffb0', sparkleSpeed: 0.25, stars: true,
  },
  mountains: {
    top: '#0d1c40', bottom: '#8fb2dc', fog: '#6f93c2', fogFar: 52,
    ground: '#c9d9ec', stone: '#8c9db8', rune: '#7fd4ff',
    key: '#ffffff', keyPower: 2.6, fill: '#6a8ac0', rim: '#9be4ff',
    sparkle: '#ffffff', sparkleSpeed: 0.9, stars: false,
  },
  lakes: {
    top: '#070620', bottom: '#2c2f8c', fog: '#1a1c5c', fogFar: 44,
    ground: '#14163a', stone: '#34386e', rune: '#4de8e0',
    key: '#bcd0ff', keyPower: 2.0, fill: '#4050c0', rim: '#4de8e0',
    sparkle: '#7fe8ff', sparkleSpeed: 0.3, stars: true,
  },
  gates: {
    top: '#0e0510', bottom: '#5a1638', fog: '#34101f', fogFar: 46,
    ground: '#2a1a24', stone: '#463542', rune: '#d264ff',
    key: '#ffd0c0', keyPower: 2.2, fill: '#70305a', rim: '#d264ff',
    sparkle: '#ff7ab0', sparkleSpeed: 0.4, stars: true,
  },
  throne: {
    top: '#040208', bottom: '#34106a', fog: '#1c0a3a', fogFar: 40,
    ground: '#15101f', stone: '#2c2440', rune: '#d264ff',
    key: '#e0c8ff', keyPower: 2.0, fill: '#5a2aa0', rim: '#d264ff',
    sparkle: '#d9a0ff', sparkleSpeed: 0.3, stars: true,
  },
};

export const ENV_RUNE: Record<EnvKey, string> = Object.fromEntries(
  Object.entries(LOOKS).map(([k, v]) => [k, v.rune]),
) as Record<EnvKey, string>;

function SkyDome({ top, bottom }: { top: string; bottom: string }) {
  const material = useMemo(() => new THREE.ShaderMaterial({
    side: THREE.BackSide,
    depthWrite: false,
    fog: false,
    uniforms: { top: { value: new THREE.Color(top) }, bottom: { value: new THREE.Color(bottom) } },
    vertexShader: 'varying vec3 vPos; void main(){ vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: `
      uniform vec3 top; uniform vec3 bottom; varying vec3 vPos;
      void main(){
        float h = clamp(normalize(vPos).y * 1.6 + 0.08, 0.0, 1.0);
        vec3 col = mix(bottom, top, pow(h, 0.55));
        gl_FragColor = vec4(col, 1.0);
      }`,
  }), [top, bottom]);
  return <mesh material={material}><sphereGeometry args={[120, 24, 16]} /></mesh>;
}

/** Scatter points in an arc behind the arena. */
function scatter(seed: number, count: number, rMin: number, rMax: number) {
  const rand = seeded(seed);
  return Array.from({ length: count }, () => {
    const a = Math.PI * (0.04 + rand() * 0.92);
    const r = rMin + rand() * (rMax - rMin);
    return { x: Math.cos(a) * r, z: -Math.sin(a) * r - 1.5, s: 0.7 + rand() * 0.8, rot: rand() * Math.PI * 2, k: rand() };
  });
}

const DeadTree = ({ k }: { k: number }) => (
  <>
    <P g="taper" c="#241a1a" s={[0.36, 3.2, 0.36]} p={[0, 1.6, 0]} />
    <P g="taper" c="#241a1a" s={[0.16, 1.5, 0.16]} p={[0.5, 2.6, 0]} r={[0, 0, -0.9]} />
    <P g="taper" c="#241a1a" s={[0.14, 1.2, 0.14]} p={[-0.4, 3.0, 0.1]} r={[0.2, 0, 0.8]} />
    <P g="taper" c="#241a1a" s={[0.1, 0.9, 0.1]} p={[0.1, 3.5, -0.2]} r={[-0.5, 0, 0.2 + k]} />
  </>
);

const Rock = ({ c }: { c: string }) => <P g="rock" c={c} s={[1.4, 1, 1.2]} p={[0, 0.3, 0]} />;

const Pine = ({ k }: { k: number }) => (
  <>
    <P g="cyl" c="#2a1d18" s={[0.3, 1.2, 0.3]} p={[0, 0.6, 0]} />
    {[0, 1, 2, 3].map((i) => (
      <P key={i} g="spike" c={k > 0.5 ? '#0f3a36' : '#12473e'} s={[2.4 - i * 0.5, 1.6, 2.4 - i * 0.5]} p={[0, 1.6 + i * 0.95, 0]} />
    ))}
  </>
);

const Peak = ({ k }: { k: number }) => (
  <>
    <P g="spike" c="#5a6f94" s={[9, 12 + k * 6, 9]} p={[0, 6 + k * 3, 0]} shadow={false} />
    <P g="spike" c="#eef5ff" s={[3.6, 4.8 + k * 2.4, 3.6]} p={[0, 9.7 + k * 4.8, 0]} shadow={false} />
  </>
);

const Crystal = ({ c, k }: { c: string; k: number }) => (
  <Bob speed={0.8 + k} height={0.12} phase={k * 6}>
    <P g="gem" c={c} e={c} ei={2.2} s={[0.6, 1.8 + k, 0.6]} p={[0, 1.2, 0]} />
    <P g="gem" c={c} e={c} ei={2.2} s={[0.3, 0.9, 0.3]} p={[0.5, 0.6, 0.2]} r={[0, 0, -0.4]} />
  </Bob>
);

const Pillar = ({ c, rune, broken }: { c: string; rune: string; broken?: boolean }) => (
  <>
    <P g="box" c={c} s={[1.3, 0.4, 1.3]} p={[0, 0.2, 0]} />
    <P g="cyl" c={c} s={[0.9, broken ? 3 : 7, 0.9]} p={[0, broken ? 1.9 : 3.9, 0]} />
    {!broken && <P g="box" c={c} s={[1.4, 0.4, 1.4]} p={[0, 7.6, 0]} />}
    <P g="box" c={rune} e={rune} ei={2.4} s={[0.08, broken ? 1.4 : 3, 0.02]} p={[0, broken ? 1.6 : 3.6, 0.46]} />
  </>
);

function Torch({ c }: { c: string }) {
  const light = useRef<THREE.PointLight>(null);
  useFrame(({ clock }) => {
    if (light.current) light.current.intensity = 14 + Math.sin(clock.elapsedTime * 11) * 3 + Math.sin(clock.elapsedTime * 23) * 2;
  });
  return (
    <>
      <P g="cyl" c="#241a1a" s={[0.12, 2.2, 0.12]} p={[0, 1.1, 0]} />
      <Bob speed={9} height={0.04} pulse={0.2} position={[0, 2.4, 0]}>
        <P g="gem" c={c} e={c} ei={4} s={[0.3, 0.6, 0.3]} />
      </Bob>
      <pointLight ref={light} position={[0, 2.6, 0]} color={c} distance={14} decay={2} />
    </>
  );
}

function Scenery({ env, look }: { env: EnvKey; look: EnvLook }): ReactNode {
  const place = (items: ReturnType<typeof scatter>, render: (k: number, i: number) => ReactNode, scale = 1) =>
    items.map((it, i) => (
      <group key={i} position={[it.x, 0, it.z]} rotation={[0, it.rot, 0]} scale={it.s * scale}>{render(it.k, i)}</group>
    ));

  switch (env) {
    case 'wasteland':
      return (
        <>
          {place(scatter(11, 9, 8, 24), (k) => <DeadTree k={k} />)}
          {place(scatter(12, 16, 6.5, 26), () => <Rock c="#4a3a34" />)}
          {place(scatter(13, 4, 10, 20), () => <Pillar c="#54433f" rune={look.rune} broken />)}
          <P g="sphere" c="#ff9a5a" e="#ff7a3a" ei={2.2} s={9} p={[-16, 9, -60]} shadow={false} flat={false} />
        </>
      );
    case 'forest':
      return (
        <>
          {place(scatter(21, 26, 7.5, 26), (k) => <Pine k={k} />, 1.25)}
          {place(scatter(22, 10, 6.2, 16), () => <Rock c="#2c4640" />, 0.7)}
          {place(scatter(23, 14, 6, 15), (k) => (
            <>
              <P g="cyl" c="#d8f0e8" s={[0.08, 0.4, 0.08]} p={[0, 0.2, 0]} />
              <P g="cone" c={k > 0.5 ? '#5dffc0' : '#7fd4ff'} e={k > 0.5 ? '#5dffc0' : '#7fd4ff'} ei={2.6} s={[0.4, 0.22, 0.4]} p={[0, 0.46, 0]} />
            </>
          ), 0.9)}
          <P g="sphere" c="#e8fff4" e="#bfffe8" ei={1.6} s={6} p={[14, 18, -60]} shadow={false} flat={false} />
        </>
      );
    case 'mountains':
      return (
        <>
          {place(scatter(31, 9, 26, 44), (k) => <Peak k={k} />)}
          {place(scatter(32, 14, 6.5, 22), () => <Rock c="#8fa2c0" />)}
          {place(scatter(33, 8, 7, 18), (k) => <Crystal c="#bfe8ff" k={k} />, 0.6)}
        </>
      );
    case 'lakes':
      return (
        <>
          <mesh position={[0, 0.04, -24]} rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[19, 40]} />
            <meshStandardMaterial color="#2a50d8" emissive="#3a8cff" emissiveIntensity={0.9} roughness={0.15} metalness={0.6} transparent opacity={0.85} />
          </mesh>
          {place(scatter(41, 16, 7, 24), (k) => <Crystal c={k > 0.5 ? '#4de8e0' : '#7a8cff'} k={k} />)}
          {place(scatter(42, 10, 6.5, 22), () => <Rock c="#2c2f66" />)}
          {place(scatter(43, 4, 12, 22), () => <Pillar c="#3a3e7a" rune={look.rune} broken />)}
        </>
      );
    case 'gates':
      return (
        <>
          <group position={[0, 0, -17]}>
            <P g="box" c="#34242e" s={[40, 9, 2.4]} p={[0, 4.5, 0]} />
            {[-18, -14, -10, -6, 6, 10, 14, 18].map((x) => <P key={x} g="box" c="#34242e" s={[1.6, 1.4, 2.4]} p={[x, 9.7, 0]} />)}
            {[-8.5, 8.5].map((x) => (
              <group key={x} position={[x, 0, 0.6]}>
                <P g="cyl" c="#3e2c38" s={[5, 15, 5]} p={[0, 7.5, 0]} />
                <P g="spike" c="#22141e" s={[6.4, 6, 6.4]} p={[0, 18, 0]} />
                <P g="box" c={look.rune} e={look.rune} ei={3} s={[0.5, 1.6, 0.1]} p={[0, 10, 2.5]} />
                <P g="box" c={look.rune} e={look.rune} ei={3} s={[0.5, 1.6, 0.1]} p={[0, 5.5, 2.5]} />
              </group>
            ))}
            <P g="box" c="#120a12" s={[6.5, 7.6, 0.4]} p={[0, 3.8, 1.2]} />
            <P g="disc" c={look.rune} e={look.rune} ei={1.5} s={[6.2, 0.2, 6.2]} p={[0, 6.4, 1.55]} r={[Math.PI / 2, 0, 0]} shadow={false} flat={false} />
            <Spin speed={0.3} axis="z" position={[0, 6.4, 1.6]}>
              <P g="ring" c="#ffffff" e={look.rune} ei={3.4} s={5} />
              <P g="ring" c="#ffffff" e={look.rune} ei={3.4} s={3.4} r={[0, 0, 1]} />
            </Spin>
          </group>
          {[[-6.5, -3], [6.5, -3], [-9, -9], [9, -9]].map(([x, z]) => (
            <group key={`${x}${z}`} position={[x, 0, z]}><Torch c="#ff8a4a" /></group>
          ))}
          {place(scatter(52, 10, 7, 14), () => <Rock c="#3e2c38" />, 0.7)}
        </>
      );
    default:
      return (
        <>
          {[-7.5, 7.5].flatMap((x) => [-3, -9, -15].map((z) => (
            <group key={`${x}${z}`} position={[x, 0, z]}><Pillar c="#2e2644" rune={look.rune} /></group>
          )))}
          <group position={[0, 5.2, -15]}>
            <Spin speed={0.25} axis="z">
              <P g="ring" c="#ffffff" e={look.rune} ei={2} s={9} />
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <P key={i} g="gem" c={look.rune} e={look.rune} ei={3.2} s={[0.5, 1, 0.3]}
                  p={[Math.cos(i * 1.047) * 5.4, Math.sin(i * 1.047) * 5.4, 0]} />
              ))}
            </Spin>
            <Spin speed={-0.4} axis="z"><P g="ring" c="#ffffff" e="#7a4cff" ei={3} s={6.4} /></Spin>
            <P g="disc" c="#1a0638" e="#5a1aa8" ei={0.5} s={[8.6, 0.1, 8.6]} r={[Math.PI / 2, 0, 0]} p={[0, 0, -0.2]} shadow={false} />
          </group>
          <P g="box" c="#241c38" s={[9, 0.5, 5]} p={[0, 0.25, -9]} />
          <P g="box" c="#2e2644" s={[6, 0.5, 3.4]} p={[0, 0.75, -9.6]} />
          {place(scatter(61, 10, 8, 20), (k) => <Crystal c="#a060ff" k={k} />, 0.7)}
        </>
      );
  }
}

/** `danger` runs 0 (safe) to 1 (barrier nearly gone): the light closes in as it rises. */
export function Environment({ env, danger = 0, shadows = true }: { env: EnvKey; danger?: number; shadows?: boolean }) {
  const look = LOOKS[env];
  const calm = 1 - danger * 0.5;
  return (
    <>
      <SkyDome top={look.top} bottom={look.bottom} />
      <fog attach="fog" args={[look.fog, 14, look.fogFar]} />
      {look.stars && <Stars radius={90} depth={20} count={1400} factor={4} saturation={0.4} fade speed={0.6} />}

      <hemisphereLight args={[look.fill, look.ground, 1.9 * calm]} />
      <directionalLight
        position={[5, 10, 7]} color={look.key} intensity={look.keyPower * calm}
        castShadow={shadows} shadow-mapSize={[1536, 1536]} shadow-bias={-0.0004}
        shadow-camera-left={-9} shadow-camera-right={9} shadow-camera-top={9} shadow-camera-bottom={-6} shadow-camera-far={40}
      />
      <pointLight position={[0, 4.5, -5.5]} color={look.rim} intensity={46} distance={22} decay={2} />
      <pointLight position={[0, 3.5, 6.5]} color="#fff2e6" intensity={90 * calm} distance={20} decay={2} />
      {danger > 0.3 && <pointLight position={[0, 1.5, 2]} color="#ff2030" intensity={30 * danger} distance={14} decay={2} />}

      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[70, 48]} />
        <meshStandardMaterial color={look.ground} roughness={0.95} />
      </mesh>

      {/* The arena: a stone dais with a slowly turning ring of runes. */}
      <P g="disc" c={look.stone} s={[11.4, 0.3, 11.4]} p={[0, 0.0, 0]} ro={0.9} flat={false} />
      <P g="disc" c={look.ground} s={[9.6, 0.32, 9.6]} p={[0, 0.0, 0]} ro={0.9} flat={false} />
      <P g="ring" c={look.rune} e={look.rune} ei={1.3} s={[9.9, 9.9, 1]} p={[0, 0.17, 0]} r={[Math.PI / 2, 0, 0]} shadow={false} />
      <Spin speed={0.12} position={[0, 0.18, 0]}>
        {Array.from({ length: 12 }, (_, i) => {
          const a = (i / 12) * Math.PI * 2;
          return (
            <P key={i} g={i % 3 === 0 ? 'gem' : 'box'} c={look.rune} e={look.rune} ei={2.6}
              s={i % 3 === 0 ? [0.3, 0.02, 0.3] : [0.4, 0.02, 0.08]} p={[Math.cos(a) * 4.4, 0, Math.sin(a) * 4.4]} r={[0, -a, 0]} shadow={false} />
          );
        })}
      </Spin>
      <P g="ring" c={look.rune} e={look.rune} ei={1.0} s={[6.4, 6.4, 1]} p={[0, 0.17, 0]} r={[Math.PI / 2, 0, 0]} shadow={false} />

      <Scenery env={env} look={look} />
      <Sparkles count={90} scale={[26, 9, 22]} position={[0, 4.5, -3]} size={5} speed={look.sparkleSpeed} color={look.sparkle} opacity={0.8} />
    </>
  );
}
