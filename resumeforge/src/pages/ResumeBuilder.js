import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/AuthContext';
import { fetchResume, createResume, updateResume } from '../services/resumeService';
import ResumePreview from '../components/ResumePreview';
import './ResumeBuilder.css';

// FIX: added location to experience and education initial objects
const EMPTY = {
  personalInfo: {
    name: '', title: '', email: '', phone: '',
    location: '', linkedin: '', website: '',
  },
  summary:    '',
  experience: [],
  education:  [],
  skills:     [],
  projects:   [],
  template:   'modern-fresher',
};

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function Toast({ msg, type, onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);
  return <div className={`toast ${type}`}>{msg}</div>;
}

export default function ResumeBuilder() {
  const { id }   = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [data, setData] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return { ...EMPTY, template: params.get('template') || 'modern-fresher' };
  });

  const [tab,          setTab]          = useState('personal');
  const [saveStatus,   setSaveStatus]   = useState('saved');
  const [exporting,    setExporting]    = useState(false);
  const [toast,        setToast]        = useState(null);
  const [resumeId,     setResumeId]     = useState(id || null);
  const [skillInput,   setSkillInput]   = useState('');
  const [fetchLoading, setFetchLoading] = useState(!!id);
  const previewRef  = useRef(null);
  const isSavingRef = useRef(false);
  const isFirstLoad = useRef(true);

  const showToast = (msg, type = 'success') => setToast({ msg, type });

  /* ── Load existing resume ── */
  useEffect(() => {
    if (!id) { setFetchLoading(false); return; }
    let cancelled = false;
    setFetchLoading(true);
    fetchResume(id)
      .then(resume => {
        if (cancelled) return;
        if (resume.uid !== user.uid) {
          navigate('/dashboard', { replace: true });
          return;
        }
        // FIX: normalise every array field and ensure location exists
        setData({
          ...EMPTY,
          ...resume,
          personalInfo: {
            name: '', title: '', email: '', phone: '',
            location: '', linkedin: '', website: '',
            ...resume.personalInfo,
          },
          experience: Array.isArray(resume.experience)
            ? resume.experience.map(e => ({ role:'', company:'', duration:'', description:'', location:'', ...e }))
            : [],
          education: Array.isArray(resume.education)
            ? resume.education.map(e => ({ degree:'', school:'', year:'', gpa:'', location:'', ...e }))
            : [],
          skills:   Array.isArray(resume.skills)   ? resume.skills   : [],
          projects: Array.isArray(resume.projects)
            ? resume.projects.map(p => ({ name:'', description:'', link:'', tech:'', ...p }))
            : [],
        });
        setSaveStatus('saved');
      })
      .catch(err => {
        if (cancelled) return;
        console.error('fetchResume:', err);
        showToast('Failed to load resume.', 'error');
        navigate('/dashboard', { replace: true });
      })
      .finally(() => { if (!cancelled) setFetchLoading(false); });
    return () => { cancelled = true; };
  }, [id, user.uid, navigate]);

  /* ── Mark unsaved on data change (skip initial load) ── */
  useEffect(() => {
    if (isFirstLoad.current) { isFirstLoad.current = false; return; }
    setSaveStatus('unsaved');
  }, [data]);

  /* ── Core save ── */
  const save = useCallback(async (currentData, currentResumeId) => {
    if (isSavingRef.current) return;
    isSavingRef.current = true;
    setSaveStatus('saving');
    try {
      if (currentResumeId) {
        await updateResume(currentResumeId, currentData);
      } else {
        const created = await createResume(user.uid, currentData);
        setResumeId(created.id);
        window.history.replaceState({}, '', `/builder/${created.id}`);
      }
      setSaveStatus('saved');
    } catch (err) {
      console.error('save:', err);
      setSaveStatus('error');
      showToast('Save failed. Check your connection.', 'error');
    } finally {
      isSavingRef.current = false;
    }
  }, [user.uid]);

  /* ── Debounced autosave ── */
  const debouncedData = useDebounce(data, 1800);
  useEffect(() => {
    if (fetchLoading || isFirstLoad.current) return;
    if (saveStatus === 'saved') return;
    save(debouncedData, resumeId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedData]);

  /* ── Warn before leaving if unsaved ── */
  useEffect(() => {
    const handler = (e) => {
      if (saveStatus === 'unsaved' || saveStatus === 'saving') {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [saveStatus]);

  /* ── PDF Export ── */
  const exportPDF = async () => {
    setExporting(true);
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const el = previewRef.current;
      if (!el) { showToast('Preview not ready.', 'error'); return; }
      const filename = (data.personalInfo?.name || 'resume')
        .replace(/[^a-z0-9]/gi, '_');
      await html2pdf().set({
        margin:      0,
        filename:    `${filename}.pdf`,
        image:       { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF:       { unit: 'mm', format: 'a4', orientation: 'portrait' },
      }).from(el).save();
      showToast('PDF downloaded!');
    } catch (err) {
      console.error('exportPDF:', err);
      showToast('Export failed. Try again.', 'error');
    } finally {
      setExporting(false);
    }
  };

  /* ── Array helpers ── */
  // FIX: addExp and addEdu now include location field
  const addExp = () => setData(d => ({
    ...d,
    experience: [
      ...d.experience,
      { role: '', company: '', duration: '', description: '', location: '' },
    ],
  }));

  const addEdu = () => setData(d => ({
    ...d,
    education: [
      ...d.education,
      { degree: '', school: '', year: '', gpa: '', location: '' },
    ],
  }));

  const addProject = () => setData(d => ({
    ...d,
    projects: [
      ...d.projects,
      { name: '', description: '', link: '', tech: '' },
    ],
  }));

  const addSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      const s = skillInput.trim();
      setData(d => ({
        ...d,
        skills: Array.isArray(d.skills) ? [...d.skills, s] : [s],
      }));
      setSkillInput('');
    }
  };

  const removeExp     = (i) => setData(d => ({ ...d, experience: d.experience.filter((_, j) => j !== i) }));
  const removeEdu     = (i) => setData(d => ({ ...d, education:  d.education.filter((_, j)  => j !== i) }));
  const removeProject = (i) => setData(d => ({ ...d, projects:   d.projects.filter((_, j)   => j !== i) }));
  const removeSkill   = (i) => setData(d => ({
    ...d,
    skills: (Array.isArray(d.skills) ? d.skills : []).filter((_, j) => j !== i),
  }));

  // FIX: all updaters use functional form — no stale closure
  const updateExp     = (i, f, v) => setData(d => { const a = [...d.experience]; a[i] = { ...a[i], [f]: v }; return { ...d, experience: a }; });
  const updateEdu     = (i, f, v) => setData(d => { const a = [...d.education];  a[i] = { ...a[i], [f]: v }; return { ...d, education:  a }; });
  const updateProject = (i, f, v) => setData(d => { const a = [...d.projects];   a[i] = { ...a[i], [f]: v }; return { ...d, projects:   a }; });

  // FIX: personal info updater — all fields go through the same handler
  const updatePersonal = (field, value) =>
    setData(d => ({ ...d, personalInfo: { ...d.personalInfo, [field]: value } }));

  const SaveIndicator = () => {
    const map = {
      saved:   { icon: '✓', text: 'Saved',      color: 'var(--green)'   },
      unsaved: { icon: '●', text: 'Unsaved',    color: 'var(--gold)'    },
      saving:  { icon: '↻', text: 'Saving…',    color: 'var(--accent2)' },
      error:   { icon: '✕', text: 'Save error', color: 'var(--red)'     },
    };
    const s = map[saveStatus] || map.saved;
    return (
      <span className={`save-indicator ${saveStatus}`} style={{ color: s.color }}>
        <span className={saveStatus === 'saving' ? 'spin-icon' : ''}>{s.icon}</span> {s.text}
      </span>
    );
  };

  const TABS = ['personal', 'summary', 'experience', 'education', 'skills', 'projects'];

  if (fetchLoading) {
    return (
      <div className="builder-loading">
        <div className="spinner" />
        <p>Loading your resume…</p>
      </div>
    );
  }

  return (
    <div className="builder">
      {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      {/* ── Left panel: Form ── */}
      <div className="builder-form">
        <div className="bf-header">
          <div className="bf-header-left">
            <Link to="/dashboard" className="back-btn">← Dashboard</Link>
            <h2>Resume Builder</h2>
          </div>
          <div className="bf-actions">
            <SaveIndicator />
           <select
  value={data.template}
  onChange={e => setData(d => ({ ...d, template: e.target.value }))}
  style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.82rem' }}
>
  <option value="modern-fresher">Harvard Style ⭐</option>
</select>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => save(data, resumeId)}
              disabled={saveStatus === 'saving'}
            >
              {saveStatus === 'saving' ? '⏳' : '💾'} Save
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={exportPDF}
              disabled={exporting}
            >
              {exporting ? '⏳ Exporting…' : '📥 Export PDF'}
            </button>
          </div>
        </div>

        <div className="bf-tabs">
          {TABS.map(t => (
            <button
              key={t}
              className={`bf-tab ${tab === t ? 'active' : ''}`}
              onClick={() => setTab(t)}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="bf-content">

          {/* ── Personal Information ── */}
          {tab === 'personal' && (
            <div className="form-section">
              <h3>Personal Information</h3>
              <p className="form-hint">
               
              </p>

              <div className="form-group">
                <label>Full Name <span className="req">*</span></label>
                <input
                  type="text"
                  placeholder="e.g. Kalyan Chandana"
                  value={data.personalInfo.name || ''}
                  onChange={e => updatePersonal('name', e.target.value)}
                />
              </div>

              {/* FIX: Job Title — was missing onChange in some versions */}
              <div className="form-group">
                <label>Job Title</label>
                <input
                  type="text"
                  placeholder="e.g. Software Engineer"
                  value={data.personalInfo.title || ''}
                  onChange={e => updatePersonal('title', e.target.value)}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={data.personalInfo.email || ''}
                    onChange={e => updatePersonal('email', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    placeholder="+1 123-456-7890"
                    value={data.personalInfo.phone || ''}
                    onChange={e => updatePersonal('phone', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  placeholder="e.g. Hyderabad, India"
                  value={data.personalInfo.location || ''}
                  onChange={e => updatePersonal('location', e.target.value)}
                />
              </div>

              {/* FIX: LinkedIn — dedicated field with clear label */}
              <div className="form-group">
                <label>LinkedIn Profile URL</label>
                <input
                  type="text"
                  placeholder="linkedin.com/in/yourname"
                  value={data.personalInfo.linkedin || ''}
                  onChange={e => updatePersonal('linkedin', e.target.value)}
                />
                <p className="field-hint">Will appear as a clickable link in the resume</p>
              </div>

              {/* FIX: Portfolio/Website — dedicated field with clear label */}
              <div className="form-group">
                <label>Portfolio / Website</label>
                <input
                  type="text"
                  placeholder="github.com/yourname or yoursite.com"
                  value={data.personalInfo.website || ''}
                  onChange={e => updatePersonal('website', e.target.value)}
                />
                <p className="field-hint">Will appear as a clickable link in the resume</p>
              </div>
            </div>
          )}

          {/* ── Summary / Objective ── */}
          {tab === 'summary' && (
            <div className="form-section">
              <h3>Career Objective / Summary</h3>
              <p className="form-hint">
                Write 2–3 sentences about your background, skills, and career goals.
              </p>
              <textarea
                placeholder="Bachelor's candidate in Computer Engineering seeking a software engineering role. Experienced in full-stack development with React, Spring Boot, and AWS. Passionate about building scalable, user-focused applications."
                value={data.summary}
                onChange={e => setData(d => ({ ...d, summary: e.target.value }))}
                style={{ minHeight: '140px' }}
              />
            </div>
          )}

          {/* ── Experience ── */}
          {tab === 'experience' && (
            <div className="form-section">
              <div className="fs-header">
                <h3>Work Experience / Internships</h3>
                <button className="btn btn-primary btn-sm" onClick={addExp}>+ Add</button>
              </div>
              <p className="form-hint">Enter one bullet point per line in the Description field.</p>

              {data.experience.map((exp, i) => (
                <div className="form-block" key={i}>
                  <div className="form-block-header">
                    <span>Position {i + 1}</span>
                    <button className="btn btn-sm btn-danger" onClick={() => removeExp(i)}>
                      ✕ Remove
                    </button>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Role / Title</label>
                      <input
                        placeholder="Software Engineer Intern"
                        value={exp.role || ''}
                        onChange={e => updateExp(i, 'role', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Company</label>
                      <input
                        placeholder="Google"
                        value={exp.company || ''}
                        onChange={e => updateExp(i, 'company', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Duration</label>
                      <input
                        placeholder="May 2024 — Aug 2024"
                        value={exp.duration || ''}
                        onChange={e => updateExp(i, 'duration', e.target.value)}
                      />
                    </div>
                    {/* FIX: location field — shows on right side of Harvard template */}
                    <div className="form-group">
                      <label>City, State</label>
                      <input
                        placeholder="San Francisco, CA"
                        value={exp.location || ''}
                        onChange={e => updateExp(i, 'location', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Description — one bullet per line</label>
                    <textarea
                      placeholder={
                        'Built REST APIs handling 10,000+ daily requests\n' +
                        'Reduced query latency by 40% using Redis caching\n' +
                        'Collaborated in a team of 6 using Agile and Git'
                      }
                      value={exp.description || ''}
                      onChange={e => updateExp(i, 'description', e.target.value)}
                      style={{ minHeight: '100px' }}
                    />
                  </div>
                </div>
              ))}

              {data.experience.length === 0 && (
                <div className="empty-block">
                  No experience added yet. Click "+ Add" to start.
                </div>
              )}
            </div>
          )}

          {/* ── Education ── */}
          {tab === 'education' && (
            <div className="form-section">
              <div className="fs-header">
                <h3>Education</h3>
                <button className="btn btn-primary btn-sm" onClick={addEdu}>+ Add</button>
              </div>

              {data.education.map((edu, i) => (
                <div className="form-block" key={i}>
                  <div className="form-block-header">
                    <span>Degree {i + 1}</span>
                    <button className="btn btn-sm btn-danger" onClick={() => removeEdu(i)}>
                      ✕ Remove
                    </button>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>College / University</label>
                      <input
                        placeholder="IIT Hyderabad"
                        value={edu.school || ''}
                        onChange={e => updateEdu(i, 'school', e.target.value)}
                      />
                    </div>
                    {/* FIX: year on right side — matches Harvard two-column layout */}
                    <div className="form-group">
                      <label>Year / Duration</label>
                      <input
                        placeholder="Jan 2021 — May 2025"
                        value={edu.year || ''}
                        onChange={e => updateEdu(i, 'year', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Degree / Course</label>
                      <input
                        placeholder="B.Tech Computer Science, Minor in AI"
                        value={edu.degree || ''}
                        onChange={e => updateEdu(i, 'degree', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>GPA / Percentage</label>
                      <input
                        placeholder="3.9/4.0"
                        value={edu.gpa || ''}
                        onChange={e => updateEdu(i, 'gpa', e.target.value)}
                      />
                    </div>
                  </div>

                  {/* FIX: city/state shows on right of second row in Harvard template */}
                  <div className="form-group">
                    <label>City, State</label>
                    <input
                      placeholder="Hyderabad, India"
                      value={edu.location || ''}
                      onChange={e => updateEdu(i, 'location', e.target.value)}
                    />
                  </div>
                </div>
              ))}

              {data.education.length === 0 && (
                <div className="empty-block">No education added yet.</div>
              )}
            </div>
          )}

          {/* ── Skills ── */}
          {tab === 'skills' && (
            <div className="form-section">
              <h3>Technical Skills</h3>
              <p className="form-hint">
                Add each skill separately. They will be shown as a list in the resume.
              </p>

              <div className="form-group">
                <label>Type a skill and press Enter</label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    placeholder="e.g. React, Python, AWS, Docker…"
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={addSkill}
                  />
                  <button
                    className="btn btn-primary btn-sm"
                    style={{ whiteSpace: 'nowrap' }}
                    onClick={() => {
                      if (skillInput.trim()) {
                        const s = skillInput.trim();
                        setData(d => ({
                          ...d,
                          skills: Array.isArray(d.skills) ? [...d.skills, s] : [s],
                        }));
                        setSkillInput('');
                      }
                    }}
                  >
                    + Add
                  </button>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text3)', marginTop: '4px' }}>
                  Press Enter or click Add
                </p>
              </div>

              {Array.isArray(data.skills) && data.skills.length > 0 ? (
                <div className="skills-list">
                  {data.skills.map((s, i) => (
                    <span className="skill-chip" key={`skill-${i}-${s}`}>
                      {s}
                      <button onClick={() => removeSkill(i)} aria-label={`Remove ${s}`}>×</button>
                    </span>
                  ))}
                </div>
              ) : (
                <div className="empty-block">No skills added yet.</div>
              )}
            </div>
          )}

          {/* ── Projects ── */}
          {tab === 'projects' && (
            <div className="form-section">
              <div className="fs-header">
                <h3>Projects</h3>
                <button className="btn btn-primary btn-sm" onClick={addProject}>+ Add</button>
              </div>
              <p className="form-hint">Enter one bullet point per line in the Description field.</p>

              {data.projects.map((p, i) => (
                <div className="form-block" key={i}>
                  <div className="form-block-header">
                    <span>Project {i + 1}</span>
                    <button className="btn btn-sm btn-danger" onClick={() => removeProject(i)}>
                      ✕ Remove
                    </button>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Project Name</label>
                      <input
                        placeholder="Smart Campus Scheduler"
                        value={p.name || ''}
                        onChange={e => updateProject(i, 'name', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Tech Stack</label>
                      <input
                        placeholder="ReactJS, Spring Boot, PostgreSQL"
                        value={p.tech || ''}
                        onChange={e => updateProject(i, 'tech', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>GitHub / Live Link</label>
                    <input
                      placeholder="github.com/yourname/project"
                      value={p.link || ''}
                      onChange={e => updateProject(i, 'link', e.target.value)}
                    />
                  </div>

                  <div className="form-group">
                    <label>Description — one bullet per line</label>
                    <textarea
                      placeholder={
                        'Built a full-stack scheduling app used by 1,000+ students\n' +
                        'Integrated Supabase auth and real-time updates\n' +
                        'Reduced scheduling conflicts by 60% compared to manual process'
                      }
                      value={p.description || ''}
                      onChange={e => updateProject(i, 'description', e.target.value)}
                      style={{ minHeight: '90px' }}
                    />
                  </div>
                </div>
              ))}

              {data.projects.length === 0 && (
                <div className="empty-block">No projects added yet.</div>
              )}
            </div>
          )}

        </div>
      </div>

      {/* ── Right panel: Live Preview ── */}
      <div className="builder-preview">
        <div className="bp-header">
          <span>Live Preview</span>
          <span style={{ fontSize: '0.78rem', color: 'var(--text3)' }}>
            Auto-saves as you type
          </span>
        </div>
        <div className="bp-scroll">
          <div ref={previewRef}>
            <ResumePreview data={data} />
          </div>
        </div>
      </div>
    </div>
  );
}