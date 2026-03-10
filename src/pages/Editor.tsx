import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import type { ResumeData, ResumeRecord, TemplateId } from '@/lib/resume-types';
import { emptyResumeData } from '@/lib/resume-types';
import { ResumeForm } from '@/components/ResumeForm';
import { ResumePreview } from '@/components/ResumePreview';
import { VersionHistoryModal } from '@/components/VersionHistoryModal';
import { TemplateSelector } from '@/components/TemplateSelector';
import { AIHelper } from '@/components/AIHelper';
import { downloadResumePdf } from '@/lib/pdf';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Download, Save, History, Layout, Sparkles, Eye, PenLine } from 'lucide-react';
import { toast } from 'sonner';

export default function Editor() {
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

    const { error } = await supabase
      .from('resumes')
      .update({ data: data as unknown as Record<string, unknown>, title, template })
      .eq('id', id);

    if (!error) {
      await supabase.from('resume_versions').insert({
        resume_id: id,
        data: data as unknown as Record<string, unknown>,
      });

      const now = new Date();
      setSavedTimestamp(`Saved ${now.toLocaleTimeString('en-US', { hour12: false })}`);
      toast.success('Resume saved');
      setTimeout(() => setSavedTimestamp(null), 2500);
    } else {
      toast.error('Failed to save');
    }

    setSaving(false);
    setTimeout(() => setEditorDimmed(false), 800);
  }, [id, user, data, title, template]);

  const handleTemplateChange = async (t: TemplateId) => {
    if (t === 'executive' && !isPaidUnlocked) return;
    setTemplate(t);
    if (id) {
      await supabase.from('resumes').update({ template: t }).eq('id', id);
    }
  };

  const handleUnlockPaid = async () => {
    setIsPaidUnlocked(true);
    if (id) {
      await supabase.from('resumes').update({ is_paid_template_unlocked: true }).eq('id', id);
    }
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
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Toolbar */}
      <header className="border-b border-border px-4 py-2 flex items-center gap-2 shrink-0">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="max-w-[200px] h-8 text-sm font-medium border-none bg-transparent focus-visible:ring-1"
        />
        <div className="flex-1" />
        <Button variant="ghost" size="sm" onClick={() => setShowAI(true)}>
          <Sparkles className="mr-1.5 h-4 w-4" />
          AI Assist
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setShowTemplates(true)}>
          <Layout className="mr-1.5 h-4 w-4" />
          Templates
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setShowVersions(true)}>
          <History className="mr-1.5 h-4 w-4" />
          Version History
        </Button>
        <Button variant="ghost" size="sm" onClick={() => downloadResumePdf('resume-preview', title || 'resume')}>
          <Download className="mr-1.5 h-4 w-4" />
          Download
        </Button>
        <Button size="sm" onClick={handleSave} disabled={saving}>
          <Save className="mr-1.5 h-4 w-4" />
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </header>

      {/* Mobile toggle */}
      <div className="md:hidden flex border-b border-border">
        <button
          onClick={() => setMobileView('editor')}
          className={`flex-1 py-2 text-sm font-medium text-center transition-colors ${mobileView === 'editor' ? 'text-foreground bg-secondary' : 'text-muted-foreground'}`}
        >
          <PenLine className="inline h-4 w-4 mr-1" />
          Editor
        </button>
        <button
          onClick={() => setMobileView('preview')}
          className={`flex-1 py-2 text-sm font-medium text-center transition-colors ${mobileView === 'preview' ? 'text-foreground bg-secondary' : 'text-muted-foreground'}`}
        >
          <Eye className="inline h-4 w-4 mr-1" />
          Preview
        </button>
      </div>

      {/* Split view */}
      <div className="flex-1 flex overflow-hidden">
        <div
          className={`w-full md:w-1/2 overflow-y-auto bg-secondary border-r border-border transition-opacity duration-700 ${editorDimmed ? 'opacity-50' : 'opacity-100'} ${mobileView === 'preview' ? 'hidden md:block' : ''}`}
        >
          <ResumeForm data={data} onChange={setData} />
        </div>
        <div className={`w-full md:w-1/2 overflow-y-auto bg-background relative ${mobileView === 'editor' ? 'hidden md:block' : ''}`}>
          {savedTimestamp && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 text-xs font-medium text-muted-foreground animate-save-fade">
              {savedTimestamp}
            </div>
          )}
          <ResumePreview data={data} template={template} />
        </div>
      </div>

      {showVersions && id && (
        <VersionHistoryModal
          resumeId={id}
          onRestore={handleRestoreVersion}
          onClose={() => setShowVersions(false)}
        />
      )}

      {showTemplates && (
        <TemplateSelector
          current={template}
          isPaidUnlocked={isPaidUnlocked}
          onSelect={handleTemplateChange}
          onUnlock={handleUnlockPaid}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {showAI && (
        <AIHelper
          data={data}
          onChange={setData}
          onClose={() => setShowAI(false)}
        />
      )}
    </div>
  );
}
