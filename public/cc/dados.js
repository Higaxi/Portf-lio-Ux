/* Shared data and rules for desktop.html (manager and customer service) and app.html (field operations).
   Everything is fictional. State lives in localStorage, so what field ops do in the app shows up for the manager and customer service. */

const KEY = "ops-mock-en-v1";
const MIN = 60000;

/* ---------- Users and team ---------- */
const USERS = {
  "manager":   { pass:"manager123", role:"manager",     name:"Mark Taylor" },
  "ana.silva": { pass:"agent123",   role:"atendimento", name:"Ana Silva" },
  "carla":     { pass:"agent123",   role:"atendimento", name:"Carla Mendes" },
  "bruno":     { pass:"app123",     role:"operacional", name:"Bruno Costa" },
  "diego":     { pass:"app123",     role:"operacional", name:"Diego Rocha" },
  "elisa":     { pass:"app123",     role:"operacional", name:"Elisa Nunes" },
  "fabio":     { pass:"app123",     role:"operacional", name:"Fabio Lima" }
};
const WORKERS = [
  { id:"ana.silva", name:"Ana Silva",    area:"atendimento" },
  { id:"carla",     name:"Carla Mendes", area:"atendimento" },
  { id:"bruno",     name:"Bruno Costa",  area:"operacional" },
  { id:"diego",     name:"Diego Rocha",  area:"operacional" },
  { id:"elisa",     name:"Elisa Nunes",  area:"operacional" },
  { id:"fabio",     name:"Fabio Lima",   area:"operacional" }
];
const AREA = { atendimento:"Customer Service", operacional:"Field Operations" };
/* Service settings per area. The manager changes them in Settings. */
const CONFIG_PADRAO = {
  atendimento: { maxOpen:5, maxCrit:2, idleMin:10, stalledMin:30, slowPct:30, slaCrit:30, slaHigh:90, slaMed:240 },
  operacional: { maxOpen:5, maxCrit:2, idleMin:10, stalledMin:30, slowPct:30, slaCrit:30, slaHigh:90, slaMed:240 }
};

