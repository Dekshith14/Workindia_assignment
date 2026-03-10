import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import type { ResumeRecord } from '@/lib/resume-types';
import { emptyResumeData } from '@/lib/resume-types';
import { Plus, FileText, LogOut } from 'lucide-react';

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<ResumeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from('resumes')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .then(({ data }) => {
        setResumes((data as unknown as ResumeRecord[]) || []);
        setLoading(false);
      });
  }, [user]);

  const createResume = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('resumes')
      .insert({ user_id: user.id, title: 'Untitled Resume', template: 'classic', data: emptyResumeData as unknown as Record<string, unknown> })
      .select()
      .single();
    if (!error && data) {
      navigate(`/editor/${data.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4 flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">My Resumes</h1>
        <div className="flex items-center gap-3">
          <Button onClick={createResume} size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            New Resume
          </Button>
          <Button variant="ghost" size="sm" onClick={() => signOut()}>
            <LogOut className="mr-1.5 h-4 w-4" />
            Sign out
          </Button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        {loading ? (
          <p className="text-muted-foreground text-sm">Loading...</p>
        ) : resumes.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No resumes yet.</p>
            <Button onClick={createResume}>Create your first resume</Button>
          </div>
        ) : (
          <ul className="space-y-2">
            {resumes.map((r) => (
              <li key={r.id}>
                <button
                  onClick={() => navigate(`/editor/${r.id}`)}
                  className="w-full text-left px-4 py-3 border border-border rounded-md hover:bg-secondary transition-colors flex items-center justify-between"
                >
                  <div>
                    <span className="font-medium text-foreground">{r.title}</span>
                    <span className="ml-3 text-xs text-muted-foreground">{r.template}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(r.updated_at).toLocaleDateString()}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
