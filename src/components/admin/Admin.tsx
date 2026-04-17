import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  FileText, 
  Plus, 
  Save, 
  Trash2, 
  LogOut, 
  Settings as SettingsIcon, 
  CheckSquare, 
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Package,
  ShieldCheck,
  Search,
  ChevronRight,
  Globe,
  Tag,
  User,
  Award,
  Edit,
  X,
  Loader2,
  ExternalLink,
  Zap,
} from 'lucide-react';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { BlogPost, Project, Certificate, Skill } from '@/types/index';
import { BLOG_POSTS, PROJECTS, CERTIFICATES, SKILLS } from '@/constants';

const ADMIN_EMAIL = "Jimmynyasulu98@gmail.com";

export function Admin() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);

  // Editing states
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  // Form states
  const [newPost, setNewPost] = useState({ 
    title: '', excerpt: '', content: '', category: 'Networking', image: '', published: true 
  });
  const [newProject, setNewProject] = useState({ 
    title: '', description: '', image: '', tags: '', github: '', link: '' 
  });
  const [newCert, setNewCert] = useState({ 
    name: '', issuer: '', date: '', image: '', link: '' 
  });
  const [newSkill, setNewSkill] = useState({ 
    name: '', category: 'Frontend', level: 80 
  });
  const [newTask, setNewTask] = useState({ title: '', priority: 'medium' });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAdmin(u?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase());
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAdmin || !user) return;

    // Small delay to ensure the database recognizes your login token
    const timer = setTimeout(() => {
      const unsubPosts = onSnapshot(collection(db, 'posts'), (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost));
        setPosts(data.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'posts'));

      const unsubProjects = onSnapshot(collection(db, 'projects'), (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
        setProjects(data.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'projects'));

      const unsubMessages = onSnapshot(collection(db, 'contact_messages'), (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
        setMessages(data.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'contact_messages'));

      const unsubTasks = onSnapshot(collection(db, 'admin_tasks'), (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as any));
        setTasks(data.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'admin_tasks'));

      const unsubCerts = onSnapshot(collection(db, 'certificates'), (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Certificate));
        setCertificates(data.sort((a: any, b: any) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'certificates'));

      const unsubSkills = onSnapshot(collection(db, 'skills'), (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as unknown as Skill));
        setSkills(data.sort((a, b) => (a.category || '').localeCompare(b.category || '')));
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'skills'));

      // Use a global to store unsubs for simple cleanup
      (window as any)._adminUnsubs = [unsubPosts, unsubProjects, unsubMessages, unsubTasks, unsubCerts, unsubSkills];
    }, 1500);

    return () => {
      clearTimeout(timer);
      if ((window as any)._adminUnsubs) {
        (window as any)._adminUnsubs.forEach((u: any) => u && u());
        delete (window as any)._adminUnsubs;
      }
    };
  }, [isAdmin, user]);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      console.error('Login Error:', err);
      setError(`AUTH_ERR: ${err.code || err.message}`);
    }
  };

  const handleLogout = () => signOut(auth);

  const createPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess('');
    try {
      if (editingPost) {
        await updateDoc(doc(db, 'posts', editingPost.id), {
          ...newPost,
          updatedAt: serverTimestamp()
        });
        setEditingPost(null);
        setSuccess('Technical Log updated successfully!');
      } else {
        await addDoc(collection(db, 'posts'), {
          ...newPost,
          author: user?.displayName || 'Jimmy Nyasulu',
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          createdAt: serverTimestamp()
        });
        setSuccess('Technical Log shared to archive!');
      }
      setNewPost({ title: '', excerpt: '', content: '', category: 'Networking', image: '', published: true });
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      handleFirestoreError(err, editingPost ? OperationType.UPDATE : OperationType.CREATE, 'posts');
    } finally {
      setIsSaving(false);
    }
  };

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess('');
    try {
      const data = {
        ...newProject,
        tags: typeof newProject.tags === 'string' 
          ? newProject.tags.split(',').map(t => t.trim()).filter(Boolean)
          : newProject.tags,
      };

      if (editingProject) {
        await updateDoc(doc(db, 'projects', editingProject.id), {
          ...data,
          updatedAt: serverTimestamp()
        });
        setEditingProject(null);
        setSuccess('Infrastructure project updated!');
      } else {
        await addDoc(collection(db, 'projects'), {
          ...data,
          createdAt: serverTimestamp()
        });
        setSuccess('New infrastructure indexed successfully!');
      }
      setNewProject({ title: '', description: '', image: '', tags: '', github: '', link: '' });
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      handleFirestoreError(err, editingProject ? OperationType.UPDATE : OperationType.CREATE, 'projects');
    } finally {
      setIsSaving(false);
    }
  };

  const createCert = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess('');
    try {
      if (editingCert) {
        await updateDoc(doc(db, 'certificates', editingCert.id), {
          ...newCert,
          updatedAt: serverTimestamp()
        });
        setEditingCert(null);
        setSuccess('Certification updated successfully!');
      } else {
        const docRef = await addDoc(collection(db, 'certificates'), {
          ...newCert,
          createdAt: serverTimestamp()
        });
        console.log("Certificate Created in Firestore. ID:", docRef.id);
        setSuccess(`New certification added live! (Ref: ${docRef.id})`);
      }
      setNewCert({ name: '', issuer: '', date: '', image: '', link: '' });
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      handleFirestoreError(err, editingCert ? OperationType.UPDATE : OperationType.CREATE, 'certificates');
    } finally {
      setIsSaving(false);
    }
  };

  const seedSkills = async () => {
    if (skills.length > 0) {
      if (!confirm(`Warning: You already have ${skills.length} skills. Seeding will create duplicates. Do you want to continue?`)) return;
    } else {
      if (!confirm('This will import all skills from the default template. Proceed?')) return;
    }
    setIsSaving(true);
    setSuccess('');
    setError('');
    try {
      for (const skill of SKILLS) {
        await addDoc(collection(db, 'skills'), { 
          ...skill, 
          createdAt: serverTimestamp() 
        });
      }
      setSuccess('Skills Matrix successfully imported!');
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'skills');
    } finally {
      setIsSaving(false);
    }
  };

  const createSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSuccess('');
    try {
      if (editingSkill) {
        await updateDoc(doc(db, 'skills', editingSkill.id!), {
          ...newSkill,
          updatedAt: serverTimestamp()
        });
        setEditingSkill(null);
        setSuccess('Skill updated successfully!');
      } else {
        await addDoc(collection(db, 'skills'), {
          ...newSkill,
          createdAt: serverTimestamp()
        });
        setSuccess('New skill added to matrix!');
      }
      setNewSkill({ name: '', category: 'Frontend', level: 80 });
      setTimeout(() => setSuccess(''), 5000);
    } catch (err) {
      handleFirestoreError(err, editingSkill ? OperationType.UPDATE : OperationType.CREATE, 'skills');
    } finally {
      setIsSaving(false);
    }
  };

  const seedData = async () => {
    const hasData = posts.length > 0 || projects.length > 0 || certificates.length > 0 || skills.length > 0;
    if (hasData) {
      if (!confirm('Warning: Your database already contains data. Seeding will create duplicates of all template items. Proceed?')) return;
    } else {
      if (!confirm('This will seed sample data into your database. Existing data will remain. Proceed?')) return;
    }
    try {
      for (const post of BLOG_POSTS) {
        const { id, ...postData } = post;
        await addDoc(collection(db, 'posts'), { 
          ...postData, 
          createdAt: serverTimestamp(),
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
        });
      }
      for (const project of PROJECTS) {
        const { id, ...projectData } = project;
        await addDoc(collection(db, 'projects'), { ...projectData, createdAt: serverTimestamp() });
      }
      for (const cert of CERTIFICATES) {
        const { id, ...certData } = cert;
        await addDoc(collection(db, 'certificates'), { ...certData, createdAt: serverTimestamp() });
      }
      for (const skill of SKILLS) {
        await addDoc(collection(db, 'skills'), { ...skill, createdAt: serverTimestamp() });
      }
      setSuccess('Database successfully hydrated with sample knowledge!');
    } catch (err) {
      console.error("Hydration Error:", err);
      alert('DATABASE_HYDRATION_FAILED: Check console.');
    }
  };

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title) return;
    try {
      await addDoc(collection(db, 'admin_tasks'), {
        ...newTask,
        status: 'pending',
        createdAt: serverTimestamp()
      });
      setNewTask({ title: '', priority: 'medium' });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'admin_tasks');
    }
  };

  const deleteItem = async (col: string, id: string) => {
    if (!id) {
      setError(`CRITICAL_FAIL: Missing document ID for ${col}`);
      return;
    }
    
    if (!confirm('Permanent deletion requested. This action is irreversible. Proceed?')) return;
    
    setIsSaving(true);
    setSuccess('');
    setError('');
    
    try {
      await deleteDoc(doc(db, col, id));
      setSuccess(`${col.toUpperCase()}_DELETED_SUCCESSFULLY`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error(`Delete Error [${col}]:`, err);
      setError(`ACCESS_DENIED: ${err.message || 'Permissions insufficient for deletion.'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const purgeSkills = async () => {
    if (!confirm('DANGER: This will delete ALL skills in your database. Continue?')) return;
    setIsSaving(true);
    setError('');
    try {
      // We perform deletions one by one for simplicity in this environment
      const deletePromises = skills.map(s => deleteDoc(doc(db, 'skills', s.id!)));
      await Promise.all(deletePromises);
      setSuccess('Skills matrix purged successfully!');
    } catch (err: any) {
      setError(`PURGE_FAILED: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const startEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setNewPost({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      image: post.image,
      published: post.published
    });
    setActiveTab('posts');
  };

  const startEditProject = (project: Project) => {
    setEditingProject(project);
    setNewProject({
      title: project.title,
      description: project.description,
      image: project.image,
      tags: project.tags.join(', '),
      github: project.github || '',
      link: project.link || ''
    });
    setActiveTab('projects');
  };

  const startEditCert = (cert: Certificate) => {
    setEditingCert(cert);
    setNewCert({
      name: cert.name,
      issuer: cert.issuer,
      date: cert.date,
      image: cert.image || '',
      link: cert.link || ''
    });
    setActiveTab('certificates');
  };

  const startEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setNewSkill({
      name: skill.name,
      category: skill.category,
      level: skill.level
    });
    setActiveTab('skills');
  };

  const cancelEdit = () => {
    setEditingPost(null);
    setEditingProject(null);
    setEditingCert(null);
    setEditingSkill(null);
    setNewPost({ title: '', excerpt: '', content: '', category: 'Networking', image: '', published: true });
    setNewProject({ title: '', description: '', image: '', tags: '', github: '', link: '' });
    setNewCert({ name: '', issuer: '', date: '', image: '', link: '' });
    setNewSkill({ name: '', category: 'Frontend', level: 80 });
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-900 text-[var(--color-accent)] font-mono">INITIALIZING_PROTOCOL...</div>;

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-roboto">
        <Card className="w-full max-w-md border-none shadow-xl overflow-hidden">
          <div className="h-2 bg-[var(--color-accent)] w-full" />
          <CardHeader className="pt-10 pb-6 text-center">
            <div className="w-16 h-16 bg-[var(--color-accent-dim)] rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={32} className="text-[var(--color-accent)]" />
            </div>
            <CardTitle className="text-3xl font-extrabold text-slate-900">ADMIN_ACCESS</CardTitle>
            <p className="text-slate-500 text-sm font-mono uppercase tracking-widest mt-2">
              Identity Verification Required
            </p>
          </CardHeader>
          <CardContent className="px-10 pb-10">
            <div className="space-y-6">
              <div className="bg-amber-50 border-l-4 border-amber-500 p-4 text-amber-700 text-sm rounded">
                Restricted to authorized identity: <br/> <strong>{ADMIN_EMAIL}</strong>
              </div>
              
              <Button 
                onClick={handleLogin} 
                className="w-full h-12 bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 font-bold flex items-center justify-center gap-3 transition-all active:scale-95"
              >
                <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                SIGN_IN_WITH_GOOGLE
              </Button>

              <div className="flex justify-center">
                <a 
                  href={window.location.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-[10px] font-mono text-[var(--color-accent)] hover:underline flex items-center gap-1"
                >
                  <Globe size={10} /> OPEN_IN_NEW_TAB_FOR_POPUP
                </a>
              </div>

              <div className="text-[10px] text-slate-400 font-mono space-y-2 text-center border-t pt-4">
                <p>PRO_TIP: If popup fails to appear, try Opening App in a New Tab.</p>
                <p>Ensure current domain is authorized in Firebase Console.</p>
              </div>

              {error && <p className="text-red-500 text-xs font-bold text-center mt-4 p-2 bg-red-50 border border-red-100 rounded">ERROR: {error}</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-roboto">
        <Card className="w-full max-w-md border-none shadow-xl overflow-hidden">
          <div className="h-2 bg-red-500 w-full" />
          <CardHeader className="pt-10 pb-6 text-center">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle size={32} className="text-red-500" />
            </div>
            <CardTitle className="text-3xl font-extrabold text-slate-900">ACCESS_DENIED</CardTitle>
            <p className="text-slate-500 text-sm font-mono uppercase tracking-widest mt-2">
              Unauthorized Identity Detected
            </p>
          </CardHeader>
          <CardContent className="px-10 pb-10">
            <div className="space-y-6">
              <div className="p-4 bg-slate-100 rounded text-slate-600 text-sm flex gap-3">
                <img src={user.photoURL || ''} className="w-10 h-10 rounded-full" alt="" />
                <div>
                  <p className="font-bold">{user.displayName}</p>
                  <p className="text-xs">{user.email}</p>
                </div>
              </div>
              
              <p className="text-xs text-slate-500 leading-relaxed text-center">
                The identity provided does not match the master administrative credentials.
                Please sign out and use the authorized account.
              </p>

              <Button 
                onClick={handleLogout} 
                variant="outline"
                className="w-full h-12 border-slate-200 text-slate-900 font-bold hover:bg-slate-50"
              >
                TERMINATE_SESSION & TRY_AGAIN
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-roboto">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-xl font-extrabold flex items-center gap-2 text-slate-900">
            <LayoutDashboard className="text-[var(--color-accent)]" />
            ADMIN_CORE
          </h1>
          <div className="flex items-center gap-2 mt-4 px-1 py-1 bg-slate-50 rounded border border-slate-100 overflow-hidden">
            <img src={user.photoURL || ''} className="w-6 h-6 rounded-full" alt="" />
            <div className="overflow-hidden">
              <p className="text-[10px] font-bold text-slate-700 truncate">{user.displayName}</p>
              <p className="text-[8px] text-slate-400 truncate">{user.email}</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'tasks', label: 'Task Manager', icon: CheckSquare },
            { id: 'messages', label: 'User Messages', icon: MessageSquare },
            { id: 'posts', label: 'Tech Logs', icon: FileText },
            { id: 'projects', label: 'Featured Infra', icon: Package },
            { id: 'certificates', label: 'Certifications', icon: Award },
            { id: 'skills', label: 'Skills Matrix', icon: Zap },
            { id: 'settings', label: 'Settings', icon: SettingsIcon },
          ].map((item) => (
            <Button 
              key={item.id}
              variant={activeTab === item.id ? 'default' : 'ghost'} 
              className={cn(
                "w-full justify-start gap-3 font-bold text-sm",
                activeTab === item.id ? "bg-[var(--color-accent)] text-white" : "text-slate-600"
              )}
              onClick={() => setActiveTab(item.id)}
            >
              <item.icon size={18} />
              {item.label}
            </Button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-200">
          <Button 
            variant="ghost" 
            className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 font-bold"
            onClick={handleLogout}
          >
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-extrabold uppercase tracking-widest text-slate-900">{activeTab.replace('-', ' ')}</h2>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="font-mono text-[10px] border-green-200 text-green-600 bg-green-50 uppercase">Session Active</Badge>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          {success && (
            <div className="mb-6 bg-green-500 text-white p-4 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300">
              <CheckCircle2 size={20} />
              <p className="font-bold text-sm tracking-wide uppercase">{success}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-500 text-white p-4 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-300 relative group">
              <AlertCircle size={20} />
              <div className="flex-1">
                <p className="font-bold text-sm tracking-wide uppercase">System Error Detected</p>
                <p className="text-[10px] font-mono opacity-80 break-all">{error}</p>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setError('')} className="text-white hover:bg-white/20">
                <X size={16} />
              </Button>
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-4 lg:grid-cols-5 gap-6">
                {[
                  { label: 'Infrastructure', count: projects.length, icon: Package, color: 'bg-blue-500' },
                  { label: 'Tech Logs', count: posts.length, icon: FileText, color: 'bg-purple-500' },
                  { label: 'Certs', count: certificates.length, icon: Award, color: 'bg-indigo-500' },
                  { label: 'Skills', count: skills.length, icon: Zap, color: 'bg-cyan-500' },
                  { label: 'Messages', count: messages.length, icon: MessageSquare, color: 'bg-emerald-500' },
                  { label: 'Active Tasks', count: tasks.length, icon: CheckSquare, color: 'bg-amber-500' },
                ].map(stat => (
                  <Card key={stat.label} className={cn("border-none shadow-sm text-white", stat.color)}>
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-white/70 text-xs font-bold uppercase tracking-widest mb-2">{stat.label}</p>
                          <h3 className="text-4xl font-extrabold">{stat.count}</h3>
                        </div>
                        <stat.icon size={24} className="text-white/30" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-extrabold">Recent Technical Activities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tasks.slice(0, 5).map(task => (
                        <div key={task.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                          <CheckCircle2 size={16} className={task.status === 'completed' ? 'text-green-500' : 'text-slate-300'} />
                          <span className={cn("text-sm font-bold flex-1", task.status === 'completed' && "line-through text-slate-400")}>{task.title}</span>
                          <Badge variant="outline" className="text-[9px] uppercase">{task.priority}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-none shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-xl font-extrabold">Latest Security Logs</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 font-mono text-[10px]">
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-slate-400">SIGN_IN_EVENT</span>
                        <span className="text-green-600 font-bold">SUCCESS</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-slate-400">IP_PROTOCOL</span>
                        <span className="text-slate-600">STATIC_ASSIGNED</span>
                      </div>
                      <div className="flex justify-between border-b pb-2">
                        <span className="text-slate-400">DATABASE_LINK</span>
                        <span className="text-blue-600 font-bold">FIRESTORE_ACTIVE</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div className="space-y-8">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-extrabold">Add New Task</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={addTask} className="grid md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Task Description</label>
                      <Input 
                        placeholder="What needs to be done?" 
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Priority</label>
                      <select 
                        className="w-full h-10 rounded-md border border-slate-200 bg-white px-3 text-sm"
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <Button type="submit" className="bg-[var(--color-accent)] font-bold h-10">
                      <Plus size={18} className="mr-2" /> ADD_TASK
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="grid gap-4">
                {tasks.map((task) => (
                  <Card key={task.id} className="border-none shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={cn(
                          "w-2 h-10 rounded-full",
                          task.priority === 'high' ? 'bg-red-500' : task.priority === 'medium' ? 'bg-amber-500' : 'bg-blue-500'
                        )} />
                        <div>
                          <h4 className="font-bold">{task.title}</h4>
                          <span className="text-[10px] uppercase font-mono text-slate-400">{task.priority} Priority</span>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => deleteItem('admin_tasks', task.id)} className="text-slate-300 hover:text-red-500">
                        <Trash2 size={18} />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'posts' && (
            <div className="space-y-8">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-extrabold flex items-center gap-2">
                    <FileText className="text-[var(--color-accent)]" /> 
                    {editingPost ? 'Update Technical Log' : 'Publish Technical Log'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={createPost} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Headline</label>
                        <Input 
                          placeholder="Optimization of Micro-Services..." 
                          value={newPost.title}
                          onChange={e => setNewPost({...newPost, title: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Category</label>
                        <Input 
                          placeholder="DevOps / Networking" 
                          value={newPost.category}
                          onChange={e => setNewPost({...newPost, category: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Excerpt</label>
                      <Input 
                        placeholder="Short summary for archive view" 
                        value={newPost.excerpt}
                        onChange={e => setNewPost({...newPost, excerpt: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Banner Image URL</label>
                      <Input 
                        placeholder="https://images.unsplash.com/..." 
                        value={newPost.image}
                        onChange={e => setNewPost({...newPost, image: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-500">MD Content</label>
                      <Textarea 
                        placeholder="Entry technical details (Markdown Supported)" 
                        className="min-h-[300px] font-mono text-xs"
                        value={newPost.content}
                        onChange={e => setNewPost({...newPost, content: e.target.value})}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={isSaving} className="bg-[var(--color-accent)] font-bold px-8 flex items-center gap-2">
                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : (editingPost ? <Save size={18} /> : <Plus size={18} />)} 
                        {isSaving ? 'SYNCHRONIZING...' : (editingPost ? 'UPDATE_ENTRY' : 'PUBLISH_TO_ARCHIVE')}
                      </Button>
                      {editingPost && (
                        <Button variant="ghost" onClick={cancelEdit} className="ml-2 font-bold">CANCEL</Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="grid gap-4">
                {posts.map(post => (
                  <Card key={post.id} className="border-none shadow-sm">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4 overflow-hidden">
                        <img src={post.image} className="w-12 h-12 rounded object-cover border" alt="" referrerPolicy="no-referrer" />
                        <div className="overflow-hidden">
                          <h4 className="font-bold truncate">{post.title}</h4>
                          <p className="text-[10px] text-slate-400 uppercase font-mono">
                            {post.category} • {post.date}
                            {!(post as any).createdAt && <span className="text-amber-500 ml-2">⚠️ NO_TIMESTAMP (HIDDEN_BY_SERVER_SORT)</span>}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={() => startEditPost(post)} className="text-slate-300 hover:text-[var(--color-accent)]">
                          <Edit size={18} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => deleteItem('posts', post.id)} className="text-slate-300 hover:text-red-500">
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div className="space-y-8">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-extrabold flex items-center gap-2">
                    <Package className="text-[var(--color-accent)]" />
                    {editingProject ? 'Update Infrastructure Design' : 'Archive Featured Infrastructure'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={createProject} className="space-y-4">
                    <Input 
                      placeholder="Infrastructure Design Title" 
                      value={newProject.title}
                      onChange={e => setNewProject({...newProject, title: e.target.value})}
                    />
                    <Textarea 
                      placeholder="Technical overview and architectual details..." 
                      className="min-h-[120px]"
                      value={newProject.description}
                      onChange={e => setNewProject({...newProject, description: e.target.value})}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <Input 
                        placeholder="Image URL" 
                        value={newProject.image}
                        onChange={e => setNewProject({...newProject, image: e.target.value})}
                      />
                      <Input 
                        placeholder="Tags (Docker, AWS, Cisco)" 
                        value={newProject.tags}
                        onChange={e => setNewProject({...newProject, tags: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Input 
                        placeholder="Git Repository" 
                        value={newProject.github}
                        onChange={e => setNewProject({...newProject, github: e.target.value})}
                      />
                      <Input 
                        placeholder="Live Deployment" 
                        value={newProject.link}
                        onChange={e => setNewProject({...newProject, link: e.target.value})}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={isSaving} className="bg-[var(--color-accent)] font-bold px-8 flex items-center gap-2">
                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : (editingProject ? <Save size={18} /> : <Plus size={18} />)} 
                        {isSaving ? 'SYNCHRONIZING...' : (editingProject ? 'UPDATE_ARCHIVE' : 'ARCHIVE_PROJECT')}
                      </Button>
                      {editingProject && (
                        <Button variant="ghost" onClick={cancelEdit} className="font-bold">CANCEL</Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 gap-6">
                {projects.map(project => (
                  <Card key={project.id} className="border-none shadow-sm overflow-hidden flex flex-col">
                    <div className="aspect-video relative overflow-hidden">
                      <img src={project.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Button variant="secondary" size="icon" onClick={() => startEditProject(project)}>
                          <Edit size={16} />
                        </Button>
                        <Button variant="destructive" size="icon" onClick={() => deleteItem('projects', project.id)}>
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4 flex-1">
                      <h4 className="font-bold text-lg mb-2">{project.title}</h4>
                      {!(project as any).createdAt && <Badge variant="destructive" className="text-[8px] mb-2">MISSING_METADATA_TIMESTAMP</Badge>}
                      <p className="text-xs text-slate-500 line-clamp-2 mb-4">{project.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map(t => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'certificates' && (
            <div className="space-y-8">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-extrabold flex items-center gap-2">
                    <Award className="text-[var(--color-accent)]" />
                    {editingCert ? 'Update Credential' : 'Register New Credential'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={createCert} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input 
                        placeholder="Certification Name" 
                        value={newCert.name}
                        onChange={e => setNewCert({...newCert, name: e.target.value})}
                      />
                      <Input 
                        placeholder="Issuing Organization" 
                        value={newCert.issuer}
                        onChange={e => setNewCert({...newCert, issuer: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <Input 
                        placeholder="Date (e.g. 2024)" 
                        value={newCert.date}
                        onChange={e => setNewCert({...newCert, date: e.target.value})}
                      />
                      <Input 
                        placeholder="Credential Image URL" 
                        value={newCert.image}
                        onChange={e => setNewCert({...newCert, image: e.target.value})}
                      />
                      <Input 
                        placeholder="Verify Link (Optional)" 
                        value={newCert.link}
                        onChange={e => setNewCert({...newCert, link: e.target.value})}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={isSaving} className="bg-[var(--color-accent)] font-bold px-8 flex items-center gap-2">
                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : (editingCert ? <Save size={18} /> : <Plus size={18} />)} 
                        {isSaving ? 'SYNCHRONIZING...' : (editingCert ? 'UPDATE_CREDENTIAL' : 'REGISTER_CREDENTIAL')}
                      </Button>
                      {editingCert && (
                        <Button variant="ghost" onClick={cancelEdit} className="font-bold">CANCEL</Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-3 gap-6">
                {certificates.map(cert => (
                  <Card key={cert.id} className="border-none shadow-sm overflow-hidden flex flex-col">
                    <div className="aspect-[4/3] relative overflow-hidden bg-slate-100 flex items-center justify-center">
                      <img src={cert.image || 'https://picsum.photos/seed/cert/400/300'} alt="" className="max-w-full max-h-full object-contain" referrerPolicy="no-referrer" />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Button variant="secondary" size="icon" className="w-8 h-8" onClick={() => startEditCert(cert)}>
                          <Edit size={14} />
                        </Button>
                        <Button variant="destructive" size="icon" className="w-8 h-8" onClick={() => deleteItem('certificates', cert.id)}>
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-bold text-sm truncate">{cert.name}</h4>
                      <p className="text-[10px] text-slate-400 font-mono uppercase">{cert.issuer} • {cert.date}</p>
                      {cert.link && (
                        <a 
                          href={cert.link} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-[10px] text-[var(--color-accent)] hover:underline flex items-center gap-1 mt-2 font-bold"
                        >
                          REGISTERED_VERIFICATION <ExternalLink size={10} />
                        </a>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'skills' && (
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-extrabold tracking-tight text-slate-900">Skills Matrix</h3>
                  <p className="text-sm text-slate-500 font-mono mt-1 uppercase tracking-tight">Manage Technical Expertise Registry ({skills.length} Items)</p>
                </div>
                <div className="flex gap-2">
                  {skills.length > 0 && (
                    <Button 
                      onClick={purgeSkills} 
                      variant="outline" 
                      className="border-red-200 text-red-500 hover:bg-red-50 font-bold gap-2"
                    >
                      <Trash2 size={16} /> PURGE_ALL
                    </Button>
                  )}
                  {skills.length === 0 && (
                    <Button 
                      onClick={seedSkills} 
                      variant="outline" 
                      className="border-[var(--color-accent)] text-[var(--color-accent)] font-bold gap-2"
                    >
                      <Plus size={16} /> IMPORT_TEMPLATE_SKILLS
                    </Button>
                  )}
                </div>
              </div>

              <Card className="border-none shadow-sm overflow-hidden bg-[var(--color-surface)] border border-[var(--color-border)]">
                <CardHeader>
                  <CardTitle className="text-xl font-extrabold flex items-center gap-2">
                    <Zap className="text-[var(--color-accent)]" />
                    {editingSkill ? 'Refine Expertise' : 'Register New Skill'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={createSkill} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input 
                        placeholder="Skill Name (e.g. Next.js)" 
                        value={newSkill.name}
                        onChange={e => setNewSkill({...newSkill, name: e.target.value})}
                      />
                      <select 
                        className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)] disabled:cursor-not-allowed disabled:opacity-50"
                        value={newSkill.category}
                        onChange={e => setNewSkill({...newSkill, category: e.target.value as any})}
                      >
                        <option value="Frontend">Frontend</option>
                        <option value="Backend">Backend</option>
                        <option value="DevOps">DevOps</option>
                        <option value="Networking">Networking</option>
                        <option value="AI">AI</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-mono font-bold">
                        <span>PROFICIENCY_LEVEL</span>
                        <span>{newSkill.level}%</span>
                      </div>
                      <input 
                        type="range"
                        min="0"
                        max="100"
                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-accent)]"
                        value={newSkill.level}
                        onChange={e => setNewSkill({...newSkill, level: parseInt(e.target.value)})}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="submit" disabled={isSaving} className="bg-[var(--color-accent)] font-bold px-8 flex items-center gap-2">
                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : (editingSkill ? <Save size={18} /> : <Plus size={18} />)} 
                        {isSaving ? 'SYNCHRONIZING...' : (editingSkill ? 'UPDATE_SKILL' : 'REGISTER_SKILL')}
                      </Button>
                      {editingSkill && (
                        <Button variant="ghost" onClick={cancelEdit} className="font-bold">CANCEL</Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {['Frontend', 'Backend', 'DevOps', 'Networking', 'AI', 'Other'].map(cat => {
                  const catSkills = skills.filter(s => s.category === cat);
                  if (catSkills.length === 0) return null;
                  return (
                    <Card key={cat} className="border-none shadow-sm overflow-hidden bg-white">
                      <div className="bg-slate-50 px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">{cat}</span>
                        <Badge variant="outline" className="text-[8px] h-4">{catSkills.length}</Badge>
                      </div>
                      <CardContent className="p-4 space-y-3">
                        {catSkills.map(skill => (
                          <div key={skill.id} className="flex items-center justify-between group">
                            <div className="flex-1">
                              <div className="flex justify-between items-center mb-1">
                                <div className="flex flex-col">
                                  <span className="text-sm font-bold text-slate-700">{skill.name}</span>
                                  <span className="text-[8px] font-mono text-slate-400">ID: {skill.id?.slice(-8)}</span>
                                </div>
                                <span className="text-[10px] font-mono text-slate-400">{skill.level}%</span>
                              </div>
                              <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-[var(--color-accent)]" 
                                  style={{ width: `${skill.level}%` }}
                                />
                              </div>
                            </div>
                            <div className="flex gap-1 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEditSkill(skill)}>
                                <Edit size={12} />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500" onClick={() => deleteItem('skills', skill.id)}>
                                <Trash2 size={12} />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold uppercase tracking-widest text-slate-900">Communication Logs ({messages.length})</h3>
              </div>

              {messages.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
                  <MessageSquare className="mx-auto text-slate-300 mb-4" size={48} />
                  <p className="text-slate-500 font-bold">No active communications found.</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {messages.map((msg) => (
                    <Card key={msg.id} className="border-none shadow-sm overflow-hidden">
                      <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center font-bold text-xs">
                            {msg.name[0].toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900">{msg.name}</span>
                            <span className="text-slate-400 text-[10px] ml-2 font-mono">{msg.email}</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{msg.date}</span>
                      </div>
                      <CardContent className="p-6">
                        <h4 className="font-extrabold text-slate-900 mb-2 uppercase tracking-tight text-sm">{msg.subject}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                        <div className="mt-4 flex justify-end">
                          <Button variant="ghost" size="sm" onClick={() => deleteItem('contact_messages', msg.id)} className="text-red-500 h-8">
                            <Trash2 size={14} className="mr-2" /> DISCARD
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-6">
              <Card className="border-none shadow-sm overflow-hidden">
                <div className="h-1 bg-[var(--color-accent)] w-full" />
                <CardHeader>
                  <CardTitle className="text-xl font-extrabold">System Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center">
                        <User className="text-slate-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{user.displayName}</p>
                        <p className="text-xs text-slate-500 font-mono tracking-tight">{user.email}</p>
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-700 border-green-200">MASTER_ADMIN</Badge>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Security Protocol</h4>
                    <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="text-[var(--color-accent)]" size={20} />
                        <div>
                          <p className="text-sm font-bold">Encrypted Session</p>
                          <p className="text-[10px] text-slate-500 font-mono">FIRESTORE_SESSION_ACTIVE</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="font-mono text-[9px]">AES_256</Badge>
                    </div>
                  </div>

                  <div className="space-y-4 pt-6 border-t border-slate-100">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400">Database Tools</h4>
                    <Button 
                      variant="outline" 
                      onClick={seedData}
                      className="w-full border-dashed border-slate-200 text-slate-500 font-bold hover:bg-slate-50 hover:text-[var(--color-accent)]"
                    >
                      <Plus className="mr-2" size={16} /> SEED_INITIAL_SAMPLE_DATA
                    </Button>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                    <p className="text-[10px] text-slate-400 font-mono">ADMIN_VERSION_1.2.0_FIREBASE</p>
                    <Button variant="ghost" onClick={handleLogout} className="text-red-500 h-8 font-bold text-xs">
                      TERMINATE_PROTOCOL
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm border-l-4 border-[var(--color-accent)] bg-[var(--color-accent-dim)]/20">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <AlertCircle className="text-[var(--color-accent)] shrink-0" size={24} />
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Deployment Notice</h4>
                      <p className="text-sm text-slate-500 leading-relaxed font-mono text-[11px]">
                        Changes made here are synchronized in real-time with the production database. 
                        Deletion of technical logs or infrastructure projects is irreversible.
                        Cloud Storage quota is currently monitored.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
