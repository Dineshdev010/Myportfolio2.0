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
  const ref = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const pulseRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [touched, setTouched] = useState(false);
  const touchTime = useRef(0);
  const targetScale = useRef(new THREE.Vector3(1, 1, 1));

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.y = clock.elapsedTime * 0.3;
      ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.5) * 0.1;
      const scale = hovered ? 1.18 : 1;
      targetScale.current.set(scale, scale, scale);
      ref.current.scale.lerp(targetScale.current, 0.1);
      ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.8 + position[0]) * 0.15;
    }
    if (ringRef.current) {
      ringRef.current.rotation.z = clock.elapsedTime * 0.8;
      ringRef.current.visible = hovered || touched;
    }
    if (glowRef.current) {
      const material = glowRef.current.material as THREE.MeshStandardMaterial;
      material.opacity += ((hovered ? 0.3 : 0.16) - material.opacity) * 0.12;
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
      {/* Hover frame */}
      <mesh ref={ringRef} visible={false} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.34, 0]}>
        <ringGeometry args={[0.72, 1.02, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.45} side={THREE.DoubleSide} />
      </mesh>

      {/* Touch pulse ripple */}
      {touched && (
        <mesh ref={pulseRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.24, 0]}>
          <ringGeometry args={[0.4, 0.5, 32]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} transparent opacity={0.8} side={THREE.DoubleSide} />
        </mesh>
      )}

      <group
        ref={ref}
        onClick={handleClick}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
      >
        <mesh ref={glowRef} position={[0, 0, -0.08]}>
          <boxGeometry args={[1.04, 1.2, 0.58]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.5}
            transparent
            opacity={0.16}
          />
        </mesh>

        <mesh>
          <boxGeometry args={[0.92, 1.06, 0.5]} />
          <meshStandardMaterial
            color="#06111d"
            emissive={color}
            emissiveIntensity={hovered ? 0.22 : 0.08}
            metalness={0.35}
            roughness={0.28}
            transparent
            opacity={0.96}
          />
        </mesh>

        <mesh position={[0, 0, 0.26]}>
          <planeGeometry args={[0.8, 0.92]} />
          <meshStandardMaterial
            color="#0b1825"
            emissive={color}
            emissiveIntensity={hovered ? 0.2 : 0.08}
            transparent
            opacity={0.92}
          />
        </mesh>

        <mesh position={[0, 0.42, 0.26]}>
          <planeGeometry args={[0.8, 0.08]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2.4} transparent opacity={0.85} />
        </mesh>

        {[-0.37, 0.37].map((x) => (
          <mesh key={x} position={[x, 0, 0.26]}>
            <planeGeometry args={[0.04, 0.84]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.5} transparent opacity={0.45} />
          </mesh>
        ))}
      </group>

      {hovered && (
        <pointLight color={color} intensity={2} distance={3} />
      )}

      <Text
        position={[0, -0.28, 0.28]}
        fontSize={0.16}
        color={color}
        font={undefined}
        anchorX="center"
        anchorY="middle"
        maxWidth={1.6}
        lineHeight={1.1}
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
