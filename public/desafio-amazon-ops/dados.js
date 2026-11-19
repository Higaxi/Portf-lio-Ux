/* Dados e regras compartilhados entre desktop.html (gestor e atendimento) e app.html (operacional).
   Tudo fictício. O estado fica no localStorage, então o que o operacional faz no app aparece para o gestor e o atendimento. */

const KEY = "ops-mock-v3";
const MIN = 60000;

/* ---------- Usuários e equipe ---------- */
const USERS = {
  "gestor":    { pass:"gestor123", role:"manager",     name:"Marcos Tavares" },
  "ana.silva": { pass:"func123",   role:"atendimento", name:"Ana Silva" },
  "carla":     { pass:"func123",   role:"atendimento", name:"Carla Mendes" },
  "bruno":     { pass:"app123",    role:"operacional", name:"Bruno Costa" },
  "diego":     { pass:"app123",    role:"operacional", name:"Diego Rocha" },
  "elisa":     { pass:"app123",    role:"operacional", name:"Elisa Nunes" },
  "fabio":     { pass:"app123",    role:"operacional", name:"Fábio Lima" }
};
const WORKERS = [
  { id:"ana.silva", name:"Ana Silva",    area:"atendimento" },
  { id:"carla",     name:"Carla Mendes", area:"atendimento" },
  { id:"bruno",     name:"Bruno Costa",  area:"operacional" },
  { id:"diego",     name:"Diego Rocha",  area:"operacional" },
  { id:"elisa",     name:"Elisa Nunes",  area:"operacional" },
  { id:"fabio",     name:"Fábio Lima",   area:"operacional" }
];
const AREA = { atendimento:"Atendimento", operacional:"Operacional" };

/* ---------- Ícones (poucos, um por situação) ---------- */
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
const FLAGS = [
  { k:"idle",    label:"Ociosos",         one:"Ocioso",         desc:"sem tarefa em andamento há 10 min ou mais" },
  { k:"over",    label:"Sobrecarregados", one:"Sobrecarregado", desc:"5+ tarefas abertas ou 2+ críticas" },
  { k:"stalled", label:"Sem resolver",    one:"Sem resolver",   desc:"tarefa bloqueada ou atrasada e nada concluído há 30 min" },
  { k:"slow",    label:"Lentos",          one:"Lento",          desc:"tempo médio 30% acima da própria área" }
];

