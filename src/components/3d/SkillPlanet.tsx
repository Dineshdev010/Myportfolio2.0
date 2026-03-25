import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface SkillPlanetProps {
  name: string;
  orbitRadius: number;
  speed: number;
  size: number;
  color: string;
  centerPosition: [number, number, number];
  offset: number;
}

const SkillPlanet = ({ name, orbitRadius, speed, size, color, centerPosition, offset }: SkillPlanetProps) => {
  const ref = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.elapsedTime * speed + offset;
      ref.current.position.x = centerPosition[0] + Math.cos(t) * orbitRadius;
      ref.current.position.y = centerPosition[1] + Math.sin(t * 0.7) * 0.5;
      ref.current.position.z = centerPosition[2] + Math.sin(t) * orbitRadius;
    }
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      const s = hovered ? 1.4 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(s, s, s), 0.1);
    }
  });

  return (
    <group ref={ref}>
      <mesh
        ref={meshRef}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
      >
        <icosahedronGeometry args={[size, 1]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 1.5 : 0.6}
          wireframe={!hovered}
        />
      </mesh>
      {!hovered && (
        <mesh>
          <icosahedronGeometry args={[size * 0.6, 1]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} />
        </mesh>
      )}
      {hovered && (
        <mesh>
          <icosahedronGeometry args={[size * 1.2, 1]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.2} transparent opacity={0.15} wireframe />
        </mesh>
      )}
      <Text
        position={[0, size + 0.3, 0]}
        fontSize={hovered ? 0.28 : 0.22}
        color={color}
        font={undefined}
        anchorX="center"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {name}
      </Text>
    </group>
  );
};

export default SkillPlanet;
