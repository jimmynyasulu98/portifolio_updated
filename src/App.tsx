import { Routes, Route, useLocation } from 'react-router-dom';
import { Github, Linkedin, Twitter } from 'lucide-react';
import { Header } from './components/layout/Header';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Skills } from './components/sections/Skills';
import { Projects } from './components/sections/Projects';
import { Blog } from './components/sections/Blog';
import { Contact } from './components/sections/Contact';
import { Admin } from './components/admin/Admin';
import { ProjectDetail } from './pages/ProjectDetail';
import { BlogDetail } from './pages/BlogDetail';

export default function App() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  const isDetailView = location.pathname.startsWith('/projects/') || location.pathname.startsWith('/blog/');

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
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      
      {!isAdminPage && (
        <footer className="py-12 border-t border-[var(--color-border)] text-[var(--color-text-dim)] font-mono text-[10px] uppercase tracking-widest">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex gap-8">
              <div>UNIVERSITY OF MALAWI P.O BOX 280 ZOMBA</div>
              <div className="hidden md:block">© {new Date().getFullYear()} J. NYASULU</div>
            </div>
            
            <div className="flex gap-10">
              <a href="#" className="hover:text-[var(--color-accent)] transition-colors">
                <Github size={24} />
              </a>
              <a href="#" className="hover:text-[var(--color-accent)] transition-colors">
                <Linkedin size={24} />
              </a>
              <a href="#" className="hover:text-[var(--color-accent)] transition-colors">
                <Twitter size={24} />
              </a>
            </div>
          </div>
        </div>
      </footer>
      )}
    </div>
  );
}
