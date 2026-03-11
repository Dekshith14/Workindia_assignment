import { Router } from 'express';
import multer from 'multer';
// @ts-ignore
import { importService } from '../services/importService.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const fileExt = req.file.originalname.split('.').pop()?.toLowerCase();
    let parsedResume;

    if (fileExt === 'pdf') {
      parsedResume = await importService.parsePdf(req.file.buffer);
    } else if (fileExt === 'docx') {
      parsedResume = await importService.parseDocx(req.file.buffer);
    } else {
      return res.status(400).json({ error: 'Unsupported file type' });
    }

    res.json({
      title: 'Imported Resume',
      data: parsedResume
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
