import express from 'express';
import cors from 'cors';
import resumeRoutes from './routes/resumes.js';
import versionRoutes from './routes/versions.js';
import aiRoutes from './routes/ai.js';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/resumes', resumeRoutes);
app.use('/api/versions', versionRoutes);
app.use('/api/ai', aiRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
