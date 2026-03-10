import { Router } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();
const getUserId = (req: any) => req.headers['x-user-id'] as string;

router.get('/:resumeId', async (req, res) => {
  try {
    const userId = getUserId(req);
    // Verify ownership first
    const { data: resume } = await supabase
      .from('resumes')
      .select('id')
      .eq('id', req.params.resumeId)
      .eq('user_id', userId)
      .single();
    
    if (!resume) return res.status(403).json({ error: 'Unauthorized' });

    const { data, error } = await supabase
      .from('resume_versions')
      .select('*')
      .eq('resume_id', req.params.resumeId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:resumeId', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { data: resumeData } = req.body;
    
    // Verify ownership
    const { data: resume } = await supabase
      .from('resumes')
      .select('id')
      .eq('id', req.params.resumeId)
      .eq('user_id', userId)
      .single();
    
    if (!resume) return res.status(403).json({ error: 'Unauthorized' });

    const { data, error } = await supabase
      .from('resume_versions')
      .insert([{ resume_id: req.params.resumeId, data: resumeData }])
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
