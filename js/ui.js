// ─── UI Utilities ─────────────────────────────────────────────────────────────

function esc(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function safeSetText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
}

function showToast(msg, duration = 3000) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.remove('opacity-0', 'translate-y-4');
    t.classList.add('opacity-100', 'translate-y-0');
    setTimeout(() => {
        t.classList.add('opacity-0', 'translate-y-4');
        t.classList.remove('opacity-100', 'translate-y-0');
    }, duration);
}

function switchTab(tabName) {
    currentTab = tabName;
    document.querySelectorAll('[data-tab]').forEach(el => {
        const isActive = el.dataset.tab === tabName;
        el.classList.toggle('hidden', !isActive);
    });
    // Mobile bottom nav
    document.querySelectorAll('[data-tabnav]').forEach(btn => {
        const isActive = btn.dataset.tabnav === tabName;
        btn.classList.toggle('text-indigo-600', isActive);
        btn.classList.toggle('text-slate-400', !isActive);
        btn.classList.toggle('font-bold', isActive);
    });
    // Desktop sidebar nav
    document.querySelectorAll('[data-sidernav]').forEach(btn => {
        const isActive = btn.dataset.sidernav === tabName;
        btn.classList.toggle('bg-white/20', isActive);
        btn.classList.toggle('text-white', isActive);
        btn.classList.toggle('font-bold', isActive);
        btn.classList.toggle('text-indigo-200', !isActive);
    });
    const titles = {
        tasks:'משימות', rsvp:'אישורי הגעה', budget:'תקציב', shopping:'קניות',
        rooms:'שיבוץ לינה', calls:'בירורים', logistics:'לוגיסטיקה',
        menu:'תפריט', schedule:'לוח זמנים', drinks:'מחשבון שתייה', settings:'הגדרות'
    };
    safeSetText('tabTitle', titles[tabName] || '');

    // Lazy / refresh renders
    if (tabName === 'settings') renderSettingsTab();
    if (tabName === 'drinks') renderDrinksInputs();
    if (tabName === 'rsvp') renderRsvpMeals();
    if (tabName === 'menu') { renderMenu(); renderMenuMealDropdown(); }
    if (tabName === 'schedule') { renderSchedule(); }
    if (tabName === 'rooms') renderRooms();
    if (tabName === 'logistics') renderLogistics();
    if (tabName === 'calls') renderCalls();
    if (tabName === 'tasks') populateResponsibleDropdown();
}

function populateResponsibleDropdown() {
    const sel = document.getElementById('newTaskResponsible');
    if (!sel) return;
    const responsibles = getAllResponsibles();
    const current = sel.value;
    sel.innerHTML = responsibles.map(r => `<option value="${esc(r)}" ${current===r?'selected':''}>${esc(r)}</option>`).join('') +
        `<option value="לא הוגדר" ${current==='לא הוגדר'?'selected':''}>לא הוגדר</option>`;
}

function hideLoadingOverlay() {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) overlay.classList.add('hidden');
}

// ─── Header / Countdown ───────────────────────────────────────────────────────

function updateHeaderFromSetup() {
    const cfg = getEventConfig();
    if (!cfg) return;
    safeSetText('headerBoyName', cfg.boyName);
    safeSetText('sidebarBoyName', cfg.boyName);
    const dateStr = cfg.useParasha
        ? `פרשת ${cfg.parashaName}`
        : formatHebrewDate(cfg.eventDate);
    safeSetText('headerEventDate', dateStr);
    safeSetText('sidebarEventDate', dateStr);
    updateCountdown();
}

function updateCountdown() {
    const cfg = getEventConfig();
    const el = document.getElementById('countdownDays');
    const label = document.getElementById('countdownLabel');
    if (!el || !cfg?.eventDate) return;
    const today = new Date(); today.setHours(0,0,0,0);
    const event = new Date(cfg.eventDate + 'T00:00:00');
    const diff = Math.round((event - today) / 86400000);
    if (diff > 0) {
        el.textContent = diff;
        if (label) label.textContent = `ימים לאירוע`;
    } else if (diff === 0) {
        el.textContent = '🎉';
        if (label) label.textContent = 'היום האירוע!';
    } else {
        el.textContent = Math.abs(diff);
        if (label) label.textContent = 'ימים מאז האירוע';
    }
    safeSetText('sidebarCountdown', el.textContent);
}

// ─── Stats ────────────────────────────────────────────────────────────────────

function calculateStats() {
    const doneTasks = tasks ? tasks.filter(t => t.status === 'done').length : 0;
    const totalTasks = tasks ? tasks.length : 0;
    const totalGuests = rsvps.reduce((s, g) => s + (g.cantAttend ? 0 : (g.adults||0) + (g.kids||0)), 0);
    const totalSpent = budget.reduce((s, e) => s + (e.payments||[]).reduce((ps, p) => ps + (p.amount||0), 0), 0);

    safeSetText('statDoneTasks', doneTasks);
    safeSetText('statTotalTasks', totalTasks);
    safeSetText('statGuests', totalGuests);
    safeSetText('statSpent', `₪${totalSpent.toLocaleString()}`);
    // Mirror to desktop sidebar
    safeSetText('sidebarStatDone', doneTasks);
    safeSetText('sidebarStatTotal', totalTasks);
    safeSetText('sidebarStatGuests', totalGuests);
    safeSetText('sidebarStatSpent', `₪${totalSpent.toLocaleString()}`);
}

