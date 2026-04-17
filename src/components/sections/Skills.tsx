import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { SKILLS as FALLBACK_SKILLS } from '@/constants';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { Skill } from '@/types';
import { Loader2 } from 'lucide-react';

const CATEGORIES = ['Frontend', 'Backend', 'DevOps', 'Networking', 'AI', 'Other'];

export function Skills() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'skills'), orderBy('category', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as unknown as Skill));
      setSkills(data);
      setLoading(false);
    }, (error) => {
      console.error("Skills fetch error:", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const displaySkills = skills.length > 0 ? skills : FALLBACK_SKILLS;

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

        {loading && skills.length === 0 ? (
          <div className="flex justify-center p-20">
            <Loader2 className="animate-spin text-[var(--color-accent)]" size={32} />
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CATEGORIES.map((category, idx) => {
              const categorySkills = displaySkills.filter(s => s.category === category);
              if (categorySkills.length === 0) return null;

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="immersive-card"
                >
                  <div className="card-label">{category}</div>
                  <div className="space-y-5">
                    {categorySkills.map((skill) => (
                      <div key={skill.id || skill.name} className="space-y-1.5">
                        <div className="flex justify-between items-center px-1">
                          <span className="text-[11px] font-bold text-[var(--color-text-main)] font-mono uppercase tracking-tight">
                            {skill.name}
                          </span>
                          <span className="text-[10px] font-mono text-[var(--color-accent)] font-semibold">
                            {skill.level}%
                          </span>
                        </div>
                        <div className="h-1 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                            viewport={{ once: true }}
                            className="h-full bg-[var(--color-accent)] rounded-full shadow-[0_0_12px_var(--color-accent)] opacity-80"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
