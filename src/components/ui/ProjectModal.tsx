import { X, Github, ExternalLink } from 'lucide-react';

interface ProjectModalProps {
  project: string | null;
  onClose: () => void;
}

const projectDetails: Record<string, { desc: string; tech: string[]; github: string }> = {
  'Customer Segmentation\nK-Means': {
    desc: 'Segmented customers into distinct groups using K-Means clustering to enable targeted marketing strategies and improve customer retention. Analyzed purchasing patterns and demographic data to identify key customer personas.',
    tech: ['Python', 'Scikit-learn', 'Pandas', 'Matplotlib', 'Seaborn'],
    github: 'https://github.com/dinesh-raja/customer-segmentation',
  },
  'Sales Prediction\nModel': {
    desc: 'Built a predictive model to forecast sales using historical data, achieving high accuracy with ensemble methods. Implemented feature engineering and cross-validation for robust performance.',
    tech: ['Python', 'XGBoost', 'NumPy', 'Seaborn', 'Scikit-learn'],
    github: 'https://github.com/dinesh-raja/sales-prediction',
  },
  'Marketing Campaign\nDashboard': {
    desc: 'Interactive Power BI dashboard visualizing campaign performance metrics, ROI analysis, and audience engagement. Real-time data refresh with automated ETL pipelines.',
    tech: ['Power BI', 'SQL', 'DAX', 'Python', 'Azure'],
    github: 'https://github.com/dinesh-raja/marketing-dashboard',
  },
  'Bus Ticket\nReservation': {
    desc: 'Full-stack reservation system with seat selection, payment processing, and booking management. Features real-time seat availability and receipt generation.',
    tech: ['Java', 'SQL', 'JDBC', 'Swing', 'MySQL'],
    github: 'https://github.com/dinesh-raja/bus-ticket-reservation',
  },
  'Morse Code\nGenerator': {
    desc: 'Text-to-Morse and Morse-to-text converter with audio playback and visual signal representation. Supports international characters and real-time encoding.',
    tech: ['Python', 'Tkinter', 'PyAudio', 'Threading'],
    github: 'https://github.com/dinesh-raja/morse-code-generator',
  },
};

const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  if (!project) return null;

  const details = projectDetails[project] || {
    desc: 'Project details coming soon.',
    tech: ['Python'],
    github: '#',
  };
  const title = project.replace('\n', ' – ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full max-w-xl border border-primary/30 bg-card/95 backdrop-blur-xl rounded-xl p-8 border-glow-cyan animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-primary transition-colors"
        >
          <X size={22} />
        </button>

        <h2 className="font-display text-2xl text-primary mb-4 text-glow-cyan">{title}</h2>

        <p className="font-body text-foreground/80 mb-6 leading-relaxed text-base">{details.desc}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {details.tech.map((t) => (
            <span
              key={t}
              className="px-3 py-1.5 text-xs font-mono border border-secondary/40 rounded-full text-secondary bg-secondary/10"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="flex gap-3">
          <a
            href={details.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 border border-primary/40 rounded-lg text-primary font-mono text-sm hover:bg-primary/20 hover:border-primary/60 transition-all"
          >
            <Github size={16} />
            View on GitHub
          </a>
          <a
            href={details.github}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-accent/10 border border-accent/40 rounded-lg text-accent font-mono text-sm hover:bg-accent/20 hover:border-accent/60 transition-all"
          >
            <ExternalLink size={16} />
            Live Demo
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
