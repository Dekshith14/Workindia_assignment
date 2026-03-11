import { useState } from 'react';
import type { ResumeData } from '@/lib/resume-types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, User, Briefcase, GraduationCap, FolderOpen, Wrench, FileText } from 'lucide-react';

function genId() {
  return crypto.randomUUID();
}

interface Props {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
}

export function ResumeForm({ data, onChange }: Props) {
  const update = <K extends keyof ResumeData>(key: K, value: ResumeData[K]) => {
    onChange({ ...data, [key]: value });
  };

  const updatePersonal = (field: string, value: string) => {
    update('personal', { ...data.personal, [field]: value });
  };

  const addEducation = () => update('education', [...data.education, { id: genId(), institution: '', degree: '', year: '' }]);
  const addExperience = () => update('experience', [...data.experience, { id: genId(), company: '', role: '', description: '', duration: '' }]);
  const addProject = () => update('projects', [...data.projects, { id: genId(), name: '', description: '', technologies: '' }]);

  const removeItem = <T extends { id: string }>(list: T[], id: string) => list.filter(i => i.id !== id);

  const [skillInput, setSkillInput] = useState('');
  const addSkill = () => {
    const s = skillInput.trim();
    if (s && !data.skills.includes(s)) {
      update('skills', [...data.skills, s]);
      setSkillInput('');
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-lg mx-auto">
      {/* Personal */}
      <section className="glass glass-border rounded-xl p-5 premium-card">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center">
            <User className="h-3.5 w-3.5 text-primary" />
          </div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Personal Information</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {(['name', 'email', 'phone', 'location', 'linkedin', 'portfolio'] as const).map(f => (
            <div key={f} className={f === 'name' ? 'col-span-2' : ''}>
              <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/70 mb-1.5 block">{f}</Label>
              <Input 
                value={data.personal[f]} 
                onChange={e => updatePersonal(f, e.target.value)} 
                className="bg-secondary/30 h-10 border-none ring-1 ring-border/50 focus-visible:ring-primary/40" 
                placeholder={`Your ${f}`}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Summary */}
      <section className="glass glass-border rounded-xl p-5 premium-card">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center">
            <FileText className="h-3.5 w-3.5 text-primary" />
          </div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Professional Summary</h2>
        </div>
        <Textarea 
          value={data.summary} 
          onChange={e => update('summary', e.target.value)} 
          rows={4} 
          className="bg-secondary/30 border-none ring-1 ring-border/50 focus-visible:ring-primary/40 resize-none" 
          placeholder="Briefly describe your career goals and key achievements..."
        />
      </section>

      {/* Education */}
      <section className="glass glass-border rounded-xl p-5 premium-card">
        <div className="flex items-center justify-between gap-3 mb-4 w-full">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-accent/10 flex items-center justify-center shrink-0">
              <GraduationCap className="h-3.5 w-3.5 text-accent" />
            </div>
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Education</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={addEducation} className="text-accent hover:bg-accent hover:text-accent-foreground min-w-fit whitespace-nowrap">
            <Plus className="h-4 w-4 mr-1" />Add
          </Button>
        </div>
        <div className="space-y-4">
          {data.education.map((edu, i) => (
            <div key={edu.id} className="relative group border border-border/40 rounded-lg p-4 bg-secondary/10">
              <button 
                onClick={() => update('education', removeItem(data.education, edu.id))} 
                className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all p-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="space-y-3">
                <div>
                  <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 mb-1.5 block">Institution</Label>
                  <Input value={edu.institution} className="bg-background/50 h-9" placeholder="e.g. Stanford University" onChange={e => {
                    const updated = [...data.education]; updated[i] = { ...edu, institution: e.target.value }; update('education', updated);
                  }} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 mb-1.5 block">Degree</Label>
                    <Input value={edu.degree} className="bg-background/50 h-9" placeholder="e.g. Computer Science" onChange={e => {
                      const updated = [...data.education]; updated[i] = { ...edu, degree: e.target.value }; update('education', updated);
                    }} />
                  </div>
                  <div>
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 mb-1.5 block">Year</Label>
                    <Input value={edu.year} className="bg-background/50 h-9" placeholder="e.g. 2022" onChange={e => {
                      const updated = [...data.education]; updated[i] = { ...edu, year: e.target.value }; update('education', updated);
                    }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Experience */}
      <section className="glass glass-border rounded-xl p-5 premium-card">
        <div className="flex items-center justify-between gap-3 mb-4 w-full">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
              <Briefcase className="h-3.5 w-3.5 text-primary" />
            </div>
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Experience</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={addExperience} className="text-primary hover:bg-primary hover:text-primary-foreground min-w-fit whitespace-nowrap">
            <Plus className="h-4 w-4 mr-1" />Add
          </Button>
        </div>
        <div className="space-y-4">
          {data.experience.map((exp, i) => (
            <div key={exp.id} className="relative group border border-border/40 rounded-lg p-4 bg-secondary/10">
              <button 
                onClick={() => update('experience', removeItem(data.experience, exp.id))} 
                className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all p-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 mb-1.5 block">Company</Label>
                    <Input value={exp.company} className="bg-background/50 h-9" placeholder="Google" onChange={e => {
                      const updated = [...data.experience]; updated[i] = { ...exp, company: e.target.value }; update('experience', updated);
                    }} />
                  </div>
                  <div>
                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 mb-1.5 block">Role</Label>
                    <Input value={exp.role} className="bg-background/50 h-9" placeholder="Senior Engineer" onChange={e => {
                      const updated = [...data.experience]; updated[i] = { ...exp, role: e.target.value }; update('experience', updated);
                    }} />
                  </div>
                </div>
                <div>
                  <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 mb-1.5 block">Duration</Label>
                  <Input value={exp.duration} className="bg-background/50 h-9" placeholder="Jan 2022 – Present" onChange={e => {
                    const updated = [...data.experience]; updated[i] = { ...exp, duration: e.target.value }; update('experience', updated);
                  }} />
                </div>
                <div>
                  <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 mb-1.5 block">Impact</Label>
                  <Textarea value={exp.description} rows={3} className="bg-background/50 resize-none text-sm" placeholder="Summarize your key achievements..." onChange={e => {
                    const updated = [...data.experience]; updated[i] = { ...exp, description: e.target.value }; update('experience', updated);
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects */}
      <section className="glass glass-border rounded-xl p-5 premium-card">
        <div className="flex items-center justify-between gap-3 mb-4 w-full">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-accent/10 flex items-center justify-center shrink-0">
              <FolderOpen className="h-3.5 w-3.5 text-accent" />
            </div>
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">Projects</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={addProject} className="text-accent hover:bg-accent hover:text-accent-foreground min-w-fit whitespace-nowrap">
            <Plus className="h-4 w-4 mr-1" />Add
          </Button>
        </div>
        <div className="space-y-4">
          {data.projects.map((proj, i) => (
            <div key={proj.id} className="relative group border border-border/40 rounded-lg p-4 bg-secondary/10">
              <button 
                onClick={() => update('projects', removeItem(data.projects, proj.id))} 
                className="absolute top-2 right-2 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-all p-1"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <div className="space-y-3">
                <div>
                  <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 mb-1.5 block">Project Name</Label>
                  <Input value={proj.name} className="bg-background/50 h-9" placeholder="e.g. AI Content Generator" onChange={e => {
                    const updated = [...data.projects]; updated[i] = { ...proj, name: e.target.value }; update('projects', updated);
                  }} />
                </div>
                <div>
                  <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 mb-1.5 block">Description</Label>
                  <Textarea value={proj.description} rows={2} className="bg-background/50 resize-none text-sm" placeholder="What did you build?" onChange={e => {
                    const updated = [...data.projects]; updated[i] = { ...proj, description: e.target.value }; update('projects', updated);
                  }} />
                </div>
                <div>
                  <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60 mb-1.5 block">Technologies</Label>
                  <Input value={proj.technologies} className="bg-background/50 h-9" placeholder="React, Node.js, OpenAI" onChange={e => {
                    const updated = [...data.projects]; updated[i] = { ...proj, technologies: e.target.value }; update('projects', updated);
                  }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section className="glass glass-border rounded-xl p-5 premium-card">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center">
            <Wrench className="h-3.5 w-3.5 text-primary" />
          </div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Skills & Expertise</h2>
        </div>
        <div className="flex gap-2 mb-4">
          <Input 
            placeholder="Add a skill (e.g. React)..." 
            value={skillInput} 
            onChange={e => setSkillInput(e.target.value)} 
            className="bg-secondary/30 border-none ring-1 ring-border/50 focus-visible:ring-primary/40 h-10"
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); }}} 
          />
          <Button variant="outline" size="sm" onClick={addSkill} className="glass-border h-10 px-4">Add</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {data.skills.map(s => (
            <span key={s} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full bg-primary/10 text-primary border border-primary/20 transition-all hover:bg-primary/20">
              {s}
              <button onClick={() => update('skills', data.skills.filter(sk => sk !== s))} className="hover:text-destructive transition-colors text-base leading-none">×</button>
            </span>
          ))}
          {data.skills.length === 0 && (
            <p className="text-xs text-muted-foreground italic">No skills added yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}
