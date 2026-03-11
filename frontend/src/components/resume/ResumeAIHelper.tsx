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
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [loadingImprovement, setLoadingImprovement] = useState<number | null>(null);
  const [jobTitle, setJobTitle] = useState('');

  const handleSummary = async () => {
    if (!jobTitle.trim()) { toast.error('Enter a job title first'); return; }
    setLoadingSummary(true);
    try {
      const expText = data.experience.map(e => `${e.role} at ${e.company}: ${e.description}`).join('\n');
      const summary = await aiGenerateSummary(jobTitle, expText);
      onChange({ ...data, summary });
      toast.success('Summary generated');
    } catch { toast.error('Failed to generate summary'); }
    setLoadingSummary(false);
  };

  const handleImprove = async (index: number) => {
    setLoadingImprovement(index);
    try {
      const improved = await aiImproveExperience(data.experience[index].description);
      const updated = [...data.experience];
      updated[index] = { ...updated[index], description: improved };
      onChange({ ...data, experience: updated });
      toast.success('Experience improved');
    } catch { toast.error('Failed to improve'); }
    setLoadingImprovement(null);
  };

  const handleSkills = async () => {
    if (!jobTitle.trim()) { toast.error('Enter a job title first'); return; }
    setLoadingSkills(true);
    try {
      const skills = await aiSuggestSkills(jobTitle);
      const merged = [...new Set([...data.skills, ...skills])];
      onChange({ ...data, skills: merged });
      toast.success('Skills suggested');
    } catch { toast.error('Failed to suggest skills'); }
    setLoadingSkills(false);
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

          <div className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full h-11 glass-border flex items-center justify-between px-4 group hover:border-accent/40 transition-all" 
              onClick={handleSummary} 
              disabled={loadingSummary || loadingSkills || loadingImprovement !== null}
            >
              <div className="flex items-center gap-3">
                <Wand2 className={`h-4 w-4 text-accent ${loadingSummary ? 'animate-spin' : 'group-hover:scale-110 transition-transform'}`} />
                <span className="text-sm font-medium">Professional Summary</span>
              </div>
              {loadingSummary && <span className="text-[10px] uppercase tracking-widest text-accent animate-pulse">Generating</span>}
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full h-11 glass-border flex items-center justify-between px-4 group hover:border-primary/40 transition-all" 
              onClick={handleSkills} 
              disabled={loadingSummary || loadingSkills || loadingImprovement !== null}
            >
              <div className="flex items-center gap-3">
                <Lightbulb className={`h-4 w-4 text-primary ${loadingSkills ? 'animate-pulse' : 'group-hover:scale-110 transition-transform'}`} />
                <span className="text-sm font-medium">Skill Suggestions</span>
              </div>
              {loadingSkills && <span className="text-[10px] uppercase tracking-widest text-primary animate-pulse">Analyzing</span>}
            </Button>
          </div>

          {data.experience.length > 0 && (
            <div className="pt-2">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mb-3 ml-1">Improve Experience</p>
              <div className="space-y-2">
                {data.experience.map((exp, i) => (
                  <Button 
                    key={exp.id} 
                    variant="ghost" 
                    className="w-full h-10 glass-border justify-between px-4 hover:bg-accent/5 transition-all text-left" 
                    onClick={() => handleImprove(i)} 
                    disabled={loadingSummary || loadingSkills || loadingImprovement !== null}
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      <Sparkles className={`shrink-0 h-3.5 w-3.5 text-accent ${loadingImprovement === i ? 'animate-pulse' : ''}`} />
                      <span className="text-xs truncate font-medium">{exp.role || `Experience #${i + 1}`}</span>
                    </div>
                    {loadingImprovement === i && <span className="shrink-0 text-[10px] uppercase text-accent animate-pulse ml-2">Improving</span>}
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
