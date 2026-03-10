import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import type { ResumeData, ResumeRecord, TemplateId } from '@/lib/resume-types';
import { emptyResumeData } from '@/lib/resume-types';
import { ResumeForm } from '@/components/resume/ResumeForm';
import { ResumePreview } from '@/components/resume/ResumePreview';
import { ResumeVersionHistoryModal } from '@/components/resume/ResumeVersionHistoryModal';
import { ResumeTemplateSelector } from '@/components/templates/ResumeTemplateSelector';
import { ResumeAIHelper } from '@/components/resume/ResumeAIHelper';
import { downloadResumePdf } from '@/lib/pdf';
import { api } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Download, Save, History, Layout, Sparkles, Eye, PenLine, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function EditorPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resume, setResume] = useState<ResumeRecord | null>(null);
  const [data, setData] = useState<ResumeData>(emptyResumeData);
  const [title, setTitle] = useState('');
  const [template, setTemplate] = useState<TemplateId>('classic');
  const [isPaidUnlocked, setIsPaidUnlocked] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedTimestamp, setSavedTimestamp] = useState<string | null>(null);
  const [showVersions, setShowVersions] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAI, setShowAI] = useState(false);
  const [mobileView, setMobileView] = useState<'editor' | 'preview'>('editor');
  const [editorDimmed, setEditorDimmed] = useState(false);

  useEffect(() => {
    if (!id || !user) return;
    supabase
      .from('resumes')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()
      .then(({ data: r }) => {
        if (r) {
          const rec = r as unknown as ResumeRecord;
          setResume(rec);
          setData(rec.data || emptyResumeData);
          setTitle(rec.title);
          setTemplate(rec.template);
          setIsPaidUnlocked(rec.is_paid_template_unlocked);
        }
      });
  }, [id, user]);

  const handleSave = useCallback(async () => {
    if (!id || !user) return;
    setSaving(true);
    setEditorDimmed(true);

    try {
      await api.resumes.update(id, { data, title, template }, user.id);
      await api.versions.create(id, data, user.id);
      
      const now = new Date();
      setSavedTimestamp(`Saved ${now.toLocaleTimeString('en-US', { hour12: false })}`);
      toast.success('Resume saved');
      setTimeout(() => setSavedTimestamp(null), 2500);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save');
    }

    setSaving(false);
    setTimeout(() => setEditorDimmed(false), 800);
  }, [id, user, data, title, template]);

  const handleTemplateChange = async (t: TemplateId) => {
    if (t === 'executive' && !isPaidUnlocked) return;
    setTemplate(t);
    if (id) await supabase.from('resumes').update({ template: t }).eq('id', id);
  };

  const handleUnlockPaid = async () => {
    setIsPaidUnlocked(true);
    if (id) await supabase.from('resumes').update({ is_paid_template_unlocked: true }).eq('id', id);
    toast.success('Executive template unlocked!');
  };

  const handleRestoreVersion = (versionData: ResumeData) => {
    setData(versionData);
    setShowVersions(false);
    toast.info('Version restored. Save to keep changes.');
  };

  if (!resume) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground text-sm">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Toolbar */}
      <header className="border-b border-border px-4 py-2 flex items-center gap-2 shrink-0 glass">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
          <FileText className="h-3.5 w-3.5 text-primary" />
        </div>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="max-w-[200px] h-8 text-sm font-medium border-none bg-transparent focus-visible:ring-1"
        />
        <div className="flex-1" />
        {savedTimestamp && (
          <span className="text-xs text-muted-foreground animate-save-fade mr-2">{savedTimestamp}</span>
        )}
        <Button variant="ghost" size="sm" onClick={() => setShowAI(true)} className="text-accent hover:text-accent">
          <Sparkles className="mr-1.5 h-4 w-4" />
          <span className="hidden sm:inline">AI Assist</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setShowTemplates(true)}>
          <Layout className="mr-1.5 h-4 w-4" />
          <span className="hidden sm:inline">Templates</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setShowVersions(true)}>
          <History className="mr-1.5 h-4 w-4" />
          <span className="hidden sm:inline">History</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => downloadResumePdf('resume-preview', title || 'resume')}>
          <Download className="mr-1.5 h-4 w-4" />
          <span className="hidden sm:inline">PDF</span>
        </Button>
        <Button size="sm" onClick={handleSave} disabled={saving} className="glow-primary">
          <Save className="mr-1.5 h-4 w-4" />
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </header>

      {/* Mobile toggle */}
      <div className="md:hidden flex border-b border-border">
        <button
          onClick={() => setMobileView('editor')}
          className={`flex-1 py-2.5 text-sm font-medium text-center transition-colors ${mobileView === 'editor' ? 'text-primary bg-primary/5' : 'text-muted-foreground'}`}
        >
          <PenLine className="inline h-4 w-4 mr-1" />
          Editor
        </button>
        <button
          onClick={() => setMobileView('preview')}
          className={`flex-1 py-2.5 text-sm font-medium text-center transition-colors ${mobileView === 'preview' ? 'text-primary bg-primary/5' : 'text-muted-foreground'}`}
        >
          <Eye className="inline h-4 w-4 mr-1" />
          Preview
        </button>
      </div>

      {/* Split view */}
      <div className="flex-1 flex overflow-hidden">
        <div
          className={`w-full md:w-1/2 overflow-y-auto bg-card border-r border-border transition-opacity duration-700 ${editorDimmed ? 'opacity-50' : 'opacity-100'} ${mobileView === 'preview' ? 'hidden md:block' : ''}`}
        >
          <ResumeForm data={data} onChange={setData} />
        </div>
        <div className={`w-full md:w-1/2 overflow-y-auto bg-secondary/30 relative ${mobileView === 'editor' ? 'hidden md:block' : ''}`}>
          <ResumePreview data={data} template={template} />
        </div>
      </div>

      {showVersions && id && (
        <ResumeVersionHistoryModal resumeId={id} onRestore={handleRestoreVersion} onClose={() => setShowVersions(false)} />
      )}
      {showTemplates && (
        <ResumeTemplateSelector current={template} isPaidUnlocked={isPaidUnlocked} onSelect={handleTemplateChange} onUnlock={handleUnlockPaid} onClose={() => setShowTemplates(false)} />
      )}
      {showAI && (
        <ResumeAIHelper data={data} onChange={setData} onClose={() => setShowAI(false)} />
      )}
    </div>
  );
}
