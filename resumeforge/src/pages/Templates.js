import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Templates.css';

const TEMPLATES = [
  { id:'modern-fresher', name:'Modern Fresher Professional', tag:'⭐ Recommended', tagColor:'green',  desc:'Designed for fresh graduates. Includes Career Objective, Education, Projects, Internships, Technical Skills, and Declaration.', recommended:true,  accent:'#7c6aff' },
  { id:'classic',        name:'Simple Clean',                tag:'Classic',        tagColor:'purple', desc:'Clean, professional, universally accepted single-column layout. Works for every industry and role.',                           recommended:false, accent:'#7c6aff' },
  { id:'modern',         name:'Modern Edge',                 tag:'Bold',           tagColor:'purple', desc:'Bold accent bar with timeline layout. Stands out while staying fully professional.',                                         recommended:false, accent:'#7c6aff' },
  { id:'minimal',        name:'Modern Minimal',              tag:'Clean & Sharp',  tagColor:'purple', desc:'Pure typography, perfect spacing, zero noise. Let your content do the talking.',                                            recommended:false, accent:'#444'    },
  { id:'sidebar',        name:'Two Column Professional',     tag:'Popular',        tagColor:'purple', desc:'Dark sidebar with skill bars on the left, experience and projects on the right.',                                          recommended:false, accent:'#2d2354' },
  { id:'executive',      name:'Executive',                   tag:'Senior Roles',   tagColor:'gold',   desc:'Commanding, authoritative design built for leadership and senior-level positions.',                                        recommended:false, accent:'#7c6aff' },
  { id:'creative',       name:'Creative Gradient',           tag:'Stand Out',      tagColor:'gold',   desc:'Gradient header, bold colours. Perfect for design, marketing, and creative roles.',                                       recommended:false, accent:'#a78bfa' },
];

