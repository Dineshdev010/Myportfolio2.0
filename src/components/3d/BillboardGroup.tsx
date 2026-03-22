import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BillboardGroupProps {
  position: [number, number, number];
  children: React.ReactNode;
}

const BillboardGroup = ({ position, children }: BillboardGroupProps) => {
  const ref = useRef<THREE.Group>(null);

  useFrame(({ camera }) => {
    if (ref.current) {
      ref.current.lookAt(camera.position);
    }
  });

  return (
    <group ref={ref} position={position}>
      {children}
    </group>
  );
};

export default BillboardGroup;
