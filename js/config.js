// ─── Firebase Configuration ──────────────────────────────────────────────────
// Replace these values with your own Firebase project credentials.
// See the Settings tab in the app for step-by-step instructions.
const FIREBASE_CONFIG = {
  apiKey: "AIzaSyBchylz1acekza_mDKtOYqnyNU-1KBu4mM",
  authDomain: "bar-mitzvah-dashboard.firebaseapp.com",
  projectId: "bar-mitzvah-dashboard",
  storageBucket: "bar-mitzvah-dashboard.firebasestorage.app",
  messagingSenderId: "708559837499",
  appId: "1:708559837499:web:facdb8096c6c9543a67f1e",
  measurementId: "G-X5QHSBXDKX"
};

// ─── Feedback Settings ────────────────────────────────────────────────────────
// Update these with your actual contact details
const FEEDBACK_WHATSAPP = ""; // e.g. "972521234567"
const FEEDBACK_EMAIL = "netzer7@gmail.com";
const FEEDBACK_FORM_URL = ""; // Google Form URL (optional)

// ─── Runtime state ────────────────────────────────────────────────────────────
let firebaseApp = null;
let db = null;
let auth = null;
let isCloudConnected = false;
let isSeeding = false;
