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
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            {/* Hero empty state */}
            <div className="text-center pt-8 pb-4">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <FileText className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-xl font-bold mb-1">Start building your resume</h2>
              <p className="text-sm text-muted-foreground mb-5">Pick a template below or import an existing one</p>
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
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
            </div>

            {/* Template showcase */}
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-4">Choose a template to get started</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {[
                  { id: 'classic',   name: 'Classic',   svg: <svg viewBox="0 0 120 160" className="w-full h-full"><rect width="120" height="160" fill="#fff"/><rect x="0" y="0" width="120" height="36" fill="#0f172a"/><rect x="8" y="8" width="50" height="5" rx="1" fill="#fff" opacity="0.9"/><rect x="8" y="17" width="38" height="2.5" rx="1" fill="#fff" opacity="0.5"/><rect x="8" y="26" width="30" height="2" rx="1" fill="#fff" opacity="0.35"/><rect x="8" y="42" width="100" height="2" rx="1" fill="#e2e8f0"/><rect x="8" y="47" width="80" height="2" rx="1" fill="#e2e8f0"/><rect x="8" y="56" width="30" height="2.5" rx="1" fill="#0f172a" opacity="0.7"/><rect x="8" y="60" width="65" height="1" fill="#e2e8f0"/><rect x="8" y="63" width="55" height="2" rx="1" fill="#cbd5e1"/><rect x="8" y="67" width="65" height="2" rx="1" fill="#cbd5e1"/><rect x="8" y="73" width="52" height="2" rx="1" fill="#94a3b8"/><rect x="8" y="77" width="65" height="2" rx="1" fill="#cbd5e1"/><rect x="80" y="56" width="25" height="2.5" rx="1" fill="#0f172a" opacity="0.7"/><rect x="80" y="60" width="35" height="1" fill="#e2e8f0"/><rect x="80" y="64" width="16" height="5" rx="2" fill="#f1f5f9"/><rect x="99" y="64" width="14" height="5" rx="2" fill="#f1f5f9"/><rect x="80" y="72" width="20" height="5" rx="2" fill="#f1f5f9"/><rect x="103" y="72" width="14" height="5" rx="2" fill="#f1f5f9"/></svg> },
                  { id: 'modern',    name: 'Modern',    svg: <svg viewBox="0 0 120 160" className="w-full h-full"><rect width="120" height="160" fill="#fff"/><rect x="8" y="8" width="60" height="7" rx="2" fill="#111"/><rect x="8" y="19" width="80" height="2" rx="1" fill="#d1d5db"/><rect x="8" y="25" width="100" height="1" fill="#e5e7eb"/><rect x="8" y="30" width="20" height="2" rx="1" fill="#2ba89e"/><rect x="8" y="35" width="17" height="5" rx="3" fill="none" stroke="#2ba89e" strokeWidth="1"/><rect x="28" y="35" width="17" height="5" rx="3" fill="none" stroke="#2ba89e" strokeWidth="1"/><rect x="48" y="35" width="17" height="5" rx="3" fill="none" stroke="#2ba89e" strokeWidth="1"/><rect x="8" y="46" width="28" height="2" rx="1" fill="#2ba89e"/><rect x="8" y="52" width="3" height="22" rx="1" fill="#2ba89e"/><rect x="14" y="52" width="40" height="2.5" rx="1" fill="#374151"/><rect x="14" y="57" width="70" height="2" rx="1" fill="#d1d5db"/><rect x="14" y="61" width="60" height="2" rx="1" fill="#d1d5db"/><rect x="14" y="65" width="68" height="2" rx="1" fill="#d1d5db"/><rect x="8" y="80" width="3" height="18" rx="1" fill="#2ba89e"/><rect x="14" y="80" width="36" height="2.5" rx="1" fill="#374151"/><rect x="14" y="85" width="60" height="2" rx="1" fill="#d1d5db"/><rect x="14" y="89" width="54" height="2" rx="1" fill="#d1d5db"/><rect x="8" y="102" width="24" height="2" rx="1" fill="#2ba89e"/><rect x="8" y="107" width="60" height="2.5" rx="1" fill="#374151"/><rect x="8" y="112" width="42" height="2" rx="1" fill="#9ca3af"/></svg> },
                  { id: 'minimal',   name: 'Minimal',   svg: <svg viewBox="0 0 120 160" className="w-full h-full"><rect width="120" height="160" fill="#fff"/><rect x="8" y="10" width="58" height="5" rx="1" fill="#111"/><rect x="8" y="19" width="90" height="1" rx="1" fill="#ddd"/><rect x="8" y="24" width="100" height="0.5" fill="#eee"/><rect x="8" y="29" width="100" height="1.8" rx="1" fill="#e5e7eb"/><rect x="8" y="33" width="75" height="1.8" rx="1" fill="#e5e7eb"/><rect x="8" y="41" width="25" height="2" rx="1" fill="#aaa"/><rect x="8" y="47" width="55" height="2.5" rx="1" fill="#333"/><rect x="80" y="47" width="30" height="2" rx="1" fill="#ccc"/><rect x="8" y="52" width="35" height="1.5" rx="1" fill="#bbb"/><rect x="8" y="56" width="95" height="1.5" rx="1" fill="#e5e7eb"/><rect x="8" y="60" width="80" height="1.5" rx="1" fill="#e5e7eb"/><rect x="8" y="68" width="50" height="2.5" rx="1" fill="#333"/><rect x="8" y="73" width="95" height="1.5" rx="1" fill="#e5e7eb"/><rect x="8" y="77" width="75" height="1.5" rx="1" fill="#e5e7eb"/><rect x="8" y="89" width="25" height="2" rx="1" fill="#aaa"/><rect x="8" y="95" width="60" height="2.5" rx="1" fill="#333"/><rect x="8" y="100" width="42" height="1.5" rx="1" fill="#bbb"/><rect x="8" y="112" width="20" height="2" rx="1" fill="#aaa"/><rect x="8" y="117" width="95" height="1.5" rx="1" fill="#e5e7eb"/></svg> },
                  { id: 'creative',  name: 'Creative',  svg: <svg viewBox="0 0 120 160" className="w-full h-full"><rect width="120" height="160" fill="#fff"/><rect x="0" y="0" width="40" height="160" fill="#f5f0eb"/><circle cx="20" cy="22" r="11" fill="#e08a3a" opacity="0.85"/><text x="20" y="26" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">D</text><rect x="4" y="40" width="20" height="2" rx="1" fill="#e08a3a"/><rect x="4" y="45" width="30" height="1.5" rx="1" fill="#bbb"/><rect x="4" y="49" width="28" height="1.5" rx="1" fill="#bbb"/><rect x="4" y="54" width="25" height="1.5" rx="1" fill="#bbb"/><rect x="4" y="64" width="20" height="2" rx="1" fill="#e08a3a"/><rect x="4" y="69" width="13" height="5" rx="2" fill="#e08a3a25"/><rect x="19" y="69" width="13" height="5" rx="2" fill="#e08a3a25"/><rect x="4" y="77" width="13" height="5" rx="2" fill="#e08a3a25"/><rect x="48" y="8" width="62" height="7" rx="2" fill="#111"/><rect x="45" y="20" width="3" height="18" rx="1" fill="#e08a3a"/><rect x="52" y="21" width="58" height="2" rx="1" fill="#ccc"/><rect x="52" y="25" width="52" height="2" rx="1" fill="#ccc"/><rect x="52" y="29" width="56" height="2" rx="1" fill="#ccc"/><rect x="48" y="46" width="28" height="2" rx="1" fill="#e08a3a"/><rect x="48" y="52" width="50" height="2.5" rx="1" fill="#333"/><rect x="48" y="57" width="35" height="1.5" rx="1" fill="#e08a3a"/><rect x="48" y="61" width="62" height="1.5" rx="1" fill="#ddd"/><rect x="48" y="65" width="55" height="1.5" rx="1" fill="#ddd"/></svg> },
                  { id: 'tech',      name: 'Tech',      svg: <svg viewBox="0 0 120 160" className="w-full h-full"><rect width="120" height="160" fill="#fff"/><rect x="0" y="0" width="120" height="40" fill="#0d1117"/><rect x="8" y="10" width="52" height="6" rx="1" fill="#e6edf3"/><rect x="8" y="20" width="78" height="2" rx="1" fill="#8b949e"/><rect x="8" y="26" width="44" height="2" rx="1" fill="#2ba89e"/><rect x="8" y="46" width="3" height="20" rx="1" fill="#2ba89e"/><rect x="15" y="46" width="90" height="2" rx="1" fill="#e5e7eb"/><rect x="15" y="50" width="75" height="2" rx="1" fill="#e5e7eb"/><rect x="15" y="54" width="82" height="2" rx="1" fill="#e5e7eb"/><rect x="8" y="72" width="36" height="2" rx="1" fill="#2ba89e"/><rect x="8" y="78" width="20" height="5" rx="1" fill="#f6f8fa" stroke="#d0d7de" strokeWidth="0.5"/><rect x="31" y="78" width="17" height="5" rx="1" fill="#f6f8fa" stroke="#d0d7de" strokeWidth="0.5"/><rect x="51" y="78" width="22" height="5" rx="1" fill="#f6f8fa" stroke="#d0d7de" strokeWidth="0.5"/><rect x="8" y="90" width="40" height="2" rx="1" fill="#2ba89e"/><rect x="8" y="96" width="2" height="22" rx="1" fill="#d0d7de"/><rect x="13" y="96" width="42" height="2.5" rx="1" fill="#374151"/><rect x="13" y="101" width="28" height="1.5" rx="1" fill="#2ba89e"/><rect x="13" y="105" width="75" height="1.5" rx="1" fill="#d1d5db"/><rect x="13" y="109" width="65" height="1.5" rx="1" fill="#d1d5db"/><rect x="8" y="124" width="36" height="2" rx="1" fill="#2ba89e"/><rect x="8" y="130" width="55" height="2.5" rx="1" fill="#374151"/><rect x="8" y="135" width="40" height="1.5" rx="1" fill="#9ca3af"/></svg> },
                  { id: 'executive', name: 'Executive', svg: <svg viewBox="0 0 120 160" className="w-full h-full"><rect width="120" height="160" fill="#fff"/><rect x="0" y="0" width="120" height="38" fill="#1a1a2e"/><rect x="8" y="8" width="55" height="6" rx="2" fill="#e8e3db"/><rect x="8" y="18" width="72" height="2" rx="1" fill="#a0a0b0"/><rect x="8" y="24" width="45" height="2" rx="1" fill="#e08a3a"/><rect x="8" y="44" width="3" height="16" rx="1" fill="#e08a3a"/><rect x="15" y="44" width="93" height="2" rx="1" fill="#d1d5db"/><rect x="15" y="49" width="80" height="2" rx="1" fill="#d1d5db"/><rect x="15" y="54" width="88" height="2" rx="1" fill="#d1d5db"/><rect x="8" y="66" width="26" height="2" rx="1" fill="#999"/><rect x="8" y="72" width="48" height="3" rx="1" fill="#111"/><rect x="61" y="72.5" width="20" height="2" rx="1" fill="#aaa"/><rect x="8" y="77" width="34" height="2" rx="1" fill="#e08a3a"/><rect x="8" y="81" width="64" height="1.5" rx="1" fill="#e5e7eb"/><rect x="8" y="85" width="58" height="1.5" rx="1" fill="#e5e7eb"/><rect x="8" y="93" width="44" height="3" rx="1" fill="#111"/><rect x="8" y="98" width="32" height="2" rx="1" fill="#e08a3a"/><rect x="8" y="102" width="64" height="1.5" rx="1" fill="#e5e7eb"/><rect x="82" y="64" width="0.5" height="88" fill="#e5e7eb"/><rect x="87" y="66" width="24" height="2" rx="1" fill="#999"/><rect x="87" y="72" width="28" height="2.5" rx="1" fill="#111"/><rect x="87" y="77" width="24" height="1.5" rx="1" fill="#aaa"/><rect x="87" y="82" width="20" height="1.5" rx="1" fill="#bbb"/><rect x="87" y="92" width="20" height="2" rx="1" fill="#999"/><rect x="87" y="98" width="27" height="1.5" rx="1" fill="#e5e7eb"/><rect x="87" y="102" width="22" height="1.5" rx="1" fill="#e5e7eb"/><rect x="87" y="106" width="25" height="1.5" rx="1" fill="#e5e7eb"/><rect x="87" y="110" width="20" height="1.5" rx="1" fill="#e5e7eb"/></svg> },
                ].map((t) => (
                  <motion.button
                    key={t.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => {
                      if (!user) return;
                      api.resumes.create({ title: 'Untitled Resume', template: t.id, data: emptyResumeData }, user.id)
                        .then(d => navigate(`/editor/${d.id}`))
                        .catch(() => toast.error('Failed to create resume'));
                    }}
                    className="group rounded-xl overflow-hidden border-2 border-border hover:border-primary/50 transition-all bg-card hover:shadow-lg hover:shadow-primary/10 text-left"
                  >
                    {/* SVG thumbnail */}
                    <div className="bg-gray-50 dark:bg-zinc-900 relative overflow-hidden aspect-[3/4] w-full">
                      {t.svg}
                      <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-colors flex items-end justify-center opacity-0 group-hover:opacity-100 pb-3">
                        <span className="text-[10px] font-semibold bg-primary text-primary-foreground px-2 py-1 rounded-full shadow">
                          Use template
                        </span>
                      </div>
                    </div>
                    {/* Label */}
                    <div className="px-3 py-2">
                      <span className="text-xs font-semibold text-foreground">{t.name}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
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
                {/* Mini resume preview matching the template style */}
                <div className="h-28 bg-gray-100 dark:bg-zinc-800 flex items-center justify-center overflow-hidden relative group-hover:bg-gray-50 transition-colors">
                  <div className="w-16 h-[88px] bg-white rounded shadow-md overflow-hidden transform group-hover:scale-105 transition-transform duration-300">
                    {r.template === 'classic' && (
                      <svg viewBox="0 0 120 160" className="w-full h-full">
                        <rect x="0" y="0" width="120" height="36" fill="#0f172a"/>
                        <rect x="8" y="8" width="50" height="5" rx="1" fill="#fff" opacity="0.9"/>
                        <rect x="8" y="17" width="38" height="2.5" rx="1" fill="#fff" opacity="0.5"/>
                        <rect x="8" y="42" width="100" height="2" rx="1" fill="#e2e8f0"/>
                        <rect x="8" y="47" width="80" height="2" rx="1" fill="#e2e8f0"/>
                        <rect x="8" y="56" width="30" height="2.5" rx="1" fill="#0f172a" opacity="0.7"/>
                        <rect x="8" y="60" width="65" height="1" fill="#e2e8f0"/>
                        <rect x="8" y="64" width="55" height="2" rx="1" fill="#cbd5e1"/>
                        <rect x="8" y="68" width="60" height="2" rx="1" fill="#cbd5e1"/>
                        <rect x="80" y="56" width="25" height="2.5" rx="1" fill="#0f172a" opacity="0.7"/>
                        <rect x="80" y="60" width="35" height="1" fill="#e2e8f0"/>
                        <rect x="80" y="64" width="16" height="4" rx="2" fill="#f1f5f9"/>
                        <rect x="99" y="64" width="14" height="4" rx="2" fill="#f1f5f9"/>
                      </svg>
                    )}
                    {r.template === 'modern' && (
                      <svg viewBox="0 0 120 160" className="w-full h-full">
                        <rect width="120" height="160" fill="#fff"/>
                        <rect x="8" y="8" width="60" height="7" rx="2" fill="#111"/>
                        <rect x="8" y="19" width="80" height="2" rx="1" fill="#d1d5db"/>
                        <rect x="8" y="25" width="100" height="1" fill="#e5e7eb"/>
                        <rect x="8" y="30" width="20" height="2" rx="1" fill="#2ba89e"/>
                        <rect x="8" y="35" width="17" height="5" rx="3" fill="none" stroke="#2ba89e" strokeWidth="1"/>
                        <rect x="28" y="35" width="17" height="5" rx="3" fill="none" stroke="#2ba89e" strokeWidth="1"/>
                        <rect x="8" y="46" width="28" height="2" rx="1" fill="#2ba89e"/>
                        <rect x="8" y="52" width="3" height="22" rx="1" fill="#2ba89e"/>
                        <rect x="14" y="52" width="40" height="2.5" rx="1" fill="#374151"/>
                        <rect x="14" y="57" width="70" height="2" rx="1" fill="#d1d5db"/>
                        <rect x="14" y="61" width="60" height="2" rx="1" fill="#d1d5db"/>
                      </svg>
                    )}
                    {r.template === 'minimal' && (
                      <svg viewBox="0 0 120 160" className="w-full h-full">
                        <rect width="120" height="160" fill="#fff"/>
                        <rect x="8" y="10" width="58" height="5" rx="1" fill="#111"/>
                        <rect x="8" y="19" width="90" height="1" rx="1" fill="#ddd"/>
                        <rect x="8" y="24" width="100" height="0.5" fill="#eee"/>
                        <rect x="8" y="29" width="100" height="1.8" rx="1" fill="#e5e7eb"/>
                        <rect x="8" y="33" width="75" height="1.8" rx="1" fill="#e5e7eb"/>
                        <rect x="8" y="41" width="25" height="2" rx="1" fill="#aaa"/>
                        <rect x="8" y="47" width="55" height="2.5" rx="1" fill="#333"/>
                        <rect x="8" y="53" width="95" height="1.5" rx="1" fill="#e5e7eb"/>
                        <rect x="8" y="57" width="80" height="1.5" rx="1" fill="#e5e7eb"/>
                        <rect x="8" y="65" width="50" height="2.5" rx="1" fill="#333"/>
                        <rect x="8" y="71" width="95" height="1.5" rx="1" fill="#e5e7eb"/>
                      </svg>
                    )}
                    {r.template === 'creative' && (
                      <svg viewBox="0 0 120 160" className="w-full h-full">
                        <rect width="120" height="160" fill="#fff"/>
                        <rect x="0" y="0" width="38" height="160" fill="#f5f0eb"/>
                        <circle cx="19" cy="20" r="10" fill="#e08a3a" opacity="0.85"/>
                        <rect x="4" y="36" width="16" height="2" rx="1" fill="#e08a3a"/>
                        <rect x="4" y="41" width="28" height="1.5" rx="1" fill="#bbb"/>
                        <rect x="4" y="45" width="25" height="1.5" rx="1" fill="#bbb"/>
                        <rect x="4" y="55" width="16" height="2" rx="1" fill="#e08a3a"/>
                        <rect x="4" y="60" width="12" height="4" rx="2" fill="#e08a3a30"/>
                        <rect x="18" y="60" width="12" height="4" rx="2" fill="#e08a3a30"/>
                        <rect x="46" y="8" width="62" height="7" rx="2" fill="#111"/>
                        <rect x="43" y="20" width="3" height="16" rx="1" fill="#e08a3a"/>
                        <rect x="50" y="20" width="58" height="2" rx="1" fill="#ccc"/>
                        <rect x="50" y="24" width="50" height="2" rx="1" fill="#ccc"/>
                        <rect x="46" y="43" width="26" height="2" rx="1" fill="#e08a3a"/>
                        <rect x="46" y="49" width="48" height="2.5" rx="1" fill="#333"/>
                        <rect x="46" y="55" width="62" height="1.5" rx="1" fill="#ddd"/>
                        <rect x="46" y="59" width="55" height="1.5" rx="1" fill="#ddd"/>
                      </svg>
                    )}
                    {r.template === 'tech' && (
                      <svg viewBox="0 0 120 160" className="w-full h-full">
                        <rect width="120" height="160" fill="#fff"/>
                        <rect x="0" y="0" width="120" height="38" fill="#0d1117"/>
                        <rect x="8" y="9" width="50" height="6" rx="1" fill="#e6edf3"/>
                        <rect x="8" y="19" width="75" height="2" rx="1" fill="#8b949e"/>
                        <rect x="8" y="25" width="42" height="2" rx="1" fill="#2ba89e"/>
                        <rect x="8" y="43" width="3" height="18" rx="1" fill="#2ba89e"/>
                        <rect x="14" y="43" width="90" height="2" rx="1" fill="#e5e7eb"/>
                        <rect x="14" y="47" width="75" height="2" rx="1" fill="#e5e7eb"/>
                        <rect x="8" y="68" width="34" height="2" rx="1" fill="#2ba89e"/>
                        <rect x="8" y="74" width="19" height="5" rx="1" fill="#f6f8fa" stroke="#d0d7de" strokeWidth="0.5"/>
                        <rect x="30" y="74" width="15" height="5" rx="1" fill="#f6f8fa" stroke="#d0d7de" strokeWidth="0.5"/>
                        <rect x="8" y="86" width="36" height="2" rx="1" fill="#2ba89e"/>
                        <rect x="8" y="92" width="2" height="18" rx="1" fill="#d0d7de"/>
                        <rect x="13" y="92" width="38" height="2.5" rx="1" fill="#374151"/>
                        <rect x="13" y="97" width="70" height="1.5" rx="1" fill="#d1d5db"/>
                        <rect x="13" y="101" width="60" height="1.5" rx="1" fill="#d1d5db"/>
                      </svg>
                    )}
                    {r.template === 'executive' && (
                      <svg viewBox="0 0 120 160" className="w-full h-full">
                        <rect width="120" height="160" fill="#fff"/>
                        <rect x="0" y="0" width="120" height="36" fill="#1a1a2e"/>
                        <rect x="8" y="8" width="50" height="6" rx="2" fill="#e8e3db"/>
                        <rect x="8" y="18" width="70" height="2" rx="1" fill="#a0a0b0"/>
                        <rect x="8" y="24" width="40" height="2" rx="1" fill="#e08a3a"/>
                        <rect x="8" y="42" width="3" height="14" rx="1" fill="#e08a3a"/>
                        <rect x="15" y="42" width="90" height="2" rx="1" fill="#d1d5db"/>
                        <rect x="15" y="47" width="78" height="2" rx="1" fill="#d1d5db"/>
                        <rect x="8" y="62" width="24" height="2" rx="1" fill="#999"/>
                        <rect x="8" y="67" width="45" height="3" rx="1" fill="#111"/>
                        <rect x="8" y="72" width="30" height="2" rx="1" fill="#e08a3a"/>
                        <rect x="8" y="76" width="62" height="1.5" rx="1" fill="#e5e7eb"/>
                        <rect x="8" y="80" width="55" height="1.5" rx="1" fill="#e5e7eb"/>
                        <rect x="80" y="62" width="0.5" height="80" fill="#e5e7eb"/>
                        <rect x="85" y="62" width="20" height="2" rx="1" fill="#999"/>
                        <rect x="85" y="67" width="27" height="2.5" rx="1" fill="#111"/>
                        <rect x="85" y="76" width="18" height="2" rx="1" fill="#aaa"/>
                        <rect x="85" y="88" width="18" height="2" rx="1" fill="#999"/>
                        <rect x="85" y="93" width="27" height="1.5" rx="1" fill="#e5e7eb"/>
                        <rect x="85" y="97" width="22" height="1.5" rx="1" fill="#e5e7eb"/>
                      </svg>
                    )}
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-foreground text-sm truncate">{r.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider px-2 py-0.5 rounded bg-secondary/50 shrink-0">{r.template}</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => deleteResume(r.id, e)}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1.5 glass-border rounded-md hover:bg-destructive/10 shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1.5 mt-3 text-[10px] uppercase font-bold tracking-widest text-muted-foreground">
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
