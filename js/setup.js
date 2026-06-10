// ─── Setup & Event Management ─────────────────────────────────────────────────

const SETUP_KEY = 'bm_setup';
const ONBOARDING_KEY = 'bm_onboarding_done';

// Returns the current setup object or null
function getSetup() {
    try {
        const raw = localStorage.getItem(SETUP_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch { return null; }
}

// Save setup to localStorage (and cloud if connected)
function saveSetup(data) {
    localStorage.setItem(SETUP_KEY, JSON.stringify(data));
}

// Generate a unique event ID like "bm-a3k9x2r4"
function generateEventId() {
    const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
    let id = 'bm-';
    for (let i = 0; i < 10; i++) id += chars[Math.floor(Math.random() * chars.length)];
    return id;
}

// Read event ID from URL ?event=xxx or from localStorage
function getEventIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('event') || null;
}

// Build the shareable link for this event
function buildShareLink(eventId) {
    const base = window.location.origin + window.location.pathname.replace('index.html', '');
    return `${base}?event=${eventId}`;
}

// ─── Setup Wizard HTML ────────────────────────────────────────────────────────

function renderSetupOverlay() {
    const overlay = document.getElementById('setupOverlay');
    if (!overlay) return;
    overlay.innerHTML = `
    <div class="py-6 px-4 md:min-h-full md:flex md:items-center md:justify-center">
      <div class="bg-white rounded-3xl shadow-2xl w-full max-w-lg md:max-w-4xl overflow-hidden flex flex-col md:flex-row mx-auto">

        <!-- Left decorative panel (desktop only) -->
        <div class="hidden md:flex flex-col justify-between bg-gradient-to-b from-indigo-600 to-purple-700 text-white p-10 w-80 shrink-0">
          <div>
            <div class="text-6xl mb-5">✡️</div>
            <h1 class="text-3xl font-extrabold leading-tight mb-3">מערכת ניהול<br>בר מצווה</h1>
            <p class="text-indigo-200 text-sm leading-relaxed">תכנון מלא של האירוע — משימות, אורחים, תקציב, לינה, תפריט ועוד.</p>
          </div>
          <div class="space-y-3 text-sm">
            <div class="flex items-center gap-2 text-indigo-200"><span>✅</span> ניהול משימות חכם</div>
            <div class="flex items-center gap-2 text-indigo-200"><span>👥</span> אישורי הגעה מאורחים</div>
            <div class="flex items-center gap-2 text-indigo-200"><span>☁️</span> סנכרון בין כל בני המשפחה</div>
            <div class="flex items-center gap-2 text-indigo-200"><span>📲</span> שיתוף קל בוואטסאפ</div>
          </div>
        </div>

        <!-- Right: form area -->
        <div class="flex-1 flex flex-col">
          <!-- Mobile header (hidden on desktop) -->
          <div class="md:hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-center py-7 px-6">
            <div class="text-5xl mb-3">✡️</div>
            <h1 class="text-2xl font-extrabold">ברוכים הבאים!</h1>
            <p class="text-indigo-200 text-sm mt-1">מערכת לניהול שבת בר מצווה</p>
          </div>

          <!-- Steps -->
          <div id="setupStep1" class="p-6 md:p-10 space-y-4 md:flex-1 md:flex md:flex-col md:justify-center">
            <h2 class="text-xl md:text-2xl font-extrabold text-slate-800 text-center mb-2">כיצד תרצו להתחיל?</h2>
            <button onclick="showSetupCreate()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-5 px-6 rounded-2xl text-base transition shadow-lg flex items-center gap-4">
              <span class="text-3xl">✨</span>
              <div class="text-right">
                <div class="font-extrabold">צור אירוע חדש</div>
                <div class="text-indigo-200 text-xs font-normal mt-0.5">הגדר את הפרטים ותתחיל לתכנן</div>
              </div>
            </button>
            <button onclick="showSetupJoin()" class="w-full bg-white hover:bg-slate-50 text-indigo-700 border-2 border-indigo-200 font-bold py-5 px-6 rounded-2xl text-base transition flex items-center gap-4">
              <span class="text-3xl">🔗</span>
              <div class="text-right">
                <div class="font-extrabold">הצטרף לאירוע קיים</div>
                <div class="text-slate-500 text-xs font-normal mt-0.5">הזן קוד שקיבלת מבן/בת הזוג</div>
              </div>
            </button>
          </div>

          <!-- Create Event Form -->
          <div id="setupStepCreate" class="hidden p-6 md:p-10 overflow-y-auto">
            <div class="flex items-center gap-2 mb-4">
              <button onclick="showSetupStep1()" class="text-slate-400 hover:text-slate-600 text-xl font-bold">←</button>
              <h2 class="text-lg md:text-xl font-extrabold text-slate-800">פרטי האירוע</h2>
            </div>
            <p class="text-xs text-indigo-600 bg-indigo-50 rounded-xl p-3 mb-4">💡 תוכלו לערוך את כל הפרטים בהמשך בלשונית ההגדרות</p>

            <div class="md:grid md:grid-cols-2 md:gap-x-6 space-y-3 md:space-y-0">
              <!-- Col 1 -->
              <div class="space-y-3">
                <div>
                  <label class="block text-xs font-bold text-slate-600 mb-1">שם הבן (חובה)</label>
                  <input type="text" id="setupBoyName" placeholder="לדוגמה: יובל" class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-semibold">
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-600 mb-1">תאריך / פרשת השבוע</label>
                  <div class="flex gap-2 mb-2">
                    <button id="setupDateTypeDate" onclick="setSetupDateType('date')" class="flex-1 py-2 rounded-xl text-xs font-bold border-2 border-indigo-600 bg-indigo-600 text-white transition">📅 תאריך</button>
                    <button id="setupDateTypeParasha" onclick="setSetupDateType('parasha')" class="flex-1 py-2 rounded-xl text-xs font-bold border-2 border-slate-200 text-slate-600 transition">📖 פרשת השבוע</button>
                  </div>
                  <div id="setupDateInput">
                    <input type="date" id="setupEventDate" class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                  </div>
                  <div id="setupParashaInput" class="hidden space-y-2">
                    <select id="setupParashaYear" onchange="updateParashaList()" class="w-full p-3 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                      <option value="5786">תשפ״ו (2025–2026)</option>
                      <option value="5787">תשפ״ז (2026–2027)</option>
                      <option value="5788">תשפ״ח (2027–2028)</option>
                      <option value="5789">תשפ״ט (2028–2029)</option>
                    </select>
                    <select id="setupParashaName" onchange="updateParashaDatePreview()" class="w-full p-3 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                      <option value="">-- בחר פרשה --</option>
                    </select>
                    <div id="parashaDatePreview" class="text-xs text-indigo-700 bg-indigo-50 rounded-lg px-3 py-2 hidden">
                      📅 תאריך הפרשה: <span id="parashaDateText" class="font-bold"></span>
                    </div>
                  </div>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-600 mb-1">תקציב מתוכנן (₪) — ניתן לדלג</label>
                  <input type="number" id="setupBudget" placeholder="לדוגמה: 40000" class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-600 mb-1">שמות האחראיים</label>
                  <div class="grid grid-cols-2 gap-2">
                    <input type="text" id="setupResp1" value="אבא" class="p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-center font-bold">
                    <input type="text" id="setupResp2" value="אמא" class="p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-center font-bold">
                  </div>
                  <div id="extraRespsContainer" class="mt-2 space-y-2"></div>
                  <button onclick="addExtraResp()" class="mt-2 text-xs text-indigo-600 hover:underline font-bold">+ הוסף אחראי נוסף</button>
                </div>
              </div>

              <!-- Col 2 -->
              <div class="space-y-3">
                <div>
                  <label class="block text-xs font-bold text-slate-600 mb-2">האם האירוע כולל לינה?</label>
                  <div class="flex gap-2">
                    <button id="setupAccYes" onclick="setSetupAccommodation(true)" class="flex-1 py-2.5 rounded-xl text-xs font-bold border-2 border-slate-200 text-slate-600 transition">🏡 כן, יש לינה</button>
                    <button id="setupAccNo" onclick="setSetupAccommodation(false)" class="flex-1 py-2.5 rounded-xl text-xs font-bold border-2 border-indigo-600 bg-indigo-600 text-white transition">❌ לא, ללא לינה</button>
                  </div>
                </div>

                <div id="setupAccTypes" class="hidden space-y-2">
                  <label class="block text-xs font-bold text-slate-600">סוג הלינה (ניתן לבחור כמה)</label>
                  <label class="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                    <input type="checkbox" name="accType" value="villa" class="w-4 h-4 rounded text-indigo-600">
                    <span class="text-sm font-semibold">🏠 וילה</span>
                  </label>
                  <label class="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                    <input type="checkbox" name="accType" value="hotel" class="w-4 h-4 rounded text-indigo-600">
                    <span class="text-sm font-semibold">🏨 מלון / בית הארחה</span>
                  </label>
                  <label class="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                    <input type="checkbox" name="accType" value="friends" class="w-4 h-4 rounded text-indigo-600">
                    <span class="text-sm font-semibold">🏘️ אצל חברים / שכנים</span>
                  </label>
                </div>

                <div>
                  <label class="block text-xs font-bold text-slate-600 mb-2">אילו ארוחות מתקיימות?</label>
                  <div class="space-y-2">
                    <label class="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                      <input type="checkbox" id="setupMealFriday" value="friday" checked class="w-4 h-4 rounded text-indigo-600">
                      <span class="text-sm font-semibold">🍷 ערב שבת</span>
                    </label>
                    <label class="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                      <input type="checkbox" id="setupMealSaturday" value="saturday" checked class="w-4 h-4 rounded text-indigo-600">
                      <span class="text-sm font-semibold">⛪ בוקר שבת וקידוש</span>
                    </label>
                    <label class="flex items-center gap-3 p-3 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                      <input type="checkbox" id="setupMealThird" value="third" checked class="w-4 h-4 rounded text-indigo-600">
                      <span class="text-sm font-semibold">🥧 סעודה שלישית</span>
                    </label>
                  </div>
                </div>

                <div class="pt-2 md:pt-4">
                  <button onclick="completeSetup()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-4 rounded-2xl text-base transition shadow-lg">
                    צור את האירוע שלי ←
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Save Access Step -->
          <div id="setupStepSave" class="hidden p-6 md:p-10 md:flex-1 md:flex md:flex-col md:justify-center">
            <div class="text-center mb-6">
              <div class="text-5xl mb-3">🔑</div>
              <h2 class="text-xl md:text-2xl font-extrabold text-slate-800 mb-2">האירוע נוצר בהצלחה!</h2>
              <div class="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-right space-y-2">
                <p class="text-sm font-bold text-amber-900">רגע לפני שמתחילים — חשוב לקרוא 👇</p>
                <p class="text-sm text-amber-800 leading-relaxed">
                  המערכת שלנו לא עובדת עם סיסמאות. במקום זה, יש לכם <strong>קישור אישי</strong> שמוביל ישר לאירוע שלכם.
                </p>
                <p class="text-sm text-amber-800 leading-relaxed">
                  אם תרצו לפתוח את המערכת ממכשיר אחר — למשל טלפון של בת הזוג, טאבלט, או מחשב אחר — תצטרכו את הקישור הזה. <strong>אנחנו לא יכולים לשלוח אותו לכם מחדש.</strong>
                </p>
                <p class="text-sm font-bold text-amber-900">⬇️ שלחו אותו לעצמכם עכשיו — ייקח 10 שניות!</p>
              </div>
            </div>

            <!-- The link itself -->
            <div class="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 mb-5 flex items-center gap-2 overflow-hidden">
              <span class="text-xs text-slate-400 shrink-0">🔗</span>
              <span id="saveStepLink" class="text-xs font-mono text-indigo-700 truncate flex-1"></span>
            </div>

            <!-- Action buttons -->
            <div class="space-y-2.5 mb-5">
              <button onclick="saveStepWhatsApp()" class="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold py-4 rounded-2xl text-sm transition shadow-md flex items-center justify-center gap-3">
                <span class="text-xl">📲</span>
                <div class="text-right">
                  <div>שלח לעצמי בוואטסאפ</div>
                  <div class="text-emerald-100 text-xs font-normal">הכי מהיר — הודעה מוכנה, רק לשלוח</div>
                </div>
              </button>
              <button onclick="saveStepEmail()" class="w-full bg-blue-500 hover:bg-blue-600 text-white font-extrabold py-4 rounded-2xl text-sm transition shadow-md flex items-center justify-center gap-3">
                <span class="text-xl">📧</span>
                <div class="text-right">
                  <div>שלח לעצמי במייל</div>
                  <div class="text-blue-100 text-xs font-normal">פותח את המייל שלכם עם הודעה מוכנה</div>
                </div>
              </button>
              <button onclick="saveStepCopy()" class="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3.5 rounded-2xl text-sm transition flex items-center justify-center gap-2 border border-slate-200">
                <span>📋</span> העתק קישור ללוח
              </button>
            </div>

            <!-- Proceed button -->
            <button onclick="launchFromSave()" class="w-full py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition border border-dashed border-slate-200 rounded-2xl">
              כבר שמרתי — קדימה למערכת ✓
            </button>
          </div>
            <div class="flex items-center gap-2 mb-2">
              <button onclick="showSetupStep1()" class="text-slate-400 hover:text-slate-600 text-xl font-bold">←</button>
              <h2 class="text-lg md:text-xl font-extrabold text-slate-800">הצטרף לאירוע קיים</h2>
            </div>
            <p class="text-sm text-slate-600 bg-slate-50 rounded-xl p-4">
              💡 בקש מבן/בת הזוג לשלוח לך את <strong>קוד האירוע</strong> או את <strong>הלינק</strong> מלשונית ההגדרות
            </p>
            <div>
              <label class="block text-xs font-bold text-slate-600 mb-1">קוד האירוע</label>
              <input type="text" id="joinEventCode" placeholder="לדוגמה: bm-a3k9x2" dir="ltr" class="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-mono text-center text-lg">
            </div>
            <button onclick="joinExistingEvent()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-4 rounded-2xl text-base transition shadow-lg">
              התחבר לאירוע ←
            </button>
          </div>
        </div><!-- end right -->
      </div>
    </div>`;
    overlay.classList.remove('hidden');
    // Pre-populate parasha list
    setTimeout(() => { updateParashaList(); }, 100);
}

let _setupHasAccommodation = false;
let _setupDateType = 'date';
let _extraResps = [];
let _pendingSetup = null;

function showSetupStep1() {
    document.getElementById('setupStep1').classList.remove('hidden');
    document.getElementById('setupStepCreate').classList.add('hidden');
    document.getElementById('setupStepJoin').classList.add('hidden');
}

function showSetupCreate() {
    document.getElementById('setupStep1').classList.add('hidden');
    document.getElementById('setupStepCreate').classList.remove('hidden');
    document.getElementById('setupStepJoin').classList.add('hidden');
}

function showSetupJoin() {
    document.getElementById('setupStep1').classList.add('hidden');
    document.getElementById('setupStepCreate').classList.add('hidden');
    document.getElementById('setupStepJoin').classList.remove('hidden');
}

function setSetupDateType(type) {
    _setupDateType = type;
    const dateBtn = document.getElementById('setupDateTypeDate');
    const parashaBtn = document.getElementById('setupDateTypeParasha');
    const dateInput = document.getElementById('setupDateInput');
    const parashaInput = document.getElementById('setupParashaInput');

    if (type === 'date') {
        dateBtn.className = 'flex-1 py-2 rounded-xl text-xs font-bold border-2 border-indigo-600 bg-indigo-600 text-white transition';
        parashaBtn.className = 'flex-1 py-2 rounded-xl text-xs font-bold border-2 border-slate-200 text-slate-600 transition';
        dateInput.classList.remove('hidden');
        parashaInput.classList.add('hidden');
    } else {
        dateBtn.className = 'flex-1 py-2 rounded-xl text-xs font-bold border-2 border-slate-200 text-slate-600 transition';
        parashaBtn.className = 'flex-1 py-2 rounded-xl text-xs font-bold border-2 border-indigo-600 bg-indigo-600 text-white transition';
        dateInput.classList.add('hidden');
        parashaInput.classList.remove('hidden');
    }
}

function setSetupAccommodation(hasAcc) {
    _setupHasAccommodation = hasAcc;
    const yesBtn = document.getElementById('setupAccYes');
    const noBtn = document.getElementById('setupAccNo');
    const typesDiv = document.getElementById('setupAccTypes');
    if (hasAcc) {
        yesBtn.className = 'flex-1 py-2 rounded-xl text-xs font-bold border-2 border-indigo-600 bg-indigo-600 text-white transition';
        noBtn.className = 'flex-1 py-2 rounded-xl text-xs font-bold border-2 border-slate-200 text-slate-600 transition';
        typesDiv.classList.remove('hidden');
    } else {
        yesBtn.className = 'flex-1 py-2 rounded-xl text-xs font-bold border-2 border-slate-200 text-slate-600 transition';
        noBtn.className = 'flex-1 py-2 rounded-xl text-xs font-bold border-2 border-indigo-600 bg-indigo-600 text-white transition';
        typesDiv.classList.add('hidden');
    }
}

function addExtraResp() {
    const container = document.getElementById('extraRespsContainer');
    const idx = _extraResps.length;
    _extraResps.push('');
    const div = document.createElement('div');
    div.className = 'flex gap-2';
    div.innerHTML = `
        <input type="text" id="extraResp_${idx}" placeholder="שם אחראי נוסף" class="flex-1 p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none text-center font-bold">
        <button onclick="this.parentElement.remove()" class="text-slate-400 hover:text-red-500 px-2 font-bold text-lg">✕</button>
    `;
    container.appendChild(div);
}

function updateParashaList() {
    const yearSel = document.getElementById('setupParashaYear');
    const nameSel = document.getElementById('setupParashaName');
    if (!yearSel || !nameSel) return;
    const year = parseInt(yearSel.value);
    const list = getParashiyotForYear(year);
    nameSel.innerHTML = '<option value="">-- בחר פרשה --</option>';
    list.forEach(p => {
        const opt = document.createElement('option');
        opt.value = p;
        opt.textContent = p;
        nameSel.appendChild(opt);
    });
    document.getElementById('parashaDatePreview').classList.add('hidden');
}

function updateParashaDatePreview() {
    const yearSel = document.getElementById('setupParashaYear');
    const nameSel = document.getElementById('setupParashaName');
    const preview = document.getElementById('parashaDatePreview');
    const dateText = document.getElementById('parashaDateText');
    if (!yearSel || !nameSel) return;
    const year = parseInt(yearSel.value);
    const parasha = nameSel.value;
    if (!parasha) { preview.classList.add('hidden'); return; }
    const dateStr = getParashaDate(parasha, year);
    if (dateStr) {
        dateText.textContent = formatHebrewDate(dateStr);
        preview.classList.remove('hidden');
    } else {
        preview.classList.add('hidden');
    }
}

function completeSetup() {
    const boyName = document.getElementById('setupBoyName').value.trim();
    if (!boyName) { showToast('נא להזין שם הבן!'); return; }

    let eventDate = '';
    let useParasha = false;
    let parashaName = '';
    let parashaYear = 0;

    if (_setupDateType === 'parasha') {
        const yearSel = document.getElementById('setupParashaYear');
        const nameSel = document.getElementById('setupParashaName');
        parashaYear = parseInt(yearSel.value);
        parashaName = nameSel.value;
        if (!parashaName) { showToast('נא לבחור פרשה!'); return; }
        eventDate = getParashaDate(parashaName, parashaYear) || '';
        useParasha = true;
    } else {
        eventDate = document.getElementById('setupEventDate').value;
        if (!eventDate) { showToast('נא לבחור תאריך אירוע!'); return; }
        if (new Date(eventDate + 'T00:00:00') <= new Date(new Date().toDateString())) {
            showToast('תאריך האירוע חייב להיות בעתיד!'); return;
        }
    }

    const budget = parseFloat(document.getElementById('setupBudget').value) || null;
    const resp1 = document.getElementById('setupResp1').value.trim() || 'אבא';
    const resp2 = document.getElementById('setupResp2').value.trim() || 'אמא';

    const extraResps = [];
    document.querySelectorAll('[id^="extraResp_"]').forEach(el => {
        const v = el.value.trim();
        if (v) extraResps.push(v);
    });

    const accTypes = [];
    document.querySelectorAll('input[name="accType"]:checked').forEach(cb => accTypes.push(cb.value));

    const meals = [];
    if (document.getElementById('setupMealFriday')?.checked) meals.push('friday');
    if (document.getElementById('setupMealSaturday')?.checked) meals.push('saturday');
    if (document.getElementById('setupMealThird')?.checked) meals.push('third');
    if (meals.length === 0) { showToast('נא לבחור לפחות ארוחה אחת!'); return; }

    const eventId = generateEventId();
    const setup = {
        eventId,
        boyName,
        eventDate,
        useParasha,
        parashaName: useParasha ? parashaName : '',
        parashaYear: useParasha ? parashaYear : 0,
        budget,
        responsible1: resp1,
        responsible2: resp2,
        responsible3: 'משותף',
        additionalResponsibles: extraResps,
        hasAccommodation: _setupHasAccommodation,
        accommodationTypes: accTypes,
        meals,
        setupComplete: true
    };

    saveSetup(setup);
    _pendingSetup = setup;
    showSetupSaveStep(setup);
}

function showSetupSaveStep(setup) {
    ['setupStep1','setupStepCreate','setupStepJoin'].forEach(id => {
        document.getElementById(id)?.classList.add('hidden');
    });
    const step = document.getElementById('setupStepSave');
    if (step) step.classList.remove('hidden');

    const link = buildShareLink(setup.eventId);
    const el = document.getElementById('saveStepLink');
    if (el) el.textContent = link;
}

function launchFromSave() {
    const setup = _pendingSetup;
    _pendingSetup = null;
    hideSetupOverlay();
    initAppWithSetup(setup);
    if (!localStorage.getItem(ONBOARDING_KEY)) {
        setTimeout(() => showOnboarding(), 400);
    }
}

function saveStepWhatsApp() {
    if (!_pendingSetup) return;
    const link = buildShareLink(_pendingSetup.eventId);
    const name = _pendingSetup.boyName || 'בר המצווה';
    const text = `🔑 הקישור שלי למערכת ניהול בר המצווה של ${name}:\n${link}\n\n(שמור אותו — זה הכניסה למערכת ממכשיר כלשהו)`;
    sendWaText(text);
}

function saveStepEmail() {
    if (!_pendingSetup) return;
    const link = buildShareLink(_pendingSetup.eventId);
    const name = _pendingSetup.boyName || 'בר המצווה';
    const subject = encodeURIComponent(`הקישור שלי למערכת בר המצווה של ${name}`);
    const body = encodeURIComponent(
        `הקישור שלי למערכת ניהול בר המצווה:\n${link}\n\n` +
        `שמור אותו — זוהי הדרך היחידה להכנס למערכת ממכשיר אחר.\n\n` +
        `לפתיחה: פשוט לחץ על הקישור מכל דפדפן.`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
}

function saveStepCopy() {
    if (!_pendingSetup) return;
    const link = buildShareLink(_pendingSetup.eventId);
    navigator.clipboard?.writeText(link).then(() => showToast('הקישור הועתק! הדביקו אותו בצ\'אט או בהערות 📋'));
}

function joinExistingEvent() {
    let code = document.getElementById('joinEventCode').value.trim().toLowerCase();
    if (!code) { showToast('נא להזין קוד אירוע!'); return; }
    // Accept both "bm-xxxxx" and just "xxxxx"
    if (!code.startsWith('bm-')) code = 'bm-' + code;
    if (code.length < 5) { showToast('קוד אירוע לא תקין!'); return; }

    // Create minimal setup with this eventId — the rest will be pulled from cloud
    const setup = { eventId: code, setupComplete: true, joinedExisting: true };
    saveSetup(setup);
    hideSetupOverlay();
    // Connect to Firebase with this eventId — settings will be loaded from cloud
    initAppWithSetup(setup, true);
}

function hideSetupOverlay() {
    const overlay = document.getElementById('setupOverlay');
    if (overlay) overlay.classList.add('hidden');
}

// ─── Onboarding Tour ──────────────────────────────────────────────────────────

const ONBOARDING_STEPS = [
    { icon: '📅', title: 'משימות', desc: 'נהל את כל המשימות לתכנון האירוע. כל משימה מקבלת תאריך יעד ואחראי. המערכת תזהיר אותך על משימות דחופות.' },
    { icon: '👥', title: 'אישורי הגעה', desc: 'רשום אורחים ועקוב אחרי מי מגיע, לאילו ארוחות, ומי נשאר לישון. שלח הזמנות ב-WhatsApp ישירות מהמערכת.' },
    { icon: '💰', title: 'תקציב', desc: 'עקוב אחרי כל ההוצאות. רשום תשלומים חלקיים ובדוק בכל רגע כמה נשאר מהתקציב.' },
    { icon: '🔗', title: 'שיתוף', desc: 'בלשונית ההגדרות תמצא קוד ייחודי לאירוע שלך. שלח אותו לבן/בת הזוג ושניכם תוכלו לנהל יחד בזמן אמת.' },
    { icon: '🚀', title: 'מוכנים?', desc: 'הכל מוכן! תוכלו לערוך את הגדרות האירוע בכל עת בלשונית ההגדרות. בהצלחה ומזל טוב!' }
];

let _onboardingStep = 0;

function showOnboarding() {
    _onboardingStep = 0;
    renderOnboardingStep();
    document.getElementById('onboardingModal').classList.remove('hidden');
}

function renderOnboardingStep() {
    const step = ONBOARDING_STEPS[_onboardingStep];
    const total = ONBOARDING_STEPS.length;
    const modal = document.getElementById('onboardingModal');
    if (!modal) return;
    modal.innerHTML = `
    <div class="fixed inset-0 bg-indigo-950/80 z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center space-y-5">
            <div class="text-7xl">${step.icon}</div>
            <h2 class="text-2xl font-extrabold text-slate-800">${step.title}</h2>
            <p class="text-slate-600 text-sm leading-relaxed">${step.desc}</p>
            <!-- Progress dots -->
            <div class="flex justify-center gap-2">
                ${ONBOARDING_STEPS.map((_, i) => `<div class="w-2 h-2 rounded-full ${i === _onboardingStep ? 'bg-indigo-600' : 'bg-slate-200'}"></div>`).join('')}
            </div>
            <div class="flex gap-3">
                <button onclick="skipOnboarding()" class="flex-1 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-50 border border-slate-200 transition">דלג</button>
                <button onclick="nextOnboarding()" class="flex-1 py-3 rounded-2xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition shadow">
                    ${_onboardingStep < total - 1 ? 'הבא ←' : 'בוא נתחיל! 🚀'}
                </button>
            </div>
        </div>
    </div>`;
}

function nextOnboarding() {
    if (_onboardingStep < ONBOARDING_STEPS.length - 1) {
        _onboardingStep++;
        renderOnboardingStep();
    } else {
        skipOnboarding();
    }
}

function skipOnboarding() {
    localStorage.setItem(ONBOARDING_KEY, '1');
    document.getElementById('onboardingModal').classList.add('hidden');
}

// ─── Settings from setup ──────────────────────────────────────────────────────

function getEventConfig() {
    const setup = getSetup();
    if (!setup) return null;
    return {
        boyName: setup.boyName || 'הבן',
        eventDate: setup.eventDate || '',
        useParasha: setup.useParasha || false,
        parashaName: setup.parashaName || '',
        parashaYear: setup.parashaYear || 0,
        budget: setup.budget || null,
        responsible1: setup.responsible1 || 'אבא',
        responsible2: setup.responsible2 || 'אמא',
        responsible3: 'משותף',
        additionalResponsibles: setup.additionalResponsibles || [],
        hasAccommodation: setup.hasAccommodation || false,
        accommodationTypes: setup.accommodationTypes || [],
        meals: setup.meals || ['friday', 'saturday', 'third'],
        eventId: setup.eventId || ''
    };
}

function getAllResponsibles() {
    const cfg = getEventConfig();
    if (!cfg) return ['אבא', 'אמא', 'משותף'];
    return [cfg.responsible1, cfg.responsible2, cfg.responsible3, ...(cfg.additionalResponsibles || [])].filter(Boolean);
}

function getMealLabel(mealKey) {
    const labels = { friday: 'ערב שבת', saturday: 'בוקר שבת', third: 'סעודה שלישית' };
    return labels[mealKey] || mealKey;
}

function getMealEmoji(mealKey) {
    const emojis = { friday: '🍷', saturday: '⛪', third: '🥧' };
    return emojis[mealKey] || '🍽️';
}

function getActiveMeals() {
    const cfg = getEventConfig();
    return cfg ? cfg.meals : ['friday', 'saturday', 'third'];
}

// ─── Settings Editing ─────────────────────────────────────────────────────────

function renderSettingsEditForm() {
    const cfg = getEventConfig();
    const setup = getSetup();
    if (!cfg || !setup) return;

    const container = document.getElementById('settingsEditForm');
    if (!container) return;

    container.innerHTML = `
    <div class="space-y-4">
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label class="block text-xs font-bold text-slate-600 mb-1">שם הבן</label>
                <input type="text" id="editBoyName" value="${esc(cfg.boyName)}" class="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none font-semibold">
            </div>
            <div>
                <label class="block text-xs font-bold text-slate-600 mb-1">תאריך האירוע</label>
                <input type="date" id="editEventDate" value="${cfg.eventDate}" class="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            </div>
            <div>
                <label class="block text-xs font-bold text-slate-600 mb-1">תקציב (₪)</label>
                <input type="number" id="editBudget" value="${cfg.budget || ''}" placeholder="ריק = מעקב בלבד" class="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            </div>
        </div>

        <div>
            <label class="block text-xs font-bold text-slate-600 mb-1">אחראי 1</label>
            <input type="text" id="editResp1" value="${esc(cfg.responsible1)}" class="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none">
        </div>
        <div>
            <label class="block text-xs font-bold text-slate-600 mb-1">אחראי 2</label>
            <input type="text" id="editResp2" value="${esc(cfg.responsible2)}" class="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none">
        </div>
        ${cfg.additionalResponsibles.map((r, i) => `
        <div>
            <label class="block text-xs font-bold text-slate-600 mb-1">אחראי נוסף ${i+1}</label>
            <input type="text" id="editExtraResp_${i}" value="${esc(r)}" class="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none">
        </div>`).join('')}

        <div>
            <label class="block text-xs font-bold text-slate-600 mb-2">ארוחות פעילות</label>
            <div class="space-y-2">
                ${['friday','saturday','third'].map(m => `
                <label class="flex items-center gap-3 p-2.5 border border-slate-200 rounded-xl cursor-pointer hover:bg-slate-50">
                    <input type="checkbox" id="editMeal_${m}" ${cfg.meals.includes(m) ? 'checked' : ''} class="w-4 h-4 rounded text-indigo-600">
                    <span class="text-sm font-semibold">${getMealEmoji(m)} ${getMealLabel(m)}</span>
                </label>`).join('')}
            </div>
        </div>

        <div>
            <label class="block text-xs font-bold text-slate-600 mb-2">לינה באירוע</label>
            <div class="flex gap-2">
                <button id="editAccYes" onclick="editSetAcc(true)" class="flex-1 py-2 rounded-xl text-xs font-bold border-2 ${cfg.hasAccommodation ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 text-slate-600'} transition">🏡 כן</button>
                <button id="editAccNo" onclick="editSetAcc(false)" class="flex-1 py-2 rounded-xl text-xs font-bold border-2 ${!cfg.hasAccommodation ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 text-slate-600'} transition">❌ לא</button>
            </div>
        </div>

        <button onclick="saveSettingsEdit()" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition shadow">שמור שינויים</button>
    </div>`;
}

let _editHasAcc = false;
function editSetAcc(v) {
    _editHasAcc = v;
    document.getElementById('editAccYes').className = `flex-1 py-2 rounded-xl text-xs font-bold border-2 ${v ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 text-slate-600'} transition`;
    document.getElementById('editAccNo').className = `flex-1 py-2 rounded-xl text-xs font-bold border-2 ${!v ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-200 text-slate-600'} transition`;
}

function saveSettingsEdit() {
    const setup = getSetup() || {};
    setup.boyName = document.getElementById('editBoyName').value.trim() || setup.boyName;
    setup.eventDate = document.getElementById('editEventDate').value || setup.eventDate;
    const budgetVal = parseFloat(document.getElementById('editBudget').value);
    setup.budget = isNaN(budgetVal) ? null : budgetVal;
    setup.responsible1 = document.getElementById('editResp1').value.trim() || setup.responsible1;
    setup.responsible2 = document.getElementById('editResp2').value.trim() || setup.responsible2;
    const extraResps = [];
    document.querySelectorAll('[id^="editExtraResp_"]').forEach(el => {
        const v = el.value.trim();
        if (v) extraResps.push(v);
    });
    setup.additionalResponsibles = extraResps;
    const meals = [];
    if (document.getElementById('editMeal_friday')?.checked) meals.push('friday');
    if (document.getElementById('editMeal_saturday')?.checked) meals.push('saturday');
    if (document.getElementById('editMeal_third')?.checked) meals.push('third');
    if (meals.length > 0) setup.meals = meals;
    setup.hasAccommodation = _editHasAcc;

    saveSetup(setup);
    // Sync to cloud
    if (isCloudConnected && db) {
        dbSet('_settings', 'setup', setup);
    }
    updateHeaderFromSetup();
    renderSettingsTab();
    showToast('ההגדרות נשמרו בהצלחה! ✅');
}
