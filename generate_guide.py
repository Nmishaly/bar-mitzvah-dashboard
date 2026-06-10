#!/usr/bin/env python3
"""Generate a Hebrew user guide PDF for the Bar Mitzvah Dashboard."""

import os, sys

HTML = """<!DOCTYPE html>
<html dir="rtl" lang="he">
<head>
<meta charset="UTF-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Heebo:wght@300;400;600;700;900&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Heebo', 'DejaVu Sans', Arial, sans-serif;
    font-size: 11pt;
    color: #1e293b;
    direction: rtl;
    line-height: 1.7;
    background: #fff;
  }

  /* ── Page setup ── */
  @page {
    size: A4;
    margin: 0;
  }
  @page cover { margin: 0; }
  @page content {
    margin: 18mm 15mm 18mm 15mm;
    @bottom-center {
      content: counter(page);
      font-family: 'Heebo', Arial, sans-serif;
      font-size: 9pt;
      color: #94a3b8;
    }
  }

  /* ── Cover page ── */
  .cover {
    page: cover;
    width: 210mm;
    height: 297mm;
    background: linear-gradient(145deg, #3730a3 0%, #4f46e5 45%, #7c3aed 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: white;
    padding: 20mm;
    page-break-after: always;
  }
  .cover-star { font-size: 72pt; margin-bottom: 8mm; }
  .cover-title { font-size: 32pt; font-weight: 900; line-height: 1.2; margin-bottom: 5mm; }
  .cover-subtitle { font-size: 14pt; font-weight: 300; opacity: 0.85; margin-bottom: 12mm; }
  .cover-divider { width: 50mm; height: 2px; background: rgba(255,255,255,0.4); margin: 0 auto 12mm; }
  .cover-desc {
    font-size: 11pt; font-weight: 300; opacity: 0.80;
    max-width: 130mm; line-height: 1.8;
  }
  .cover-footer {
    position: absolute; bottom: 18mm; left: 0; right: 0;
    text-align: center; font-size: 9pt; opacity: 0.5;
  }

  /* ── Content pages ── */
  .content { page: content; counter-reset: page 1; }

  /* ── Section header ── */
  .section-header {
    background: linear-gradient(135deg, #4f46e5, #7c3aed);
    color: white;
    border-radius: 10px;
    padding: 7mm 8mm;
    margin: 8mm 0 5mm;
    display: flex;
    align-items: center;
    gap: 4mm;
    page-break-after: avoid;
  }
  .section-header .icon { font-size: 20pt; }
  .section-header .text h2 { font-size: 16pt; font-weight: 800; }
  .section-header .text p { font-size: 9pt; opacity: 0.85; margin-top: 1mm; }

  /* ── Sub-section ── */
  .sub { margin: 5mm 0 3mm; page-break-after: avoid; }
  .sub h3 { font-size: 12pt; font-weight: 700; color: #4f46e5; border-right: 3px solid #4f46e5; padding-right: 3mm; }

  /* ── Step boxes ── */
  .steps { margin: 3mm 0 5mm; }
  .step {
    display: flex; align-items: flex-start; gap: 4mm;
    margin-bottom: 3.5mm;
    padding: 3.5mm 4mm;
    background: #f8fafc;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
    page-break-inside: avoid;
  }
  .step-num {
    min-width: 8mm; height: 8mm;
    background: #4f46e5; color: white;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 9pt; font-weight: 800; flex-shrink: 0;
  }
  .step-body { flex: 1; }
  .step-body strong { font-size: 10.5pt; font-weight: 700; display: block; color: #1e293b; }
  .step-body span { font-size: 9.5pt; color: #475569; }

  /* ── Tip / Info boxes ── */
  .tip {
    background: #eff6ff; border: 1px solid #bfdbfe;
    border-radius: 8px; padding: 4mm 5mm;
    margin: 4mm 0; display: flex; gap: 3mm;
    align-items: flex-start; page-break-inside: avoid;
  }
  .tip .tip-icon { font-size: 14pt; flex-shrink: 0; }
  .tip p { font-size: 9.5pt; color: #1e40af; line-height: 1.7; }
  .tip strong { font-weight: 700; }

  .warn {
    background: #fffbeb; border: 1px solid #fde68a;
    border-radius: 8px; padding: 4mm 5mm;
    margin: 4mm 0; display: flex; gap: 3mm;
    align-items: flex-start; page-break-inside: avoid;
  }
  .warn .tip-icon { font-size: 14pt; flex-shrink: 0; }
  .warn p { font-size: 9.5pt; color: #92400e; line-height: 1.7; }

  /* ── Tab grid ── */
  .tab-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 3mm; margin: 4mm 0; }
  .tab-card {
    border: 1px solid #e2e8f0; border-radius: 8px;
    padding: 4mm; background: #fff;
    page-break-inside: avoid;
  }
  .tab-card .tab-title { font-size: 10pt; font-weight: 700; color: #1e293b; margin-bottom: 1.5mm; }
  .tab-card .tab-icon { font-size: 16pt; margin-bottom: 2mm; }
  .tab-card p { font-size: 9pt; color: #64748b; line-height: 1.6; }

  /* ── FAQ ── */
  .faq-item { margin: 4mm 0; page-break-inside: avoid; }
  .faq-q { font-size: 10.5pt; font-weight: 700; color: #4f46e5; margin-bottom: 1mm; }
  .faq-a { font-size: 9.5pt; color: #475569; padding-right: 4mm; border-right: 2px solid #c7d2fe; }

  /* ── Share box ── */
  .share-box {
    background: linear-gradient(135deg, #ede9fe, #ddd6fe);
    border: 1px solid #c4b5fd; border-radius: 10px;
    padding: 5mm 6mm; margin: 4mm 0; page-break-inside: avoid;
  }
  .share-box .share-label { font-size: 9pt; font-weight: 700; color: #6d28d9; margin-bottom: 2mm; }
  .share-box .share-url {
    font-family: monospace; font-size: 10pt; color: #4f46e5;
    background: white; border-radius: 6px;
    padding: 2.5mm 4mm; word-break: break-all;
    border: 1px solid #ddd6fe;
  }

  /* ── Page break ── */
  .page-break { page-break-after: always; }
  .no-break { page-break-inside: avoid; }

  /* ── Table of contents ── */
  .toc { margin: 5mm 0; }
  .toc-item {
    display: flex; justify-content: space-between;
    align-items: center;
    padding: 2.5mm 0;
    border-bottom: 1px dotted #cbd5e1;
    font-size: 10.5pt;
  }
  .toc-item .toc-title { color: #1e293b; font-weight: 600; }
  .toc-item .toc-num { color: #94a3b8; font-size: 9.5pt; }

  /* ── Inline highlight ── */
  .hl { background: #ede9fe; color: #5b21b6; padding: 0 2px; border-radius: 3px; font-weight: 600; }
</style>
</head>
<body>

<!-- ════ COVER PAGE ════ -->
<div class="cover">
  <div class="cover-star">✡️</div>
  <div class="cover-title">מדריך למשתמש<br>מערכת ניהול בר מצווה</div>
  <div class="cover-subtitle">כל מה שצריך לדעת כדי לתכנן את האירוע המושלם</div>
  <div class="cover-divider"></div>
  <div class="cover-desc">
    מדריך זה יסביר כיצד להשתמש במערכת ניהול בר המצווה — מיצירת האירוע הראשון,
    דרך שיתוף עם בני המשפחה, ועד קבלת אישורי הגעה מהאורחים.
  </div>
  <div class="cover-footer">מדריך מקיף · כל הזכויות שמורות</div>
</div>

<!-- ════ CONTENT ════ -->
<div class="content">

<!-- ── Table of Contents ── -->
<div class="section-header">
  <div class="icon">📋</div>
  <div class="text">
    <h2>תוכן עניינים</h2>
    <p>סקירה כללית של נושאי המדריך</p>
  </div>
</div>
<div class="toc">
  <div class="toc-item"><span class="toc-title">1. מה זאת המערכת?</span><span class="toc-num">עמוד 2</span></div>
  <div class="toc-item"><span class="toc-title">2. כניסה ראשונה — יצירת האירוע</span><span class="toc-num">עמוד 2</span></div>
  <div class="toc-item"><span class="toc-title">3. ניווט במערכת — הלשוניות</span><span class="toc-num">עמוד 3</span></div>
  <div class="toc-item"><span class="toc-title">4. ניהול משימות</span><span class="toc-num">עמוד 3</span></div>
  <div class="toc-item"><span class="toc-title">5. ניהול אורחים ואישורי הגעה</span><span class="toc-num">עמוד 4</span></div>
  <div class="toc-item"><span class="toc-title">6. ניהול תקציב</span><span class="toc-num">עמוד 4</span></div>
  <div class="toc-item"><span class="toc-title">7. רשימת קניות</span><span class="toc-num">עמוד 5</span></div>
  <div class="toc-item"><span class="toc-title">8. שיבוץ לינה</span><span class="toc-num">עמוד 5</span></div>
  <div class="toc-item"><span class="toc-title">9. בירורים ולוגיסטיקה</span><span class="toc-num">עמוד 5</span></div>
  <div class="toc-item"><span class="toc-title">10. שיתוף עם בני משפחה</span><span class="toc-num">עמוד 6</span></div>
  <div class="toc-item"><span class="toc-title">11. אישור הגעה לאורחים</span><span class="toc-num">עמוד 6</span></div>
  <div class="toc-item"><span class="toc-title">12. גיבוי נתונים</span><span class="toc-num">עמוד 7</span></div>
  <div class="toc-item"><span class="toc-title">13. שאלות נפוצות</span><span class="toc-num">עמוד 7</span></div>
</div>

<div class="page-break"></div>

<!-- ── Section 1: What is this? ── -->
<div class="section-header">
  <div class="icon">✡️</div>
  <div class="text">
    <h2>1. מה זאת המערכת?</h2>
    <p>הכירו את מערכת ניהול בר המצווה</p>
  </div>
</div>
<p style="font-size:10.5pt; color:#475569; margin-bottom:3mm; line-height:1.8">
  מערכת ניהול בר המצווה היא אתר אינטרנט חינמי שעוזר לכם לתכנן ולנהל את כל היבטי
  האירוע במקום אחד — משימות, אורחים, תקציב, קניות, לינה, תפריט ועוד.
  המערכת מסונכרנת בין כל בני המשפחה בזמן אמת, כך שכולם תמיד רואים את המידע העדכני.
</p>
<div class="tab-grid">
  <div class="tab-card"><div class="tab-icon">✅</div><div class="tab-title">ניהול משימות</div><p>רשימת כל המשימות לפני האירוע, עם תאריכי יעד ואחראים</p></div>
  <div class="tab-card"><div class="tab-icon">👥</div><div class="tab-title">ניהול אורחים</div><p>מעקב אחר אישורי הגעה, ארוחות, העדפות תזונה ולינה</p></div>
  <div class="tab-card"><div class="tab-icon">💰</div><div class="tab-title">ניהול תקציב</div><p>מעקב אחר הוצאות, תשלומים ויתרת התקציב</p></div>
  <div class="tab-card"><div class="tab-icon">🛒</div><div class="tab-title">רשימת קניות</div><p>כל מה שצריך לקנות, מאורגן לפי קטגוריות</p></div>
  <div class="tab-card"><div class="tab-icon">🛏</div><div class="tab-title">שיבוץ לינה</div><p>ניהול חדרים ושיבוץ אורחים לפי מיקום לינה</p></div>
  <div class="tab-card"><div class="tab-icon">📞</div><div class="tab-title">בירורים</div><p>רשימת שיחות ובירורים שצריך לעשות עם ספקים</p></div>
  <div class="tab-card"><div class="tab-icon">🍽️</div><div class="tab-title">תפריט</div><p>תכנון מנות לכל ארוחה עם תיוגי תזונה</p></div>
  <div class="tab-card"><div class="tab-icon">🗓</div><div class="tab-title">לוח זמנים</div><p>לוח שבת — פרשה, קידוש, שעות ודוברים</p></div>
</div>

<!-- ── Section 2: First Entry ── -->
<div class="section-header">
  <div class="icon">🚀</div>
  <div class="text">
    <h2>2. כניסה ראשונה — יצירת האירוע</h2>
    <p>הגדרה ראשונית בפעם הראשונה בלבד</p>
  </div>
</div>
<div class="steps">
  <div class="step">
    <div class="step-num">1</div>
    <div class="step-body">
      <strong>פתחו את קישור האתר בדפדפן</strong>
      <span>הדפדפן יציג מסך ברוכים הבאים עם שתי אפשרויות</span>
    </div>
  </div>
  <div class="step">
    <div class="step-num">2</div>
    <div class="step-body">
      <strong>לחצו "צור אירוע חדש"</strong>
      <span>רק מי שמגדיר ראשון לוחץ "צור". שאר בני המשפחה יכנסו אחר כך עם הקישור</span>
    </div>
  </div>
  <div class="step">
    <div class="step-num">3</div>
    <div class="step-body">
      <strong>מלאו את פרטי האירוע</strong>
      <span>שם הבן, תאריך האירוע (או פרשת השבוע), שמות האחראיים, תקציב (אופציונלי), והאם יש לינה</span>
    </div>
  </div>
  <div class="step">
    <div class="step-num">4</div>
    <div class="step-body">
      <strong>לחצו "צור את האירוע שלי"</strong>
      <span>המערכת תיצור קוד אירוע ייחודי ותעבור למסך שמירת הגישה</span>
    </div>
  </div>
  <div class="step">
    <div class="step-num">5</div>
    <div class="step-body">
      <strong>שמרו את קישור האירוע — זה חשוב מאוד!</strong>
      <span>לחצו "שלח לעצמי בוואטסאפ" או "שלח במייל" כדי לשמור את הקישור. בלי הקישור לא תוכלו להיכנס ממכשיר אחר</span>
    </div>
  </div>
</div>

<div class="warn">
  <div class="tip-icon">⚠️</div>
  <p><strong>חשוב מאוד:</strong> המערכת לא עובדת עם שם משתמש וסיסמה. הקישור האישי הוא הדרך היחידה לגשת לאירוע ממכשיר חדש. שלחו אותו לעצמכם עכשיו!</p>
</div>
<div class="tip">
  <div class="tip-icon">💡</div>
  <p>ניתן לערוך את כל הפרטים בהמשך בלשונית <strong>הגדרות</strong>. אין צורך להזין הכל בצורה מושלמת בהתחלה.</p>
</div>

<div class="page-break"></div>

<!-- ── Section 3: Navigation ── -->
<div class="section-header">
  <div class="icon">🗂️</div>
  <div class="text">
    <h2>3. ניווט במערכת</h2>
    <p>מעבר בין הלשוניות השונות</p>
  </div>
</div>
<div class="sub"><h3>במובייל</h3></div>
<p style="font-size:10pt; color:#475569; margin-bottom:3mm">
  בתחתית המסך יש סרגל ניווט עם 4 לשוניות עיקריות: <span class="hl">משימות</span>,
  <span class="hl">אורחים</span>, <span class="hl">תקציב</span>, <span class="hl">קניות</span>.
  לחצו על <span class="hl">⋯ עוד</span> כדי לראות את שאר הלשוניות (לינה, בירורים, תפריט, לוח זמנים, שתייה, הגדרות).
</p>
<div class="sub"><h3>במחשב</h3></div>
<p style="font-size:10pt; color:#475569; margin-bottom:3mm">
  בצד ימין יש סרגל ניווט קבוע עם כל הלשוניות. הסרגל גם מציג ספירת ימים לאירוע וסטטיסטיקות מהירות.
</p>
<div class="tip">
  <div class="tip-icon">💡</div>
  <p>בראש הדף (או בסרגל הצדדי) מופיעה נקודה ירוקה כאשר המערכת מחוברת לענן ומסונכרנת, ונקודה אפורה כאשר עובדים במצב מקומי בלבד.</p>
</div>

<!-- ── Section 4: Tasks ── -->
<div class="section-header">
  <div class="icon">✅</div>
  <div class="text">
    <h2>4. ניהול משימות</h2>
    <p>מעקב אחר כל הדברים שצריך לסדר לפני האירוע</p>
  </div>
</div>
<p style="font-size:10pt; color:#475569; margin-bottom:3mm">
  המערכת מגיעה עם רשימת משימות מוכנה מראש המותאמת לבר מצווה — הזמנת מקום, צלם, מוזיקה ועוד.
  כל משימה כוללת תאריך יעד ואחראי. המשימות מסודרות אוטומטית לפי דחיפות.
</p>
<div class="sub"><h3>הוספת משימה חדשה</h3></div>
<div class="steps">
  <div class="step">
    <div class="step-num">1</div>
    <div class="step-body"><strong>לחצו "+ הוסף" בראש המסך</strong><span>או מלאו את הטופס בצד שמאל (במחשב)</span></div>
  </div>
  <div class="step">
    <div class="step-num">2</div>
    <div class="step-body"><strong>הזינו כותרת, תאריך יעד ואחראי</strong><span>לדוגמה: "הזמנת צלם" · 15/03/2026 · אמא</span></div>
  </div>
  <div class="step">
    <div class="step-num">3</div>
    <div class="step-body"><strong>לחצו "הוסף משימה"</strong><span>המשימה תופיע ברשימה ותסונכרן אוטומטית לכל המכשירים</span></div>
  </div>
</div>
<div class="sub"><h3>עדכון סטטוס משימה</h3></div>
<p style="font-size:10pt; color:#475569; margin-bottom:3mm">
  לחצו על הסמל שמשמאל לכל משימה כדי לשנות סטטוס:
  <span class="hl">⬜ לביצוע</span> ←
  <span class="hl">🔄 בתהליך</span> ←
  <span class="hl">✅ הושלם</span>
</p>
<div class="tip">
  <div class="tip-icon">💡</div>
  <p>ניתן לסנן משימות לפי אחראי (אבא / אמא / וכו׳) באמצעות הכפתורים בראש הרשימה. שימושי כשכל אחד עוקב אחרי המשימות שלו.</p>
</div>

<!-- ── Section 5: Guests ── -->
<div class="section-header">
  <div class="icon">👥</div>
  <div class="text">
    <h2>5. ניהול אורחים ואישורי הגעה</h2>
    <p>מעקב אחר כל מי שמוזמן לאירוע</p>
  </div>
</div>
<div class="sub"><h3>הוספת אורח ידנית</h3></div>
<div class="steps">
  <div class="step">
    <div class="step-num">1</div>
    <div class="step-body"><strong>הזינו שם משפחה / שם האורח</strong></div>
  </div>
  <div class="step">
    <div class="step-num">2</div>
    <div class="step-body"><strong>מלאו: כמה מבוגרים, כמה ילדים, האם לנים</strong></div>
  </div>
  <div class="step">
    <div class="step-num">3</div>
    <div class="step-body"><strong>סמנו העדפות תזונה אם יש</strong><span>צמחוני, טבעוני, ללא גלוטן, מהדרין</span></div>
  </div>
  <div class="step">
    <div class="step-num">4</div>
    <div class="step-body"><strong>לחצו "הוסף אורח"</strong></div>
  </div>
</div>
<div class="sub"><h3>קישור אישור הגעה לאורחים</h3></div>
<p style="font-size:10pt; color:#475569; margin-bottom:3mm">
  ניתן לשלוח לאורחים קישור שמוביל לטופס אישור הגעה ידידותי.
  האורח ממלא את הטופס (שם, כמה מגיעים, ארוחות, תזונה, לינה) ואישורו מופיע מיד במערכת.
</p>
<div class="share-box">
  <div class="share-label">📲 לחצו בלשונית הגדרות על "שלח בוואטסאפ" תחת "לינק אישור הגעה לאורחים"</div>
</div>
<div class="tip">
  <div class="tip-icon">💡</div>
  <p>הסטטיסטיקות בראש לשונית האורחים מתעדכנות אוטומטית — מספר משפחות, סך אנשים, כמה לנים, וכמה לא מגיעים.</p>
</div>

<div class="page-break"></div>

<!-- ── Section 6: Budget ── -->
<div class="section-header">
  <div class="icon">💰</div>
  <div class="text">
    <h2>6. ניהול תקציב</h2>
    <p>מעקב אחר הוצאות ותשלומים</p>
  </div>
</div>
<div class="sub"><h3>הגדרת תקציב</h3></div>
<p style="font-size:10pt; color:#475569; margin-bottom:3mm">
  בשדה "תקציב מתוכנן" הזינו את הסכום הכולל שברשותכם (לדוגמה: 50,000₪).
  המערכת תציג את האחוז שנוצל ואת הסכום שנותר.
  אם לא מוזן תקציב — עדיין ניתן לעקוב אחרי הוצאות.
</p>
<div class="sub"><h3>הוספת הוצאה</h3></div>
<div class="steps">
  <div class="step">
    <div class="step-num">1</div>
    <div class="step-body"><strong>הזינו שם ההוצאה</strong><span>לדוגמה: "מקום האירוע", "צלם", "מוזיקה"</span></div>
  </div>
  <div class="step">
    <div class="step-num">2</div>
    <div class="step-body"><strong>הזינו מחיר ליחידה וכמות</strong><span>לדוגמה: 50₪ × 100 כלים = 5,000₪ אוטומטית</span></div>
  </div>
  <div class="step">
    <div class="step-num">3</div>
    <div class="step-body"><strong>הזינו כמה שולם כבר (אופציונלי)</strong><span>עוזר לעקוב מה כבר שולם ומה נשאר</span></div>
  </div>
  <div class="step">
    <div class="step-num">4</div>
    <div class="step-body"><strong>בחרו אמצעי תשלום ותאריך</strong></div>
  </div>
</div>
<div class="tip">
  <div class="tip-icon">💡</div>
  <p>ניתן ללחוץ על כל הוצאה כדי לסמן אותה כ"שולמה במלואה" מבלי לערוך.</p>
</div>

<!-- ── Section 7: Shopping ── -->
<div class="section-header">
  <div class="icon">🛒</div>
  <div class="text">
    <h2>7. רשימת קניות</h2>
    <p>כל מה שצריך לקנות לפני האירוע</p>
  </div>
</div>
<div class="sub"><h3>הוספת פריט</h3></div>
<div class="steps">
  <div class="step">
    <div class="step-num">1</div>
    <div class="step-body"><strong>הזינו שם המוצר</strong><span>לדוגמה: "כוסות פלסטיק", "יין", "כיבוד"</span></div>
  </div>
  <div class="step">
    <div class="step-num">2</div>
    <div class="step-body"><strong>בחרו קטגוריה</strong><span>כלים חד פעמיים, שתייה, בית הכנסת, קינוחים, אירוח, כללי</span></div>
  </div>
  <div class="step">
    <div class="step-num">3</div>
    <div class="step-body"><strong>סמנו "טרי" אם זה מוצר טרי שקונים קרוב לאירוע</strong></div>
  </div>
</div>
<div class="sub"><h3>סימון כנרכש</h3></div>
<p style="font-size:10pt; color:#475569; margin-bottom:3mm">
  לחצו על תיבת הסימון מימין לכל פריט כדי לסמן שנרכש.
  ניתן גם לסמן כמה פריטים יחד: לחצו <span class="hl">☑ בחר</span>, בחרו פריטים, ולחצו <span class="hl">סמן כנרכשו</span>.
</p>
<div class="tip">
  <div class="tip-icon">💡</div>
  <p>לחצו <strong>"ייצוא רשימת קניות"</strong> כדי לקבל רשימה מסודרת שאפשר לשתף בוואטסאפ עם מי שהולך לקנות.</p>
</div>

<div class="page-break"></div>

<!-- ── Section 8: Rooms ── -->
<div class="section-header">
  <div class="icon">🛏</div>
  <div class="text">
    <h2>8. שיבוץ לינה</h2>
    <p>ניהול חדרים ושיבוץ אורחים</p>
  </div>
</div>
<div class="steps">
  <div class="step">
    <div class="step-num">1</div>
    <div class="step-body"><strong>הוסיפו מיקום לינה</strong><span>שם החדר, קיבולת (כמה אנשים יכולים לישון), סוג (וילה / מלון / חברים)</span></div>
  </div>
  <div class="step">
    <div class="step-num">2</div>
    <div class="step-body"><strong>הוסיפו אורחים לכל חדר</strong><span>הקלידו שם ולחצו + כדי לשבץ אורח לחדר</span></div>
  </div>
  <div class="step">
    <div class="step-num">3</div>
    <div class="step-body"><strong>לחצו "העתק סיכום"</strong><span>לקבלת סיכום שיבוץ הלינה מוכן לשיתוף</span></div>
  </div>
</div>
<div class="tip">
  <div class="tip-icon">💡</div>
  <p>חדר שהגיע לקיבולתו מסומן בצבע שונה כדי שקל לראות מה פנוי ומה תפוס.</p>
</div>

<!-- ── Section 9: Calls & Logistics ── -->
<div class="section-header">
  <div class="icon">📞</div>
  <div class="text">
    <h2>9. בירורים ולוגיסטיקה</h2>
    <p>מעקב אחרי שיחות לביצוע וציוד לאריזה</p>
  </div>
</div>
<div class="sub"><h3>לשונית בירורים</h3></div>
<p style="font-size:10pt; color:#475569; margin-bottom:3mm">
  רשימת בירורים שצריך לעשות — לדוגמה "לברר עם הקייטרינג לגבי תפריט צמחוני",
  "לתאם עם חזן לגבי שעת התפילה". ניתן להוסיף מספר טלפון לכל בירור ולסמן כ"הושלם".
</p>
<div class="sub"><h3>לשונית לוגיסטיקה</h3></div>
<p style="font-size:10pt; color:#475569; margin-bottom:3mm">
  ניהול תיקים וערכות שצריך להכין לאירוע.
  לדוגמה: "תיק לבית הכנסת" עם רשימת פריטים פנימה — סידור תפילה, טלית, ממתקים וכו׳.
  ניתן לסמן כל פריט כ"ארוז" ולעקוב אחרי ההכנה.
</p>

<!-- ── Section 10: Sharing ── -->
<div class="section-header">
  <div class="icon">👨‍👩‍👧</div>
  <div class="text">
    <h2>10. שיתוף עם בני משפחה</h2>
    <p>כולם עובדים על אותו אירוע בזמן אמת</p>
  </div>
</div>
<p style="font-size:10pt; color:#475569; margin-bottom:3mm">
  ניתן לשתף את האירוע עם כל מי שמנהל אותו יחד אתכם — אבא, אמא, סבא, וכו׳.
  כל מי שנכנס עם הקישור המיוחד רואה את כל הנתונים ויכול לעדכן אותם.
  שינוי שאחד עושה מופיע אצל האחר תוך שניות.
</p>
<div class="sub"><h3>איך מוצאים את הקישור?</h3></div>
<div class="steps">
  <div class="step">
    <div class="step-num">1</div>
    <div class="step-body"><strong>כנסו ללשונית "הגדרות" (⚙️)</strong></div>
  </div>
  <div class="step">
    <div class="step-num">2</div>
    <div class="step-body"><strong>תחת "שיתוף עם מארגנים" תמצאו את הקישור</strong></div>
  </div>
  <div class="step">
    <div class="step-num">3</div>
    <div class="step-body"><strong>לחצו "שלח בוואטסאפ" או "העתק" ושלחו לבן/בת הזוג</strong></div>
  </div>
</div>
<div class="warn">
  <div class="tip-icon">⚠️</div>
  <p><strong>לא לשלוח לאורחים!</strong> קישור זה נותן גישה מלאה לכל המערכת. לאורחים יש קישור נפרד לאישור הגעה בלבד (ראו פרק 11).</p>
</div>

<div class="sub"><h3>מה קורה כשבן משפחה נכנס לראשונה?</h3></div>
<div class="steps">
  <div class="step">
    <div class="step-num">1</div>
    <div class="step-body"><strong>בן המשפחה לוחץ על הקישור שקיבל</strong></div>
  </div>
  <div class="step">
    <div class="step-num">2</div>
    <div class="step-body"><strong>הדפדפן פותח את המערכת ומכניס אוטומטית לאירוע</strong></div>
  </div>
  <div class="step">
    <div class="step-num">3</div>
    <div class="step-body"><strong>מהפעם השנייה — הדפדפן זוכר ונכנס ישירות</strong><span>אין צורך לחזור על התהליך</span></div>
  </div>
</div>

<div class="page-break"></div>

<!-- ── Section 11: RSVP ── -->
<div class="section-header">
  <div class="icon">📨</div>
  <div class="text">
    <h2>11. אישור הגעה לאורחים</h2>
    <p>טופס ידידותי שהאורח ממלא בעצמו</p>
  </div>
</div>
<p style="font-size:10pt; color:#475569; margin-bottom:3mm">
  לאורחים יש קישור נפרד שמוביל לטופס אישור הגעה פשוט — 3 שלבים קצרים.
  <strong>האורח לא רואה את מערכת הניהול</strong>, רק את הטופס.
</p>
<div class="sub"><h3>מה ממלא האורח</h3></div>
<div class="steps">
  <div class="step">
    <div class="step-num">1</div>
    <div class="step-body"><strong>שלב 1 — שם</strong><span>שם מלא של ראש המשפחה / האורח</span></div>
  </div>
  <div class="step">
    <div class="step-num">2</div>
    <div class="step-body"><strong>שלב 2 — פרטים</strong><span>כמה מבוגרים וילדים, לאיזו ארוחה, האם לנים, העדפות תזונה</span></div>
  </div>
  <div class="step">
    <div class="step-num">3</div>
    <div class="step-body"><strong>שלב 3 — אישור</strong><span>סיכום ולחיצה על "אישור הגעה ✓"</span></div>
  </div>
</div>
<div class="sub"><h3>איך שולחים לאורחים</h3></div>
<div class="steps">
  <div class="step">
    <div class="step-num">1</div>
    <div class="step-body"><strong>כנסו להגדרות → "לינק אישור הגעה לאורחים"</strong></div>
  </div>
  <div class="step">
    <div class="step-num">2</div>
    <div class="step-body"><strong>לחצו "שלח בוואטסאפ" — תיפתח הודעה מוכנה עם הלינק</strong><span>ערכו את הטקסט לפי הצורך ושלחו</span></div>
  </div>
  <div class="step">
    <div class="step-num">3</div>
    <div class="step-body"><strong>אורח שמאשר יופיע מיד ברשימת האורחים שלכם</strong></div>
  </div>
</div>
<div class="tip">
  <div class="tip-icon">💡</div>
  <p>בלשונית <strong>אורחים</strong> ניתן גם ללחוץ על כל אורח כדי לשלוח לו הזמנה אישית בוואטסאפ עם קישור לאישור הגעה.</p>
</div>

<!-- ── Section 12: Backup ── -->
<div class="section-header">
  <div class="icon">💾</div>
  <div class="text">
    <h2>12. גיבוי נתונים</h2>
    <p>שמירת עותק של כל המידע</p>
  </div>
</div>
<p style="font-size:10pt; color:#475569; margin-bottom:3mm">
  המערכת שומרת נתונים בענן (Firebase) ובמכשיר. מומלץ לגבות מדי פעם:
</p>
<div class="steps">
  <div class="step">
    <div class="step-num">1</div>
    <div class="step-body"><strong>כנסו ללשונית הגדרות → "גיבוי ושחזור"</strong></div>
  </div>
  <div class="step">
    <div class="step-num">2</div>
    <div class="step-body"><strong>לחצו "ייצוא — הורד JSON"</strong><span>יורד קובץ עם כל הנתונים שניתן לשמור</span></div>
  </div>
  <div class="step">
    <div class="step-num">3</div>
    <div class="step-body"><strong>לשחזור — לחצו "ייבוא" ובחרו את הקובץ שהורדתם</strong></div>
  </div>
</div>
<div class="tip">
  <div class="tip-icon">💡</div>
  <p>מומלץ לגבות פעם בשבוע ולשמור את הקובץ ב-Google Drive או בוואטסאפ לעצמכם.</p>
</div>

<div class="page-break"></div>

<!-- ── Section 13: FAQ ── -->
<div class="section-header">
  <div class="icon">❓</div>
  <div class="text">
    <h2>13. שאלות נפוצות</h2>
    <p>תשובות לשאלות הנפוצות ביותר</p>
  </div>
</div>

<div class="faq-item">
  <div class="faq-q">שכחתי את הקישור לאירוע — מה עושים?</div>
  <div class="faq-a">אם אתם עדיין מחוברים במכשיר אחד — כנסו להגדרות ומשם תוכלו להעתיק את הקישור. אם איבדתם גישה מכל המכשירים — אין דרך לשחזר, תצטרכו ליצור אירוע חדש.</div>
</div>
<div class="faq-item">
  <div class="faq-q">האם המידע שמור גם כשאני ללא אינטרנט?</div>
  <div class="faq-a">כן. המערכת שומרת את הנתונים גם במכשיר. כשהאינטרנט חוזר, הכל מסתנכרן אוטומטית. הנקודה הירוקה = מחובר; הנקודה האפורה = מקומי בלבד.</div>
</div>
<div class="faq-item">
  <div class="faq-q">כמה אנשים יכולים להשתמש במערכת בו זמנית?</div>
  <div class="faq-a">ללא הגבלה. כל מי שיש לו את הקישור יכול להיכנס ולעבוד. שינויים מופיעים אצל כולם תוך שניות.</div>
</div>
<div class="faq-item">
  <div class="faq-q">האורח שלח אישור הגעה אבל לא מופיע ברשימה — מה קורה?</div>
  <div class="faq-a">בדקו שאתם מחוברים לאינטרנט ושהנקודה ירוקה. רעננו את הדף (F5 או משוך למטה במובייל). אם עדיין לא מופיע, הוסיפו אותו ידנית מלשונית אורחים.</div>
</div>
<div class="faq-item">
  <div class="faq-q">האם ניתן לשנות את שם הבן או תאריך האירוע לאחר היצירה?</div>
  <div class="faq-a">כן! כנסו ללשונית הגדרות → "עריכת פרטים" וערכו כל מה שתרצו. השינויים יסונכרנו לכל המכשירים.</div>
</div>
<div class="faq-item">
  <div class="faq-q">איך מוחקים אורח שהוסף בטעות?</div>
  <div class="faq-a">לחצו על אייקון המחיקה (🗑) שמופיע בכרטיס האורח ברשימה.</div>
</div>
<div class="faq-item">
  <div class="faq-q">האתר נטען לאט בפעם הראשונה — למה?</div>
  <div class="faq-a">בפעם הראשונה הדפדפן טוען את כל קבצי המערכת. מהפעם השנייה זה מהיר הרבה יותר כי הקבצים שמורים מקומית.</div>
</div>
<div class="faq-item">
  <div class="faq-q">האם המערכת עובדת בנייד?</div>
  <div class="faq-a">כן, המערכת מותאמת לשימוש בנייד ובמחשב. ניתן גם להוסיף אותה למסך הבית של הנייד (לחצו "הוסף למסך הבית" בדפדפן ← שיתוף).</div>
</div>
<div class="faq-item">
  <div class="faq-q">מה קורה לנתונים לאחר האירוע?</div>
  <div class="faq-a">הנתונים נשמרים כל עוד לא מחקתם את האירוע. ניתן לגבות JSON לזכרון ולאחר מכן למחוק מהמערכת דרך הגדרות → "מחיקת האירוע".</div>
</div>

<div style="margin-top:12mm; padding:6mm; background:linear-gradient(135deg,#ede9fe,#ddd6fe); border-radius:12px; text-align:center;">
  <div style="font-size:22pt; margin-bottom:3mm">✡️</div>
  <div style="font-size:13pt; font-weight:800; color:#4f46e5; margin-bottom:2mm">בהצלחה עם ההכנות!</div>
  <div style="font-size:9.5pt; color:#6d28d9; line-height:1.8">
    אנו מאחלים לכם אירוע מרגש ומוצלח.<br>
    לשאלות נוספות — פנו דרך כפתור "משוב" במערכת.
  </div>
</div>

</div><!-- end content -->
</body>
</html>"""

# Write HTML to temp file
html_path = '/tmp/guide.html'
with open(html_path, 'w', encoding='utf-8') as f:
    f.write(HTML)

# Convert to PDF
print("יוצר PDF...")
import subprocess, sys

try:
    import weasyprint
    output_path = '/home/user/bar-mitzvah-dashboard/מדריך-בר-מצווה.pdf'
    weasyprint.HTML(filename=html_path).write_pdf(output_path)
    size_kb = os.path.getsize(output_path) // 1024
    print(f"✅ PDF נוצר בהצלחה: {output_path} ({size_kb} KB)")
except Exception as e:
    print(f"❌ שגיאה: {e}", file=sys.stderr)
    sys.exit(1)
