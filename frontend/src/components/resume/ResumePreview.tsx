import type { ResumeData, TemplateId } from '@/lib/resume-types';

interface Props {
  data: ResumeData;
  template: TemplateId;
}

export function ResumePreview({ data, template }: Props) {
  return (
    <div className="resume-editor-preview flex justify-center items-start min-h-full">
      <div className="shadow-2xl">
        <div
          id="resume-preview"
          className="resume-page font-resume text-gray-900"
        >
          {template === 'classic' && <ClassicTemplate data={data} />}
          {template === 'modern' && <ModernTemplate data={data} />}
          {template === 'minimal' && <MinimalTemplate data={data} />}
          {template === 'creative' && <CreativeTemplate data={data} />}
          {template === 'tech' && <TechTemplate data={data} />}
          {template === 'executive' && <ExecutiveTemplate data={data} />}
        </div>
      </div>
    </div>
  );
}

function ClassicTemplate({ data }: { data: ResumeData }) {
  const { personal } = data;
  return (
    <div style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
      <header className="resume-header">
        <h1 className="resume-name">{personal.name || 'Your Name'}</h1>
        <p className="resume-contact mt-2">
          {[personal.email, personal.phone, personal.location].filter(Boolean).join(' · ')}
        </p>
        {(personal.linkedin || personal.portfolio) && (
          <p className="resume-contact mt-1">
            {[personal.linkedin, personal.portfolio].filter(Boolean).join(' · ')}
          </p>
        )}
      </header>
      
      {data.summary && (
        <div style={{ marginBottom: '24px' }}>
          <p style={{ fontSize: '14px', lineHeight: 1.6 }}>{data.summary}</p>
        </div>
      )}

      <div className="resume-grid">
        <div className="left-col">
          {data.experience.length > 0 && (
            <ClassicSectionBlock title="Experience">
              {data.experience.map(exp => (
                <div key={exp.id} style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 600, fontSize: '15px', color: '#0f172a' }}>{exp.role}</span>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{exp.duration}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#475569', fontWeight: 500 }}>{exp.company}</p>
                  <p style={{ fontSize: '13px', lineHeight: 1.6, marginTop: '6px', color: '#334155' }}>{exp.description}</p>
                </div>
              ))}
            </ClassicSectionBlock>
          )}

          {data.projects.length > 0 && (
            <ClassicSectionBlock title="Projects">
              {data.projects.map(proj => (
                <div key={proj.id} style={{ marginBottom: '16px' }}>
                  <span style={{ fontWeight: 600, fontSize: '15px', color: '#0f172a' }}>{proj.name}</span>
                  <p style={{ fontSize: '13px', lineHeight: 1.6, marginTop: '4px', color: '#334155' }}>{proj.description}</p>
                  {proj.technologies && <p style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{proj.technologies}</p>}
                </div>
              ))}
            </ClassicSectionBlock>
          )}
        </div>

        <div className="right-col">
          {data.education.length > 0 && (
            <ClassicSectionBlock title="Education">
              {data.education.map(edu => (
                <div key={edu.id} style={{ marginBottom: '16px' }}>
                  <span style={{ fontWeight: 600, fontSize: '14px', display: 'block', color: '#0f172a' }}>{edu.degree}</span>
                  <p style={{ fontSize: '13px', color: '#475569' }}>{edu.institution}</p>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>{edu.year}</p>
                </div>
              ))}
            </ClassicSectionBlock>
          )}

          {data.skills.length > 0 && (
            <ClassicSectionBlock title="Skills">
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {data.skills.map(s => (
                  <span key={s} style={{ fontSize: '12px', padding: '4px 10px', background: '#f1f5f9', borderRadius: '4px', color: '#334155', fontWeight: 500 }}>
                    {s}
                  </span>
                ))}
              </div>
            </ClassicSectionBlock>
          )}
        </div>
      </div>
    </div>
  );
}

function ClassicSectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <h2 style={{ fontSize: '15px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: '#0f172a', borderBottom: '2px solid #e2e8f0', paddingBottom: '6px', marginBottom: '16px' }}>{title}</h2>
      {children}
    </div>
  );
}

