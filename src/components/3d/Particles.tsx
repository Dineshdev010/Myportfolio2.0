import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const Particles = ({ count = 800, spread = 60 }: { count?: number; spread?: number }) => {
  const mesh = useRef<THREE.Points>(null);

  const [positions, colors] = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const cyan = new THREE.Color(0x00ffff);
    const green = new THREE.Color(0x00ff88);
    const purple = new THREE.Color(0x8844ff);
    const colorsArr = [cyan, green, purple];

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
      positions[i * 3 + 2] = -Math.random() * spread * 3;

      const c = colorsArr[Math.floor(Math.random() * colorsArr.length)];
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return [positions, colors];
  }, [count, spread]);

  useFrame((_, delta) => {
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.005;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} count={count} itemSize={3} />
        <bufferAttribute attach="attributes-color" array={colors} count={count} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.08} vertexColors transparent opacity={0.7} sizeAttenuation />
    </points>
  );
};

export default Particles;