/* ---------- Dados iniciais ---------- */
function seed(){
  const now = Date.now(), at = m => now + m*MIN;
  const mk = (id, area, type, title, detail, due, blocked, prime, assignee, extra) =>
    Object.assign({ id:"t"+id, area, type, title, detail, due:at(due), blocked, prime, assignee, status:"open", startedAt:null }, extra || {});

  const tasks = [
    // Atendimento (SAC): [canal, cliente, assunto, vence em min, escalado, prime, responsável, pedido]
    mk(1,"atendimento","Chat","Helena Prado","Diz que o pedido não chegou",                10,true, true,"ana.silva",{order:"#114-8830211"}),
    mk(2,"atendimento","Telefone","Roberto Alves","Quer trocar o endereço de entrega",     22,false,true,"ana.silva",{order:"#114-5521908"}),
    mk(3,"atendimento","E-mail","Juliana Reis","Pede reembolso de item danificado",        75,false,false,"ana.silva",{order:"#114-7712064"}),
    mk(4,"atendimento","Chat","Marcelo Dias","Dúvida sobre o prazo de entrega",           160,false,false,"ana.silva",{order:"#114-2290417"}),
    mk(5,"atendimento","E-mail","Patrícia Souza","Solicita nota fiscal",                  380,false,false,"ana.silva",{order:"#114-9034452"}),
    mk(6,"atendimento","Telefone","Sérgio Lima","Entregador não tocou a campainha",        50,true, false,"carla",{order:"#114-1198750"}),
    mk(7,"atendimento","Chat","Vera Nunes","Pedido veio incompleto",                      100,false,false,"carla",{order:"#114-4402279"}),
    mk(8,"atendimento","E-mail","Otávio Pires","Status da devolução",                     430,false,false,"carla",{order:"#114-7783301"}),
    mk(9,"atendimento","Telefone","Cláudia Freitas","Cobrança duplicada",                  -8,true, true, null,{order:"#114-9901233"}),
    mk(10,"atendimento","Chat","Henrique Matos","Pedido atrasado, cliente aguardando",     14,false,true, null,{order:"#114-2208841"}),
    // Operacional (app): entregas e recepção
    mk(11,"operacional","Entrega","Pedido #114-8830211","Rua das Acácias, 120 - Pinheiros, São Paulo",       38,false,true, "bruno",{order:"#114-8830211",customer:"Bianca Torres",code:"4821",phone:"(11) 9 8800-1122"}),
    mk(12,"operacional","Entrega","Pedido #114-6650123","Av. Paulista, 1578 - Bela Vista, São Paulo",          8,false,false,"bruno",{order:"#114-6650123",customer:"Fernando Gomes",code:"7305",phone:"(11) 9 7700-3344"}),
    mk(13,"operacional","Recepção","Lote L-2291","42 volumes · doca 3",                                      200,false,false,"bruno",{expected:42}),
    mk(14,"operacional","Entrega","Pedido #114-5509911","Rua Augusta, 900 - Consolação, São Paulo",         200,false,false,"diego",{order:"#114-5509911",customer:"Lucas Almeida",code:"1190",phone:"(11) 9 6600-5566"}),
    mk(15,"operacional","Recepção","Lote L-2294","60 volumes · doca 1",                                     480,false,false,"diego",{expected:60}),
    mk(16,"operacional","Entrega","Pedido #114-8812045","Rua Oscar Freire, 455 - Jardins, São Paulo",        95,false,true, "elisa",{order:"#114-8812045",customer:"Mariana Costa",code:"3367",phone:"(11) 9 5500-7788"}),
    mk(17,"operacional","Entrega","Pedido #114-3345128","Alameda Santos, 2100 - Cerqueira César, São Paulo",260,false,false,"elisa",{order:"#114-3345128",customer:"Rafael Lima",code:"5543",phone:"(11) 9 4400-9900"}),
    mk(18,"operacional","Entrega","Pedido #114-7120045","Rua Haddock Lobo, 300 - Cerqueira César, São Paulo", -6,true, true, null,{order:"#114-7120045",customer:"Paula Ribeiro",code:"2874",phone:"(11) 9 3300-1212",blockedReason:"Cliente ausente, reagendar"}),
    mk(19,"operacional","Entrega","Pedido #114-2208841","Rua da Consolação, 2200 - Consolação, São Paulo",     15,false,true, null,{order:"#114-2208841",customer:"Gustavo Reis",code:"9012",phone:"(11) 9 2200-3434"}),
    mk(20,"operacional","Recepção","Lote L-2299","28 volumes · doca 2",                                     140,false,false,null,{expected:28})
  ];
  const t12 = tasks.find(t => t.id === "t12"); t12.status = "doing"; t12.startedAt = at(-3);

  // resolvidas, soma dos minutos de resolução, última atividade, última conclusão
  const stats = {
    "ana.silva":{ resolved:7,  totalMin:98, lastActive:at(-2),  lastDone:at(-26)  },
    "carla":    { resolved:3,  totalMin:93, lastActive:at(-4),  lastDone:at(-70)  },
    "bruno":    { resolved:11, totalMin:99, lastActive:at(-1),  lastDone:at(-14)  },
    "diego":    { resolved:5,  totalMin:85, lastActive:at(-18), lastDone:at(-18)  },
    "elisa":    { resolved:8,  totalMin:96, lastActive:at(-9),  lastDone:at(-9)   },
    "fabio":    { resolved:0,  totalMin:0,  lastActive:at(-42), lastDone:at(-300) }
  };
  return {
    tasks, stats,
    notifications:[
      { id:1, text:"Transportadora recusou etiqueta do pedido #114-8830211", when:at(-4), unread:true },
      { id:2, text:"Pico de pedidos Prime previsto para 15h", when:at(-35), unread:true },
      { id:3, text:"Corredor C-14 liberado após manutenção", when:at(-95), unread:false }
    ],
    updates:[
      { id:1, who:"Marcos Tavares", text:"Reunião de turno às 14h, estação 3.", when:at(-50) },
      { id:2, who:"Carla Mendes", text:"Balança 2 voltou a funcionar.", when:at(-120) }
    ],
    activity:[
      { who:"Bruno Costa", text:"iniciou Pedido #114-6650123", when:at(-3) },
      { who:"Diego Rocha", text:"concluiu Pedido #114-1004477", when:at(-18) },
      { who:"Ana Silva",   text:"resolveu atendimento de Léo Prado", when:at(-26) }
    ]
  };
}
let S = null;
function load(){ try{ const v = JSON.parse(localStorage.getItem(KEY)); if(v && v.tasks && v.stats) return v; }catch(e){} return S || seed(); }
function save(s){ try{ localStorage.setItem(KEY, JSON.stringify(s)); }catch(e){} }
S = load(); save(S);

