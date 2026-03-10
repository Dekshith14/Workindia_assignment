import { Router } from 'express';
import { resumeService } from '../services/resumeService.js';

const router = Router();

// Middleware to mock user id for now (should be from auth)
const getUserId = (req: any) => req.headers['x-user-id'] as string;

router.get('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    const resumes = await resumeService.getResumes(userId);
    res.json(resumes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const userId = getUserId(req);
    const resume = await resumeService.getResumeById(req.params.id, userId);
    res.json(resume);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { title, template, data } = req.body;
    const result = await resumeService.createResume(userId, title, template, data);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const userId = getUserId(req);
    const result = await resumeService.updateResume(req.params.id, userId, req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const userId = getUserId(req);
    const result = await resumeService.deleteResume(req.params.id, userId);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
