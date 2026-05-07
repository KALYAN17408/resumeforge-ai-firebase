import React, { memo } from 'react';
import './ResumePreview.css';

function ResumePreviewComponent({ data }) {
  const { template = 'modern-fresher' } = data;

  switch (template) {
    case 'modern-fresher': return <ModernFresherTemplate data={data} />;
    case 'modern':         return <ModernTemplate data={data} />;
    case 'minimal':        return <MinimalTemplate data={data} />;
    case 'executive':      return <ExecutiveTemplate data={data} />;
    case 'creative':       return <CreativeTemplate data={data} />;
    case 'sidebar':        return <SidebarTemplate data={data} />;
    default:               return <ClassicTemplate data={data} />;
  }
}

export default memo(ResumePreviewComponent);

function safe(arr) { return Array.isArray(arr) ? arr : []; }

function BulletLines({ text }) {
  if (!text || !text.trim()) return null;
  const lines = text.split('\n').map(l => l.replace(/^[•\-\*]\s*/, '').trim()).filter(Boolean);
  if (!lines.length) return null;
  return (
    <ul className="rp-bullets">
      {lines.map((line, i) => <li key={i}>{line}</li>)}
    </ul>
  );
}

function ExtLink({ href, children }) {
  if (!href) return null;
  // Standardize the URL for clicking
  const url = href.startsWith('http') ? href : `https://${href}`;
  // Display text without https:// for cleaner look if no children provided
  const display = children || href.replace(/^https?:\/\/(www\.)?/, '');
  return <a href={url} target="_blank" rel="noopener noreferrer" className="rp-link">{display}</a>;
}