/* ---------- Prioridade (regra única, usada em todas as telas) ----------
   Crítico: bloqueada/escalada ou vence em até 30 min (ou já atrasada)
   Alto: até 90 min · Médio: até 4 h · Baixo: acima disso */
const RANK = { crit:0, high:1, med:2, low:3 };
const LABEL = { crit:"Crítico", high:"Alto", med:"Médio", low:"Baixo" };
const mins = t => Math.round((t.due - Date.now())/MIN);
function level(t){ const m = mins(t); if(t.blocked || m <= 30) return "crit"; if(m <= 90) return "high"; if(m <= 240) return "med"; return "low"; }
function sorter(a,b){ return RANK[level(a)] - RANK[level(b)] || a.due - b.due; }
function fmt(m){ const a = Math.abs(m); return a >= 60 ? `${Math.floor(a/60)} h ${String(a%60).padStart(2,"0")} min` : `${a} min`; }
function dueText(t){ const m = mins(t); return m < 0 ? `Atrasada ${fmt(m)}` : `Vence em ${fmt(m)}`; }
function blockedLabel(t){ return t.area === "atendimento" ? "Escalado ao supervisor" : (t.blockedReason || "Bloqueada"); }
function why(t){
  const p = [];
  if(t.blocked) p.push(`<b>${blockedLabel(t)}</b>`);
  const m = mins(t); p.push(m < 0 ? `<b>atrasada ${fmt(m)}</b>` : (m <= 30 ? `<b>vence em ${fmt(m)}</b>` : `vence em ${fmt(m)}`));
  if(t.prime) p.push("pedido Prime");
  return p.join(" · ");
}
const chip = t => `<span class="chip ${level(t)}">${LABEL[level(t)]}</span>`;
const ago = w => { const m = Math.max(0, Math.round((Date.now()-w)/MIN)); return m < 1 ? "agora" : m < 60 ? `há ${m} min` : `há ${Math.floor(m/60)} h`; };
const nameOf = id => (WORKERS.find(w => w.id === id) || {}).name || "Não atribuída";
const initials = n => n.split(" ").map(x => x[0]).slice(0,2).join("");
const log = (who, text) => { S.activity.unshift({ who, text, when:Date.now() }); S.activity = S.activity.slice(0, 12); };
const wasUnassignedCrit = t => t.status !== "done" && !t.assignee && level(t) === "crit";

