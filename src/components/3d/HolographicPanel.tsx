import { useMemo, useRef, useState } from 'react';
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
  footerLabel?: string;
  onClick?: () => void;
  titleFontSize?: number;
  titleY?: number;
  titleMaxWidth?: number;
  titleSeparatorY?: number;
  contentFontSize?: number;
  contentLineStep?: number;
  contentMaxWidth?: number;
  contentStartOffset?: number;
}

const HolographicPanel = ({
  position,
  width = 4,
  height = 3,
  title,
  lines,
  color = '#00ffff',
  footerLabel,
  onClick,
  titleFontSize = 0.3,
  titleY,
  titleMaxWidth,
  titleSeparatorY,
  contentFontSize = 0.2,
  contentLineStep = 0.3,
  contentMaxWidth,
  contentStartOffset = 1.1,
}: HolographicPanelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const { camera } = useThree();
  const [hovered, setHovered] = useState(false);
  const isInteractive = Boolean(onClick);

  const layout = useMemo(() => {
    const resolvedTitleY = titleY ?? (height / 2 - 0.5);
    const resolvedSeparatorY = titleSeparatorY ?? (height / 2 - 0.75);
    const maxContentTopY = resolvedSeparatorY - 0.2;
    const requestedContentTopY = height / 2 - contentStartOffset;
    const contentTopY = Math.min(requestedContentTopY, maxContentTopY);
    const contentBottomY = -height / 2 + (footerLabel ? 0.78 : 0.5);
    const rowCount = Math.max(lines.length - 1, 1);
    const availableSpan = Math.max(contentTopY - contentBottomY, 0.4);

    // Fit lines into the safe vertical area while preserving the desired spacing when possible.
    const maxStepToFit = availableSpan / rowCount;
    const effectiveLineStep = Math.max(0.12, Math.min(contentLineStep, maxStepToFit));

    // Keep font in a readable ratio to line spacing so text doesn't overlap or look tiny.
    const maxFontByStep = effectiveLineStep * 0.68;
    const minFontByStep = effectiveLineStep * 0.44;
    const effectiveFontSize = Math.max(
      0.12,
      Math.min(contentFontSize, maxFontByStep, Math.max(minFontByStep, 0.12)),
    );

    const footerFontSize = Math.max(0.12, Math.min(0.18, Math.min(width, height) * 0.045));

    return {
      titleY: resolvedTitleY,
      titleSeparatorY: resolvedSeparatorY,
      contentTopY,
      contentLineStep: effectiveLineStep,
      contentFontSize: effectiveFontSize,
      footerFontSize,
    };
  }, [
    contentFontSize,
    contentLineStep,
    contentStartOffset,
    footerLabel,
    width,
    height,
    lines.length,
    titleSeparatorY,
    titleY,
  ]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Billboard: always face the camera
      groupRef.current.lookAt(camera.position);
      // Float
      groupRef.current.position.y = position[1] + Math.sin(clock.elapsedTime * 0.5) * 0.06;
    }
  });

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={onClick}
      onPointerOver={() => {
        if (!isInteractive) return;
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        if (!isInteractive) return;
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
    >
      {/* Panel background */}
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial
          color="#000a1a"
          emissive={color}
          emissiveIntensity={hovered ? 0.16 : 0.08}
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
        position={[0, layout.titleY, 0.01]}
        fontSize={titleFontSize}
        color={color}
        font={undefined}
        anchorX="center"
        maxWidth={titleMaxWidth ?? width - 0.5}
        textAlign="center"
      >
        {title}
      </Text>

      {/* Separator line */}
      <mesh position={[0, layout.titleSeparatorY, 0.01]}>
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
          position={[0, layout.contentTopY - i * layout.contentLineStep, 0.01]}
          fontSize={layout.contentFontSize}
          color="#aaeeff"
          font={undefined}
          anchorX="center"
          maxWidth={contentMaxWidth ?? width - 0.6}
          textAlign="center"
        >
          {line}
        </Text>
      ))}

      {footerLabel && (
        <Text
          position={[0, -height / 2 + 0.35, 0.01]}
          fontSize={layout.footerFontSize}
          color={hovered ? '#ffffff' : color}
          font={undefined}
          anchorX="center"
          maxWidth={width - 0.5}
          textAlign="center"
        >
          {footerLabel}
        </Text>
      )}
    </group>
  );
};

export default HolographicPanel;