/* ══ 1. MODERN FRESHER — Harvard Style ══ */
function ModernFresherTemplate({ data }) {
  const { personalInfo: p = {}, summary } = data;
  const experience  = safe(data.experience);
  const education   = safe(data.education);
  const skills      = safe(data.skills);
  const projects    = safe(data.projects);

  return (
    <div className="rp rp-harvard">

      {/* ── Name & Contact Header ── */}
      <div className="hv-header">
        <h1 className="hv-name">{p.name || 'First Last'}</h1>
        <div className="hv-contact">
          {[p.phone, p.email, p.location].filter(Boolean).join(' | ')}
          {(p.linkedin || p.website) && (
            <div style={{ marginTop: '2pt' }}>
              {p.linkedin && <ExtLink href={p.linkedin}>LinkedIn</ExtLink>}
              {p.linkedin && p.website && ' | '}
              {p.website && <ExtLink href={p.website}>Portfolio</ExtLink>}
            </div>
          )}
        </div>
      </div>

      {/* ── Education ── */}
      {education.length > 0 && (
        <div className="hv-section">
          <div className="hv-section-title">EDUCATION</div>
          <div className="hv-divider" />
          {education.map((e, i) => (
            <div className="hv-edu-item" key={`edu-${i}`}>
              <div className="hv-row">
                <strong className="hv-org">{e.school}</strong>
                <span className="hv-date">{e.year}</span>
              </div>
              <div className="hv-row">
                <span className="hv-italic">{e.degree}{e.gpa ? ` — GPA: ${e.gpa}` : ''}</span>
                <span className="hv-date">{e.location || ''}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Experience ── */}
      {experience.length > 0 && (
        <div className="hv-section">
          <div className="hv-section-title">EXPERIENCE</div>
          <div className="hv-divider" />
          {experience.map((e, i) => (
            <div className="hv-exp-item" key={`exp-${i}`}>
              <div className="hv-row">
                <strong className="hv-org">{e.role}</strong>
                <span className="hv-date">{e.duration}</span>
              </div>
              <div className="hv-row">
                <span className="hv-italic">{e.company}</span>
                <span className="hv-date">{e.location || ''}</span>
              </div>
              <BulletLines text={e.description} />
            </div>
          ))}
        </div>
      )}

      {/* ── Projects ── */}
      {projects.length > 0 && (
        <div className="hv-section">
          <div className="hv-section-title">PROJECTS</div>
          <div className="hv-divider" />
          {projects.map((pr, i) => (
            <div className="hv-proj-item" key={`proj-${i}`}>
              <div className="hv-proj-header">
                <strong className="hv-org">{pr.name}</strong>
                {pr.tech && <span className="hv-proj-tech"> | {pr.tech}</span>}
              </div>
              <BulletLines text={pr.description} />
            </div>
          ))}
        </div>
      )}

      {/* ── Skills ── */}
      {skills.length > 0 && (
        <div className="hv-section">
          <div className="hv-section-title">SKILLS</div>
          <div className="hv-divider" />
          <div className="hv-skills-block">
            {skills.join(' · ')}
          </div>
        </div>
      )}

      {/* ── Summary / Objective (optional) ── */}
      {summary && (
        <div className="hv-section">
          <div className="hv-section-title">OBJECTIVE</div>
          <div className="hv-divider" />
          <p className="hv-summary">{summary}</p>
        </div>
      )}
    </div>
  );
}
/* ══ 2. CLASSIC ══ */
function ClassicTemplate({ data }) {
  const { personalInfo: p = {}, summary } = data;
  const experience = safe(data.experience);
  const education  = safe(data.education);
  const skills     = safe(data.skills);
  const projects   = safe(data.projects);
  return (
    <div className="rp rp-classic">
      <div className="rpc-header">
        <h1>{p.name || 'Your Name'}</h1>
        {p.title && <div className="rpc-title">{p.title}</div>}
        <div className="rpc-contact">
          {p.email    && <span>{p.email}</span>}
          {p.phone    && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {p.linkedin && <span><ExtLink href={p.linkedin}>{p.linkedin}</ExtLink></span>}
          {p.website  && <span><ExtLink href={p.website}>{p.website}</ExtLink></span>}
        </div>
      </div>
      {summary && (
        <div className="rp-section">
          <div className="rp-section-title">Professional Summary</div>
          <p className="rp-text">{summary}</p>
        </div>
      )}
      {experience.length > 0 && (
        <div className="rp-section">
          <div className="rp-section-title">Experience</div>
          {experience.map((e, i) => (
            <div className="rp-item" key={`exp-${i}`}>
              <div className="rp-item-header">
                <div><strong>{e.role}</strong>{e.company ? ` — ${e.company}` : ''}</div>
                <div className="rp-date">{e.duration}</div>
              </div>
              <BulletLines text={e.description} />
            </div>
          ))}
        </div>
      )}
      {education.length > 0 && (
        <div className="rp-section">
          <div className="rp-section-title">Education</div>
          {education.map((e, i) => (
            <div className="rp-item" key={`edu-${i}`}>
              <div className="rp-item-header">
                <div><strong>{e.degree}</strong>{e.school ? ` — ${e.school}` : ''}</div>
                <div className="rp-date">{e.year}{e.gpa ? ` · ${e.gpa}` : ''}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {skills.length > 0 && (
        <div className="rp-section">
          <div className="rp-section-title">Skills</div>
          <div className="rp-skills-wrap">
            {skills.map((s, i) => <span className="rp-skill" key={`skill-${i}-${s}`}>{s}</span>)}
          </div>
        </div>
      )}
      {projects.length > 0 && (
        <div className="rp-section">
          <div className="rp-section-title">Projects</div>
          {projects.map((pr, i) => (
            <div className="rp-item" key={`proj-${i}`}>
              <div className="rp-item-header">
                <div><strong>{pr.name}</strong>{pr.tech ? ` · ${pr.tech}` : ''}</div>
                {pr.link && <ExtLink href={pr.link}>{pr.link}</ExtLink>}
              </div>
              <BulletLines text={pr.description} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══ 3. MODERN EDGE ══ */
function ModernTemplate({ data }) {
  const { personalInfo: p = {}, summary } = data;
  const experience = safe(data.experience);
  const education  = safe(data.education);
  const skills     = safe(data.skills);
  const projects   = safe(data.projects);
  return (
    <div className="rp rp-modern">
      <div className="rpm-header">
        <div className="rpm-accent-bar" />
        <div className="rpm-name-block">
          <h1>{p.name || 'Your Name'}</h1>
          {p.title && <div className="rpm-title">{p.title}</div>}
        </div>
        <div className="rpm-contact">
          {p.email    && <div>{p.email}</div>}
          {p.phone    && <div>{p.phone}</div>}
          {p.location && <div>{p.location}</div>}
          {p.linkedin && <div><ExtLink href={p.linkedin}>{p.linkedin}</ExtLink></div>}
          {p.website  && <div><ExtLink href={p.website}>{p.website}</ExtLink></div>}
        </div>
      </div>
      {summary && (
        <div className="rp-section rpm-section">
          <div className="rpm-section-title">About</div>
          <p className="rp-text">{summary}</p>
        </div>
      )}
      {experience.length > 0 && (
        <div className="rp-section rpm-section">
          <div className="rpm-section-title">Experience</div>
          {experience.map((e, i) => (
            <div className="rpm-item" key={`exp-${i}`}>
              <div className="rpm-dot" />
              <div className="rpm-item-body">
                <div className="rpm-item-header">
                  <strong>{e.role}</strong>
                  <span className="rpm-company">{e.company}</span>
                  <span className="rp-date">{e.duration}</span>
                </div>
                <BulletLines text={e.description} />
              </div>
            </div>
          ))}
        </div>
      )}
      {education.length > 0 && (
        <div className="rp-section rpm-section">
          <div className="rpm-section-title">Education</div>
          {education.map((e, i) => (
            <div className="rpm-item" key={`edu-${i}`}>
              <div className="rpm-dot" />
              <div className="rpm-item-body">
                <div className="rpm-item-header">
                  <strong>{e.degree}</strong>
                  <span className="rpm-company">{e.school}</span>
                  <span className="rp-date">{e.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {skills.length > 0 && (
        <div className="rp-section rpm-section">
          <div className="rpm-section-title">Skills</div>
          <div className="rp-skills-wrap">
            {skills.map((s, i) => <span className="rpm-skill" key={`skill-${i}-${s}`}>{s}</span>)}
          </div>
        </div>
      )}
      {projects.length > 0 && (
        <div className="rp-section rpm-section">
          <div className="rpm-section-title">Projects</div>
          {projects.map((pr, i) => (
            <div className="rpm-item" key={`proj-${i}`}>
              <div className="rpm-dot" />
              <div className="rpm-item-body">
                <div className="rpm-item-header">
                  <strong>{pr.name}</strong>
                  {pr.tech && <span className="rpm-company">{pr.tech}</span>}
                  {pr.link && <ExtLink href={pr.link}>{pr.link}</ExtLink>}
                </div>
                <BulletLines text={pr.description} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══ 4. MINIMAL ══ */
function MinimalTemplate({ data }) {
  const { personalInfo: p = {}, summary } = data;
  const experience = safe(data.experience);
  const education  = safe(data.education);
  const skills     = safe(data.skills);
  const projects   = safe(data.projects);
  return (
    <div className="rp rp-minimal">
      <div className="rpmn-header">
        <h1>{p.name || 'Your Name'}</h1>
        {p.title && <div className="rpmn-title">{p.title}</div>}
        <div className="rpmn-contact">
          {[p.email, p.phone, p.location].filter(Boolean).join(' · ')}
          {p.linkedin && <> · <ExtLink href={p.linkedin}>{p.linkedin}</ExtLink></>}
          {p.website  && <> · <ExtLink href={p.website}>{p.website}</ExtLink></>}
        </div>
      </div>
      {summary && <><div className="rpmn-divider" /><p className="rp-text rpmn-summary">{summary}</p></>}
      {experience.length > 0 && (
        <>
          <div className="rpmn-divider" />
          <div className="rpmn-section-title">EXPERIENCE</div>
          {experience.map((e, i) => (
            <div className="rpmn-item" key={`exp-${i}`}>
              <div className="rpmn-item-top"><span className="rpmn-role">{e.role}</span><span className="rpmn-date">{e.duration}</span></div>
              <div className="rpmn-company">{e.company}</div>
              <BulletLines text={e.description} />
            </div>
          ))}
        </>
      )}
      {education.length > 0 && (
        <>
          <div className="rpmn-divider" />
          <div className="rpmn-section-title">EDUCATION</div>
          {education.map((e, i) => (
            <div className="rpmn-item" key={`edu-${i}`}>
              <div className="rpmn-item-top"><span className="rpmn-role">{e.degree}</span><span className="rpmn-date">{e.year}</span></div>
              <div className="rpmn-company">{e.school}{e.gpa ? ` · ${e.gpa}` : ''}</div>
            </div>
          ))}
        </>
      )}
      {skills.length > 0 && (
        <>
          <div className="rpmn-divider" />
          <div className="rpmn-section-title">SKILLS</div>
          <p className="rp-text">{skills.join(' · ')}</p>
        </>
      )}
      {projects.length > 0 && (
        <>
          <div className="rpmn-divider" />
          <div className="rpmn-section-title">PROJECTS</div>
          {projects.map((pr, i) => (
            <div className="rpmn-item" key={`proj-${i}`}>
              <div className="rpmn-item-top">
                <span className="rpmn-role">{pr.name}</span>
                {pr.link && <ExtLink href={pr.link}>{pr.link}</ExtLink>}
              </div>
              {pr.tech && <div className="rpmn-company">{pr.tech}</div>}
              <BulletLines text={pr.description} />
            </div>
          ))}
        </>
      )}
    </div>
  );
}

/* ══ 5. EXECUTIVE ══ */
function ExecutiveTemplate({ data }) {
  const { personalInfo: p = {}, summary } = data;
  const experience = safe(data.experience);
  const education  = safe(data.education);
  const skills     = safe(data.skills);
  const projects   = safe(data.projects);
  return (
    <div className="rp rp-executive">
      <div className="rpe-header">
        <h1>{p.name || 'Your Name'}</h1>
        {p.title && <div className="rpe-title">{p.title}</div>}
        <div className="rpe-divider" />
        <div className="rpe-contact">
          {[p.email, p.phone, p.location].filter(Boolean).map((c, i) => <span key={i}>{c}</span>)}
          {p.linkedin && <span><ExtLink href={p.linkedin}>{p.linkedin}</ExtLink></span>}
          {p.website  && <span><ExtLink href={p.website}>{p.website}</ExtLink></span>}
        </div>
      </div>
      {summary && (
        <div className="rpe-section">
          <div className="rpe-section-title">Executive Summary</div>
          <p className="rp-text">{summary}</p>
        </div>
      )}
      {experience.length > 0 && (
        <div className="rpe-section">
          <div className="rpe-section-title">Professional Experience</div>
          {experience.map((e, i) => (
            <div className="rpe-item" key={`exp-${i}`}>
              <div className="rpe-item-header">
                <div className="rpe-role">{e.role}</div>
                <div className="rpe-company-date">{e.company} · {e.duration}</div>
              </div>
              <BulletLines text={e.description} />
            </div>
          ))}
        </div>
      )}
      {education.length > 0 && (
        <div className="rpe-section">
          <div className="rpe-section-title">Education</div>
          {education.map((e, i) => (
            <div className="rpe-item" key={`edu-${i}`}>
              <div className="rpe-item-header">
                <div className="rpe-role">{e.degree}</div>
                <div className="rpe-company-date">{e.school} · {e.year}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {skills.length > 0 && (
        <div className="rpe-section">
          <div className="rpe-section-title">Core Competencies</div>
          <div className="rpe-skills">{skills.map((s, i) => <span key={`skill-${i}-${s}`}>{s}</span>)}</div>
        </div>
      )}
      {projects.length > 0 && (
        <div className="rpe-section">
          <div className="rpe-section-title">Notable Projects</div>
          {projects.map((pr, i) => (
            <div className="rpe-item" key={`proj-${i}`}>
              <div className="rpe-item-header">
                <div className="rpe-role">{pr.name}</div>
                {pr.tech && <div className="rpe-company-date">{pr.tech}</div>}
              </div>
              <BulletLines text={pr.description} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══ 6. CREATIVE ══ */
function CreativeTemplate({ data }) {
  const { personalInfo: p = {}, summary } = data;
  const experience = safe(data.experience);
  const education  = safe(data.education);
  const skills     = safe(data.skills);
  const projects   = safe(data.projects);
  return (
    <div className="rp rp-creative">
      <div className="rpct-header">
        <div className="rpct-name-block">
          <h1>{p.name || 'Your Name'}</h1>
          {p.title && <div className="rpct-title">{p.title}</div>}
        </div>
        <div className="rpct-contact">
          {p.email    && <div>{p.email}</div>}
          {p.phone    && <div>{p.phone}</div>}
          {p.location && <div>{p.location}</div>}
          {p.linkedin && <div><ExtLink href={p.linkedin}>{p.linkedin}</ExtLink></div>}
          {p.website  && <div><ExtLink href={p.website}>{p.website}</ExtLink></div>}
        </div>
      </div>
      {summary && (
        <div className="rpct-section">
          <div className="rpct-section-label">About Me</div>
          <p className="rp-text">{summary}</p>
        </div>
      )}
      {experience.length > 0 && (
        <div className="rpct-section">
          <div className="rpct-section-label">Experience</div>
          {experience.map((e, i) => (
            <div className="rpct-item" key={`exp-${i}`}>
              <div className="rpct-item-accent" />
              <div className="rpct-item-body">
                <div className="rpct-role">{e.role}</div>
                <div className="rpct-sub">{e.company} · {e.duration}</div>
                <BulletLines text={e.description} />
              </div>
            </div>
          ))}
        </div>
      )}
      {education.length > 0 && (
        <div className="rpct-section">
          <div className="rpct-section-label">Education</div>
          {education.map((e, i) => (
            <div className="rpct-item" key={`edu-${i}`}>
              <div className="rpct-item-accent" />
              <div className="rpct-item-body">
                <div className="rpct-role">{e.degree}</div>
                <div className="rpct-sub">{e.school} · {e.year}</div>
              </div>
            </div>
          ))}
        </div>
      )}
      {skills.length > 0 && (
        <div className="rpct-section">
          <div className="rpct-section-label">Skills</div>
          <div className="rpct-skills">{skills.map((s, i) => <span key={`skill-${i}-${s}`}>{s}</span>)}</div>
        </div>
      )}
      {projects.length > 0 && (
        <div className="rpct-section">
          <div className="rpct-section-label">Projects</div>
          {projects.map((pr, i) => (
            <div className="rpct-item" key={`proj-${i}`}>
              <div className="rpct-item-accent" />
              <div className="rpct-item-body">
                <div className="rpct-role">{pr.name}</div>
                {pr.tech && <div className="rpct-sub">{pr.tech}</div>}
                {pr.link && <div><ExtLink href={pr.link}>{pr.link}</ExtLink></div>}
                <BulletLines text={pr.description} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ══ 7. SIDEBAR ══ */
function SidebarTemplate({ data }) {
  const { personalInfo: p = {}, summary } = data;
  const experience = safe(data.experience);
  const education  = safe(data.education);
  const skills     = safe(data.skills);
  const projects   = safe(data.projects);
  return (
    <div className="rp rp-sidebar">
      <div className="rps-left">
        <div className="rps-avatar">{(p.name || 'Y').charAt(0)}</div>
        <div className="rps-name">{p.name || 'Your Name'}</div>
        {p.title && <div className="rps-title">{p.title}</div>}
        <div className="rps-section-title">Contact</div>
        {p.email    && <div className="rps-contact-item">{p.email}</div>}
        {p.phone    && <div className="rps-contact-item">{p.phone}</div>}
        {p.location && <div className="rps-contact-item">{p.location}</div>}
        {p.linkedin && <div className="rps-contact-item"><ExtLink href={p.linkedin}>{p.linkedin}</ExtLink></div>}
        {p.website  && <div className="rps-contact-item"><ExtLink href={p.website}>{p.website}</ExtLink></div>}
        {skills.length > 0 && (
          <>
            <div className="rps-section-title" style={{ marginTop:'1rem' }}>Skills</div>
            {skills.map((s, i) => (
              <div className="rps-skill-row" key={`skill-${i}-${s}`}>
                <span>{s}</span>
                <div className="rps-skill-bar"><div className="rps-skill-fill" style={{ width:`${70+(i%4)*8}%` }} /></div>
              </div>
            ))}
          </>
        )}
        {education.length > 0 && (
          <>
            <div className="rps-section-title" style={{ marginTop:'1rem' }}>Education</div>
            {education.map((e, i) => (
              <div className="rps-edu-item" key={`edu-${i}`}>
                <div className="rps-edu-degree">{e.degree}</div>
                <div className="rps-edu-school">{e.school}</div>
                <div className="rps-edu-year">{e.year}</div>
              </div>
            ))}
          </>
        )}
      </div>
      <div className="rps-right">
        {summary && (
          <div className="rps-r-section">
            <div className="rps-r-title">About</div>
            <p className="rp-text">{summary}</p>
          </div>
        )}
        {experience.length > 0 && (
          <div className="rps-r-section">
            <div className="rps-r-title">Experience</div>
            {experience.map((e, i) => (
              <div className="rps-r-item" key={`exp-${i}`}>
                <div className="rps-r-item-head"><strong>{e.role}</strong><span className="rp-date">{e.duration}</span></div>
                <div className="rps-r-company">{e.company}</div>
                <BulletLines text={e.description} />
              </div>
            ))}
          </div>
        )}
        {projects.length > 0 && (
          <div className="rps-r-section">
            <div className="rps-r-title">Projects</div>
            {projects.map((pr, i) => (
              <div className="rps-r-item" key={`proj-${i}`}>
                <div className="rps-r-item-head"><strong>{pr.name}</strong>{pr.tech && <span className="rp-date">{pr.tech}</span>}</div>
                {pr.link && <div style={{ fontSize:'8pt', marginBottom:'2px' }}><ExtLink href={pr.link}>{pr.link}</ExtLink></div>}
                <BulletLines text={pr.description} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
