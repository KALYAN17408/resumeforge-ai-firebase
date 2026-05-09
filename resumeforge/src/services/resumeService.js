/**
 * resumeService.js
 * Firestore CRUD for resumes
 * Supports Harvard + Stanford templates
 */

import { db } from '../firebase/config';
import {
  collection, doc, getDoc, getDocs,
  addDoc, setDoc, deleteDoc,
  query, where, orderBy,
} from 'firebase/firestore';

const COLLECTION = 'resumes';
const DEFAULT_TEMPLATE = 'harvard';

/* ───────────── NORMALISE ───────────── */
function normalise(docSnap) {
  const d = docSnap.data();

  return {
    id: docSnap.id,
    uid: d.uid || '',

    personalInfo: {
      name:     d.personalInfo?.name     || '',
      title:    d.personalInfo?.title    || '',
      email:    d.personalInfo?.email    || '',
      phone:    d.personalInfo?.phone    || '',
      location: d.personalInfo?.location || '',
      linkedin: d.personalInfo?.linkedin || '',
      website:  d.personalInfo?.website  || '',
    },

    summary: d.summary || '',

    experience: Array.isArray(d.experience)
      ? d.experience.map(e => ({
          role: e.role || '',
          company: e.company || '',
          duration: e.duration || '',
          description: e.description || '',
          location: e.location || '',
        }))
      : [],

    education: Array.isArray(d.education)
      ? d.education.map(e => ({
          degree: e.degree || '',
          school: e.school || '',
          year: e.year || '',
          gpa: e.gpa || '',
          location: e.location || '',
        }))
      : [],

    skills: Array.isArray(d.skills) ? d.skills : [],

    projects: Array.isArray(d.projects)
      ? d.projects.map(p => ({
          name: p.name || '',
          description: p.description || '',
          link: p.link || '',
          tech: p.tech || '',
        }))
      : [],

    awards: Array.isArray(d.awards)
      ? d.awards.map(a => ({
          title: a.title || '',
          org: a.org || '',
          date: a.date || '',
          description: a.description || '',
        }))
      : [],

    template: d.template || DEFAULT_TEMPLATE,

    createdAt: d.createdAt || null,
    updatedAt: d.updatedAt || null,
  };
}

/* ───────────── TO FIRESTORE ───────────── */
function toPayload(data) {
  return {
    personalInfo: {
      name:     data.personalInfo?.name     || '',
      title:    data.personalInfo?.title    || '',
      email:    data.personalInfo?.email    || '',
      phone:    data.personalInfo?.phone    || '',
      location: data.personalInfo?.location || '',
      linkedin: data.personalInfo?.linkedin || '',
      website:  data.personalInfo?.website  || '',
    },

    summary: data.summary || '',

    experience: Array.isArray(data.experience)
      ? data.experience.map(e => ({
          role: e.role || '',
          company: e.company || '',
          duration: e.duration || '',
          description: e.description || '',
          location: e.location || '',
        }))
      : [],

    education: Array.isArray(data.education)
      ? data.education.map(e => ({
          degree: e.degree || '',
          school: e.school || '',
          year: e.year || '',
          gpa: e.gpa || '',
          location: e.location || '',
        }))
      : [],

    skills: Array.isArray(data.skills) ? data.skills : [],

    projects: Array.isArray(data.projects)
      ? data.projects.map(p => ({
          name: p.name || '',
          description: p.description || '',
          link: p.link || '',
          tech: p.tech || '',
        }))
      : [],

    awards: Array.isArray(data.awards)
      ? data.awards.map(a => ({
          title: a.title || '',
          org: a.org || '',
          date: a.date || '',
          description: a.description || '',
        }))
      : [],

    template: data.template || DEFAULT_TEMPLATE,
  };
}

/* ───────────── FETCH ALL ───────────── */
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
    // fallback if index missing
    const q2 = query(
      collection(db, COLLECTION),
      where('uid', '==', uid)
    );

    const snap2 = await getDocs(q2);
    const list = snap2.docs.map(normalise);

    list.sort((a, b) => {
      const ta = new Date(a.updatedAt || 0).getTime();
      const tb = new Date(b.updatedAt || 0).getTime();
      return tb - ta;
    });

    return list;
  }
}

/* ───────────── FETCH ONE ───────────── */
export async function fetchResume(id) {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) throw new Error('Resume not found');
  return normalise(snap);
}

/* ───────────── CREATE ───────────── */
export async function createResume(uid, data) {
  const payload = {
    uid,
    ...toPayload(data),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const ref = await addDoc(collection(db, COLLECTION), payload);
  return { id: ref.id, ...payload };
}

/* ───────────── UPDATE ───────────── */
export async function updateResume(id, data) {
  const payload = {
    ...toPayload(data),
    updatedAt: new Date().toISOString(),
  };

  await setDoc(doc(db, COLLECTION, id), payload, { merge: true });
  return { id, ...payload };
}

/* ───────────── DELETE ───────────── */
export async function deleteResume(id) {
  await deleteDoc(doc(db, COLLECTION, id));
}

/* ───────────── DUPLICATE ───────────── */
export async function duplicateResume(uid, original) {
  const payload = {
    uid,
    ...toPayload(original),

    personalInfo: {
      ...toPayload(original).personalInfo,
      name: (original.personalInfo?.name || 'Resume') + ' (Copy)',
    },

    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const ref = await addDoc(collection(db, COLLECTION), payload);
  return { id: ref.id, ...payload };
}