/* eslint-disable no-unused-vars */
import React from 'react';
import './ResumePreview.css';
export default function ResumePreview({
  data,
  template = 'harvard'
}) {
  console.log("Template:", data?.template);

  switch (template) {
    case 'stanford':
      return <StanfordTemplate data={data} />;

    case 'harvard':
    default:
      return <HarvardTemplate data={data} />;
  }
}

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */

function safe(arr) {
  return Array.isArray(arr) ? arr : [];
}

function BulletLines({ text, className = 'rp-bullets' }) {
  if (!text || !text.trim()) return null;

  const lines = text
    .split('\n')
    .map(l => l.replace(/^[•\-*]\s*/, '').trim())
    .filter(Boolean);

  if (!lines.length) return null;

  return (
    <ul className={className}>
      {lines.map((line, i) => (
        <li key={i}>{line}</li>
      ))}
    </ul>
  );
}

function ExtLink({ href, children, className = 'rp-link' }) {
  if (!href || !href.trim()) return null;

  const url = /^https?:\/\//i.test(href)
    ? href
    : `https://${href}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children || href}
    </a>
  );
}

/* ═════════════════════════════════════════════
   HARVARD TEMPLATE
═════════════════════════════════════════════ */

function HarvardTemplate({ data }) {
  const {
    personalInfo: p = {},
    summary,
  } = data;

  const name = p.name || '';
  const title = p.title || '';
  const email = p.email || '';
  const phone = p.phone || '';
  const location = p.location || '';
  const linkedin = p.linkedin || '';
  const website = p.website || '';

  const experience = safe(data.experience);
  const education = safe(data.education);
  const skills = safe(data.skills);
  const projects = safe(data.projects);

  const contactParts = [
    phone,
    email,
    location,
    linkedin,
    website
  ].filter(Boolean);

  return (
    <div className="rp rp-harvard">

      {/* Header */}
      <div className="hv-header">
        <h1 className="hv-name">
          {name || 'First Last'}
        </h1>

        {title && (
          <div className="hv-job-title">
            {title}
          </div>
        )}

        {contactParts.length > 0 && (
          <div className="hv-contact">
            {contactParts.map((part, i) => (
              <span key={i}>
                {i > 0 && (
                  <span className="hv-sep"> | </span>
                )}

                {(part === linkedin || part === website)
                  ? (
                    <ExtLink href={part}>
                      {part}
                    </ExtLink>
                  )
                  : part}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="hv-body">

        {/* Education */}
        {education.length > 0 && (
          <div className="hv-section">
            <div className="hv-section-title">
              EDUCATION
            </div>

            <hr className="hv-hr" />

            {education.map((e, i) => (
              <div className="hv-block" key={i}>

                <div className="hv-row">
                  <strong className="hv-org">
                    {e.school || ''}
                  </strong>

                  <span className="hv-date">
                    {e.year || ''}
                  </span>
                </div>

                <div className="hv-row">
                  <span className="hv-italic">
                    {e.degree || ''}
                    {e.gpa ? `, GPA: ${e.gpa}` : ''}
                  </span>

                  <span className="hv-date">
                    {e.location || ''}
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="hv-section">
            <div className="hv-section-title">
              EXPERIENCE
            </div>

            <hr className="hv-hr" />

            {experience.map((e, i) => (
              <div className="hv-block" key={i}>

                <div className="hv-row">
                  <strong className="hv-org">
                    {e.role || ''}
                  </strong>

                  <span className="hv-date">
                    {e.duration || ''}
                  </span>
                </div>

                <div className="hv-row">
                  <span className="hv-italic">
                    {e.company || ''}
                  </span>

                  <span className="hv-date">
                    {e.location || ''}
                  </span>
                </div>

                <BulletLines text={e.description} />

              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="hv-section">
            <div className="hv-section-title">
              PROJECTS
            </div>

            <hr className="hv-hr" />

            {projects.map((pr, i) => (
              <div className="hv-block" key={i}>

                <div className="hv-proj-title">

                  <strong className="hv-org">
                    {pr.name || ''}
                  </strong>

                  {pr.tech && (
                    <span className="hv-proj-tech">
                      {' | '}
                      {pr.tech}
                    </span>
                  )}

                  {pr.link && (
                    <span className="hv-proj-tech">
                      {' — '}
                      <ExtLink href={pr.link}>
                        {pr.link}
                      </ExtLink>
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

            <div className="hv-section-title">
              SKILLS
            </div>

            <hr className="hv-hr" />

            <div className="hv-skills-list">
              {skills.map((skill, i) => (
                <div
                  key={i}
                  className="hv-skill-item"
                >
                  • {skill}
                </div>
              ))}
            </div>

          </div>
        )}

        {/* Objective */}
        {summary && (
          <div className="hv-section">

            <div className="hv-section-title">
              OBJECTIVE
            </div>

            <hr className="hv-hr" />

            <p className="hv-summary">
              {summary}
            </p>

          </div>
        )}

      </div>
    </div>
  );
}

/* ═════════════════════════════════════════════
   STANFORD TEMPLATE
═════════════════════════════════════════════ */

function StanfordTemplate({ data }) {
  const { personalInfo: p = {}, summary } = data;

  const name = p.name || '';
  const title = p.title || '';
  const email = p.email || '';
  const phone = p.phone || '';
  const linkedin = p.linkedin || '';
  const website = p.website || '';

  const experience = safe(data.experience);
  const education = safe(data.education);
  const skills = safe(data.skills);
  const projects = safe(data.projects);
  const awards = safe(data.awards);

  const contactParts = [
    phone,
    email,
    linkedin,
    website
  ].filter(Boolean);

  return (
    <div className="rp sf-wrap">

      {/* Header */}
      <div className="sf-header">

        <h1 className="sf-name">
          {name || 'First Last'}
        </h1>

        {title && (
          <div className="sf-job-title">
            {title}
          </div>
        )}

        {contactParts.length > 0 && (
          <div className="sf-contact">
            {contactParts.map((part, i) => (
              <span key={i}>

                {i > 0 && (
                  <span className="sf-sep"> | </span>
                )}

                {(part === linkedin || part === website)
                  ? (
                    <ExtLink
                      href={part}
                      className="sf-link"
                    >
                      {part}
                    </ExtLink>
                  )
                  : part}

              </span>
            ))}
          </div>
        )}

      </div>

      <div className="sf-body">

        {/* Objective */}
        {summary && (
          <div className="sf-section">

            <div className="sf-section-title">
              OBJECTIVE
            </div>

            <div className="sf-hr" />

            <p className="sf-para">
              {summary}
            </p>

          </div>
        )}

        {/* Education */}
        {education.length > 0 && (
          <div className="sf-section">

            <div className="sf-section-title">
              EDUCATION
            </div>

            <div className="sf-hr" />

            {education.map((e, i) => (
              <div className="sf-block" key={i}>

                <div className="sf-row">
                  <strong className="sf-org">
                    {e.school || ''}
                  </strong>

                  <span className="sf-date">
                    {e.year || ''}
                  </span>
                </div>

                <div className="sf-row">
                  <span className="sf-italic">
                    {e.degree || ''}
                    {e.gpa ? `, GPA: ${e.gpa}` : ''}
                  </span>

                  <span className="sf-date">
                    {e.location || ''}
                  </span>
                </div>

              </div>
            ))}

          </div>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <div className="sf-section">

            <div className="sf-section-title">
              EXPERIENCE
            </div>

            <div className="sf-hr" />

            {experience.map((e, i) => (
              <div className="sf-block" key={i}>

                <div className="sf-row">

                  <strong className="sf-org">
                    {e.role || ''}
                  </strong>

                  <span className="sf-date">
                    {e.duration || ''}
                  </span>

                </div>

                <div className="sf-row">

                  <span className="sf-italic">
                    {e.company || ''}
                  </span>

                  <span className="sf-date">
                    {e.location || ''}
                  </span>

                </div>

                <BulletLines
                  text={e.description}
                  className="sf-bullets"
                />

              </div>
            ))}

          </div>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <div className="sf-section">

            <div className="sf-section-title">
              PROJECTS
            </div>

            <div className="sf-hr" />

            {projects.map((pr, i) => (
              <div
                className="sf-block sf-proj-block"
                key={i}
              >

                <div className="sf-proj-title">

                  <strong className="sf-org">
                    {pr.name || ''}
                  </strong>

                  {pr.tech && (
                    <span className="sf-proj-tech">
                      {' | '}
                      {pr.tech}
                    </span>
                  )}

                  {pr.link && (
                    <span className="sf-proj-tech">
                      {' — '}
                      <ExtLink
                        href={pr.link}
                        className="sf-link"
                      >
                        {pr.link}
                      </ExtLink>
                    </span>
                  )}

                </div>

                <BulletLines
                  text={pr.description}
                  className="sf-bullets"
                />

              </div>
            ))}

          </div>
        )}

        {/* Awards */}
        {awards.length > 0 && (
          <div className="sf-section">

            <div className="sf-section-title">
              AWARDS & HONORS
            </div>

            <div className="sf-hr" />

            {awards.map((a, i) => (
              <div className="sf-block" key={i}>

                <div className="sf-row">

                  <strong className="sf-org">
                    {a.title || ''}
                  </strong>

                  <span className="sf-date">
                    {a.date || ''}
                  </span>

                </div>

                {a.org && (
                  <div className="sf-italic">
                    {a.org}
                  </div>
                )}

                {a.description && (
                  <p
                    className="sf-para"
                    style={{ marginTop: 2 }}
                  >
                    {a.description}
                  </p>
                )}

              </div>
            ))}

          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div className="sf-section">

            <div className="sf-section-title">
              SKILLS
            </div>

            <div className="sf-hr" />

            <div className="sf-skills-text">
              {skills.join(' · ')}
            </div>

          </div>
        )}

      </div>
    </div>
  );
}