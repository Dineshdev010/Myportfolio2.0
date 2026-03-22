import { Text } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

interface FloatingTextProps {
  children: string;
  position: [number, number, number];
  fontSize?: number;
  color?: string;
  anchorX?: 'left' | 'center' | 'right';
  anchorY?: 'top' | 'middle' | 'bottom';
  float?: boolean;
  glow?: boolean;
}

const FloatingText = ({
  children,
  position,
  fontSize = 0.5,
  color = '#00ffff',
  anchorX = 'center',
  anchorY = 'middle',
  float = false,
}: FloatingTextProps) => {
  const ref = useRef<THREE.Mesh>(null);
  const { camera } = useThree();
  const initialY = position[1];

  useFrame(({ clock }) => {
    if (ref.current) {
      // Billboard: face the camera
      ref.current.lookAt(camera.position);
      if (float) {
        ref.current.position.y = initialY + Math.sin(clock.elapsedTime * 0.8) * 0.15;
      }
    }
  });

  return (
    <Text
      ref={ref}
      position={position}
      fontSize={fontSize}
      color={color}
      anchorX={anchorX}
      anchorY={anchorY}
      font={undefined}
      maxWidth={8}
      textAlign="center"
      outlineWidth={fontSize * 0.03}
      outlineColor="#000000"
    >
      {children}
    </Text>
  );
};

export default FloatingText;
