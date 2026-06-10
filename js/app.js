console.log("Bar Mitzvah Dashboard - Generic v1.0");

// ─── Default Generic Data ─────────────────────────────────────────────────────

const DEFAULT_TASKS = [
    { id:"t1", title:"הזמנת צלם לאירוע", deadline:"", status:"todo", notes:"לבקש המלצות מחברים שעשו בר מצווה", category:"main", responsible:"", createdAt:Date.now()-3600000*24 },
    { id:"t2", title:"הזמנת מוזיקאי / דיג'יי לאירוע", deadline:"", status:"todo", notes:"", category:"main", responsible:"", createdAt:Date.now()-3600000*23 },
    { id:"t3", title:"בחירה ואישור של מקום האירוע", deadline:"", status:"todo", notes:"", category:"main", responsible:"", createdAt:Date.now()-3600000*22 },
    { id:"t4", title:"שליחת הזמנות לאורחים", deadline:"", status:"todo", notes:"לשלוח לפחות 6 שבועות לפני", category:"main", responsible:"", createdAt:Date.now()-3600000*20 },
    { id:"t5", title:"קניית ביגוד לכל בני המשפחה", deadline:"", status:"todo", notes:"", category:"main", responsible:"", createdAt:Date.now()-3600000*18 },
    { id:"t6", title:"כתיבת נאום / ברכת ההורים", deadline:"", status:"todo", notes:"", category:"main", responsible:"", createdAt:Date.now()-3600000*15 },
    { id:"t7", title:"חזרות ותרגול של הבן על דרשת הבר מצווה", deadline:"", status:"todo", notes:"לוודא שמרגיש בנוח ובטוח", category:"main", responsible:"", createdAt:Date.now()-3600000*12 },
    { id:"t8", title:"תיאום עם גבאי בית הכנסת", deadline:"", status:"todo", notes:"עליות לתורה, תזמון הדרשה", category:"main", responsible:"", createdAt:Date.now()-3600000*10 },
    { id:"t9", title:"הכנת תוכן לאירוע (נאומים, הפתעות)", deadline:"", status:"todo", notes:"", category:"main", responsible:"", createdAt:Date.now()-3600000*8 },
    { id:"t10", title:"ריכוז אישורי הגעה סופי", deadline:"", status:"todo", notes:"", category:"main", responsible:"", createdAt:Date.now()-3600000*6 },
    { id:"t11", title:"חישוב כמויות שתייה לפי מספר אורחים", deadline:"", status:"todo", notes:"", category:"main", responsible:"", createdAt:Date.now()-3600000*4 },
    { id:"t12", title:"ביצוע קניות שבת (כלים, שתייה, מזכרות)", deadline:"", status:"todo", notes:"", category:"main", responsible:"", createdAt:Date.now()-3600000*2 },
    { id:"t13", title:"הכנת חלוקת חדרים לאורחים הלנים", deadline:"", status:"todo", notes:"", category:"main", responsible:"", createdAt:Date.now()-3600000*1 },
    { id:"t14", title:"הכנת מזכרות / מתנות לאורחים", deadline:"", status:"todo", notes:"", category:"main", responsible:"", createdAt:Date.now()-3600000*0.5 },
    { id:"t15", title:"הכנת תוכנייה / עלון לאירוע", deadline:"", status:"todo", notes:"", category:"main", responsible:"", createdAt:Date.now()-3600000*0.3 },
];

const DEFAULT_SHOPPING = [
    { id:"s1", title:"מפות שולחן, מפיות, מגבות", category:"disposable", bought:false },
    { id:"s2", title:"צלחות חד פעמיות (מנה ראשונה + עיקרית + קינוח), קערות, כוסות, סכו\"ם", category:"disposable", bought:false },
    { id:"s3", title:"שתייה קלה מגוונת (קולה, מיצים, מים מוגזים)", category:"drinks", bought:false },
    { id:"s4", title:"מיץ ענבים / יין לקידוש", category:"drinks", bought:false },
    { id:"s5", title:"ערכת קפה ותה (קפה, תה, סוכר, חלב/מלבין)", category:"drinks", bought:false },
    { id:"s6", title:"סוכריות לזריקה בבית הכנסת (סוג רך)", category:"synagogue", bought:false },
    { id:"s7", title:"חטיפים לילדים בקידוש", category:"synagogue", bought:false },
    { id:"s8", title:"פירות עונה ומלונים", category:"dessert", bought:false, isFresh:true },
    { id:"s9", title:"עוגות ומאפים לקינוח", category:"dessert", bought:false, isFresh:true },
    { id:"s10", title:"כיבוד קל למקום הלינה", category:"accommodation", bought:false },
];

const DEFAULT_CALLS = [
    { id:"c1", title:"🕌 תיאום עם גבאי בית הכנסת", subtitle:"עליות לתורה לאורחים, תזמון דבר התורה, חזנים", notes:"", done:false },
    { id:"c2", title:"🏛️ תיאום עם מקום האירוע / אולם", subtitle:"לוגיסטיקה, שעות, פלטות, מיחם מים חמים", notes:"", done:false },
    { id:"c3", title:"🍽️ תיאום עם הקייטרינג / אחראי אוכל", subtitle:"תפריט, כמויות, שעות הגשה", notes:"", done:false },
    { id:"c4", title:"📸 תיאום עם הצלם / צלמת", subtitle:"לוח זמנים לצילומים, מה כולל החבילה", notes:"", done:false },
    { id:"c5", title:"🎵 תיאום עם המוזיקאי / דיג'יי", subtitle:"רפרטואר, ציוד, זמן הגעה", notes:"", done:false },
    { id:"c6", title:"🏡 תיאום עם מקום הלינה", subtitle:"שעוני שבת, מזגנים, מפתחות, קיבולת", notes:"", done:false },
];

const DEFAULT_ROOMS = []; // Rooms are created by user in setup

// ─── State ────────────────────────────────────────────────────────────────────

let tasks = JSON.parse(localStorage.getItem('bm_tasks')) || null;
let shopping = JSON.parse(localStorage.getItem('bm_shopping')) || null;
let calls = JSON.parse(localStorage.getItem('bm_calls')) || null;
let rooms = JSON.parse(localStorage.getItem('bm_rooms')) || [];
let externalLocations = JSON.parse(localStorage.getItem('bm_externalLocations')) || [];
let rsvps = JSON.parse(localStorage.getItem('bm_rsvps')) || [];
let budget = JSON.parse(localStorage.getItem('bm_budget')) || [];
let logistics = JSON.parse(localStorage.getItem('bm_logistics')) || [];
let menu = JSON.parse(localStorage.getItem('bm_menu')) || [];
let schedule = JSON.parse(localStorage.getItem('bm_schedule')) || [];
let currentMenuFilter = 'הכל';
let editingMenuId = null;
let editingScheduleId = null;
let currentLogisticsFilter = 'all';
let currentTab = 'tasks';
let currentWaText = '';
let editingTaskId = null;
let currentResponsibleFilter = 'all';
let taskViewMode = localStorage.getItem('bm_taskViewMode') || 'dynamic';
let shopViewMode = 'category';
let shopSelectMode = false;
const selectedShopItems = new Set();
let _shoppingExportText = '';

