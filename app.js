'use strict';
/* Winterkern app – logica. Gegevens staan in data.js. Alles wordt lokaal op de telefoon bewaard. */

const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const DAYS = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];
const DAYSF = ['maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag', 'zondag'];
const TESTWEEKS = [1, 4, 8, 12];
const GYMDAY = 1; // dinsdag

/* ---------- opslag ---------- */
const store = {
  get(k, d) { try { const v = localStorage.getItem('wk:' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('wk:' + k, JSON.stringify(v)); } catch (e) { } }
};
const KEYS = ['start', 'dayA', 'dayB', 'done', 'tests', 'hideInstall'];
const st = {
  start: store.get('start', null), dayA: store.get('dayA', 3), dayB: store.get('dayB', 0),
  done: store.get('done', {}), tests: store.get('tests', {}), hideInstall: store.get('hideInstall', false)
};
const persist = () => KEYS.forEach(k => store.set(k, st[k]));
try { navigator.storage && navigator.storage.persist && navigator.storage.persist(); } catch (e) { }

/* ---------- datums (dagnummers in UTC, geen zomertijdproblemen) ---------- */
const dnum = (y, m, d) => Math.floor(Date.UTC(y, m, d) / 864e5);
const todayNum = () => { const t = new Date(); return dnum(t.getFullYear(), t.getMonth(), t.getDate()); };
const parseD = s => { const [y, m, d] = s.split('-').map(Number); return dnum(y, m - 1, d); };
const dOf = n => new Date(n * 864e5);
const p2 = x => String(x).padStart(2, '0');
const fmt = n => { const d = dOf(n); return `${p2(d.getUTCDate())}-${p2(d.getUTCMonth() + 1)}`; };
const fmtY = n => `${fmt(n)}-${dOf(n).getUTCFullYear()}`;
const iso = n => dOf(n).toISOString().slice(0, 10);
const dow = n => (dOf(n).getUTCDay() + 6) % 7;
const mondayOf = n => n - dow(n);
const curWeek = () => st.start ? Math.floor((todayNum() - parseD(st.start)) / 7) + 1 : null;
const clampW = w => Math.min(12, Math.max(1, w || 1));

/* ---------- programma-helpers ---------- */
function row(w) {
  const [wk, b, B, A, acc, dl] = GRID[w - 1];
  return { w: wk, b, B, A: A.split(' ')[0], test: A.includes('test'), acc, dl };
}
const blockOf = k => BLOCKS.find(b => b.k === k);
const bc = k => `var(--${k})`;
function weekItems(w) {
  const r = row(w);
  return [
    { day: st.dayB, key: 'B', code: r.B },
    { day: GYMDAY, key: 'G', code: null },
    { day: st.dayA, key: 'A', code: r.A }
  ].sort((a, b) => a.day - b.day);
}
const isDone = (w, k) => !!st.done[`${w}-${k}`];
function doneCount() { let n = 0; for (let w = 1; w <= 12; w++) for (const k of 'BGA') if (isDone(w, k)) n++; return n; }

function timerCfg(id, w) {
  if (id === 'A6') {
    if (w === 11) return { work: 45, rest: 15, rounds: 3, roundRest: 60 };
    if (w === 12) return { work: 30, rest: 30, rounds: 2, roundRest: 60 };
    return { work: 40, rest: 20, rounds: 3, roundRest: 60 };
  }
  if (id === 'B6') return { work: 45, rest: 15, rounds: 2, roundRest: 15 };
  return null;
}

function intervalsText(s, w) {
  const L = [], bl = blockOf(s.b);
  L.push(`THUIS ${s.id} – ${s.t} | ${bl.t}${w ? ` | week ${w}` : ''} | ±${s.min} min | RPE-doel ${s.rpe}`);
  const line = ([c, d, x]) => ` ${c} ${LIBMAP[c]?.n || c}  ${d}${x ? ` (${x})` : ''}`;
  L.push(`${s.wuLab || 'Opwarming · 5 min'}:`); s.wu.forEach(i => L.push(line(i)));
  const tc = timerCfg(s.id, w);
  L.push(`${tc ? `Timer ${tc.work}/${tc.rest} · ${tc.rounds} rondes` : s.main.lab} – ${s.main.rest}:`);
  s.main.items.forEach((i, n) => L.push(` ${n + 1}.${line(i)}`));
  L.push(`${s.cdLab || 'Afkoelen · 3 min'}:`); s.cd.forEach(i => L.push(line(i)));
  if (w) { const r = row(w); if (r.acc) L.push(`Deze week: ${r.acc}`); }
  if (s.note) L.push(`Let op: ${s.note}`);
  L.push('Uitleg en video per code: Winterkern-app → Oefeningen.');
  L.push('Na de sessie: RPE (0–10) + commentaar invullen.');
  return L.join('\n');
}

/* ---------- iconen ---------- */
const IC = {
  left: '<svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6"/></svg>',
  right: '<svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6"/></svg>',
  gear: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>',
  check: '<svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg>'
};

/* ---------- views ---------- */
let viewWeek = clampW(curWeek());
let ctxWeek = viewWeek;
let testWeek = TESTWEEKS.filter(t => t <= clampW(curWeek())).pop() || 1;
let libGroup = 'Alles', libQuery = '';
let deferredInstall = null;
let resetArmed = false;

const isStandalone = () => (window.matchMedia && matchMedia('(display-mode: standalone)').matches) || navigator.standalone === true;
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

function installCard() {
  if (isStandalone() || st.hideInstall) return '';
  const how = isIOS()
    ? 'Open deze pagina in <b>Safari</b>, tik op <b>Deel</b> (vierkant met pijl) en kies <b>Zet op beginscherm</b>.'
    : 'Open het menu van <b>Chrome</b> (⋮) en kies <b>App installeren</b> of <b>Toevoegen aan startscherm</b>.';
  return `<div class="card">
    <h3>Installeer Winterkern</h3>
    <p class="small">${how} Daarna werkt de app ook zonder internet.</p>
    <p class="small muted">Installeer eerst en vul pas daarna je gegevens in: op iPhone bewaart de geïnstalleerde app zijn eigen gegevens, los van Safari.</p>
    <div class="row">${deferredInstall ? '<button class="btn" data-act="install">Installeer nu</button>' : ''}<button class="btn ghost" data-act="hideinstall">Verbergen</button></div>
  </div>`;
}

function progressBar() {
  const n = doneCount(), parts = ['b1', 'b2', 'b3'].map((b, i) => {
    let c = 0; for (let w = i * 4 + 1; w <= i * 4 + 4; w++) for (const k of 'BGA') if (isDone(w, k)) c++;
    return `<i style="width:${(c / 36) * 100}%;background:${bc(b)}"></i>`;
  }).join('');
  return `<div class="prog"><div class="lbl"><span><b>${n}</b> / 36 sessies afgevinkt</span><span>${Math.round(n / 36 * 100)} %</span></div><div class="bar" role="img" aria-label="${n} van 36 sessies">${parts}</div></div>`;
}

function vWelcome() {
  const t = todayNum(), next = dow(t) === 0 ? t : mondayOf(t) + 7;
  return `<div class="topbar"><span class="eyebrow">Winterprogramma · 12 weken</span><button class="iconbtn" data-href="#instellingen" aria-label="Instellingen">${IC.gear}</button></div>
  <h1>Winterkern</h1>
  <p>Drie krachtmomenten per week naast je fietstraining: de gym op dinsdag en twee thuissessies van ±30 minuten. Kies de maandag waarop je start.</p>
  ${installCard()}
  <div class="card">
    <label class="f">Startdatum (maandag van week 1)<input type="date" id="startdate" value="${iso(next)}"></label>
    <button class="btn wide" data-act="savestart">Start mijn programma</button>
    <p class="small muted">Kies je een andere dag, dan gebruikt de app de maandag van die week.</p>
  </div>`;
}

function vWeek() {
  if (!st.start) return vWelcome();
  const cw = curWeek(), w = viewWeek, r = row(w), bl = blockOf(r.b);
  const s0 = parseD(st.start) + (w - 1) * 7, today = todayNum();
  let status = '';
  if (cw < 1) status = `<div class="card"><p>Je programma start op <b>${DAYSF[0]} ${fmtY(parseD(st.start))}</b>. Hieronder zie je al week 1.</p></div>`;
  else if (cw > 12 && w === 12) status = `<div class="card"><h3>Programma afgerond</h3><p class="small">Proficiat! Bekijk je vooruitgang onder <a href="#test">Test</a>. Vanaf nu: 1–2 korte sessies per week om het niveau te houden.</p></div>`;
  const rows = weekItems(w).map(it => {
    const dn = s0 + it.day, isToday = dn === today, done = isDone(w, it.key);
    let info;
    if (it.key === 'G') info = `<div class="info"><span class="k">GYM</span><b>Groepssessie gym</b><span class="s">Kracht benen en rug${r.dl ? ' · deloadweek: lichter gewicht of één set minder' : ' · na je intervallen'}</span></div>`;
    else {
      const s = SMAP[it.code];
      info = `<button class="info" style="--bc:${bc(r.b)}" data-href="#s-${s.id}" data-w="${w}"><span class="k">THUIS ${s.id}${it.key === 'A' && r.test ? ' + TEST' : ''}</span><b>${esc(s.t)}</b><span class="s">±${s.min} min · RPE ${s.rpe}${timerCfg(s.id, w) ? ' · met timer' : ''}</span></button>`;
    }
    return `<div class="dayrow${isToday ? ' today' : ''}"><div class="dd"><span>${DAYS[it.day]}<small>${fmt(dn)}</small></span></div>${info}
      <button class="check" data-act="tick" data-k="${w}-${it.key}" aria-pressed="${done}" aria-label="Afvinken"><i>${IC.check}</i></button></div>`;
  }).join('');
  return `<div class="topbar"><span class="eyebrow">${cw >= 1 && cw <= 12 && w === cw ? 'Deze week' : 'Week bekijken'}</span><button class="iconbtn" data-href="#instellingen" aria-label="Instellingen">${IC.gear}</button></div>
  <div class="weekhead">
    <button class="iconbtn" data-act="wprev" aria-label="Vorige week" ${w <= 1 ? 'disabled' : ''}>${IC.left}</button>
    <div><div class="big">Week ${w} <small>/ 12</small></div>
      <div class="sub"><span class="pill ${r.dl ? 'dl' : r.b}">${r.dl ? (w === 12 ? 'Raceklaar' : 'Deload') : esc(bl.t.split('· ')[1])}</span><span class="small muted">${fmt(s0)} – ${fmt(s0 + 6)}</span></div></div>
    <button class="iconbtn" data-act="wnext" aria-label="Volgende week" ${w >= 12 ? 'disabled' : ''}>${IC.right}</button>
  </div>
  ${status}
  ${r.acc ? `<div class="accent-note" style="--bc:${bc(r.b)}"><b>Deze week:</b> ${esc(r.acc)}</div>` : ''}
  ${r.test ? `<div class="card"><p><b>Testweek.</b> Doe de test aan het begin van Thuis ${r.A}, na de opwarming. <a href="#test" data-act="gotest" data-w="${w}">Naar de test</a></p></div>` : ''}
  <div class="dayrows">${rows}</div>
  ${progressBar()}
  ${installCard()}
  <div class="card"><h3>Spelregels</h3><p class="small">Thuis A minstens 48 u na de gym en niet de dag vóór een zware rit. Moe? Schrap A, houd B. Pijn boven 3/10: stop die oefening en meld het aan je coach. Na elke sessie RPE en commentaar invullen in Intervals.icu.</p></div>`;
}

function vSchema() {
  const cw = curWeek();
  const rows = GRID.map((_, i) => {
    const w = i + 1, r = row(w);
    const dots = ['B', 'G', 'A'].map(k => `<button class="dot" data-act="tick" data-k="${w}-${k}" aria-pressed="${isDone(w, k)}" aria-label="Week ${w} ${k === 'G' ? 'gym' : 'thuis ' + k} afvinken">${k === 'G' ? 'Gym' : k}</button>`).join('');
    return `<div class="srow${w === cw ? ' cur' : ''}${r.dl ? ' dl' : ''}" style="--bc:${bc(r.b)}">
      <div class="w">${w}</div>
      <div class="mid"><div class="codes"><button class="code" data-href="#s-${r.B}" data-w="${w}">${r.B}</button><button class="code" data-href="#s-${r.A}" data-w="${w}">${r.A}${r.test ? ' + test' : ''}</button></div>
      ${r.acc ? `<span class="small muted">${esc(r.acc)}</span>` : ''}</div>
      <div class="dots">${dots}</div></div>`;
  }).join('');
  return `<div class="topbar"><h1>12 weken</h1></div>
  <div class="chips">${BLOCKS.map(b => `<span class="pill ${b.k}">${esc(b.t.split('· ')[1])} · ${b.wk.replace('Week ', 'wk ')}</span>`).join('')}</div>
  ${progressBar()}
  <div class="sched">${rows}</div>
  <p class="small muted">Tik op een code om de sessie te openen, of op B / Gym / A om af te vinken. Grijze weken zijn deloadweken.</p>`;
}

function exLi([code, dose, extra]) {
  const e = LIBMAP[code];
  return `<li><button data-ex="${code}"><span class="c">${code}</span><span class="n">${esc(e ? e.n : code)}</span><span class="dose">${esc(dose)}</span><span class="chev">›</span>${extra ? `<span class="x">${esc(extra)}</span>` : ''}</button></li>`;
}

function vSession(id) {
  const s = SMAP[id]; if (!s) return vWeek();
  const w = ctxWeek, r = row(w), tc = timerCfg(id, w), done = isDone(w, s.type);
  const usedThisWeek = r.A === id || r.B === id;
  const mainLab = tc ? `Timer ${tc.work}/${tc.rest} · ${tc.rounds} rondes` : s.main.lab;
  const mainRest = tc ? `${tc.work} s werk, ${tc.rest} s wissel${tc.roundRest > tc.rest ? `, ${tc.roundRest} s tussen rondes` : ''}` : s.main.rest;
  const restSec = /45 s/.test(s.main.rest) ? 45 : 30;
  return `<div class="topbar"><button class="iconbtn" data-act="back" aria-label="Terug">${IC.left}</button><span class="eyebrow">Week ${w}${usedThisWeek ? '' : ' (andere week)'}</span><span style="width:44px"></span></div>
  <div class="sess-head" style="--bc:${bc(s.b)}">
    <span class="id">THUIS ${s.id} · ${s.type === 'A' ? 'romp, heupen, bovenlijf' : 'herstel & stabiliteit'} · ${esc(blockOf(s.b).t)}</span>
    <h1 style="font-size:30px">${esc(s.t)}</h1>
    <span class="muted">±${s.min} min · RPE-doel <b style="color:var(--fg)">${s.rpe}</b></span>
  </div>
  ${r.acc && usedThisWeek ? `<div class="accent-note" style="--bc:${bc(s.b)}"><b>Week ${w}:</b> ${esc(r.acc)}</div>` : ''}
  ${r.test && r.A === id ? `<div class="card"><p class="small"><b>Testweek:</b> eerst de opwarming, dan de <a href="#test" data-act="gotest" data-w="${w}">test</a>, daarna deze sessie.</p></div>` : ''}
  <div class="card" style="--bc:${bc(s.b)}">
    <div class="part"><div class="ph"><span>${esc(s.wuLab || 'Opwarming · 5 min')}</span></div><ol class="ex">${s.wu.map(exLi).join('')}</ol></div>
    <div class="part"><div class="ph"><span>${esc(mainLab)}</span><span>${esc(mainRest)}</span></div><ol class="ex">${s.main.items.map(exLi).join('')}</ol>
      ${tc ? `<button class="btn wide" data-act="timer" data-id="${id}">Start timer</button>`
      : `<div class="row"><span class="small muted">Rusttimer:</span>${[30, 45, 60].map(x => `<button class="chip" data-act="rest" data-sec="${x}"${x === restSec ? ' aria-pressed="true"' : ''}>${x} s</button>`).join('')}</div>`}
    </div>
    <div class="part"><div class="ph"><span>${esc(s.cdLab || 'Afkoelen · 3 min')}</span></div><ol class="ex">${s.cd.map(exLi).join('')}</ol></div>
    ${s.note ? `<p class="small muted">${esc(s.note)}</p>` : ''}
  </div>
  ${usedThisWeek ? `<button class="btn wide ${done ? 'quiet' : ''}" data-act="tick" data-k="${w}-${s.type}" aria-pressed="${done}">${done ? '✓ Afgevinkt voor week ' + w : 'Afvinken voor week ' + w}</button>` : ''}
  <div class="card"><h3>Intervals.icu</h3><p class="small muted">Plak deze tekst in de beschrijving van de workout. Vul na de sessie RPE en commentaar in.</p>
    <div class="row"><button class="btn ghost" data-act="copy" data-id="${id}">Kopieer tekst</button><span class="msg" id="copymsg"></span></div>
    <pre class="itxt" id="copytxt">${esc(intervalsText(s, w))}</pre></div>`;
}

function exCard(e) {
  return `<div class="ex-card"><div class="h"><b>${esc(e.n)}</b><code>${e.c}</code></div>
    <div class="why">${esc(e.why)}</div>
    <ul>${e.cue.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
    <dl><dt>Fout</dt><dd>${esc(e.fout)}</dd><dt>↓ Makkelijker</dt><dd>${esc(e.mak)}</dd><dt>↑ Moeilijker</dt><dd>${esc(e.moe)}</dd></dl>
    <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(e.en)}" target="_blank" rel="noopener">Video: “${esc(e.en)}” ↗</a></div>`;
}

function libList() {
  const q = libQuery.trim().toLowerCase();
  const list = LIB.filter(e => (libGroup === 'Alles' || e.g === libGroup) && (!q || (e.c + ' ' + e.n + ' ' + e.en + ' ' + e.why).toLowerCase().includes(q)));
  return list.length ? list.map(e => `<div class="card">${exCard(e)}</div>`).join('') : '<p class="muted">Geen oefening gevonden.</p>';
}
function vLib() {
  const groups = ['Alles', ...new Set(LIB.map(e => e.g))];
  return `<div class="topbar"><h1>Oefeningen</h1></div>
  <input class="search" id="libq" type="search" placeholder="Zoek op naam of code, bv. plank of C04" value="${esc(libQuery)}" autocomplete="off">
  <div class="chips">${groups.map((g, i) => `<button class="chip" id="lg-${i}" data-act="libg" data-g="${esc(g)}" aria-pressed="${g === libGroup}">${esc(g)}</button>`).join('')}</div>
  <div class="lib" id="liblist">${libList()}</div>`;
}

/* ---------- test ---------- */
const TF = [
  { k: 'T1', n: 'Eenbenig staan, ogen dicht', unit: 's', lr: true, kind: 'int', max: 60, hi: true },
  { k: 'T2', n: 'Vingertoppen–vloer', unit: 'cm', lr: false, kind: 'cm', hi: true },
  { k: 'T3', n: 'Eenbenige bilbrug', unit: 'herh.', lr: true, kind: 'int', max: 30, hi: true },
  { k: 'T4', n: 'Plank op onderarmen', unit: 'tijd', lr: false, kind: 'time', max: 180, hi: true },
  { k: 'T5', n: 'Zijplank', unit: 'tijd', lr: true, kind: 'time', max: 120, hi: true }
];
const mmss = s => `${Math.floor(s / 60)}:${p2(Math.round(s % 60))}`;
const tget = (w, key) => { const v = st.tests[w]?.[key]; return (v === undefined || v === null || v === '') ? null : v; };
function fmtVal(f, v) { if (v == null) return '–'; if (f.kind === 'time') return mmss(v); if (f.kind === 'cm') return (v > 0 ? '+' : '') + v; return String(v); }

function tInputs(f, w, side) {
  const key = f.k + (side || '');
  const v = tget(w, key), sl = side ? `<span>${side === 'L' ? 'Links' : 'Rechts'}</span>` : '';
  if (f.kind === 'time') {
    const m = v == null ? '' : Math.floor(v / 60), s = v == null ? '' : Math.round(v % 60);
    return `<div class="tin">${sl}<input id="${key}-m-${w}" data-tk="${key}" data-part="m" inputmode="numeric" pattern="[0-9]*" value="${m}" aria-label="${f.n} ${side || ''} minuten" style="width:34px"><span>min</span><input id="${key}-s-${w}" data-tk="${key}" data-part="s" inputmode="numeric" pattern="[0-9]*" value="${s}" aria-label="${f.n} ${side || ''} seconden" style="width:40px"><span>s</span></div>`;
  }
  return `<div class="tin">${sl}<input id="${key}-${w}" data-tk="${key}" data-part="v" inputmode="${f.kind === 'cm' ? 'text' : 'numeric'}" value="${v == null ? '' : v}" aria-label="${f.n} ${side || ''}"><span>${f.unit}</span></div>`;
}

function testLine(w) {
  const t = st.tests[w] || {};
  const part = f => f.lr ? `${f.k} L${fmtVal(f, tget(w, f.k + 'L'))} R${fmtVal(f, tget(w, f.k + 'R'))}` : `${f.k} ${fmtVal(f, tget(w, f.k))}${f.kind === 'cm' ? ' cm' : ''}`;
  return `TEST wk ${w} | ${TF.map(part).join(' | ')}`;
}

function chart(f) {
  const series = f.lr ? [{ lab: 'Links', key: f.k + 'L', col: 'var(--accent)' }, { lab: 'Rechts', key: f.k + 'R', col: 'var(--right)' }] : [{ lab: '', key: f.k, col: 'var(--accent)' }];
  const vals = series.flatMap(s => TESTWEEKS.map(w => tget(w, s.key))).filter(v => v != null);
  if (!vals.length) return `<p class="small muted">Nog geen resultaten.</p>`;
  const W = 320, H = 150, L = 40, R = 14, T = 16, B = 26;
  let lo = Math.min(0, ...vals), hi = Math.max(0, ...vals);
  if (hi === lo) hi = lo + 1; const pad = (hi - lo) * 0.18; hi += pad; if (lo < 0) lo -= pad;
  const x = w => L + (w - 1) / 11 * (W - L - R), y = v => T + (1 - (v - lo) / (hi - lo)) * (H - T - B);
  const ticks = [lo, (lo + hi) / 2, hi].map(v => Math.round(v));
  let g = ticks.map(t => `<line x1="${L}" x2="${W - R}" y1="${y(t)}" y2="${y(t)}" stroke="var(--line)" stroke-width="1"/><text x="${L - 6}" y="${y(t) + 4}" text-anchor="end" font-size="11" fill="var(--muted)">${f.kind === 'time' ? mmss(t) : t}</text>`).join('');
  g += TESTWEEKS.map(w => `<text x="${x(w)}" y="${H - 6}" text-anchor="middle" font-size="11" fill="var(--muted)">wk ${w}</text>`).join('');
  series.forEach((s, si) => {
    const pts = TESTWEEKS.map(w => [w, tget(w, s.key)]).filter(p => p[1] != null);
    if (pts.length > 1) g += `<polyline fill="none" stroke="${s.col}" stroke-width="2.5" stroke-linejoin="round" points="${pts.map(p => `${x(p[0])},${y(p[1])}`).join(' ')}"/>`;
    pts.forEach(p => {
      const other = series.length > 1 ? tget(p[0], series[1 - si].key) : null;
      const above = other == null ? true : (p[1] > other || (p[1] === other && si === 0));
      g += `<circle cx="${x(p[0])}" cy="${y(p[1])}" r="4" fill="${s.col}"/><text x="${x(p[0])}" y="${y(p[1]) + (above ? -8 : 16)}" text-anchor="middle" font-size="11" font-weight="600" fill="${s.col}">${fmtVal(f, p[1])}</text>`;
    });
  });
  return `<div class="chart"><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Verloop ${esc(f.n)}">${g}</svg>
    ${f.lr ? `<div class="legend"><span><i style="background:var(--accent)"></i>Links</span><span><i style="background:var(--right)"></i>Rechts</span></div>` : ''}</div>`;
}

function vTest() {
  const w = testWeek;
  const fields = TF.map((f, i) => `<div class="tfield"><div class="lab"><b>${f.k} · ${esc(f.n)}</b><span class="small muted">${esc(TEST[i][3])}</span></div>
    <div class="ins">${f.lr ? tInputs(f, w, 'L') + tInputs(f, w, 'R') : tInputs(f, w, '')}</div></div>`).join('');
  return `<div class="topbar"><h1>Test</h1></div>
  <p class="small">Week 1, 4, 8 en 12. Uitgerust, na de opwarming van Thuis A. 2 minuten rust tussen de onderdelen. Je vergelijkt alleen met jezelf.</p>
  <div class="chips">${TESTWEEKS.map(t => `<button class="chip" data-act="tw" data-w="${t}" aria-pressed="${t === w}">Week ${t}</button>`).join('')}</div>
  <div class="card"><div class="tgrid" id="tform">${fields}</div><p class="small muted">Wordt automatisch bewaard.</p></div>
  <div class="card"><h3>Voor Intervals.icu</h3><pre class="itxt" id="tline">${esc(testLine(w))}</pre>
    <div class="row"><button class="btn ghost" data-act="copytest">Kopieer regel</button><span class="msg" id="tmsg"></span></div></div>
  <h2>Vooruitgang</h2>
  <div id="charts" style="display:grid;gap:12px">${TF.map(f => `<div class="card"><h3>${f.k} · ${esc(f.n)}</h3>${chart(f)}</div>`).join('')}</div>
  <details class="card"><summary>Hoe test ik?</summary><div class="tablebox"><table><thead><tr><th>#</th><th>Hoe</th><th>Stop wanneer</th></tr></thead><tbody>
  ${TEST.map(r => `<tr><td><code>${r[0]}</code> ${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`).join('')}</tbody></table></div></details>`;
}

function vSettings() {
  return `<div class="topbar"><button class="iconbtn" data-act="back" aria-label="Terug">${IC.left}</button><span class="eyebrow">Instellingen</span><span style="width:44px"></span></div>
  <h1>Instellingen</h1>
  <div class="card">
    <label class="f">Startdatum (maandag van week 1)<input type="date" id="set-start" value="${st.start || ''}"></label>
    <label class="f">Dag voor Thuis A (romp &amp; kracht)<select id="set-a">${DAYSF.map((d, i) => `<option value="${i}"${i === st.dayA ? ' selected' : ''}${i === GYMDAY ? ' disabled' : ''}>${d}</option>`).join('')}</select></label>
    <label class="f">Dag voor Thuis B (herstel)<select id="set-b">${DAYSF.map((d, i) => `<option value="${i}"${i === st.dayB ? ' selected' : ''}${i === GYMDAY ? ' disabled' : ''}>${d}</option>`).join('')}</select></label>
    <button class="btn" data-act="savesettings">Bewaar</button><span class="msg" id="setmsg"></span>
    <p class="small muted">De gym blijft op dinsdag. Thuis A liefst donderdag of woensdag: minstens 48 u na de gym.</p>
  </div>
  <div class="card">
    <h3>Back-up</h3>
    <p class="small muted">Je gegevens staan alleen op deze telefoon. Nieuwe telefoon? Kopieer de back-up, bewaar hem (bv. in een notitie of mail aan jezelf) en plak hem in de nieuwe app.</p>
    <div class="row"><button class="btn ghost" data-act="backup">Kopieer back-up</button><span class="msg" id="bmsg"></span></div>
    <textarea id="restore" placeholder="Plak hier een back-up om te herstellen"></textarea>
    <button class="btn quiet" data-act="restore">Herstel back-up</button>
  </div>
  <div class="card">
    <h3>Alles wissen</h3>
    <p class="small muted">Wist startdatum, afvinkingen en testresultaten op deze telefoon.</p>
    <button class="btn danger" data-act="reset">${resetArmed ? 'Tik nogmaals om alles te wissen' : 'Alles wissen'}</button>
  </div>
  <p class="small muted">Winterkern · versie 1.0</p>`;
}

/* ---------- router ---------- */
function route() {
  const h = (location.hash || '#week').slice(1);
  let html, tab = h;
  if (h.startsWith('s-')) { html = vSession(h.slice(2)); tab = ''; }
  else if (h === 'schema') html = vSchema();
  else if (h === 'oefeningen') html = vLib();
  else if (h === 'test') html = vTest();
  else if (h === 'instellingen') { html = vSettings(); tab = ''; }
  else { html = vWeek(); tab = 'week'; }
  $('#view').innerHTML = html;
  document.querySelectorAll('nav.tabs a').forEach(a => { if (a.dataset.tab === tab) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current'); });
}
function rerender() { const y = window.scrollY; route(); window.scrollTo(0, y); }
window.addEventListener('hashchange', () => { resetArmed = false; route(); window.scrollTo(0, 0); });

/* ---------- kopiëren ---------- */
async function copyText(text, msgEl, preEl) {
  try { await navigator.clipboard.writeText(text); if (msgEl) msgEl.textContent = 'Gekopieerd'; }
  catch (e) {
    if (preEl) { const r = document.createRange(); r.selectNodeContents(preEl); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
    if (msgEl) msgEl.textContent = 'Tekst geselecteerd: kopieer handmatig';
  }
  if (msgEl) setTimeout(() => { msgEl.textContent = ''; }, 3000);
}

/* ---------- sheet ---------- */
function openEx(code) {
  const e = LIBMAP[code]; if (!e) return;
  const d = $('#sheet');
  $('#sheetin').innerHTML = `<div class="grab"></div>${exCard(e)}<button class="btn quiet wide" data-act="closesheet">Sluiten</button>`;
  if (d.showModal) d.showModal(); else d.setAttribute('open', '');
}
$('#sheet').addEventListener('click', ev => { if (ev.target === ev.currentTarget) ev.currentTarget.close(); });

/* ---------- timer ---------- */
const T = { steps: [], i: 0, end: 0, paused: false, left: 0, iv: null, ctx: null, lock: null, lastBeep: null };
function beep(freq, dur) {
  try {
    const c = T.ctx; if (!c) return;
    const o = c.createOscillator(), g = c.createGain();
    o.frequency.value = freq; o.type = 'sine';
    g.gain.setValueAtTime(0.0001, c.currentTime); g.gain.exponentialRampToValueAtTime(0.5, c.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, c.currentTime + dur);
    o.connect(g); g.connect(c.destination); o.start(); o.stop(c.currentTime + dur + 0.05);
  } catch (e) { }
}
const buzz = p => { try { navigator.vibrate && navigator.vibrate(p); } catch (e) { } };
async function wake() { try { if ('wakeLock' in navigator) T.lock = await navigator.wakeLock.request('screen'); } catch (e) { } }
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible' && !$('#timer').hidden) wake(); });

function buildSteps(id, w) {
  const s = SMAP[id], c = timerCfg(id, w), items = s.main.items, steps = [];
  const lab = it => ({ code: it[0], name: LIBMAP[it[0]]?.n || it[0], extra: it[2] || '' });
  steps.push({ kind: 'prep', dur: 10, title: 'Klaar maken', next: lab(items[0]), round: 1 });
  for (let r = 1; r <= c.rounds; r++) {
    items.forEach((it, i) => {
      steps.push({ kind: 'work', dur: c.work, ex: lab(it), round: r });
      const last = i === items.length - 1;
      if (!last) steps.push({ kind: 'rest', dur: c.rest, title: 'Wissel', next: lab(items[i + 1]), round: r });
      else if (r < c.rounds) steps.push({ kind: 'rest', dur: c.roundRest, title: 'Rust tussen rondes', next: lab(items[0]), round: r + 1 });
    });
  }
  return { steps, rounds: c.rounds, title: `${id} · ${c.work}/${c.rest}` };
}

function startTimer(plan) {
  try { const AC = window.AudioContext || window.webkitAudioContext; if (AC) { T.ctx = T.ctx || new AC(); T.ctx.resume && T.ctx.resume(); } } catch (e) { }
  beep(1, 0.01);
  T.plan = plan; T.steps = plan.steps; T.i = 0; T.paused = false; T.end = Date.now() + T.steps[0].dur * 1000; T.lastBeep = null;
  $('#timer').hidden = false; document.body.style.overflow = 'hidden';
  wake(); clearInterval(T.iv); T.iv = setInterval(tick, 200); tick(true);
}
function stopTimer() {
  clearInterval(T.iv); $('#timer').hidden = true; document.body.style.overflow = '';
  try { T.lock && T.lock.release(); } catch (e) { } T.lock = null;
}
function enterStep(fresh) {
  const s = T.steps[T.i];
  if (!fresh) { if (s.kind === 'work') { beep(1320, 0.45); buzz([300]); } else { beep(660, 0.45); buzz([150, 80, 150]); } }
}
function tick(fresh) {
  if (T.paused) return renderTimer();
  let now = Date.now(), changed = false;
  while (now >= T.end) {
    T.i++; changed = true;
    if (T.i >= T.steps.length) { beep(1320, 0.8); buzz([400, 100, 400]); return finishTimer(); }
    T.end += T.steps[T.i].dur * 1000;
  }
  if (changed) enterStep(false);
  const left = Math.ceil((T.end - now) / 1000);
  if (left <= 3 && left >= 1 && T.lastBeep !== `${T.i}-${left}`) { T.lastBeep = `${T.i}-${left}`; beep(880, 0.12); }
  renderTimer(left);
}
function finishTimer() {
  T.done = true;
  const el = $('#timer'); el.className = '';
  el.innerHTML = `<div class="tt"><span>${esc(T.plan.title)}</span></div>
   <div class="mid"><div class="kind">Klaar</div><div class="exn">Goed gedaan</div><div class="exx">Nu de afkoeling, en vergeet niet af te vinken.</div></div>
   <div class="tbtns" style="grid-template-columns:1fr"><button class="main" data-act="tstop">Sluiten</button></div>`;
  clearInterval(T.iv);
}
function renderTimer(left) {
  const s = T.steps[T.i]; if (!s) return;
  if (left == null) left = Math.ceil(T.left / 1000);
  const total = T.steps.reduce((a, b) => a + b.dur, 0), before = T.steps.slice(0, T.i).reduce((a, b) => a + b.dur, 0);
  const pct = Math.min(100, ((before + (s.dur - left)) / total) * 100);
  const el = $('#timer'); el.className = s.kind === 'work' ? 'work' : '';
  const nextWork = s.kind === 'work' ? T.steps.slice(T.i + 1).find(x => x.kind === 'work') : null;
  el.innerHTML = `<div><div class="tbar"><i style="width:${pct}%"></i></div>
    <div class="tt"><span>Ronde ${s.round} / ${T.plan.rounds}</span><span>${esc(T.plan.title)}</span></div></div>
    <div class="mid">
      <div class="kind">${s.kind === 'work' ? 'Werk' : esc(s.title)}${T.paused ? ' · pauze' : ''}</div>
      <div class="sec" aria-live="off">${left}</div>
      ${s.kind === 'work' ? `<div class="exn">${esc(s.ex.name)}</div><div class="exx">${esc(s.ex.code)}${s.ex.extra ? ' · ' + esc(s.ex.extra) : ''}</div>${nextWork ? `<div class="nxt">Daarna: ${esc(nextWork.ex.name)}</div>` : ''}`
      : `<div class="exx">Volgende</div><div class="exn">${esc(s.next ? s.next.name : '')}</div>${s.next && s.next.extra ? `<div class="exx">${esc(s.next.extra)}</div>` : ''}`}
    </div>
    <div class="tbtns"><button data-act="tstop">Stop</button><button class="main" data-act="tpause">${T.paused ? 'Verder' : 'Pauze'}</button><button data-act="tskip">Volgende</button></div>`;
}

/* ---------- events ---------- */
document.addEventListener('click', ev => {
  const exb = ev.target.closest('[data-ex]'); if (exb) { openEx(exb.dataset.ex); return; }
  const el = ev.target.closest('[data-act],[data-href]'); if (!el) return;
  if (el.dataset.href) { if (el.dataset.w) ctxWeek = +el.dataset.w; else ctxWeek = viewWeek; location.hash = el.dataset.href; return; }
  const a = el.dataset.act;
  switch (a) {
    case 'tick': { const k = el.dataset.k; st.done[k] = !st.done[k]; if (!st.done[k]) delete st.done[k]; persist(); rerender(); break; }
    case 'wprev': viewWeek = clampW(viewWeek - 1); rerender(); break;
    case 'wnext': viewWeek = clampW(viewWeek + 1); rerender(); break;
    case 'savestart': { const v = $('#startdate').value; if (!v) return; st.start = iso(mondayOf(parseD(v))); persist(); viewWeek = clampW(curWeek()); testWeek = TESTWEEKS.filter(t => t <= viewWeek).pop() || 1; rerender(); break; }
    case 'back': if (history.length > 1) history.back(); else location.hash = '#week'; break;
    case 'gotest': ev.preventDefault(); testWeek = TESTWEEKS.includes(+el.dataset.w) ? +el.dataset.w : testWeek; location.hash = '#test'; break;
    case 'copy': copyText(intervalsText(SMAP[el.dataset.id], ctxWeek), $('#copymsg'), $('#copytxt')); break;
    case 'copytest': copyText(testLine(testWeek), $('#tmsg'), $('#tline')); break;
    case 'timer': startTimer(buildSteps(el.dataset.id, ctxWeek)); break;
    case 'rest': { const n = +el.dataset.sec; startTimer({ steps: [{ kind: 'rest', dur: n, title: 'Rust', next: null, round: 1 }], rounds: 1, title: `Rust ${n} s` }); break; }
    case 'tstop': stopTimer(); break;
    case 'tpause':
      if (T.paused) { T.paused = false; T.end = Date.now() + T.left; } else { T.paused = true; T.left = Math.max(0, T.end - Date.now()); }
      renderTimer(Math.ceil((T.paused ? T.left : T.end - Date.now()) / 1000)); break;
    case 'tskip': if (T.paused) { T.paused = false; } T.end = Date.now(); tick(); break;
    case 'libg': libGroup = el.dataset.g; rerender(); break;
    case 'tw': testWeek = +el.dataset.w; rerender(); break;
    case 'closesheet': $('#sheet').close(); break;
    case 'install': if (deferredInstall) { deferredInstall.prompt(); deferredInstall.userChoice.finally(() => { deferredInstall = null; rerender(); }); } break;
    case 'hideinstall': st.hideInstall = true; persist(); rerender(); break;
    case 'savesettings': {
      const v = $('#set-start').value; if (v) st.start = iso(mondayOf(parseD(v)));
      st.dayA = +$('#set-a').value; st.dayB = +$('#set-b').value; persist();
      viewWeek = clampW(curWeek()); $('#setmsg').textContent = st.dayA === st.dayB ? 'Bewaard. Let op: A en B vallen op dezelfde dag.' : 'Bewaard';
      $('#set-start').value = st.start || ''; break;
    }
    case 'backup': {
      const data = JSON.stringify({ app: 'winterkern', v: 1, ...Object.fromEntries(KEYS.map(k => [k, st[k]])) });
      copyText(data, $('#bmsg'), null); $('#restore').value = data; break;
    }
    case 'restore': {
      try {
        const o = JSON.parse($('#restore').value);
        if (o.app !== 'winterkern') throw new Error();
        KEYS.forEach(k => { if (k in o) st[k] = o[k]; }); persist(); viewWeek = clampW(curWeek());
        location.hash = '#week';
      } catch (e) { $('#restore').value = ''; $('#restore').placeholder = 'Dit is geen geldige Winterkern-back-up. Plak de volledige tekst opnieuw.'; }
      break;
    }
    case 'reset':
      if (!resetArmed) { resetArmed = true; rerender(); setTimeout(() => { if (resetArmed) { resetArmed = false; if (location.hash === '#instellingen') rerender(); } }, 5000); }
      else { st.start = null; st.done = {}; st.tests = {}; persist(); resetArmed = false; viewWeek = 1; location.hash = '#week'; }
      break;
  }
});

document.addEventListener('input', ev => {
  const t = ev.target;
  if (t.id === 'libq') { libQuery = t.value; $('#liblist').innerHTML = libList(); return; }
  if (t.dataset.tk) {
    const key = t.dataset.tk, w = testWeek, f = TF.find(x => key.startsWith(x.k));
    st.tests[w] = st.tests[w] || {};
    let val = null;
    if (t.dataset.part === 'v') {
      const raw = t.value.replace(',', '.').replace(/[^0-9.\-+]/g, '');
      if (raw !== '' && !isNaN(parseFloat(raw))) val = f.kind === 'cm' ? Math.round(parseFloat(raw) * 10) / 10 : Math.round(parseFloat(raw));
    } else {
      const m = $(`[data-tk="${key}"][data-part="m"]`).value.trim(), s = $(`[data-tk="${key}"][data-part="s"]`).value.trim();
      if (m !== '' || s !== '') val = (parseInt(m || '0', 10) || 0) * 60 + (parseInt(s || '0', 10) || 0);
    }
    if (val == null) delete st.tests[w][key]; else st.tests[w][key] = val;
    persist();
    $('#tline').textContent = testLine(w);
    $('#charts').innerHTML = TF.map(f2 => `<div class="card"><h3>${f2.k} · ${esc(f2.n)}</h3>${chart(f2)}</div>`).join('');
  }
});

window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferredInstall = e; if ((location.hash || '#week') === '#week') rerender(); });

if ('serviceWorker' in navigator && location.protocol === 'https:') {
  window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => { }); });
}

route();