// ─── Tasks ────────────────────────────────────────────────────────────────────

function renderTasks() {
    if (!tasks) return;
    calculateStats();
    renderResponsibleFilterButtons();

    const filtered = currentResponsibleFilter === 'all'
        ? tasks
        : tasks.filter(t => t.responsible === currentResponsibleFilter);

    if (taskViewMode === 'dynamic') {
        renderDynamicTasks(filtered);
    } else {
        renderSortedTasks(filtered);
    }
}

function renderResponsibleFilterButtons() {
    const container = document.getElementById('responsibleFilters');
    if (!container) return;
    const responsibles = getAllResponsibles();
    const all = ['all', ...responsibles];
    const labels = { all: 'הכל' };
    container.innerHTML = all.map(key => {
        const isActive = currentResponsibleFilter === key;
        const label = labels[key] || key;
        return `<button id="filter-${esc(key)}" onclick="setResponsibleFilter('${esc(key)}')"
            class="px-3 py-1 rounded-xl text-xs font-bold border transition ${isActive ? 'bg-indigo-600 border-indigo-600 text-white shadow-sm' : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}">${esc(label)}</button>`;
    }).join('');
}

const CATEGORY_LABELS = { overdue:'⚠️ באיחור', today:'🔥 היום / מחר', thisweek:'📅 השבוע', future:'🗓 עתידי', done:'✅ הושלם' };
const CATEGORY_ORDER = ['overdue','today','thisweek','future','done'];

function renderDynamicTasks(filtered) {
    const container = document.getElementById('dynamicTasksLayout');
    if (!container) return;
    const active = getActiveTasks(filtered);
    const grouped = {};
    CATEGORY_ORDER.forEach(k => grouped[k] = []);
    active.forEach(t => {
        const cat = t.status === 'done' ? 'done' : getRelativeCategory(t.deadline);
        (grouped[cat] = grouped[cat] || []).push(t);
    });
    container.innerHTML = CATEGORY_ORDER.map(cat => {
        const items = grouped[cat];
        if (!items.length) return '';
        return `
        <div class="space-y-2">
            <div class="text-xs font-bold text-slate-500 px-1">${CATEGORY_LABELS[cat]} (${items.length})</div>
            ${items.map(t => taskCard(t)).join('')}
        </div>`;
    }).join('');
}

function renderSortedTasks(filtered) {
    const container = document.getElementById('sortedTasksLayout');
    if (!container) return;
    const sorted = [...filtered].sort((a,b) => {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return a.deadline.localeCompare(b.deadline);
    });
    container.innerHTML = sorted.map(t => taskCard(t)).join('');
}

function taskCard(t) {
    if (editingTaskId === t.id) return taskEditCard(t);
    const statusColors = { todo:'border-slate-200 bg-white', inprogress:'border-yellow-200 bg-yellow-50', done:'border-emerald-200 bg-emerald-50 opacity-70' };
    const statusIcons = { todo:'⬜', inprogress:'🔄', done:'✅' };
    const deadline = t.deadline ? formatHebrewDate(t.deadline) : 'ללא תאריך';
    return `
    <div class="border rounded-2xl p-3.5 shadow-sm ${statusColors[t.status]||statusColors.todo}">
        <div class="flex items-start gap-3">
            <select onchange="updateTaskStatus('${t.id}',this.value)" class="mt-0.5 text-lg bg-transparent border-0 p-0 cursor-pointer focus:outline-none">
                <option value="todo" ${t.status==='todo'?'selected':''}>⬜</option>
                <option value="inprogress" ${t.status==='inprogress'?'selected':''}>🔄</option>
                <option value="done" ${t.status==='done'?'selected':''}>✅</option>
            </select>
            <div class="flex-1 min-w-0">
                <div class="font-semibold text-sm text-slate-800 ${t.status==='done'?'line-through text-slate-400':''}">${esc(t.title)}</div>
                <div class="flex flex-wrap gap-2 mt-1">
                    <span class="text-xs text-slate-500">📅 ${esc(deadline)}</span>
                    <span class="text-xs text-indigo-600 font-medium">👤 ${esc(t.responsible||'לא הוגדר')}</span>
                </div>
                ${t.notes ? `<div class="text-xs text-slate-500 mt-1 truncate">${esc(t.notes)}</div>` : ''}
            </div>
            <div class="flex gap-1 shrink-0">
                <button onclick="startEditTask('${t.id}')" class="text-slate-400 hover:text-indigo-600 p-1 rounded-lg hover:bg-indigo-50">✏️</button>
                <button onclick="deleteTask('${t.id}')" class="text-slate-400 hover:text-red-500 p-1 rounded-lg hover:bg-red-50">🗑</button>
            </div>
        </div>
    </div>`;
}

function taskEditCard(t) {
    const responsibles = getAllResponsibles();
    return `
    <div class="border-2 border-indigo-300 rounded-2xl p-4 bg-indigo-50 space-y-3">
        <div class="font-bold text-xs text-indigo-700">עריכת משימה</div>
        <input type="text" id="editTitle_${t.id}" value="${esc(t.title)}" class="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white">
        <div class="grid grid-cols-2 gap-2">
            <input type="date" id="editDeadline_${t.id}" value="${t.deadline||''}" class="p-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white">
            <select id="editResponsible_${t.id}" class="p-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                ${responsibles.map(r => `<option value="${esc(r)}" ${t.responsible===r?'selected':''}>${esc(r)}</option>`).join('')}
                <option value="לא הוגדר" ${t.responsible==='לא הוגדר'?'selected':''}>לא הוגדר</option>
            </select>
        </div>
        <textarea id="editNotes_${t.id}" placeholder="הערות..." rows="2" class="w-full p-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none bg-white resize-none">${esc(t.notes||'')}</textarea>
        <div class="flex gap-2 justify-end">
            <button onclick="cancelEditTask()" class="px-4 py-2 text-xs font-bold text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">ביטול</button>
            <button onclick="saveEditTask('${t.id}')" class="px-4 py-2 text-xs font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700">שמור</button>
        </div>
    </div>`;
}

