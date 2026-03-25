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
  const innerRef = useRef<THREE.Mesh>(null);
  const outerRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime * speed;
    const pulse = 1 + Math.sin(t * 2) * 0.05;

    if (innerRef.current) {
      if (axis === 'y') innerRef.current.rotation.y = t;
      if (axis === 'x') innerRef.current.rotation.x = t;
      if (axis === 'z') innerRef.current.rotation.z = t;
      innerRef.current.scale.set(pulse, pulse, pulse);
    }

    if (outerRef.current) {
      if (axis === 'y') outerRef.current.rotation.y = -t * 0.7;
      if (axis === 'x') outerRef.current.rotation.x = -t * 0.7;
      if (axis === 'z') outerRef.current.rotation.z = -t * 0.7;
      const outerPulse = 1 + Math.sin(t * 1.8 + 0.8) * 0.04;
      outerRef.current.scale.set(outerPulse, outerPulse, outerPulse);
    }
  });

  return (
    <group position={position}>
      <mesh ref={outerRef} renderOrder={9}>
        <torusGeometry args={[radius * 1.02, 0.03, 20, 120]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.05}
          transparent
          opacity={0.32}
          depthWrite={false}
          depthTest={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh ref={innerRef} renderOrder={10}>
        <torusGeometry args={[radius, 0.035, 20, 140]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={1.7}
          transparent
          opacity={0.78}
          depthWrite={false}
          depthTest={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

export default EnergyRing;
