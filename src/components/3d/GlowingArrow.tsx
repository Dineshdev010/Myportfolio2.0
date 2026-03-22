import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface GlowingArrowProps {
  position: [number, number, number];
  rotation?: [number, number, number];
  color?: string;
}

const GlowingArrow = ({ position, rotation = [0, 0, 0], color = '#00ffff' }: GlowingArrowProps) => {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.position.z = position[2] + Math.sin(clock.elapsedTime * 2) * 0.2;
      const s = hovered ? 1.5 : 1;
      ref.current.scale.lerp(new THREE.Vector3(s, s, s), 0.1);
    }
  });

  return (
    <group
      ref={ref}
      position={position}
      rotation={rotation}
      onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
      onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
    >
      <mesh>
        <coneGeometry args={[0.15, 0.4, 4]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 2.5 : 1.5} transparent opacity={0.9} />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.06, 0.3, 0.06]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={hovered ? 2 : 1} transparent opacity={0.7} />
      </mesh>
      {hovered && <pointLight color={color} intensity={2} distance={3} />}
    </group>
  );
};

export default GlowingArrow;