function renderRecentTasks() {
    const container = document.getElementById('recentTasksList');
    if (!container || !tasks) return;
    const recent = tasks.filter(t => t.status !== 'done')
        .sort((a,b) => (a.deadline||'9').localeCompare(b.deadline||'9'))
        .slice(0,5);
    container.innerHTML = recent.map(t => `
    <div class="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
        <span class="text-lg">${t.status==='inprogress'?'🔄':'⬜'}</span>
        <div class="flex-1 min-w-0">
            <div class="text-sm font-semibold text-slate-800 truncate">${esc(t.title)}</div>
            ${t.deadline ? `<div class="text-xs text-slate-400">${formatHebrewDate(t.deadline)}</div>` : ''}
        </div>
    </div>`).join('') || '<div class="text-sm text-slate-400 text-center py-4">אין משימות פתוחות 🎉</div>';
}

// ─── RSVPs ────────────────────────────────────────────────────────────────────

function renderRsvps() {
    const container = document.getElementById('rsvpList');
    if (!container) return;
    const setup = getSetup();

    // Stats
    const attending = rsvps.filter(g => !g.cantAttend);
    const declined = rsvps.filter(g => g.cantAttend);
    const totalPeople = attending.reduce((s,g) => s + (g.adults||0)+(g.kids||0), 0);
    const sleeping = attending.filter(g => g.sleep && g.sleep !== 'no').reduce((s,g)=>s+(g.adults||0)+(g.kids||0),0);

    safeSetText('rsvpTotalFamilies', attending.length);
    safeSetText('rsvpTotalPeople', totalPeople);
    safeSetText('rsvpSleeping', sleeping);
    safeSetText('rsvpDeclined', declined.length);

    if (!rsvps.length) {
        container.innerHTML = `<div class="text-center text-slate-400 py-12 text-sm">עדיין אין אורחים רשומים<br>הוסיפו את הראשון!</div>`;
        return;
    }

    container.innerHTML = rsvps.map(g => {
        const mealLabels = (g.meals||[]).map(m => getMealEmoji(m) + ' ' + getMealLabel(m)).join(', ');
        const dietaryIcons = (g.dietary||[]).map(d => {
            const icons = {vegetarian:'🥦',vegan:'🌿','gluten-free':'🌾',mehadrin:'✡️'};
            const names = {vegetarian:'צמחוני',vegan:'טבעוני','gluten-free':'ללא גלוטן',mehadrin:'מהדרין'};
            return `<span class="px-2 py-0.5 bg-slate-100 rounded-full text-xs">${icons[d]||'🍽'} ${names[d]||d}</span>`;
        }).join('');
        return `
        <div class="bg-white border ${g.cantAttend?'border-red-100 opacity-60':'border-slate-100'} rounded-2xl p-4 shadow-sm space-y-2">
            <div class="flex items-start justify-between gap-2">
                <div>
                    <div class="font-bold text-slate-800">${esc(g.name)} ${g.cantAttend?'<span class="text-xs text-red-500 font-normal">(לא מגיע)</span>':''}</div>
                    <div class="text-xs text-slate-500 mt-0.5">
                        👨‍👩‍👧‍👦 ${g.adults||0} מבוגרים${g.kids?`, ${g.kids} ילדים`:''}
                        ${g.sleep&&g.sleep!=='no'?`· 🛏 לן`:''}
                        ${g.babyCot?`· 🍼 עריסה`:''}
                    </div>
                </div>
                <div class="flex gap-1.5 shrink-0">
                    <button onclick="inviteGuestWhatsApp('${g.id}')" title="שלח הזמנה בוואטסאפ" class="text-emerald-500 hover:text-emerald-700 p-1.5 rounded-xl hover:bg-emerald-50 text-base">📲</button>
                    <button onclick="deleteRsvp('${g.id}')" class="text-slate-300 hover:text-red-500 p-1.5 rounded-xl hover:bg-red-50 text-base">🗑</button>
                </div>
            </div>
            ${mealLabels ? `<div class="text-xs text-slate-500">${mealLabels}</div>` : ''}
            ${dietaryIcons ? `<div class="flex flex-wrap gap-1">${dietaryIcons}</div>` : ''}
            ${g.dietaryNote ? `<div class="text-xs text-amber-700 bg-amber-50 rounded-lg px-2 py-1">📝 ${esc(g.dietaryNote)}</div>` : ''}
        </div>`;
    }).join('');
}

// Render meal checkboxes dynamically in RSVP form
function renderRsvpMeals() {
    const container = document.getElementById('rsvpMealsContainer');
    if (!container) return;
    const meals = getActiveMeals();
    container.innerHTML = meals.map(m => `
    <label class="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" id="rsvpMeal_${m}" checked class="w-4 h-4 rounded text-indigo-600">
        <span class="text-sm">${getMealEmoji(m)} ${getMealLabel(m)}</span>
    </label>`).join('');
}

