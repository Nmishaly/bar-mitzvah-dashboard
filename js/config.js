// ─── Firebase Configuration ──────────────────────────────────────────────────
// Credentials are loaded from js/firebase-credentials.js (gitignored).
// Copy js/firebase-credentials.example.js → js/firebase-credentials.js and fill in your values.
// If the file is missing the app runs in local-only mode (no cloud sync).
const FIREBASE_CONFIG = (typeof FIREBASE_CREDENTIALS !== 'undefined' && FIREBASE_CREDENTIALS?.apiKey)
  ? FIREBASE_CREDENTIALS
  : {};

// ─── Feedback Settings ────────────────────────────────────────────────────────
// Set these in js/firebase-credentials.js alongside your Firebase config.
// Defaults to empty (feedback buttons will show "לא הוגדר" if missing).
const FEEDBACK_WHATSAPP = (typeof FIREBASE_CREDENTIALS !== 'undefined' && FIREBASE_CREDENTIALS?.feedbackWhatsapp)
    ? FIREBASE_CREDENTIALS.feedbackWhatsapp : "";
const FEEDBACK_EMAIL = (typeof FIREBASE_CREDENTIALS !== 'undefined' && FIREBASE_CREDENTIALS?.feedbackEmail)
    ? FIREBASE_CREDENTIALS.feedbackEmail : "";
const FEEDBACK_FORM_URL = (typeof FIREBASE_CREDENTIALS !== 'undefined' && FIREBASE_CREDENTIALS?.feedbackFormUrl)
    ? FIREBASE_CREDENTIALS.feedbackFormUrl : "";

// ─── Runtime state ────────────────────────────────────────────────────────────
let firebaseApp = null;
let db = null;
let auth = null;
let isCloudConnected = false;
let isSeeding = false;
