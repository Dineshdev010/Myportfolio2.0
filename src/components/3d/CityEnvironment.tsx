import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Procedural building component
const Building = ({ position, width, height, depth, color, emissiveColor }: {
  position: [number, number, number];
  width: number;
  height: number;
  depth: number;
  color: string;
  emissiveColor: string;
}) => {
  const ref = useRef<THREE.Group>(null);

  // Window rows
  const windowRows = Math.floor(height / 0.6);
  const windowCols = Math.floor(width / 0.4);

  return (
    <group ref={ref} position={position}>
      {/* Main building body */}
      <mesh position={[0, height / 2, 0]} castShadow>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color={color}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Glowing edges */}
      <mesh position={[0, height / 2, 0]}>
        <boxGeometry args={[width + 0.02, height + 0.02, depth + 0.02]} />
        <meshStandardMaterial
          color={emissiveColor}
          emissive={emissiveColor}
          emissiveIntensity={0.3}
          wireframe
          transparent
          opacity={0.15}
        />
      </mesh>

      {/* Windows - front face */}
      {Array.from({ length: Math.min(windowRows, 12) }).map((_, row) =>
        Array.from({ length: Math.min(windowCols, 6) }).map((_, col) => {
          const lit = Math.random() > 0.3;
          return (
            <mesh
              key={`${row}-${col}`}
              position={[
                -width / 2 + 0.3 + col * 0.4,
                0.5 + row * 0.6,
                depth / 2 + 0.01,
              ]}
            >
              <planeGeometry args={[0.2, 0.3]} />
              <meshStandardMaterial
                color={lit ? emissiveColor : '#111122'}
                emissive={lit ? emissiveColor : '#000000'}
                emissiveIntensity={lit ? 1.5 : 0}
                transparent
                opacity={lit ? 0.9 : 0.5}
              />
            </mesh>
          );
        })
      )}

      {/* Rooftop antenna/spire */}
      {height > 4 && (
        <>
          <mesh position={[0, height + 0.5, 0]}>
            <cylinderGeometry args={[0.02, 0.05, 1, 8]} />
            <meshStandardMaterial color={emissiveColor} emissive={emissiveColor} emissiveIntensity={2} />
          </mesh>
          <pointLight position={[0, height + 1, 0]} color={emissiveColor} intensity={0.5} distance={5} />
        </>
      )}
    </group>
  );
};