const TODAY_BASELINE = new Date();
TODAY_BASELINE.setHours(0, 0, 0, 0);

// ─── Initialize with setup defaults ──────────────────────────────────────────

// Days-before-event defaults for each default task
const TASK_DEADLINE_OFFSETS = {
    t1: 180, t2: 180, t3: 180, // צלם, מוזיקאי, מקום — 6 חודשים
    t4: 42,                     // הזמנות — 6 שבועות
    t5: 90,                     // ביגוד — 3 חודשים
    t6: 30, t9: 30,             // נאום, תוכן — חודש
    t7: 60, t8: 60,             // חזרות, גבאי — חודשיים
    t10: 14, t13: 14, t15: 14,  // אישורי הגעה, חדרים, תוכנייה — שבועיים
    t11: 7, t12: 3,             // שתייה — שבוע, קניות — 3 ימים
    t14: 30,                    // מזכרות — חודש
};

function getDefaultTaskDeadline(taskId, eventDate) {
    if (!eventDate) return '';
    const offset = TASK_DEADLINE_OFFSETS[taskId];
    if (!offset) return eventDate;
    const d = new Date(eventDate + 'T00:00:00');
    d.setDate(d.getDate() - offset);
    return d.toISOString().split('T')[0];
}

function initDefaultsFromSetup() {
    const cfg = getEventConfig();
    const resp1 = cfg ? cfg.responsible1 : 'אבא';
    const eventDate = cfg ? cfg.eventDate : '';

    if (!tasks) {
        tasks = DEFAULT_TASKS.map(t => ({
            ...t,
            responsible: t.responsible || resp1,
            deadline: t.deadline || getDefaultTaskDeadline(t.id, eventDate)
        }));
    }
    if (!shopping) shopping = [...DEFAULT_SHOPPING];
    if (!calls) calls = [...DEFAULT_CALLS];

    saveLocalState();
}

function initAppWithSetup(setup, joinedExisting = false) {
    initDefaultsFromSetup();
    renderAll();
    updateHeaderFromSetup();
    connectToFirebaseWithSetup(setup);
    setTimeout(hideLoadingOverlay, 2500);
}

// ─── Persistence ──────────────────────────────────────────────────────────────

function saveLocalState() {
    const states = {
        'bm_tasks': tasks, 'bm_shopping': shopping, 'bm_calls': calls,
        'bm_rooms': rooms, 'bm_rsvps': rsvps, 'bm_budget': budget,
        'bm_logistics': logistics, 'bm_menu': menu, 'bm_schedule': schedule,
        'bm_externalLocations': externalLocations
    };
    try {
        for (const [key, value] of Object.entries(states)) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    } catch(e) {
        console.error("LocalStorage save error:", e);
        showToast("⚠️ האחסון במכשיר מלא — חלק מהנתונים לא נשמרו. נא לפנות מקום או לגבות.", 6000);
    }
}

// ─── Task utilities ────────────────────────────────────────────────────────────

function getActiveTasks(allTasks) {
    const THIRTY_DAYS = 30*24*60*60*1000;
    const now = Date.now();
    return allTasks.filter(t => t.status !== 'done' || (now-(t.updatedAt||t.createdAt||0)) < THIRTY_DAYS);
}

function getRelativeCategory(deadlineStr) {
    if (!deadlineStr) return 'future';
    try {
        const d = new Date(deadlineStr + "T00:00:00");
        const diff = Math.ceil((d.getTime()-TODAY_BASELINE.getTime())/(1000*60*60*24));
        if (diff < 0) return 'overdue';
        if (diff <= 1) return 'today';
        if (diff <= 7) return 'thisweek';
        return 'future';
    } catch { return 'future'; }
}

// ─── View mode ────────────────────────────────────────────────────────────────

function setTaskViewMode(mode) {
    taskViewMode = mode;
    localStorage.setItem('bm_taskViewMode', mode);
    const btnD = document.getElementById('btnViewDynamic');
    const btnS = document.getElementById('btnViewSorted');
    const layoutD = document.getElementById('dynamicTasksLayout');
    const layoutS = document.getElementById('sortedTasksLayout');
    if (mode === 'dynamic') {
        if (btnD) btnD.className = "px-3 py-1 rounded-xl text-xs font-bold border bg-indigo-600 border-indigo-600 text-white shadow-sm";
        if (btnS) btnS.className = "px-3 py-1 rounded-xl text-xs font-bold border bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200";
        if (layoutD) layoutD.classList.remove('hidden');
        if (layoutS) layoutS.classList.add('hidden');
    } else {
        if (btnD) btnD.className = "px-3 py-1 rounded-xl text-xs font-bold border bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200";
        if (btnS) btnS.className = "px-3 py-1 rounded-xl text-xs font-bold border bg-indigo-600 border-indigo-600 text-white shadow-sm";
        if (layoutD) layoutD.classList.add('hidden');
        if (layoutS) layoutS.classList.remove('hidden');
    }
    renderTasks();
}

function setResponsibleFilter(value) {
    currentResponsibleFilter = value;
    const responsibles = ['all', ...getAllResponsibles()];
    responsibles.forEach(key => {
        const btn = document.getElementById('filter-' + key);
        if (!btn) return;
        if (key === value) {
            btn.className = "px-3 py-1 rounded-xl text-xs font-bold border transition bg-indigo-600 border-indigo-600 text-white shadow-sm";
        } else {
            btn.className = "px-3 py-1 rounded-xl text-xs font-bold border transition bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200";
        }
    });
    renderTasks();
}

// ─── WhatsApp ─────────────────────────────────────────────────────────────────

