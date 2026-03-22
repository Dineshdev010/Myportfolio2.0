import { useMemo } from 'react';

const zones = [
  { name: 'Start', z: 0, color: 'hsl(var(--primary))' },
  { name: 'About', z: -30, color: 'hsl(var(--secondary))' },
  { name: 'Skills', z: -55, color: 'hsl(var(--accent))' },
  { name: 'Projects', z: -80, color: '#ff8844' },
  { name: 'Data', z: -105, color: 'hsl(var(--primary))' },
  { name: 'Contact', z: -130, color: 'hsl(var(--secondary))' },
];

interface MinimapProps {
  cameraZ: number;
}

const Minimap = ({ cameraZ }: MinimapProps) => {
  const trackHeight = 160; // px
  const minZ = 5;
  const maxZ = -140;

  const cameraPercent = useMemo(() => {
    return Math.max(0, Math.min(1, (minZ - cameraZ) / (minZ - maxZ)));
  }, [cameraZ]);

  return (
    <div className="fixed left-3 top-1/2 -translate-y-1/2 z-40 hidden sm:flex flex-col items-center">
      {/* Radar container */}
      <div
        className="relative bg-background/60 backdrop-blur-md border border-primary/20 rounded-full px-1.5 py-3"
        style={{ height: trackHeight + 24 }}
      >
        {/* Track line */}
        <div
          className="absolute left-1/2 -translate-x-1/2 top-3 w-[2px] rounded-full"
          style={{
            height: trackHeight,
            background: 'linear-gradient(to bottom, hsl(var(--primary) / 0.3), hsl(var(--accent) / 0.3), hsl(var(--secondary) / 0.3))',
          }}
        />

        {/* Zone markers */}
        {zones.map((zone) => {
          const percent = (minZ - zone.z) / (minZ - maxZ);
          return (
            <div
              key={zone.name}
              className="absolute left-1/2 -translate-x-1/2 group"
              style={{ top: 12 + percent * trackHeight }}
            >
              <div
                className="w-2 h-2 rounded-full border transition-all"
                style={{
                  borderColor: zone.color,
                  background: Math.abs(percent - cameraPercent) < 0.06 ? zone.color : 'transparent',
                  boxShadow: Math.abs(percent - cameraPercent) < 0.06 ? `0 0 8px ${zone.color}` : 'none',
                }}
              />
              {/* Label on hover */}
              <span
                className="absolute left-5 top-1/2 -translate-y-1/2 font-mono text-[9px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{ color: zone.color }}
              >
                {zone.name}
              </span>
            </div>
          );
        })}

        {/* Camera position indicator */}
        <div
          className="absolute left-1/2 -translate-x-1/2 transition-all duration-200 ease-out"
          style={{ top: 12 + cameraPercent * trackHeight - 4 }}
        >
          <div className="relative">
            <div
              className="w-3 h-3 rounded-full border-2 border-primary"
              style={{
                background: 'hsl(var(--primary))',
                boxShadow: '0 0 12px hsl(var(--primary) / 0.8), 0 0 24px hsl(var(--primary) / 0.4)',
              }}
            />
            {/* Ping animation */}
            <div
              className="absolute inset-0 rounded-full border border-primary animate-ping"
              style={{ animationDuration: '2s' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Minimap;
