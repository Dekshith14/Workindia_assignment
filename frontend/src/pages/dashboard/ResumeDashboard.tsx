import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { api } from '@/lib/api-client';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import type { ResumeRecord, ResumeData } from '@/lib/resume-types';
import { emptyResumeData } from '@/lib/resume-types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, FileText, LogOut, Upload, ChevronDown, Trash2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function ResumeDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!user) return;
    api.resumes.list(user.id)
      .then((data) => {
        setResumes(data || []);
        setLoading(false);
      })
      .catch((error) => {
        toast.error('Failed to load resumes');
        setLoading(false);
      });
  }, [user]);

  const createResume = async () => {
    if (!user) return;
    try {
      const data = await api.resumes.create({ title: 'Untitled Resume', template: 'classic', data: emptyResumeData }, user.id);
      navigate(`/editor/${data.id}`);
    } catch (error) {
      toast.error('Failed to create resume');
    }
  };

  const deleteResume = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.resumes.delete(id, user.id);
      setResumes(r => r.filter(x => x.id !== id));
      toast.success('Resume deleted');
    } catch (error) {
      toast.error('Failed to delete resume');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    
    setLoading(true);
    try {
      const result = await api.resumes.import(file, user.id);
      if (result && result.data) {
        const created = await api.resumes.create({ 
          title: result.data.personal?.name || result.title || 'Imported Resume', 
          template: 'classic', 
          data: result.data 
        }, user.id);
        
        if (created) {
          toast.success('Resume imported successfully!');
          navigate(`/editor/${created.id}`);
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to import resume');
      setLoading(false);
    }
    
    if (fileRef.current) fileRef.current.value = '';
  };

  const templateColors: Record<string, string> = {
    classic: 'from-primary/20 to-primary/5',
    modern: 'from-accent/20 to-accent/5',
    minimal: 'from-muted-foreground/20 to-muted-foreground/5',
    creative: 'from-primary/30 to-accent/10',
    tech: 'from-accent/25 to-primary/5',
    executive: 'from-primary/15 to-muted/20',
  };

  return (
    <div className="min-h-screen bg-background bg-grid relative">
      <div className="absolute inset-0 bg-radial-glow pointer-events-none" />

      <header className="relative z-10 border-b border-border px-6 md:px-10 py-4 flex items-center justify-between glass">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <FileText className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold text-foreground tracking-tight">ResumeForge</span>
        </div>
        <div className="flex items-center gap-2">
          <input ref={fileRef} type="file" accept=".pdf,.docx" className="hidden" onChange={handleImport} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Upload className="mr-1.5 h-4 w-4" />
                Import Resume
                <ChevronDown className="ml-1.5 h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => { if (fileRef.current) { fileRef.current.accept = '.pdf'; fileRef.current.click(); } }}>
                Upload PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { if (fileRef.current) { fileRef.current.accept = '.docx'; fileRef.current.click(); } }}>
                Upload Word (.docx)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={createResume} size="sm" className="glow-primary">
            <Plus className="mr-1.5 h-4 w-4" />
            New Resume
          </Button>
          <ThemeToggle />
          <Button variant="ghost" size="icon" onClick={() => signOut()} className="text-muted-foreground hover:text-foreground">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 md:px-10 py-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-2xl font-bold tracking-tight mb-1">My Resumes</h1>
          <p className="text-sm text-muted-foreground mb-8">Create, edit, and manage your resumes</p>
        </motion.div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass glass-border rounded-xl h-48 animate-pulse" />
            ))}
          </div>
        ) : resumes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24"
          >
            <div className="h-16 w-16 rounded-2xl bg-secondary flex items-center justify-center mx-auto mb-6">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground mb-6 text-lg">No resumes yet</p>
            <div className="flex items-center justify-center gap-3">
              <Button onClick={createResume} className="glow-primary">
                <Plus className="mr-1.5 h-4 w-4" />
                Create your first resume
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Upload className="mr-1.5 h-4 w-4" />
                    Import Resume
                    <ChevronDown className="ml-1.5 h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="center" className="w-48">
                  <DropdownMenuItem onClick={() => { if (fileRef.current) { fileRef.current.accept = '.pdf'; fileRef.current.click(); } }}>
                    Upload PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { if (fileRef.current) { fileRef.current.accept = '.docx'; fileRef.current.click(); } }}>
                    Upload Word (.docx)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* New resume card */}
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={createResume}
              className="glass glass-border rounded-xl h-48 flex flex-col items-center justify-center gap-3 hover:border-primary/30 transition-all group"
            >
              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">New Resume</span>
            </motion.button>

            {resumes.map((r, i) => (
              <motion.div
                key={r.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (i + 1) * 0.05 }}
                onClick={() => navigate(`/editor/${r.id}`)}
                className="glass glass-border rounded-xl overflow-hidden cursor-pointer hover:border-primary/30 transition-all group"
              >
                {/* Template color header */}
                <div className={`h-24 bg-gradient-to-b ${templateColors[r.template] || templateColors.classic} flex items-center justify-center`}>
                  <div className="w-14 h-20 bg-card/80 rounded-sm shadow-lg transform group-hover:scale-105 transition-transform" />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-foreground text-sm truncate max-w-[180px]">{r.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground capitalize px-2 py-0.5 rounded bg-secondary">{r.template}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => deleteResume(r.id, e)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(r.updated_at).toLocaleDateString()}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
