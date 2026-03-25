import { useRef, useEffect, useMemo, Suspense, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, OrbitControls, Text } from '@react-three/drei';
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
import CityEnvironment from './CityEnvironment';
import SceneErrorBoundary from './SceneErrorBoundary';

interface SceneContentProps {
  scrollProgress: number;
  onProjectClick: (project: string) => void;
  isTouchDevice: boolean;
  viewportWidth: number;
  viewportHeight: number;
}

const CameraController = ({
  scrollProgress,
  isTouchDevice,
  viewportWidth,
}: {
  scrollProgress: number;
  isTouchDevice: boolean;
  viewportWidth: number;
}) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>(null);
  const targetZ = useRef(5);
  const sceneTravel = 225;
  const isSmallScreen = viewportWidth < 768;
  const controlProfile = useMemo(() => {
    if (isTouchDevice) {
      return {
        dampingFactor: isSmallScreen ? 0.13 : 0.11,
        rotateSpeed: isSmallScreen ? 0.42 : 0.5,
        panSpeed: isSmallScreen ? 0.5 : 0.62,
      };
    }

    return {
      dampingFactor: 0.08,
      rotateSpeed: 0.62,
      panSpeed: 0.88,
    };
  }, [isSmallScreen, isTouchDevice]);

  useEffect(() => {
    targetZ.current = 5 - scrollProgress * sceneTravel;
  }, [scrollProgress]);

  useFrame(() => {
    camera.position.z += (targetZ.current - camera.position.z) * 0.05;
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
      enablePan={!isTouchDevice}
      enableRotate={!isTouchDevice}
      dampingFactor={controlProfile.dampingFactor}
      enableDamping={true}
      rotateSpeed={controlProfile.rotateSpeed}
      panSpeed={controlProfile.panSpeed}
      screenSpacePanning={true}
      minPolarAngle={Math.PI * 0.25}
      maxPolarAngle={Math.PI * 0.75}
      mouseButtons={{
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.PAN,
        RIGHT: THREE.MOUSE.PAN,
      }}
      touches={{
        ONE: THREE.TOUCH.PAN,
        TWO: THREE.TOUCH.DOLLY_PAN,
      }}
    />
  );
};