/* ─── MODERN ────────────────────────────── */
function ModernTemplate({ data }: { data: ResumeData }) {
  const { personal } = data;
  const accent = '#2ba89e';
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <header style={{ paddingBottom: '16px' }}>
        <h1 style={{ fontSize: '30px', fontWeight: 700, letterSpacing: '-0.5px', margin: 0 }}>{personal.name || 'Your Name'}</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '8px', fontSize: '11px', color: '#888' }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
        </div>
        {(personal.linkedin || personal.portfolio) && (
          <div style={{ display: 'flex', gap: '12px', marginTop: '4px', fontSize: '11px', color: accent }}>
            {personal.linkedin && <span>{personal.linkedin}</span>}
            {personal.portfolio && <span>{personal.portfolio}</span>}
          </div>
        )}
      </header>
      {data.summary && <><hr style={{ border: 'none', borderTop: '1px solid #e0e0e0', margin: '0 0 12px' }} /><p style={{ fontSize: '13px', lineHeight: 1.7 }}>{data.summary}</p></>}
      {data.skills.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <h2 style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', color: accent, marginBottom: '8px' }}>Skills</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {data.skills.map(s => <span key={s} style={{ padding: '2px 8px', fontSize: '11px', border: `1px solid ${accent}40`, borderRadius: '3px' }}>{s}</span>)}
          </div>
        </div>
      )}
      {data.experience.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <h2 style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', color: accent, marginBottom: '8px' }}>Experience</h2>
          {data.experience.map(exp => (
            <div key={exp.id} style={{ marginBottom: '14px', paddingLeft: '12px', borderLeft: `3px solid ${accent}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>{exp.role}</span>
                <span style={{ fontSize: '11px', color: '#888' }}>{exp.duration}</span>
              </div>
              <p style={{ fontSize: '12px', color: '#888' }}>{exp.company}</p>
              <p style={{ fontSize: '13px', lineHeight: 1.7, marginTop: '4px' }}>{exp.description}</p>
            </div>
          ))}
        </div>
      )}
      {data.education.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <h2 style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', color: accent, marginBottom: '8px' }}>Education</h2>
          {data.education.map(edu => (
            <div key={edu.id} style={{ marginBottom: '8px' }}>
              <span style={{ fontWeight: 600, fontSize: '14px' }}>{edu.degree}</span>
              <span style={{ fontSize: '11px', color: '#888', marginLeft: '8px' }}>{edu.institution} · {edu.year}</span>
            </div>
          ))}
        </div>
      )}
      {data.projects.length > 0 && (
        <div style={{ marginTop: '16px' }}>
          <h2 style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', color: accent, marginBottom: '8px' }}>Projects</h2>
          {data.projects.map(proj => (
            <div key={proj.id} style={{ marginBottom: '10px' }}>
              <span style={{ fontWeight: 600, fontSize: '14px' }}>{proj.name}</span>
              <p style={{ fontSize: '13px', lineHeight: 1.7 }}>{proj.description}</p>
              {proj.technologies && <p style={{ fontSize: '11px', color: '#888' }}>{proj.technologies}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── MINIMAL ───────────────────────────── */
function MinimalTemplate({ data }: { data: ResumeData }) {
  const { personal } = data;
  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", lineHeight: 1.8 }}>
      <header style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 500, letterSpacing: '3px', textTransform: 'uppercase', margin: 0 }}>{personal.name || 'YOUR NAME'}</h1>
        <p style={{ fontSize: '11px', color: '#999', marginTop: '6px', letterSpacing: '1px' }}>
          {[personal.email, personal.phone, personal.location].filter(Boolean).join('  ·  ')}
        </p>
      </header>
      {data.summary && <><p style={{ fontSize: '13px', color: '#555' }}>{data.summary}</p><hr style={{ border: 'none', borderTop: '1px solid #eee', margin: '16px 0' }} /></>}
      {data.experience.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '3px', color: '#999', marginBottom: '12px' }}>Experience</h2>
          {data.experience.map(exp => (
            <div key={exp.id} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 500, fontSize: '14px' }}>{exp.role}</span>
                <span style={{ fontSize: '11px', color: '#aaa' }}>{exp.duration}</span>
              </div>
              <p style={{ fontSize: '12px', color: '#999' }}>{exp.company}</p>
              <p style={{ fontSize: '13px', marginTop: '4px' }}>{exp.description}</p>
            </div>
          ))}
        </div>
      )}
      {data.education.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '3px', color: '#999', marginBottom: '12px' }}>Education</h2>
          {data.education.map(edu => (
            <div key={edu.id} style={{ marginBottom: '8px' }}>
              <span style={{ fontWeight: 500, fontSize: '14px' }}>{edu.degree}</span>
              <span style={{ fontSize: '11px', color: '#999', marginLeft: '8px' }}>{edu.institution}, {edu.year}</span>
            </div>
          ))}
        </div>
      )}
      {data.projects.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '3px', color: '#999', marginBottom: '12px' }}>Projects</h2>
          {data.projects.map(proj => (
            <div key={proj.id} style={{ marginBottom: '10px' }}>
              <span style={{ fontWeight: 500, fontSize: '14px' }}>{proj.name}</span>
              <p style={{ fontSize: '13px' }}>{proj.description}</p>
            </div>
          ))}
        </div>
      )}
      {data.skills.length > 0 && (
        <div>
          <h2 style={{ fontSize: '11px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '3px', color: '#999', marginBottom: '8px' }}>Skills</h2>
          <p style={{ fontSize: '13px' }}>{data.skills.join('  ·  ')}</p>
        </div>
      )}
    </div>
  );
}

/* ─── CREATIVE ──────────────────────────── */
function CreativeTemplate({ data }: { data: ResumeData }) {
  const { personal } = data;
  const pri = '#e08a3a';
  return (
    <div style={{ fontFamily: "'Playfair Display', Georgia, serif", display: 'flex', gap: '24px' }}>
      {/* Sidebar */}
      <div style={{ width: '35%', background: '#f5f0eb', padding: '24px 16px', borderRadius: '4px', minHeight: '100%' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: pri, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '24px', fontWeight: 700, marginBottom: '16px' }}>
          {(personal.name || 'U')[0]}
        </div>
        <h2 style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: pri, marginBottom: '8px', fontWeight: 600 }}>Contact</h2>
        <div style={{ fontSize: '11px', lineHeight: 2, color: '#555' }}>
          {personal.email && <p>{personal.email}</p>}
          {personal.phone && <p>{personal.phone}</p>}
          {personal.location && <p>{personal.location}</p>}
          {personal.linkedin && <p style={{ color: pri }}>{personal.linkedin}</p>}
          {personal.portfolio && <p style={{ color: pri }}>{personal.portfolio}</p>}
        </div>
        {data.skills.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h2 style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: pri, marginBottom: '8px', fontWeight: 600 }}>Skills</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
              {data.skills.map(s => <span key={s} style={{ fontSize: '10px', padding: '2px 6px', background: `${pri}18`, borderRadius: '3px', color: '#333' }}>{s}</span>)}
            </div>
          </div>
        )}
        {data.education.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <h2 style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: pri, marginBottom: '8px', fontWeight: 600 }}>Education</h2>
            {data.education.map(edu => (
              <div key={edu.id} style={{ marginBottom: '8px' }}>
                <p style={{ fontWeight: 600, fontSize: '12px' }}>{edu.degree}</p>
                <p style={{ fontSize: '11px', color: '#888' }}>{edu.institution}</p>
                <p style={{ fontSize: '10px', color: '#aaa' }}>{edu.year}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Main */}
      <div style={{ flex: 1 }}>
        <h1 style={{ fontSize: '28px', fontWeight: 700, margin: '0 0 4px' }}>{personal.name || 'Your Name'}</h1>
        {data.summary && <p style={{ fontSize: '13px', lineHeight: 1.7, color: '#555', borderLeft: `3px solid ${pri}`, paddingLeft: '12px', margin: '12px 0 20px' }}>{data.summary}</p>}
        {data.experience.length > 0 && (
          <div>
            <h2 style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: pri, marginBottom: '10px', fontWeight: 600 }}>Experience</h2>
            {data.experience.map(exp => (
              <div key={exp.id} style={{ marginBottom: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: '14px' }}>{exp.role}</span>
                  <span style={{ fontSize: '11px', color: '#aaa' }}>{exp.duration}</span>
                </div>
                <p style={{ fontSize: '12px', color: pri, fontWeight: 500 }}>{exp.company}</p>
                <p style={{ fontSize: '13px', lineHeight: 1.7, marginTop: '4px' }}>{exp.description}</p>
              </div>
            ))}
          </div>
        )}
        {data.projects.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <h2 style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: pri, marginBottom: '10px', fontWeight: 600 }}>Projects</h2>
            {data.projects.map(proj => (
              <div key={proj.id} style={{ marginBottom: '10px' }}>
                <span style={{ fontWeight: 600, fontSize: '14px' }}>{proj.name}</span>
                <p style={{ fontSize: '13px', lineHeight: 1.7 }}>{proj.description}</p>
                {proj.technologies && <p style={{ fontSize: '11px', color: '#888' }}>{proj.technologies}</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── TECH ──────────────────────────────── */
function TechTemplate({ data }: { data: ResumeData }) {
  const { personal } = data;
  const accent = '#2ba89e';
  return (
    <div style={{ fontFamily: "'JetBrains Mono', 'DM Sans', monospace" }}>
      <header style={{ background: '#0d1117', color: '#e6edf3', margin: '-32px -32px 20px', padding: '24px 32px', borderRadius: '4px 4px 0 0' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0, fontFamily: "'JetBrains Mono', monospace" }}>{personal.name || 'Your Name'}</h1>
        <p style={{ fontSize: '11px', color: '#8b949e', marginTop: '6px', fontFamily: "'JetBrains Mono', monospace" }}>
          {[personal.email, personal.phone, personal.location].filter(Boolean).join(' // ')}
        </p>
        {(personal.linkedin || personal.portfolio) && (
          <p style={{ fontSize: '11px', color: accent, marginTop: '4px' }}>
            {[personal.linkedin, personal.portfolio].filter(Boolean).join(' // ')}
          </p>
        )}
      </header>
      {data.summary && (
        <div style={{ padding: '12px', background: '#f6f8fa', borderRadius: '4px', marginBottom: '16px', borderLeft: `3px solid ${accent}` }}>
          <p style={{ fontSize: '12px', lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>{data.summary}</p>
        </div>
      )}
      {data.skills.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '11px', fontWeight: 700, color: accent, marginBottom: '8px' }}>{'// TECH_STACK'}</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {data.skills.map(s => <span key={s} style={{ padding: '2px 8px', fontSize: '10px', background: '#0d111712', border: '1px solid #d0d7de', borderRadius: '3px', fontFamily: "'JetBrains Mono', monospace" }}>{s}</span>)}
          </div>
        </div>
      )}
      {data.experience.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '11px', fontWeight: 700, color: accent, marginBottom: '8px' }}>{'// EXPERIENCE'}</h2>
          {data.experience.map(exp => (
            <div key={exp.id} style={{ marginBottom: '14px', paddingLeft: '12px', borderLeft: '2px solid #d0d7de' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 600, fontSize: '13px', fontFamily: "'DM Sans', sans-serif" }}>{exp.role}</span>
                <span style={{ fontSize: '10px', color: '#888', fontFamily: "'JetBrains Mono', monospace" }}>{exp.duration}</span>
              </div>
              <p style={{ fontSize: '11px', color: accent }}>{exp.company}</p>
              <p style={{ fontSize: '12px', lineHeight: 1.7, marginTop: '4px', fontFamily: "'DM Sans', sans-serif" }}>{exp.description}</p>
            </div>
          ))}
        </div>
      )}
      {data.education.length > 0 && (
        <div style={{ marginBottom: '16px' }}>
          <h2 style={{ fontSize: '11px', fontWeight: 700, color: accent, marginBottom: '8px' }}>{'// EDUCATION'}</h2>
          {data.education.map(edu => (
            <div key={edu.id} style={{ marginBottom: '8px' }}>
              <span style={{ fontWeight: 600, fontSize: '13px', fontFamily: "'DM Sans', sans-serif" }}>{edu.degree}</span>
              <span style={{ fontSize: '11px', color: '#888', marginLeft: '8px' }}>{edu.institution} · {edu.year}</span>
            </div>
          ))}
        </div>
      )}
      {data.projects.length > 0 && (
        <div>
          <h2 style={{ fontSize: '11px', fontWeight: 700, color: accent, marginBottom: '8px' }}>{'// PROJECTS'}</h2>
          {data.projects.map(proj => (
            <div key={proj.id} style={{ marginBottom: '10px' }}>
              <span style={{ fontWeight: 600, fontSize: '13px', fontFamily: "'DM Sans', sans-serif" }}>{proj.name}</span>
              <p style={{ fontSize: '12px', lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>{proj.description}</p>
              {proj.technologies && <p style={{ fontSize: '10px', color: accent, fontFamily: "'JetBrains Mono', monospace" }}>{proj.technologies}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── EXECUTIVE ─────────────────────────── */
function ExecutiveTemplate({ data }: { data: ResumeData }) {
  const { personal } = data;
  return (
    <div style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
      <header style={{ background: '#1a1a2e', color: '#e8e3db', padding: '24px 32px', margin: '-32px -32px 20px', borderRadius: '4px 4px 0 0' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>{personal.name || 'Your Name'}</h1>
        <p style={{ fontSize: '11px', color: '#a0a0b0', marginTop: '6px' }}>
          {[personal.email, personal.phone, personal.location].filter(Boolean).join(' · ')}
        </p>
        {(personal.linkedin || personal.portfolio) && (
          <p style={{ fontSize: '11px', color: '#e08a3a', marginTop: '4px' }}>
            {[personal.linkedin, personal.portfolio].filter(Boolean).join(' · ')}
          </p>
        )}
      </header>
      {data.summary && (
        <div style={{ borderLeft: '4px solid #e08a3a', paddingLeft: '16px', marginBottom: '20px' }}>
          <p style={{ fontSize: '13px', lineHeight: 1.7, fontStyle: 'italic' }}>{data.summary}</p>
        </div>
      )}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div>
          {data.experience.length > 0 && (
            <SectionBlock title="Experience">
              {data.experience.map(exp => (
                <div key={exp.id} style={{ marginBottom: '14px' }}>
                  <span style={{ fontWeight: 700, fontSize: '14px' }}>{exp.role}</span>
                  <span style={{ fontSize: '11px', color: '#888', marginLeft: '8px' }}>· {exp.duration}</span>
                  <p style={{ fontSize: '12px', fontWeight: 500, color: '#e08a3a' }}>{exp.company}</p>
                  <p style={{ fontSize: '13px', lineHeight: 1.7, marginTop: '4px' }}>{exp.description}</p>
                </div>
              ))}
            </SectionBlock>
          )}
          {data.projects.length > 0 && (
            <SectionBlock title="Projects">
              {data.projects.map(proj => (
                <div key={proj.id} style={{ marginBottom: '10px' }}>
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>{proj.name}</span>
                  <p style={{ fontSize: '13px', lineHeight: 1.7 }}>{proj.description}</p>
                  {proj.technologies && <p style={{ fontSize: '11px', color: '#888' }}>{proj.technologies}</p>}
                </div>
              ))}
            </SectionBlock>
          )}
        </div>
        <div>
          {data.education.length > 0 && (
            <SectionBlock title="Education">
              {data.education.map(edu => (
                <div key={edu.id} style={{ marginBottom: '10px' }}>
                  <p style={{ fontWeight: 600, fontSize: '13px' }}>{edu.degree}</p>
                  <p style={{ fontSize: '11px', color: '#888' }}>{edu.institution}</p>
                  <p style={{ fontSize: '11px', color: '#aaa' }}>{edu.year}</p>
                </div>
              ))}
            </SectionBlock>
          )}
          {data.skills.length > 0 && (
            <SectionBlock title="Skills">
              <ul style={{ margin: 0, paddingLeft: '16px' }}>
                {data.skills.map(s => <li key={s} style={{ fontSize: '12px', marginBottom: '2px' }}>{s}</li>)}
              </ul>
            </SectionBlock>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <h2 style={{ fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px', color: '#999', marginBottom: '10px' }}>{title}</h2>
      {children}
    </div>
  );
}