// Holographic billboard
const HoloBillboard = ({ position, text, color }: {
  position: [number, number, number];
  text: string;
  color: string;
}) => {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const mat = ref.current.material as THREE.MeshStandardMaterial;
      mat.opacity = 0.6 + Math.sin(clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <mesh ref={ref} position={position} rotation={[0, Math.random() * Math.PI * 2, 0]}>
      <planeGeometry args={[2, 1]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={1.5}
        transparent
        opacity={0.7}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

// Flying vehicle (data stream visualization)
const FlyingVehicle = ({ pathRadius, speed, height, color }: {
  pathRadius: number;
  speed: number;
  height: number;
  color: string;
}) => {
  const ref = useRef<THREE.Mesh>(null);
  const trailRef = useRef<THREE.Points>(null);

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = clock.elapsedTime * speed;
      ref.current.position.x = Math.cos(t) * pathRadius;
      ref.current.position.z = Math.sin(t) * pathRadius - 60;
      ref.current.position.y = height + Math.sin(t * 2) * 0.3;
      ref.current.rotation.y = -t + Math.PI / 2;
    }
  });

  return (
    <mesh ref={ref}>
      <coneGeometry args={[0.08, 0.3, 4]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
    </mesh>
  );
};

// Street light
const StreetLight = ({ position, color }: { position: [number, number, number]; color: string }) => (
  <group position={position}>
    <mesh position={[0, 1.5, 0]}>
      <cylinderGeometry args={[0.03, 0.04, 3, 6]} />
      <meshStandardMaterial color="#333344" metalness={0.9} roughness={0.1} />
    </mesh>
    <mesh position={[0.3, 3, 0]}>
      <sphereGeometry args={[0.1, 8, 8]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={3} />
    </mesh>
    <pointLight position={[0.3, 3, 0]} color={color} intensity={1} distance={8} />
  </group>
);

const CityEnvironment = () => {
  const buildings = useMemo(() => {
    const arr: Array<{
      pos: [number, number, number];
      w: number;
      h: number;
      d: number;
      color: string;
      emissive: string;
    }> = [];

    const colors = ['#0a0a1a', '#0d0d2b', '#080820', '#0b0b25', '#060618'];
    const emissives = ['#00ffff', '#00ff88', '#8844ff', '#ff4488', '#44aaff'];

    // Generate buildings along the path (z-axis corridor)
    for (let z = -5; z > -140; z -= 3) {
      // Left side buildings
      const leftCount = Math.floor(Math.random() * 2) + 1;
      for (let j = 0; j < leftCount; j++) {
        const w = 1 + Math.random() * 2;
        const h = 2 + Math.random() * 8;
        const d = 1 + Math.random() * 2;
        const x = -6 - j * 3 - Math.random() * 2;
        arr.push({
          pos: [x, -3, z + Math.random() * 2],
          w, h, d,
          color: colors[Math.floor(Math.random() * colors.length)],
          emissive: emissives[Math.floor(Math.random() * emissives.length)],
        });
      }
      // Right side buildings
      const rightCount = Math.floor(Math.random() * 2) + 1;
      for (let j = 0; j < rightCount; j++) {
        const w = 1 + Math.random() * 2;
        const h = 2 + Math.random() * 8;
        const d = 1 + Math.random() * 2;
        const x = 6 + j * 3 + Math.random() * 2;
        arr.push({
          pos: [x, -3, z + Math.random() * 2],
          w, h, d,
          color: colors[Math.floor(Math.random() * colors.length)],
          emissive: emissives[Math.floor(Math.random() * emissives.length)],
        });
      }
    }

    return arr;
  }, []);

  const streetLights = useMemo(() => {
    const lights: Array<{ pos: [number, number, number]; color: string }> = [];
    const lightColors = ['#00ffff', '#00ff88', '#8844ff'];
    for (let z = 0; z > -140; z -= 8) {
      lights.push({ pos: [-4.5, -3, z], color: lightColors[Math.floor(Math.random() * lightColors.length)] });
      lights.push({ pos: [4.5, -3, z], color: lightColors[Math.floor(Math.random() * lightColors.length)] });
    }
    return lights;
  }, []);

  return (
    <group>
      {/* City buildings */}
      {buildings.map((b, i) => (
        <Building
          key={i}
          position={b.pos}
          width={b.w}
          height={b.h}
          depth={b.d}
          color={b.color}
          emissiveColor={b.emissive}
        />
      ))}

      {/* Street lights */}
      {streetLights.map((l, i) => (
        <StreetLight key={`sl-${i}`} position={l.pos} color={l.color} />
      ))}

      {/* Holographic billboards */}
      <HoloBillboard position={[-5, 4, -15]} text="PYTHON" color="#00ffff" />
      <HoloBillboard position={[6, 5, -40]} text="DATA" color="#00ff88" />
      <HoloBillboard position={[-7, 3, -65]} text="ML" color="#8844ff" />
      <HoloBillboard position={[5, 6, -90]} text="ANALYTICS" color="#ff4488" />

      {/* Flying vehicles / data streams */}
      {[...Array(6)].map((_, i) => (
        <FlyingVehicle
          key={`fv-${i}`}
          pathRadius={8 + i * 2}
          speed={0.3 + i * 0.1}
          height={4 + i * 1.5}
          color={['#00ffff', '#00ff88', '#8844ff', '#ff4488', '#44aaff', '#ffff44'][i]}
        />
      ))}

      {/* Ground fog effect - subtle glow plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.9, -60]}>
        <planeGeometry args={[30, 160]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.05}
          transparent
          opacity={0.1}
        />
      </mesh>

      {/* Volumetric light beams from buildings */}
      {[-20, -50, -80, -110].map((z, i) => (
        <mesh key={`beam-${i}`} position={[0, 5, z]} rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.1, 2, 15, 8, 1, true]} />
          <meshStandardMaterial
            color={['#00ffff', '#00ff88', '#8844ff', '#ff4488'][i]}
            emissive={['#00ffff', '#00ff88', '#8844ff', '#ff4488'][i]}
            emissiveIntensity={0.3}
            transparent
            opacity={0.05}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

export default CityEnvironment;