function TemplateMock({ id, accent }) {
  if (id === 'modern-fresher') return (
    <div className="tmock">
      <div className="tm-header" style={{ borderColor:accent, borderBottom:`2px solid ${accent}`, paddingBottom:5, marginBottom:5, textAlign:'center' }}>
        <div className="tm-name">Full Name</div>
        <div className="tm-title" style={{ color:accent }}>email · phone · location</div>
      </div>
      {['Career Objective','Education','Projects','Technical Skills','Declaration'].map(s => (
        <div key={s}>
          <div className="tm-sec-title" style={{ color:accent, borderColor:`${accent}33`, background:`${accent}11`, paddingLeft:3, borderLeft:`2px solid ${accent}` }}>{s}</div>
          <div className="tm-line full" /><div className="tm-line half" />
        </div>
      ))}
    </div>
  );
  if (id === 'sidebar') return (
    <div className="tmock tmock-sidebar">
      <div className="tm-sidebar-left" style={{ background:'#2d2354' }}>
        <div className="tm-sb-avatar" style={{ background:accent }}>N</div>
        <div style={{ color:'#fff', fontSize:'0.5rem', fontWeight:700, textAlign:'center', marginBottom:2 }}>Your Name</div>
        <div style={{ color:'#a78bfa', fontSize:'0.42rem', textAlign:'center', marginBottom:6 }}>Job Title</div>
        <div className="tm-line light sm" /><div className="tm-line light sm half" /><div className="tm-line light sm" />
      </div>
      <div className="tm-sidebar-right">
        {['Experience','Projects','Education'].map(s => (
          <div key={s}>
            <div className="tm-sec-title" style={{ color:'#2d2354', borderColor:'#7c6aff', fontSize:'0.42rem' }}>{s}</div>
            <div className="tm-line full" /><div className="tm-line half" />
          </div>
        ))}
      </div>
    </div>
  );
  if (id === 'modern') return (
    <div className="tmock tmock-modern">
      <div className="tm-modern-header">
        <div className="tm-modern-bar" style={{ background:accent }} />
        <div className="tm-modern-name-block" style={{ background:`${accent}11` }}>
          <div className="tm-name">Your Name</div>
          <div className="tm-title" style={{ color:accent }}>Job Title</div>
        </div>
        <div className="tm-modern-contact" style={{ background:accent }}>
          <div className="tm-line light sm" /><div className="tm-line light sm" /><div className="tm-line light sm" />
        </div>
      </div>
      {['Experience','Projects','Skills'].map(s => (
        <div key={s} className="tm-modern-section">
          <div className="tm-sec-title" style={{ color:accent }}>{s}</div>
          <div style={{ display:'flex', gap:6 }}>
            <div className="tm-dot" style={{ background:accent }} />
            <div style={{ flex:1 }}><div className="tm-line full" /><div className="tm-line half" /></div>
          </div>
        </div>
      ))}
    </div>
  );
  if (id === 'minimal') return (
    <div className="tmock tmock-minimal">
      <div className="tm-name" style={{ fontSize:'1.1rem', fontWeight:800 }}>Your Name</div>
      <div className="tm-title" style={{ color:'#888' }}>Job Title</div>
      <div className="tm-minimal-divider" />
      {['EXPERIENCE','EDUCATION','SKILLS'].map(s => (
        <div key={s}><div className="tm-minimal-sec">{s}</div><div className="tm-line full" /><div className="tm-line half" /></div>
      ))}
    </div>
  );
  if (id === 'executive') return (
    <div className="tmock tmock-executive">
      <div style={{ textAlign:'center', marginBottom:8 }}>
        <div className="tm-name" style={{ letterSpacing:2, fontSize:'0.85rem' }}>YOUR NAME</div>
        <div className="tm-title" style={{ color:accent }}>Professional Title</div>
        <div style={{ width:30, height:2, background:accent, margin:'5px auto' }} />
        <div className="tm-contact-row" style={{ justifyContent:'center' }}><span /><span /><span /></div>
      </div>
      {['PROFESSIONAL EXPERIENCE','CORE COMPETENCIES'].map(s => (
        <div key={s}><div className="tm-exec-sec">{s}</div><div className="tm-line full" /><div className="tm-line two-thirds" /></div>
      ))}
    </div>
  );
  if (id === 'creative') return (
    <div className="tmock tmock-creative">
      <div className="tm-creative-header" style={{ background:`linear-gradient(135deg,${accent},#7c6aff)` }}>
        <div className="tm-name" style={{ color:'#fff', fontSize:'0.85rem' }}>Your Name</div>
        <div style={{ color:'rgba(255,255,255,0.75)', fontSize:'0.55rem' }}>Job Title</div>
      </div>
      <div className="tm-creative-body">
        {['About','Experience','Skills'].map(s => (
          <div key={s}><div className="tm-sec-title" style={{ color:accent }}>{s}</div><div className="tm-line full" /><div className="tm-line half" /></div>
        ))}
      </div>
    </div>
  );
  // classic default
  return (
    <div className="tmock tmock-classic">
      <div className="tm-header" style={{ borderColor:accent }}>
        <div className="tm-name">Your Name</div>
        <div className="tm-title" style={{ color:accent }}>Job Title</div>
        <div className="tm-contact-row"><span /><span /><span /></div>
      </div>
      {['Experience','Education','Skills'].map(s => (
        <div key={s}><div className="tm-sec-title" style={{ color:accent, borderColor:`${accent}33` }}>{s}</div><div className="tm-line full" /><div className="tm-line half" /><div className="tm-line two-thirds" /></div>
      ))}
    </div>
  );
}

export default function Templates() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  return (
    <div className="templates-page">
      <div className="tpl-hero">
        <div className="section-label">Template Gallery</div>
        <h1>Pick your <span style={{ color:'var(--accent2)' }}>perfect design</span></h1>
        <p>All templates are free, export cleanly to PDF, and work for any industry.</p>
        <div style={{ display:'inline-block', marginTop:'0.75rem', background:'rgba(34,211,160,0.1)', border:'1px solid rgba(34,211,160,0.3)', color:'var(--green)', padding:'5px 16px', borderRadius:20, fontSize:'0.82rem', fontWeight:600 }}>
          ✓ All templates are 100% free — no upgrade needed
        </div>
      </div>

      <div className="templates-grid">
        {TEMPLATES.map(tpl => (
          <div
            key={tpl.id}
            className={`tpl-card${selected===tpl.id?' selected':''}${tpl.recommended?' recommended':''}`}
            onClick={() => setSelected(tpl.id)}
          >
            {tpl.recommended && <div className="tpl-recommended-badge">⭐ Recommended</div>}
            <div className="tpl-preview"><TemplateMock id={tpl.id} accent={tpl.accent} /></div>
            <div className="tpl-info">
              <div className="tpl-info-top">
                <div className="tpl-name">{tpl.name}</div>
                <span className={`tag tag-${tpl.tagColor}`}>{tpl.tag}</span>
              </div>
              <p className="tpl-desc">{tpl.desc}</p>
              <button className="btn btn-primary btn-sm"
                onClick={e => { e.stopPropagation(); navigate(`/builder?template=${tpl.id}`); }}>
                {tpl.recommended ? '⭐ Use This Template' : 'Use Template →'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
