import { motion } from 'motion/react';
import { QUALIFICATIONS, CERTIFICATES } from '@/constants';
import { GraduationCap, Award, MapPin, Calendar } from 'lucide-react';

export function About() {
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
            <h3 className="text-4xl font-bold tracking-tighter mb-8">
              Chimwemwe Banda
            </h3>
            <p className="text-[var(--color-text-dim)] text-sm mb-8 font-mono uppercase tracking-widest">
              Full-Stack Developer & Network Engineer
            </p>
            <div className="space-y-6 text-[var(--color-text-dim)] leading-relaxed">
              <p>
                Bridging the gap between software and infrastructure. I specialize in 
                building scalable, secure, and efficient digital solutions.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 mt-12 pt-8 border-t border-[var(--color-border)]">
              <div>
                <h4 className="text-2xl font-bold mb-1 text-[var(--color-accent)]">5+</h4>
                <p className="text-[10px] font-mono uppercase tracking-wider opacity-60">Years Coding</p>
              </div>
              <div>
                <h4 className="text-2xl font-bold mb-1 text-[var(--color-accent)]">20+</h4>
                <p className="text-[10px] font-mono uppercase tracking-wider opacity-60">Projects Done</p>
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
              <div className="card-label">Academic Background</div>
              <div className="space-y-8">
                {QUALIFICATIONS.map((q) => (
                  <div key={q.id} className="relative pl-8 border-l border-[var(--color-border)]">
                    <div className="absolute left-[-3px] top-0 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)]" />
                    <h5 className="font-bold text-sm text-[var(--color-text-main)]">{q.degree}</h5>
                    <p className="text-[var(--color-text-dim)] flex items-center gap-2 text-[11px] mt-1 font-mono uppercase tracking-widest">
                      {q.institution} • {q.period}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="immersive-card">
              <div className="card-label">Certifications</div>
              <div className="grid sm:grid-cols-2 gap-4">
                {CERTIFICATES.map((c) => (
                  <div key={c.id} className="cert-item group">
                    <div className="text-[10px] uppercase tracking-widest opacity-60 font-mono mb-1">{c.issuer}</div>
                    <h5 className="font-bold text-sm leading-tight group-hover:text-[var(--color-accent)] transition-colors">
                      {c.name}
                    </h5>
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
