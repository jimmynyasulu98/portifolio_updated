import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, Calendar, ArrowRight, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { BlogPost } from '@/types';

const CATEGORIES = ['All', 'Networking', 'Development', 'DevOps', 'AI'];

export function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'posts'), (snapshot) => {
      const postsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[];
      
      const sortedData = postsData.sort((a, b) => {
        const timeA = (a as any).createdAt?.seconds || 0;
        const timeB = (b as any).createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setPosts(sortedData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'posts');
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <section id="blog" className="py-24 bg-[var(--color-bg)]">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-sm font-mono uppercase tracking-[0.3em] text-[var(--color-accent)] mb-4">
            04 // Insights
          </h2>
          <h3 className="text-5xl font-bold tracking-tighter mb-6">
            Technical Logs
          </h3>
        </div>

        <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-accent)]/40" size={18} />
            <Input 
              placeholder="SEARCH_LOGS..." 
              className="pl-12 h-12 rounded-md border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-main)] focus:border-[var(--color-accent)] transition-all font-mono text-xs"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
            {CATEGORIES.map(cat => (
              <Button
                key={cat}
                variant={activeCategory === cat ? 'default' : 'outline'}
                className={cn(
                  "rounded-md px-6 whitespace-nowrap font-mono text-[10px] tracking-widest uppercase",
                  activeCategory === cat ? "bg-[var(--color-accent)] text-[var(--color-bg)]" : "border-[var(--color-border)] text-[var(--color-text-dim)]"
                )}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </Button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-[var(--color-accent)]" size={40} />
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-[var(--color-border)] rounded-xl">
            <Search className="mx-auto text-[var(--color-text-dim)] mb-4 opacity-20" size={48} />
            <p className="text-[var(--color-text-dim)] font-mono text-sm uppercase tracking-widest">No logs found matching criteria</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {filteredPosts.map((post, idx) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="immersive-card group"
              >
                <div className="card-label">Log: {post.category}</div>
                <Link to={`/blog/${post.id}`} className="block">
                  <div className="relative aspect-video overflow-hidden rounded-lg mb-6 border border-[var(--color-border)]">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-50 group-hover:opacity-100"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                </Link>
                
                <div className="flex items-center gap-4 text-[10px] font-mono uppercase tracking-wider text-[var(--color-accent)] opacity-60 mb-4">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {post.date}</span>
                </div>
                
                <Link to={`/blog/${post.id}`} className="block group">
                  <h4 className="text-2xl font-extrabold mb-4 group-hover:text-[var(--color-accent)] transition-colors leading-tight font-roboto">
                    {post.title}
                  </h4>
                </Link>
                <p className="text-[var(--color-text-dim)] text-sm mb-8 line-clamp-2 leading-relaxed">
                  {post.excerpt}
                </p>
                
                <Link 
                  to={`/blog/${post.id}`}
                  className={cn(
                    "p-0 h-auto text-[var(--color-accent)] font-mono text-[10px] tracking-[0.2em] uppercase group/btn inline-flex items-center"
                  )}
                >
                  READ_FULL_LOG
                  <ArrowRight className="ml-2 w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
