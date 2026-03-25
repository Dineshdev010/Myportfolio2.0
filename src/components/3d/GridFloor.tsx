import * as THREE from 'three';

const GridFloor = ({ mobile = false }: { mobile?: boolean }) => {
  const size = mobile ? 180 : 260;
  const divisions = mobile ? 70 : 130;

  return (
    <group position={[0, -3, -90]}>
      <gridHelper
        args={[size, divisions, new THREE.Color('#00ffff'), new THREE.Color('#003344')]}
        rotation={[0, 0, 0]}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[size, size]} />
        <meshStandardMaterial color="#000811" transparent opacity={0.9} />
      </mesh>
    </group>
  );
};

export default GridFloor;
