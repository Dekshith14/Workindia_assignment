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
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center">
            <User className="h-3.5 w-3.5 text-primary" />
          </div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Personal Information</h2>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {(['name', 'email', 'phone', 'location', 'linkedin', 'portfolio'] as const).map(f => (
            <div key={f} className={f === 'name' ? 'col-span-2' : ''}>
              <Label className="text-xs capitalize text-muted-foreground">{f}</Label>
              <Input value={data.personal[f]} onChange={e => updatePersonal(f, e.target.value)} className="mt-1 bg-secondary/50 h-10" />
            </div>
          ))}
        </div>
      </section>

      {/* Summary */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center">
            <FileText className="h-3.5 w-3.5 text-primary" />
          </div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Summary</h2>
        </div>
        <Textarea value={data.summary} onChange={e => update('summary', e.target.value)} rows={3} className="bg-secondary/50" />
      </section>

      {/* Education */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-accent/10 flex items-center justify-center">
              <GraduationCap className="h-3.5 w-3.5 text-accent" />
            </div>
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Education</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={addEducation} className="text-accent hover:text-accent">
            <Plus className="h-4 w-4 mr-1" />Add
          </Button>
        </div>
        {data.education.map((edu, i) => (
          <div key={edu.id} className="glass-border rounded-lg p-3 mb-3 space-y-2 bg-secondary/20">
            <div className="flex justify-between items-start">
              <span className="text-xs text-muted-foreground font-mono">#{i + 1}</span>
              <button onClick={() => update('education', removeItem(data.education, edu.id))} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <Input placeholder="Institution" value={edu.institution} className="bg-secondary/50" onChange={e => {
              const updated = [...data.education]; updated[i] = { ...edu, institution: e.target.value }; update('education', updated);
            }} />
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Degree" value={edu.degree} className="bg-secondary/50" onChange={e => {
                const updated = [...data.education]; updated[i] = { ...edu, degree: e.target.value }; update('education', updated);
              }} />
              <Input placeholder="Year" value={edu.year} className="bg-secondary/50" onChange={e => {
                const updated = [...data.education]; updated[i] = { ...edu, year: e.target.value }; update('education', updated);
              }} />
            </div>
          </div>
        ))}
      </section>

      {/* Experience */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center">
              <Briefcase className="h-3.5 w-3.5 text-primary" />
            </div>
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Experience</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={addExperience} className="text-primary hover:text-primary">
            <Plus className="h-4 w-4 mr-1" />Add
          </Button>
        </div>
        {data.experience.map((exp, i) => (
          <div key={exp.id} className="glass-border rounded-lg p-3 mb-3 space-y-2 bg-secondary/20">
            <div className="flex justify-between items-start">
              <span className="text-xs text-muted-foreground font-mono">#{i + 1}</span>
              <button onClick={() => update('experience', removeItem(data.experience, exp.id))} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="Company" value={exp.company} className="bg-secondary/50" onChange={e => {
                const updated = [...data.experience]; updated[i] = { ...exp, company: e.target.value }; update('experience', updated);
              }} />
              <Input placeholder="Role" value={exp.role} className="bg-secondary/50" onChange={e => {
                const updated = [...data.experience]; updated[i] = { ...exp, role: e.target.value }; update('experience', updated);
              }} />
            </div>
            <Input placeholder="Duration (e.g. Jan 2022 – Present)" value={exp.duration} className="bg-secondary/50" onChange={e => {
              const updated = [...data.experience]; updated[i] = { ...exp, duration: e.target.value }; update('experience', updated);
            }} />
            <Textarea placeholder="Description" value={exp.description} rows={2} className="bg-secondary/50" onChange={e => {
              const updated = [...data.experience]; updated[i] = { ...exp, description: e.target.value }; update('experience', updated);
            }} />
          </div>
        ))}
      </section>

      {/* Projects */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-md bg-accent/10 flex items-center justify-center">
              <FolderOpen className="h-3.5 w-3.5 text-accent" />
            </div>
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Projects</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={addProject} className="text-accent hover:text-accent">
            <Plus className="h-4 w-4 mr-1" />Add
          </Button>
        </div>
        {data.projects.map((proj, i) => (
          <div key={proj.id} className="glass-border rounded-lg p-3 mb-3 space-y-2 bg-secondary/20">
            <div className="flex justify-between items-start">
              <span className="text-xs text-muted-foreground font-mono">#{i + 1}</span>
              <button onClick={() => update('projects', removeItem(data.projects, proj.id))} className="text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
            <Input placeholder="Project name" value={proj.name} className="bg-secondary/50" onChange={e => {
              const updated = [...data.projects]; updated[i] = { ...proj, name: e.target.value }; update('projects', updated);
            }} />
            <Textarea placeholder="Description" value={proj.description} rows={2} className="bg-secondary/50" onChange={e => {
              const updated = [...data.projects]; updated[i] = { ...proj, description: e.target.value }; update('projects', updated);
            }} />
            <Input placeholder="Technologies (comma-separated)" value={proj.technologies} className="bg-secondary/50" onChange={e => {
              const updated = [...data.projects]; updated[i] = { ...proj, technologies: e.target.value }; update('projects', updated);
            }} />
          </div>
        ))}
      </section>

      {/* Skills */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="h-7 w-7 rounded-md bg-primary/10 flex items-center justify-center">
            <Wrench className="h-3.5 w-3.5 text-primary" />
          </div>
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Skills</h2>
        </div>
        <div className="flex gap-2 mb-3">
          <Input placeholder="Add a skill" value={skillInput} onChange={e => setSkillInput(e.target.value)} className="bg-secondary/50"
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addSkill(); }}} />
          <Button variant="outline" size="sm" onClick={addSkill} className="glass-border">Add</Button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {data.skills.map(s => (
            <span key={s} className="inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-md bg-primary/10 text-primary border border-primary/20">
              {s}
              <button onClick={() => update('skills', data.skills.filter(sk => sk !== s))} className="hover:text-destructive transition-colors">×</button>
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}
