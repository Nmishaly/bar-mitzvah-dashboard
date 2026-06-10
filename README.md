# ✡️ Bar Mitzvah Dashboard

> **A complete, mobile-first event planning app for families organizing a Bar Mitzvah — no technical setup required.**

Built in Hebrew (RTL), designed for Israeli families, and accessible from any phone or tablet without installation. Co-organizers sync in real time; guests RSVP through a simple dedicated link.

---

## Overview

Bar Mitzvah Dashboard is a Progressive Web App (PWA) that covers every aspect of Bar Mitzvah planning in one place. One family member creates the event in under a minute, shares a link with other organizers, and shares a separate RSVP link with guests. Everything syncs automatically across all devices.

No accounts. No passwords. No app store. Just open the link and start planning.

---

## Feature Highlights

### Event Management
- **Tasks** — Full task list with deadline-aware urgency grouping (overdue · today · this week · future) and per-person assignment. Comes pre-loaded with 15 smart default tasks, each with a recommended deadline relative to the event date.
- **RSVP & Guests** — Track guest confirmations with adult/child counts, meal preferences, dietary restrictions, sleep arrangements, and baby cot needs.
- **Budget** — Optional spending limit with per-expense tracking, multiple partial payments per expense, and a live progress bar.
- **Shopping List** — Categorized shopping list with a freshness toggle for perishables, batch-purchase mode, and a WhatsApp-ready text export.

### Logistics
- **Room & Accommodation Assignment** — Manage rooms by type (villa / hotel / friends) with capacity tracking and guest assignment. Supports external locations too.
- **Calls & Inquiries** — Checklist of vendor calls (synagogue, caterer, photographer, DJ, etc.) with notes and phone links.
- **Packing Kits** — Organize packing kits by destination with per-item checklists.
- **Event Schedule** — Plan the Shabbat program by meal/day with time slots and speaker names.
- **Menu Planning** — Build the full menu by category (appetizer, main, sides, dessert, drinks) with vegan and gluten-free tags per item.
- **Drinks Calculator** — Enter guest counts per meal and get recommended water and soft drink quantities in bottles and six-packs — with a one-tap "add to shopping list" button.

### Sharing & Collaboration
- **Real-time sync** — All co-organizers (parents, grandparents, event coordinators) see updates instantly through the same event link.
- **Guest RSVP page** — A separate, beautifully designed 3-step confirmation form guests fill out on their phone. No login needed.
- **WhatsApp integration** — One-tap sharing for both the organizer link and the guest RSVP link, with pre-written friendly messages.
- **QR code** — Generate and display a QR code for the RSVP link.

### Data Safety
- **Backup & Restore** — Download all event data as a single JSON file at any time. Restore from that file on any device with one tap.
- **Offline-first** — All data is also saved locally on the device. The app works even without internet; it syncs when the connection returns.

---

## How to Use — Family Guide

*No technical knowledge needed. Follow these steps from your phone.*

### Step 1 — Open the App

Open the link you were given in any browser (Chrome, Safari, Firefox). The app works on phones, tablets, and computers with no installation required.

---

### Step 2 — Create Your Event

The first time you open the app, a setup wizard appears.

1. Enter the **bar mitzvah boy's name**.
2. Choose the **event date** — either pick a calendar date, or select the **Torah portion (Parasha)** and the app will fill in the Shabbat date automatically.
3. Optionally enter a **total budget**.
4. Enter the names of the people who will manage the event together (e.g., Mom, Dad, Grandma).
5. Indicate whether guests will be **sleeping over**, and what type of accommodation (villa, hotel, friends/family homes).
6. Select which **meals** you are hosting (Friday dinner, Saturday morning, Third meal).
7. Tap **"Create My Event"**.

That's it — your dashboard is ready.

---

### Step 3 — Invite Co-Organizers

Go to **Settings** and look for the **"Share with Organizers"** section.

Tap **"Send via WhatsApp"** — a ready-made message with the event link will open in WhatsApp. Send it to anyone who helps manage the event (spouse, parents, coordinator).

When they open the link, they automatically join your event and see everything in real time.

> ⚠️ **Important:** This link gives full edit access to the event. Only share it with people who are organizing — not with guests.

---

### Step 4 — Collect RSVPs from Guests

Go to **Settings** and look for the **"Guest RSVP Link"** section.

