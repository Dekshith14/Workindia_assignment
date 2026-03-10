import { useState } from 'react';
import type { ResumeData } from '@/lib/resume-types';
import { aiGenerateSummary, aiImproveExperience, aiSuggestSkills } from '@/lib/ai';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onClose: () => void;
}

export function AIHelper({ data, onChange, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [jobTitle, setJobTitle] = useState('');

  const handleSummary = async () => {
    if (!jobTitle.trim()) { toast.error('Enter a job title first'); return; }
    setLoading(true);
    try {
      const expText = data.experience.map(e => `${e.role} at ${e.company}: ${e.description}`).join('\n');
      const summary = await aiGenerateSummary(jobTitle, expText);
      onChange({ ...data, summary });
      toast.success('Summary generated');
    } catch { toast.error('Failed to generate summary. Try again.'); }
    setLoading(false);
  };

  const handleImprove = async (index: number) => {
    setLoading(true);
    try {
      const improved = await aiImproveExperience(data.experience[index].description);
      const updated = [...data.experience];
      updated[index] = { ...updated[index], description: improved };
      onChange({ ...data, experience: updated });
      toast.success('Experience improved');
    } catch { toast.error('Failed to improve. Try again.'); }
    setLoading(false);
  };

  const handleSkills = async () => {
    if (!jobTitle.trim()) { toast.error('Enter a job title first'); return; }
    setLoading(true);
    try {
      const skills = await aiSuggestSkills(jobTitle);
      const merged = [...new Set([...data.skills, ...skills])];
      onChange({ ...data, skills: merged });
      toast.success('Skills suggested');
    } catch { toast.error('Failed to suggest skills. Try again.'); }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20">
      <div className="bg-background border border-border rounded-md w-full max-w-md">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">AI Assist</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-xs font-medium text-foreground">Target Job Title</label>
            <Input value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g. Senior Frontend Engineer" className="mt-1" />
          </div>

          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleSummary} disabled={loading}>
              {loading ? 'Generating...' : 'Generate Summary'}
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleSkills} disabled={loading}>
              {loading ? 'Generating...' : 'Suggest Skills'}
            </Button>
          </div>

          {data.experience.length > 0 && (
            <div>
              <p className="text-xs font-medium text-foreground mb-2">Improve Experience Descriptions</p>
              <div className="space-y-1.5">
                {data.experience.map((exp, i) => (
                  <Button key={exp.id} variant="ghost" size="sm" className="w-full justify-start text-xs" onClick={() => handleImprove(i)} disabled={loading}>
                    {exp.role || `Experience #${i + 1}`}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
