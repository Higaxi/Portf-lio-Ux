/* Português / English.
   O texto do site é escrito em português no HTML. Em inglês, cada texto é trocado pelo dicionário em js/en.js
   (chave = texto em português, com os espaços normalizados). O que não está no dicionário fica em português.
   Escolha guardada no navegador; ?lang=en ou ?lang=pt na URL também funciona. */
(function () {
  var EN = window.I18N_EN || {};
  var ATRS = ["alt", "aria-label", "title", "placeholder"];
  var origTexto = new WeakMap();   // nó de texto -> texto original
  var origAtr = new WeakMap();     // elemento -> { atributo: valor original }
  var raizes = [];
  var lingua = "pt";
  var escrevendo = false;

  var norm = function (t) { return t.replace(/\s+/g, " ").trim(); };
  var traduz = function (t) {
    var k = norm(t);
    if (!k) return null;
    var v = EN[k];
    if (v == null) {
      // textos montados pelo JS (contagem de amostras)
      var m = k.match(/^(\d+) amostras? de 300 g(?: · (.+) \(sem frete\))?$/);
      if (m) v = m[1] + (m[1] === "1" ? " sample" : " samples") + " of 300 g" + (m[2] ? " · " + m[2] + " (shipping not included)" : "");
      m = k.match(/^Total: (.+), sem frete$/);
      if (m) v = "Total: " + m[1] + ", shipping not included";
    }
    if (v == null) return null;
    var ini = t.match(/^\s*/)[0], fim = t.match(/\s*$/)[0];
    return ini + v + fim;
  };

  function aplicaTexto(n) {
    if (n.parentElement && n.parentElement.closest("script,style,noscript,[data-sem-traducao]")) return;
    if (!origTexto.has(n)) origTexto.set(n, n.nodeValue);
    var orig = origTexto.get(n);
    var novo = lingua === "en" ? traduz(orig) : null;
    var alvo = novo == null ? orig : novo;
    if (n.nodeValue !== alvo) n.nodeValue = alvo;
  }
  function aplicaAtr(el) {
    var o = origAtr.get(el);
    if (!o) { o = {}; origAtr.set(el, o); }
    ATRS.forEach(function (a) {
      if (!el.hasAttribute(a)) return;
      if (!(a in o)) o[a] = el.getAttribute(a);
      var novo = lingua === "en" ? traduz(o[a]) : null;
      var alvo = novo == null ? o[a] : novo;
      if (el.getAttribute(a) !== alvo) el.setAttribute(a, alvo);
    });
  }
  function percorre(r) {
    if (r.nodeType === 3) { aplicaTexto(r); return; }
    if (r.nodeType === 1) aplicaAtr(r);
    var w = document.createTreeWalker(r, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
    var n;
    while ((n = w.nextNode())) {
      if (n.nodeType === 3) aplicaTexto(n);
      else { aplicaAtr(n); if (n.shadowRoot) observa(n.shadowRoot); }
    }
  }
  var obs = new MutationObserver(function (lista) {
    if (escrevendo) return;
    escrevendo = true;
    lista.forEach(function (m) {
      if (m.type === "characterData") { origTexto.set(m.target, m.target.nodeValue); aplicaTexto(m.target); }
      else if (m.type === "attributes") { var o = origAtr.get(m.target); if (o) delete o[m.attributeName]; aplicaAtr(m.target); }
      else m.addedNodes.forEach(function (n) { if (n.nodeType === 3) origTexto.delete(n); percorre(n); });
    });
    obs.takeRecords();
    escrevendo = false;
  });
  function observa(r) {
    if (raizes.indexOf(r) >= 0) return;
    raizes.push(r);
    obs.observe(r, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ATRS });
    percorre(r);
  }

  var titulo = { t: document.title, d: "" };
  var meta = document.querySelector('meta[name="description"]');
  if (meta) titulo.d = meta.content;

  function aplica(l) {
    lingua = l;
    document.documentElement.lang = l === "en" ? "en" : "pt-BR";
    escrevendo = true;
    raizes.forEach(percorre);
    obs.takeRecords();
    escrevendo = false;
    document.title = l === "en" ? (traduz(titulo.t) || titulo.t) : titulo.t;
    if (meta) meta.content = l === "en" ? (traduz(titulo.d) || titulo.d) : titulo.d;
    document.querySelectorAll(".idioma button").forEach(function (b) { b.setAttribute("aria-pressed", b.dataset.l === l); });
    // links internos levam a escolha junto (funciona mesmo sem armazenamento do navegador)
    document.querySelectorAll('a[href$=".html"], a[href*=".html#"], a[href*=".html?"]').forEach(function (a) {
      var h = a.getAttribute("href");
      if (/^https?:/.test(h)) return;
      h = h.replace(/([?&])lang=(pt|en)&?/, "$1").replace(/[?&]$/, "");
      if (l === "en") { var p = h.split("#"); p[0] += (p[0].indexOf("?") >= 0 ? "&" : "?") + "lang=en"; h = p.join("#"); }
      a.setAttribute("href", h);
    });
    try { localStorage.setItem("fu-lingua", l); } catch (e) {}
  }

  function botao() {
    var barra = document.querySelector(".topo__barra");
    if (!barra || barra.querySelector(".idioma")) return;
    var d = document.createElement("div");
    d.className = "idioma";
    d.setAttribute("role", "group");
    d.setAttribute("aria-label", "Idioma / Language");
    d.setAttribute("data-sem-traducao", "");
    d.innerHTML = '<button type="button" data-l="pt" lang="pt-BR" aria-label="Português">PT</button><button type="button" data-l="en" lang="en" aria-label="English">EN</button>';
    d.addEventListener("click", function (e) { var b = e.target.closest("button"); if (b) aplica(b.dataset.l); });
    var antes = barra.querySelector(".botao--topo");
    barra.insertBefore(d, antes || null);
  }

  function inicio() {
    botao();
    observa(document.body);
    var q = (location.search.match(/[?&]lang=(pt|en)/) || [])[1];
    var salvo = null;
    try { salvo = localStorage.getItem("fu-lingua"); } catch (e) {}
    aplica(q || salvo || "pt");
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", inicio);
  else inicio();
  // componentes que criam shadow DOM depois (mapa das fazendas)
  window.addEventListener("load", function () { percorre(document.body); });
})();
