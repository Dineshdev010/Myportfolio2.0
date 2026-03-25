import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PythonLogoProps {
  position?: [number, number, number];
  scale?: number;
}

const PythonLogo = ({ position = [0, 0, 0] as [number, number, number], scale = 1.6 }: PythonLogoProps) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.elapsedTime * 0.8;
      groupRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.8) * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      {/* Soft halo */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.26]} renderOrder={8}>
        <ringGeometry args={[1.35, 2.2, 64]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={1.2}
          transparent
          opacity={0.14}
          depthWrite={false}
          depthTest={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Blue snake body */}
      <mesh position={[-0.34, 0.22, 0]}>
        <boxGeometry args={[0.88, 0.38, 0.42]} />
        <meshStandardMaterial color="#3776AB" emissive="#3776AB" emissiveIntensity={0.8} metalness={0.3} roughness={0.2} />
      </mesh>
      <mesh position={[0.06, 0.58, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.42]} />
        <meshStandardMaterial color="#3776AB" emissive="#3776AB" emissiveIntensity={0.8} metalness={0.3} roughness={0.2} />
      </mesh>
      <mesh position={[0.08, 0.95, 0]}>
        <boxGeometry args={[0.88, 0.38, 0.42]} />
        <meshStandardMaterial color="#3776AB" emissive="#3776AB" emissiveIntensity={0.8} metalness={0.3} roughness={0.2} />
      </mesh>
      {/* Blue head dot */}
      <mesh position={[-0.5, 0.58, 0.22]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
      </mesh>

      {/* Yellow snake body */}
      <mesh position={[0.36, -0.22, 0]}>
        <boxGeometry args={[0.88, 0.38, 0.42]} />
        <meshStandardMaterial color="#FFD43B" emissive="#FFD43B" emissiveIntensity={0.8} metalness={0.3} roughness={0.2} />
      </mesh>
      <mesh position={[-0.05, -0.58, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.42]} />
        <meshStandardMaterial color="#FFD43B" emissive="#FFD43B" emissiveIntensity={0.8} metalness={0.3} roughness={0.2} />
      </mesh>
      <mesh position={[-0.08, -0.96, 0]}>
        <boxGeometry args={[0.88, 0.38, 0.42]} />
        <meshStandardMaterial color="#FFD43B" emissive="#FFD43B" emissiveIntensity={0.8} metalness={0.3} roughness={0.2} />
      </mesh>
      {/* Yellow head dot */}
      <mesh position={[0.5, -0.58, 0.22]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={1} />
      </mesh>

      {/* Glow ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0.28]} renderOrder={9}>
        <torusGeometry args={[1.75, 0.035, 24, 96]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={2.6}
          transparent
          opacity={0.45}
          depthWrite={false}
          depthTest={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

export default PythonLogo;
