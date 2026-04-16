import { motion } from 'motion/react';
import { SKILLS } from '@/constants';
import { Badge } from '@/components/ui/badge';

const CATEGORIES = ['Frontend', 'Backend', 'DevOps', 'Networking', 'AI'];

export function Skills() {
  return (
    <section id="skills" className="py-24 bg-[var(--color-bg)] technical-grid">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4">
            02 // Expertise
          </h2>
          <h3 className="text-5xl font-bold tracking-tighter mb-6">
            Skills Matrix
          </h3>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CATEGORIES.map((category, idx) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="immersive-card"
            >
              <div className="card-label">{category}</div>
              <div className="grid grid-cols-2 gap-3">
                {SKILLS.filter(s => s.category === category).map((skill) => (
                  <div key={skill.name} className="skill-pill">
                    {skill.name}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
