import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const FEATURES = [
  { icon: '🎨', title: 'Professional Templates', desc: 'Choose from beautifully designed templates built to make your resume stand out from the crowd.' },
  { icon: '⚡', title: 'Fast Resume Builder', desc: 'Fill in your details and watch your resume come to life instantly in the live preview panel.' },
  { icon: '✨', title: 'Beautiful Designs', desc: 'Clean, modern layouts crafted to impress both human reviewers and hiring systems.' },
  { icon: '📄', title: 'One-Click PDF Export', desc: 'Download a perfectly formatted PDF resume ready to send to any employer, instantly.' },
  { icon: '♾️', title: 'Unlimited Resumes', desc: 'Create and save as many resumes as you need — tailored for every job you apply to.' },
  { icon: '🆓', title: 'Always Free', desc: 'No credit card. No subscription. No hidden fees. Every feature is completely free, forever.' },
];

const STATS = [
  { value: 'PROFESSIONAL', label: 'Resume templates' },
  { value: '∞', label: 'Resumes allowed' },
  { value: '2 min', label: 'Setup time' },
  { value: '$0', label: 'Cost forever' },
];

export default function Landing() {
  return (
    <div className="landing">

      {/* Hero */}
      <section className="hero">
        <div className="hero-glow" />
        <div className="hero-content">
          <span className="hero-badge">◈ 100% Free Resume Builder</span>
          <h1>
            Build your resume.<br />
            <span className="gradient-text">Get hired faster.</span>
          </h1>
          <p className="hero-sub">
            Create professional resumes quickly using beautiful templates designed
            to help you stand out and get hired.
          </p>

          <div className="hero-actions">
            <Link to="/builder" className="btn btn-primary">
              Build My Resume Free
            </Link>
          </div>

          <div className="hero-note">
            No credit card needed · 100% free resume builder
          </div>
        </div>

        <div className="hero-card">
          <div className="hc-label">Live Preview</div>
          <div className="hc-resume-mock">
            <div className="hrm-header">
              <div className="hrm-name">Your Name Here</div>
              <div className="hrm-title">Software Engineer</div>
              <div className="hrm-contact">
                email@example.com · LinkedIn · Portfolio
              </div>
            </div>

            {['Career Objective', 'Education', 'Projects', 'Technical Skills'].map(s => (
              <div key={s} className="hrm-section">
                <div className="hrm-sec-title">{s}</div>
                <div className="hrm-line full" />
                <div className="hrm-line half" />
              </div>
            ))}
          </div>

          <div className="hc-footer">
            <span className="tag tag-green">✓ PDF Ready</span>
            <span className="tag tag-purple">✓ Free Forever</span>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-strip">
        {STATS.map(s => (
          <div className="stat-item" key={s.label}>
            <div className="stat-val">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Features */}
      <section className="features-section">
        <div className="section-label">What's included</div>
        <h2 className="section-title">
          Everything you need.<br />
          Completely free.
        </h2>

        <div className="features-grid">
          {FEATURES.map(f => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}