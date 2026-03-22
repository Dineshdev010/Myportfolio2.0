import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EnergyRingProps {
  position: [number, number, number];
  color?: string;
  radius?: number;
  speed?: number;
  axis?: 'x' | 'y' | 'z';
}

const EnergyRing = ({ position, color = '#00ffff', radius = 2, speed = 1, axis = 'y' }: EnergyRingProps) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.elapsedTime * speed;
      if (axis === 'y') ref.current.rotation.y = t;
      if (axis === 'x') ref.current.rotation.x = t;
      if (axis === 'z') ref.current.rotation.z = t;
      // Pulse scale
      const pulse = 1 + Math.sin(t * 2) * 0.05;
      ref.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[radius, 0.03, 16, 100]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.5}
        transparent
        opacity={0.6}
      />
    </mesh>
  );
};

export default EnergyRing;