/* ---------- Ações de trabalho (usadas pelo desktop e pelo app) ---------- */
function startTask(id, userId){
  const k = S.tasks.find(x => x.id === id), me = nameOf(userId);
  S.tasks.forEach(x => { if(x.assignee === userId && x.status === "doing") x.status = "open"; });
  k.status = "doing"; k.startedAt = Date.now(); S.stats[userId].lastActive = Date.now();
  log(me, k.area === "atendimento" ? `iniciou atendimento de ${k.title}` : `iniciou ${k.title}`); save(S);
}
function finishTask(id, userId, extra){
  const k = S.tasks.find(x => x.id === id), st = S.stats[userId], me = nameOf(userId);
  const dur = Math.max(1, Math.round((Date.now() - (k.startedAt || Date.now() - 10*MIN))/MIN));
  k.status = "done"; k.blocked = false; st.resolved++; st.totalMin += dur; st.lastDone = st.lastActive = Date.now();
  log(me, (k.area === "atendimento" ? `resolveu atendimento de ${k.title}` : `concluiu ${k.title}`) + (extra ? ` (${extra})` : "")); save(S);
}
function failTask(id, userId, reason){
  const k = S.tasks.find(x => x.id === id), me = nameOf(userId);
  k.status = "open"; k.startedAt = null; k.blocked = true; k.blockedReason = reason; S.stats[userId].lastActive = Date.now();
  log(me, `não conseguiu entregar ${k.title}: ${reason}`); save(S);
}

/* ---------- Métricas por pessoa (gestor) ---------- */
function teamAvg(list){ let r = 0, t = 0; (list || WORKERS).forEach(w => { const s = S.stats[w.id]; r += s.resolved; t += s.totalMin; }); return { avg: r ? t/r : 0, resolved:r }; }
function wm(w){
  const ts = S.tasks.filter(t => t.assignee === w.id && t.status !== "done").sort(sorter);
  const doing = ts.find(t => t.status === "doing"), st = S.stats[w.id];
  const crit = ts.filter(t => level(t) === "crit").length;
  const overdue = ts.filter(t => mins(t) < 0).length, blocked = ts.filter(t => t.blocked).length;
  const idleMin = doing ? 0 : Math.round((Date.now() - st.lastActive)/MIN);
  const sinceDone = Math.round((Date.now() - st.lastDone)/MIN);
  const avg = st.resolved ? st.totalMin/st.resolved : 0, T = teamAvg(WORKERS.filter(x => x.area === w.area)).avg;
  const f = {
    idle:    !doing && (ts.length === 0 || idleMin >= 10),
    over:    ts.length >= 5 || crit >= 2,
    stalled: (overdue > 0 || blocked > 0) && sinceDone >= 30,
    slow:    avg > 0 && T > 0 && avg >= T*1.3
  };
  return { w, ts, doing, st, crit, overdue, blocked, idleMin, sinceDone, avg, T, f, n:Object.values(f).filter(Boolean).length };
}
function attentionItems(){
  const items = [];
  S.tasks.filter(wasUnassignedCrit).sort(sorter)
    .forEach(t => items.push({ k:"stalled", text:`${AREA[t.area]}: ${t.title} sem responsável (${dueText(t).toLowerCase()})` }));
  WORKERS.map(wm).forEach(m => {
    if(m.f.stalled) items.push({ k:"stalled", text:`${m.w.name}: ${m.blocked ? "tarefa bloqueada" : "tarefa atrasada"} e nada concluído há ${fmt(m.sinceDone)}` });
    if(m.f.over)    items.push({ k:"over",    text:`${m.w.name}: sobrecarga, ${m.ts.length} tarefas abertas (${m.crit} críticas)` });
    if(m.f.idle)    items.push({ k:"idle",    text:`${m.w.name}: sem tarefa em andamento ${m.ts.length ? `há ${fmt(m.idleMin)}, com ${m.ts.length} na fila` : "e sem fila"}` });
    if(m.f.slow)    items.push({ k:"slow",    text:`${m.w.name}: tempo médio de ${Math.round(m.avg)} min (área: ${Math.round(m.T)} min)` });
  });
  return items;
}

/* logo: usa assets/amazon-logo.svg se existir; senão mostra o texto provisório */
function setupLogo(img, fb){
  img.onload  = () => { img.style.display = "block"; fb.style.display = "none"; };
  img.onerror = () => { img.style.display = "none"; fb.style.display = ""; };
}