/* ---------- Icons (one per situation) ---------- */
const P = {
  idle:    '<circle cx="12" cy="12" r="9"/><path d="M10 9v6M14 9v6"/>',
  over:    '<path d="M12 3c1 3 4 4.5 4 8.5a4 4 0 0 1-8 0c0-1.5.5-2.5 1.5-3.5.2 1 .8 1.5 1.5 1.5C11 7.5 11 5 12 3z"/>',
  stalled: '<path d="M8 3h8l5 5v8l-5 5H8l-5-5V8z"/><path d="M12 8v5M12 16.2v.3"/>',
  slow:    '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  ok:      '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/>',
  bell:    '<path d="M6 9a6 6 0 0 1 12 0c0 6 2 7 2 7H4s2-1 2-7"/><path d="M10 20a2 2 0 0 0 4 0"/>',
  truck:   '<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  box:     '<path d="M3 8l9-5 9 5v8l-9 5-9-5z"/><path d="M3 8l9 5 9-5M12 13v8"/>',
  pin:     '<path d="M12 21s7-6.2 7-11a7 7 0 0 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/>',
  back:    '<path d="M15 5l-7 7 7 7"/>',
  phone:   '<path d="M6 3h4l2 5-2.5 1.5a11 11 0 0 0 5 5L16 12l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 4 6a2 2 0 0 1 2-3z"/>'
};
const ic = k => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${P[k]}</svg>`;
const FLAGS_BASE = [
  { k:"idle",    label:"Idle",       one:"Idle",       desc:"no task in progress for 10+ min" },
  { k:"over",    label:"Overloaded", one:"Overloaded", desc:"5+ open tasks or 2+ critical" },
  { k:"stalled", label:"Stuck",      one:"Stuck",      desc:"blocked or late task and nothing closed in 30 min" },
  { k:"slow",    label:"Slow",       one:"Slow",       desc:"average time 30% above their area" }
];

/* Situations with the configured limits (of the chosen area; in the overview, Customer Service's). */
function flagsFor(area){
  const c = cfgOf(area === "operacional" ? "operacional" : "atendimento");
  const d = { idle:`no task in progress for ${c.idleMin}+ min`, over:`${c.maxOpen}+ open tasks or ${c.maxCrit}+ critical`, stalled:`blocked or late and nothing closed in ${c.stalledMin} min`, slow:`average time ${c.slowPct}% above the area` };
  return FLAGS_BASE.map(f => Object.assign({}, f, { desc:d[f.k] }));
}
let FLAGS = FLAGS_BASE;

/* ---------- Seed data ---------- */
function seed(){
  const now = Date.now(), at = m => now + m*MIN;
  const mk = (id, area, type, title, detail, due, blocked, prime, assignee, extra) =>
    Object.assign({ id:"t"+id, area, type, title, detail, due:at(due), blocked, prime, assignee, status:"open", startedAt:null }, extra || {});

  const tasks = [
    // Customer Service: [channel, customer, subject, due in min, escalated, prime, assignee, order]
    mk(1,"atendimento","Chat","Helen Parker","Says the order never arrived",                 10,true, true,"ana.silva",{order:"#114-8830211"}),
    mk(2,"atendimento","Phone","Robert Allen","Wants to change the delivery address",        22,false,true,"ana.silva",{order:"#114-5521908"}),
    mk(3,"atendimento","Email","Julia Reed","Requests a refund for a damaged item",          75,false,false,"ana.silva",{order:"#114-7712064"}),
    mk(4,"atendimento","Chat","Mark Dixon","Question about the delivery date",              160,false,false,"ana.silva",{order:"#114-2290417"}),
    mk(5,"atendimento","Email","Patricia Shaw","Asks for an invoice",                       380,false,false,"ana.silva",{order:"#114-9034452"}),
    mk(6,"atendimento","Phone","Steven Lee","Driver didn't ring the doorbell",               50,true, false,"carla",{order:"#114-1198750"}),
    mk(7,"atendimento","Chat","Vera Nolan","Order arrived incomplete",                      100,false,false,"carla",{order:"#114-4402279"}),
    mk(8,"atendimento","Email","Owen Pierce","Return status",                               430,false,false,"carla",{order:"#114-7783301"}),
    mk(9,"atendimento","Phone","Claire Foster","Charged twice",                              -8,true, true, null,{order:"#114-9901233"}),
    mk(10,"atendimento","Chat","Henry Mason","Late order, customer waiting at home",         14,false,true, null,{order:"#114-2208841"}),
    // Field Operations (app): deliveries and receiving
    mk(11,"operacional","Delivery","Order #114-8830211","1420 Pine St, Capitol Hill, Seattle, WA",          38,false,true, "bruno",{order:"#114-8830211",customer:"Bianca Torres",code:"4821",phone:"(206) 555-0112"}),
    mk(12,"operacional","Delivery","Order #114-6650123","500 Pike St, Downtown, Seattle, WA",                8,false,false,"bruno",{order:"#114-6650123",customer:"Frank Gomez",code:"7305",phone:"(206) 555-0134"}),
    mk(13,"operacional","Receiving","Batch L-2291","42 packages · dock 3",                                  200,false,false,"bruno",{expected:42}),
    mk(14,"operacional","Delivery","Order #114-5509911","2200 Westlake Ave, South Lake Union, Seattle, WA",200,false,false,"diego",{order:"#114-5509911",customer:"Lucas Allen",code:"1190",phone:"(206) 555-0156"}),
    mk(15,"operacional","Receiving","Batch L-2294","60 packages · dock 1",                                  480,false,false,"diego",{expected:60}),
    mk(16,"operacional","Delivery","Order #114-8812045","3400 Fremont Ave N, Fremont, Seattle, WA",         95,false,true, "elisa",{order:"#114-8812045",customer:"Mary Collins",code:"3367",phone:"(206) 555-0178"}),
    mk(17,"operacional","Delivery","Order #114-3345128","1900 N 45th St, Wallingford, Seattle, WA",        260,false,false,"elisa",{order:"#114-3345128",customer:"Ralph Lindsey",code:"5543",phone:"(206) 555-0190"}),
    mk(18,"operacional","Delivery","Order #114-7120045","815 E Union St, Capitol Hill, Seattle, WA",        -6,true, true, null,{order:"#114-7120045",customer:"Paula Ross",code:"2874",phone:"(206) 555-0121",blockedReason:"Customer not home, reschedule"}),
    mk(19,"operacional","Delivery","Order #114-2208841","1100 2nd Ave, Belltown, Seattle, WA",             15,false,true, null,{order:"#114-2208841",customer:"Gus Reilly",code:"9012",phone:"(206) 555-0143"}),
    mk(20,"operacional","Receiving","Batch L-2299","28 packages · dock 2",                                  140,false,false,null,{expected:28})
  ];
  const t12 = tasks.find(t => t.id === "t12"); t12.status = "doing"; t12.startedAt = at(-3);
  // History: cases already solved today
  [[21,"Chat","Leo Price","Tracking wasn't updating",-26,"#114-3301198"],[22,"Email","Sonia Archer","Copy of the payment slip",-75,"#114-6620031"],[23,"Phone","Kyle Mendez","Size exchange",-140,"#114-1180264"]]
    .forEach(([id,type,title,detail,ago,order]) => tasks.push(Object.assign(mk(id,"atendimento",type,title,detail,ago+20,false,false,"ana.silva",{order}), { status:"done", doneAt:at(ago), doneBy:"ana.silva" })));

  // solved, total minutes to solve, last activity, last completion
  const stats = {
    "ana.silva":{ resolved:7,  totalMin:98, lastActive:at(-2),  lastDone:at(-26)  },
    "carla":    { resolved:3,  totalMin:93, lastActive:at(-4),  lastDone:at(-70)  },
    "bruno":    { resolved:11, totalMin:99, lastActive:at(-1),  lastDone:at(-14)  },
    "diego":    { resolved:5,  totalMin:85, lastActive:at(-18), lastDone:at(-18)  },
    "elisa":    { resolved:8,  totalMin:96, lastActive:at(-9),  lastDone:at(-9)   },
    "fabio":    { resolved:0,  totalMin:0,  lastActive:at(-42), lastDone:at(-300) }
  };
  // Conversations: "cli:<task>" is support with the customer; "ent:<order>" is support with the order's driver.
  const m = (from, name, text, ago) => ({ from, name, text, when:at(-ago) });
  const chats = {
    "cli:t1": [
      m("cliente","Helen Parker","Hi, my order #114-8830211 was due yesterday and it never arrived.",14),
      m("sistema","","Case opened via chat · Prime order",14),
      m("cliente","Helen Parker","I need it today, it's a gift.",9)
    ],
    "cli:t4": [ m("cliente","Mark Dixon","When is my order going to be delivered?",40) ],
    "cli:t7": [ m("cliente","Vera Nolan","Only one of the two boxes showed up.",25) ],
    "cli:t10": [
      m("cliente","Henry Mason","My order is late, is it still coming today?",6),
      m("cliente","Henry Mason","I'm home waiting for it.",3)
    ],
    "cli:t21": [ m("cliente","Leo Price","Tracking stopped updating.",40), m("sac","Ana Silva","I just checked: your order went out for delivery at 9 AM.",32), m("cliente","Leo Price","Perfect, thank you!",28) ],
    "ent:#114-8830211": [
      m("entregador","Bruno Costa","Order #114-8830211 loaded, heading out after the Pike St stop.",20)
    ]
  };
  return {
    tasks, stats, chats, typing:{}, config:JSON.parse(JSON.stringify(CONFIG_PADRAO)), blocked:{}, extra:[], sim:{ news:0, steps:{} },
    notifications:[
      { id:1, text:"Carrier rejected the label for order #114-8830211", when:at(-4), unread:true },
      { id:2, text:"Prime order peak expected at 3 PM", when:at(-35), unread:true },
      { id:3, text:"Aisle C-14 reopened after maintenance", when:at(-95), unread:false }
    ],
    updates:[
      { id:1, who:"Mark Taylor", text:"Shift meeting at 2 PM, station 3.", when:at(-50) },
      { id:2, who:"Carla Mendes", text:"Scale 2 is working again.", when:at(-120) }
    ],
    activity:[
      { who:"Bruno Costa", text:"started Order #114-6650123", when:at(-3) },
      { who:"Diego Rocha", text:"completed Order #114-1004477", when:at(-18) },
      { who:"Ana Silva",   text:"solved Leo Price's case", when:at(-26) }
    ]
  };
}
let S = null;
function load(){
  let v = null; try{ v = JSON.parse(localStorage.getItem(KEY)); }catch(e){}
  if(!(v && v.tasks && v.stats)) v = S || seed();
  v.config = v.config || JSON.parse(JSON.stringify(CONFIG_PADRAO)); v.blocked = v.blocked || {}; v.extra = v.extra || []; v.sim = v.sim || { news:0, steps:{} };
  return v;
}
function save(s){ try{ localStorage.setItem(KEY, JSON.stringify(s)); }catch(e){} }
S = load(); save(S);

/* ---------- Priority (one rule, used on every screen) ----------
   Critical: blocked/escalated or due within 30 min (or already late)
   High: within 90 min · Medium: within 4 h · Low: beyond that */
const RANK = { crit:0, high:1, med:2, low:3 };
const LABEL = { crit:"Critical", high:"High", med:"Medium", low:"Low" };
const mins = t => Math.round((t.due - Date.now())/MIN);
function level(t){ const c = cfgOf(t.area), m = mins(t); if(t.blocked || m <= c.slaCrit) return "crit"; if(m <= c.slaHigh) return "high"; if(m <= c.slaMed) return "med"; return "low"; }
function sorter(a,b){ return RANK[level(a)] - RANK[level(b)] || a.due - b.due; }
function fmt(m){ const a = Math.abs(m); return a >= 60 ? `${Math.floor(a/60)} h ${String(a%60).padStart(2,"0")} min` : `${a} min`; }
function dueText(t){ const m = mins(t); return m < 0 ? `Late by ${fmt(m)}` : `Due in ${fmt(m)}`; }
function blockedLabel(t){ return t.area === "atendimento" ? "Escalated to supervisor" : (t.blockedReason || "Blocked"); }
function why(t){
  const p = [];
  if(t.blocked) p.push(`<b>${blockedLabel(t)}</b>`);
  const m = mins(t); p.push(m < 0 ? `<b>late by ${fmt(m)}</b>` : (m <= 30 ? `<b>due in ${fmt(m)}</b>` : `due in ${fmt(m)}`));
  if(t.prime) p.push("Prime order");
  return p.join(" · ");
}
const chip = t => `<span class="chip ${level(t)}">${LABEL[level(t)]}</span>`;
const ago = w => { const m = Math.max(0, Math.round((Date.now()-w)/MIN)); return m < 1 ? "just now" : m < 60 ? `${m} min ago` : `${Math.floor(m/60)} h ago`; };
const team = () => WORKERS.concat((S.extra || []).map(x => ({ id:x.id, name:x.name, area:x.area })));
function accountOf(u){ if(USERS[u]) return USERS[u]; const x = (S.extra || []).find(e => e.id === u); return x ? { pass:x.pass, role:x.area, name:x.name } : null; }
const isBlocked = id => !!(S.blocked || {})[id];
const cfgOf = area => ((S && S.config) || CONFIG_PADRAO)[area] || CONFIG_PADRAO[area];
const nameOf = id => (team().find(w => w.id === id) || {}).name || "Unassigned";
const initials = n => n.split(" ").map(x => x[0]).slice(0,2).join("");
const log = (who, text) => { S.activity.unshift({ who, text, when:Date.now() }); S.activity = S.activity.slice(0, 12); };
const wasUnassignedCrit = t => t.status !== "done" && !t.assignee && level(t) === "crit";

/* ---------- Work actions (used by desktop and app) ---------- */
function startTask(id, userId){
  const k = S.tasks.find(x => x.id === id), me = nameOf(userId);
  S.tasks.forEach(x => { if(x.assignee === userId && x.status === "doing") x.status = "open"; });
  k.status = "doing"; k.startedAt = Date.now(); statOf(userId).lastActive = Date.now();
  log(me, k.area === "atendimento" ? `started ${k.title}'s case` : `started ${k.title}`); save(S);
}
function finishTask(id, userId, extra){
  const k = S.tasks.find(x => x.id === id), st = statOf(userId), me = nameOf(userId);
  const dur = Math.max(1, Math.round((Date.now() - (k.startedAt || Date.now() - 10*MIN))/MIN));
  k.status = "done"; k.doneAt = Date.now(); k.doneBy = userId; k.blocked = false; st.resolved++; st.totalMin += dur; st.lastDone = st.lastActive = Date.now();
  log(me, (k.area === "atendimento" ? `solved ${k.title}'s case` : `completed ${k.title}`) + (extra ? ` (${extra})` : "")); save(S);
}
function failTask(id, userId, reason){
  const k = S.tasks.find(x => x.id === id), me = nameOf(userId);
  k.status = "open"; k.startedAt = null; k.blocked = true; k.blockedReason = reason; statOf(userId).lastActive = Date.now();
  log(me, `couldn't deliver ${k.title}: ${reason}`); save(S);
}

