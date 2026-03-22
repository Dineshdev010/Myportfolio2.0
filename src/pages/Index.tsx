import { useState, useEffect, useCallback } from 'react';
import Scene from '@/components/3d/Scene';
import ScrollIndicator from '@/components/ScrollIndicator';
import ProjectModal from '@/components/ui/ProjectModal';
import ContactOverlay from '@/components/ui/ContactOverlay';
import LoadingScreen from '@/components/LoadingScreen';

const SCROLL_PAGES = 6;

const Index = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);
  

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const maxScroll = document.body.scrollHeight - window.innerHeight;
      setScrollProgress(Math.min(scrollTop / maxScroll, 1));
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
                <span className="md:hidden">Scroll to explore ↕</span>
              </p>
            </div>
          </div>

          <ContactOverlay visible={scrollProgress > 0.85} />
          <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
        </>
      )}
    </>
  );
};

export default Index;
