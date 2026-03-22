import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PythonLogo = ({ position = [0, 0, 0] as [number, number, number] }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.8;
      groupRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.8) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Blue snake body */}
      <mesh position={[-0.3, 0.2, 0]}>
        <boxGeometry args={[0.8, 0.35, 0.35]} />
        <meshStandardMaterial color="#3776AB" emissive="#3776AB" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.05, 0.55, 0]}>
        <boxGeometry args={[0.35, 0.35, 0.35]} />
        <meshStandardMaterial color="#3776AB" emissive="#3776AB" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0.05, 0.9, 0]}>
        <boxGeometry args={[0.8, 0.35, 0.35]} />
        <meshStandardMaterial color="#3776AB" emissive="#3776AB" emissiveIntensity={0.5} />
      </mesh>
      {/* Blue head dot */}
      <mesh position={[-0.45, 0.55, 0.2]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
      </mesh>

      {/* Yellow snake body */}
      <mesh position={[0.3, -0.2, 0]}>
        <boxGeometry args={[0.8, 0.35, 0.35]} />
        <meshStandardMaterial color="#FFD43B" emissive="#FFD43B" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.05, -0.55, 0]}>
        <boxGeometry args={[0.35, 0.35, 0.35]} />
        <meshStandardMaterial color="#FFD43B" emissive="#FFD43B" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[-0.05, -0.9, 0]}>
        <boxGeometry args={[0.8, 0.35, 0.35]} />
        <meshStandardMaterial color="#FFD43B" emissive="#FFD43B" emissiveIntensity={0.5} />
      </mesh>
      {/* Yellow head dot */}
      <mesh position={[0.45, -0.55, 0.2]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
      </mesh>

      {/* Glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.5, 0.02, 16, 64]} />
        <meshStandardMaterial color="#00ffff" emissive="#00ffff" emissiveIntensity={2} transparent opacity={0.4} />
      </mesh>
    </group>
  );
};

export default PythonLogo;