/* ---------- Auto-assign ----------
   Each unassigned task goes to whoever has the fewest open tasks in the same area, skipping blocked users
   and anyone who would go over the overload limit. Whatever doesn't fit stays for a manual decision. */
function autoDistribute(area, byName){
  const pend = S.tasks.filter(t => t.status !== "done" && !t.assignee && (area === "all" || t.area === area)).sort(sorter);
  let ok = 0, left = 0;
  pend.forEach(t => {
    const c = cfgOf(t.area);
    const cand = team().filter(w => w.area === t.area && !isBlocked(w.id)).map(w => {
      const open = S.tasks.filter(x => x.assignee === w.id && x.status !== "done");
      return { w, open:open.length, crit:open.filter(x => level(x) === "crit").length };
    }).filter(x => x.open + 1 <= c.maxOpen && (level(t) !== "crit" || x.crit + 1 <= c.maxCrit)).sort((a,b) => a.open - b.open || a.crit - b.crit);
    if(cand.length){ t.assignee = cand[0].w.id; ok++; log(byName, `assigned ${t.title} to ${cand[0].w.name} (auto)`); } else left++;
  });
  save(S); return { ok, left };
}

/* ---------- Per-person metrics (manager) ---------- */
function statOf(id){ return (S.stats[id] = S.stats[id] || { resolved:0, totalMin:0, lastActive:Date.now(), lastDone:Date.now() }); }
function teamAvg(list){ let r = 0, t = 0; (list || team()).forEach(w => { const s = statOf(w.id); r += s.resolved; t += s.totalMin; }); return { avg: r ? t/r : 0, resolved:r }; }
function wm(w){
  const ts = S.tasks.filter(t => t.assignee === w.id && t.status !== "done").sort(sorter);
  const doing = ts.find(t => t.status === "doing"), st = statOf(w.id), c = cfgOf(w.area);
  const crit = ts.filter(t => level(t) === "crit").length;
  const overdue = ts.filter(t => mins(t) < 0).length, blocked = ts.filter(t => t.blocked).length;
  const idleMin = doing ? 0 : Math.round((Date.now() - st.lastActive)/MIN);
  const sinceDone = Math.round((Date.now() - st.lastDone)/MIN);
  const avg = st.resolved ? st.totalMin/st.resolved : 0, T = teamAvg(team().filter(x => x.area === w.area)).avg;
  const f = {
    idle:    !isBlocked(w.id) && !doing && (ts.length === 0 || idleMin >= c.idleMin),
    over:    ts.length >= c.maxOpen || crit >= c.maxCrit,
    stalled: (overdue > 0 || blocked > 0) && sinceDone >= c.stalledMin,
    slow:    avg > 0 && T > 0 && avg >= T*(1 + c.slowPct/100)
  };
  return { w, ts, doing, st, crit, overdue, blocked, idleMin, sinceDone, avg, T, f, n:Object.values(f).filter(Boolean).length };
}
function attentionItems(){
  const items = [];
  S.tasks.filter(wasUnassignedCrit).sort(sorter)
    .forEach(t => items.push({ k:"stalled", text:`${AREA[t.area]}: ${t.title} has no owner (${dueText(t).toLowerCase()})` }));
  team().map(wm).forEach(m => {
    if(m.f.stalled) items.push({ k:"stalled", text:`${m.w.name}: ${m.blocked ? "blocked task" : "late task"} and nothing closed in ${fmt(m.sinceDone)}` });
    if(m.f.over)    items.push({ k:"over",    text:`${m.w.name}: overloaded, ${m.ts.length} open tasks (${m.crit} critical)` });
    if(m.f.idle)    items.push({ k:"idle",    text:`${m.w.name}: no task in progress ${m.ts.length ? `for ${fmt(m.idleMin)}, with ${m.ts.length} in queue` : "and empty queue"}` });
    if(m.f.slow)    items.push({ k:"slow",    text:`${m.w.name}: average of ${Math.round(m.avg)} min (area: ${Math.round(m.T)} min)` });
  });
  return items;
}