// ─── Budget ───────────────────────────────────────────────────────────────────

function renderBudget() {
    const cfg = getEventConfig();
    const maxBudget = cfg?.budget || null;
    const totalAllocated = budget.reduce((s,e) => s + (e.totalAmount||0), 0);
    const totalPaid = budget.reduce((s,e) => s + (e.payments||[]).reduce((ps,p)=>ps+(p.amount||0),0), 0);
    const remaining = (maxBudget || totalAllocated) - totalAllocated;

    // Update max budget input
    const maxInput = document.getElementById('budgetMaxInput');
    if (maxInput && maxBudget) maxInput.value = maxBudget;

    // Progress bar
    const progressSection = document.getElementById('budgetProgressSection');
    const nobudgetSection = document.getElementById('noBudgetSection');
    if (maxBudget) {
        if (progressSection) progressSection.classList.remove('hidden');
        if (nobudgetSection) nobudgetSection.classList.add('hidden');
        const pct = Math.min(100, Math.round((totalAllocated / maxBudget) * 100));
        const progressBar = document.getElementById('budgetProgressBar');
        const progressText = document.getElementById('budgetProgressText');
        if (progressBar) {
            progressBar.style.width = pct + '%';
            progressBar.className = `h-full rounded-full transition-all ${pct >= 90 ? 'bg-red-500' : pct >= 70 ? 'bg-amber-400' : 'bg-emerald-500'}`;
        }
        if (progressText) progressText.textContent = `${pct}% מהתקציב`;
        safeSetText('budgetTotal', `₪${maxBudget.toLocaleString()}`);
        safeSetText('budgetRemaining', `₪${Math.max(0, maxBudget - totalAllocated).toLocaleString()}`);
    } else {
        if (progressSection) progressSection.classList.add('hidden');
        if (nobudgetSection) nobudgetSection.classList.remove('hidden');
    }

    safeSetText('budgetAllocated', `₪${totalAllocated.toLocaleString()}`);
    safeSetText('budgetPaid', `₪${totalPaid.toLocaleString()}`);

    // Expense list
    const container = document.getElementById('budgetList');
    if (!container) return;
    if (!budget.length) {
        container.innerHTML = `<div class="text-center text-slate-400 py-12 text-sm">עדיין אין הוצאות<br>הוסיפו את הראשונה!</div>`;
        return;
    }
    container.innerHTML = budget.map(exp => {
        const paid = (exp.payments||[]).reduce((s,p)=>s+(p.amount||0),0);
        const remaining = exp.totalAmount - paid;
        const pct = exp.totalAmount > 0 ? Math.min(100, Math.round(paid/exp.totalAmount*100)) : 0;
        return `
        <div data-exp-id="${exp.id}" class="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-2">
            <div class="flex items-start justify-between gap-2">
                <div class="flex-1">
                    <div class="font-bold text-slate-800">${esc(exp.name)}</div>
                    <div class="text-xs text-slate-500 mt-0.5">סה"כ: ₪${(exp.totalAmount||0).toLocaleString()} · שולם: ₪${paid.toLocaleString()} · נותר: ₪${remaining.toLocaleString()}</div>
                </div>
                <div class="flex gap-1">
                    <button onclick="addPaymentToExpense('${exp.id}')" class="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold hover:bg-indigo-100">+ תשלום</button>
                    <button onclick="deleteExpense('${exp.id}')" class="text-slate-300 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50">🗑</button>
                </div>
            </div>
            <div class="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all ${pct >= 100 ? 'bg-emerald-500' : 'bg-indigo-400'}" style="width:${pct}%"></div>
            </div>
            ${(exp.payments||[]).map(p => `<div class="text-xs text-slate-500 flex gap-1">💳 ₪${p.amount} · ${p.method} · ${p.date||''}</div>`).join('')}
        </div>`;
    }).join('');
}

// ─── Shopping ─────────────────────────────────────────────────────────────────

const SHOP_CAT_LABELS = { disposable:'🍽️ כלים חד פעמיים', drinks:'🥤 שתייה', synagogue:'⛪ בית הכנסת', dessert:'🍰 קינוחים', accommodation:'🏡 אירוח', other:'📦 כללי' };

function renderShopping() {
    const container = document.getElementById('shoppingList');
    if (!container || !shopping) return;
    const done = shopping.filter(s=>s.bought).length;
    safeSetText('shopProgress', `${done}/${shopping.length}`);
    const progressBar = document.getElementById('shopProgressBar');
    if (progressBar) progressBar.style.width = (shopping.length ? Math.round(done/shopping.length*100) : 0) + '%';

    if (!shopping.length) {
        container.innerHTML = `<div class="text-center py-10 text-slate-400">
            <div class="text-4xl mb-3">🛒</div>
            <div class="font-semibold text-sm">רשימת הקניות ריקה</div>
            <div class="text-xs mt-1">הוסיפו פריטים באמצעות הטופס למעלה</div>
        </div>`;
        return;
    }

    if (shopViewMode === 'category') {
        const cats = {};
        shopping.forEach(item => {
            const cat = item.category||'other';
            if (!cats[cat]) cats[cat] = [];
            cats[cat].push(item);
        });
        container.innerHTML = Object.entries(cats).map(([cat, items]) => `
        <div class="space-y-1.5">
            <div class="text-xs font-bold text-slate-500 px-1">${SHOP_CAT_LABELS[cat]||cat} (${items.filter(i=>i.bought).length}/${items.length})</div>
            ${items.map(item => shopItemCard(item)).join('')}
        </div>`).join('');
    } else {
        const fresh = shopping.filter(s=>s.isFresh);
        const nonFresh = shopping.filter(s=>!s.isFresh);
        container.innerHTML = `
        <div class="space-y-1.5"><div class="text-xs font-bold text-slate-500 px-1">🛒 מוצרים רגילים</div>${nonFresh.map(shopItemCard).join('')}</div>
        ${fresh.length ? `<div class="space-y-1.5 mt-3"><div class="text-xs font-bold text-emerald-600 px-1">🌿 מוצרים טריים</div>${fresh.map(shopItemCard).join('')}</div>` : ''}`;
    }
}

