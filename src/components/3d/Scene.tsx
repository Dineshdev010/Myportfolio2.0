import { useRef, useEffect, useMemo, Suspense, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Particles from './Particles';
import PythonLogo from './PythonLogo';
import FloatingText from './FloatingText';
import HolographicPanel from './HolographicPanel';
import SkillPlanet from './SkillPlanet';
import ProjectCube from './ProjectCube';
import DataVizBar from './DataVizBar';
import GlowingArrow from './GlowingArrow';
import GridFloor from './GridFloor';
import KeyboardControls from './KeyboardControls';
import EnergyRing from './EnergyRing';

interface SceneContentProps {
  scrollProgress: number;
  onProjectClick: (project: string) => void;
  onCameraUpdate: (z: number) => void;
}

const CameraController = ({ scrollProgress, onCameraUpdate }: { scrollProgress: number; onCameraUpdate: (z: number) => void }) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>(null);
  const targetZ = useRef(5);

  useEffect(() => {
    targetZ.current = 5 - scrollProgress * 145;
  }, [scrollProgress]);

  useFrame(() => {
    camera.position.z += (targetZ.current - camera.position.z) * 0.05;
    onCameraUpdate(camera.position.z);
    if (controlsRef.current) {
      controlsRef.current.target.set(camera.position.x, camera.position.y, camera.position.z - 5);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      args={[camera, gl.domElement]}
      enableZoom={false}
      enablePan={true}
      enableRotate={true}
      dampingFactor={0.08}
      enableDamping={true}
      rotateSpeed={0.5}
      panSpeed={0.8}
    />
  );
};

const FloatingCode = () => {
  const codeSnippets = useMemo(() => [
    'import pandas as pd',
    'def train_model():',
    'np.array([1,2,3])',
    'model.fit(X, y)',
  ], []);

  return (
    <>
      {codeSnippets.map((code, i) => (
        <FloatingText
          key={i}
          position={[
            (Math.random() - 0.5) * 10,
            (Math.random() - 0.5) * 4,
            -6 - i * 4,
          ]}
          fontSize={0.15}
          color="#00ff88"
          float
        >
          {code}
        </FloatingText>
      ))}
    </>
  );
};

const skills = [
  { name: 'Python', color: '#00ffff', size: 0.35, orbitRadius: 2.5, speed: 0.3, offset: 0 },
  { name: 'Statistics', color: '#f44f13', size: 0.30, orbitRadius: 2, speed: 0.4, offset: 1 },
  { name: 'SQL', color: '#00ff88', size: 0.28, orbitRadius: 2, speed: 0.4, offset: 1 },
  { name: 'Pandas', color: '#8844ff', size: 0.3, orbitRadius: 3, speed: 0.25, offset: 2 },
  { name: 'NumPy', color: '#ff8844', size: 0.25, orbitRadius: 1.8, speed: 0.35, offset: 3 },
  { name: 'ML', color: '#ff4488', size: 0.32, orbitRadius: 2.8, speed: 0.2, offset: 4 },
  { name: 'Power BI', color: '#ddff44', size: 0.27, orbitRadius: 2.2, speed: 0.45, offset: 5 },
  { name: 'Java', color: '#394ef0', size: 0.26, orbitRadius: 1.5, speed: 0.5, offset: 6 },
  { name: 'Data Viz', color: '#44aaff', size: 0.29, orbitRadius: 2.6, speed: 0.28, offset: 7 },
];

const projects = [
  { title: 'Customer Segmentation\nK-Means', color: '#00ffff' },
  { title: 'Sales Prediction\nModel', color: '#00ff88' },
  { title: 'Marketing Campaign\nDashboard', color: '#8844ff' },
  { title: 'Bus Ticket\nReservation', color: '#ff8844' },
  { title: 'Morse Code\nGenerator', color: '#ff4488' },
];

const dataVizData = [
  { label: 'Python', height: 4, color: '#00ffff', value: 95 },
  { label: 'SQL', height: 3.2, color: '#00ff88', value: 80 },
  { label: 'Pandas', height: 3.5, color: '#8844ff', value: 85 },
  { label: 'ML', height: 2.8, color: '#ff4488', value: 20 },
  { label: 'Power BI', height: 3, color: '#44ff88', value: 75 },
  { label: 'Java', height: 2.5, color: '#ffff44', value: 30 },
];

const PortalRing = ({ position, color, radius }: { position: [number, number, number]; color: string; radius: number }) => {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.rotation.z = clock.elapsedTime * 0.5;
      ref.current.rotation.x = Math.sin(clock.elapsedTime * 0.3) * 0.2;
    }
  });
  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[radius, 0.05, 12, 48]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.5} />
    </mesh>
  );
};

