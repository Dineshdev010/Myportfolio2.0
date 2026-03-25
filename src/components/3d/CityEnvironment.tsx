import * as THREE from 'three';

const CityEnvironment = ({ mobile = false }: { mobile?: boolean }) => {
  const sectionPads = mobile ? [-40, -80, -128, -180] : [-40, -60, -80, -102, -128, -154, -180];

  return (
    <group>
      {/* Neon lane rails */}
      {[-4.6, 4.6].map((x) => (
        <mesh key={`rail-${x}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, -2.82, -100]}>
          <planeGeometry args={[0.08, 220]} />
          <meshStandardMaterial
            color="#00ffff"
            emissive="#00ffff"
            emissiveIntensity={0.45}
            transparent
            opacity={0.32}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Center guide strips */}
      {(mobile ? [0] : [-1.2, 0, 1.2]).map((x, i) => (
        <mesh key={`guide-${x}`} rotation={[-Math.PI / 2, 0, 0]} position={[x, -2.83, -100]}>
          <planeGeometry args={[0.06, i === 1 || mobile ? 220 : 170]} />
          <meshStandardMaterial
            color={i === 1 || mobile ? '#00ff88' : '#44aaff'}
            emissive={i === 1 || mobile ? '#00ff88' : '#44aaff'}
            emissiveIntensity={0.25}
            transparent
            opacity={i === 1 || mobile ? 0.22 : 0.12}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Section pads to make the path feel intentional */}
      {sectionPads.map((z, i) => (
        <mesh key={`pad-${z}`} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.81, z]}>
          <ringGeometry args={[3.2, 4.7, mobile ? 20 : 32]} />
          <meshStandardMaterial
            color={['#00ffff', '#00ff88', '#8844ff', '#44aaff', '#ff8844', '#00ffff', '#00ff88'][i]}
            emissive={['#00ffff', '#00ff88', '#8844ff', '#44aaff', '#ff8844', '#00ffff', '#00ff88'][i]}
            emissiveIntensity={0.26}
            transparent
            opacity={0.12}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Ground fog effect - subtle glow plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.9, -100]}>
        <planeGeometry args={[30, 220]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.05}
          transparent
          opacity={0.1}
        />
      </mesh>
    </group>
  );
};

export default CityEnvironment;
