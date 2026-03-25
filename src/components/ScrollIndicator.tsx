const zones = ['Landing', 'About', 'Experience', 'Skills', 'Certificates', 'Projects', 'Data', 'Contact', 'Outro'];

interface ScrollIndicatorProps {
  progress: number;
}

const ScrollIndicator = ({ progress }: ScrollIndicatorProps) => {
  const activeIndex = Math.min(Math.floor(progress * zones.length), zones.length - 1);

  return (
    <div className="fixed right-2 sm:right-4 top-1/2 -translate-y-1/2 z-40 flex flex-col items-center gap-2 sm:gap-3">
      {zones.map((zone, i) => (
        <div key={zone} className="flex items-center gap-1.5 sm:gap-2 group">
          <span className={`
            font-mono text-[8px] sm:text-[10px] transition-all duration-300 opacity-0 group-hover:opacity-100 hidden sm:block
            ${i === activeIndex ? 'text-primary !opacity-100' : 'text-muted-foreground'}
          `}>
            {zone}
          </span>
          <div
            className={`
              w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300
              ${i === activeIndex
                ? 'bg-primary shadow-[0_0_8px_hsl(var(--primary))]'
                : i < activeIndex
                  ? 'bg-primary/40'
                  : 'bg-muted-foreground/30'
              }
            `}
          />
        </div>
      ))}
    </div>
  );
};

export default ScrollIndicator;
