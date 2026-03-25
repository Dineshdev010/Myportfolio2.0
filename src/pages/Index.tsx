import { useState, useEffect, useCallback, lazy, Suspense, useRef } from 'react';
import Scene from '@/components/3d/Scene';
import ScrollIndicator from '@/components/ScrollIndicator';
import LoadingScreen from '@/components/LoadingScreen';

const ProjectModal = lazy(() => import('@/components/ui/ProjectModal'));
const ContactOverlay = lazy(() => import('@/components/ui/ContactOverlay'));

const SCROLL_PAGES = 11;

const Index = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const targetProgressRef = useRef(0);
  const animationFrameRef = useRef<number | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [mobileSnapScroll, setMobileSnapScroll] = useState(false);

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
    if (!isTouchDevice || !mobileSnapScroll) return;

    let touchStartY = 0;
    let touchStartX = 0;
    let lastSwipeAt = 0;
    const sectionHeight = window.innerHeight;
    const maxSectionIndex = SCROLL_PAGES - 1;

    const onTouchStart = (event: TouchEvent) => {
      if (selectedProject) return;
      if (event.changedTouches.length !== 1) return;
      const touch = event.changedTouches[0];
      touchStartY = touch.clientY;
      touchStartX = touch.clientX;
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (selectedProject) return;
      if (event.changedTouches.length !== 1) return;

      const now = Date.now();
      if (now - lastSwipeAt < 260) return;

      const touch = event.changedTouches[0];
      const deltaY = touch.clientY - touchStartY;
      const deltaX = touch.clientX - touchStartX;
      const swipeThreshold = Math.max(44, window.innerHeight * 0.055);

      if (Math.abs(deltaY) < swipeThreshold || Math.abs(deltaY) < Math.abs(deltaX) * 1.1) return;

      const currentSection = Math.round(window.scrollY / sectionHeight);
      const direction = deltaY < 0 ? 1 : -1;
      const nextSection = Math.min(maxSectionIndex, Math.max(0, currentSection + direction));

      if (nextSection === currentSection) return;

      lastSwipeAt = now;
      window.scrollTo({
        top: nextSection * sectionHeight,
        behavior: 'smooth',
      });
    };

    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [isTouchDevice, mobileSnapScroll, selectedProject]);
 
  useEffect(() => {
    const updateTargetProgress = () => {
      const scrollTop = window.scrollY;
      const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
      targetProgressRef.current = Math.min(Math.max(scrollTop / maxScroll, 0), 1);
    };

    const animate = () => {
      setScrollProgress((prev) => {
        const smoothing = isTouchDevice ? 0.17 : 0.12;
        const next = prev + (targetProgressRef.current - prev) * smoothing;
        return Math.abs(next - targetProgressRef.current) < 0.0005 ? targetProgressRef.current : next;
      });
      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    updateTargetProgress();
    window.addEventListener('scroll', updateTargetProgress, { passive: true });
    animationFrameRef.current = window.requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('scroll', updateTargetProgress);
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isTouchDevice]);

  const handleProjectClick = useCallback((project: string) => {
    setSelectedProject(project);
  }, []);


  return (
    <>
      {!loaded && <LoadingScreen onComplete={() => setLoaded(true)} />}

      <div style={{ height: `${SCROLL_PAGES * 100}vh` }} />

      {loaded && (
        <>
          <Scene scrollProgress={scrollProgress} onProjectClick={handleProjectClick} />
          <ScrollIndicator progress={scrollProgress} />

          {/* WASD hint */}
          <div className="fixed bottom-3 left-3 z-40 sm:left-12">
            <div className="bg-background/60 backdrop-blur-md border border-primary/20 rounded-lg px-2.5 py-1.5">
              <p className="font-mono text-[9px] sm:text-[10px] text-primary">
                <span className="hidden md:inline">WASD to fly • Space/Shift up/down • Scroll to progress</span>
                <span className="md:hidden">
                  {mobileSnapScroll ? 'Swipe sections ↕' : 'Scroll to explore ↕'}
                </span>
              </p>
            </div>
          </div>

          {isTouchDevice && (
            <button
              type="button"
              onClick={() => setMobileSnapScroll((enabled) => !enabled)}
              className="fixed bottom-3 right-3 z-40 rounded-lg border border-primary/30 bg-background/65 px-3 py-1.5 font-mono text-[10px] text-primary backdrop-blur-md transition-colors hover:bg-primary/15 sm:text-xs"
            >
              {mobileSnapScroll ? 'Snap: ON' : 'Snap: OFF'}
            </button>
          )}

          <Suspense fallback={null}>
            <ContactOverlay visible={scrollProgress > 0.87 && scrollProgress < 0.94} />
            <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
          </Suspense>
        </>
      )}
    </>
  );
};

export default Index;
