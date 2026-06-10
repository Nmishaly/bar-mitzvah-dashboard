// ─── Firebase API Layer ───────────────────────────────────────────────────────
// Path: events/{eventId}/{collection}/{docId}

const FIREBASE_MODULES = {
    app: 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js',
    auth: 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js',
    firestore: 'https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js'
};

let _eventId = null;
let _unsubscribers = [];

function getCollectionPath(collection) {
    return `events/${_eventId}/${collection}`;
}

// ─── Connect ──────────────────────────────────────────────────────────────────

async function connectToFirebaseWithSetup(setup, joinedExisting = false) {
    _eventId = setup.eventId;

    const hasConfig = FIREBASE_CONFIG.apiKey && FIREBASE_CONFIG.projectId;
    if (!hasConfig) {
        console.warn('[Firebase] No credentials — running local-only. Check js/firebase-credentials.js exists and has apiKey.');
        updateCloudStatus(false);
        return;
    }

    try {
        const [{ initializeApp }, { getAuth, signInAnonymously }, { getFirestore }] = await Promise.all([
            import(FIREBASE_MODULES.app),
            import(FIREBASE_MODULES.auth),
            import(FIREBASE_MODULES.firestore)
        ]);

        firebaseApp = initializeApp(FIREBASE_CONFIG, `bm-${_eventId}`);
        auth = getAuth(firebaseApp);
        db = getFirestore(firebaseApp);

        await signInAnonymously(auth);
        isCloudConnected = true;
        updateCloudStatus(true);

        // Load remote settings if joining existing event
        if (joinedExisting || setup.joinedExisting) {
            await loadRemoteSettings();
        } else {
            // Seed cloud on first creation
            await seedCloud();
        }

        startFirebaseListeners();
    } catch (e) {
        console.error('[Firebase] Connection failed:', e.code, e.message);
        if (e.code === 'auth/configuration-not-found' || e.code === 'auth/operation-not-allowed') {
            console.warn('[Firebase] Anonymous Authentication is not enabled. Enable it at: Firebase Console → Authentication → Sign-in method → Anonymous');
        }
        updateCloudStatus(false);
    }
}

// ─── Load remote settings (for joined events) ─────────────────────────────────

async function loadRemoteSettings() {
    if (!db || !_eventId) return;
    try {
        const { doc, getDoc } = await import(FIREBASE_MODULES.firestore);
        const ref = doc(db, getCollectionPath('_settings'), 'setup');
        const snap = await getDoc(ref);
        if (snap.exists()) {
            const remoteSetup = snap.data();
            saveSetup(remoteSetup);
            updateHeaderFromSetup();
            renderSettingsTab();
        }
    } catch (e) {
        console.error('loadRemoteSettings error:', e);
    }
}

// ─── Seed cloud on first device ──────────────────────────────────────────────

async function seedCloud() {
    if (isSeeding || !db || !_eventId) return;
    isSeeding = true;

    try {
        const { doc, getDoc, writeBatch, serverTimestamp } = await import(FIREBASE_MODULES.firestore);

        // Lock check — prevent race on multiple devices
        const lockRef = doc(db, getCollectionPath('_settings'), '_seed_lock');
        const lockSnap = await getDoc(lockRef);
        if (lockSnap.exists()) { isSeeding = false; return; }

        const batch = writeBatch(db);

        // Write lock
        batch.set(lockRef, { seededAt: serverTimestamp() });

        // Write setup
        const setup = getSetup();
        if (setup) {
            batch.set(doc(db, getCollectionPath('_settings'), 'setup'), setup);
        }

        // Write default collections
        const collections = {
            tasks, shopping, calls
        };

        for (const [col, items] of Object.entries(collections)) {
            if (!items) continue;
            items.forEach(item => {
                batch.set(doc(db, getCollectionPath(col), item.id), item);
            });
        }

        await batch.commit();
    } catch (e) {
        console.error('seedCloud error:', e);
    } finally {
        isSeeding = false;
    }
}

// ─── Real-time listeners ──────────────────────────────────────────────────────