function shopItemCard(item) {
    if (shopSelectMode) {
        const sel = selectedShopItems.has(item.id);
        return `<div data-batch-id="${item.id}" onclick="toggleShopItemSelect('${item.id}')" class="flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition ${sel?'bg-indigo-50 border-indigo-300':'bg-white border-slate-100'} shadow-sm">
            <input type="checkbox" ${sel?'checked':''} class="w-4 h-4 text-indigo-600" onclick="event.stopPropagation()">
            <span class="flex-1 text-sm ${item.bought?'line-through text-slate-400':'text-slate-700'}">${esc(item.title)}</span>
            ${item.isFresh?'<span class="text-xs text-emerald-600">טרי</span>':''}
        </div>`;
    }
    return `<div class="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
        <input type="checkbox" ${item.bought?'checked':''} onchange="toggleShopItem('${item.id}')" class="w-4 h-4 text-indigo-600 cursor-pointer">
        <span class="flex-1 text-sm ${item.bought?'line-through text-slate-400':'text-slate-700'}">${esc(item.title)}</span>
        ${item.isFresh?`<button onclick="toggleShopItemFresh('${item.id}')" class="text-xs text-emerald-600 px-2 py-0.5 rounded-full bg-emerald-50">טרי</button>`:`<button onclick="toggleShopItemFresh('${item.id}')" class="text-xs text-slate-400 px-2 py-0.5 rounded-full hover:bg-slate-50">+טרי</button>`}
        <button onclick="deleteShopItem('${item.id}')" class="text-slate-300 hover:text-red-400 p-1">✕</button>
    </div>`;
}

// ─── Rooms ────────────────────────────────────────────────────────────────────

function renderRooms() {
    const cfg = getEventConfig();
    const container = document.getElementById('roomsList');
    if (!container) return;
    const totalSlots = rooms.reduce((s,r)=>s+r.capacity,0);
    const usedSlots = rooms.reduce((s,r)=>s+(r.guests||[]).length,0);
    const totalExtGuests = externalLocations.reduce((s,l)=>s+(l.guests||[]).length,0);
    safeSetText('roomsStats', `${usedSlots}/${totalSlots} מיקומים מאוישים`);

    const typeLabels = { villa:'🏠 וילה', hotel:'🏨 מלון / בית הארחה', friends:'🏘️ חברים / שכנים' };

    if (!rooms.length) {
        container.innerHTML = `<div class="text-center py-8 text-slate-400">
            <div class="text-4xl mb-3">🏠</div>
            <div class="font-semibold text-sm">אין חדרים / מקומות לינה</div>
            <div class="text-xs mt-1">הוסיפו חדרים באמצעות הטופס למעלה</div>
        </div>`;
    } else {
        container.innerHTML = rooms.map(r => {
            const full = (r.guests||[]).length >= r.capacity;
            return `
            <div class="bg-white border ${full?'border-amber-200 bg-amber-50':'border-slate-100'} rounded-2xl p-4 shadow-sm space-y-3">
                <div class="flex items-center justify-between">
                    <div>
                        <div class="font-bold text-slate-800">${esc(r.name)}</div>
                        <div class="text-xs text-slate-500">${typeLabels[r.type]||r.type||''} · ${(r.guests||[]).length}/${r.capacity} אורחים</div>
                    </div>
                    <button onclick="deleteRoom('${r.id}')" class="text-slate-300 hover:text-red-500 p-1.5 rounded-xl hover:bg-red-50">🗑</button>
                </div>
                <div class="flex flex-wrap gap-1.5">
                    ${(r.guests||[]).map((g,i)=>`<div class="flex items-center gap-1 bg-indigo-50 text-indigo-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                        ${esc(g)} <button onclick="removeGuestFromRoom('${r.id}',${i})" class="text-indigo-400 hover:text-red-500 ml-1">✕</button>
                    </div>`).join('')}
                    ${full ? '<span class="text-xs text-amber-600 font-bold">• תפוס</span>' : ''}
                </div>
                ${!full ? `<div class="flex gap-2">
                    <input id="guestInput_${r.id}" type="text" placeholder="הוסף אורח..." class="flex-1 p-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" onkeydown="if(event.key==='Enter')addGuestToRoom('${r.id}')">
                    <button onclick="addGuestToRoom('${r.id}')" class="bg-indigo-600 text-white px-3 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700">+</button>
                </div>` : ''}
            </div>`;
        }).join('');
    }

    // External locations
    const extContainer = document.getElementById('extLocationsList');
    if (extContainer) {
        extContainer.innerHTML = externalLocations.map(loc => `
        <div class="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-3">
            <div class="flex items-center justify-between">
                <div class="font-bold text-slate-800">${esc(loc.name)}</div>
                <button onclick="deleteExternalLocation('${loc.id}')" class="text-slate-300 hover:text-red-500 p-1.5 rounded-xl hover:bg-red-50">🗑</button>
            </div>
            <div class="flex flex-wrap gap-1.5">
                ${(loc.guests||[]).map((g,i)=>`<div class="flex items-center gap-1 bg-slate-100 text-slate-700 text-xs font-semibold px-2.5 py-1 rounded-full">
                    ${esc(g)} <button onclick="removeGuestFromExtLocation('${loc.id}',${i})" class="text-slate-400 hover:text-red-500 ml-1">✕</button>
                </div>`).join('')}
            </div>
            <div class="flex gap-2">
                <input id="extGuestInput_${loc.id}" type="text" placeholder="הוסף שם..." class="flex-1 p-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" onkeydown="if(event.key==='Enter')addGuestToExtLocation('${loc.id}')">
                <button onclick="addGuestToExtLocation('${loc.id}')" class="bg-slate-600 text-white px-3 py-2 rounded-xl text-sm font-bold hover:bg-slate-700">+</button>
            </div>
        </div>`).join('');
    }
}

