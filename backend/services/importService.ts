import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
const mammoth = require('mammoth');

export const importService = {
  async parsePdf(buffer: Buffer) {
    const data = await pdf(buffer);
    return this.textToResume(data.text);
  },

  async parseDocx(buffer: Buffer) {
    const result = await mammoth.extractRawText({ buffer });
    return this.textToResume(result.value);
  },

  textToResume(text: string) {
    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const resume: any = {
      personal: { name: '', email: '', phone: '', location: '', linkedin: '', portfolio: '' },
      summary: '',
      experience: [],
      education: [],
      projects: [],
      skills: []
    };

    // 1. Extract Email
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    if (emailMatch) resume.personal.email = emailMatch[0];

    // 2. Extract Phone (Indian format support)
    const phoneMatch = text.match(/(\+?91[\s\-]?)?[6-9]\d{9}/);
    if (phoneMatch) resume.personal.phone = phoneMatch[0];

    // 3. Extract LinkedIn
    const linkedinMatch = text.match(/(?:linkedin\.com\/in\/|LinkedIn[\s:|]?\s*)([\w\-]+)/i);
    if (linkedinMatch) resume.personal.linkedin = `linkedin.com/in/${linkedinMatch[1]}`;

    // 4. Extract GitHub/Portfolio
    const githubMatch = text.match(/(?:github\.com\/|GitHub[\s:|]?\s*)([\w\-]+)/i);
    if (githubMatch) resume.personal.portfolio = `github.com/${githubMatch[1]}`;

    // 5. Extract Location (city mention before section headers)
    const locationMatch = text.match(/\b(Bangalore|Mumbai|Delhi|Hyderabad|Chennai|Pune|Kolkata|[A-Z][a-z]+\s*[-–]\s*\d{6})/);
    if (locationMatch) resume.personal.location = locationMatch[0].replace(/\s*[-–]\s*\d{6}/, '').trim();

    // 6. Extract Name — first line that looks like just a name (letters only, not a URL/phone/contact mix)
    for (const line of lines) {
      const cleaned = line.replace(/[|\-–•·@]/g, '').trim();
      if (
        cleaned.length > 1 &&
        cleaned.length < 50 &&
        !cleaned.includes('@') &&
        !cleaned.includes('http') &&
        !/\d{5,}/.test(cleaned) &&
        /^[A-Za-z\s.]+$/.test(cleaned)
      ) {
        resume.personal.name = cleaned.trim();
        break;
      }
    }

    // 7. Detect section headers
    const sections: any = {
      summary: /summary|profile|about me/i,
      experience: /experience|work history|employment/i,
      education: /education|academic/i,
      projects: /projects|personal projects/i,
      skills: /skills|technical skills|expertise/i
    };

    let currentSection = '';
    let currentContent: string[] = [];

    const flushSection = () => {
      if (!currentSection) return;
      const content = currentContent.join('\n').trim();
      if (!content) return;

      if (currentSection === 'summary') {
        resume.summary = content.replace(/^(summary|profile|about me)[:\s]*/i, '');
      } else if (currentSection === 'skills') {
        const cleanContent = content.replace(/^(skills|technical skills|expertise)[:\s]*/i, '');
        resume.skills = cleanContent.split(/[,\n·|]/).map(s => s.trim()).filter(s => s.length > 1 && s.length < 40);
      } else if (currentSection === 'experience' || currentSection === 'projects' || currentSection === 'education') {
        const cleanContent = content.replace(/^(experience|work history|employment|education|academic|projects|personal projects)[:\s]*/i, '');
        
        const title = currentSection === 'experience' ? 'Experience Detail' : 
                    currentSection === 'education' ? 'Education Detail' : 'Project Detail';
        
        resume[currentSection].push({
          id: Math.random().toString(36).substr(2, 9),
          title: title,
          description: cleanContent,
          ...(currentSection === 'experience' ? { role: 'Professional', company: 'Company Name', duration: '' } : {}),
          ...(currentSection === 'education' ? { degree: 'Degree', institution: 'Institution', year: '' } : {}),
          ...(currentSection === 'projects' ? { name: 'Project Name' } : {})
        });
      }
    };

    for (const line of lines) {
      let foundHeader = false;
      for (const [key, regex] of Object.entries(sections)) {
        // Match if line starts with the header (e.g. "SUMMARY:" or "EXPERIENCE")
        // Relaxed length check to allow "SUMMARY: Some text..."
        const match = line.match(new RegExp(`^(${ (regex as RegExp).source })`, 'i'));
        if (match && (line.length < 50 || line.includes(':'))) {
          flushSection();
          currentSection = key;
          currentContent = [line]; // Include line in case it has content after colon
          foundHeader = true;
          break;
        }
      }

      if (!foundHeader && currentSection) {
        currentContent.push(line);
      } else if (!foundHeader && !currentSection) {
        // Try to identify personal details if not in a section yet
        if (!resume.personal.location && (line.toLowerCase().includes('bangalore') || line.toLowerCase().includes('india'))) {
          resume.personal.location = line;
        }
        // Name check - if it's the first line and looks like a name
        if (!resume.personal.name && line.length < 40 && !line.includes('@')) {
          resume.personal.name = line;
        }
      }
    }
    flushSection();

    // Fallback if summary is empty but we have initial text
    if (!resume.summary && text.length > 50) {
      resume.summary = text.substring(0, 300) + '...';
    }

    return resume;
  }
};
