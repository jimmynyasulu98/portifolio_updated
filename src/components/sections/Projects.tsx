import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Github, ExternalLink, ArrowRight, Eye, Loader2, Package } from 'lucide-react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Project } from '@/types';

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'projects'), (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      
      const sortedData = projectsData.sort((a, b) => {
        const timeA = (a as any).createdAt?.seconds || 0;
        const timeB = (b as any).createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setProjects(sortedData);
      setLoading(false);
    }, (error) => {
      console.error("Projects Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <section id="projects" className="py-10 bg-[var(--color-bg)]">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4">
              03 // Portfolio
            </h2>
            <h3 className="text-5xl font-bold tracking-tighter">
              Featured Infrastructure
            </h3>
          </div>
          <Button variant="outline" className="rounded-md px-8 border-[var(--color-border)] text-[var(--color-text-dim)] hover:text-[var(--color-accent)] group font-mono text-xs tracking-widest">
            EXPLORE_VAULT
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[var(--color-accent)]" size={40} />
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[var(--color-border)] rounded-xl opacity-50 grayscale hover:grayscale-0 transition-all">
            <Package className="mx-auto text-[var(--color-text-dim)] mb-4 opacity-40" size={48} />
            <p className="text-[var(--color-text-dim)] font-mono text-xs uppercase tracking-widest mb-2">System offline or no data indexed</p>
            <p className="text-[10px] font-mono text-[var(--color-text-dim)] opacity-40">Check Firebase configuration / ensure database is populated</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="immersive-card group flex flex-col"
              >
                <div className="card-label">Project: {project.id.slice(0, 8)}</div>
                <div className="relative aspect-video overflow-hidden rounded-lg mb-6 bg-black/20 border border-[var(--color-border)]">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-[var(--color-bg)]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                    <Link to={`/projects/${project.id}`} className="p-3 bg-[var(--color-accent)] text-[var(--color-bg)] rounded-md hover:scale-110 transition-transform">
                      <Eye size={20} />
                    </Link>
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noreferrer" className="p-3 bg-[var(--color-accent)] text-[var(--color-bg)] rounded-md hover:scale-110 transition-transform">
                        <Github size={20} />
                      </a>
                    )}
                  </div>
                </div>
                
                <h4 className="text-xl font-bold mb-3 group-hover:text-[var(--color-accent)] transition-colors">
                  {project.title}
                </h4>
                <p className="text-[var(--color-text-dim)] text-sm leading-relaxed mb-6 flex-grow">
                  {project.description}
                </p>

                <div className="flex flex-col gap-6">
                  <div className="flex gap-2 flex-wrap">
                    {project.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-mono text-[var(--color-accent)] opacity-60">
                        #{tag.toLowerCase().replace(/\s+/g, '')}
                      </span>
                    ))}
                  </div>
                  
                  <Link 
                    to={`/projects/${project.id}`}
                    className={cn(
                      buttonVariants({ variant: "link" }),
                      "p-0 h-auto text-[10px] font-mono text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 justify-start tracking-widest"
                    )}
                  >
                    VIEW_DETAILS <ArrowRight size={12} className="ml-1" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
