import { supabase } from '../config/supabase.js';

export const aiService = {
  async generateSummary(jobTitle: string, experience: string) {
    const { data, error } = await supabase.functions.invoke('ai-resume', {
      body: { type: 'summary', jobTitle, experience },
    });
    if (error) throw error;
    return data.result;
  },

  async improveExperience(description: string) {
    const { data, error } = await supabase.functions.invoke('ai-resume', {
      body: { type: 'improve', description },
    });
    if (error) throw error;
    return data.result;
  },

  async suggestSkills(jobTitle: string) {
    const { data, error } = await supabase.functions.invoke('ai-resume', {
      body: { type: 'skills', jobTitle },
    });
    if (error) throw error;
    return data.result;
  }
};
