import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface DataVizBarProps {
  position: [number, number, number];
  height: number;
  color: string;
  label: string;
  value?: number;
  delay?: number;
}

const DataVizBar = ({ position, height, color, label, value = 0, delay = 0 }: DataVizBarProps) => {
  const ref = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const beaconRef = useRef<THREE.Mesh>(null);
  const frameRef = useRef<THREE.Mesh>(null);
  const currentHeight = useRef(0);
  const [hovered, setHovered] = useState(false);
  const startTime = useRef<number | null>(null);

  useFrame(({ clock }) => {
    if (startTime.current === null) startTime.current = clock.elapsedTime;
    
    const elapsed = clock.elapsedTime - startTime.current - delay;
    const progress = elapsed > 0 ? Math.min(elapsed / 1.5, 1) : 0;
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    
    const targetH = height * eased;
    currentHeight.current += (targetH - currentHeight.current) * 0.08;
    
    const h = Math.max(0.01, currentHeight.current);
    
    if (ref.current) {
      ref.current.scale.y = h;
      ref.current.position.y = position[1] + (h * 0.5) / 2;

      // Hover pulse
      if (hovered) {
        const pulse = 1 + Math.sin(clock.elapsedTime * 4) * 0.05;
        ref.current.scale.x = pulse;
        ref.current.scale.z = pulse;
      } else {
        ref.current.scale.x += (1 - ref.current.scale.x) * 0.1;
        ref.current.scale.z += (1 - ref.current.scale.z) * 0.1;
      }
    }

    if (glowRef.current) {
      glowRef.current.position.y = position[1] + h * 0.5 + 0.05;
      glowRef.current.scale.setScalar(hovered ? 1.2 : 1);
    }

    if (beaconRef.current) {
      beaconRef.current.position.y = position[1] + h * 0.5 + 0.18 + Math.sin(clock.elapsedTime * 3.5 + delay) * 0.08;
    }

    if (frameRef.current) {
      frameRef.current.rotation.y = clock.elapsedTime * 0.35;
    }
  });

  return (
    <group>
      <mesh position={[position[0], position[1] - 0.35, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.35, 0.56, 32]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.8} transparent opacity={0.22} side={THREE.DoubleSide} />
      </mesh>

      {/* Main bar */}
      <mesh
        ref={ref}
        position={position}
        onPointerOver={() => { setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerOut={() => { setHovered(false); document.body.style.cursor = 'default'; }}
      >
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={hovered ? 1.2 : 0.5}
          transparent
          opacity={hovered ? 1 : 0.8}
        />
      </mesh>

      <mesh ref={frameRef} position={[position[0], position[1] + 0.2, position[2]]}>
        <boxGeometry args={[0.58, 0.8, 0.58]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} transparent opacity={0.12} wireframe />
      </mesh>

      {/* Top glow cap */}
      <mesh ref={glowRef} position={[position[0], position[1], position[2]]}>
        <boxGeometry args={[0.55, 0.05, 0.55]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={2}
          transparent
          opacity={0.9}
        />
      </mesh>

      <mesh ref={beaconRef} position={[position[0], position[1] + 0.3, position[2]]}>
        <sphereGeometry args={[0.07, 10, 10]} />
        <meshStandardMaterial color="#ffffff" emissive={color} emissiveIntensity={3} />
      </mesh>

      {/* Label on TOP of bar */}
      <Text
        position={[position[0], position[1] + height * 0.55 + 0.82, position[2]]}
        fontSize={0.17}
        color={color}
        font={undefined}
        anchorX="center"
        anchorY="bottom"
        maxWidth={1.25}
        textAlign="center"
        outlineWidth={0.01}
        outlineColor="#000000"
      >
        {label}
      </Text>

      {/* Value percentage */}
      {value > 0 && (
        <Text
          position={[position[0], position[1] + height * 0.55 + 0.56, position[2]]}
          fontSize={0.14}
          color="#ffffff"
          font={undefined}
          anchorX="center"
          anchorY="bottom"
          outlineWidth={0.01}
          outlineColor="#000000"
        >
          {`${value}%`}
        </Text>
      )}

    </group>
  );
};

export default DataVizBar;