function sendWa(phone) {
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(currentWaText)}`;
    window.open(url, '_blank');
}

function sendWaText(text) {
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
}

// ─── RSVP ─────────────────────────────────────────────────────────────────────

function toggleAllMeals(status) {
    getActiveMeals().forEach(m => {
        const el = document.getElementById('rsvpMeal_' + m);
        if (el) el.checked = status;
    });
}

async function addNewRsvp() {
    const nameEl = document.getElementById('rsvpName');
    if (!nameEl) return;
    const name = nameEl.value.trim();
    if (!name) { showToast("אנא הזינו שם אורח או משפחה!"); return; }

    const duplicate = rsvps.find(g => g.name.trim().toLowerCase() === name.toLowerCase());
    if (duplicate && !confirm(`"${name}" כבר רשום/ה. להוסיף בכל זאת?`)) return;

    const adults = parseInt(document.getElementById('rsvpAdults')?.value) || 0;
    const kids = parseInt(document.getElementById('rsvpKids')?.value) || 0;
    const sleep = document.getElementById('rsvpSleep')?.value || 'no';
    const babyCot = document.getElementById('rsvpBabyCot')?.checked || false;
    const cantAttend = document.getElementById('rsvpCantAttend')?.checked || false;

    // Dietary — collect all checked checkboxes
    const dietaryChecks = document.querySelectorAll('input[name="rsvpDietary"]:checked');
    const dietary = Array.from(dietaryChecks).map(cb => cb.value);
    const dietaryNote = document.getElementById('rsvpDietaryNote')?.value?.trim() || '';

    const meals = [];
    getActiveMeals().forEach(m => {
        if (document.getElementById('rsvpMeal_' + m)?.checked) meals.push(m);
    });

    const newGuest = {
        id: 'g_' + Date.now(),
        name, adults, kids, sleep, babyCot,
        cantAttend, dietary, dietaryNote, meals,
        createdAt: Date.now()
    };

    rsvps.push(newGuest);
    saveLocalState();
    renderRsvps();
    if (isCloudConnected && db) dbSet('rsvps', newGuest.id, newGuest);

    // Reset
    nameEl.value = '';
    document.getElementById('rsvpAdults').value = '2';
    document.getElementById('rsvpKids').value = '0';
    document.getElementById('rsvpSleep').value = 'no';
    if (document.getElementById('rsvpBabyCot')) document.getElementById('rsvpBabyCot').checked = false;
    if (document.getElementById('rsvpCantAttend')) document.getElementById('rsvpCantAttend').checked = false;
    document.querySelectorAll('input[name="rsvpDietary"]').forEach(cb => cb.checked = false);
    if (document.getElementById('rsvpDietaryNote')) document.getElementById('rsvpDietaryNote').value = '';
    toggleAllMeals(true);
    showToast("האורח נרשם בהצלחה!");
}

async function deleteRsvp(guestId) {
    if (!confirm("למחוק את רישום האורח לצמיתות?")) return;
    rsvps = rsvps.filter(g => g.id !== guestId);
    saveLocalState(); renderRsvps();
    if (isCloudConnected && db) dbDelete('rsvps', guestId);
    showToast("הרישום הוסר");
}

// WhatsApp invitation for a specific guest
function inviteGuestWhatsApp(guestId) {
    const cfg = getEventConfig();
    const guest = rsvps.find(g => g.id === guestId);
    if (!guest || !cfg) return;
    const setup = getSetup();
    const eventId = setup ? setup.eventId : '';
    const confirmLink = buildShareLink(eventId).replace('index.html', 'confirm.html').replace('?event=', '?event=');
    const confirmUrl = window.location.origin + window.location.pathname.replace('index.html', '') + `confirm.html?event=${eventId}`;
    const dateStr = cfg.useParasha ? `פרשת ${cfg.parashaName}` : formatHebrewDate(cfg.eventDate);
    const defaultMsg = `שלום ${guest.name}! 🎉\nאנחנו שמחים להזמין אותך לשבת בר המצווה של ${cfg.boyName}.\n📅 ${dateStr}\n\nלאישור הגעה לחצ/י כאן:\n${confirmUrl}`;

    // Show editable modal
    showWaInviteModal(defaultMsg);
}

function showWaInviteModal(defaultText) {
    const modal = document.getElementById('waInviteModal');
    const textarea = document.getElementById('waInviteText');
    if (modal && textarea) {
        textarea.value = defaultText;
        modal.classList.remove('hidden');
    }
}

function sendWaInvite() {
    const text = document.getElementById('waInviteText')?.value || '';
    sendWaText(text);
    document.getElementById('waInviteModal')?.classList.add('hidden');
}

// ─── Drinks Calculator ────────────────────────────────────────────────────────

function calculateDrinks() {
    let total = 0;
    getActiveMeals().forEach(m => {
        total += parseInt(document.getElementById('guestsForMeal_' + m)?.value) || 0;
    });
    const water = Math.ceil((total * 0.3) / 1.5);
    const sweet = Math.ceil((total * 0.5) / 1.5);
    safeSetText('resWater', `${water} בקבוקים (${Math.ceil(water/6)} שישיות)`);
    safeSetText('resSweetDrinks', `${sweet} בקבוקים (${Math.ceil(sweet/6)} שישיות)`);
}

async function addCalculatedDrinksToShopping() {
    const waterVal = document.getElementById('resWater')?.innerText || '0';
    const sodasVal = document.getElementById('resSweetDrinks')?.innerText || '0';
    const items = [
        { title: `מים מינרליים מחושב: ${waterVal}`, category: 'drinks' },
        { title: `שתייה קלה מחושבת: ${sodasVal}`, category: 'drinks' }
    ];
    items.forEach(item => {
        const newItem = { id: 's_'+Date.now()+'_'+Math.random().toString(36).slice(2,6), ...item, bought: false };
        shopping.push(newItem);
    });
    saveLocalState(); renderShopping();
    if (isCloudConnected && db) shopping.slice(-items.length).forEach(item => dbSet('shopping', item.id, item));
    showToast("כמויות השתייה נוספו לרשימת הקניות!");
}

// ─── Tasks ────────────────────────────────────────────────────────────────────

async function addNewTask() {
    const titleEl = document.getElementById('newTaskTitle');
    const deadlineEl = document.getElementById('newTaskDeadline');
    const respEl = document.getElementById('newTaskResponsible');
    if (!titleEl) return;
    const title = titleEl.value.trim();
    if (!title) { showToast("יש להזין שם למשימה!"); return; }
    const cfg = getEventConfig();
    const newTask = {
        id: 't_'+Date.now(), title,
        deadline: deadlineEl?.value || (cfg?.eventDate || ''),
        status: 'todo', notes: '', category: 'main',
        responsible: respEl?.value || 'לא הוגדר',
        createdAt: Date.now(), updatedAt: Date.now()
    };
    tasks.push(newTask);
    saveLocalState(); renderTasks(); renderRecentTasks();
    if (isCloudConnected && db) dbSet('tasks', newTask.id, newTask);
    titleEl.value = '';
    if (respEl) respEl.value = 'לא הוגדר';
    showToast("המשימה נוספה בהצלחה!");
}

async function updateTaskStatus(taskId, newStatus) {
    const i = tasks.findIndex(t => t.id === taskId);
    if (i !== -1) { tasks[i].status = newStatus; tasks[i].updatedAt = Date.now(); }
    saveLocalState(); renderTasks(); renderRecentTasks();
    if (isCloudConnected && db) dbUpdate('tasks', taskId, { status: newStatus, updatedAt: Date.now() });
}

async function deleteTask(taskId) {
    if (!confirm("למחוק את המשימה לצמיתות?")) return;
    tasks = tasks.filter(t => t.id !== taskId);
    saveLocalState(); renderTasks(); renderRecentTasks();
    if (isCloudConnected && db) dbDelete('tasks', taskId);
    showToast("המשימה נמחקה");
}

function startEditTask(id) { editingTaskId = id; renderTasks(); }
function cancelEditTask() { editingTaskId = null; renderTasks(); }

async function saveEditTask(taskId) {
    const title = document.getElementById(`editTitle_${taskId}`)?.value?.trim();
    const responsible = document.getElementById(`editResponsible_${taskId}`)?.value || '';
    const notes = document.getElementById(`editNotes_${taskId}`)?.value?.trim() || '';
    const deadline = document.getElementById(`editDeadline_${taskId}`)?.value || '';
    if (!title) { showToast("כותרת המשימה אינה יכולה להיות ריקה!"); return; }
    const update = { title, responsible, notes, deadline, updatedAt: Date.now() };
    const i = tasks.findIndex(t => t.id === taskId);
    if (i !== -1) tasks[i] = { ...tasks[i], ...update };
    editingTaskId = null;
    saveLocalState(); renderTasks();
    if (isCloudConnected && db) dbUpdate('tasks', taskId, update);
    showToast("המשימה עודכנה!");
}

// ─── Shopping ─────────────────────────────────────────────────────────────────

async function addNewShopItem() {
    const titleEl = document.getElementById('newShopTitle');
    const catEl = document.getElementById('newShopCategory');
    if (!titleEl) return;
    const title = titleEl.value.trim();
    if (!title) { showToast("יש להזין שם למוצר!"); return; }
    const isFreshEl = document.getElementById('newShopIsFresh');
    const newItem = { id: 's_'+Date.now(), title, category: catEl?.value || 'drinks', bought: false, isFresh: isFreshEl?.checked || false };
    shopping.push(newItem);
    saveLocalState(); renderShopping();
    if (isCloudConnected && db) dbSet('shopping', newItem.id, newItem);
    titleEl.value = ''; if (isFreshEl) isFreshEl.checked = false;
    showToast("המוצר נוסף לסל!");
}

async function toggleShopItem(itemId) {
    const i = shopping.findIndex(s => s.id === itemId);
    if (i !== -1) { shopping[i].bought = !shopping[i].bought; if (shopping[i].bought) shopping[i].boughtAt = Date.now(); }
    saveLocalState(); renderShopping();
    if (isCloudConnected && db) dbUpdate('shopping', itemId, { bought: shopping[i]?.bought });
}

async function toggleShopItemFresh(itemId) {
    const i = shopping.findIndex(s => s.id === itemId);
    if (i !== -1) { shopping[i].isFresh = !shopping[i].isFresh; saveLocalState(); renderShopping(); if (isCloudConnected && db) dbUpdate('shopping', itemId, { isFresh: shopping[i].isFresh }); }
}

async function deleteShopItem(itemId) {
    if (!confirm("למחוק את הפריט?")) return;
    shopping = shopping.filter(s => s.id !== itemId);
    saveLocalState(); renderShopping();
    if (isCloudConnected && db) dbDelete('shopping', itemId);
    showToast("המוצר נמחק");
}

function setShopViewMode(mode) {
    shopViewMode = mode;
    document.getElementById('btnShopViewCategory')?.classList.toggle('bg-indigo-600', mode === 'category');
    document.getElementById('btnShopViewCategory')?.classList.toggle('text-white', mode === 'category');
    document.getElementById('btnShopViewFreshness')?.classList.toggle('bg-indigo-600', mode === 'freshness');
    document.getElementById('btnShopViewFreshness')?.classList.toggle('text-white', mode === 'freshness');
    renderShopping();
}

function toggleShopSelectMode() {
    shopSelectMode = !shopSelectMode; selectedShopItems.clear();
    const btn = document.getElementById('btnShopSelectMode');
    if (btn) btn.textContent = shopSelectMode ? '✕ ביטול' : '☑ בחר מרובה';
    document.getElementById('batchBuyBar')?.classList.toggle('hidden', !shopSelectMode);
    renderShopping();
}

function toggleShopItemSelect(itemId) {
    if (selectedShopItems.has(itemId)) selectedShopItems.delete(itemId); else selectedShopItems.add(itemId);
    const countEl = document.getElementById('batchBuyCount');
    if (countEl) countEl.textContent = `${selectedShopItems.size} נבחרו`;
    const el = document.querySelector(`[data-batch-id="${itemId}"]`);
    if (el) { el.classList.toggle('bg-indigo-50', selectedShopItems.has(itemId)); const cb = el.querySelector('input[type="checkbox"]'); if (cb) cb.checked = selectedShopItems.has(itemId); }
}

async function batchBuySelected() {
    if (!selectedShopItems.size) { showToast('לא נבחרו פריטים!'); return; }
    const ids = [...selectedShopItems]; const now = Date.now();
    ids.forEach(id => { const i = shopping.findIndex(s => s.id === id); if (i !== -1) { shopping[i].bought = true; shopping[i].boughtAt = now; } });
    selectedShopItems.clear(); shopSelectMode = false;
    saveLocalState(); renderShopping();
    if (isCloudConnected && db) {
        try {
            const { writeBatch, doc } = await import(FIREBASE_MODULES.firestore);
            const batch = writeBatch(db);
            ids.forEach(id => batch.set(doc(db, getCollectionPath('shopping'), id), { bought: true, boughtAt: now }, { merge: true }));
            await batch.commit();
        } catch(e) { console.error('batchBuy error:', e); }
    }
    showToast(`${ids.length} פריטים סומנו כנרכשו! ✅`);
}

function exportShoppingList() {
    const cats = { disposable:'🍽️ כלים חד פעמיים', drinks:'🥤 שתייה', synagogue:'⛪ בית הכנסת', dessert:'🍰 קינוחים', accommodation:'🏡 אירוח' };
    const remaining = shopping.filter(s => !s.bought);
    if (!remaining.length) { showToast('כל הפריטים נרכשו! 🎉'); return; }
    const modal = document.getElementById('shoppingExportModal');
    const content = document.getElementById('shoppingExportContent');
    if (!modal || !content) return;
    let html = ''; _shoppingExportText = `🛒 רשימת קניות\n${'═'.repeat(25)}\n\n`;
    Object.keys(cats).forEach(catKey => {
        const items = remaining.filter(s => s.category === catKey);
        if (!items.length) return;
        html += `<div class="bg-slate-50 rounded-xl p-3"><div class="font-bold text-slate-700 mb-2 text-sm">${cats[catKey]}</div><ul class="space-y-1.5">${items.map(i => `<li class="flex items-start gap-2 text-sm text-slate-600"><span class="text-slate-400">•</span><span>${esc(i.title)}</span></li>`).join('')}</ul></div>`;
        _shoppingExportText += `${cats[catKey]}\n${items.map(i => `  • ${i.title}`).join('\n')}\n\n`;
    });
    _shoppingExportText += `───────\nסה"כ: ${remaining.length} פריטים`;
    content.innerHTML = html;
    modal.classList.remove('hidden');
}

