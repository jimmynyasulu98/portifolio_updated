import { useState } from 'react';
import { motion } from 'motion/react';
import { LayoutDashboard, FileText, Plus, Save, Trash2, LogOut, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';

export function Admin() {
  const [activeTab, setActiveTab] = useState('posts');

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <LayoutDashboard className="text-[var(--color-accent)]" />
            Admin Panel
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Button 
            variant={activeTab === 'posts' ? 'default' : 'ghost'} 
            className="w-full justify-start gap-3"
            onClick={() => setActiveTab('posts')}
          >
            <FileText size={18} />
            Blog Posts
          </Button>
          <Button 
            variant={activeTab === 'projects' ? 'default' : 'ghost'} 
            className="w-full justify-start gap-3"
            onClick={() => setActiveTab('projects')}
          >
            <Plus size={18} />
            Projects
          </Button>
          <Button 
            variant={activeTab === 'settings' ? 'default' : 'ghost'} 
            className="w-full justify-start gap-3"
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} />
            Settings
          </Button>
        </nav>
        
        <div className="p-4 border-t border-slate-200">
          <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50">
            <LogOut size={18} />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-10">
          <h2 className="text-lg font-semibold capitalize">{activeTab}</h2>
          <Button className="gap-2">
            <Plus size={18} />
            New {activeTab === 'posts' ? 'Post' : 'Project'}
          </Button>
        </header>

        <div className="p-8 max-w-5xl mx-auto">
          {activeTab === 'posts' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Post</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Title</label>
                    <Input placeholder="Enter post title..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Category</label>
                      <Input placeholder="e.g. Networking" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Schedule Date</label>
                      <Input type="date" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Content (Markdown)</label>
                    <Textarea placeholder="Write your post content here..." className="min-h-[300px] font-mono" />
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button variant="outline">Save Draft</Button>
                    <Button className="gap-2">
                      <Save size={18} />
                      Publish Post
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-4">
                <h3 className="text-lg font-bold">Existing Posts</h3>
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center">
                        <FileText className="text-slate-400" />
                      </div>
                      <div>
                        <h4 className="font-bold">Sample Blog Post {i}</h4>
                        <p className="text-sm text-slate-500">Published on Oct {10 + i}, 2024</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon"><Plus size={18} /></Button>
                      <Button variant="ghost" size="icon" className="text-red-500"><Trash2 size={18} /></Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
          
          {activeTab === 'projects' && (
            <div className="text-center py-20">
              <p className="text-slate-500">Project management coming soon...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
