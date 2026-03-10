import { supabase } from '@/integrations/supabase/client';

export async function aiGenerateSummary(jobTitle: string, experience: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke('ai-resume', {
    body: { type: 'summary', jobTitle, experience },
  });
  if (error) throw error;
  return data.result;
}

export async function aiImproveExperience(description: string): Promise<string> {
  const { data, error } = await supabase.functions.invoke('ai-resume', {
    body: { type: 'improve', description },
  });
  if (error) throw error;
  return data.result;
}

export async function aiSuggestSkills(jobTitle: string): Promise<string[]> {
  const { data, error } = await supabase.functions.invoke('ai-resume', {
    body: { type: 'skills', jobTitle },
  });
  if (error) throw error;
  return data.result;
}
