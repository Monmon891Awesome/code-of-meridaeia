import { Canvas } from '@react-three/fiber';
import { Bloom, EffectComposer, ToneMapping, Vignette } from '@react-three/postprocessing';
import { ToneMappingMode } from 'postprocessing';
import { useGame } from '../game/store';
import { Stage } from './Stage';

/** `?capture` in the address keeps each frame readable, so automated screenshots are never blank. */
const CAPTURE = new URLSearchParams(window.location.search).has('capture');

/** The always-on 3D backdrop. "Low" quality drops shadows and glow for slower devices. */
export function GameCanvas() {
  const high = useGame((s) => s.settings.quality) === 'high';
  return (
    <Canvas
      className="scene"
      shadows={high}
      dpr={[1, high ? 2 : 1.25]}
      camera={{ fov: 38, near: 0.1, far: 260, position: [0, 2.6, 11] }}
      gl={{ antialias: true, powerPreference: 'high-performance', preserveDrawingBuffer: CAPTURE }}
    >
      <Stage shadows={high} />
      {high && (
        <EffectComposer>
          <Bloom mipmapBlur intensity={0.55} luminanceThreshold={1} luminanceSmoothing={0.25} />
          <Vignette offset={0.22} darkness={0.7} />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