// ─── Calls ────────────────────────────────────────────────────────────────────

function renderCalls() {
    const container = document.getElementById('callsList');
    if (!container) return;
    const done = calls.filter(c=>c.done).length;
    safeSetText('callsProgress', `${done}/${calls.length} הושלמו`);
    if (!calls.length) {
        container.innerHTML = `<div class="text-center py-10 text-slate-400">
            <div class="text-4xl mb-3">📞</div>
            <div class="font-semibold text-sm">אין בירורים ברשימה</div>
            <div class="text-xs mt-1">הוסיפו בירורים שצריך לבצע באמצעות הטופס למעלה</div>
        </div>`;
        return;
    }
    container.innerHTML = calls.map(c => `
    <div class="bg-white border ${c.done?'border-emerald-200 bg-emerald-50':'border-slate-100'} rounded-2xl p-4 shadow-sm space-y-2">
        <div class="flex items-start gap-3">
            <input type="checkbox" ${c.done?'checked':''} onchange="toggleCallDone('${c.id}')" class="mt-1 w-4 h-4 text-emerald-600 cursor-pointer">
            <div class="flex-1">
                <div class="font-bold text-sm text-slate-800 ${c.done?'line-through text-slate-400':''}">${esc(c.title)}</div>
                ${c.subtitle ? `<div class="text-xs text-slate-500 mt-0.5">${esc(c.subtitle)}</div>` : ''}
                ${c.phone ? `<a href="tel:${esc(c.phone)}" class="text-xs text-indigo-600 hover:underline mt-0.5 block">📞 ${esc(c.phone)}</a>` : ''}
                <textarea placeholder="הערות..." rows="1" onchange="updateCallNotes('${c.id}',this.value)" class="mt-2 w-full p-2 border border-slate-100 rounded-xl text-xs text-slate-600 bg-transparent focus:bg-white focus:ring-1 focus:ring-indigo-300 focus:outline-none resize-none">${esc(c.notes||'')}</textarea>
            </div>
            <button onclick="deleteCall('${c.id}')" class="text-slate-300 hover:text-red-500 p-1 rounded-lg hover:bg-red-50 shrink-0">🗑</button>
        </div>
    </div>`).join('');
}

// ─── Logistics ────────────────────────────────────────────────────────────────

function renderLogistics(filter) {
    if (filter) currentLogisticsFilter = filter;
    const container = document.getElementById('logisticsList');
    if (!container) return;
    const filtered = currentLogisticsFilter === 'all' ? logistics :
        currentLogisticsFilter === 'packed' ? logistics.filter(l=>l.packed) :
        logistics.filter(l=>!l.packed);
    ['all','packed','unpacked'].forEach(f => {
        const btn = document.getElementById('logFilter_'+f);
        if (btn) btn.className = `px-3 py-1 rounded-xl text-xs font-bold border transition ${currentLogisticsFilter===f?'bg-indigo-600 border-indigo-600 text-white':'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}`;
    });
    container.innerHTML = filtered.map(log => {
        const checkedCount = log.items.filter(i=>i.checked).length;
        return `
        <div class="bg-white border ${log.packed?'border-emerald-200 bg-emerald-50':'border-slate-100'} rounded-2xl p-4 shadow-sm space-y-3">
            <div class="flex items-start justify-between">
                <div>
                    <div class="font-bold text-slate-800 flex items-center gap-2">
                        <input type="checkbox" ${log.packed?'checked':''} onchange="toggleKitPacked('${log.id}')" class="w-4 h-4 text-emerald-600">
                        ${esc(log.name)}
                    </div>
                    ${log.destination ? `<div class="text-xs text-slate-500 mt-0.5">📍 ${esc(log.destination)}</div>` : ''}
                    <div class="text-xs text-slate-400 mt-0.5">${checkedCount}/${log.items.length} פריטים</div>
                </div>
                <button onclick="deleteLogisticsKit('${log.id}')" class="text-slate-300 hover:text-red-500 p-1.5 rounded-xl hover:bg-red-50">🗑</button>
            </div>
            <div class="space-y-1.5">
                ${log.items.map((item,idx) => `
                <div class="flex items-center gap-2.5">
                    <input type="checkbox" ${item.checked?'checked':''} onchange="toggleLogItem('${log.id}',${idx})" class="w-4 h-4 text-indigo-600">
                    <span class="flex-1 text-sm ${item.checked?'line-through text-slate-400':'text-slate-700'}">${esc(item.name)}</span>
                    <button onclick="deleteLogItem('${log.id}',${idx})" class="text-slate-300 hover:text-red-400 text-xs">✕</button>
                </div>`).join('')}
            </div>
            <div class="flex gap-2">
                <input id="input_${log.id}" type="text" placeholder="הוסף פריט..." class="flex-1 p-2 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none" onkeydown="if(event.key==='Enter')addLogItemInline('${log.id}')">
                <button onclick="addLogItemInline('${log.id}')" class="bg-indigo-600 text-white px-3 py-2 rounded-xl text-sm font-bold hover:bg-indigo-700">+</button>
            </div>
        </div>`;
    }).join('') || '<div class="text-center text-slate-400 py-8 text-sm">אין ערכות לינה</div>';
}