const FloatingCode = () => {
  const codeSnippets = useMemo(() => ([
    { code: 'import pandas as pd', position: [-4.6, 1.8, -6] as [number, number, number] },
    { code: 'def train_model():', position: [4.2, 1.1, -10] as [number, number, number] },
    { code: 'np.array([1,2,3])', position: [-3.3, -0.4, -13] as [number, number, number] },
    { code: 'model.fit(X, y)', position: [4.8, -1.1, -16] as [number, number, number] },
  ]), []);

  return (
    <>
      {codeSnippets.map((code, i) => (
        <FloatingText
          key={i}
          position={code.position}
          fontSize={0.18}
          color="#00ff88"
          float
        >
          {code.code}
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

const projectPositions: Array<[number, number, number]> = [
  [-6.2, 0.95, 1.2],
  [-3.1, 1.45, 0.6],
  [0, 1.85, 0],
  [3.1, 1.45, 0.6],
  [6.2, 0.95, 1.2],
];

const experienceLines = [
  'Python Developer and Data Analyst focused on automation, reporting, and insight generation.',
  '',
  'Built dashboards, cleaned large datasets, and created predictive workflows for business use cases.',
  '',
  'Hands-on with Python, SQL, Pandas, Power BI, and machine learning model experimentation.',
  '',
  'Comfortable translating raw data into clear stories, KPIs, and decision-ready reports.',
];

const certificates = [
  {
    title: 'Google Data Analytics',
    color: '#00ffff',
    position: [-4.4, 1.3, 0] as [number, number, number],
    url: 'https://www.coursera.org/professional-certificates/google-data-analytics',
    lines: [
      'Professional Certificate',
      '',
      'Data cleaning, SQL,',
      'spreadsheets, and',
      'dashboard storytelling.',
    ],
  },
  {
    title: 'Python Data Science',
    color: '#00ff88',
    position: [0, 0.5, 0] as [number, number, number],
    url: 'https://www.coursera.org/learn/python-for-applied-data-science-ai',
    lines: [
      'Python Certificate',
      '',
      'NumPy, Pandas, data',
      'wrangling, and',
      'analysis workflows.',
    ],
  },
  {
    title: 'Power BI Analytics',
    color: '#8844ff',
    position: [4.4, 1.3, 0] as [number, number, number],
    url: 'https://learn.microsoft.com/en-us/credentials/certifications/power-bi-data-analyst-associate/',
    lines: [
      'Visualization Certificate',
      '',
      'Reports, KPIs, DAX,',
      'interactive dashboards,',
      'and business insights.',
    ],
  },
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
  const count = 10;

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

const DataTrendLine = ({ zoneZ, barSpacing, barBaseY }: { zoneZ: number; barSpacing: number; barBaseY: number }) => {
  const trendColor = '#00ffff';
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  const points = useMemo(
    () =>
      dataVizData.map((d, i) => {
        const x = (i - 2.5) * barSpacing;
        const y = barBaseY + d.height * 0.5 + 0.12;
        return new THREE.Vector3(x, y, zoneZ + 0.18);
      }),
    [barBaseY, barSpacing, zoneZ],
  );

  const curve = useMemo(() => new THREE.CatmullRomCurve3(points), [points]);

  useFrame(({ clock }) => {
    if (!materialRef.current) return;
    materialRef.current.emissiveIntensity = 1.7 + Math.sin(clock.elapsedTime * 3) * 0.35;
  });

  return (
    <group>
      <mesh>
        <tubeGeometry args={[curve, 120, 0.028, 12, false]} />
        <meshStandardMaterial ref={materialRef} color={trendColor} emissive={trendColor} emissiveIntensity={1.8} transparent opacity={0.9} />
      </mesh>
      {points.map((p, i) => (
        <mesh key={`trend-node-${i}`} position={[p.x, p.y, p.z]}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial color="#ffffff" emissive={trendColor} emissiveIntensity={2.4} />
        </mesh>
      ))}
    </group>
  );
};

const HeroName = ({
  text,
  position,
  fontSize,
  color,
}: {
  text: string;
  position: [number, number, number];
  fontSize: number;
  color: string;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const pulse = 1 + Math.sin(clock.elapsedTime * 1.8) * 0.03;
    groupRef.current.scale.set(pulse, pulse, pulse);
    groupRef.current.position.set(
      position[0],
      position[1] + Math.sin(clock.elapsedTime * 0.9) * 0.06,
      position[2],
    );
    groupRef.current.lookAt(camera.position);
  });

  return (
    <group ref={groupRef} position={position}>
      <Text
        position={[0, 0, 0]}
        fontSize={fontSize}
        color={color}
        font={undefined}
        anchorX="center"
        anchorY="middle"
        maxWidth={8}
        textAlign="center"
        outlineWidth={fontSize * 0.03}
        outlineColor="#000000"
      >
        {text}
      </Text>
    </group>
  );
};

const SceneContent = ({ scrollProgress, onProjectClick, isTouchDevice, viewportWidth, viewportHeight }: SceneContentProps) => {
  const ZONE_ABOUT = -40;
  const ZONE_EXPERIENCE = -60;
  const ZONE_SKILLS = -80;
  const ZONE_CERTIFICATES = -102;
  const ZONE_PROJECTS = -128;
  const ZONE_DATA = -154;
  const ZONE_CONTACT = -195;
  const ZONE_OUTRO = -220;
  const isMobile = viewportWidth < 640;
  const isTablet = viewportWidth >= 640 && viewportWidth < 1024;
  const lowQualityMobile = isTouchDevice || isMobile;
  const isShortViewport = viewportHeight < 760;
  const isVeryShortViewport = viewportHeight < 680;
  const widthScale = isMobile ? 0.72 : isTablet ? 0.86 : 1;
  const heightScale = isVeryShortViewport ? 0.78 : isShortViewport ? 0.88 : 1;
  const responsiveScale = Number((widthScale * heightScale).toFixed(3));
  const headingScale = Number(((isMobile ? 0.8 : isTablet ? 0.9 : 1) * (isVeryShortViewport ? 0.9 : isShortViewport ? 0.95 : 1)).toFixed(3));
  const barSpacing = isMobile ? 1.08 : isTablet ? 1.3 : 1.6;
  const certificateXScale = isMobile ? 0.62 : isTablet ? 0.8 : 1;
  const projectXScale = isMobile ? 0.6 : isTablet ? 0.82 : 1;

  const rs = (value: number) => Number((value * responsiveScale).toFixed(3));

  return (
    <>
      <CameraController
        scrollProgress={scrollProgress}
        isTouchDevice={isTouchDevice}
        viewportWidth={viewportWidth}
      />
      <KeyboardControls />

      {/* Lighting — reduced to 3 dynamic + ambient */}
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 5, 0]} intensity={2} color="#00ffff" distance={80} />
      <pointLight position={[5, 3, -65]} intensity={1.5} color="#8844ff" distance={80} />
      <pointLight position={[-5, 3, -115]} intensity={1.5} color="#00ff88" distance={80} />

      <fog attach="fog" args={['#000811', 30, 220]} />
      <Stars radius={lowQualityMobile ? 70 : 90} depth={lowQualityMobile ? 50 : 70} count={lowQualityMobile ? 420 : 1200} factor={lowQualityMobile ? 2 : 3} fade speed={0.35} />
      <Particles count={lowQualityMobile ? 140 : 320} spread={lowQualityMobile ? 38 : 50} />
      <GridFloor mobile={lowQualityMobile} />
      <CityEnvironment mobile={lowQualityMobile} />

      {/* === LANDING ZONE (z=0) === */}
      <PythonLogo position={[0, isMobile ? 0.12 : 0.02, -2]} scale={isMobile ? 1.18 : isTablet ? 1.3 : 1.45} />
      <EnergyRing position={[0, 0.1, -2]} color="#00ffff" radius={3} speed={0.3} axis="y" />

      <Suspense fallback={null}>
        <HeroName
          text="DINESH RAJA"
          position={[0, isMobile ? 3.2 : 3.6, -2]}
          fontSize={0.56 * headingScale}
          color="#00ffff"
        />
        <HeroName
          text="Python Developer | Data Analyst"
          position={[0, isMobile ? 2.35 : 2.6, -2]}
          fontSize={0.24 * headingScale}
          color="#00ff88"
        />
        <FloatingText position={[0, isMobile ? -2.05 : -2.25, -2]} fontSize={0.18 * headingScale} color="#00ffff" float>
          Scroll to explore
        </FloatingText>
      </Suspense>

      <GlowingArrow position={[0, isMobile ? -2.95 : -3.15, -2]} rotation={[Math.PI, 0, 0]} />

      <Suspense fallback={null}>
        <FloatingCode />
      </Suspense>

      {/* Portal */}
      {!lowQualityMobile && <PortalRing position={[0, 0, -12]} color="#00ffff" radius={3} />}
      {!lowQualityMobile && <PortalRing position={[0, 0, -13]} color="#00ff88" radius={2.5} />}

      {/* DNA Helixes — reduced count */}
      {lowQualityMobile ? (
        <>
          <DNAHelix startZ={-28} endZ={-62} color1="#00ff88" color2="#8844ff" />
          <DNAHelix startZ={-96} endZ={-132} color1="#ff8844" color2="#00ffff" />
          <DNAHelix startZ={-150} endZ={-178} color1="#8844ff" color2="#ff4488" />
        </>
      ) : (
        <>
          <DNAHelix startZ={-15} endZ={-28} color1="#00ffff" color2="#00ff88" />
          <DNAHelix startZ={-32} endZ={-53} color1="#00ff88" color2="#8844ff" />
          <DNAHelix startZ={-57} endZ={-78} color1="#8844ff" color2="#ff8844" />
          <DNAHelix startZ={-82} endZ={-103} color1="#ff8844" color2="#00ffff" />
          <DNAHelix startZ={-107} endZ={-128} color1="#00ffff" color2="#00ff88" />
          <DNAHelix startZ={-132} endZ={-153} color1="#00ff88" color2="#8844ff" />
          <DNAHelix startZ={-157} endZ={-178} color1="#8844ff" color2="#ff4488" />
        </>
      )}

      {/* === ZONE 1: ABOUT ME === */}
       <Suspense fallback={null}>
        <FloatingText position={[0, 4.9, ZONE_ABOUT]} fontSize={0.52 * headingScale} color="#00ffff">
         ABOUT ME
        </FloatingText>
      </Suspense>
      <HolographicPanel
        position={[0, isMobile ? (isShortViewport ? 0.9 : 1.0) : 0.8, ZONE_ABOUT]}
        width={rs(8.2)}
        height={rs(7.6)}
        title="DINESH RAJA"
        titleFontSize={0.34 * responsiveScale}
        titleY={rs(2.22)}
        titleSeparatorY={rs(1.28)}
        contentFontSize={0.18 * responsiveScale}
        contentLineStep={rs(0.26)}
        contentMaxWidth={rs(7.0)}
        contentStartOffset={rs(1.9)}
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

      {/* === ZONE 2: EXPERIENCE === */}
      <Suspense fallback={null}>
        <FloatingText position={[0, 4.9, ZONE_EXPERIENCE]} fontSize={0.52 * headingScale} color="#00ff88">
          EXPERIENCE
        </FloatingText>
      </Suspense>
      <HolographicPanel
        position={[0, isMobile ? (isShortViewport ? 0.9 : 1.0) : 0.8, ZONE_EXPERIENCE]}
        width={rs(8.0)}
        height={rs(7.0)}
        title="PROFESSIONAL SNAPSHOT"
        titleFontSize={0.32 * responsiveScale}
        titleY={rs(2.02)}
        titleSeparatorY={rs(1.18)}
        color="#00ff88"
        contentFontSize={0.17 * responsiveScale}
        contentLineStep={rs(0.26)}
        contentMaxWidth={rs(6.8)}
        contentStartOffset={rs(1.85)}
        lines={experienceLines}
      />

      {/* === ZONE 3: SKILLS GALAXY === */}
      <Suspense fallback={null}>
        <FloatingText position={[0, 4.9, ZONE_SKILLS]} fontSize={0.52 * headingScale} color="#00ffff">
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

      {/* === ZONE 4: CERTIFICATES === */}
      <Suspense fallback={null}>
        <FloatingText position={[0, 4.9, ZONE_CERTIFICATES]} fontSize={0.52 * headingScale} color="#00ffff">
          CERTIFICATES
        </FloatingText>
      </Suspense>
      {certificates.map((certificate) => (
        <HolographicPanel
          key={certificate.title}
          position={[
            certificate.position[0] * certificateXScale,
            isMobile ? certificate.position[1] + 0.35 : certificate.position[1],
            ZONE_CERTIFICATES,
          ]}
          width={rs(3.9)}
          height={rs(5.2)}
          title={certificate.title}
          titleFontSize={0.24 * responsiveScale}
          titleY={rs(2.02)}
          titleMaxWidth={rs(3.3)}
          titleSeparatorY={rs(1.32)}
          color={certificate.color}
          lines={certificate.lines}
          contentFontSize={0.15 * responsiveScale}
          contentLineStep={rs(0.28)}
          contentMaxWidth={rs(2.7)}
          footerLabel="Open Certificate"
          onClick={() => window.open(certificate.url, '_blank', 'noopener,noreferrer')}
        />
      ))}

      {/* === ZONE 5: PROJECTS LAB === */}
      <Suspense fallback={null}>
        <FloatingText position={[0, 5.95, ZONE_PROJECTS]} fontSize={0.46 * headingScale} color="#ff8844">
          PROJECTS LAB
        </FloatingText>
      </Suspense>
      <mesh position={[0, -0.4, ZONE_PROJECTS]}>
        <cylinderGeometry args={[6.8, 6.8, 0.18, 48]} />
        <meshStandardMaterial
          color="#07111d"
          emissive="#ff8844"
          emissiveIntensity={0.08}
          transparent
          opacity={0.92}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.28, ZONE_PROJECTS]}>
        <ringGeometry args={[4.8, 6.4, 48]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.18}
          transparent
          opacity={0.18}
          side={THREE.DoubleSide}
        />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.27, ZONE_PROJECTS]}>
        <circleGeometry args={[3.8, 48]} />
        <meshStandardMaterial
          color="#03111d"
          emissive="#00ff88"
          emissiveIntensity={0.05}
          transparent
          opacity={0.45}
          side={THREE.DoubleSide}
        />
      </mesh>
      {projects.map((project, i) => {
        const [x, y, zOffset] = projectPositions[i];
        return (
          <ProjectCube
            key={project.title}
            title={project.title}
            position={[
              x * projectXScale,
              isMobile ? y + 0.2 : y,
              ZONE_PROJECTS + zOffset,
            ]}
            color={project.color}
            onClick={() => onProjectClick(project.title)}
          />
        );
      })}

      {/* === ZONE 6: DATA VIZ === */}
      <Suspense fallback={null}>
        <FloatingText position={[0, 4.9, ZONE_DATA]} fontSize={0.52 * headingScale} color="#00ffff">
          DATA VISUALIZATION
        </FloatingText>
      </Suspense>
      <mesh position={[0, -2.12, ZONE_DATA]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[12.5, 7.2]} />
        <meshStandardMaterial color="#04121d" emissive="#00ffff" emissiveIntensity={0.1} transparent opacity={0.45} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, -2.08, ZONE_DATA]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.2, 5.9, 64]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.55} transparent opacity={0.18} side={THREE.DoubleSide} />
      </mesh>
      <DataTrendLine zoneZ={ZONE_DATA} barSpacing={barSpacing} barBaseY={-1.5} />
      {dataVizData.map((d, i) => (
        <DataVizBar
          key={d.label}
          position={[(i - 2.5) * barSpacing, -1.5, ZONE_DATA]}
          height={d.height}
          color={d.color}
          label={d.label}
          value={d.value}
          delay={i * 0.15}
        />
      ))}

      {/* === ZONE 7: CONTACT === */}
      <Suspense fallback={null}>
        <FloatingText position={[0, 4.9, ZONE_CONTACT]} fontSize={0.52 * headingScale} color="#00ffff">
          CONTACT
        </FloatingText>
      </Suspense>
      <HolographicPanel
        position={[0, isMobile ? 1.25 : 1.0, ZONE_CONTACT]}
        width={rs(7.3)}
        height={rs(7.0)}
        title="GET IN TOUCH"
        titleFontSize={0.26 * responsiveScale}
        titleY={rs(2.12)}
        titleSeparatorY={rs(1.28)}
        color="#00ff88"
        contentFontSize={0.165 * responsiveScale}
        contentLineStep={rs(0.32)}
        contentMaxWidth={rs(6.1)}
        contentStartOffset={rs(2.08)}
          lines={[
            '> Email: dineshjas986@gmail.com',
            '',
            '> GitHub: github.com/Dineshdev010',
            '',
            '> LinkedIn: linkedin.com/in/dinesh-raja-m-26116b251/',
            '',
            '[ DOWNLOAD RESUME TO CONTINUE TOGETHER ]',
            '',
            'Status: Open for opportunities',
            'Location: Ready to work remotely',
          '',
            "Let's build something amazing together!",
        ]}
      />

      {/* === ZONE 8: OUTRO === */}
      <Suspense fallback={null}>
        <FloatingText position={[0, 5.2, ZONE_OUTRO]} fontSize={0.5 * headingScale} color="#00ff88">
          SYSTEM COMPLETE
        </FloatingText>
      </Suspense>
      <HolographicPanel
        position={[0, isMobile ? (isShortViewport ? 0.72 : 0.8) : 0.6, ZONE_OUTRO]}
        width={rs(7.5)}
        height={rs(5.0)}
        title="FINAL TRANSMISSION"
        titleFontSize={0.35 * responsiveScale}
        titleY={rs(1.92)}
        titleSeparatorY={rs(1.08)}
        color="#00ffff"
        lines={[
          'Thanks for exploring the portfolio.',
          '',
          'The journey ends here, but the ideas keep moving.',
          '',
          'Open to new projects, collaborations,',
          'and creative data-driven challenges.',
          '',
          'Build something bold next.',
        ]}
        contentFontSize={0.17 * responsiveScale}
        contentLineStep={rs(0.26)}
        contentMaxWidth={rs(6.2)}
      />

      {/* Navigation arrows */}
      <GlowingArrow position={[0, -2, -20]} rotation={[Math.PI, 0, 0]} color="#00ffff" />
      <GlowingArrow position={[0, -2, -45]} rotation={[Math.PI, 0, 0]} color="#00ff88" />
      <GlowingArrow position={[0, -2, -70]} rotation={[Math.PI, 0, 0]} color="#00ffff" />
      <GlowingArrow position={[0, -2, -95]} rotation={[Math.PI, 0, 0]} color="#8844ff" />
      <GlowingArrow position={[0, -2, -120]} rotation={[Math.PI, 0, 0]} color="#ff8844" />
      <GlowingArrow position={[0, -2, -145]} rotation={[Math.PI, 0, 0]} color="#00ff88" />
      <GlowingArrow position={[0, -2, -170]} rotation={[Math.PI, 0, 0]} color="#00ffff" />
      <GlowingArrow position={[0, -2, -195]} rotation={[Math.PI, 0, 0]} color="#00ff88" />
    </>
  );
};

