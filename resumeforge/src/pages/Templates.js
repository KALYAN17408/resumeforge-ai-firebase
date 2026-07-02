import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Templates.css';

const TEMPLATES = [
  {
    id: 'modern-fresher',
    name: 'Harvard Style',
    tag: '⭐ Recommended',
    tagColor: 'green',
    desc: 'Classic Harvard layout — bold black name, black section dividers, serif typography. Professional and universally accepted.',
    recommended: true,
    accent: '#000',
    nameColor: '#000',
    type: 'serif',
  },
  {
    id: 'stanford',
    name: 'Stanford Style',
    tag: '🔵 Blue Accent',
    tagColor: 'purple',
    desc: 'Stanford-inspired layout — bold blue name, blue section titles and dividers. Same clean structure with a modern colour accent.',
    recommended: false,
    accent: '#1a56db',
    nameColor: '#1a56db',
    type: 'serif',
  },
  {
    id: 'modern',
    name: 'Modern Sidebar',
    tag: '🎨 New',
    tagColor: 'gold',
    desc: 'Two-column design with dark navy sidebar and white main panel. Features skill bars, avatar initials, and a contemporary look.',
    recommended: false,
    accent: '#2563eb',
    nameColor: '#fff',
    type: 'modern',
  },
];

function SerifMock({ accent, nameColor }) {
  return (
    <div style={{
      background: '#fff', width: '100%', height: 200,
      padding: '10px 12px', overflow: 'hidden',
      fontFamily: 'Georgia, serif', boxSizing: 'border-box',
    }}>
      <div style={{
        textAlign: 'center',
        borderBottom: `1.5px solid ${accent}`,
        paddingBottom: 5, marginBottom: 5,
      }}>
        <div style={{
          fontSize: '0.72rem', fontWeight: 900, color: nameColor,
          textTransform: 'uppercase', letterSpacing: 1,
        }}>FIRST LAST</div>
        <div style={{ fontSize: '0.4rem', color: '#444' }}>
          phone | email | linkedin | github
        </div>
      </div>
      {['EDUCATION', 'EXPERIENCE', 'PROJECTS', 'SKILLS'].map(s => (
        <div key={s} style={{ marginBottom: 5 }}>
          <div style={{
            fontSize: '0.4rem', fontWeight: 800, textTransform: 'uppercase',
            color: accent, borderBottom: `1px solid ${accent}`,
            paddingBottom: 1, marginBottom: 2,
          }}>{s}</div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 1 }}>
            <div style={{ height: 2.5, width: '60%', background: '#333', borderRadius: 1 }} />
            <div style={{ height: 2.5, width: '22%', background: '#888', borderRadius: 1 }} />
          </div>
          <div style={{ height: 2.5, width: '48%', background: '#aaa', borderRadius: 1, marginBottom: 1 }} />
          <div style={{ height: 2.5, width: '72%', background: '#ddd', borderRadius: 1 }} />
        </div>
      ))}
    </div>
  );
}

function ModernMock() {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '38% 1fr',
      width: '100%', height: 200, overflow: 'hidden', fontFamily: 'sans-serif',
    }}>
      {/* Sidebar */}
      <div style={{ background: '#1e293b', padding: '8px 6px' }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%',
          background: '#2563eb', margin: '0 auto 5px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.6rem', fontWeight: 800, color: '#fff',
        }}>FL</div>
        <div style={{ fontSize: '0.48rem', fontWeight: 800, color: '#fff', textAlign: 'center', marginBottom: 4 }}>
          FIRST LAST
        </div>
        {['CONTACT', 'SKILLS', 'EDUCATION'].map(s => (
          <div key={s} style={{ marginBottom: 5 }}>
            <div style={{ fontSize: '0.36rem', fontWeight: 700, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: 0.5 }}>{s}</div>
            <div style={{ height: 0.5, background: 'rgba(147,197,253,0.35)', margin: '1px 0 2px' }} />
            <div style={{ height: 2, width: '80%', background: 'rgba(255,255,255,0.2)', borderRadius: 1, marginBottom: 2 }} />
            <div style={{ height: 2, width: '60%', background: 'rgba(255,255,255,0.2)', borderRadius: 1 }} />
          </div>
        ))}
      </div>
      {/* Main */}
      <div style={{ background: '#fff', padding: '8px 7px' }}>
        {['ABOUT ME', 'EXPERIENCE', 'PROJECTS'].map(s => (
          <div key={s} style={{ marginBottom: 6 }}>
            <div style={{ fontSize: '0.4rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase' }}>{s}</div>
            <div style={{ height: 1, background: '#2563eb', margin: '1px 0 2px' }} />
            <div style={{ height: 2, width: '90%', background: '#e2e8f0', borderRadius: 1, marginBottom: 1 }} />
            <div style={{ height: 2, width: '70%', background: '#e2e8f0', borderRadius: 1, marginBottom: 1 }} />
            <div style={{ height: 2, width: '80%', background: '#e2e8f0', borderRadius: 1 }} />
          </div>
        ))}
      </div>
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
        <p>All templates are free, ATS-friendly, and export to a clean PDF.</p>
        <div style={{
          display: 'inline-block', marginTop: '0.75rem',
          background: 'rgba(34,211,160,0.1)', border: '1px solid rgba(34,211,160,0.3)',
          color: 'var(--green)', padding: '5px 16px', borderRadius: 20,
          fontSize: '0.82rem', fontWeight: 600,
        }}>
          ✓ 100% free — no upgrade needed
        </div>
      </div>

      <div className="templates-grid">
        {TEMPLATES.map(tpl => (
          <div
            key={tpl.id}
            className={`tpl-card${tpl.recommended ? ' recommended' : ''}`}
          >
            {tpl.recommended && (
              <div className="tpl-recommended-badge">⭐ Recommended</div>
            )}
            <div className="tpl-preview">
              {tpl.type === 'modern'
                ? <ModernMock />
                : <SerifMock accent={tpl.accent} nameColor={tpl.nameColor} />
              }
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