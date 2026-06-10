// ─── Firebase Configuration ──────────────────────────────────────────────────
// Credentials are loaded from js/firebase-credentials.js (gitignored).
// Copy js/firebase-credentials.example.js → js/firebase-credentials.js and fill in your values.
// If the file is missing the app runs in local-only mode (no cloud sync).
const FIREBASE_CONFIG = (typeof FIREBASE_CREDENTIALS !== 'undefined' && FIREBASE_CREDENTIALS?.apiKey)
  ? FIREBASE_CREDENTIALS
  : {};

// ─── Feedback Settings ────────────────────────────────────────────────────────
// Update these with your actual contact details
const FEEDBACK_WHATSAPP = "972524773764"; // e.g. "972521234567"
const FEEDBACK_EMAIL = "netzer7@gmail.com";
//const FEEDBACK_FORM_URL = ""; // Google Form URL (optional)

// ─── Runtime state ────────────────────────────────────────────────────────────
let firebaseApp = null;
let db = null;
let auth = null;
let isCloudConnected = false;
let isSeeding = false;
