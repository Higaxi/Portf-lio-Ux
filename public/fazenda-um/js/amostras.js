/* Página de Amostras em 3 passos: escolher, dados, revisar e enviar (abre o e-mail pronto).
   Preço da amostra de 300 g = 50% do preço de exportação de 1 kg (US$).
   Preencha PRECO_KG_USD com o preço de 1 kg de cada café (chave = data-cafe). Sem preço, aparece "Sob consulta". */
(() => {
  const PRECO_KG_USD = {
    // "nanolotes-gesha": 0,   // exemplo: preço de exportação de 1 kg, em dólar
  };
  const EMAIL = "adm@umcoffeco.com.br";
  // 23/11: a diretora pediu USD 00.00 em todos os preços até a definição com Boram (amostra tem preço próprio, diferente do produto).
  const PRECO_PROVISORIO = true;
  const fmt = (n) => (PRECO_PROVISORIO ? "USD 00.00" : "USD " + n.toFixed(2));
  const form = document.getElementById("form-amostras");
  if (!form) return;

  const etapas = [...form.querySelectorAll(".etapa")];
  const marcas = [...document.querySelectorAll(".passos__item")];
  const avancar = document.getElementById("passo-avancar");
  const voltar = document.getElementById("passo-voltar");
  const aviso = document.getElementById("aviso-amostras");
  const resumo = document.getElementById("amostras-escolhidas");
  const revisao = document.getElementById("revisao");
  const itens = [...document.querySelectorAll(".amostra")];
  let atual = 0;

  itens.forEach((li) => {
    const kg = parseFloat(li.dataset.kg) || PRECO_KG_USD[li.dataset.cafe]; // café verde: preço do quilo vem da tabela de exportação
    li.dataset.preco = kg ? (kg * 0.5).toFixed(2) : "0";
    li.querySelector(".amostra__preco").textContent = fmt(kg ? kg * 0.5 : 0);
  });

  const escolhidas = () => itens.filter((li) => li.querySelector("input").checked);
  const total = (sel) => (sel.length && sel.every((li) => li.dataset.preco) ? sel.reduce((s, li) => s + parseFloat(li.dataset.preco), 0) : 0);
  const nome = (li) => li.querySelector(".amostra__nome").textContent;

  const atualizaResumo = () => {
    const sel = escolhidas();
    const t = total(sel);
    if (resumo) resumo.textContent = sel.length
      ? sel.length + (sel.length === 1 ? " amostra" : " amostras") + " de 300 g" + (t ? " · " + fmt(t) + " (sem frete)" : "")
      : "Nenhuma amostra escolhida";
  };
  form.addEventListener("change", atualizaResumo);

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const montaRevisao = () => {
    const d = new FormData(form);
    const sel = escolhidas();
    const t = total(sel);
    const linha = (k, v) => `<div><dt>${k}</dt><dd>${v}</dd></div>`;
    revisao.innerHTML =
      linha("Amostras (300 g cada)", sel.length ? sel.map((li) => esc(nome(li)) + (li.dataset.preco ? " · " + fmt(parseFloat(li.dataset.preco)) : "")).join("<br>") + (t ? `<br><strong>Total: ${fmt(t)}, sem frete</strong>` : "") : "Nenhuma escolhida: a fazenda sugere uma seleção") +
      linha("Nome", esc(d.get("nome"))) + linha("Torrefação ou empresa", esc(d.get("empresa"))) +
      linha("WhatsApp", esc(d.get("whatsapp"))) + linha("E-mail", esc(d.get("email"))) + linha("País de entrega", esc(d.get("pais"))) +
      (d.get("mensagem") ? linha("Perfil procurado", esc(d.get("mensagem"))) : "");
  };

  const mostra = (i) => {
    atual = i;
    etapas.forEach((e, k) => (e.hidden = k !== i));
    marcas.forEach((m, k) => {
      m.classList.toggle("is-feito", k < i);
      k === i ? m.setAttribute("aria-current", "step") : m.removeAttribute("aria-current");
    });
    voltar.hidden = i === 0;
    avancar.textContent = i === 0 ? "Continuar" : i === 1 ? "Revisar pedido" : "Enviar pedido por e-mail";
    aviso.textContent = "";
    if (i === 2) montaRevisao();
    if (iniciado) document.getElementById("passos").scrollIntoView({ behavior: "smooth", block: "start" });
  };
  let iniciado = false;

  const valida = () => {
    const campos = [...etapas[atual].querySelectorAll("input, textarea")].filter((c) => c.required);
    for (const c of campos) if (!c.checkValidity()) { c.reportValidity(); return false; }
    return true;
  };

  const enviar = () => {
    const d = new FormData(form);
    const sel = escolhidas().map((li) => "- " + nome(li) + " (300 g)");
    const corpo = `Pedido de amostras pelo site\n\nNome: ${d.get("nome")}\nTorrefação ou empresa: ${d.get("empresa")}\nWhatsApp: ${d.get("whatsapp")}\nE-mail: ${d.get("email")}\nPaís de entrega: ${d.get("pais")}\n\nAmostras pedidas:\n${sel.join("\n") || "- (nenhuma escolhida, sugerir uma seleção)"}\n\nPerfil procurado e objetivos de compra:\n${d.get("mensagem") || "-"}\n\nPor favor, entrar em contato pelo WhatsApp.`;
    location.href = `mailto:${EMAIL}?subject=${encodeURIComponent("Pedido de amostras, " + d.get("empresa"))}&body=${encodeURIComponent(corpo)}`;
    aviso.textContent = "Abrimos o seu programa de e-mail com o pedido pronto. É só apertar enviar; um representante chama você no WhatsApp.";
  };

  avancar.addEventListener("click", () => {
    if (!valida()) return;
    atual < 2 ? mostra(atual + 1) : enviar();
  });
  voltar.addEventListener("click", () => mostra(atual - 1));
  form.addEventListener("submit", (e) => e.preventDefault());
  form.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.tagName === "INPUT" && e.target.type !== "checkbox") { e.preventDefault(); avancar.click(); } });

  // Abas de origem do café verde (sem JS, todas as origens aparecem)
  const abas = [...document.querySelectorAll(".verdes__aba")];
  const escolheAba = (aba) => abas.forEach((a) => {
    const on = a === aba;
    a.setAttribute("aria-selected", String(on)); a.tabIndex = on ? 0 : -1;
    document.getElementById(a.getAttribute("aria-controls")).hidden = !on;
  });
  abas.forEach((a, i) => {
    a.addEventListener("click", () => escolheAba(a));
    a.addEventListener("keydown", (e) => {
      const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
      if (d) { const n = abas[(i + d + abas.length) % abas.length]; escolheAba(n); n.focus(); }
    });
  });
  // amostras.html#linha-microlots abre direto a saca certa
  const pelaUrl = () => { const alvo = abas.find((x) => "#" + x.getAttribute("aria-controls") === location.hash); if (alvo) { escolheAba(alvo); document.getElementById("cafe-verde").scrollIntoView({ block: "start" }); } return !!alvo; };
  if (abas.length && !pelaUrl()) escolheAba(abas[0]);
  addEventListener("hashchange", pelaUrl);

  atualizaResumo();
  mostra(0);
  iniciado = true;
})();
