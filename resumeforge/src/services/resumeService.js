/**
 * resumeService.js
 * All Firestore database operations for resumes.
 * Single source of truth — Dashboard and ResumeBuilder both import from here.
 */
import { db } from '../firebase/config';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
} from 'firebase/firestore';

const COLLECTION = 'resumes';

/* ── shape normaliser ── */
function normalise(docSnap) {
  const d = docSnap.data();
  return {
    id:          docSnap.id,
    uid:         d.uid          || '',
    personalInfo: d.personalInfo || {},
    summary:     d.summary      || '',
    experience:  Array.isArray(d.experience) ? d.experience : [],
    education:   Array.isArray(d.education)  ? d.education  : [],
    skills:      Array.isArray(d.skills)     ? d.skills     : [],
    projects:    Array.isArray(d.projects)   ? d.projects   : [],
    template:    d.template     || 'modern-fresher',
    createdAt:   d.createdAt    || null,
    updatedAt:   d.updatedAt    || null,
  };
}

/* ── FETCH all resumes for a user, sorted latest first ── */
export async function fetchResumes(uid) {
  try {
    const q = query(
      collection(db, COLLECTION),
      where('uid', '==', uid),
      orderBy('updatedAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map(normalise);
  } catch (err) {
    // Firestore may error if the composite index doesn't exist yet.
    // Fall back to client-side sort.
    if (err.code === 'failed-precondition' || err.message?.includes('index')) {
      const q2 = query(collection(db, COLLECTION), where('uid', '==', uid));
      const snap2 = await getDocs(q2);
      const list = snap2.docs.map(normalise);
      list.sort((a, b) => {
        const ta = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
        const tb = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
        return tb - ta;
      });
      return list;
    }
    throw err;
  }
}

/* ── FETCH single resume by id ── */
export async function fetchResume(id) {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) throw new Error('Resume not found');
  return normalise(snap);
}

/* ── CREATE new resume, returns the full normalised object ── */
export async function createResume(uid, data) {
  const payload = {
    uid,
    personalInfo: data.personalInfo || {},
    summary:      data.summary      || '',
    experience:   Array.isArray(data.experience) ? data.experience : [],
    education:    Array.isArray(data.education)  ? data.education  : [],
    skills:       Array.isArray(data.skills)     ? data.skills     : [],
    projects:     Array.isArray(data.projects)   ? data.projects   : [],
    template:     data.template || 'modern-fresher',
    createdAt:    new Date().toISOString(),
    updatedAt:    new Date().toISOString(),
  };
  const ref = await addDoc(collection(db, COLLECTION), payload);
  return { id: ref.id, ...payload };
}

/* ── UPDATE existing resume ── */
export async function updateResume(id, data) {
  const payload = {
    personalInfo: data.personalInfo || {},
    summary:      data.summary      || '',
    experience:   Array.isArray(data.experience) ? data.experience : [],
    education:    Array.isArray(data.education)  ? data.education  : [],
    skills:       Array.isArray(data.skills)     ? data.skills     : [],
    projects:     Array.isArray(data.projects)   ? data.projects   : [],
    template:     data.template || 'modern-fresher',
    updatedAt:    new Date().toISOString(),
  };
  await setDoc(doc(db, COLLECTION, id), payload, { merge: true });
  return { id, ...payload };
}

/* ── DELETE resume ── */
export async function deleteResume(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}

/* ── DUPLICATE resume ── */
export async function duplicateResume(uid, original) {
  const data = {
    uid,
    personalInfo: {
      ...original.personalInfo,
      name: (original.personalInfo?.name || 'Resume') + ' (Copy)',
    },
    summary:    original.summary    || '',
    experience: Array.isArray(original.experience) ? original.experience : [],
    education:  Array.isArray(original.education)  ? original.education  : [],
    skills:     Array.isArray(original.skills)     ? original.skills     : [],
    projects:   Array.isArray(original.projects)   ? original.projects   : [],
    template:   original.template || 'modern-fresher',
    createdAt:  new Date().toISOString(),
    updatedAt:  new Date().toISOString(),
  };
  const ref = await addDoc(collection(db, COLLECTION), data);
  return { id: ref.id, ...data };
}