async function startFirebaseListeners() {
    if (!db || !_eventId) return;

    // Unsubscribe old listeners
    _unsubscribers.forEach(fn => fn());
    _unsubscribers = [];

    const { collection, onSnapshot } = await import(FIREBASE_MODULES.firestore);

    const watchCollection = (colName, onData) => {
        const ref = collection(db, getCollectionPath(colName));
        const unsub = onSnapshot(ref, snap => {
            const items = [];
            snap.forEach(d => items.push({ ...d.data(), id: d.id }));
            onData(items);
        }, err => console.error(`${colName} listener error:`, err));
        _unsubscribers.push(unsub);
    };

    watchCollection('tasks', data => {
        if (data.length) { tasks = data; saveLocalState(); renderTasks(); renderRecentTasks(); }
    });
    watchCollection('rsvps', data => {
        rsvps = data; saveLocalState(); renderRsvps();
    });
    watchCollection('shopping', data => {
        if (data.length) { shopping = data; saveLocalState(); renderShopping(); }
    });
    watchCollection('calls', data => {
        if (data.length) { calls = data; saveLocalState(); renderCalls(); }
    });
    watchCollection('rooms', data => {
        rooms = data; saveLocalState(); renderRooms();
    });
    watchCollection('externalLocations', data => {
        externalLocations = data; saveLocalState(); renderRooms();
    });
    watchCollection('budget', data => {
        budget = data; saveLocalState(); renderBudget();
    });
    watchCollection('logistics', data => {
        logistics = data; saveLocalState(); renderLogistics();
    });
    watchCollection('menu', data => {
        menu = data; saveLocalState(); renderMenu();
    });
    watchCollection('schedule', data => {
        schedule = data; saveLocalState(); renderSchedule();
    });
    watchCollection('_settings', data => {
        const setupDoc = data.find(d => d.id === 'setup');
        if (setupDoc) {
            const { id, ...setupData } = setupDoc;
            const local = getSetup();
            // Only overwrite if remote is newer (has required fields)
            if (setupData.boyName && setupData.eventId === _eventId) {
                saveSetup(setupData);
                updateHeaderFromSetup();
            }
        }
    });
}

// ─── CRUD helpers ─────────────────────────────────────────────────────────────

async function dbSet(collection, docId, data) {
    if (!db || !_eventId) return;
    try {
        const { doc, setDoc } = await import(FIREBASE_MODULES.firestore);
        await setDoc(doc(db, getCollectionPath(collection), docId), data);
    } catch (e) { console.error('dbSet error:', e); }
}

async function dbUpdate(collection, docId, data) {
    if (!db || !_eventId) return;
    try {
        const { doc, updateDoc } = await import(FIREBASE_MODULES.firestore);
        await updateDoc(doc(db, getCollectionPath(collection), docId), data);
    } catch (e) {
        // Fall back to set with merge
        try {
            const { doc, setDoc } = await import(FIREBASE_MODULES.firestore);
            await setDoc(doc(db, getCollectionPath(collection), docId), data, { merge: true });
        } catch (e2) { console.error('dbUpdate fallback error:', e2); }
    }
}

async function dbDelete(collection, docId) {
    if (!db || !_eventId) return;
    try {
        const { doc, deleteDoc } = await import(FIREBASE_MODULES.firestore);
        await deleteDoc(doc(db, getCollectionPath(collection), docId));
    } catch (e) { console.error('dbDelete error:', e); }
}

// ─── Cloud status UI ─────────────────────────────────────────────────────────

function updateCloudStatus(connected) {
    isCloudConnected = connected;
    const dot = document.getElementById('cloudDot');
    const label = document.getElementById('cloudLabel');
    if (dot) dot.className = `w-2.5 h-2.5 rounded-full ${connected ? 'bg-emerald-400' : 'bg-slate-300'}`;
    if (label) label.textContent = connected ? 'מחובר לענן' : 'מקומי בלבד';

    const sDot = document.getElementById('settingsCloudDot');
    const sStatus = document.getElementById('settingsCloudStatus');
    const sDesc = document.getElementById('settingsCloudDesc');
    if (sDot) sDot.className = `w-3 h-3 rounded-full ${connected ? 'bg-emerald-400' : 'bg-slate-300'}`;
    if (sStatus) sStatus.textContent = connected ? 'מחובר לענן' : 'מקומי בלבד';
    if (sDesc) sDesc.textContent = connected
        ? 'הנתונים מסונכרנים בזמן אמת עם כל בני המשפחה'
        : 'הנתונים נשמרים במכשיר זה בלבד — גבו את הנתונים מטה';

    // Desktop sidebar cloud dot
    const sbDot = document.getElementById('sidebarCloudDot');
    const sbLabel = document.getElementById('sidebarCloudLabel');
    if (sbDot) sbDot.className = `w-2 h-2 rounded-full shrink-0 ${connected ? 'bg-emerald-400' : 'bg-slate-500'}`;
    if (sbLabel) sbLabel.textContent = connected ? 'מחובר לענן' : 'מקומי בלבד';
}
