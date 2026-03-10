import { Router } from 'express';
import { aiService } from '../services/aiService.js';

const router = Router();

router.post('/summary', async (req, res) => {
  try {
    const { jobTitle, experience } = req.body;
    const result = await aiService.generateSummary(jobTitle, experience);
    res.json({ result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/improve', async (req, res) => {
  try {
    const { description } = req.body;
    const result = await aiService.improveExperience(description);
    res.json({ result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/skills', async (req, res) => {
  try {
    const { jobTitle } = req.body;
    const result = await aiService.suggestSkills(jobTitle);
    res.json({ result });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
