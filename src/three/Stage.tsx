// The stage director: decides what is on screen for each part of the game,
// frames the camera, and choreographs every blow (who swings, when it lands,
// sparks, camera shake, floating numbers).
import { useEffect, useImperativeHandle, useMemo, useRef, useState, forwardRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { HEROES, MONSTERS, type EnvKey, type HeroKey } from '../data';
import { envForProgress } from '../game/logic';
import { useGame } from '../game/store';
import { audio } from '../game/audio';
import { useLayout } from '../ui/useLayout';
import { Environment, ENV_RUNE } from './Environment';
import { HERO_SHOT, HeroModel, Mara } from './heroes';
import { MONSTER_SHOT, MonsterModel } from './monsters';
import { GEO, IMPACT, P, Spin, damp, newCtl, now, play, type Ctl } from './kit';

const HERO_X = -2.0;
const ENEMY_X = 2.0;
const fx = { shake: 0, punch: 0 };

/* ---------------- spark bursts ---------------- */
interface BurstHandle { emit(x: number, y: number, z: number, color: string, count: number, power?: number): void }

const MAX_SPARKS = 220;

const Bursts = forwardRef<BurstHandle>(function Bursts(_, ref) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const sparks = useMemo(() => Array.from({ length: MAX_SPARKS }, () => ({
    pos: new THREE.Vector3(), vel: new THREE.Vector3(), life: 0, max: 1, size: 0.1,
  })), []);
  const cursor = useRef(0);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const material = useMemo(() => new THREE.MeshBasicMaterial({ toneMapped: false }), []);
  const tint = useMemo(() => new THREE.Color(), []);

  // Colour every spark once at start, so its shader is built with the scene
  // instead of causing a hitch on the first hit.
  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    for (let i = 0; i < MAX_SPARKS; i++) m.setColorAt(i, tint.set('#ffffff'));
    if (m.instanceColor) m.instanceColor.needsUpdate = true;
  }, [tint]);

  useImperativeHandle(ref, () => ({
    emit(x, y, z, color, count, power = 1) {
      const m = mesh.current;
      if (!m) return;
      for (let i = 0; i < count; i++) {
        const index = cursor.current = (cursor.current + 1) % MAX_SPARKS;
        const s = sparks[index];
        s.pos.set(x, y, z);
        s.vel.set(Math.random() - 0.5, Math.random() * 0.9 + 0.1, Math.random() - 0.5).normalize().multiplyScalar((2 + Math.random() * 5) * power);
        s.max = s.life = 0.5 + Math.random() * 0.6;
        s.size = 0.06 + Math.random() * 0.12;
        tint.set(color).multiplyScalar(2.4);
        m.setColorAt(index, tint);
      }
      if (m.instanceColor) m.instanceColor.needsUpdate = true;
    },
  }), [sparks, tint]);

  useFrame((_, rawDelta) => {
    const m = mesh.current;
    if (!m) return;
    const dt = Math.min(rawDelta, 0.05);
    for (let i = 0; i < MAX_SPARKS; i++) {
      const s = sparks[i];
      if (s.life > 0) {
        s.life -= dt;
        s.vel.y -= 9 * dt;
        s.pos.addScaledVector(s.vel, dt);
        if (s.pos.y < 0.2) { s.pos.y = 0.2; s.vel.y *= -0.4; }
        dummy.position.copy(s.pos);
        dummy.rotation.set(s.life * 9, s.life * 7, 0);
        dummy.scale.setScalar(s.size * Math.max(s.life / s.max, 0));
      } else {
        dummy.scale.setScalar(0);
      }
      dummy.updateMatrix();
      m.setMatrixAt(i, dummy.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
  });

  return <instancedMesh ref={mesh} args={[GEO.shard, material, MAX_SPARKS]} frustumCulled={false} />;
});

/* ---------------- slash arc + ground shockwave ---------------- */
interface ImpactHandle { hit(x: number, color: string, slash: boolean, power?: number): void }

