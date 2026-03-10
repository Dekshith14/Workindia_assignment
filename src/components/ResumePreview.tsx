import type { ResumeData, TemplateId } from '@/lib/resume-types';

interface Props {
  data: ResumeData;
  template: TemplateId;
}

export function ResumePreview({ data, template }: Props) {
  return (
    <div className="p-6 flex justify-center">
      <div id="resume-preview" className="w-full max-w-[612px] bg-background border border-border p-8 font-resume text-foreground" style={{ minHeight: '792px' }}>
        {template === 'classic' && <ClassicTemplate data={data} />}
        {template === 'modern' && <ModernTemplate data={data} />}
        {template === 'executive' && <ExecutiveTemplate data={data} />}
      </div>
    </div>
  );
}

function ClassicTemplate({ data }: { data: ResumeData }) {
  const { personal } = data;
  return (
    <div className="space-y-5">
      <header className="text-center border-b border-border pb-4">
        <h1 className="text-2xl font-bold">{personal.name || 'Your Name'}</h1>
        <p className="text-xs text-muted-foreground mt-1">
          {[personal.email, personal.phone, personal.location].filter(Boolean).join(' · ')}
        </p>
        {(personal.linkedin || personal.portfolio) && (
          <p className="text-xs text-muted-foreground">
            {[personal.linkedin, personal.portfolio].filter(Boolean).join(' · ')}
          </p>
        )}
      </header>

      {data.summary && (
        <Section title="Summary">
          <p className="text-sm leading-relaxed">{data.summary}</p>
        </Section>
      )}

      {data.experience.length > 0 && (
        <Section title="Experience">
          {data.experience.map(exp => (
            <div key={exp.id} className="mb-3">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-sm">{exp.role}</span>
                <span className="text-xs text-muted-foreground">{exp.duration}</span>
              </div>
              <p className="text-xs text-muted-foreground italic">{exp.company}</p>
              <p className="text-sm mt-1 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </Section>
      )}

      {data.education.length > 0 && (
        <Section title="Education">
          {data.education.map(edu => (
            <div key={edu.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold text-sm">{edu.degree}</span>
                <span className="text-xs text-muted-foreground">{edu.year}</span>
              </div>
              <p className="text-xs text-muted-foreground">{edu.institution}</p>
            </div>
          ))}
        </Section>
      )}

      {data.projects.length > 0 && (
        <Section title="Projects">
          {data.projects.map(proj => (
            <div key={proj.id} className="mb-2">
              <span className="font-semibold text-sm">{proj.name}</span>
              <p className="text-sm leading-relaxed">{proj.description}</p>
              {proj.technologies && <p className="text-xs text-muted-foreground mt-0.5">{proj.technologies}</p>}
            </div>
          ))}
        </Section>
      )}

      {data.skills.length > 0 && (
        <Section title="Skills">
          <p className="text-sm">{data.skills.join(', ')}</p>
        </Section>
      )}
    </div>
  );
}

function ModernTemplate({ data }: { data: ResumeData }) {
  const { personal } = data;
  return (
    <div className="space-y-5">
      <header className="pb-4">
        <h1 className="text-3xl font-bold tracking-tight">{personal.name || 'Your Name'}</h1>
        <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
        </div>
        {(personal.linkedin || personal.portfolio) && (
          <div className="flex gap-3 mt-1 text-xs text-primary">
            {personal.linkedin && <span>{personal.linkedin}</span>}
            {personal.portfolio && <span>{personal.portfolio}</span>}
          </div>
        )}
      </header>

      {data.summary && (
        <div>
          <div className="h-px bg-border mb-3" />
          <p className="text-sm leading-relaxed">{data.summary}</p>
        </div>
      )}

      {data.skills.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Skills</h2>
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map(s => (
              <span key={s} className="px-2 py-0.5 text-xs border border-border rounded-sm">{s}</span>
            ))}
          </div>
        </div>
      )}

      {data.experience.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Experience</h2>
          {data.experience.map(exp => (
            <div key={exp.id} className="mb-4 pl-3 border-l-2 border-primary">
              <div className="flex justify-between">
                <span className="font-semibold text-sm">{exp.role}</span>
                <span className="text-xs text-muted-foreground">{exp.duration}</span>
              </div>
              <p className="text-xs text-muted-foreground">{exp.company}</p>
              <p className="text-sm mt-1 leading-relaxed">{exp.description}</p>
            </div>
          ))}
        </div>
      )}

      {data.education.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Education</h2>
          {data.education.map(edu => (
            <div key={edu.id} className="mb-2">
              <span className="font-semibold text-sm">{edu.degree}</span>
              <span className="text-xs text-muted-foreground ml-2">{edu.institution} · {edu.year}</span>
            </div>
          ))}
        </div>
      )}

      {data.projects.length > 0 && (
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-widest text-primary mb-2">Projects</h2>
          {data.projects.map(proj => (
            <div key={proj.id} className="mb-2">
              <span className="font-semibold text-sm">{proj.name}</span>
              <p className="text-sm leading-relaxed">{proj.description}</p>
              {proj.technologies && <p className="text-xs text-muted-foreground">{proj.technologies}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ExecutiveTemplate({ data }: { data: ResumeData }) {
  const { personal } = data;
  return (
    <div className="space-y-6">
      <header className="bg-secondary p-6 -m-8 mb-0 rounded-t-sm">
        <h1 className="text-2xl font-bold tracking-tight">{personal.name || 'Your Name'}</h1>
        <p className="text-xs text-muted-foreground mt-1">
          {[personal.email, personal.phone, personal.location].filter(Boolean).join(' · ')}
        </p>
        {(personal.linkedin || personal.portfolio) && (
          <p className="text-xs text-primary mt-0.5">
            {[personal.linkedin, personal.portfolio].filter(Boolean).join(' · ')}
          </p>
        )}
      </header>

      {data.summary && (
        <div className="border-l-4 border-primary pl-4 mt-6">
          <p className="text-sm leading-relaxed italic">{data.summary}</p>
        </div>
      )}

      <div className="grid grid-cols-3 gap-6 mt-4">
        <div className="col-span-2 space-y-5">
          {data.experience.length > 0 && (
            <Section title="Experience">
              {data.experience.map(exp => (
                <div key={exp.id} className="mb-4">
                  <span className="font-bold text-sm">{exp.role}</span>
                  <span className="text-xs text-muted-foreground ml-2">· {exp.duration}</span>
                  <p className="text-xs font-medium text-primary">{exp.company}</p>
                  <p className="text-sm mt-1 leading-relaxed">{exp.description}</p>
                </div>
              ))}
            </Section>
          )}
          {data.projects.length > 0 && (
            <Section title="Projects">
              {data.projects.map(proj => (
                <div key={proj.id} className="mb-3">
                  <span className="font-semibold text-sm">{proj.name}</span>
                  <p className="text-sm leading-relaxed">{proj.description}</p>
                  {proj.technologies && <p className="text-xs text-muted-foreground">{proj.technologies}</p>}
                </div>
              ))}
            </Section>
          )}
        </div>
        <div className="space-y-5">
          {data.education.length > 0 && (
            <Section title="Education">
              {data.education.map(edu => (
                <div key={edu.id} className="mb-2">
                  <p className="font-semibold text-sm">{edu.degree}</p>
                  <p className="text-xs text-muted-foreground">{edu.institution}</p>
                  <p className="text-xs text-muted-foreground">{edu.year}</p>
                </div>
              ))}
            </Section>
          )}
          {data.skills.length > 0 && (
            <Section title="Skills">
              <ul className="space-y-0.5">
                {data.skills.map(s => (
                  <li key={s} className="text-sm">• {s}</li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">{title}</h2>
      {children}
    </div>
  );
}
