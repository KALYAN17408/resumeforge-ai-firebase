import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import { fetchResumes, deleteResume, duplicateResume } from '../services/resumeService';
import './Dashboard.css';

function SkeletonCard() {
  return (
    <div className="resume-card skeleton-card">
      <div className="rc-preview sk-box" />
      <div className="rc-info">
        <div className="sk-line sk-title" />
        <div className="sk-line sk-date" />
        <div className="sk-line sk-tag" />
      </div>
      <div className="rc-actions">
        <div className="sk-btn" /><div className="sk-btn" /><div className="sk-btn" />
      </div>
    </div>
  );
}

function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <div className="modal-icon">🗑️</div>
        <h3>Delete Resume?</h3>
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
          <button className="btn-danger-solid" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  );
}

function Toast({ msg, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return <div className={`dash-toast ${type}`}>{msg}</div>;
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resumes,     setResumes]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [deleting,    setDeleting]    = useState(null);
  const [confirm,     setConfirm]     = useState(null);
  const [duplicating, setDuplicating] = useState(null);
  const [toast,       setToast]       = useState(null);

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  const loadResumes = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const list = await fetchResumes(user.uid);
      setResumes(list);
    } catch (err) {
      console.error('loadResumes:', err);
      showToast('Failed to load resumes. Please refresh.', 'error');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { loadResumes(); }, [loadResumes]);

  const handleDeleteConfirm = async () => {
    if (!confirm) return;
    const { id } = confirm;
    setDeleting(id); setConfirm(null);
    try {
      await deleteResume(id);
      setResumes(r => r.filter(x => x.id !== id));
      showToast('Resume deleted.');
    } catch (err) {
      console.error('delete:', err);
      showToast('Delete failed. Please try again.', 'error');
    } finally { setDeleting(null); }
  };

  const handleDuplicate = async (r) => {
    setDuplicating(r.id);
    try {
      const copy = await duplicateResume(user.uid, r);
      setResumes(prev => [copy, ...prev]);
      showToast('Resume duplicated!');
    } catch (err) {
      console.error('duplicate:', err);
      showToast('Duplicate failed. Please try again.', 'error');
    } finally { setDuplicating(null); }
  };

  const formatDate = (iso) => {
    if (!iso) return 'Draft';
    try {
      return new Date(iso).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
      });
    } catch { return 'Draft'; }
  };

  const tplLabel = (t) => ({
    'modern-fresher': 'Modern Fresher ⭐',
    'classic':  'Simple Clean',
    'modern':   'Modern Edge',
    'minimal':  'Minimal',
    'sidebar':  'Two Column',
    'executive':'Executive',
    'creative': 'Creative',
  }[t] || t || 'Classic');

  return (
    <div className="dashboard">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
      {confirm && (
        <ConfirmModal
          message={`"${confirm.name || 'This resume'}" will be permanently deleted.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div className="dash-header">
        <div>
          <h1>My Resumes</h1>
          <p className="dash-sub">Welcome back, <strong>{user?.displayName}</strong></p>
        </div>
        <div className="dash-header-actions">
          <span className="plan-chip free">✓ All Features Free</span>
        </div>
      </div>

      <div className="dash-stats">
        <div className="ds-card"><div className="ds-num">{loading ? '—' : resumes.length}</div><div className="ds-label">Resumes Created</div></div>
        <div className="ds-card"><div className="ds-num">∞</div><div className="ds-label">No Limit</div></div>
        <div className="ds-card"><div className="ds-num" style={{color:'var(--green)'}}>✓</div><div className="ds-label">All Templates</div></div>
        <div className="ds-card"><div className="ds-num" style={{color:'var(--green)'}}>✓</div><div className="ds-label">PDF Export</div></div>
      </div>

      <div className="dash-quick">
        <Link to="/builder?template=modern-fresher" className="quick-action">
          <div className="qa-icon">✏️</div>
          <div className="qa-text"><strong>New Resume</strong><span>Start from scratch or pick a template</span></div>
          <span className="qa-arrow">→</span>
        </Link>
        <Link to="/templates" className="quick-action">
          <div className="qa-icon">🎨</div>
          <div className="qa-text"><strong>Browse Templates</strong></div>
          <span className="qa-arrow">→</span>
        </Link>
      </div>

      <div className="dash-section">
        <div className="dash-section-header">
          <h2>Your Resumes {!loading && resumes.length > 0 && <span className="resume-count">({resumes.length})</span>}</h2>
          <Link to="/builder?template=modern-fresher" className="btn btn-primary btn-sm">+ New Resume</Link>
        </div>

        {loading ? (
          <div className="resumes-grid">{[1,2,3].map(i => <SkeletonCard key={i} />)}</div>
        ) : resumes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📄</div>
            <h3>No resumes yet</h3>
            <p>Create your first resume using our free builder and beautiful templates</p>
            <Link to="/builder?template=modern-fresher" className="btn btn-primary" style={{marginTop:'1rem'}}>
              Create Your First Resume
            </Link>
          </div>
        ) : (
          <div className="resumes-grid">
            {resumes.map(r => (
              <div className="resume-card" key={r.id}>
                <div className="rc-preview" onClick={() => navigate(`/builder/${r.id}`)} style={{cursor:'pointer'}}>
                  <div className="rc-mock">
                    <div className="rcm-header">
                      <div className="rcm-name">{r.personalInfo?.name || 'Untitled'}</div>
                      <div className="rcm-title">{r.personalInfo?.title || ''}</div>
                    </div>
                    {r.personalInfo?.email && <div className="rcm-contact">{r.personalInfo.email}</div>}
                    {['Education','Experience','Skills','Projects'].map(s => (
                      <div key={s}>
                        <div className="rcm-section">{s}</div>
                        <div className="rcm-line full" /><div className="rcm-line half" />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rc-info">
                  <div className="rc-name">{r.personalInfo?.name || 'Untitled Resume'}</div>
                  <div className="rc-date"><span className="rc-date-icon">🕐</span>{formatDate(r.updatedAt)}</div>
                  <span className="tag tag-purple rc-template-tag">{tplLabel(r.template)}</span>
                </div>
                <div className="rc-actions">
                  <button className="btn btn-primary btn-sm rc-edit-btn" onClick={() => navigate(`/builder/${r.id}`)}>✏️ Edit</button>
                  <button className="btn btn-outline btn-sm" onClick={() => handleDuplicate(r)} disabled={duplicating === r.id} title="Duplicate">
                    {duplicating === r.id ? '…' : '⧉'}
                  </button>
                  <button className="rc-delete-btn" onClick={() => setConfirm({id:r.id, name:r.personalInfo?.name})} disabled={deleting === r.id} title="Delete">
                    {deleting === r.id ? '…' : '🗑️'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