const Impact = forwardRef<ImpactHandle>(function Impact(_, ref) {
  const arc = useRef<THREE.Mesh>(null);
  const wave = useRef<THREE.Mesh>(null);
  const state = useRef({ t0: -9, slash: false, power: 1, dir: 1 });
  const arcMat = useMemo(() => new THREE.MeshBasicMaterial({ toneMapped: false, transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }), []);
  const waveMat = useMemo(() => new THREE.MeshBasicMaterial({ toneMapped: false, transparent: true, depthWrite: false, side: THREE.DoubleSide, blending: THREE.AdditiveBlending }), []);

  useImperativeHandle(ref, () => ({
    hit(x, color, slash, power = 1) {
      state.current = { t0: now(), slash, power, dir: x > 0 ? 1 : -1 };
      arcMat.color.set(color).multiplyScalar(2.2);
      waveMat.color.set(color).multiplyScalar(1.6);
      arc.current?.position.set(x - state.current.dir * 0.35, 1.3, 0.25);
      wave.current?.position.set(x, 0.2, 0);
    },
  }), [arcMat, waveMat]);

  useFrame(() => {
    const { t0, slash, power, dir } = state.current;
    const k = (now() - t0) / 0.32;
    const w = (now() - t0) / 0.55;
    // Both shapes stay in the scene at zero opacity when idle, so their
    // shaders are built up front rather than on the first hit.
    const arcOn = slash && k >= 0 && k < 1;
    const waveOn = w >= 0 && w < 1;
    if (arc.current) {
      arc.current.scale.setScalar(arcOn ? (0.7 + k * 0.9) * power : 0.01);
      arc.current.rotation.set(0.25, dir > 0 ? 0 : Math.PI, 2.3 - k * 2.6);
      arcMat.opacity = arcOn ? 1 - k * k : 0;
    }
    if (wave.current) {
      wave.current.scale.setScalar(waveOn ? (0.4 + w * 2.6) * power : 0.01);
      waveMat.opacity = waveOn ? (1 - w) * 0.9 : 0;
    }
  });

  return (
    <>
      <mesh ref={arc} geometry={GEO.arc} material={arcMat} position={[0, 1.3, 0]} frustumCulled={false} />
      <mesh ref={wave} geometry={GEO.wave} material={waveMat} position={[0, 0.2, 0]} rotation={[-Math.PI / 2, 0, 0]} frustumCulled={false} />
    </>
  );
});

/* ---------------- flying bolt / arrow ---------------- */
interface Shot { active: boolean; from: THREE.Vector3; to: THREE.Vector3; t0: number; color: string; arrow: boolean }

function Projectile({ shot }: { shot: Shot }) {
  const group = useRef<THREE.Group>(null);
  const light = useRef<THREE.PointLight>(null);
  const material = useMemo(() => new THREE.MeshBasicMaterial({ toneMapped: false }), []);
  const halo = useMemo(() => new THREE.MeshBasicMaterial({ toneMapped: false, transparent: true, opacity: 0.35, depthWrite: false }), []);
  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const k = (now() - shot.t0) / IMPACT.projectile;
    g.visible = shot.active && k >= 0 && k <= 1;
    if (!g.visible) return;
    g.position.lerpVectors(shot.from, shot.to, k);
    g.position.y += Math.sin(k * Math.PI) * 0.35;
    g.rotation.z = shot.to.x > shot.from.x ? -Math.PI / 2 : Math.PI / 2;
    g.scale.set(shot.arrow ? 0.5 : 1, shot.arrow ? 2.6 : 1.4, shot.arrow ? 0.5 : 1);
    material.color.set(shot.color).multiplyScalar(3);
    halo.color.set(shot.color);
    if (light.current) light.current.color.set(shot.color);
  });
  return (
    <group ref={group} visible={false}>
      <mesh geometry={GEO.gem} material={material} scale={[0.22, 0.6, 0.22]} />
      <mesh geometry={GEO.sphere} material={halo} scale={0.7} />
      <pointLight ref={light} intensity={30} distance={8} decay={2} />
    </group>
  );
}

/* ---------------- battle ---------------- */
interface Floater { id: number; text: string; cls: string; x: number; y: number }

