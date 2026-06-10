// ─── Firebase Configuration ──────────────────────────────────────────────────
// Replace these values with your own Firebase project credentials.
// See the Settings tab in the app for step-by-step instructions.
const FIREBASE_CONFIG = {
    apiKey: "",
    authDomain: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
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
