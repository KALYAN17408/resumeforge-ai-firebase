import React from 'react';
import './ATSAnalyser.css';

export default function Pricing() {
  return (
    <div className="coming-soon-page">
      <div className="cs-icon">💎</div>
      <h1 className="cs-title">Premium Features</h1>
      <p className="cs-text">Advanced features and integrations are coming soon.</p>
      <p className="cs-sub">
        For now, all resume builder features are completely{' '}
        <strong style={{ color: 'var(--accent2)' }}>FREE</strong> — unlimited resumes,
        all templates, PDF export, everything included at no cost.
      </p>
      <div className="cs-badge">Coming Soon...</div>
    </div>
  );
}
