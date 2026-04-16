import { Routes, Route, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Skills } from './components/sections/Skills';
import { Projects } from './components/sections/Projects';
import { Blog } from './components/sections/Blog';
import { Contact } from './components/sections/Contact';
import { Admin } from './components/admin/Admin';
import { ProjectDetail } from './pages/ProjectDetail';

export default function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const isProjectDetailPage = location.pathname.startsWith('/projects/');

  return (
    <div className="min-h-screen bg-[var(--color-bg)] selection:bg-[var(--color-accent)] selection:text-[var(--color-bg)]">
      <div className="glow-bg" />
      {!isAdminPage && <Header />}
      
      <Routes>
        <Route path="/" element={
          <main>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Blog />
            <Contact />
          </main>
        } />
        <Route path="/projects/:id" element={<ProjectDetail />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      
      {!isAdminPage && (
        <footer className="py-8 border-t border-[var(--color-border)] text-[var(--color-text-dim)] font-mono text-[10px] uppercase tracking-widest">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex gap-8">
              <div>SYSTEM: OPERATIONAL // IP: 192.168.1.1</div>
              <div className="hidden md:block">© {new Date().getFullYear()} J. NYASULU</div>
            </div>
            
            <div className="flex gap-8">
              <a href="#" className="hover:text-[var(--color-accent)] transition-colors">GITHUB</a>
              <a href="#" className="hover:text-[var(--color-accent)] transition-colors">LINKEDIN</a>
              <a href="#" className="hover:text-[var(--color-accent)] transition-colors">TWITTER</a>
            </div>
          </div>
        </div>
      </footer>
      )}
    </div>
  );
}
