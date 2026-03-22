import * as THREE from 'three';

const GridFloor = () => {
  return (
    <group position={[0, -3, -60]}>
      <gridHelper
        args={[200, 100, new THREE.Color('#00ffff'), new THREE.Color('#003344')]}
        rotation={[0, 0, 0]}
      />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[200, 200]} />
        <meshStandardMaterial color="#000811" transparent opacity={0.9} />
      </mesh>
    </group>
  );
};

export default GridFloor;
