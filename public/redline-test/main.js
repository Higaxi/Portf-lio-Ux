const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

function whenVisible(element, callback) {
  const observer = new IntersectionObserver((entries) => {
    if (!entries.some((entry) => entry.isIntersecting)) return;
    observer.disconnect();
    callback();
  }, { rootMargin: '0px 0px -10% 0px' });

  observer.observe(element.closest('table') ?? element);
}

function setupReveals() {
  document.querySelectorAll('[data-stagger]').forEach((group) => {
    [...group.children].forEach((child, order) => child.style.setProperty('--order', order));
  });

  document.querySelectorAll('[data-reveal], [data-stagger]').forEach((element) => {
    whenVisible(element, () => element.classList.add('is-in'));
  });
}

function setupRedlines() {
  document.querySelectorAll('.hero .redline').forEach((element) => {
    whenVisible(element, () => element.classList.add('is-marked'));
  });
}

function countUp(element) {
  const target = Number(element.dataset.count);
  const duration = 1400;
  const start = performance.now();

  function frame(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - (1 - progress) ** 4;
    element.textContent = Math.round(target * eased).toLocaleString('en-US');
    if (progress < 1) requestAnimationFrame(frame);
  }

  requestAnimationFrame(frame);
}

function setupCounters() {
  if (reducedMotion) return;

  document.querySelectorAll('[data-count]').forEach((element) => {
    whenVisible(element, () => countUp(element));
  });
}

function setupClauses() {
  const tabs = [...document.querySelectorAll('[role="tab"]')];
  const clauses = [...document.querySelectorAll('[role="tabpanel"]')];
  const contract = document.querySelector('.contract');
  let contractSeen = false;

  function markClause(clause) {
    clause.classList.remove('is-marked');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => clause.classList.add('is-marked'));
    });
  }

  function showClause(selectedTab) {
    tabs.forEach((tab) => {
      const isSelected = tab === selectedTab;
      tab.setAttribute('aria-selected', String(isSelected));
      tab.tabIndex = isSelected ? 0 : -1;
    });

    clauses.forEach((clause) => {
      clause.hidden = clause.id !== selectedTab.getAttribute('aria-controls');
      if (!clause.hidden && contractSeen) markClause(clause);
    });
  }

  function moveFocus(event) {
    const step = { ArrowDown: 1, ArrowUp: -1 }[event.key];
    if (!step) return;

    event.preventDefault();
    const next = tabs[(tabs.indexOf(event.currentTarget) + step + tabs.length) % tabs.length];
    next.focus();
    showClause(next);
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => showClause(tab));
    tab.addEventListener('keydown', moveFocus);
  });

  showClause(tabs[0]);
  whenVisible(contract, () => {
    contractSeen = true;
    markClause(clauses.find((clause) => !clause.hidden));
  });
}

function setupMobileCta() {
  const heroButton = document.querySelector('.hero .button');
  const mobileCta = document.querySelector('.mobile-cta');

  new IntersectionObserver(([entry]) => {
    mobileCta.classList.toggle('is-visible', !entry.isIntersecting);
  }).observe(heroButton);
}

setupReveals();
setupRedlines();
setupCounters();
setupClauses();
setupMobileCta();
