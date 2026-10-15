"use client";

import { useEffect, useRef } from "react";

type Body = {
  el: HTMLElement;
  w: number;
  h: number;
  x: number;
  y: number;
  px: number; // posição no passo anterior (para interpolar o desenho)
  py: number;
  vx: number;
  vy: number;
  a: number; // ângulo visual (graus)
  pa: number;
  va: number;
  spawn: number; // instante (s) em que a peça começa a cair
  live: boolean;
};

const STEP = 1 / 120; // passo fixo da simulação
const GRAVITY = 1700; // px/s²
const FLOOR_BOUNCE = 0.48; // restituição no chão
const STACK_BOUNCE = 0.18; // restituição entre peças
const BOUNCE_MIN = 140; // abaixo disso, a peça assenta em vez de quicar (sem tremer)
const AIR = 0.999;
const FRICTION = 0.9;
const SOLVER_ITERATIONS = 4;

/**
 * Palavras-chave como peças soltas: caem numa faixa, quicam, assentam e
 * podem ser arrastadas e arremessadas.
 *
 * Física própria (caixas alinhadas + rotação visual leve), passo fixo de
 * 1/120 s com interpolação no desenho: movimento estável a 60 fps.
 * Sem JS ou com prefers-reduced-motion, as palavras já aparecem pousadas.
 * A lista é texto real; o arrasto é um extra visual.
 */
