import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { ResumeData } from '@/lib/resume-types';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

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

export function VersionHistoryModal({ resumeId, onRestore, onClose }: Props) {
  const [versions, setVersions] = useState<Version[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from('resume_versions')
      .select('*')
      .eq('resume_id', resumeId)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setVersions((data as unknown as Version[]) || []);
        setLoading(false);
      });
  }, [resumeId]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20">
      <div className="bg-background border border-border rounded-md w-full max-w-md max-h-[70vh] flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">Version History</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : versions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No versions saved yet. Click Save to create a version.</p>
          ) : (
            <ul className="space-y-2">
              {versions.map((v) => (
                <li key={v.id} className="flex items-center justify-between border border-border rounded-sm px-3 py-2">
                  <span className="text-sm text-foreground">
                    {new Date(v.created_at).toLocaleString()}
                  </span>
                  <Button variant="outline" size="sm" onClick={() => onRestore(v.data)}>
                    Restore
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
