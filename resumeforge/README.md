# ⚡ ResumeForge AI — Setup Guide

## Tech Stack
- React 18 (Create React App)
- Firebase Authentication (Email/Password)
- Firestore Database
- html2pdf.js (PDF export)
- Netlify (hosting)

---

## Step 1 — Install Dependencies

```bash
npm install
```

---

## Step 2 — Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click **Add Project** → name it `resumeforge-ai`
3. Go to **Project Settings → Your apps → Web (</>)**
4. Register app → copy the config values
5. Copy `.env.example` to `.env` and fill in your values:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

6. **Authentication** → Enable **Email/Password**
7. **Firestore Database** → Create database (start in **production mode**)

---

## Step 3 — Firestore Security Rules

Paste in **Firestore → Rules**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /resumes/{resumeId} {
      allow read, update, delete: if request.auth != null
        && request.auth.uid == resource.data.uid;
      allow create: if request.auth != null;
    }
  }
}
```

---

## Step 4 — Firestore Index (optional but recommended)

If you see an index error in the console, create this composite index:

- Collection: `resumes`
- Fields: `uid` (Ascending), `updatedAt` (Descending)
- Query scope: Collection

Or the app will fall back to client-side sorting automatically.

---

## Step 5 — Run Locally

```bash
npm start
```

Opens at http://localhost:3000

---

## Step 6 — Deploy to Netlify

```bash
npm run build
```

1. Go to https://app.netlify.com/drop
2. Drag the `build/` folder
3. Add environment variables in **Netlify → Site config → Environment variables** (same as your `.env`)
4. Done — live URL instantly

---

## Project Structure

```
resumeforge/
├── public/
│   └── index.html
├── src/
│   ├── firebase/
│   │   └── config.js          ← Firebase init
│   ├── services/
│   │   └── resumeService.js   ← All Firestore CRUD
│   ├── hooks/
│   │   └── AuthContext.js     ← Auth state
│   ├── components/
│   │   ├── Navbar.js/.css
│   │   └── ResumePreview.js/.css  ← 7 templates
│   ├── pages/
│   │   ├── Landing.js/.css
│   │   ├── Login.js
│   │   ├── Signup.js
│   │   ├── Auth.css
│   │   ├── Dashboard.js/.css
│   │   ├── ResumeBuilder.js/.css
│   │   ├── Templates.js/.css
│   │   ├── ATSAnalyser.js/.css  ← Coming Soon
│   │   └── Pricing.js           ← Coming Soon
│   ├── App.js
│   ├── index.js
│   └── index.css
├── netlify.toml
├── package.json
└── .env.example
```

---

## Resume Templates (all free)

| Template | ID | Best For |
|---|---|---|
| Modern Fresher ⭐ | `modern-fresher` | Fresh graduates |
| Simple Clean | `classic` | All industries |
| Modern Edge | `modern` | Tech roles |
| Modern Minimal | `minimal` | Clean aesthetic |
| Two Column Pro | `sidebar` | Experienced pros |
| Executive | `executive` | Senior roles |
| Creative Gradient | `creative` | Design/Marketing |

---

## Features

- ✅ Email/Password signup & login
- ✅ Persistent Firebase sessions
- ✅ Create, edit, duplicate, delete resumes
- ✅ Debounced autosave (1.8s after last keystroke)
- ✅ Save status indicator (Saved / Saving / Unsaved)
- ✅ Unsaved changes warning before leaving page
- ✅ Live preview as you type
- ✅ One-click PDF export
- ✅ 7 professional resume templates
- ✅ Recommended template auto-selected
- ✅ Skeleton loading states
- ✅ Custom delete confirmation modal
- ✅ Duplicate resume button
- ✅ Resumes sorted by latest updated
- ✅ Back to Dashboard button in builder
- ✅ Responsive mobile layout
- ✅ Clickable LinkedIn/portfolio links in PDF
- ✅ Bullet points from newline-separated text
