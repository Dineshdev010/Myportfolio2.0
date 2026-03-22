import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

interface HolographicPanelProps {
  position: [number, number, number];
  width?: number;
  height?: number;
  title: string;
  lines: string[];
  color?: string;
}

const HolographicPanel = ({
  position,
  width = 4,
  height = 3,
  title,
  lines,
  color = '#00ffff',
}: HolographicPanelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Billboard: always face the camera
      groupRef.current.lookAt(camera.position);
      // Float
      groupRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Panel background */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color="#000a1a"
          emissive={color}
          emissiveIntensity={0.08}
          transparent
          opacity={0.9}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Outer border glow */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(width, height)]} />
        <lineBasicMaterial color={color} transparent opacity={0.9} />
      </lineSegments>

      {/* Inner border */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(width - 0.2, height - 0.2)]} />
        <lineBasicMaterial color={color} transparent opacity={0.3} />
      </lineSegments>

      {/* Corner decorations */}
      {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([cx, cy], i) => (
        <mesh key={i} position={[cx * (width / 2 - 0.1), cy * (height / 2 - 0.1), 0.02]}>
          <planeGeometry args={[0.15, 0.15]} />
          <meshBasicMaterial color={color} transparent opacity={0.8} />
        </mesh>
      ))}

      {/* Title */}
      <Text
        position={[0, height / 2 - 0.5, 0.01]}
        fontSize={0.3}
        color={color}
        font={undefined}
        anchorX="center"
      >
        {title}
      </Text>

      {/* Separator line */}
      <mesh position={[0, height / 2 - 0.75, 0.01]}>
        <planeGeometry args={[width - 0.4, 0.015]} />
        <meshBasicMaterial color={color} transparent opacity={0.7} />
      </mesh>

      {/* Scan line effect */}
      <mesh position={[0, 0, 0.005]}>
        <planeGeometry args={[width - 0.3, 0.02]} />
        <meshBasicMaterial color={color} transparent opacity={0.15} />
      </mesh>

      {/* Content lines */}
      {lines.map((line, i) => (
        <Text
          key={i}
          position={[0, height / 2 - 1.1 - i * 0.35, 0.01]}
          fontSize={0.17}
          color="#aaeeff"
          font={undefined}
          anchorX="center"
          maxWidth={width - 0.6}
          textAlign="center"
        >
          {line}
        </Text>
      ))}
    </group>
  );
};

export default HolographicPanel;
