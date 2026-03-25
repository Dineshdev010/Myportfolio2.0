import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const KeyboardControls = () => {
  const { camera } = useThree();
  const keys = useRef<Record<string, boolean>>({});
  const velocity = useRef(new THREE.Vector3());

  useEffect(() => {
    let lastScrollAt = 0;
    const onKeyDown = (e: KeyboardEvent) => {
      // Section navigation keys: drive page scroll (camera Z is scroll-synced).
      if (e.code === 'ArrowUp' || e.code === 'KeyW') {
        e.preventDefault();
        const now = Date.now();
        if (now - lastScrollAt > 20) {
          lastScrollAt = now;
          window.scrollBy({ top: -window.innerHeight * 0.04, behavior: 'auto' });
        }
      }
      if (e.code === 'ArrowDown' || e.code === 'KeyS') {
        e.preventDefault();
        const now = Date.now();
        if (now - lastScrollAt > 20) {
          lastScrollAt = now;
          window.scrollBy({ top: window.innerHeight * 0.04, behavior: 'auto' });
        }
      }

      // Prevent browser/Orbit side effects for movement keys.
      if (e.code.startsWith('Arrow') || e.code === 'Space' || e.code === 'KeyW' || e.code === 'KeyS') {
        e.preventDefault();
      }

      keys.current[e.code] = true;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keys.current[e.code] = false;
    };
    // Use capture phase to get events before OrbitControls
    window.addEventListener('keydown', onKeyDown, { capture: true });
    window.addEventListener('keyup', onKeyUp, { capture: true });
    return () => {
      window.removeEventListener('keydown', onKeyDown, { capture: true });
      window.removeEventListener('keyup', onKeyUp, { capture: true });
    };
  }, []);

  useFrame((_, delta) => {
    const speed = 12;
    const damping = 0.85;
    const k = keys.current;
    const move = new THREE.Vector3();

    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    forward.y = 0;
    forward.normalize();
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    right.y = 0;
    right.normalize();

    // Forward/backward travel is scroll-based in this experience.
    if (k['KeyA'] || k['ArrowLeft']) move.add(right.clone().multiplyScalar(-speed * delta));
    if (k['KeyD'] || k['ArrowRight']) move.add(right.clone().multiplyScalar(speed * delta));
    if (k['Space']) move.y += speed * delta;
    if (k['ShiftLeft'] || k['ShiftRight']) move.y -= speed * delta;

    velocity.current.add(move);
    velocity.current.multiplyScalar(damping);
    camera.position.add(velocity.current);
  });

  return null;
};

export default KeyboardControls;
