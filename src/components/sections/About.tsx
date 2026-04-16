import { useState } from 'react';
import { motion } from 'motion/react';
import { QUALIFICATIONS, CERTIFICATES } from '@/constants';
import { GraduationCap, Award, MapPin, Calendar, Eye, FileText } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';

export function About() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  return (
    <section id="about" className="py-24 bg-[var(--color-bg)]">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="immersive-card"
          >
            <div className="card-label">About & Education</div>
            <h3 className="text-5xl font-extrabold tracking-tighter mb-8 font-roboto">
              Jimmy Nyasulu
            </h3>
            <p className="text-base font-bold mb-8 font-roboto uppercase tracking-widest text-[var(--color-accent)]">
              Full-Stack Developer & Network Engineer
            </p>
            <div className="space-y-6 text-[var(--color-text-dim)] leading-relaxed text-lg">
              <p>
                Bridging the gap between software and infrastructure. I specialize in 
                building scalable, secure, and efficient digital solutions. 
                Currently pursuing a Master's in Informatics at the University of Malawi.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t border-[var(--color-border)]">
              <div>
                <h4 className="text-3xl font-bold mb-1 text-[var(--color-accent)]">5+</h4>
                <p className="text-xs font-mono uppercase tracking-wider opacity-60">Years Coding</p>
              </div>
              <div>
                <h4 className="text-3xl font-bold mb-1 text-[var(--color-accent)]">20+</h4>
                <p className="text-xs font-mono uppercase tracking-wider opacity-60">Projects Done</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="immersive-card">
              <div className="card-label text-sm">Academic Background</div>
              <div className="space-y-10">
                {QUALIFICATIONS.map((q) => (
                  <div key={q.id} className="relative pl-10 border-l-2 border-[var(--color-border)]">
                    <div className="absolute left-[-5px] top-0 w-2.5 h-2.5 rounded-full bg-[var(--color-accent)]" />
                    <h5 className="font-extrabold text-xl text-[var(--color-text-main)] font-roboto">{q.degree}</h5>
                    <p className="text-[var(--color-text-dim)] flex items-center gap-2 text-sm mt-2 font-mono uppercase tracking-widest font-bold">
                      {q.institution} • {q.period}
                    </p>
                    {q.description && (
                      <p className="text-[var(--color-text-dim)] mt-3 text-base leading-relaxed">
                        {q.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="immersive-card">
              <div className="card-label text-sm">Certifications</div>
              <div className="grid gap-6">
                {CERTIFICATES.map((c) => (
                  <div key={c.id} className="cert-item group flex items-center justify-between p-6">
                    <div>
                      <div className="text-xs uppercase tracking-widest opacity-60 font-mono mb-2 font-bold">{c.issuer}</div>
                      <h5 className="font-extrabold text-lg leading-tight group-hover:text-[var(--color-accent)] transition-colors font-roboto">
                        {c.name}
                      </h5>
                    </div>
                    
                    <Dialog>
                      <DialogTrigger>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-md border-[var(--color-accent)] text-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white"
                        >
                          <Eye size={16} className="mr-2" />
                          PREVIEW
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl h-[80vh] bg-[var(--color-surface)] border-[var(--color-border)]">
                        <DialogHeader>
                          <DialogTitle className="text-xl font-bold font-roboto">{c.name}</DialogTitle>
                        </DialogHeader>
                        <div className="flex-1 w-full h-full mt-4 rounded-lg overflow-hidden border border-[var(--color-border)] bg-black/5">
                          {c.image?.endsWith('.pdf') ? (
                            <iframe 
                              src={`${c.image}#toolbar=0`} 
                              className="w-full h-full"
                              title={c.name}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <img 
                                src={c.image || 'https://picsum.photos/seed/cert/800/600'} 
                                alt={c.name}
                                className="max-w-full max-h-full object-contain"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
