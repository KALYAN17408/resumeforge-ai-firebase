import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Templates.css';

const TEMPLATES = [
  {
    id: 'modern-fresher',
    name: 'Harvard Style Professional',
    tag: '⭐ Recommended',
    tagColor: 'green',
    desc: 'Clean Harvard-style resume with bold name, two-column layout, section dividers, and professional serif typography. Perfect for all industries.',
    recommended: true,
    accent: '#000',
  },
];

function TemplateMock({ accent }) {
  return (
    <div className="tmock" style={{ fontFamily: 'Georgia, serif', padding: '10px 12px' }}>
      <div style={{ textAlign: 'center', borderBottom: '1.5px solid #000', paddingBottom: 5, marginBottom: 5 }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 900, color: '#000', textTransform: 'uppercase', letterSpacing: 1 }}>FULL NAME</div>
        <div style={{ fontSize: '0.42rem', color: '#333' }}>phone | email | linkedin | github</div>
      </div>
      {['EDUCATION', 'EXPERIENCE', 'PROJECTS', 'SKILLS'].map(s => (
        <div key={s}>
          <div style={{ fontSize: '0.42rem', fontWeight: 800, textTransform: 'uppercase', color: '#000', borderBottom: '1px solid #000', marginBottom: 2, paddingBottom: 1, marginTop: 5 }}>{s}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
            <div style={{ height: 3, width: '65%', background: '#555', borderRadius: 1 }} />
            <div style={{ height: 3, width: '25%', background: '#888', borderRadius: 1 }} />
          </div>
          <div style={{ height: 2.5, width: '55%', background: '#aaa', borderRadius: 1, marginBottom: 1 }} />
          <div style={{ height: 2.5, width: '80%', background: '#ddd', borderRadius: 1 }} />
        </div>
      ))}
    </div>
  );
}

export default function Templates() {
  const navigate = useNavigate();

  return (
    <div className="templates-page">
      <div className="tpl-hero">
        <div className="section-label">Template Gallery</div>
        <h1>Your <span style={{ color: 'var(--accent2)' }}>professional template</span></h1>
        <p>Harvard-style resume template — free, ATS-friendly, and exports to a clean PDF.</p>
        <div style={{
          display: 'inline-block', marginTop: '0.75rem',
          background: 'rgba(34,211,160,0.1)', border: '1px solid rgba(34,211,160,0.3)',
          color: 'var(--green)', padding: '5px 16px', borderRadius: 20,
          fontSize: '0.82rem', fontWeight: 600,
        }}>
          ✓ 100% free — no upgrade needed
        </div>
      </div>

      <div className="templates-grid" style={{ maxWidth: 400, margin: '0 auto' }}>
        {TEMPLATES.map(tpl => (
          <div
            key={tpl.id}
            className={`tpl-card recommended`}
          >
            <div className="tpl-recommended-badge">⭐ Recommended</div>
            <div className="tpl-preview">
              <TemplateMock accent={tpl.accent} />
            </div>
            <div className="tpl-info">
              <div className="tpl-info-top">
                <div className="tpl-name">{tpl.name}</div>
                <span className="tag tag-green">{tpl.tag}</span>
              </div>
              <p className="tpl-desc">{tpl.desc}</p>
              <button
                className="btn btn-primary btn-sm"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => navigate('/builder?template=modern-fresher')}
              >
                ⭐ Use This Template
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}