function Battle() {
  const run = useGame((s) => s.run);
  const boss = useGame((s) => s.boss);
  const action = useGame((s) => s.action);
  const results = useGame((s) => s.results);
  const heroKey: HeroKey = run?.hero ?? boss?.hero ?? 'java';
  const enemyId = run ? run.monsterId : -1;
  const monster = run?.monster ?? 'goblin';
  const enemyAccent = boss ? '#d264ff' : MONSTERS[monster].accent;
  const heroAccent = HEROES[heroKey].accent;

  const heroCtl = useMemo(() => newCtl('spawn'), [heroKey]);
  const enemyCtl = useMemo(() => newCtl('spawn'), [enemyId, !!boss]);
  const bursts = useRef<BurstHandle>(null);
  const impact = useRef<ImpactHandle>(null);
  const flash = useRef<THREE.PointLight>(null);
  const queue = useRef<{ at: number; fn: () => void }[]>([]);
  const shot = useMemo<Shot>(() => ({ active: false, from: new THREE.Vector3(), to: new THREE.Vector3(), t0: 0, color: '#fff', arrow: false }), []);
  const [floaters, setFloaters] = useState<Floater[]>([]);

  const later = (delay: number, fn: () => void) => queue.current.push({ at: now() + delay, fn });
  const float = (text: string, cls: string, x: number, y: number) => {
    const id = Math.random();
    setFloaters((list) => [...list.slice(-4), { id, text, cls, x, y }]);
    later(1.3, () => setFloaters((list) => list.filter((f) => f.id !== id)));
  };
  const spark = (x: number, color: string, count: number, power = 1) => {
    bursts.current?.emit(x, 1.25, 0.1, color, count, power);
    if (flash.current) { flash.current.position.set(x, 2.2, 2.2); flash.current.color.set(color); flash.current.intensity = 45 * power; }
  };
  const fire = (fromX: number, toX: number, color: string, arrow = false) => {
    shot.from.set(fromX, 1.45, 0.1); shot.to.set(toX, 1.25, 0.1);
    shot.t0 = now(); shot.color = color; shot.arrow = arrow; shot.active = true;
  };

  useEffect(() => { audio.play('spawn'); }, [enemyCtl]);

  const handled = useRef(0);
  useEffect(() => {
    if (!action || handled.current === action.id) return;
    handled.current = action.id;
    if (action.kind === 'heroAttack') {
      const ranged = HERO_SHOT[heroKey];
      let hitAt = IMPACT.attack;
      if (ranged) {
        play(heroCtl, 'cast');
        later(0.1, () => audio.play('cast'));
        later(IMPACT.cast, () => fire(HERO_X + 0.7, ENEMY_X - 0.3, ranged.color, ranged.arrow));
        hitAt = IMPACT.cast + IMPACT.projectile;
      } else {
        heroCtl.reach = 2.45;
        play(heroCtl, 'attack');
        later(0.28, () => audio.play('swing'));
        later(0.3, () => bursts.current?.emit(ENEMY_X - 1.1, 0.3, 0.2, '#8a7a70', 10, 0.35));
      }
      later(hitAt, () => {
        shot.active = false;
        audio.play(action.crit ? 'crit' : 'hit');
        fx.shake = action.crit ? 0.42 : 0.24;
        fx.punch = action.crit || action.kill ? 1 : 0.6;
        impact.current?.hit(ENEMY_X, action.crit ? '#ffe9a0' : heroAccent, !ranged, action.crit ? 1.35 : 1);
        spark(ENEMY_X - 0.2, action.crit ? '#ffe9a0' : heroAccent, action.crit ? 46 : 24, action.crit ? 1.3 : 1);
        float(`${action.crit ? 'CRIT! ' : ''}-${action.damage}`, action.crit ? 'crit' : 'dmg', ENEMY_X, 2.6);
        if (action.kill) {
          play(enemyCtl, 'death', 'death');
          later(0.25, () => audio.play('death'));
          later(0.7, () => { spark(ENEMY_X, enemyAccent, 70, 1.2); fx.shake = 0.3; });
          later(1.1, () => audio.play('loot'));
        } else {
          play(enemyCtl, 'hit');
        }
      });
    } else {
      const bolt = boss ? '#d264ff' : MONSTER_SHOT[monster];
      let hitAt = IMPACT.attack;
      if (bolt) {
        play(enemyCtl, 'cast');
        later(0.1, () => audio.play('cast'));
        later(IMPACT.cast, () => fire(ENEMY_X - 0.7, HERO_X + 0.3, bolt));
        hitAt = IMPACT.cast + IMPACT.projectile;
      } else {
        enemyCtl.reach = 2.45;
        play(enemyCtl, 'attack');
        later(0.28, () => audio.play('swing'));
      }
      later(hitAt, () => {
        shot.active = false;
        if (action.blocked) {
          play(heroCtl, 'block');
          audio.play('heal');
          spark(HERO_X + 0.4, '#ffffff', 26);
          float('GRACE!', 'grace', HERO_X, 2.7);
          return;
        }
        audio.play('hit');
        fx.shake = action.fatal ? 0.5 : 0.3;
        fx.punch = action.fatal ? 1 : 0.6;
        impact.current?.hit(HERO_X, '#ff4050', !bolt, action.fatal ? 1.3 : 1);
        spark(HERO_X + 0.2, '#ff4050', action.fatal ? 50 : 26);
        float(action.fatal ? 'BARRIER BROKEN' : '-1 BARRIER', 'hurt', HERO_X, 2.7);
        if (action.fatal) play(heroCtl, 'down', 'down');
        else play(heroCtl, 'hit');
      });
    }
    // Only a new cue should restart the choreography.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [action?.id]);

  useEffect(() => {
    if (results?.cleared && heroCtl.state !== 'down') {
      const timer = setTimeout(() => play(heroCtl, 'victory', 'victory'), 150);
      return () => clearTimeout(timer);
    }
    if (results && !results.cleared && results.kind === 'bossLost' && heroCtl.state !== 'down') play(heroCtl, 'down', 'down');
  }, [results, heroCtl]);

  useFrame((_, dt) => {
    const t = now();
    if (queue.current.length) {
      const due = queue.current.filter((e) => e.at <= t);
      if (due.length) {
        queue.current = queue.current.filter((e) => e.at > t);
        due.forEach((e) => e.fn());
      }
    }
    if (flash.current) flash.current.intensity = damp(flash.current.intensity, 0, 9, dt);
  });

  return (
    <>
      <group position={[HERO_X, 0.16, 0]} rotation={[0, Math.PI / 2, 0]}>
        <HeroModel key={heroKey} hero={heroKey} ctl={heroCtl} twist={-0.4} />
      </group>
      <group position={[ENEMY_X, 0.16, 0]} rotation={[0, -Math.PI / 2, 0]}>
        {boss
          ? <Mara ctl={enemyCtl} twist={0.4} boss />
          : <MonsterModel key={enemyId} monster={monster} ctl={enemyCtl} twist={0.4} />}
      </group>
      <pointLight position={[HERO_X - 1.2, 2.6, -2.2]} color={heroAccent} intensity={55} distance={9} decay={2} />
      <pointLight position={[ENEMY_X + 1.2, 2.6, -2.2]} color={enemyAccent} intensity={55} distance={9} decay={2} />
      <Bursts ref={bursts} />
      <Impact ref={impact} />
      <Projectile shot={shot} />
      <pointLight ref={flash} intensity={0} distance={10} decay={2} />
      {floaters.map((f) => (
        <Html key={f.id} position={[f.x, f.y, 0]} center zIndexRange={[5, 0]} style={{ pointerEvents: 'none' }}>
          <div className={`floater ${f.cls}`}>{f.text}</div>
        </Html>
      ))}
    </>
  );
}

/* ---------------- showcase (title, hero select, chapter select) ---------------- */
function Showcase({ who, rune }: { who: HeroKey | 'boss'; rune: string }) {
  const ctl = useMemo<Ctl>(() => newCtl('spawn'), [who]);
  const turn = useRef<THREE.Group>(null);
  useFrame(({ clock }) => {
    if (turn.current) turn.current.rotation.y = Math.sin(clock.elapsedTime * 0.5) * 0.35;
  });
  return (
    <>
      <P g="disc" c="#1a1420" s={[2.6, 0.3, 2.6]} p={[0, 0.3, 0]} flat={false} m={0.4} ro={0.5} />
      <P g="ring" c={rune} e={rune} ei={1.6} s={[2.5, 2.5, 1]} p={[0, 0.46, 0]} r={[Math.PI / 2, 0, 0]} shadow={false} />
      <Spin speed={0.5} position={[0, 0.5, 0]}>
        <P g="ring" c={rune} e={rune} ei={1.4} s={3.4} r={[Math.PI / 2, 0, 0]} shadow={false} />
        <P g="gem" c={rune} e={rune} ei={3} s={0.16} p={[1.7, 0.1, 0]} />
        <P g="gem" c={rune} e={rune} ei={3} s={0.16} p={[-1.7, 0.1, 0]} />
      </Spin>
      <spotLight position={[0, 7, 4]} angle={0.5} penumbra={0.7} intensity={120} color="#fff4e0" distance={18} castShadow />
      <group ref={turn} position={[0, 0.46, 0]}>
        {who === 'boss' ? <Mara key="boss" ctl={ctl} boss /> : <HeroModel key={who} hero={who} ctl={ctl} />}
      </group>
    </>
  );
}

/* ---------------- camera ---------------- */
interface Framing { look: [number, number, number]; halfW: number; height: number; elev: number; sway: number; cx: number; cy: number; fx: number; fy: number }

function CameraRig({ framing }: { framing: Framing }) {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const size = useThree((s) => s.size);
  const look = useRef(new THREE.Vector3(0, 1.2, 0));
  const offset = useRef({ x: 0, y: 0 });
  const dist = useRef(10);

  useFrame(({ clock }, rawDelta) => {
    const dt = Math.min(rawDelta, 0.05);
    const f = framing;
    const tan = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const aspect = size.width / size.height;
    const need = Math.max(f.halfW / (tan * aspect * f.fx), f.height / 2 / (tan * f.fy));
    dist.current = damp(dist.current, need, 3.5, dt);
    look.current.x = damp(look.current.x, f.look[0], 4, dt);
    look.current.y = damp(look.current.y, f.look[1], 4, dt);
    look.current.z = damp(look.current.z, f.look[2], 4, dt);
    const angle = Math.sin(clock.elapsedTime * 0.25) * f.sway;
    fx.shake = damp(fx.shake, 0, 7, dt);
    fx.punch = damp(fx.punch, 0, 5, dt);
    const reach = dist.current * (1 - fx.punch * 0.07);
    const sx = (Math.random() - 0.5) * fx.shake;
    const sy = (Math.random() - 0.5) * fx.shake;
    camera.position.set(
      look.current.x + Math.sin(angle) * reach + sx,
      look.current.y + f.elev * reach + sy,
      look.current.z + Math.cos(angle) * reach,
    );
    camera.lookAt(look.current);
    offset.current.x = damp(offset.current.x, (0.5 - f.cx) * size.width, 4, dt);
    offset.current.y = damp(offset.current.y, (0.5 - f.cy) * size.height, 4, dt);
    camera.setViewOffset(size.width, size.height, offset.current.x, offset.current.y, size.width, size.height);
  });
  return null;
}

/* ---------------- stage ---------------- */
export function Stage({ shadows }: { shadows: boolean }) {
  const screen = useGame((s) => s.screen);
  const run = useGame((s) => s.run);
  const boss = useGame((s) => s.boss);
  const browse = useGame((s) => s.browse);
  const hero = useGame((s) => s.hero);
  const storyProgress = useGame((s) => s.profile.storyProgress);
  const wide = useLayout() === 'wide';

  const fighting = !!(run || boss) && (screen === 'battle' || screen === 'boss' || screen === 'results');
  const env: EnvKey = fighting
    ? (boss ? 'throne' : run!.env)
    : screen === 'title' ? 'gates' : browse === 'boss' ? 'throne' : envForProgress(storyProgress);
  const danger = fighting
    ? 1 - (boss ? boss.barrier / boss.maxBarrier : run!.barrier / run!.maxBarrier)
    : 0;

  let framing: Framing;
  if (fighting) {
    framing = wide
      ? { look: [0, boss ? 1.75 : 1.4, 0], halfW: 3.25, height: boss ? 5 : 4.0, elev: 0.14, sway: 0.05, cx: 0.28, cy: 0.56, fx: 0.56, fy: 0.84 }
      : { look: [0, boss ? 1.75 : 1.4, 0], halfW: 3.2, height: boss ? 4.8 : 3.9, elev: 0.12, sway: 0.04, cx: 0.5, cy: 0.25, fx: 1, fy: 0.3 };
  } else if (screen === 'title') {
    framing = { look: [0, 2.3, 0], halfW: 2.6, height: 5.4, elev: 0.05, sway: 0.5, cx: 0.5, cy: wide ? 0.56 : 0.54, fx: 1, fy: wide ? 0.6 : 0.42 };
  } else {
    const tall = browse === 'boss' && screen === 'heroes';
    framing = wide
      ? { look: [0, tall ? 2.0 : 1.55, 0], halfW: 1.7, height: tall ? 4.6 : 3.3, elev: 0.08, sway: 0.1, cx: 0.27, cy: 0.52, fx: 0.5, fy: 0.78 }
      : { look: [0, tall ? 2.0 : 1.55, 0], halfW: 1.5, height: tall ? 4.6 : 3.3, elev: 0.08, sway: 0.1, cx: 0.5, cy: 0.26, fx: 1, fy: 0.36 };
  }

  const who: HeroKey | 'boss' = screen === 'title' ? 'boss' : screen === 'chapters' && hero ? hero : browse;

  return (
    <>
      <CameraRig framing={framing} />
      <Environment env={env} danger={danger} shadows={shadows} />
      {fighting ? <Battle key={(boss ?? run)!.fightId} /> : <Showcase who={who} rune={ENV_RUNE[env]} />}
    </>
  );
}
