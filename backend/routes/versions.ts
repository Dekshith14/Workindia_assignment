import { Router } from 'express';
import { supabase } from '../config/supabase.js';

const router = Router();
const getUserId = (req: any) => req.headers['x-user-id'] as string;

router.get('/:resumeId', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { data: resume } = await supabase
      .from('resumes')
      .select('id')
      .eq('id', req.params.resumeId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (!resume) return res.status(403).json({ error: 'Unauthorized or not found' });

    const { data, error } = await supabase
      .from('resume_versions')
      .select('*')
      .eq('resume_id', req.params.resumeId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { resumeId, data: resumeData } = req.body;
    
    if (!resumeId) return res.status(400).json({ error: 'resumeId is required' });

    const { data: resume } = await supabase
      .from('resumes')
      .select('id')
      .eq('id', resumeId)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (!resume) return res.status(403).json({ error: 'Unauthorized or not found' });

    // Update the resumes table
    await supabase.from('resumes').update({ data: JSON.parse(JSON.stringify(resumeData)) }).eq('id', resumeId);

    // Insert snapshot into resume_versions
    const { data, error } = await supabase
      .from('resume_versions')
      .insert([{ resume_id: resumeId, data: JSON.parse(JSON.stringify(resumeData)) }])
      .select()
      .single();
    
    if (error) throw error;
    res.status(201).json(data);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/restore', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { versionId } = req.body;

    if (!versionId) return res.status(400).json({ error: 'versionId is required' });

    // Find the version and verify ownership of the parent resume
    const { data: version, error: vError } = await supabase
      .from('resume_versions')
      .select('*, resumes(user_id)')
      .eq('id', versionId)
      .single();

    if (vError || !version) return res.status(404).json({ error: 'Version not found' });
    
    // @ts-ignore - Supabase join result typing
    if (version.resumes.user_id !== userId) return res.status(403).json({ error: 'Unauthorized' });

    // Restore the data to the main resume
    const { data: updatedResume, error: uError } = await supabase
      .from('resumes')
      .update({ data: version.data })
      .eq('id', version.resume_id)
      .select()
      .single();

    if (uError) throw uError;
    res.json({ success: true, data: updatedResume });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