interface SceneProps {
  scrollProgress: number;
  onProjectClick: (project: string) => void;
}

const SceneFallback = () => (
  <div className="fixed inset-0 overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(0,255,255,0.12),_transparent_35%),linear-gradient(180deg,_#03111d_0%,_#020b14_55%,_#000811_100%)]">
    <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(0,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.08)_1px,transparent_1px)] [background-size:56px_56px]" />
    <div className="absolute inset-x-0 top-[22%] flex flex-col items-center px-6 text-center">
      <p className="font-mono text-xs tracking-[0.35em] text-primary/70">PORTFOLIO ONLINE</p>
      <h1 className="mt-4 font-display text-4xl text-primary text-glow-cyan sm:text-6xl">
        DINESH RAJA
      </h1>
      <p className="mt-4 max-w-2xl font-body text-sm text-foreground/80 sm:text-base">
        Python Developer and Data Analyst building clean workflows, interactive dashboards,
        and practical data-driven solutions.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 font-mono text-xs text-secondary">
        <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5">Python</span>
        <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5">SQL</span>
        <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5">Power BI</span>
        <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5">Machine Learning</span>
      </div>
    </div>
  </div>
);

const Scene = ({ scrollProgress, onProjectClick }: SceneProps) => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(() =>
    typeof window === 'undefined' ? 1280 : window.innerWidth,
  );
  const [viewportHeight, setViewportHeight] = useState(() =>
    typeof window === 'undefined' ? 720 : window.innerHeight,
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(pointer: coarse)');
    const updateTouchMode = () => {
      setIsTouchDevice(mediaQuery.matches || navigator.maxTouchPoints > 0);
    };

    updateTouchMode();
    mediaQuery.addEventListener('change', updateTouchMode);

    return () => {
      mediaQuery.removeEventListener('change', updateTouchMode);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const onResize = () => {
      setViewportWidth(window.innerWidth);
      setViewportHeight(window.innerHeight);
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const cameraFov = viewportWidth < 640
    ? (viewportHeight < 700 ? 88 : 84)
    : viewportWidth < 1024
      ? (viewportHeight < 700 ? 82 : 79)
      : 75;

  return (
    <SceneErrorBoundary fallback={<SceneFallback />}>
      <div className="fixed inset-0 w-screen h-screen bg-[radial-gradient(circle_at_top,_rgba(0,255,255,0.08),_transparent_30%),linear-gradient(180deg,_#03111d_0%,_#020b14_55%,_#000811_100%)]">
        <Canvas
          style={{ touchAction: isTouchDevice ? 'pan-y' : 'none' }}
          fallback={<SceneFallback />}
          camera={{ position: [0, 0.5, 5], fov: cameraFov, near: 0.1, far: 200 }}
          gl={{ antialias: false, alpha: false, powerPreference: 'default' }}
          dpr={isTouchDevice ? [0.8, 1] : [1, 1.1]}
          onCreated={({ gl }) => {
            gl.setClearColor('#000811');
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.2;
          }}
        >
          <SceneContent
            scrollProgress={scrollProgress}
            onProjectClick={onProjectClick}
            isTouchDevice={isTouchDevice}
            viewportWidth={viewportWidth}
            viewportHeight={viewportHeight}
          />
        </Canvas>
      </div>
    </SceneErrorBoundary>
  );
};

export default Scene;
