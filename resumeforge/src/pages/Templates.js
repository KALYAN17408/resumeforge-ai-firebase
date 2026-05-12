import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Templates.css';

const TEMPLATES = [
  {
    id: 'modern-fresher',
    name: 'Harvard Style',
    tag: '⭐ Recommended',
    tagColor: 'green',
    desc: 'Classic Harvard layout — bold black name, black section dividers, clean serif typography. Professional and universally accepted.',
    recommended: true,
    accent: '#000',
    nameColor: '#000',
  },
  {
    id: 'stanford',
    name: 'Stanford Style',
    tag: '🔵 New',
    tagColor: 'purple',
    desc: 'Stanford-inspired layout — bold blue name, blue section titles and dividers. Same professional structure with a modern colour accent.',
    recommended: false,
    accent: '#1a56db',
    nameColor: '#1a56db',
  },
];

function TemplateMock({ accent, nameColor }) {
  return (
    <div style={{
      background: '#fff', width: '100%', height: 200,
      padding: '10px 12px', overflow: 'hidden',
      fontFamily: 'Georgia, serif', boxSizing: 'border-box',
    }}>
      {/* Name */}
      <div style={{
        textAlign: 'center', borderBottom: `1.5px solid ${accent}`,
        paddingBottom: 5, marginBottom: 5,
      }}>
        <div style={{
          fontSize: '0.78rem', fontWeight: 900, color: nameColor,
          textTransform: 'uppercase', letterSpacing: 1,
        }}>
          FIRST LAST
        </div>
        <div style={{ fontSize: '0.42rem', color: '#333' }}>
          phone | email | linkedin | github
        </div>
      </div>
      {/* Sections */}
      {['EDUCATION', 'EXPERIENCE', 'PROJECTS', 'SKILLS'].map(s => (
        <div key={s} style={{ marginBottom: 5 }}>
          <div style={{
            fontSize: '0.42rem', fontWeight: 800, textTransform: 'uppercase',
            color: accent, borderBottom: `1px solid ${accent}`,
            paddingBottom: 1, marginBottom: 2,
          }}>
            {s}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
            <div style={{ height: 3, width: '60%', background: '#333', borderRadius: 1 }} />
            <div style={{ height: 3, width: '24%', background: '#888', borderRadius: 1 }} />
          </div>
          <div style={{ height: 2.5, width: '50%', background: '#aaa', borderRadius: 1, marginBottom: 1 }} />
          <div style={{ height: 2.5, width: '75%', background: '#ddd', borderRadius: 1 }} />
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
        <h1>Choose your <span style={{ color: 'var(--accent2)' }}>template</span></h1>
        <p>Both templates are free, ATS-friendly, and export to a clean PDF.</p>
        <div style={{
          display: 'inline-block', marginTop: '0.75rem',
          background: 'rgba(34,211,160,0.1)', border: '1px solid rgba(34,211,160,0.3)',
          color: 'var(--green)', padding: '5px 16px', borderRadius: 20,
          fontSize: '0.82rem', fontWeight: 600,
        }}>
          ✓ 100% free — no upgrade needed
        </div>
      </div>

      <div className="templates-grid" style={{ maxWidth: 720, margin: '0 auto' }}>
        {TEMPLATES.map(tpl => (
          <div
            key={tpl.id}
            className={`tpl-card${tpl.recommended ? ' recommended' : ''}`}
          >
            {tpl.recommended && (
              <div className="tpl-recommended-badge">⭐ Recommended</div>
            )}
            <div className="tpl-preview">
              <TemplateMock accent={tpl.accent} nameColor={tpl.nameColor} />
            </div>
            <div className="tpl-info">
              <div className="tpl-info-top">
                <div className="tpl-name">{tpl.name}</div>
                <span className={`tag tag-${tpl.tagColor}`}>{tpl.tag}</span>
              </div>
              <p className="tpl-desc">{tpl.desc}</p>
              <button
                className="btn btn-primary btn-sm"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={() => navigate(`/builder?template=${tpl.id}`)}
              >
                Use {tpl.name} →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}