import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Terminal, Shield, Cpu } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-17 overflow-hidden technical-grid">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-2 mb-6">
              <span className="px-3 py-1 bg-[var(--color-accent-dim)] text-[var(--color-accent)] text-[12px] font-mono uppercase tracking-widest rounded border border-[var(--color-accent)]/20">
                STATUS: AVAILABLE
              </span>
              <div className="h-px w-12 bg-[var(--color-accent)]/20" />
              <span className="text-[12px] font-mono uppercase tracking-widest text-[var(--color-text-dim)]">
                LOCATION: Zomba Malawi
              </span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold leading-[0.85] tracking-tighter mb-8 text-[var(--color-text-main)]">
              DEV <span className="text-[var(--color-accent)]">&</span> <br />
              NETWORK <br />
              ENGINEER
            </h1>
            
            <p className="text-lg md:text-sm text-[var(--color-text-dim)] max-w-2xl mb-10 leading-relaxed font-mono">
              // Initializing robust digital infrastructures... <br />
              // Compiling high-performance web applications...
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="rounded-md px-8 h-14 text-sm font-mono uppercase tracking-widest bg-[var(--color-accent)] text-[var(--color-bg)] hover:bg-[var(--color-accent)]/90 group">
                 PROJECTS
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="rounded-md px-8 h-14 text-sm font-mono uppercase tracking-widest border-[var(--color-border)] text-[var(--color-text-main)] hover:bg-[var(--color-accent-dim)]">
                DOWNLOAD_CV
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-2/3 hidden lg:block">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative w-full h-full"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/10 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-1/4 right-1/4 p-8 immersive-card rotate-12 shadow-2xl">
            <Terminal size={48} className="text-[var(--color-accent)] mb-4" />
            <div className="space-y-2">
              <div className="h-1 w-24 bg-[var(--color-accent)]/20 rounded" />
              <div className="h-1 w-16 bg-[var(--color-accent)]/10 rounded" />
            </div>
          </div>
          <div className="absolute bottom-1/4 right-1/2 p-8 immersive-card -rotate-12 shadow-2xl">
            <Shield size={48} className="text-[var(--color-accent)] mb-4" />
            <div className="space-y-2">
              <div className="h-1 w-20 bg-[var(--color-accent)]/20 rounded" />
              <div className="h-1 w-28 bg-[var(--color-accent)]/10 rounded" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
