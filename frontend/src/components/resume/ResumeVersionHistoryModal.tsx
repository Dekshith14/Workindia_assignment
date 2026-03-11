import { useEffect, useState } from 'react';
import { api } from '@/lib/api-client';
import type { ResumeData } from '@/lib/resume-types';
import { Button } from '@/components/ui/button';
import { X, Clock, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/use-auth';

interface Version {
  id: string;
  data: ResumeData;
  created_at: string;
}

interface Props {
  resumeId: string;
  onRestore: (data: ResumeData) => void;
  onClose: () => void;
}

export function ResumeVersionHistoryModal({ resumeId, onRestore, onClose }: Props) {
  const { user } = useAuth();
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    api.versions.list(resumeId, user.id)
      .then(data => {
        setVersions(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [resumeId, user]);

  const getDiffSummary = (current: ResumeData, previous: ResumeData | null) => {
    if (!previous) return 'Initial version';
    const changes = [];
    if (JSON.stringify(current.personal) !== JSON.stringify(previous.personal)) changes.push('Personal Details');
    if (current.summary !== previous.summary) changes.push('Summary');
    if (current.education.length !== previous.education.length) {
      changes.push(`${current.education.length > previous.education.length ? 'Added' : 'Removed'} Education`);
    } else if (JSON.stringify(current.education) !== JSON.stringify(previous.education)) {
      changes.push('Updated Education');
    }
    if (current.experience.length !== previous.experience.length) {
      changes.push(`${current.experience.length > previous.experience.length ? 'Added' : 'Removed'} Work Experience`);
    } else if (JSON.stringify(current.experience) !== JSON.stringify(previous.experience)) {
      changes.push('Updated Experience');
    }
    if (current.projects.length !== previous.projects.length) {
      changes.push(`${current.projects.length > previous.projects.length ? 'Added' : 'Removed'} Projects`);
    } else if (JSON.stringify(current.projects) !== JSON.stringify(previous.projects)) {
      changes.push('Updated Projects');
    }
    if (JSON.stringify(current.skills) !== JSON.stringify(previous.skills)) changes.push('Skills');
    return changes.length > 0 ? changes.join(', ') : 'Minor tweaks';
  };

  const handleRestore = (version: Version) => {
    onRestore(version.data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass glass-border rounded-2xl w-full max-w-md max-h-[70vh] flex flex-col mx-4"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <h2 className="font-semibold text-foreground whitespace-nowrap">Version History</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors shrink-0">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => <div key={i} className="h-12 rounded-lg bg-secondary animate-pulse" />)}
            </div>
          ) : versions.length === 0 ? (
            <div className="text-center py-10">
              <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No versions saved yet. Click Save to create a version.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {versions.map((v, i) => {
                const prevVersion = versions[i + 1] || null;
                const changeSummary = getDiffSummary(v.data, prevVersion?.data);
                
                return (
                  <motion.li
                    key={v.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center justify-between glass-border rounded-xl px-4 py-4 hover:border-primary/20 transition-all hover:bg-secondary/5 group"
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="h-10 w-10 rounded-xl bg-secondary flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0 border border-border/50 group-hover:border-primary/30 transition-colors">
                        v{versions.length - i}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-foreground">
                          {new Date(v.created_at).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                        </span>
                        <span className="text-[11px] text-muted-foreground truncate italic mt-0.5">
                          {changeSummary}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleRestore(v)} 
                      className="text-primary hover:bg-primary hover:text-primary-foreground h-9 px-4 rounded-lg min-w-fit whitespace-nowrap shrink-0 ml-4 border border-primary/20 hover:border-primary transition-all"
                    >
                      <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                      Restore
                    </Button>
                  </motion.li>
                );
              })}
            </ul>
          )}
        </div>
      </motion.div>
    </div>
  );
}