function copyShoppingExport() {
    if (!_shoppingExportText) return;
    navigator.clipboard?.writeText(_shoppingExportText).then(() => showToast('הרשימה הועתקה! 📋'));
}

// ─── Rooms / Accommodation ────────────────────────────────────────────────────

async function addGuestToRoom(roomId) {
    const input = document.getElementById(`guestInput_${roomId}`);
    if (!input) return;
    const name = input.value.trim();
    if (!name) { showToast("יש להזין שם אורח!"); return; }
    const i = rooms.findIndex(r => r.id === roomId);
    if (i !== -1) {
        const guests = [...(rooms[i].guests||[]), name];
        if (guests.length > rooms[i].capacity) showToast("אזהרה: החדר בתפוסה מלאה!");
        rooms[i].guests = guests;
        saveLocalState(); renderRooms();
        if (isCloudConnected && db) dbUpdate('rooms', roomId, { guests });
        input.value = ''; showToast(`${name} שובץ!`);
    }
}

async function removeGuestFromRoom(roomId, idx) {
    const i = rooms.findIndex(r => r.id === roomId);
    if (i !== -1) {
        const guests = [...rooms[i].guests]; const removed = guests.splice(idx, 1)[0];
        rooms[i].guests = guests;
        saveLocalState(); renderRooms();
        if (isCloudConnected && db) dbUpdate('rooms', roomId, { guests });
        showToast(`${removed} הוסר`);
    }
}

