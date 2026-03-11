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
  const [restoring, setRestoring] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    api.versions.list(resumeId, user.id)
      .then(data => {
        setVersions(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [resumeId, user]);

  const handleRestore = async (version: Version) => {
    if (!user) return;
    setRestoring(version.id);
    try {
      const response = await api.versions.restore(version.id, user.id);
      if (response.success && response.data) {
        onRestore(response.data.data);
      } else {
        throw new Error('Restore failed');
      }
    } catch (err: any) {
      console.error(err);
      // Fallback: local restore if backend fails or doesn't support it yet
      onRestore(version.data);
    }
    setRestoring(null);
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
            <h2 className="font-semibold text-foreground">Version History</h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
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
              {versions.map((v, i) => (
                <motion.li
                  key={v.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="flex items-center justify-between glass-border rounded-lg px-4 py-3 hover:border-primary/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-secondary flex items-center justify-center text-xs font-mono text-muted-foreground">
                      v{versions.length - i}
                    </div>
                    <span className="text-sm text-foreground">
                      {new Date(v.created_at).toLocaleString()}
                    </span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleRestore(v)} 
                    disabled={restoring !== null}
                    className="text-primary hover:text-primary h-8"
                  >
                    <RotateCcw className={`h-3.5 w-3.5 mr-1.5 ${restoring === v.id ? 'animate-spin' : ''}`} />
                    {restoring === v.id ? 'Restoring...' : 'Restore'}
                  </Button>
                </motion.li>
              ))}
            </ul>
          )}
        </div>
      </motion.div>
    </div>
  );
}
