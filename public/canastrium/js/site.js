/* Canastrium · landing page: tudo o que se mexe com o scroll (parallax, leque da mesa, panorama, corredor dos Chefões),
   as entradas das seções, a vitrine de Trunfos que passa sozinha e o carrossel do bar.
   Os dados vêm de js/dados.js. Sem script a página continua inteira; com movimento reduzido nada corre. */
(function(){
  const D=window.CANASTRIUM||{trunfos:[],baralhos:[],chefoes:[]};
  const doc=document.documentElement;
  const calmo=matchMedia('(prefers-reduced-motion: reduce)').matches;
  doc.classList.add('js');
  const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
  const TIER={jei:'Normal',tru:'Raro',mal:'Mítico',man:'Lendário'};
  const AURA={jei:'rgba(190,190,190,.32)',tru:'rgba(60,141,255,.45)',mal:'rgba(170,80,255,.45)',man:'rgba(255,201,74,.55)'};
  const RAR={jei:.25,tru:.5,mal:.75,man:1};
  const sorteia=(arr,n)=>{const a=arr.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a.slice(0,n)};
  const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));

  // Trunfo como no jogo: carta na moldura da raridade, Lendário com o bicho por cima, ou objeto em pé (sem carta)
  function jk(t,lazy=true){
    const el=document.createElement('span'),L=lazy?' loading="lazy"':'';
    if(t.item){el.className='jk item';el.innerHTML=`<img class="px" src="img/trunfos/${t.item}" alt="${t.n}"${L}>`}
    else if(t.leg){el.className='jk leg tier-man';el.style.backgroundImage=`url(img/trunfos/${t.k}-fundo.webp)`;el.innerHTML=`<img src="img/trunfos/${t.k}-alma.webp" alt="${t.n}"${L}>`}
    else{el.className='jk tier-'+t.t;el.innerHTML=`<img src="img/trunfos/${t.img}" alt="${t.n}"${L}>`}
    return el;
  }

  // ---------- números que contam ao aparecer ----------
  function conta(el){const fim=+el.dataset.conta;if(calmo||!fim){el.textContent=fim;return}
    const t0=performance.now(),dur=1100;const passo=t=>{const p=clamp((t-t0)/dur);el.textContent=Math.round(fim*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(passo)};requestAnimationFrame(passo)}

  // ---------- revelar ao rolar, em sequência dentro de cada bloco ----------
  const io=('IntersectionObserver' in window)&&!calmo?new IntersectionObserver(es=>es.forEach(e=>{
    if(!e.isIntersecting)return;const el=e.target;io.unobserve(el);
    if(el.matches('[data-placar]')){el.querySelectorAll('[data-conta]').forEach(conta);setTimeout(()=>{const b=el.querySelector('[data-barra]');if(b)b.style.transform='scaleX(1)'},500);return}
    el.classList.add('visto');
  }),{rootMargin:'0px 0px -10% 0px'}):null;
  function observa(el){if(io)io.observe(el);else{el.classList.add('visto');if(el.matches('[data-placar]')){const b=el.querySelector('[data-barra]');if(b)b.style.transform='scaleX(1)'}}}
  $$('.revela').forEach(el=>{const irmaos=[...el.parentElement.children].filter(c=>c.classList.contains('revela'));el.style.setProperty('--atraso',irmaos.indexOf(el)*90+'ms');observa(el)});
  $$('.selos [data-conta]').forEach(el=>{if(io)setTimeout(()=>conta(el),700)});
  const placar=$('[data-placar]');if(placar)observa(placar);

  // ---------- o boteco: o pessoal do menu, nos mesmos lugares (panorama de 1768×660) ----------
  const pessoas=$('[data-pessoas]');
  if(pessoas){
    // os dançarinos do menu, só em chão livre: sem ficar em cima das mesas redondas (x≈65, 455, 825, 1235, 1695), da sinuca (1300 a 1530),
    // de outro dançarino ou dos sentados (no menu a câmera corre e isso passa despercebido; aqui o panorama é uma foto)
    const DANCA=[[0,230,520],[7,655,530],[1,955,525],[11,1075,535],[15,1470,612],[13,1585,590]];
    const SENTA=[[2,398,582],[9,515,582],[4,790,592],[5,1182,582],[8,1302,582]];
    const poe=(cls,img,[i,x,y],esc)=>{const s=document.createElement('i'),w=64*esc;s.className=cls;
      s.style.cssText=`left:${(x-w/2)/17.68}%;top:${(y-w)/6.6}%;width:${w/17.68}%;height:${w/6.6}%;background-image:url(img/menu/${img});background-position-x:${i/15*100}%;`+
        `animation-delay:${(-Math.random()*2).toFixed(2)}s;animation-duration:${(0.45+Math.random()*.25).toFixed(2)}s`;
      if(Math.random()<.5)s.classList.add('vira');pessoas.append(s)};
    SENTA.forEach(p=>poe('sentado','sentados.png',p,2.2));
    DANCA.sort((a,b)=>a[2]-b[2]).forEach(p=>poe('dancando','dancando.png',p,2.35));
  }

  // ---------- Chefões: placas do corredor ----------
  const trilhoC=$('[data-chefoes]');
  if(trilhoC&&D.chefoes.length){
    const escolhidos=['truco','agiota','sogra','bamba','apagao','fofoqueiro','enchente','canalha','couvert','garcomlento','pagode','mesa7','saideira','greve','racha'];
    escolhidos.map(k=>D.chefoes.find(c=>c.k===k)).filter(Boolean).forEach((c,i)=>{
      const el=document.createElement('article');el.className='chefe';el.style.setProperty('--cor',c.col);
      el.innerHTML=`<p class="chefe-rodada">${c.min?'A partir da Rodada '+(c.min+1):'Desde a Rodada 1'}</p><h3 class="chefe-nome">${c.n}</h3><p class="chefe-regra">${c.d}</p><span class="chefe-selo" aria-hidden="true">${i+1}</span>`;
      trilhoC.append(el);observa(el)});
  }

  // ---------- vitrine de Trunfos: passa sozinha por todos os Trunfos com sprite ----------
  const fila=sorteia(D.trunfos.filter(t=>!t.leg),D.trunfos.length);
  ['nick','felix'].forEach((k,n)=>{const t=D.trunfos.find(x=>x.k===k);if(t)fila.splice(3+n*7,0,t)});
  const bar=D.trunfos.find(t=>t.k==='bar');if(bar){fila.splice(fila.indexOf(bar),1);fila.unshift(bar)}
  const carta=$('[data-destaque-carta]'),lista=$('[data-destaque-lista]'),vitrine=$('.destaque');
  const JANELA=7,TEMPO=3800;let atual=0,inicio=0,pausa=false,relogio=null;
  // troca da carta: a atual gira até ficar de lado e some, a nova entra já de lado e gira de volta (as duas pela mesma transição do CSS)
  const info=$('.destaque-info');let trocando=null;
  function mostra(i,anima=true){
    if(!carta||!fila.length)return;atual=(i+fila.length)%fila.length;const t=fila[atual];
    const janela=atual<inicio||atual>=inicio+JANELA;if(janela)inicio=atual;      // a fileira de miniaturas acompanha
    const troca=()=>{carta.querySelector('.jk').replaceWith(jk(t,false));$('[data-d-nome]').textContent=t.n;$('[data-d-efeito]').textContent=t.d;
      const tier=$('[data-d-tier]');tier.textContent=TIER[t.t];tier.className='destaque-tier t-'+t.t;
      $('[data-d-rar]').style.setProperty('--v',RAR[t.t]);$('[data-d-preco]').style.setProperty('--v',t.p?clamp(t.p/12):1);
      $('[data-d-preco-t]').textContent=t.t==='man'?'não vende':'R$'+t.p;carta.querySelector('[data-aura]').style.setProperty('--cor-aura',AURA[t.t])};
    clearTimeout(trocando);
    if(calmo||!anima){troca();carta.classList.remove('sai');info&&info.classList.remove('sai')}
    else{carta.classList.add('sai');info&&info.classList.add('sai');
      trocando=setTimeout(()=>{troca();void carta.offsetWidth;carta.classList.remove('sai');info&&info.classList.remove('sai')},260)}
    if(janela||!lista.children.length)miniaturas();else lista.querySelectorAll('button').forEach(b=>b.setAttribute('aria-selected',+b.dataset.i===atual?'true':'false'));
    reinicia();
  }
  function miniaturas(){
    if(!lista)return;lista.innerHTML='';
    for(let k=0;k<JANELA;k++){const i=(inicio+k)%fila.length,t=fila[i],b=document.createElement('button');
      b.type='button';b.dataset.i=i;b.setAttribute('role','tab');b.setAttribute('aria-label',t.n);b.setAttribute('aria-selected',i===atual?'true':'false');
      b.append(jk(t));b.addEventListener('click',()=>mostra(i));lista.append(b)}
  }
  const tempo=$('[data-d-tempo]');
  function reinicia(){clearTimeout(relogio);if(tempo){tempo.classList.remove('corre');void tempo.offsetWidth;if(!pausa)tempo.classList.add('corre')}
    if(!pausa)relogio=setTimeout(()=>mostra(atual+1),TEMPO)}
  if(vitrine){
    const para=v=>{pausa=v;if(v){clearTimeout(relogio);tempo&&tempo.classList.remove('corre')}else reinicia()};
    vitrine.addEventListener('mouseenter',()=>para(true));vitrine.addEventListener('mouseleave',()=>para(false));
    vitrine.addEventListener('focusin',()=>para(true));vitrine.addEventListener('focusout',()=>para(false));
    // só passa enquanto a vitrine está na tela
    if('IntersectionObserver' in window)new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){if(!vitrine.matches(':hover'))para(false)}else para(true)})).observe(vitrine);
    mostra(0,false);
  }
  const pac=$('[data-pacote]');
  if(pac)pac.addEventListener('click',()=>{const r=Math.random(),tier=r<.5?'jei':r<.85?'tru':'mal';const ids=fila.map((t,i)=>t.t===tier?i:-1).filter(i=>i>=0);mostra(ids[Math.random()*ids.length|0])});

  // desfile: duas voltas para correr sem emenda
  const trilho=$('[data-desfile]');
  if(trilho&&D.trunfos.length){const volta=sorteia(D.trunfos,28);[...volta,...volta].forEach(t=>trilho.append(jk(t)))}

  // ---------- o bar: versos dos baralhos e setas do carrossel ----------
  const versos=$('[data-versos]');
  if(versos&&D.baralhos.length)D.baralhos.forEach((b,i)=>{const im=new Image();im.src=`img/cards/cb-${b.k}.webp`;im.alt='';im.loading='lazy';im.style.setProperty('--i',i);versos.append(im)});
  // carrossel automático: anda um cartaz a cada 3,2 s e dá a volta sem fim (uma segunda cópia dos cartazes vem logo depois; ao chegar nela,
  // o trilho volta escondido para o mesmo ponto da primeira). Para com o mouse em cima, com o foco, com o dedo e fora da tela.
  const cartazes=$('[data-cartazes]');
  if(cartazes){
    const orig=[...cartazes.children];
    orig.forEach(li=>{const c=li.cloneNode(true);c.setAttribute('aria-hidden','true');c.inert=true;c.classList.remove('revela');cartazes.append(c)});
    const passo=()=>orig[0].offsetWidth+parseFloat(getComputedStyle(cartazes).columnGap||20);
    const volta=()=>cartazes.children[orig.length].offsetLeft-orig[0].offsetLeft;
    const pula=x=>{cartazes.style.scrollSnapType='none';cartazes.scrollLeft=x;requestAnimationFrame(()=>{cartazes.style.scrollSnapType=''})};
    function anda(dir){
      const v=volta();
      if(dir>0&&cartazes.scrollLeft>=v-2)pula(cartazes.scrollLeft-v);
      if(dir<0&&cartazes.scrollLeft<=2)pula(cartazes.scrollLeft+v);
      requestAnimationFrame(()=>cartazes.scrollBy({left:dir*passo(),behavior:calmo?'auto':'smooth'}));
      roda();
    }
    let tic=null,parado=false,naTela=false;
    const roda=()=>{clearTimeout(tic);if(!parado&&naTela)tic=setTimeout(()=>anda(1),3200)};
    const para=v=>{parado=v;roda()};
    $$('[data-trilho]').forEach(s=>s.addEventListener('click',()=>anda(+s.dataset.trilho)));
    const bar=cartazes.closest('section');
    bar.addEventListener('mouseenter',()=>para(true));bar.addEventListener('mouseleave',()=>para(false));
    cartazes.addEventListener('focusin',()=>para(true));cartazes.addEventListener('focusout',()=>para(false));
    let dedo=null;cartazes.addEventListener('touchstart',()=>{para(true);clearTimeout(dedo)},{passive:true});
    cartazes.addEventListener('touchend',()=>{dedo=setTimeout(()=>para(false),4000)},{passive:true});
    if('IntersectionObserver' in window)new IntersectionObserver(es=>es.forEach(e=>{naTela=e.isIntersecting;roda()})).observe(cartazes);else{naTela=true;roda()}
  }

  // ---------- topo: fica sólido ao rolar e marca a seção atual ----------
  const topo=$('[data-topo]'),links=$$('.topo-nav a');
  const secoes=links.map(a=>$(a.getAttribute('href'))).filter(Boolean);

  // ---------- o laço do scroll ----------
  const par=$$('[data-par]'),barra=$('[data-progresso]'),mesa=$('[data-mesa]');
  const boteco=$('.boteco'),pano=$('[data-pano]'),locais=$$('[data-local]');
  const chefoes=$('.chefoes');
  let pedido=false;
  function quadro(){
    pedido=false;
    const y=scrollY,vh=innerHeight,alto=doc.scrollHeight-vh;
    if(barra)barra.style.transform=`scaleX(${alto>0?y/alto:0})`;
    if(topo)topo.classList.toggle('solido',y>40);
    let atualS=null;secoes.forEach((s,i)=>{if(s.getBoundingClientRect().top<vh*.4)atualS=i});
    links.forEach((a,i)=>a.classList.toggle('ativo',i===atualS));
    if(calmo)return;
    par.forEach(el=>{const r=el.parentElement.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;
      const k=+el.dataset.par;el.style.transform=`translate3d(0,${(-r.top)*k}px,0)${el.hasAttribute('data-zoom')?` scale(${1+clamp(-r.top/vh)*.08})`:''}`});
    if(mesa){const r=mesa.getBoundingClientRect();mesa.style.setProperty('--abre',clamp((vh-r.top)/(vh*.75)).toFixed(3))}
    if(boteco&&pano){const r=boteco.getBoundingClientRect(),p=clamp(-r.top/(r.height-vh));
      const sobra=Math.max(0,pano.scrollWidth-innerWidth);pano.style.transform=`translate3d(${-p*sobra}px,0,0)`;
      locais.forEach((l,i)=>l.classList.toggle('ativo',i===Math.min(locais.length-1,Math.floor(p*locais.length))))}
    if(chefoes&&trilhoC){const r=chefoes.getBoundingClientRect(),p=clamp(-r.top/(r.height-vh));
      const sobra=Math.max(0,trilhoC.scrollWidth-innerWidth);trilhoC.style.transform=`translate3d(${-p*sobra}px,0,0)`}
  }
  // links do menu: descida suave com aceleração e freada (em vez de pular direto), descontando a barra do topo
  const suave=t=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;let indo=null;
  $$('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{
    const id=a.getAttribute('href'),alvo=id.length>1&&$(id);if(!alvo)return;e.preventDefault();
    const destino=Math.max(0,alvo.getBoundingClientRect().top+scrollY-(id==='#inicio'?0:(topo?topo.offsetHeight-1:0)));
    history.replaceState(null,'',id);
    if(calmo){scrollTo(0,destino);return}
    const de=scrollY,dist=destino-de,dur=clamp(Math.abs(dist)/2.2,550,1500),t0=performance.now();cancelAnimationFrame(indo);
    const passo=agora=>{const p=clamp((agora-t0)/dur);scrollTo(0,de+dist*suave(p));if(p<1)indo=requestAnimationFrame(passo)};indo=requestAnimationFrame(passo);
    ['wheel','touchstart','keydown'].forEach(ev=>addEventListener(ev,()=>cancelAnimationFrame(indo),{once:true,passive:true}));      // o jogador pegou o scroll: para
  }));
  const pede=()=>{if(!pedido){pedido=true;requestAnimationFrame(quadro)}};
  addEventListener('scroll',pede,{passive:true});addEventListener('resize',pede);
  if(pano)pano.querySelector('img').addEventListener('load',pede);
  quadro();
  // trailer do herói: começa mudo (o navegador só deixa tocar sozinho assim); o botão liga o som e volta para o começo.
  // Com movimento reduzido ele não toca sozinho, e só roda enquanto aparece na tela.
  const vid=$('[data-trailer]'),som=$('[data-som]');
  if(vid){
    if(calmo){vid.removeAttribute('autoplay');vid.pause();vid.controls=true}
    if(som)som.addEventListener('click',()=>{const liga=vid.muted;vid.muted=!liga;if(liga){vid.currentTime=0;vid.play().catch(()=>{})}
      som.setAttribute('aria-pressed',String(liga));som.textContent=liga?'Tirar som':'Ligar som'});
    if('IntersectionObserver' in window&&!calmo)new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)vid.play().catch(()=>{});else vid.pause()}),{threshold:.25}).observe(vid);
  }
})();