/* ---------- Simulated chat ----------
   The customer is simulated (answers on their own, with "typing…").
   The driver is whoever is logged into the app: the "ent:<order>" thread shows on both sides. */
const thread = k => (S.chats[k] = S.chats[k] || []);
const unreadFor = (k, me) => { const r = (S.reads || {})[me + "|" + k] || 0; return thread(k).filter(x => x.when > r && x.name !== nameOf(me) && x.from !== "sistema").length; };
function markRead(k, me){ S.reads = S.reads || {}; S.reads[me + "|" + k] = Date.now(); save(S); }
function sendMsg(k, from, name, text){
  text = String(text || "").trim(); if(!text) return;
  thread(k).push({ from, name, text, when:Date.now() }); save(S);
}
function setTyping(k, who, on){ S.typing = S.typing || {}; if(on) S.typing[k] = { who, until:Date.now() + 8000 }; else delete S.typing[k]; save(S); }
const typingNow = k => { const t = (S.typing || {})[k]; return t && t.until > Date.now() ? t.who : null; };

/* Simulated customer replies, based on the topic of the agent's last message. */
function customerReply(t, last){
  const s = (last || "").toLowerCase();
  if(/thank|solved|resolved|bye/.test(s)) return "Thank you! I appreciate the help.";
  if(/code/.test(s)) return t.order === "#114-8830211" ? "The code I got is 4821." : "I got the code by text, I have it right here.";
  if(/address/.test(s)) return "Yes, that's the right address, you can confirm with the driver.";
  if(/refund|return|chargeback/.test(s)) return "Ok. How many days until I get the money back?";
  if(/driver|route|way|today|arriv/.test(s)) return "Great, I'll keep an eye on the door. How long until he gets here?";
  if(/sorry|apolog/.test(s)) return "It's ok, I just want this sorted out.";
  return ["Got it. What happens now?", "Ok, I'll wait.", "Can you let me know when there's an update?"][thread("cli:" + t.id).length % 3];
}
function simulateCustomer(t, onUpdate){
  const k = "cli:" + t.id, last = [...thread(k)].reverse().find(x => x.from === "sac");
  setTimeout(() => { S = load(); setTyping(k, t.title, true); onUpdate && onUpdate(); }, 900);
  setTimeout(() => { S = load(); setTyping(k, null, false); sendMsg(k, "cliente", t.title, customerReply(t, last && last.text)); onUpdate && onUpdate(); }, 900 + 2200 + Math.random()*1200);
}

