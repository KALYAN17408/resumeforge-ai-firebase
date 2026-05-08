import React from 'react';
import './ResumePreview.css';

export default function ResumePreview({ data }) {
  // Only Harvard template — all resumes use this layout
  return <HarvardTemplate data={data} />;
}

/* ─── helpers ─── */
function safe(arr) { return Array.isArray(arr) ? arr : []; }

// FIX: proper newline split, strips bullet chars, filters empty lines
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

// FIX: safe URL — handles missing protocol
function ExtLink({ href, children }) {
  if (!href || !href.trim()) return null;
  const url = /^https?:\/\//i.test(href) ? href : `https://${href}`;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="rp-link">
      {children || href}
    </a>
  );
}

/* ══════════════════════════════════════════════════════════
   1. HARVARD STYLE — Modern Fresher (default)
   Matches the uploaded template exactly:
   - Bold all-caps centered name
   - Single pipe-separated contact line
   - ALL CAPS section titles with full-width HR
   - Two-column rows (left: bold role/org, right: date)
   - Italic company / degree sub-line
   - Disc bullet points, indented
   - Projects: Name | Tech then bullets
   - Skills: plain paragraph text
══════════════════════════════════════════════════════════ */
function HarvardTemplate({ data }) {
  // FIX: destructure personalInfo safely — all fields explicitly read
  const {
    personalInfo: p = {},
    summary,
  } = data;

  // FIX: read every field from p explicitly so nothing is undefined
  const name     = p.name     || '';
  const title    = p.title    || '';   // Job Title — was missing from preview
  const email    = p.email    || '';
  const phone    = p.phone    || '';
  const location = p.location || '';
  const linkedin = p.linkedin || '';   // FIX: was not rendering in preview
  const website  = p.website  || '';   // FIX: was not rendering in preview

  const experience = safe(data.experience);
  const education  = safe(data.education);
  const skills     = safe(data.skills);
  const projects   = safe(data.projects);

  // Build contact line — only include non-empty values
  const contactParts = [
  phone,
  email,
  location,
  linkedin,
  website
].filter(Boolean);

  // Determine if there is any content beyond header to avoid empty space
  const hasContent =
    summary ||
    education.length > 0 ||
    experience.length > 0 ||
    projects.length > 0 ||
    skills.length > 0;

  return (
    <div className="rp rp-harvard">

      {/* ── Header: Name + Job Title + Contact ── */}
      <div className="hv-header">
        <h1 className="hv-name">{name || 'First Last'}</h1>
        {/* FIX: Job Title now renders — was not connected before */}
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

      {/* ── Only render body if there is content ── */}
      {hasContent && (
        <div className="hv-body">

          {/* Education */}
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
                      {e.degree || ''}
                      {e.gpa ? `, GPA: ${e.gpa}` : ''}
                    </span>
                    {/* FIX: location field renders on right side */}
                    <span className="hv-date">{e.location || ''}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Experience */}
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
                    {/* FIX: exp location renders on right */}
                    <span className="hv-date">{e.location || ''}</span>
                  </div>
                  <BulletLines text={e.description} />
                </div>
              ))}
            </div>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <div className="hv-section">
              <div className="hv-section-title">PROJECTS</div>
              <hr className="hv-hr" />
              {projects.map((pr, i) => (
                <div className="hv-block" key={`proj-${i}`}>
                  <div className="hv-proj-title">
                    <strong className="hv-org">{pr.name || ''}</strong>
                    {pr.tech && (
                      <span className="hv-proj-tech"> | {pr.tech}</span>
                    )}
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

          {/* Skills */}
          {skills.length > 0 && (
            <div className="hv-section">
              <div className="hv-section-title">SKILLS</div>
              <hr className="hv-hr" />
              {/* Group skills into labelled rows if they contain a colon, else plain list */}
            <div className="hv-skills-list">
  {skills.map((skill, i) => (
    <div key={i} className="hv-skill-item">
      • {skill}
    </div>
  ))}
</div>
            </div>
          )}

          {/* Career Objective / Summary */}
          {summary && (
            <div className="hv-section">
              <div className="hv-section-title">OBJECTIVE</div>
              <hr className="hv-hr" />
              <p className="hv-summary">{summary}</p>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   2. CLASSIC (Simple Clean)
══════════════════════════════════════════ */
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
        {/* FIX: title renders */}
        {p.title && <div className="rpc-title">{p.title}</div>}
        <div className="rpc-contact">
          {p.email    && <span>{p.email}</span>}
          {p.phone    && <span>{p.phone}</span>}
          {p.location && <span>{p.location}</span>}
          {/* FIX: linkedin + website render */}
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

/* ══════════════════════════════════════════
   3. MODERN EDGE
══════════════════════════════════════════ */
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
          {/* FIX: title */}
          {p.title && <div className="rpm-title">{p.title}</div>}
        </div>
        <div className="rpm-contact">
          {p.email    && <div>{p.email}</div>}
          {p.phone    && <div>{p.phone}</div>}
          {p.location && <div>{p.location}</div>}
          {/* FIX: linkedin */}
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

/* ══════════════════════════════════════════
   4. MINIMAL
══════════════════════════════════════════ */
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
        {/* FIX: title */}
        {p.title && <div className="rpmn-title">{p.title}</div>}
        <div className="rpmn-contact">
          {[p.email, p.phone, p.location].filter(Boolean).join(' · ')}
          {/* FIX: linkedin + website */}
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
              <div className="rpmn-item-top">
                <span className="rpmn-role">{e.role}</span>
                <span className="rpmn-date">{e.duration}</span>
              </div>
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
              <div className="rpmn-item-top">
                <span className="rpmn-role">{e.degree}</span>
                <span className="rpmn-date">{e.year}</span>
              </div>
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

/* ══════════════════════════════════════════
   5. EXECUTIVE
══════════════════════════════════════════ */
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
        {/* FIX: title */}
        {p.title && <div className="rpe-title">{p.title}</div>}
        <div className="rpe-divider" />
        <div className="rpe-contact">
          {[p.email, p.phone, p.location].filter(Boolean).map((c, i) => (
            <span key={i}>{c}</span>
          ))}
          {/* FIX: linkedin */}
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
                <div className="rpe-company-date">{e.company}{e.duration ? ` · ${e.duration}` : ''}</div>
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
                <div className="rpe-company-date">{e.school}{e.year ? ` · ${e.year}` : ''}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div className="rpe-section">
          <div className="rpe-section-title">Core Competencies</div>
          <div className="rpe-skills">
            {skills.map((s, i) => <span key={`skill-${i}-${s}`}>{s}</span>)}
          </div>
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

/* ══════════════════════════════════════════
   6. CREATIVE GRADIENT
══════════════════════════════════════════ */
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
          {/* FIX: title */}
          {p.title && <div className="rpct-title">{p.title}</div>}
        </div>
        <div className="rpct-contact">
          {p.email    && <div>{p.email}</div>}
          {p.phone    && <div>{p.phone}</div>}
          {p.location && <div>{p.location}</div>}
          {/* FIX: linkedin + website */}
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
                <div className="rpct-sub">{e.company}{e.duration ? ` · ${e.duration}` : ''}</div>
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
                <div className="rpct-sub">{e.school}{e.year ? ` · ${e.year}` : ''}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {skills.length > 0 && (
        <div className="rpct-section">
          <div className="rpct-section-label">Skills</div>
          <div className="rpct-skills">
            {skills.map((s, i) => <span key={`skill-${i}-${s}`}>{s}</span>)}
          </div>
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

/* ══════════════════════════════════════════
   7. SIDEBAR (Two Column)
══════════════════════════════════════════ */
function SidebarTemplate({ data }) {
  const { personalInfo: p = {}, summary } = data;
  const experience = safe(data.experience);
  const education  = safe(data.education);
  const skills     = safe(data.skills);
  const projects   = safe(data.projects);
  return (
    <div className="rp rp-sidebar">
      <div className="rps-left">
        <div className="rps-avatar">{(p.name || 'Y').charAt(0).toUpperCase()}</div>
        <div className="rps-name">{p.name || 'Your Name'}</div>
        {/* FIX: title */}
        {p.title && <div className="rps-title">{p.title}</div>}

        <div className="rps-section-title">Contact</div>
        {p.email    && <div className="rps-contact-item">{p.email}</div>}
        {p.phone    && <div className="rps-contact-item">{p.phone}</div>}
        {p.location && <div className="rps-contact-item">{p.location}</div>}
        {/* FIX: linkedin + website */}
        {p.linkedin && <div className="rps-contact-item"><ExtLink href={p.linkedin}>{p.linkedin}</ExtLink></div>}
        {p.website  && <div className="rps-contact-item"><ExtLink href={p.website}>{p.website}</ExtLink></div>}

        {skills.length > 0 && (
          <>
            <div className="rps-section-title" style={{ marginTop: '1rem' }}>Skills</div>
            {skills.map((s, i) => (
              <div className="rps-skill-row" key={`skill-${i}-${s}`}>
                <span>{s}</span>
                <div className="rps-skill-bar">
                  <div className="rps-skill-fill" style={{ width: `${70 + (i % 4) * 8}%` }} />
                </div>
              </div>
            ))}
          </>
        )}

        {education.length > 0 && (
          <>
            <div className="rps-section-title" style={{ marginTop: '1rem' }}>Education</div>
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
                <div className="rps-r-item-head">
                  <strong>{e.role}</strong>
                  <span className="rp-date">{e.duration}</span>
                </div>
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
                <div className="rps-r-item-head">
                  <strong>{pr.name}</strong>
                  {pr.tech && <span className="rp-date">{pr.tech}</span>}
                </div>
                {pr.link && (
                  <div style={{ fontSize: '8pt', marginBottom: '2px' }}>
                    <ExtLink href={pr.link}>{pr.link}</ExtLink>
                  </div>
                )}
                <BulletLines text={pr.description} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}