Tap **"Send via WhatsApp"** — a ready-made invitation message with the RSVP link will open in WhatsApp. Send it to your guests.

When a guest opens the link they will see a clean, friendly 3-step form:
1. Enter their name
2. Fill in how many adults and children, which meals they are attending, whether they are sleeping over, and any dietary needs
3. Review and confirm

Their response appears in your **RSVP** tab instantly.

---

### Step 5 — Manage Your Event

Use the bottom navigation to move between tabs:

| Tab | What it's for |
|-----|--------------|
| ✅ **Tasks** | Your to-do list. Tap the circle to mark done. Add deadlines and assign tasks to specific people. |
| 👥 **Guests** | See all RSVP responses. Add guests manually too. |
| 💰 **Budget** | Track all expenses and payments. |
| 🛒 **Shopping** | Your shopping list, organized by category. |
| ☰ **More** | Rooms, Calls, Packing, Menu, Schedule, Drinks calculator, Settings |

---

### Backing Up Your Data

Your data is automatically saved on the device and synced to the cloud. For extra safety, you can download a backup file at any time:

1. Open **Settings**
2. Scroll to **"Backup & Restore"**
3. Tap **"Download Backup"** — a file will be saved to your phone
4. To restore, tap **"Restore from Backup"** and select that file

Keep the backup file somewhere safe (Google Drive, WhatsApp saved messages, email to yourself).

---

## Developer Setup

### Requirements

- Any static web server (no backend required)
- A Firebase project for cloud sync (optional — the app includes pre-configured credentials for immediate use)

### Running Locally

```bash
git clone https://github.com/nmishaly/bar-mitzvah-dashboard.git
cd bar-mitzvah-dashboard

# Any simple static server works:
npx serve .
# or
python3 -m http.server 8080
```

Open `http://localhost:8080` in your browser.

> Do **not** open `index.html` directly as a `file://` URL — Firebase module imports require an HTTP server.

### Project Structure

```
bar-mitzvah-dashboard/
├── index.html          # Main dashboard (all tabs)
├── confirm.html        # Guest RSVP page (public-facing)
├── manifest.json       # PWA manifest (installable)
└── js/
    ├── config.js       # Firebase credentials & global state
    ├── parasha.js      # Hebrew calendar & Torah portion lookup (2024–2031)
    ├── setup.js        # Event creation wizard & settings
    ├── api.js          # Firebase Firestore CRUD & real-time listeners
    ├── ui.js           # All rendering functions
    └── app.js          # Business logic, event handlers, state management
```

### Firebase Configuration

The app ships with a shared Firebase project configured in `js/config.js`. For a private deployment (recommended when serving multiple unrelated families), create your own Firebase project:

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and create a new project.
2. Add a Web App and copy the `firebaseConfig` object.
3. Enable **Firestore Database** (start in production mode).
4. Enable **Anonymous Authentication** under Authentication → Sign-in method.
5. Replace the `FIREBASE_CONFIG` values in `js/config.js`.

**Recommended Firestore Security Rules:**

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /events/{eventId}/{document=**} {
      allow read, write: if true;  // eventId acts as the access token
    }
  }
}
```

For stricter isolation, scope rules to authenticated (anonymous) users:

```js
allow read, write: if request.auth != null;
```

### Technology Stack

| Layer | Technology |
|-------|-----------|
| UI | [Tailwind CSS](https://tailwindcss.com) (CDN) |
| Database | [Firebase Firestore](https://firebase.google.com/docs/firestore) v10 (modular SDK) |
| Auth | Firebase Anonymous Authentication |
| Offline | Browser `localStorage` |
| PWA | `manifest.json` with 192px and 512px icons |
| Hebrew calendar | Custom `parasha.js` with exact Rosh Hashana dates 2024–2031 |

### Parasha Data Coverage

The Torah portion lookup in `parasha.js` covers Hebrew years **5785–5791** (Gregorian **2024–2031**). To extend coverage, add entries to the `PARASHA_DATES` object and the `ROSH_HASHANA_DATES` table following the existing pattern.

---

## Feedback & Support

Found a bug or have a feature idea?

- **WhatsApp:** [+972 52 477 3764](https://wa.me/972524773764)
- **Email:** [netzer7@gmail.com](mailto:netzer7@gmail.com)

---

*מזל טוב! 🌟*
