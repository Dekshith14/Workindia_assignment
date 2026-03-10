import { supabase } from '../config/supabase.js';

export const resumeService = {
  async getResumes(userId: string) {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async getResumeById(id: string, userId: string) {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('id', id)
      .eq('user_id', userId)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createResume(userId: string, title: string, template: string, data: any) {
    const { data: result, error } = await supabase
      .from('resumes')
      .insert([{ user_id: userId, title, template, data: JSON.parse(JSON.stringify(data)) }])
      .select()
      .single();
    
    if (error) throw error;
    return result;
  },

  async updateResume(id: string, userId: string, updates: any) {
    const { data: result, error } = await supabase
      .from('resumes')
      .update(updates)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return result;
  },

  async deleteResume(id: string, userId: string) {
    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);
    
    if (error) throw error;
    return { success: true };
  }
};
