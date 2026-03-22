import { Mail, Github, Linkedin, FileDown } from 'lucide-react';

interface ContactOverlayProps {
  visible: boolean;
}

const ContactOverlay = ({ visible }: ContactOverlayProps) => {
  if (!visible) return null;

  return (
    <div className="fixed bottom-14 sm:bottom-20 left-1/2 -translate-x-1/2 z-40 flex flex-wrap justify-center gap-2 sm:gap-4 px-4 max-w-[95vw]">
      <a
        href="mailto:dineshjas986@gmail.com"
        className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-background/60 backdrop-blur-md border border-primary/30 rounded-lg text-primary font-mono text-[10px] sm:text-xs hover:bg-primary/20 hover:border-primary/50 transition-all"
      >
        <Mail size={12} className="sm:w-3.5 sm:h-3.5" />
        Email
      </a>
      <a
        href="https://github.com/Dineshdev010"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-background/60 backdrop-blur-md border border-secondary/30 rounded-lg text-secondary font-mono text-[10px] sm:text-xs hover:bg-secondary/20 hover:border-secondary/50 transition-all"
      >
        <Github size={12} className="sm:w-3.5 sm:h-3.5" />
        GitHub
      </a>
      <a
        href="https://www.linkedin.com/in/dinesh-raja-m-26116b251/"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-background/60 backdrop-blur-md border border-accent/30 rounded-lg text-accent font-mono text-[10px] sm:text-xs hover:bg-accent/20 hover:border-accent/50 transition-all"
      >
        <Linkedin size={12} className="sm:w-3.5 sm:h-3.5" />
        LinkedIn
      </a>
      <a
        href="DINESHRAJADA.pdf"
        className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 bg-background/60 backdrop-blur-md border border-primary/30 rounded-lg text-primary font-mono text-[10px] sm:text-xs hover:bg-primary/20 hover:border-primary/50 transition-all"
      >
        <FileDown size={12} className="sm:w-3.5 sm:h-3.5" />
        Resume
      </a>
    </div>
  );
};

export default ContactOverlay;
