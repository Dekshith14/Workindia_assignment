import { useState } from 'react';
import type { ResumeData } from '@/lib/resume-types';
import { aiGenerateSummary, aiImproveExperience, aiSuggestSkills } from '@/lib/ai';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Sparkles, Wand2, Lightbulb } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onClose: () => void;
}

export function ResumeAIHelper({ data, onChange, onClose }: Props) {
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
    } catch { toast.error('Failed to generate summary'); }
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
    } catch { toast.error('Failed to improve'); }
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
    } catch { toast.error('Failed to suggest skills'); }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass glass-border rounded-2xl w-full max-w-md mx-4"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <h2 className="font-semibold text-foreground">AI Assistant</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Target Job Title</label>
            <Input value={jobTitle} onChange={e => setJobTitle(e.target.value)} placeholder="e.g. Senior Frontend Engineer" className="mt-2 bg-secondary/50 h-11" />
          </div>

          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full justify-start h-10 glass-border" onClick={handleSummary} disabled={loading}>
              <Wand2 className="mr-2 h-4 w-4 text-accent" />
              {loading ? 'Generating...' : 'Generate Professional Summary'}
            </Button>
            <Button variant="outline" size="sm" className="w-full justify-start h-10 glass-border" onClick={handleSkills} disabled={loading}>
              <Lightbulb className="mr-2 h-4 w-4 text-primary" />
              {loading ? 'Generating...' : 'Suggest Relevant Skills'}
            </Button>
          </div>

          {data.experience.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Improve Experience</p>
              <div className="space-y-1.5">
                {data.experience.map((exp, i) => (
                  <Button key={exp.id} variant="ghost" size="sm" className="w-full justify-start text-xs h-9" onClick={() => handleImprove(i)} disabled={loading}>
                    <Sparkles className="mr-2 h-3.5 w-3.5 text-accent" />
                    {exp.role || `Experience #${i + 1}`}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
