import { useEffect, useState, useRef } from 'react';

const LoadingScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Matrix rain effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const columns = Math.floor(canvas.width / 14);
    const drops: number[] = Array(columns).fill(1);
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789PYTHON';

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 8, 17, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = '12px monospace';

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * 14;
        const y = drops[i] * 14;
        
        // Gradient from cyan to green
        const hue = 150 + Math.sin(i * 0.1) * 30;
        ctx.fillStyle = `hsla(${hue}, 100%, 50%, ${0.6 + Math.random() * 0.4})`;
        ctx.fillText(char, x, y);

        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    const interval = setInterval(draw, 33);
    return () => clearInterval(interval);
  }, []);

  // Progress simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
              setVisible(false);
              onComplete();
            }, 800);
          }, 300);
          return 100;
        }
        // Slower, smoother progress
        const increment = p < 30 ? 1.2 : p < 60 ? 0.8 : p < 85 ? 0.5 : 0.3;
        return Math.min(p + increment, 100);
      });
    }, 60);
    return () => clearInterval(interval);
  }, [onComplete]);

  if (!visible) return null;

  const loadingMessages = [
    { threshold: 0, msg: 'Initializing quantum renderer...' },
    { threshold: 15, msg: 'Loading neural pathways...' },
    { threshold: 30, msg: 'Compiling holographic shaders...' },
    { threshold: 50, msg: 'Generating procedural city...' },
    { threshold: 70, msg: 'Calibrating dimensional matrix...' },
    { threshold: 85, msg: 'Synchronizing data streams...' },
    { threshold: 95, msg: 'Ready to launch...' },
  ];

  const currentMessage = [...loadingMessages].reverse().find(m => progress >= m.threshold)?.msg || '';

  return (
    <div
      className={`loading-screen transition-opacity duration-700 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}
      style={{ zIndex: 200 }}
    >
      {/* Matrix rain background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ opacity: 0.3 }}
      />

      {/* Scanning line */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="w-full h-[2px] bg-gradient-to-r from-transparent via-primary to-transparent opacity-30"
          style={{
            animation: 'scanline 2s linear infinite',
          }}
        />
      </div>

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Hexagonal logo container */}
        <div className="relative mb-8">
          <div className="w-24 h-24 relative animate-pulse-glow">
            {/* Rotating rings */}
            <div className="absolute inset-0 rounded-full border-2 border-primary/40"
              style={{ animation: 'spin 3s linear infinite' }} />
            <div className="absolute inset-2 rounded-full border border-secondary/30"
              style={{ animation: 'spin 5s linear infinite reverse' }} />
            <div className="absolute inset-4 rounded-full border border-accent/20"
              style={{ animation: 'spin 7s linear infinite' }} />
            
            {/* Center symbol */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display text-2xl text-primary text-glow-cyan font-bold">
                DR
              </span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="font-display text-xl tracking-[0.3em] text-primary text-glow-cyan mb-2">
          DINESH RAJA
        </div>
        <div className="font-mono text-xs text-secondary/70 mb-8 tracking-widest">
          PORTFOLIO SYSTEM v2.0
        </div>

        {/* Progress bar */}
        <div className="w-64 relative">
          {/* Track */}
          <div className="w-full h-[3px] bg-muted/30 rounded-full overflow-hidden relative">
            <div
              className="h-full rounded-full transition-all duration-200 relative"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)), hsl(var(--primary)))',
                boxShadow: '0 0 20px hsl(var(--primary) / 0.6), 0 0 40px hsl(var(--primary) / 0.3)',
              }}
            />
          </div>

          {/* Percentage and status */}
          <div className="flex justify-between items-center mt-3">
            <span className="font-mono text-[10px] text-muted-foreground">{currentMessage}</span>
            <span className="font-mono text-xs text-primary font-bold">{Math.floor(progress)}%</span>
          </div>
        </div>

        {/* Data stream decoration */}
        <div className="mt-8 flex gap-4">
          {[0, 1, 2, 3, 4].map(i => (
            <div
              key={i}
              className="w-1 rounded-full bg-primary/30"
              style={{
                height: `${20 + Math.sin((progress * 0.1) + i) * 15}px`,
                opacity: 0.3 + Math.sin((progress * 0.05) + i * 0.5) * 0.3,
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-4 left-4 font-mono text-[9px] text-primary/30">
        SYS.INIT &gt; 0x{Math.floor(progress * 2.55).toString(16).padStart(2, '0').toUpperCase()}
      </div>
      <div className="absolute top-4 right-4 font-mono text-[9px] text-primary/30">
        MEM: {(progress * 0.48).toFixed(1)}GB / 48.0GB
      </div>
      <div className="absolute bottom-4 left-4 font-mono text-[9px] text-primary/30">
        THREADS: {Math.floor(progress * 0.12)}/12 ACTIVE
      </div>
      <div className="absolute bottom-4 right-4 font-mono text-[9px] text-primary/30">
        LAT: {(12.5 - progress * 0.1).toFixed(1)}ms
      </div>
    </div>
  );
};

export default LoadingScreen;
