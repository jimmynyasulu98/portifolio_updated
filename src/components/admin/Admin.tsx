import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  FileText, 
  Plus, 
  Save, 
  Trash2, 
  LogOut, 
  Settings, 
  CheckSquare, 
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
}

interface Message {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
}

export function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [resetKey, setResetKey] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showReset, setShowReset] = useState(false);
  const [error, setError] = useState('');
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newTask, setNewTask] = useState({ title: '', priority: 'medium', dueDate: '' });
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState({ title: '', priority: 'medium' });
  
  const [changePasswordData, setChangePasswordData] = useState({ current: '', new: '', confirm: '' });
  const [changePasswordStatus, setChangePasswordStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const savedTasks = localStorage.getItem('admin_tasks');
    const savedMessages = localStorage.getItem('contact_messages');
    const authStatus = sessionStorage.getItem('admin_auth');
    
    if (savedTasks) setTasks(JSON.parse(savedTasks));
    if (savedMessages) setMessages(JSON.parse(savedMessages));
    if (authStatus === 'true') setIsLoggedIn(true);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = localStorage.getItem('admin_password') || 'admin';
    if (password === correctPassword) {
      setIsLoggedIn(true);
      sessionStorage.setItem('admin_auth', 'true');
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const currentStored = localStorage.getItem('admin_password') || 'admin';
    
    if (changePasswordData.current !== currentStored) {
      setChangePasswordStatus({ type: 'error', message: 'Current password is incorrect' });
      return;
    }
    
    if (changePasswordData.new !== changePasswordData.confirm) {
      setChangePasswordStatus({ type: 'error', message: 'New passwords do not match' });
      return;
    }
    
    if (changePasswordData.new.length < 4) {
      setChangePasswordStatus({ type: 'error', message: 'Password must be at least 4 characters' });
      return;
    }
    
    localStorage.setItem('admin_password', changePasswordData.new);
    setChangePasswordStatus({ type: 'success', message: 'Password updated successfully' });
    setChangePasswordData({ current: '', new: '', confirm: '' });
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would be a server-side check. 
    // For this environment, we use the key provided by the user.
    const validResetKey = "password-reset-key-2026"; 
    
    if (resetKey === validResetKey) {
      localStorage.setItem('admin_password', newPassword);
      setShowReset(false);
      setError('Password reset successful. Please login.');
      setResetKey('');
      setNewPassword('');
    } else {
      setError('Invalid reset key');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('admin_auth');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-roboto">
        <Card className="w-full max-w-md border-none shadow-xl overflow-hidden">
          <div className="h-2 bg-[var(--color-accent)] w-full" />
          <CardHeader className="pt-10 pb-6 text-center">
            <div className="w-16 h-16 bg-[var(--color-accent-dim)] rounded-full flex items-center justify-center mx-auto mb-4">
              <Settings size={32} className="text-[var(--color-accent)]" />
            </div>
            <CardTitle className="text-3xl font-extrabold text-slate-900">ADMIN_ACCESS</CardTitle>
            <p className="text-slate-500 text-sm font-mono uppercase tracking-widest mt-2">
              {showReset ? 'Protocol: Password Reset' : 'Protocol: Authentication Required'}
            </p>
          </CardHeader>
          <CardContent className="px-10 pb-10">
            {showReset ? (
              <form onSubmit={handleReset} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Reset Key</label>
                  <Input 
                    type="password" 
                    placeholder="ENTER_RESET_KEY"
                    value={resetKey}
                    onChange={(e) => setResetKey(e.target.value)}
                    className="h-12 border-slate-200 focus:border-[var(--color-accent)] font-mono"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500">New Password</label>
                  <Input 
                    type="password" 
                    placeholder="NEW_PASSWORD"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="h-12 border-slate-200 focus:border-[var(--color-accent)] font-mono"
                  />
                </div>
                {error && <p className="text-xs font-bold text-red-500 mt-2">{error}</p>}
                <Button type="submit" className="w-full h-12 bg-[var(--color-accent)] font-bold uppercase tracking-widest mt-4">
                  RESET_PASSWORD
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => { setShowReset(false); setError(''); }}
                  className="w-full text-slate-500 font-bold"
                >
                  BACK_TO_LOGIN
                </Button>
              </form>
            ) : (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono uppercase tracking-widest text-slate-500">Access Password</label>
                  <Input 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-12 border-slate-200 focus:border-[var(--color-accent)] font-mono"
                  />
                </div>
                {error && <p className="text-xs font-bold text-red-500 mt-2">{error}</p>}
                <Button type="submit" className="w-full h-12 bg-[var(--color-accent)] font-bold uppercase tracking-widest mt-4">
                  EXECUTE_LOGIN
                </Button>
                <div className="text-center mt-6">
                  <button 
                    type="button"
                    onClick={() => { setShowReset(true); setError(''); }}
                    className="text-[10px] font-mono uppercase tracking-widest text-slate-400 hover:text-[var(--color-accent)] transition-colors"
                  >
                    Forgot Password? Reset Protocol
                  </button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  const saveTasks = (updatedTasks: Task[]) => {
    setTasks(updatedTasks);
    localStorage.setItem('admin_tasks', JSON.stringify(updatedTasks));
  };

  const addTask = () => {
    if (!newTask.title) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTask.title,
      status: 'pending',
      priority: newTask.priority as any,
      dueDate: newTask.dueDate || new Date().toISOString().split('T')[0]
    };
    saveTasks([...tasks, task]);
    setNewTask({ title: '', priority: 'medium', dueDate: '' });
  };

  const deleteTask = (id: string) => {
    saveTasks(tasks.filter(t => t.id !== id));
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditValue({ title: task.title, priority: task.priority });
  };

  const saveEdit = () => {
    if (!editingTaskId) return;
    saveTasks(tasks.map(t => t.id === editingTaskId ? { ...t, title: editValue.title, priority: editValue.priority as any } : t));
    setEditingTaskId(null);
  };

  const toggleTaskStatus = (id: string) => {
    saveTasks(tasks.map(t => {
      if (t.id === id) {
        const statuses: Task['status'][] = ['pending', 'in-progress', 'completed'];
        const currentIndex = statuses.indexOf(t.status);
        const nextStatus = statuses[(currentIndex + 1) % statuses.length];
        return { ...t, status: nextStatus };
      }
      return t;
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-roboto">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-xl font-extrabold flex items-center gap-2 text-slate-900">
            <LayoutDashboard className="text-[var(--color-accent)]" />
            ADMIN_CORE
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
            { id: 'tasks', label: 'Task Manager', icon: CheckSquare },
            { id: 'messages', label: 'User Messages', icon: MessageSquare },
            { id: 'posts', label: 'Blog Posts', icon: FileText },
            { id: 'projects', label: 'Projects', icon: Plus },
            { id: 'settings', label: 'Settings', icon: Settings },
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
            <Badge variant="outline" className="font-mono text-[10px] border-green-200 text-green-600 bg-green-50">SYSTEM_ONLINE</Badge>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto">
          {activeTab === 'tasks' && (
            <div className="space-y-8">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-extrabold">Add New Task</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-4 items-end">
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
                        className="w-full h-9 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        value={newTask.priority}
                        onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                    <Button onClick={addTask} className="bg-[var(--color-accent)] font-bold">
                      <Plus size={18} className="mr-2" /> ADD_TASK
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid gap-4">
                <h3 className="text-lg font-extrabold uppercase tracking-widest text-slate-900">Active Tasks ({tasks.length})</h3>
                {tasks.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-slate-200">
                    <CheckSquare className="mx-auto text-slate-300 mb-4" size={48} />
                    <p className="text-slate-500 font-bold">No tasks found. Start by adding one above.</p>
                  </div>
                ) : (
                  tasks.map((task) => (
                    <Card key={task.id} className="border-none shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <button 
                            onClick={() => toggleTaskStatus(task.id)}
                            className={cn(
                              "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors shrink-0",
                              task.status === 'completed' ? "bg-green-500 border-green-500 text-white" : "border-slate-300 hover:border-[var(--color-accent)]"
                            )}
                          >
                            {task.status === 'completed' && <CheckCircle2 size={14} />}
                          </button>
                          
                          {editingTaskId === task.id ? (
                            <div className="flex-1 flex gap-2 items-center">
                              <Input 
                                value={editValue.title}
                                onChange={(e) => setEditValue({ ...editValue, title: e.target.value })}
                                className="h-8 text-sm"
                              />
                              <select 
                                className="h-8 rounded-md border border-slate-200 bg-white px-2 text-xs shadow-sm"
                                value={editValue.priority}
                                onChange={(e) => setEditValue({ ...editValue, priority: e.target.value as any })}
                              >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                              </select>
                              <Button size="sm" onClick={saveEdit} className="h-8 bg-green-500 hover:bg-green-600">
                                <Save size={14} />
                              </Button>
                              <Button size="sm" variant="ghost" onClick={() => setEditingTaskId(null)} className="h-8">
                                <AlertCircle size={14} />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex-1">
                              <h4 className={cn(
                                "font-bold text-slate-900",
                                task.status === 'completed' && "line-through text-slate-400"
                              )}>{task.title}</h4>
                              <div className="flex items-center gap-3 mt-1">
                                <Badge variant="outline" className={cn(
                                  "text-[9px] uppercase font-bold",
                                  task.priority === 'high' ? "text-red-600 bg-red-50 border-red-100" :
                                  task.priority === 'medium' ? "text-amber-600 bg-amber-50 border-amber-100" :
                                  "text-blue-600 bg-blue-50 border-blue-100"
                                )}>
                                  {task.priority}
                                </Badge>
                                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-bold">
                                  <Clock size={10} /> {task.dueDate}
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {editingTaskId !== task.id && (
                            <Button variant="ghost" size="icon" onClick={() => startEditing(task)} className="text-slate-400 hover:text-[var(--color-accent)]">
                              <FileText size={18} />
                            </Button>
                          )}
                          <Button variant="ghost" size="icon" onClick={() => deleteTask(task.id)} className="text-slate-400 hover:text-red-500">
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-extrabold uppercase tracking-widest text-slate-900">Inbox ({messages.length})</h3>
                <Button variant="outline" size="sm" onClick={() => {
                  localStorage.removeItem('contact_messages');
                  setMessages([]);
                }} className="text-red-500 border-red-100 hover:bg-red-50 font-bold">
                  CLEAR_ALL
                </Button>
              </div>

              {messages.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-slate-200">
                  <MessageSquare className="mx-auto text-slate-300 mb-4" size={48} />
                  <p className="text-slate-500 font-bold">No messages received yet.</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {messages.map((msg) => (
                    <Card key={msg.id} className="border-none shadow-sm overflow-hidden">
                      <div className="bg-slate-50 px-6 py-3 border-b border-slate-100 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-[var(--color-accent)] text-white flex items-center justify-center font-bold text-xs">
                            {msg.name[0].toUpperCase()}
                          </div>
                          <div>
                            <span className="font-bold text-slate-900">{msg.name}</span>
                            <span className="text-slate-400 text-xs ml-2">({msg.email})</span>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono text-slate-400">{msg.date}</span>
                      </div>
                      <CardContent className="p-6">
                        <h4 className="font-extrabold text-slate-900 mb-2 uppercase tracking-tight">{msg.subject}</h4>
                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="border-none shadow-sm bg-blue-500 text-white">
                <CardContent className="p-6">
                  <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-2">Total Tasks</p>
                  <h3 className="text-4xl font-extrabold">{tasks.length}</h3>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-purple-500 text-white">
                <CardContent className="p-6">
                  <p className="text-purple-100 text-xs font-bold uppercase tracking-widest mb-2">New Messages</p>
                  <h3 className="text-4xl font-extrabold">{messages.length}</h3>
                </CardContent>
              </Card>
              <Card className="border-none shadow-sm bg-emerald-500 text-white">
                <CardContent className="p-6">
                  <p className="text-emerald-100 text-xs font-bold uppercase tracking-widest mb-2">System Status</p>
                  <h3 className="text-4xl font-extrabold">100%</h3>
                </CardContent>
              </Card>
            </div>
          )}
          
          {activeTab === 'settings' && (
            <div className="max-w-2xl space-y-8">
              <Card className="border-none shadow-sm">
                <CardHeader>
                  <CardTitle className="text-xl font-extrabold">Security Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleChangePassword} className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Current Password</label>
                        <Input 
                          type="password" 
                          placeholder="••••••••"
                          value={changePasswordData.current}
                          onChange={(e) => setChangePasswordData({ ...changePasswordData, current: e.target.value })}
                          className="border-slate-200 focus:border-[var(--color-accent)]"
                        />
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">New Password</label>
                          <Input 
                            type="password" 
                            placeholder="••••••••"
                            value={changePasswordData.new}
                            onChange={(e) => setChangePasswordData({ ...changePasswordData, new: e.target.value })}
                            className="border-slate-200 focus:border-[var(--color-accent)]"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Confirm New Password</label>
                          <Input 
                            type="password" 
                            placeholder="••••••••"
                            value={changePasswordData.confirm}
                            onChange={(e) => setChangePasswordData({ ...changePasswordData, confirm: e.target.value })}
                            className="border-slate-200 focus:border-[var(--color-accent)]"
                          />
                        </div>
                      </div>
                    </div>

                    {changePasswordStatus.message && (
                      <p className={cn(
                        "text-xs font-bold",
                        changePasswordStatus.type === 'success' ? "text-green-500" : "text-red-500"
                      )}>
                        {changePasswordStatus.message}
                      </p>
                    )}

                    <Button type="submit" className="bg-[var(--color-accent)] font-bold">
                      <Save size={18} className="mr-2" /> UPDATE_PASSWORD
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm border-l-4 border-amber-500">
                <CardContent className="p-6">
                  <div className="flex gap-4">
                    <AlertCircle className="text-amber-500 shrink-0" size={24} />
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">Password Reset Protocol</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        If you lose your password, you can use the emergency reset key on the login screen. 
                        The current protocol key is: <code className="bg-slate-100 px-1 rounded text-slate-900 font-mono">password-reset-key-2026</code>
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {(activeTab === 'posts' || activeTab === 'projects') && (
            <div className="text-center py-20 bg-white rounded-xl border border-slate-200">
              <AlertCircle className="mx-auto text-slate-300 mb-4" size={48} />
              <p className="text-slate-500 font-bold capitalize">{activeTab} management interface is under construction.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