// ─── Menu ─────────────────────────────────────────────────────────────────────

const MENU_CAT_ORDER = ['מנה ראשונה','מנה עיקרית','תוספות','קינוח','שתייה','כיבוד'];

function renderMenu() {
    const container = document.getElementById('menuList');
    if (!container) return;
    const meals = getActiveMeals();
    const mealFilter = currentMenuFilter;
    let filtered = mealFilter === 'הכל' ? menu : menu.filter(m => m.meal === mealFilter);

    // Filter buttons
    const filterBar = document.getElementById('menuFilterBar');
    if (filterBar) {
        const filters = ['הכל', ...meals];
        filterBar.innerHTML = filters.map(f => {
            const label = f === 'הכל' ? 'הכל' : `${getMealEmoji(f)} ${getMealLabel(f)}`;
            const isActive = currentMenuFilter === f;
            return `<button onclick="filterMenu('${f}')" class="px-3 py-1 rounded-xl text-xs font-bold border transition ${isActive?'bg-indigo-600 border-indigo-600 text-white':'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'}">${label}</button>`;
        }).join('');
    }

    // Render by category
    const grouped = {};
    filtered.forEach(item => {
        const cat = item.cat || 'כללי';
        if (!grouped[cat]) grouped[cat] = [];
        grouped[cat].push(item);
    });
    if (!filtered.length) {
        container.innerHTML = '<div class="text-center text-slate-400 py-8 text-sm">אין מנות עדיין</div>';
        return;
    }
    container.innerHTML = [...MENU_CAT_ORDER, ...Object.keys(grouped).filter(k => !MENU_CAT_ORDER.includes(k))]
        .filter(cat => grouped[cat]?.length)
        .map(cat => `
        <div class="space-y-1.5">
            <div class="text-xs font-bold text-slate-500 px-1">${esc(cat)}</div>
            ${grouped[cat].map(item => {
                if (editingMenuId === item.id) return `
                <div class="border-2 border-indigo-300 rounded-2xl p-3 bg-indigo-50 space-y-2">
                    <input id="editMenuName" type="text" value="${esc(item.name)}" class="w-full p-2 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                    <select id="editMenuCat" class="w-full p-2 border border-slate-200 rounded-xl text-sm bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
                        ${MENU_CAT_ORDER.map(c => `<option ${item.cat===c?'selected':''}>${c}</option>`).join('')}
                    </select>
                    <div class="flex gap-2 justify-end">
                        <button onclick="editingMenuId=null;renderMenu()" class="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600">ביטול</button>
                        <button onclick="saveEditMenu('${item.id}')" class="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white">שמור</button>
                    </div>
                </div>`;
                return `<div class="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                    <div class="flex-1">
                        <span class="text-sm font-semibold text-slate-800">${esc(item.name)}</span>
                        ${item.vegan?'<span class="text-xs text-emerald-600 mr-1">🌿</span>':''}
                        ${item.gluten?'<span class="text-xs text-amber-600 mr-1">🌾</span>':''}
                        <span class="text-xs text-slate-400 mr-1">${getMealEmoji(item.meal)}</span>
                    </div>
                    <button onclick="editMenuItem('${item.id}')" class="text-slate-400 hover:text-indigo-600 p-1">✏️</button>
                    <button onclick="deleteMenuItem('${item.id}')" class="text-slate-400 hover:text-red-500 p-1">🗑</button>
                </div>`;
            }).join('')}
        </div>`).join('');
}

function renderMenuMealDropdown() {
    const sel = document.getElementById('newMenuMeal');
    if (!sel) return;
    const meals = getActiveMeals();
    sel.innerHTML = meals.map(m => `<option value="${m}">${getMealEmoji(m)} ${getMealLabel(m)}</option>`).join('');
}

// ─── Schedule ─────────────────────────────────────────────────────────────────

