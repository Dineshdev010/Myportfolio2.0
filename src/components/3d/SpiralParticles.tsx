import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SpiralParticlesProps {
  position: [number, number, number];
  color?: string;
  count?: number;
  radius?: number;
}

const SpiralParticles = ({ position, color = '#00ffff', count = 200, radius = 3 }: SpiralParticlesProps) => {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 6;
      const r = (i / count) * radius;
      pos[i * 3] = Math.cos(t) * r;
      pos[i * 3 + 1] = (i / count - 0.5) * 4;
      pos[i * 3 + 2] = Math.sin(t) * r;
    }
    return pos;
  }, [count, radius]);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.3;
    }
  });

  return (
    <points ref={ref} position={position}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.06} color={color} transparent opacity={0.8} sizeAttenuation />
    </points>
  );
};

export default SpiralParticles;
