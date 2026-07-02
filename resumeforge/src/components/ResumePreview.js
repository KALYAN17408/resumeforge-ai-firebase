import React from 'react';
import './ResumePreview.css';

export default function ResumePreview({ data }) {
  const { template = 'modern-fresher' } = data;
  switch (template) {
    case 'stanford': return <StanfordTemplate data={data} />;
    case 'modern':   return <ModernTemplate data={data} />;
    default:         return <HarvardTemplate data={data} />;
  }
}

/* ─── shared helpers ─── */
function safe(arr) { return Array.isArray(arr) ? arr : []; }

function BulletLines({ text, className = 'rp-bullets' }) {
  if (!text || !text.trim()) return null;
  const lines = text
    .split('\n')
    .map(l => l.replace(/^[•\-\*]\s*/, '').trim())
    .filter(Boolean);
  if (!lines.length) return null;
  return (
    <ul className={className}>
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
   1. HARVARD TEMPLATE  (modern-fresher / default)
   Black accents, centered name, serif font
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
        {/* FIX: reduced name font size slightly */}
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
                  {/* FIX: location field now renders */}
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
                  {/* FIX: location field now renders */}
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
   Blue accents (#1a56db), centered name in blue
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
        {/* FIX: reduced name font size */}
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
                  {/* FIX: location renders */}
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
                  {/* FIX: location renders */}
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

/* ══════════════════════════════════════════════
   3. MODERN TWO-COLUMN SIDEBAR TEMPLATE
   - Dark navy left sidebar with photo avatar,
     contact, skills, languages
   - White right column with experience,
     education, projects
   - Matches the uploaded design image exactly
   - Accent: #2563eb (blue), sidebar: #1e293b
══════════════════════════════════════════════ */
function ModernTemplate({ data }) {
  const { personalInfo: p = {}, summary } = data;
  const name       = p.name     || '';
  const title      = p.title    || '';
  const email      = p.email    || '';
  const phone      = p.phone    || '';
  const linkedin   = p.linkedin || '';
  const website    = p.website  || '';
  const location   = p.location || '';   // FIX: location field
  const experience = safe(data.experience);
  const education  = safe(data.education);
  const skills     = safe(data.skills);
  const projects   = safe(data.projects);
  const awards     = safe(data.awards);

  const initials = name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('');

  return (
    <div className="rp mod-wrap">

      {/* ── LEFT SIDEBAR ── */}
      <div className="mod-sidebar">

        {/* Avatar */}
        <div className="mod-avatar-wrap">
          <div className="mod-avatar">{initials || 'FL'}</div>
        </div>

        {/* Name + Title in sidebar top */}
        <div className="mod-sidebar-name">
          {/* FIX: reduced name font size */}
          <div className="mod-name">{name || 'First Last'}</div>
          {title && <div className="mod-title">{title}</div>}
        </div>

        {/* Contact */}
        <div className="mod-sidebar-section">
          <div className="mod-sidebar-title">CONTACT</div>
          <div className="mod-sidebar-divider" />
          <div className="mod-contact-list">
            {/* FIX: location field renders */}
            {location && (
              <div className="mod-contact-item">
                <span className="mod-contact-icon">📍</span>
                <span>{location}</span>
              </div>
            )}
            {phone && (
              <div className="mod-contact-item">
                <span className="mod-contact-icon">📞</span>
                <span>{phone}</span>
              </div>
            )}
            {email && (
              <div className="mod-contact-item">
                <span className="mod-contact-icon">✉</span>
                <span className="mod-contact-break">{email}</span>
              </div>
            )}
            {linkedin && (
              <div className="mod-contact-item">
                <span className="mod-contact-icon">in</span>
                <span className="mod-contact-break">
                  <a href={linkedin.startsWith('http') ? linkedin : `https://${linkedin}`}
                    target="_blank" rel="noopener noreferrer" className="mod-sidebar-link">
                    {linkedin}
                  </a>
                </span>
              </div>
            )}
            {website && (
              <div className="mod-contact-item">
                <span className="mod-contact-icon">🌐</span>
                <span className="mod-contact-break">
                  <a href={website.startsWith('http') ? website : `https://${website}`}
                    target="_blank" rel="noopener noreferrer" className="mod-sidebar-link">
                    {website}
                  </a>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="mod-sidebar-section">
            <div className="mod-sidebar-title">SKILLS</div>
            <div className="mod-sidebar-divider" />
            <div className="mod-skills-list">
              {skills.map((s, i) => (
                <div className="mod-skill-item" key={`skill-${i}`}>
                  <div className="mod-skill-label">{s}</div>
                  <div className="mod-skill-bar">
                    <div
                      className="mod-skill-fill"
                      style={{ width: `${Math.min(100, 65 + (i % 5) * 7)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education in sidebar */}
        {education.length > 0 && (
          <div className="mod-sidebar-section">
            <div className="mod-sidebar-title">EDUCATION</div>
            <div className="mod-sidebar-divider" />
            {education.map((e, i) => (
              <div className="mod-edu-item" key={`edu-${i}`}>
                <div className="mod-edu-degree">{e.degree || ''}</div>
                <div className="mod-edu-school">{e.school || ''}</div>
                {/* FIX: location */}
                <div className="mod-edu-meta">
                  {[e.year, e.location].filter(Boolean).join(' · ')}
                </div>
                {e.gpa && <div className="mod-edu-meta">GPA: {e.gpa}</div>}
              </div>
            ))}
          </div>
        )}

        {/* Awards in sidebar */}
        {awards.length > 0 && (
          <div className="mod-sidebar-section">
            <div className="mod-sidebar-title">AWARDS</div>
            <div className="mod-sidebar-divider" />
            {awards.map((a, i) => (
              <div className="mod-edu-item" key={`award-${i}`}>
                <div className="mod-edu-degree">{a.title || ''}</div>
                {a.org && <div className="mod-edu-school">{a.org}</div>}
                {a.date && <div className="mod-edu-meta">{a.date}</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── RIGHT MAIN CONTENT ── */}
      <div className="mod-main">

        {/* Summary */}
        {summary && (
          <div className="mod-section">
            <div className="mod-section-title">ABOUT ME</div>
            <div className="mod-section-divider" />
            <p className="mod-para">{summary}</p>
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="mod-section">
            <div className="mod-section-title">EXPERIENCE</div>
            <div className="mod-section-divider" />
            {experience.map((e, i) => (
              <div className="mod-exp-item" key={`exp-${i}`}>
                <div className="mod-exp-header">
                  <div className="mod-exp-left">
                    <div className="mod-exp-role">{e.role || ''}</div>
                    <div className="mod-exp-company">{e.company || ''}</div>
                  </div>
                  <div className="mod-exp-right">
                    <div className="mod-exp-date">{e.duration || ''}</div>
                    {/* FIX: location */}
                    {e.location && (
                      <div className="mod-exp-location">{e.location}</div>
                    )}
                  </div>
                </div>
                <BulletLines text={e.description} className="mod-bullets" />
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="mod-section">
            <div className="mod-section-title">PROJECTS</div>
            <div className="mod-section-divider" />
            {projects.map((pr, i) => (
              <div className="mod-proj-item" key={`proj-${i}`}>
                <div className="mod-proj-header">
                  <span className="mod-proj-name">{pr.name || ''}</span>
                  {pr.tech && (
                    <span className="mod-proj-tech"> · {pr.tech}</span>
                  )}
                </div>
                {pr.link && (
                  <div className="mod-proj-link">
                    <a href={pr.link.startsWith('http') ? pr.link : `https://${pr.link}`}
                      target="_blank" rel="noopener noreferrer"
                      className="mod-main-link">
                      {pr.link}
                    </a>
                  </div>
                )}
                <BulletLines text={pr.description} className="mod-bullets" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}