export function KeywordPhysics({ words, label }: { words: string[]; label: string }) {
  const boxRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Só simula as peças visíveis (no celular algumas ficam ocultas).
    const items = Array.from(box.querySelectorAll<HTMLElement>("[data-word]")).filter((el) => el.offsetWidth > 0);
    const sizes = items.map((el) => [el.offsetWidth, el.offsetHeight] as const);
    box.dataset.live = "true";
    let W = box.clientWidth;
    let H = box.clientHeight;

    const bodies: Body[] = items.map((el, i) => {
      const [w, h] = sizes[i];
      const x = Math.max(0, Math.min(W - w, (W - w) * ((i * 0.61 + 0.17) % 1)));
      const y = -h - 20;
      const a = (Math.random() - 0.5) * 24;
      return { el, w, h, x, y, px: x, py: y, vx: (Math.random() - 0.5) * 160, vy: 0, a, pa: a, va: (Math.random() - 0.5) * 120, spawn: 0.15 + i * 0.13, live: false };
    });
    bodies.forEach((b) => (b.el.style.opacity = "0"));

    const draw = (alpha: number) => {
      for (const b of bodies) {
        const x = b.px + (b.x - b.px) * alpha;
        const y = b.py + (b.y - b.py) * alpha;
        const a = b.pa + (b.a - b.pa) * alpha;
        b.el.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${a}deg)`;
      }
    };
    draw(1);

    let dragging: { b: Body; dx: number; dy: number; id: number; lx: number; ly: number; lt: number } | null = null;
    let time = 0;

    const step = (dt: number) => {
      time += dt;
      for (const b of bodies) {
        b.px = b.x;
        b.py = b.y;
        b.pa = b.a;
        if (!b.live) {
          if (time >= b.spawn) {
            b.live = true;
            b.el.style.opacity = "";
          } else continue;
        }
        if (dragging?.b === b) continue;
        b.vy += GRAVITY * dt;
        b.vx *= AIR;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        // Rotação visual: acompanha a velocidade horizontal e volta ao zero como mola.
        b.va += (b.vx * 0.02 - b.a * 9 - b.va * 3.2) * dt * 10;
        b.a = Math.max(-14, Math.min(14, b.a + b.va * dt));
      }

      for (let k = 0; k < SOLVER_ITERATIONS; k++) {
        for (const b of bodies) {
          if (!b.live) continue;
          if (b.x < 0) {
            b.x = 0;
            b.vx = Math.abs(b.vx) * 0.5;
          } else if (b.x + b.w > W) {
            b.x = W - b.w;
            b.vx = -Math.abs(b.vx) * 0.5;
          }
          if (b.y + b.h > H) {
            b.y = H - b.h;
            if (b.vy > 0) {
              b.vy = b.vy > BOUNCE_MIN ? -b.vy * FLOOR_BOUNCE : 0;
              b.va -= b.vx * 0.05;
            }
            b.vx *= FRICTION;
            if (Math.abs(b.vx) < 3) b.vx = 0;
          }
        }
        for (let i = 0; i < bodies.length; i++) {
          const p = bodies[i];
          if (!p.live) continue;
          for (let j = i + 1; j < bodies.length; j++) {
            const q = bodies[j];
            if (!q.live) continue;
            const ox = Math.min(p.x + p.w, q.x + q.w) - Math.max(p.x, q.x);
            const oy = Math.min(p.y + p.h, q.y + q.h) - Math.max(p.y, q.y);
            if (ox <= 0 || oy <= 0) continue;
            const pFixed = dragging?.b === p;
            const qFixed = dragging?.b === q;
            const sp = pFixed ? 0 : qFixed ? 1 : 0.5;
            const sq = 1 - sp;
            if (oy < ox) {
              const dir = p.y < q.y ? -1 : 1; // -1: p em cima
              p.y += dir * oy * sp;
              q.y -= dir * oy * sq;
              const top = dir < 0 ? p : q;
              const bottom = dir < 0 ? q : p;
              const rel = top.vy - bottom.vy;
              if (rel > 0) {
                const impulse = rel > BOUNCE_MIN ? rel * (1 + STACK_BOUNCE) : rel;
                const topFixed = top === dragging?.b;
                const bottomFixed = bottom === dragging?.b;
                if (!topFixed) top.vy -= impulse * (bottomFixed ? 1 : 0.5);
                if (!bottomFixed) bottom.vy += impulse * (topFixed ? 1 : 0.5);
              }
              top.vx *= FRICTION;
              top.va += (bottom.vx - top.vx) * 0.02;
            } else {
              const dir = p.x < q.x ? -1 : 1;
              p.x += dir * ox * sp;
              q.x -= dir * ox * sq;
              const vx = (p.vx + q.vx) / 2;
              if (!pFixed) p.vx = vx;
              if (!qFixed) q.vx = vx;
            }
          }
        }
      }
    };

    const settled = () =>
      !dragging &&
      bodies.every((b) => b.live && Math.abs(b.vx) < 4 && Math.abs(b.vy) < 4 && Math.abs(b.va) < 2 && Math.abs(b.a) < 0.4);

    let raf = 0;
    let last = 0;
    let acc = 0;
    let visible = true;
    let calm = 0;

    const frame = (now: number) => {
      const dt = Math.min(0.1, last ? (now - last) / 1000 : STEP);
      last = now;
      acc += dt;
      while (acc >= STEP) {
        step(STEP);
        acc -= STEP;
      }
      draw(acc / STEP);
      calm = settled() ? calm + 1 : 0;
      if (calm > 30 || !visible) {
        raf = 0;
        last = 0;
        acc = 0;
        return;
      }
      raf = requestAnimationFrame(frame);
    };
    const wake = () => {
      if (!raf && visible) {
        calm = 0;
        raf = requestAnimationFrame(frame);
      }
    };

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) wake();
    });
    io.observe(box);
    // Remede caixa e peças quando algo muda de tamanho (fonte carregada, rotação da tela).
    const ro = new ResizeObserver(() => {
      W = box.clientWidth;
      H = box.clientHeight;
      for (const b of bodies) {
        b.w = b.el.offsetWidth;
        b.h = b.el.offsetHeight;
      }
      wake();
    });
    ro.observe(box);
    items.forEach((el) => ro.observe(el));

    const local = (e: PointerEvent) => {
      const r = box.getBoundingClientRect();
      return [e.clientX - r.left, e.clientY - r.top] as const;
    };
    const onDown = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-word]");
      const b = bodies.find((x) => x.el === el);
      if (!b || !b.live) return;
      const [lx, ly] = local(e);
      dragging = { b, dx: lx - b.x, dy: ly - b.y, id: e.pointerId, lx, ly, lt: performance.now() };
      b.el.setPointerCapture(e.pointerId);
      b.el.dataset.dragging = "true";
      b.vx = 0;
      b.vy = 0;
      wake();
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== dragging.id) return;
      const [lx, ly] = local(e);
      const now = performance.now();
      const dt = Math.max(0.008, (now - dragging.lt) / 1000);
      const b = dragging.b;
      b.x = Math.max(0, Math.min(W - b.w, lx - dragging.dx));
      b.y = Math.min(H - b.h, ly - dragging.dy);
      // Velocidade suavizada para o arremesso.
      b.vx = b.vx * 0.5 + ((lx - dragging.lx) / dt) * 0.5;
      b.vy = b.vy * 0.5 + ((ly - dragging.ly) / dt) * 0.5;
      b.va += ((lx - dragging.lx) / dt) * 0.01;
      dragging.lx = lx;
      dragging.ly = ly;
      dragging.lt = now;
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== dragging.id) return;
      const b = dragging.b;
      b.vx = Math.max(-1800, Math.min(1800, b.vx));
      b.vy = Math.max(-1800, Math.min(1800, b.vy));
      delete b.el.dataset.dragging;
      dragging = null;
      wake();
    };
    box.addEventListener("pointerdown", onDown);
    box.addEventListener("pointermove", onMove);
    box.addEventListener("pointerup", onUp);
    box.addEventListener("pointercancel", onUp);

    wake();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      box.removeEventListener("pointerdown", onDown);
      box.removeEventListener("pointermove", onMove);
      box.removeEventListener("pointerup", onUp);
      box.removeEventListener("pointercancel", onUp);
      delete box.dataset.live;
      items.forEach((el) => {
        el.style.transform = "";
        el.style.opacity = "";
      });
    };
  }, []);

  return (
    <ul
      ref={boxRef}
      aria-label={label}
      className="group/physics relative flex h-full flex-wrap content-end items-end gap-2 overflow-hidden [&[data-live]]:block"
    >
      {words.map((w, i) => (
        <li
          key={w}
          data-word
          className={`h-[clamp(2.5rem,2rem+2vw,4.25rem)] select-none items-center whitespace-nowrap rounded-full px-[0.85em] font-display text-[clamp(1.05rem,0.8rem+1.3vw,2rem)] font-medium uppercase tracking-tight will-change-transform group-data-[live]/physics:absolute group-data-[live]/physics:left-0 group-data-[live]/physics:top-0 group-data-[live]/physics:cursor-grab data-[dragging]:cursor-grabbing ${
            i >= 6 ? "hidden md:inline-flex" : "inline-flex"
          } ${i % 3 === 0 ? "bg-ink text-bg" : i % 3 === 1 ? "bg-surface text-ink" : "bg-surface-2 text-ink"}`}
          style={{ touchAction: "pan-y" }}
        >
          {w}
        </li>
      ))}
    </ul>
  );
}