function renderSchedule() {
    const container = document.getElementById('scheduleList');
    if (!container) return;
    const meals = getActiveMeals();

    const colTitles = { friday:'ערב שבת 🍷', saturday:'בוקר שבת ⛪', third:'סעודה שלישית 🥧' };

    // Column layout
    const cols = meals.map(day => {
        const dayItems = schedule.filter(s => s.day === day).sort((a,b) => (a.time||'').localeCompare(b.time||''));
        const items = dayItems.map(item => {
            if (editingScheduleId === item.id) return `
            <div class="border-2 border-indigo-300 rounded-xl p-3 bg-indigo-50 space-y-2 text-xs">
                <input id="editSchTitle" type="text" value="${esc(item.title)}" class="w-full p-1.5 border rounded-lg bg-white focus:outline-none">
                <div class="grid grid-cols-2 gap-1.5">
                    <input id="editSchTime" type="time" value="${item.time||''}" class="p-1.5 border rounded-lg bg-white focus:outline-none">
                    <select id="editSchDay" class="p-1.5 border rounded-lg bg-white focus:outline-none">
                        ${meals.map(m=>`<option value="${m}" ${item.day===m?'selected':''}>${getMealLabel(m)}</option>`).join('')}
                    </select>
                </div>
                <input id="editSchSpeaker" type="text" value="${esc(item.speaker||'')}" placeholder="דובר / מבצע" class="w-full p-1.5 border rounded-lg bg-white focus:outline-none">
                <div class="flex gap-2 justify-end">
                    <button onclick="editingScheduleId=null;renderSchedule()" class="px-2 py-1 rounded-lg bg-slate-100 text-slate-600">ביטול</button>
                    <button onclick="saveEditSchedule('${item.id}')" class="px-2 py-1 rounded-lg bg-indigo-600 text-white">שמור</button>
                </div>
            </div>`;
            return `<div class="bg-white border border-slate-100 rounded-xl p-3 shadow-sm text-sm space-y-0.5 cursor-pointer hover:border-indigo-200" onclick="editingScheduleId='${item.id}';renderSchedule()">
                ${item.time ? `<div class="font-bold text-indigo-700 text-xs">${item.time}</div>` : ''}
                <div class="font-semibold text-slate-800">${esc(item.title)}</div>
                ${item.speaker ? `<div class="text-xs text-slate-500">${esc(item.speaker)}</div>` : ''}
                <button onclick="event.stopPropagation();deleteScheduleItem('${item.id}')" class="text-slate-300 hover:text-red-400 float-left text-xs">✕</button>
            </div>`;
        }).join('');
        return `<div class="bg-slate-50 rounded-2xl p-3 space-y-2 flex-1">
            <div class="text-xs font-bold text-slate-600 text-center">${colTitles[day]||day}</div>
            ${items || '<div class="text-xs text-slate-400 text-center py-2">ריק</div>'}
        </div>`;
    });

    container.innerHTML = `<div class="flex gap-3 overflow-x-auto pb-2">${cols.join('')}</div>`;

    // Unscheduled items
    const unscheduled = schedule.filter(s => !s.day || !meals.includes(s.day));
    if (unscheduled.length) {
        container.innerHTML += `<div class="mt-3 space-y-1.5">
            <div class="text-xs font-bold text-slate-500">📋 לא משובצים</div>
            ${unscheduled.map(item => `<div class="bg-white border border-slate-100 rounded-xl p-2.5 shadow-sm text-xs flex items-center justify-between cursor-pointer hover:border-indigo-200" onclick="editingScheduleId='${item.id}';renderSchedule()">
                <span class="font-semibold text-slate-700">${esc(item.title)}</span>
                <button onclick="event.stopPropagation();deleteScheduleItem('${item.id}')" class="text-slate-300 hover:text-red-400">✕</button>
            </div>`).join('')}
        </div>`;
    }

    // Update day dropdown in form
    const schDayEl = document.getElementById('schDay');
    if (schDayEl) schDayEl.innerHTML = `<option value="">-- לא שובץ --</option>` +
        meals.map(m=>`<option value="${m}">${getMealLabel(m)}</option>`).join('');
}

// ─── Drinks Calculator ────────────────────────────────────────────────────────

function renderDrinksInputs() {
    const container = document.getElementById('drinksInputs');
    if (!container) return;
    container.innerHTML = getActiveMeals().map(m => `
    <div class="flex items-center gap-3 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
        <span class="font-semibold text-sm text-slate-700 flex-1">${getMealEmoji(m)} ${getMealLabel(m)}</span>
        <input type="number" id="guestsForMeal_${m}" min="0" value="0" placeholder="0" class="w-20 p-2 border border-slate-200 rounded-xl text-sm text-center focus:ring-2 focus:ring-indigo-500 focus:outline-none" oninput="calculateDrinks()">
        <span class="text-xs text-slate-500">אורחים</span>
    </div>`).join('');
}

// ─── Settings Tab ─────────────────────────────────────────────────────────────

function renderSettingsTab() {
    const cfg = getEventConfig();
    const setup = getSetup();
    if (!cfg || !setup) return;

    // Update sharing section
    safeSetText('settingsEventId', setup.eventId || '');
    safeSetText('settingsBoyName', cfg.boyName);
    const dateStr = cfg.useParasha ? `פרשת ${cfg.parashaName}` : formatHebrewDate(cfg.eventDate);
    safeSetText('settingsEventDate', dateStr);

    // Render the editable form
    renderSettingsEditForm();
    // Init edit_has_acc from current config
    _editHasAcc = cfg.hasAccommodation;
}

// ─── QR Code ──────────────────────────────────────────────────────────────────

function showQrCode() {
    const setup = getSetup();
    if (!setup?.eventId) { showToast('צור אירוע תחילה!'); return; }
    const link = buildShareLink(setup.eventId);
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(link)}`;
    const modal = document.getElementById('qrModal');
    const img = document.getElementById('qrImage');
    const linkEl = document.getElementById('qrLink');
    if (modal && img) {
        img.src = qrUrl;
        if (linkEl) linkEl.textContent = link;
        modal.classList.remove('hidden');
    }
}