async function addNewRoom() {
    const nameEl = document.getElementById('newRoomName');
    const capEl = document.getElementById('newRoomCapacity');
    const typeEl = document.getElementById('newRoomType');
    if (!nameEl) return;
    const name = nameEl.value.trim();
    if (!name) { showToast("יש להזין שם!"); return; }
    const newRoom = { id: 'r_'+Date.now(), name, capacity: parseInt(capEl?.value)||2, type: typeEl?.value||'villa', guests: [] };
    rooms.push(newRoom);
    saveLocalState(); renderRooms();
    if (isCloudConnected && db) dbSet('rooms', newRoom.id, newRoom);
    nameEl.value = ''; if (capEl) capEl.value = '';
    showToast("מיקום לינה נוסף!");
}

async function deleteRoom(roomId) {
    if (!confirm("למחוק?")) return;
    rooms = rooms.filter(r => r.id !== roomId);
    saveLocalState(); renderRooms();
    if (isCloudConnected && db) dbDelete('rooms', roomId);
    showToast("המיקום הוסר");
}

async function addExternalLocation() {
    const nameEl = document.getElementById('newExtLocationName');
    const guestsEl = document.getElementById('newExtLocationGuests');
    if (!nameEl) return;
    const name = nameEl.value.trim();
    if (!name) { showToast('יש להזין שם מיקום!'); return; }
    const guests = guestsEl?.value?.trim() ? guestsEl.value.split(',').map(g=>g.trim()).filter(Boolean) : [];
    const loc = { id: 'ext_'+Date.now(), name, guests };
    externalLocations.push(loc);
    saveLocalState(); renderRooms();
    if (isCloudConnected && db) dbSet('externalLocations', loc.id, loc);
    nameEl.value = ''; if (guestsEl) guestsEl.value = '';
    showToast('מיקום נוסף!');
}

async function deleteExternalLocation(locId) {
    if (!confirm('למחוק?')) return;
    externalLocations = externalLocations.filter(l => l.id !== locId);
    saveLocalState(); renderRooms();
    if (isCloudConnected && db) dbDelete('externalLocations', locId);
    showToast('המיקום הוסר');
}

async function addGuestToExtLocation(locId) {
    const input = document.getElementById('extGuestInput_'+locId);
    if (!input) return;
    const name = input.value.trim();
    if (!name) { showToast('יש להזין שם!'); return; }
    const loc = externalLocations.find(l => l.id === locId);
    if (!loc) return;
    loc.guests = [...(loc.guests||[]), name];
    saveLocalState(); renderRooms();
    if (isCloudConnected && db) dbUpdate('externalLocations', locId, { guests: loc.guests });
    input.value = ''; showToast(`${name} שובץ!`);
}

async function removeGuestFromExtLocation(locId, idx) {
    const loc = externalLocations.find(l => l.id === locId);
    if (!loc) return;
    const removed = loc.guests.splice(idx, 1)[0];
    saveLocalState(); renderRooms();
    if (isCloudConnected && db) dbUpdate('externalLocations', locId, { guests: loc.guests });
    showToast(`${removed} הוסר`);
}

function copyRoomsSummary() {
    const cfg = getEventConfig();
    let text = `🏡 חלוקת לינה — בר מצווה של ${cfg?.boyName || ''}\n\n`;
    rooms.forEach(r => {
        text += `  ${r.name} (${(r.guests||[]).length}/${r.capacity}):\n`;
        (r.guests||[]).forEach(g => text += `    • ${g}\n`);
        if (!(r.guests||[]).length) text += `    — ריק\n`;
    });
    if (externalLocations.length) {
        text += '\n🏘️ מיקומים נוספים:\n';
        externalLocations.forEach(l => {
            text += `  ${l.name}:\n`;
            (l.guests||[]).forEach(g => text += `    • ${g}\n`);
        });
    }
    navigator.clipboard?.writeText(text).then(() => showToast('חלוקת הלינה הועתקה! 📋'));
}

// ─── Budget ───────────────────────────────────────────────────────────────────