/* Simulated situations so the agent can practice replies: runs every few seconds on the support screen. */
const NOVOS = [
  ["Lauren Cole","Chat","The driver left the package at the wrong front desk","#114-5530921"],
  ["Peter Andrews","Chat","I got a different product from what I ordered","#114-7781203"],
  ["Betty Lynn","Chat","I want to cancel, the order hasn't shipped yet","#114-2209987"]
];
function runSimulation(me, onUpdate){
  if(!S) return; S.sim = S.sim || { news:0, steps:{} }; S.sim.steps = S.sim.steps || {};
  const now = Date.now(), steps = S.sim.steps, mine = S.tasks.filter(t => t.assignee === me && t.status !== "done" && t.area === "atendimento");
  // 1) customer follows up when left without an answer
  for(const t of mine.filter(x => x.type === "Chat")){
    const th = thread("cli:" + t.id), last = th[th.length - 1];
    if(last && last.from === "cliente" && now - last.when > 75000 && !steps["cobra:" + t.id]){
      steps["cobra:" + t.id] = 1; sendMsg("cli:" + t.id, "cliente", t.title, "Is anyone there? Could someone answer me, please?"); onUpdate && onUpdate("cobra", t); return;
    }
  }
  // 2) driver sends an update about the customer's order
  const t1 = S.tasks.find(t => t.id === "t1" && t.status !== "done");
  if(t1 && !steps.entUpd && now - (S.sim.started || (S.sim.started = now)) > 30000){
    steps.entUpd = 1; sendMsg("ent:" + t1.order, "entregador", "Bruno Costa", "I'm 10 min from Helen's address. If she can confirm the buzzer number, that helps."); onUpdate && onUpdate("ent", t1); return;
  }
  // 3) a new case comes in (up to three)
  if(S.sim.news < NOVOS.length && now - (S.sim.lastNew || S.sim.started || now) > 55000){
    const [title, type, detail, order] = NOVOS[S.sim.news], id = "n" + (S.sim.news + 1);
    S.tasks.push({ id, area:"atendimento", type, title, detail, due:now + (20 + S.sim.news*25)*MIN, blocked:false, prime:S.sim.news === 0, assignee:me, status:"open", startedAt:null, order });
    thread("cli:" + id).push({ from:"cliente", name:title, text:detail + ".", when:now });
    S.sim.news++; S.sim.lastNew = now; save(S); onUpdate && onUpdate("novo", S.tasks.find(t => t.id === id)); return;
  }
  save(S);
}
/* Simulated driver: answers support if nobody replied from the app within a few seconds. */
function simulateDriver(order, driverName, onUpdate){
  const k = "ent:" + order, sentAt = Date.now();
  setTimeout(() => {
    S = load(); const th = thread(k); if(th.some(x => x.from === "entregador" && x.when > sentAt)) return;
    setTyping(k, driverName, true); onUpdate && onUpdate();
    setTimeout(() => {
      S = load(); setTyping(k, null, false);
      const last = ([...thread(k)].reverse().find(x => x.from === "sac") || {}).text || "";
      const r = /code/i.test(last) ? "Noted, I'll ask for the code at the door." : /eta|how long|arriv|when/i.test(last) ? "About 15 minutes, I'm in traffic on 5th Ave." : /priorit/i.test(last) ? "Ok, I'll make it my next stop." : "Sure, I've got it.";
      sendMsg(k, "entregador", driverName, r); onUpdate && onUpdate();
    }, 2000);
  }, 6000);
}

/* Simulated delivery customer: answers the driver in the "dest:<order>" thread. */
function simulateRecipient(t, onUpdate){
  const k = "dest:" + t.order, last = ([...thread(k)].reverse().find(x => x.from === "entregador") || {}).text || "";
  const r = /here|gate|buzzer|door|arrived/i.test(last) ? "Coming down now!" : /way|minutes|min/i.test(last) ? "Great, I'm home." : /code/i.test(last) ? `The code is ${t.code}.` : /no one|nobody|answer/i.test(last) ? "Sorry, I was in the shower. Can you come back in 5 min?" : "Sounds good, thanks!";
  setTimeout(() => { S = load(); setTyping(k, t.customer, true); onUpdate && onUpdate(); }, 800);
  setTimeout(() => { S = load(); setTyping(k, null, false); sendMsg(k, "cliente", t.customer, r); onUpdate && onUpdate(); }, 3000);
}
