import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { PROJECTS } from '@/constants';
import { Github, ExternalLink, ArrowLeft, Tag, Calendar, User } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useEffect } from 'react';
import { cn } from '@/lib/utils';

export function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const project = PROJECTS.find(p => p.id === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] text-[var(--color-text-main)]">
        <h2 className="text-2xl font-bold mb-4">Project Not Found</h2>
        <Button onClick={() => navigate('/')}>Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[var(--color-bg)]">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm font-mono text-[var(--color-text-dim)] hover:text-[var(--color-accent)] transition-colors mb-12 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            BACK_TO_PROJECTS
          </Link>

          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <div className="card-label mb-6">Project Archive // {project.id}</div>
              <h1 className="text-5xl md:text-6xl font-bold tracking-tighter mb-8 bg-gradient-to-r from-[var(--color-text-main)] to-[var(--color-accent)] bg-clip-text text-transparent">
                {project.title}
              </h1>
              
              <div className="flex flex-wrap gap-3 mb-10">
                {project.tags.map(tag => (
                  <Badge 
                    key={tag} 
                    variant="outline" 
                    className="rounded-md px-3 py-1 border-[var(--color-accent-dim)] text-[var(--color-accent)] bg-[var(--color-accent-dim)] font-mono text-[10px] tracking-wider"
                  >
                    {tag.toUpperCase()}
                  </Badge>
                ))}
              </div>

              <div className="prose prose-invert max-w-none mb-12">
                <p className="text-lg text-[var(--color-text-dim)] leading-relaxed font-mono text-sm">
                  {project.description}
                </p>
                <p className="text-[var(--color-text-dim)] leading-relaxed mt-6">
                  This project represents a significant milestone in infrastructure automation and monitoring. 
                  By leveraging modern technologies, we achieved high availability and real-time visibility 
                  into complex systems. The architecture focuses on scalability, security, and performance.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                {project.github && (
                  <a 
                    href={project.github} 
                    target="_blank" 
                    rel="noreferrer"
                    className={cn(
                      buttonVariants({ variant: "default" }),
                      "rounded-md bg-[var(--color-accent)] text-[var(--color-bg)] hover:bg-[var(--color-accent)]/90 font-mono text-xs tracking-widest px-8"
                    )}
                  >
                    <Github size={16} className="mr-2" />
                    SOURCE_CODE
                  </a>
                )}
                {project.link && (
                  <a 
                    href={project.link} 
                    target="_blank" 
                    rel="noreferrer"
                    className={cn(
                      buttonVariants({ variant: "outline" }),
                      "rounded-md border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-accent)] font-mono text-xs tracking-widest px-8"
                    )}
                  >
                    <ExternalLink size={16} className="mr-2" />
                    LIVE_DEMO
                  </a>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <motion.div 
                className="immersive-card p-2"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-auto rounded-lg border border-[var(--color-border)]"
                  referrerPolicy="no-referrer"
                />
              </motion.div>

              <div className="grid sm:grid-cols-2 gap-6">
                <div className="immersive-card">
                  <div className="flex items-center gap-3 text-[var(--color-accent)] mb-2">
                    <Calendar size={16} />
                    <span className="text-[10px] font-mono uppercase tracking-widest">Timeline</span>
                  </div>
                  <p className="text-sm font-bold">Q3 2023 - Q1 2024</p>
                </div>
                <div className="immersive-card">
                  <div className="flex items-center gap-3 text-[var(--color-accent)] mb-2">
                    <User size={16} />
                    <span className="text-[10px] font-mono uppercase tracking-widest">Role</span>
                  </div>
                  <p className="text-sm font-bold">Lead Engineer</p>
                </div>
              </div>

              <div className="immersive-card">
                <div className="flex items-center gap-3 text-[var(--color-accent)] mb-4">
                  <Tag size={16} />
                  <span className="text-[10px] font-mono uppercase tracking-widest">Tech Stack</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-[11px] font-mono text-[var(--color-text-dim)] bg-[var(--color-bg)] px-2 py-1 rounded border border-[var(--color-border)]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