async function addNewExpense() {
    const name = document.getElementById('newExpName').value.trim();
    const price = parseFloat(document.getElementById('newExpPricePerUnit').value)||0;
    const qty = parseFloat(document.getElementById('newExpQty').value)||1;
    const paid = parseFloat(document.getElementById('newExpPaid').value)||0;
    const method = document.getElementById('newExpMethod').value.trim()||'לא צוין';
    const date = document.getElementById('newExpDate').value||new Date().toISOString().split('T')[0];
    if (!name || price <= 0) { showToast("אנא מלא שם ומחיר!"); return; }
    const newExp = { id: 'exp_'+Date.now(), name, totalAmount: price*qty, createdAt: Date.now(), payments: [{ amount: paid, method, date }] };
    budget.push(newExp);
    saveLocalState(); renderBudget();
    if (isCloudConnected && db) dbSet('budget', newExp.id, newExp);
    ['newExpName','newExpPricePerUnit','newExpQty','newExpPaid','newExpMethod','newExpDate'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
    showToast("ההוצאה נוספה!");
}

function addPaymentToExpense(expId) {
    const existing = document.getElementById('paymentForm-'+expId);
    if (existing) { existing.remove(); return; }
    const container = document.querySelector(`[data-exp-id="${expId}"]`);
    if (!container) return;
    const today = new Date().toISOString().split('T')[0];
    container.insertAdjacentHTML('beforeend', `
    <div id="paymentForm-${expId}" class="bg-indigo-50 border border-indigo-100 rounded-xl p-3 mt-2 space-y-2">
        <div class="text-xs font-bold text-indigo-800">➕ הוספת תשלום</div>
        <div class="grid grid-cols-3 gap-2">
            <input type="number" id="payAmt-${expId}" placeholder="סכום ₪" class="p-1.5 border rounded-lg text-xs text-center">
            <select id="payMethod-${expId}" class="p-1.5 border rounded-lg text-xs bg-white">
                <option>מזומן</option><option>העברה</option><option>אשראי</option>
            </select>
            <input type="date" id="payDate-${expId}" value="${today}" class="p-1.5 border rounded-lg text-xs">
        </div>
        <div class="flex gap-2 justify-end">
            <button onclick="document.getElementById('paymentForm-${expId}').remove()" class="text-xs text-slate-500 px-3 py-1 rounded-lg bg-slate-100">ביטול</button>
            <button onclick="savePayment('${expId}')" class="text-xs text-white px-3 py-1 rounded-lg bg-indigo-600">שמור</button>
        </div>
    </div>`);
}

async function savePayment(expId) {
    const amount = parseFloat(document.getElementById('payAmt-'+expId)?.value);
    if (!amount || isNaN(amount)) { showToast("נא להזין סכום תקין!"); return; }
    const method = document.getElementById('payMethod-'+expId)?.value||'לא צוין';
    const date = document.getElementById('payDate-'+expId)?.value||new Date().toISOString().split('T')[0];
    const exp = budget.find(e => e.id === expId);
    if (exp) {
        exp.payments.push({ amount, method, date });
        saveLocalState(); renderBudget();
        if (isCloudConnected && db) dbUpdate('budget', expId, { payments: exp.payments });
        showToast("תשלום נוסף! ✅");
    }
}

async function deleteExpense(expId) {
    if (!confirm("למחוק?")) return;
    budget = budget.filter(e => e.id !== expId);
    saveLocalState(); renderBudget();
    if (isCloudConnected && db) dbDelete('budget', expId);
    showToast("ההוצאה נמחקה");
}

function updateMaxBudget(val) {
    const setup = getSetup();
    if (!setup) return;
    setup.budget = parseFloat(val)||null;
    saveSetup(setup);
    if (isCloudConnected && db) dbSet('_settings', 'setup', setup);
    renderBudget();
}

// ─── Calls ────────────────────────────────────────────────────────────────────

async function toggleCallDone(callId) {
    const i = calls.findIndex(c => c.id === callId);
    if (i !== -1) { calls[i].done = !calls[i].done; saveLocalState(); renderCalls(); if (isCloudConnected && db) dbUpdate('calls', callId, { done: calls[i].done }); }
}

async function updateCallNotes(callId, text) {
    const i = calls.findIndex(c => c.id === callId);
    if (i !== -1) { calls[i].notes = text; saveLocalState(); if (isCloudConnected && db) dbUpdate('calls', callId, { notes: text }); }
}

async function addNewCall() {
    const titleEl = document.getElementById('newCallTitle');
    if (!titleEl?.value.trim()) { showToast("נא להזין שם!"); return; }
    const newCall = { id: 'c_'+Date.now(), title: titleEl.value.trim(), subtitle: document.getElementById('newCallSubtitle')?.value.trim()||'', phone: document.getElementById('newCallPhone')?.value.trim()||'', notes: '', done: false };
    calls.push(newCall);
    saveLocalState(); renderCalls();
    if (isCloudConnected && db) dbSet('calls', newCall.id, newCall);
    titleEl.value = ''; document.getElementById('newCallSubtitle').value = ''; document.getElementById('newCallPhone').value = '';
    showToast("הבירור נוסף!");
}

async function deleteCall(callId) {
    if (!confirm("למחוק?")) return;
    calls = calls.filter(c => c.id !== callId);
    saveLocalState(); renderCalls();
    if (isCloudConnected && db) dbDelete('calls', callId);
    showToast("הבירור נמחק");
}

// ─── Logistics ────────────────────────────────────────────────────────────────

async function addNewLogisticsKit() {
    const nameEl = document.getElementById('newLogName');
    const destEl = document.getElementById('newLogDest');
    const name = nameEl?.value.trim();
    if (!name) { showToast("אנא הזן שם!"); return; }
    const kit = { id: 'l_'+Date.now(), name, destination: destEl?.value||'', items: [], packed: false };
    logistics.push(kit);
    saveLocalState(); renderLogistics('all');
    if (isCloudConnected && db) dbSet('logistics', kit.id, kit);
    nameEl.value = ''; nameEl.focus();
}

async function addLogItemInline(logId) {
    const input = document.getElementById(`input_${logId}`);
    const name = input?.value.trim();
    if (!name) return;
    const log = logistics.find(l => l.id === logId);
    if (!log) return;
    log.items.push({ name, checked: false });
    input.value = '';
    saveLocalState(); renderLogistics();
    if (isCloudConnected && db) dbUpdate('logistics', logId, { items: log.items });
    setTimeout(() => document.getElementById(`input_${logId}`)?.focus(), 50);
}

function toggleLogItem(logId, idx) {
    const log = logistics.find(l => l.id === logId);
    if (log) { log.items[idx].checked = !log.items[idx].checked; saveLocalState(); if (isCloudConnected && db) dbUpdate('logistics', logId, { items: log.items }); }
}

async function deleteLogItem(logId, idx) {
    const log = logistics.find(l => l.id === logId);
    if (log) { log.items.splice(idx, 1); saveLocalState(); renderLogistics(); if (isCloudConnected && db) dbUpdate('logistics', logId, { items: log.items }); }
}

async function deleteLogisticsKit(logId) {
    if (!confirm("למחוק ערכה?")) return;
    logistics = logistics.filter(l => l.id !== logId);
    saveLocalState(); renderLogistics();
    if (isCloudConnected && db) dbDelete('logistics', logId);
}

async function toggleKitPacked(logId) {
    const log = logistics.find(l => l.id === logId);
    if (log) { log.packed = !log.packed; saveLocalState(); renderLogistics(); if (isCloudConnected && db) dbUpdate('logistics', logId, { packed: log.packed }); }
}

function filterLogistics(filter) {
    currentLogisticsFilter = filter;
    renderLogistics(filter);
}

// ─── Menu ─────────────────────────────────────────────────────────────────────

async function addNewMenuItem() {
    const nameEl = document.getElementById('newMenuName');
    if (!nameEl?.value.trim()) { showToast("נא להזין שם מנה!"); return; }
    const item = {
        id: 'm_'+Date.now(), name: nameEl.value.trim(),
        meal: document.getElementById('newMenuMeal')?.value || getActiveMeals()[0],
        cat: document.getElementById('newMenuCat')?.value||'מנה ראשונה',
        vegan: document.getElementById('tagVegan')?.checked||false,
        gluten: document.getElementById('tagGluten')?.checked||false
    };
    menu.push(item); saveLocalState(); renderMenu();
    if (isCloudConnected && db) dbSet('menu', item.id, item);
    nameEl.value = '';
    showToast("המנה נוספה!");
}

async function deleteMenuItem(id) {
    menu = menu.filter(m => m.id !== id); saveLocalState(); renderMenu();
    if (isCloudConnected && db) dbDelete('menu', id);
    showToast("המנה נמחקה");
}

function filterMenu(filter) { currentMenuFilter = filter; renderMenu(); }
function editMenuItem(id) { editingMenuId = id; renderMenu(); }

function saveEditMenu(id) {
    const item = menu.find(m => m.id === id);
    if (!item) return;
    item.name = document.getElementById('editMenuName')?.value||item.name;
    item.cat = document.getElementById('editMenuCat')?.value||item.cat;
    saveLocalState();
    if (isCloudConnected && db) dbUpdate('menu', id, item);
    editingMenuId = null; renderMenu();
    showToast("המנה עודכנה!");
}

// ─── Schedule ─────────────────────────────────────────────────────────────────

async function addNewScheduleItem() {
    const titleEl = document.getElementById('schTitle');
    if (!titleEl?.value.trim()) { showToast("נא להזין שם פעילות!"); return; }
    const item = { id: 'sch_'+Date.now(), title: titleEl.value.trim(), speaker: document.getElementById('schSpeaker')?.value.trim()||'', day: document.getElementById('schDay')?.value||'', time: document.getElementById('schTime')?.value||'', overlap:false };
    schedule.push(item); saveLocalState(); renderSchedule();
    if (isCloudConnected && db) dbSet('schedule', item.id, item);
    titleEl.value = ''; document.getElementById('schSpeaker').value = '';
    showToast("הפעילות נוספה!");
}

async function deleteScheduleItem(id) {
    schedule = schedule.filter(s => s.id !== id); saveLocalState(); renderSchedule();
    if (isCloudConnected && db) dbDelete('schedule', id);
    showToast("הפעילות נמחקה");
}

function saveEditSchedule(id) {
    const item = schedule.find(s => s.id === id);
    if (!item) return;
    item.title = document.getElementById('editSchTitle')?.value||item.title;
    item.day = document.getElementById('editSchDay')?.value||item.day;
    item.time = document.getElementById('editSchTime')?.value||item.time;
    item.speaker = document.getElementById('editSchSpeaker')?.value||item.speaker;
    editingScheduleId = null; saveLocalState(); renderSchedule();
    if (isCloudConnected && db) dbUpdate('schedule', id, item);
}

// ─── FAB ──────────────────────────────────────────────────────────────────────

function fabAction() {
    const targets = { tasks:'newTaskTitle', shopping:'newShopTitle', rsvp:'rsvpName', rooms:'newRoomName', budget:'newExpName', calls:'newCallTitle', logistics:'newLogName', menu:'newMenuName', schedule:'schTitle' };
    const el = document.getElementById(targets[currentTab]);
    if (el) { el.scrollIntoView({ behavior:'smooth', block:'center' }); setTimeout(() => el.focus(), 350); }
}

// ─── Feedback ─────────────────────────────────────────────────────────────────

function openFeedbackModal() {
    document.getElementById('feedbackModal').classList.remove('hidden');
    document.getElementById('feedbackText').value = '';
}

function closeFeedbackModal() {
    document.getElementById('feedbackModal').classList.add('hidden');
}

function sendFeedbackWhatsApp() {
    const text = document.getElementById('feedbackText')?.value?.trim();
    if (!text) { showToast('נא לכתוב משוב תחילה!'); return; }
    const fullText = `💬 משוב על מערכת בר מצווה:\n${text}`;
    if (FEEDBACK_WHATSAPP) {
        window.open(`https://api.whatsapp.com/send?phone=${FEEDBACK_WHATSAPP}&text=${encodeURIComponent(fullText)}`, '_blank');
    } else {
        showToast('מספר WhatsApp לא הוגדר עדיין');
    }
}

function sendFeedbackEmail() {
    const text = document.getElementById('feedbackText')?.value?.trim();
    if (!text) { showToast('נא לכתוב משוב תחילה!'); return; }
    window.open(`mailto:${FEEDBACK_EMAIL}?subject=משוב על מערכת בר מצווה&body=${encodeURIComponent(text)}`, '_blank');
}

function openFeedbackForm() {
    if (FEEDBACK_FORM_URL) { window.open(FEEDBACK_FORM_URL, '_blank'); }
    else { showToast('קישור לטופס לא הוגדר עדיין'); }
}

function copyFeedbackText() {
    const text = document.getElementById('feedbackText')?.value?.trim();
    if (!text) { showToast('נא לכתוב משוב תחילה!'); return; }
    navigator.clipboard?.writeText(text).then(() => showToast('הטקסט הועתק! 📋'));
}

// ─── Sharing ──────────────────────────────────────────────────────────────────

function copyShareLink() {
    const setup = getSetup();
    if (!setup?.eventId) { showToast('צור אירוע תחילה!'); return; }
    const link = buildShareLink(setup.eventId);
    navigator.clipboard?.writeText(link).then(() => showToast('הלינק הועתק! 🔗'));
}

function shareEventWhatsApp() {
    const setup = getSetup();
    const cfg = getEventConfig();
    if (!setup?.eventId || !cfg) { showToast('צור אירוע תחילה!'); return; }
    const link = buildShareLink(setup.eventId);
    const dateStr = cfg.useParasha ? `פרשת ${cfg.parashaName}` : formatHebrewDate(cfg.eventDate);
    const text = `🎉 הצטרף/י למערכת ניהול בר המצווה של ${cfg.boyName}!\n📅 ${dateStr}\n\nפשוט לחץ/י על הלינק:\n${link}`;
    sendWaText(text);
}

// ─── Sharing the RSVP confirm page ───────────────────────────────────────────

function copyConfirmLink() {
    const setup = getSetup();
    if (!setup?.eventId) return;
    const base = window.location.origin + window.location.pathname.replace('index.html','');
    const link = `${base}confirm.html?event=${setup.eventId}`;
    navigator.clipboard?.writeText(link).then(() => showToast('לינק אישור הגעה הועתק! 📋'));
}

function shareConfirmWhatsApp() {
    const setup = getSetup();
    const cfg = getEventConfig();
    if (!setup?.eventId || !cfg) { showToast('צור אירוע תחילה!'); return; }
    const base = window.location.origin + window.location.pathname.replace('index.html','');
    const link = `${base}confirm.html?event=${setup.eventId}`;
    const dateStr = cfg.useParasha ? `פרשת ${cfg.parashaName}` : formatHebrewDate(cfg.eventDate);
    const text = `🎉 הוזמנתם לבר מצווה של ${cfg.boyName}!\n📅 ${dateStr}\n\nאנא אשרו הגעה דרך הלינק:\n${link}`;
    sendWaText(text);
}

// ─── Delete Event ─────────────────────────────────────────────────────────────

const LOCAL_STORAGE_KEYS = [
    'bm_tasks','bm_shopping','bm_calls','bm_rooms','bm_rsvps','bm_budget',
    'bm_logistics','bm_menu','bm_schedule','bm_externalLocations',
    'bm_setup','bm_taskViewMode'
];

function openDeleteEventModal() {
    document.getElementById('deleteEventModal')?.classList.remove('hidden');
}

async function deleteEvent(scope) {
    const confirmMsg = scope === 'all'
        ? 'מחיקה מהענן אינה ניתנת לביטול — גם שאר המארגנים יאבדו גישה. בטוח/ה?'
        : 'לצאת מהאירוע במכשיר זה? הנתונים בענן ישמרו עבור מארגנים אחרים.';
    if (!confirm(confirmMsg)) return;

    document.getElementById('deleteEventModal')?.classList.add('hidden');

    if (scope === 'all' && isCloudConnected && db) {
        showToast('מוחק נתונים מהענן...', 4000);
        try {
            const { collection, getDocs, deleteDoc } = await import(FIREBASE_MODULES.firestore);
            const setup = getSetup();
            if (setup?.eventId) {
                const cols = ['tasks','shopping','calls','rooms','externalLocations',
                              'rsvps','budget','logistics','menu','schedule','_settings'];
                for (const col of cols) {
                    const snap = await getDocs(collection(db, `events/${setup.eventId}/${col}`));
                    for (const d of snap.docs) await deleteDoc(d.ref);
                }
            }
        } catch(e) {
            console.error('Firebase delete error:', e);
            showToast('שגיאה במחיקה מהענן. הנתונים המקומיים נמחקו.');
        }
    }

    LOCAL_STORAGE_KEYS.forEach(k => localStorage.removeItem(k));
    showToast('האירוע נמחק. מאתחל...');
    setTimeout(() => window.location.reload(), 1500);
}

// ─── Data Export / Import ─────────────────────────────────────────────────────

function exportEventData() {
    const setup = getSetup();
    if (!setup) { showToast('אין נתונים לגיבוי.'); return; }
    const payload = {
        _version: 1,
        _exportedAt: new Date().toISOString(),
        setup,
        tasks, shopping, calls, rooms, externalLocations,
        rsvps, budget, logistics, menu, schedule
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const boyName = setup.boyName || 'barmitzvah';
    a.href = url;
    a.download = `barmitzvah-${boyName}-backup.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('הגיבוי הורד בהצלחה! ✅');
}

function importEventData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            if (!data._version || !data.setup) {
                showToast('קובץ הגיבוי אינו תקין.'); return;
            }
            if (!confirm('שחזור יחליף את כל הנתונים הנוכחיים. להמשיך?')) return;

            if (data.setup) saveSetup(data.setup);
            tasks = data.tasks || tasks;
            shopping = data.shopping || shopping;
            calls = data.calls || calls;
            rooms = data.rooms || rooms;
            externalLocations = data.externalLocations || externalLocations;
            rsvps = data.rsvps || rsvps;
            budget = data.budget || budget;
            logistics = data.logistics || logistics;
            menu = data.menu || menu;
            schedule = data.schedule || schedule;

            saveLocalState();
            renderAll();
            updateHeaderFromSetup();
            showToast('הנתונים שוחזרו בהצלחה! 🎉');
        } catch(err) {
            showToast('שגיאה בקריאת הקובץ. ודאו שהוא קובץ גיבוי תקין.');
        }
    };
    input.click();
}

// ─── Render helpers ───────────────────────────────────────────────────────────

function renderAll() {
    try { renderTasks(); } catch(e) {}
    try { renderShopping(); } catch(e) {}
    try { renderCalls(); } catch(e) {}
    try { renderRsvps(); } catch(e) {}
    try { renderBudget(); } catch(e) {}
    try { renderRooms(); } catch(e) {}
    try { renderLogistics(); } catch(e) {}
    try { setTaskViewMode(taskViewMode); } catch(e) {}
    try { renderRsvpMeals(); } catch(e) {}
    try { populateResponsibleDropdown(); } catch(e) {}
}

// ─── Boot ─────────────────────────────────────────────────────────────────────

window.onload = function() {
    const urlEventId = getEventIdFromUrl();
    const setup = getSetup();

    if (urlEventId && (!setup || setup.eventId !== urlEventId)) {
        // Auto-join from URL
        const newSetup = { eventId: urlEventId, setupComplete: true, joinedExisting: true };
        saveSetup(newSetup);
        initDefaultsFromSetup();
        renderAll();
        updateHeaderFromSetup();
        connectToFirebaseWithSetup(newSetup, true);
        setTimeout(hideLoadingOverlay, 2500);
    } else if (setup?.setupComplete) {
        initDefaultsFromSetup();
        renderAll();
        updateHeaderFromSetup();
        connectToFirebaseWithSetup(setup);
        setTimeout(hideLoadingOverlay, 2500);
    } else {
        // Show setup wizard
        hideLoadingOverlay();
        renderSetupOverlay();
    }

    try { updateCountdown(); setInterval(updateCountdown, 10000); } catch(e) {}
};
