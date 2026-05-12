import React from 'react';
import './ResumePreview.css';

export default function ResumePreview({ data }) {
  const { template = 'modern-fresher' } = data;
  switch (template) {
    case 'stanford': return <StanfordTemplate data={data} />;
    default:         return <HarvardTemplate data={data} />;
  }
}

/* ─── shared helpers ─── */
function safe(arr) { return Array.isArray(arr) ? arr : []; }

function BulletLines({ text }) {
  if (!text || !text.trim()) return null;
  const lines = text
    .split('\n')
    .map(l => l.replace(/^[•\-\*]\s*/, '').trim())
    .filter(Boolean);
  if (!lines.length) return null;
  return (
    <ul className="rp-bullets">
      {lines.map((line, i) => <li key={i}>{line}</li>)}
    </ul>
  );
}

function ExtLink({ href, children }) {
  if (!href || !href.trim()) return null;
  const url = /^https?:\/\//i.test(href) ? href : `https://${href}`;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="rp-link">
      {children || href}
    </a>
  );
}

/* ══════════════════════════════════════════════
   1. HARVARD TEMPLATE  (default / modern-fresher)
   - Centered bold ALL-CAPS name
   - Black horizontal rules
   - Serif font, two-column rows
══════════════════════════════════════════════ */
function HarvardTemplate({ data }) {
  const { personalInfo: p = {}, summary } = data;
  const name       = p.name     || '';
  const title      = p.title    || '';
  const email      = p.email    || '';
  const phone      = p.phone    || '';
  const linkedin   = p.linkedin || '';
  const website    = p.website  || '';
  const experience = safe(data.experience);
  const education  = safe(data.education);
  const skills     = safe(data.skills);
  const projects   = safe(data.projects);
  const awards     = safe(data.awards);

  const contactParts = [phone, email, linkedin, website].filter(Boolean);

  return (
    <div className="rp hv-wrap">
      {/* Header */}
      <div className="hv-header">
        <h1 className="hv-name">{name || 'First Last'}</h1>
        {title && <div className="hv-job-title">{title}</div>}
        {contactParts.length > 0 && (
          <div className="hv-contact">
            {contactParts.map((part, i) => (
              <span key={i}>
                {i > 0 && <span className="hv-sep"> | </span>}
                {(part === linkedin || part === website)
                  ? <ExtLink href={part}>{part}</ExtLink>
                  : part}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="hv-body">
        {summary && (
          <div className="hv-section">
            <div className="hv-section-title">OBJECTIVE</div>
            <hr className="hv-hr" />
            <p className="hv-para">{summary}</p>
          </div>
        )}

        {education.length > 0 && (
          <div className="hv-section">
            <div className="hv-section-title">EDUCATION</div>
            <hr className="hv-hr" />
            {education.map((e, i) => (
              <div className="hv-block" key={`edu-${i}`}>
                <div className="hv-row">
                  <strong className="hv-org">{e.school || ''}</strong>
                  <span className="hv-date">{e.year || ''}</span>
                </div>
                <div className="hv-row">
                  <span className="hv-italic">
                    {e.degree || ''}{e.gpa ? `, GPA: ${e.gpa}` : ''}
                  </span>
                  <span className="hv-date">{e.location || ''}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {experience.length > 0 && (
          <div className="hv-section">
            <div className="hv-section-title">EXPERIENCE</div>
            <hr className="hv-hr" />
            {experience.map((e, i) => (
              <div className="hv-block" key={`exp-${i}`}>
                <div className="hv-row">
                  <strong className="hv-org">{e.role || ''}</strong>
                  <span className="hv-date">{e.duration || ''}</span>
                </div>
                <div className="hv-row">
                  <span className="hv-italic">{e.company || ''}</span>
                  <span className="hv-date">{e.location || ''}</span>
                </div>
                <BulletLines text={e.description} />
              </div>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div className="hv-section">
            <div className="hv-section-title">PROJECTS</div>
            <hr className="hv-hr" />
            {projects.map((pr, i) => (
              <div className="hv-block hv-proj-block" key={`proj-${i}`}>
                <div className="hv-proj-title">
                  <strong className="hv-org">{pr.name || ''}</strong>
                  {pr.tech && <span className="hv-proj-tech"> | {pr.tech}</span>}
                  {pr.link && (
                    <span className="hv-proj-tech">
                      {' '}— <ExtLink href={pr.link}>{pr.link}</ExtLink>
                    </span>
                  )}
                </div>
                <BulletLines text={pr.description} />
              </div>
            ))}
          </div>
        )}

        {awards.length > 0 && (
          <div className="hv-section">
            <div className="hv-section-title">AWARDS &amp; HONORS</div>
            <hr className="hv-hr" />
            {awards.map((a, i) => (
              <div className="hv-block" key={`award-${i}`}>
                <div className="hv-row">
                  <strong className="hv-org">{a.title || ''}</strong>
                  <span className="hv-date">{a.date || ''}</span>
                </div>
                {a.org && <div className="hv-italic">{a.org}</div>}
                {a.description && (
                  <p className="hv-para" style={{ marginTop: 2 }}>{a.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {skills.length > 0 && (
          <div className="hv-section">
            <div className="hv-section-title">SKILLS</div>
            <hr className="hv-hr" />
            <div className="hv-skills-text">{skills.join(' · ')}</div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════
   2. STANFORD TEMPLATE
   - Bold ALL-CAPS name in blue
   - Blue section titles + blue horizontal rules
   - Same two-column layout, serif font
   - Includes Awards & Honors section
══════════════════════════════════════════════ */
function StanfordTemplate({ data }) {
  const { personalInfo: p = {}, summary } = data;
  const name       = p.name     || '';
  const title      = p.title    || '';
  const email      = p.email    || '';
  const phone      = p.phone    || '';
  const linkedin   = p.linkedin || '';
  const website    = p.website  || '';
  const experience = safe(data.experience);
  const education  = safe(data.education);
  const skills     = safe(data.skills);
  const projects   = safe(data.projects);
  const awards     = safe(data.awards);

  const contactParts = [phone, email, linkedin, website].filter(Boolean);

  return (
    <div className="rp sf-wrap">
      {/* Header */}
      <div className="sf-header">
        <h1 className="sf-name">{name || 'First Last'}</h1>
        {title && <div className="sf-job-title">{title}</div>}
        {contactParts.length > 0 && (
          <div className="sf-contact">
            {contactParts.map((part, i) => (
              <span key={i}>
                {i > 0 && <span className="sf-sep"> | </span>}
                {(part === linkedin || part === website)
                  ? <ExtLink href={part}>{part}</ExtLink>
                  : part}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="sf-body">
        {summary && (
          <div className="sf-section">
            <div className="sf-section-title">OBJECTIVE</div>
            <div className="sf-hr" />
            <p className="sf-para">{summary}</p>
          </div>
        )}

        {education.length > 0 && (
          <div className="sf-section">
            <div className="sf-section-title">EDUCATION</div>
            <div className="sf-hr" />
            {education.map((e, i) => (
              <div className="sf-block" key={`edu-${i}`}>
                <div className="sf-row">
                  <strong className="sf-org">{e.school || ''}</strong>
                  <span className="sf-date">{e.year || ''}</span>
                </div>
                <div className="sf-row">
                  <span className="sf-italic">
                    {e.degree || ''}{e.gpa ? `, GPA: ${e.gpa}` : ''}
                  </span>
                  <span className="sf-date">{e.location || ''}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {experience.length > 0 && (
          <div className="sf-section">
            <div className="sf-section-title">EXPERIENCE</div>
            <div className="sf-hr" />
            {experience.map((e, i) => (
              <div className="sf-block" key={`exp-${i}`}>
                <div className="sf-row">
                  <strong className="sf-org">{e.role || ''}</strong>
                  <span className="sf-date">{e.duration || ''}</span>
                </div>
                <div className="sf-row">
                  <span className="sf-italic">{e.company || ''}</span>
                  <span className="sf-date">{e.location || ''}</span>
                </div>
                <BulletLines text={e.description} />
              </div>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div className="sf-section">
            <div className="sf-section-title">PROJECTS</div>
            <div className="sf-hr" />
            {projects.map((pr, i) => (
              <div className="sf-block sf-proj-block" key={`proj-${i}`}>
                <div className="sf-proj-title">
                  <strong className="sf-org">{pr.name || ''}</strong>
                  {pr.tech && <span className="sf-proj-tech"> | {pr.tech}</span>}
                  {pr.link && (
                    <span className="sf-proj-tech">
                      {' '}— <ExtLink href={pr.link}>{pr.link}</ExtLink>
                    </span>
                  )}
                </div>
                <BulletLines text={pr.description} />
              </div>
            ))}
          </div>
        )}

        {awards.length > 0 && (
          <div className="sf-section">
            <div className="sf-section-title">AWARDS &amp; HONORS</div>
            <div className="sf-hr" />
            {awards.map((a, i) => (
              <div className="sf-block" key={`award-${i}`}>
                <div className="sf-row">
                  <strong className="sf-org">{a.title || ''}</strong>
                  <span className="sf-date">{a.date || ''}</span>
                </div>
                {a.org && <div className="sf-italic">{a.org}</div>}
                {a.description && (
                  <p className="sf-para" style={{ marginTop: 2 }}>{a.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {skills.length > 0 && (
          <div className="sf-section">
            <div className="sf-section-title">SKILLS</div>
            <div className="sf-hr" />
            <div className="sf-skills-text">{skills.join(' · ')}</div>
          </div>
        )}
      </div>
    </div>
  );
}