import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Calendar, User, MessageSquare, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { doc, getDoc, collection, addDoc, onSnapshot, query, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { BlogPost, Comment } from '@/types';

export function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newComment, setNewComment] = useState({ name: '', content: '' });

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!id) return;

    // Fetch Post
    const fetchPost = async () => {
      try {
        const docRef = doc(db, 'posts', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() } as BlogPost);
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `posts/${id}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();

    // Fetch Comments
    const q = query(
      collection(db, 'comments'),
      where('parentId', '==', id),
      where('parentType', '==', 'post'),
      where('approved', '==', true)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const commentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Comment[];
      setComments(commentsData.sort((a, b) => {
        const timeA = a.timestamp?.toMillis() || 0;
        const timeB = b.timestamp?.toMillis() || 0;
        return timeB - timeA;
      }));
    });

    return () => unsubscribe();
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !newComment.name || !newComment.content) return;

    setIsSubmitting(true);
    try {
      await addDoc(collection(db, 'comments'), {
        parentId: id,
        parentType: 'post',
        name: newComment.name,
        content: newComment.content,
        timestamp: serverTimestamp(),
        approved: true, // Auto-approve for now, can change later
        date: new Date().toLocaleDateString()
      });
      setNewComment({ name: '', content: '' });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'comments');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)]">
        <Loader2 className="animate-spin text-[var(--color-accent)]" size={48} />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--color-bg)] text-[var(--color-text-main)]">
        <h2 className="text-2xl font-bold mb-4 font-mono uppercase tracking-widest opacity-40">// ERR: LOG_NOT_FOUND</h2>
        <Button 
          variant="outline"
          className="border-[var(--color-border)] text-[var(--color-text-dim)] font-mono text-[10px] tracking-widest"
          onClick={() => navigate('/')}
        >
          RETURN_TO_BASE
        </Button>
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
          className="max-w-4xl mx-auto"
        >
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-sm font-mono text-[var(--color-text-dim)] hover:text-[var(--color-accent)] transition-colors mb-12 group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            BACK_TO_LOGS
          </Link>

          <header className="mb-12">
            <div className="card-label mb-6">Log Archive // {post.category}</div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter mb-8 font-roboto leading-tight text-[var(--color-text-main)]">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--color-text-dim)] font-mono uppercase tracking-widest border-y border-[var(--color-border)] py-6">
              <div className="flex items-center gap-2">
                <Calendar size={16} className="text-[var(--color-accent)]" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <User size={16} className="text-[var(--color-accent)]" />
                <span>Jimmy Nyasulu</span>
              </div>
              <Badge variant="outline" className="rounded-md border-[var(--color-accent-dim)] text-[var(--color-accent)] bg-[var(--color-accent-dim)] font-mono text-[10px] tracking-wider px-3 py-1">
                {post.category.toUpperCase()}
              </Badge>
            </div>
          </header>

          <div className="relative aspect-video rounded-xl overflow-hidden mb-12 border border-[var(--color-border)] shadow-2xl shadow-[var(--color-accent)]/5">
            <img 
              src={post.image} 
              alt={post.title} 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)]/80 to-transparent" />
          </div>

          <div className="markdown-body prose prose-invert prose-emerald max-w-none text-lg text-[var(--color-text-dim)] leading-relaxed mb-20">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          <section className="space-y-12">
            <div className="flex items-center gap-4 mb-8">
              <MessageSquare className="text-[var(--color-accent)]" size={24} />
              <h3 className="text-2xl font-extrabold font-roboto tracking-tight">TRANSMISSION_FEEDBACK ({comments.length})</h3>
            </div>

            <form onSubmit={handleCommentSubmit} className="immersive-card p-8 space-y-6">
              <div className="card-label">Open Communication Channel</div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest opacity-60">Identity</label>
                  <Input 
                    placeholder="NAME / ALIAS"
                    className="bg-transparent border-[var(--color-border)] focus:border-[var(--color-accent)] font-mono text-xs h-12"
                    value={newComment.name}
                    onChange={e => setNewComment({...newComment, name: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-mono uppercase tracking-widest opacity-60">Payload</label>
                <Textarea 
                  placeholder="OBSERVATIONS / QUESTIONS"
                  className="bg-transparent border-[var(--color-border)] focus:border-[var(--color-accent)] min-h-[120px] font-mono text-xs"
                  value={newComment.content}
                  onChange={e => setNewComment({...newComment, content: e.target.value})}
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-[var(--color-accent)] text-[var(--color-bg)] font-mono font-bold uppercase tracking-widest h-12 px-8"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <>EXECUTE_POST <Send className="ml-2 w-3 h-3" /></>}
              </Button>
            </form>

            <div className="space-y-6">
              {comments.map((comment) => (
                <motion.div 
                  key={comment.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[var(--color-accent-dim)] text-[var(--color-accent)] flex items-center justify-center font-bold text-xs">
                        {comment.name[0].toUpperCase()}
                      </div>
                      <span className="font-bold text-sm tracking-tight">{comment.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[var(--color-text-dim)] uppercase tracking-widest">{comment.date}</span>
                  </div>
                  <p className="text-sm text-[var(--color-text-dim)] leading-relaxed">
                    {comment.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </section>

          <footer className="mt-20 pt-12 border-t border-[var(--color-border)]">
             <div className="immersive-card bg-[var(--color-surface)] p-8 flex flex-col md:flex-row items-center gap-8 md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-[var(--color-accent)] flex items-center justify-center text-2xl font-extrabold text-[var(--color-bg)] font-roboto">
                    JN
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xl font-roboto text-[var(--color-text-main)]">Jimmy Nyasulu</h4>
                    <p className="text-sm text-[var(--color-text-dim)]">Lead Systems & Software Engineer</p>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/#contact')} 
                  className="bg-[var(--color-accent)] text-[var(--color-bg)] hover:bg-[var(--color-accent)]/90 font-mono font-bold uppercase tracking-widest"
                >
                  DISCUSS_THIS_LOG
                </Button>
             </div>
          </footer>
        </motion.div>
      </div>
    </div>
  );
}
