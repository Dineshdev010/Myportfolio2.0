import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface ProjectCubeProps {
  title: string;
  position: [number, number, number];
  color: string;
  onClick: () => void;
}

const ProjectCube = ({ title, position, color, onClick }: ProjectCubeProps) => {
  const ref = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [touched, setTouched] = useState(false);
  const touchTime = useRef(0);

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.3;
      ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.5) * 0.1;
      const scale = hovered ? 1.3 : 1;
      ref.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
      ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.8 + position[0]) * 0.15;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = clock.elapsedTime * 1.5;
      ringRef.current.visible = hovered;
    }
    // Pulse ripple on touch
    if (pulseRef.current && touched) {
      const elapsed = clock.elapsedTime - touchTime.current;
      const mat = pulseRef.current.material as THREE.MeshStandardMaterial;
      const s = 1 + elapsed * 3;
      pulseRef.current.scale.set(s, s, s);
      mat.opacity = Math.max(0, 0.8 - elapsed * 1.5);
      if (elapsed > 0.6) setTouched(false);
    }
  });

  const handleClick = (e: any) => {
    e.stopPropagation();
    setTouched(true);
    touchTime.current = e.eventObject ? performance.now() / 1000 : 0;
    // Sync with clock
    onClick();
  };

  return (
    <group position={position}>
      {/* Hover ring */}
      <mesh ref={ringRef} visible={false}>
        <torusGeometry args={[0.7, 0.02, 16, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.8} />
      </mesh>

      {/* Touch pulse ripple */}
      {touched && (
        <mesh ref={pulseRef}>
          <ringGeometry args={[0.4, 0.5, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}
      
      <mesh
        ref={ref}
        onClick={handleClick}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
      >
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 1.2 : 0.4}
          wireframe={!hovered}
        />
      </mesh>

      {hovered && (
        <pointLight color={color} intensity={2} distance={3} />
      )}

      <Text
        position={[0, -0.8, 0]}
        fontSize={0.14}
        color={color}
        font={undefined}
        anchorX="center"
        maxWidth={2}
        textAlign="center"
        outlineWidth={0.008}
        outlineColor="#000000"
      >
        {title}
      </Text>
    </group>
  );
};

export default ProjectCube;