const DNAHelix = ({ startZ, endZ, color1 = '#00ffff', color2 = '#ff4488' }: { startZ: number; endZ: number; color1?: string; color2?: string }) => {
  const ref = useRef<THREE.Group>(null);
  const count = 15;

  useFrame(({ clock }) => {
    if (ref.current) {
      ref.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        const t = clock.elapsedTime * 0.5 + i * 0.3;
        mesh.position.x = Math.sin(t) * 1.5;
        mesh.position.y = Math.cos(t) * 1.5;
      });
    }
  });

  return (
    <group ref={ref}>
      {Array.from({ length: count }).map((_, i) => {
        const z = startZ + (endZ - startZ) * (i / count);
        const t = i * 0.5;
        return (
          <mesh key={i} position={[Math.sin(t) * 1.5, Math.cos(t) * 1.5, z]}>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? color1 : color2}
              emissive={i % 2 === 0 ? color1 : color2}
              emissiveIntensity={1}
            />
          </mesh>
        );
      })}
    </group>
  );
};

const SceneContent = ({ scrollProgress, onProjectClick, onCameraUpdate }: SceneContentProps) => {
  const ZONE_ABOUT = -40;
  const ZONE_SKILLS = -55;
  const ZONE_PROJECTS = -80;
  const ZONE_DATA = -105;
  const ZONE_CONTACT = -130;

  return (
    <>
      <CameraController scrollProgress={scrollProgress} onCameraUpdate={onCameraUpdate} />
      <KeyboardControls />

      {/* Lighting — reduced to 3 dynamic + ambient */}
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 5, 0]} intensity={2} color="#00ffff" distance={80} />
      <pointLight position={[5, 3, -65]} intensity={1.5} color="#8844ff" distance={80} />
      <pointLight position={[-5, 3, -115]} intensity={1.5} color="#00ff88" distance={80} />

      <fog attach="fog" args={['#000811', 30, 100]} />
      <Stars radius={100} depth={80} count={3000} factor={4} fade speed={0.5} />
      <Particles count={800} spread={60} />
      <GridFloor />

      {/* === LANDING ZONE (z=0) === */}
      <PythonLogo position={[0, 0.5, -2]} />
      <EnergyRing position={[0, 0.5, -2]} color="#00ffff" radius={3} speed={0.3} axis="y" />

      <Suspense fallback={null}>
        <FloatingText position={[0, 2.8, -2]} fontSize={0.5} color="#00ffff">
          DINESH RAJA
        </FloatingText>
        <FloatingText position={[0, 2.1, -2]} fontSize={0.22} color="#00ff88">
          Python Developer | Data Analyst
        </FloatingText>
        <FloatingText position={[0, -1.8, -2]} fontSize={0.15} color="#00ffff" float>
          Scroll to explore
        </FloatingText>
      </Suspense>

      <GlowingArrow position={[0, -2.8, -2]} rotation={[Math.PI, 0, 0]} />

      <Suspense fallback={null}>
        <FloatingCode />
      </Suspense>

      {/* Portal */}
      <PortalRing position={[0, 0, -12]} color="#00ffff" radius={3} />
      <PortalRing position={[0, 0, -13]} color="#00ff88" radius={2.5} />

      {/* DNA Helixes — reduced count */}
      <DNAHelix startZ={-15} endZ={-28} color1="#00ffff" color2="#00ff88" />
      <DNAHelix startZ={-32} endZ={-53} color1="#00ff88" color2="#8844ff" />
      <DNAHelix startZ={-57} endZ={-78} color1="#8844ff" color2="#ff8844" />
      <DNAHelix startZ={-82} endZ={-103} color1="#ff8844" color2="#00ffff" />
      <DNAHelix startZ={-107} endZ={-128} color1="#00ffff" color2="#00ff88" />

      {/* === ZONE 1: ABOUT ME === */}
       <Suspense fallback={null}>
        <FloatingText position={[0, 4.5, ZONE_ABOUT]} fontSize={0.4} color="#00ffff">
         ABOUT ME
        </FloatingText>
      </Suspense>
      <HolographicPanel
        position={[0, 0, ZONE_ABOUT]}
        width={7}
        height={7}
        title="DINESH RAJA"
        lines={[
  'Python Developer & Data Analyst',
  '',
  'Passionate about transforming complex, raw datasets into actionable insights',
  'that help businesses make informed, strategic decisions.',
  'Proficient in Python programming, Machine Learning, and Data Visualization,',
  'with hands-on experience in analyzing large datasets, building predictive models and designing intuitive dashboards.','',
  'Committed to developing intelligent solutions that optimize processes,',
  'uncover hidden trends, and drive measurable business outcomes.',
  '',
  'Continuously exploring emerging technologies including AI, Cloud Computing,',
  'and advanced analytics to innovate and push boundaries in data-driven solutions.',
  '',
  'Dedicated to lifelong learning, problem-solving, and delivering meaningful impact',
  'through data, technology, and creative thinking.',
]}
      />

      {/* === ZONE 2: SKILLS GALAXY === */}
      
       <Suspense fallback={null}>
        <FloatingText position={[0, 4.5, ZONE_SKILLS]} fontSize={0.4} color="#00ffff">
          SKILLS GALAXY
        </FloatingText>
      </Suspense>
      {skills.map((skill, i) => (
        <SkillPlanet
          key={skill.name}
          name={skill.name}
          orbitRadius={skill.orbitRadius}
          speed={skill.speed}
          size={skill.size}
          color={skill.color}
          centerPosition={[0, 0, ZONE_SKILLS]}
          offset={skill.offset + i}
        />
      ))}
      <mesh position={[0, 0, ZONE_SKILLS]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color="#ffffff" emissive="#00ffff" emissiveIntensity={3} />
      </mesh>

      {/* === ZONE 3: PROJECTS LAB === */}
      <Suspense fallback={null}>
        <FloatingText position={[0, 4.5, ZONE_PROJECTS]} fontSize={0.4} color="#ff8844">
          PROJECTS LAB
        </FloatingText>
      </Suspense>
      {projects.map((project, i) => {
        // 2 rows: top row 3, bottom row 2 — spread out so nothing overlaps
        const row = i < 3 ? 0 : 1;
        const col = row === 0 ? (i - 1) : (i - 3.5);
        return (
          <ProjectCube
            key={project.title}
            title={project.title}
            position={[
              col * 3.2,
              row === 0 ? 1.5 : -1.2,
              ZONE_PROJECTS,
            ]}
            color={project.color}
            onClick={() => onProjectClick(project.title)}
          />
        );
      })}

      {/* === ZONE 4: DATA VIZ === */}
      <Suspense fallback={null}>
        <FloatingText position={[0, 4.5, ZONE_DATA]} fontSize={0.4} color="#00ffff">
          DATA VISUALIZATION
        </FloatingText>
      </Suspense>
      {dataVizData.map((d, i) => (
        <DataVizBar
          key={d.label}
          position={[(i - 2.5) * 1.6, -1.5, ZONE_DATA]}
          height={d.height}
          color={d.color}
          label={d.label}
          value={d.value}
          delay={i * 0.15}
        />
      ))}

      {/* === ZONE 5: CONTACT === */}
     <Suspense fallback={null}>
        <FloatingText position={[0, 4.5, ZONE_CONTACT]} fontSize={0.4} color="#00ffff">
          CONTACT
        </FloatingText>
      </Suspense>
      <HolographicPanel
        position={[0, 0, ZONE_CONTACT]}
        width={6}
        height={5.5}
        title="GET IN TOUCH"
        color="#00ff88"
        lines={[
          '> Email: dineshjas986@gmail.com',
          '',
          '> GitHub: github.com/Dineshdev010',
          '',
          '> LinkedIn: linkedin.com/in/dinesh-raja-m-26116b251/',
          '',
          '[ DOWNLOAD RESUME TO CONTINUE TOGHETHER]',
          '',
          'Status: Open for opportunities',
          'Location: Ready to work remotely',
          '',
          "Let's build something amazing together!",
        ]}
      />

      {/* Navigation arrows */}
      <GlowingArrow position={[0, -2, -20]} rotation={[Math.PI, 0, 0]} color="#00ffff" />
      <GlowingArrow position={[0, -2, -45]} rotation={[Math.PI, 0, 0]} color="#00ff88" />
      <GlowingArrow position={[0, -2, -70]} rotation={[Math.PI, 0, 0]} color="#8844ff" />
      <GlowingArrow position={[0, -2, -95]} rotation={[Math.PI, 0, 0]} color="#ff8844" />
      <GlowingArrow position={[0, -2, -120]} rotation={[Math.PI, 0, 0]} color="#00ff88" />
    </>
  );
};

interface SceneProps {
  scrollProgress: number;
  onProjectClick: (project: string) => void;
}

const Scene = ({ scrollProgress, onProjectClick }: SceneProps) => {
  return (
    <div className="fixed inset-0 w-screen h-screen">
      <Canvas
        camera={{ position: [0, 0.5, 5], fov: 75, near: 0.1, far: 200 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        dpr={[1, 1.5]}
        onCreated={({ gl }) => {
          gl.setClearColor('#000811');
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.2;
        }}
      >
        <SceneContent
          scrollProgress={scrollProgress}
          onProjectClick={onProjectClick}
          onCameraUpdate={() => {}}
        />
      </Canvas>
    </div>
  );
};

export default Scene;
