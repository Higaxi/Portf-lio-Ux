"use client";

import { useEffect, useRef } from "react";

type Body = {
  el: HTMLElement;
  x: number;
  y: number;
  w: number;
  h: number;
  vx: number;
  vy: number;
};

const GRAVITY = 2400; // px/s²
const RESTITUTION = 0.25;
const FRICTION = 0.86;
const ITERATIONS = 6;

/**
 * Palavras-chave como peças soltas: caem, empilham e podem ser arrastadas.
 * Física própria e mínima (caixas sem rotação), sem dependência externa.
 *
 * - Sem JS ou com prefers-reduced-motion: as palavras ficam paradas, em linha.
 * - As palavras são uma lista de texto real; o arrasto é só um extra visual.
 * - A simulação dorme quando tudo para e quando a área sai da tela.
 */
export function KeywordPhysics({ words, label }: { words: string[]; label: string }) {
  const boxRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduce.matches) return;

    const items = Array.from(box.querySelectorAll<HTMLElement>("[data-word]"));
    const sizes = items.map((el) => [el.offsetWidth, el.offsetHeight]);
    box.dataset.live = "true";
    let W = box.clientWidth;
    let H = box.clientHeight;

    // Mede cada peça na posição estática e passa a posicioná-las por transform.
    const bodies: Body[] = items.map((el, i) => {
      const [w, h] = sizes[i];
      return {
        el,
        w,
        h,
        x: Math.min(Math.max(0, (W - w) * ((i * 0.37 + 0.13) % 1)), W - w),
        y: -h - i * (h * 0.9) - 40,
        vx: (Math.random() - 0.5) * 120,
        vy: 0,
      };
    });
    const place = (b: Body) => {
      b.el.style.transform = `translate3d(${b.x}px, ${b.y}px, 0)`;
    };
    bodies.forEach(place);

    let raf = 0;
    let last = 0;
    let visible = true;
    let dragging: { b: Body; dx: number; dy: number; id: number; px: number; py: number; t: number } | null = null;

    const step = (now: number) => {
      const dt = Math.min(0.032, (now - (last || now)) / 1000);
      last = now;

      for (const b of bodies) {
        if (dragging?.b === b) continue;
        b.vy += GRAVITY * dt;
        b.x += b.vx * dt;
        b.y += b.vy * dt;
      }

      for (let k = 0; k < ITERATIONS; k++) {
        for (const b of bodies) {
          // Paredes e chão (o topo fica aberto para as peças entrarem).
          if (b.x < 0) {
            b.x = 0;
            b.vx = Math.abs(b.vx) * RESTITUTION;
          } else if (b.x + b.w > W) {
            b.x = W - b.w;
            b.vx = -Math.abs(b.vx) * RESTITUTION;
          }
          if (b.y + b.h > H) {
            b.y = H - b.h;
            if (b.vy > 0) b.vy = b.vy > 90 ? -b.vy * RESTITUTION : 0;
            if (Math.abs(b.vx) < 4) b.vx = 0;
            b.vx *= FRICTION;
          }
        }
        for (let i = 0; i < bodies.length; i++) {
          for (let j = i + 1; j < bodies.length; j++) {
            const a = bodies[i];
            const c = bodies[j];
            const ox = Math.min(a.x + a.w, c.x + c.w) - Math.max(a.x, c.x);
            const oy = Math.min(a.y + a.h, c.y + c.h) - Math.max(a.y, c.y);
            if (ox <= 0 || oy <= 0) continue;
            const aFixed = dragging?.b === a;
            const cFixed = dragging?.b === c;
            const shareA = aFixed ? 0 : cFixed ? 1 : 0.5;
            const shareC = 1 - shareA;
            if (oy < ox) {
              const dir = a.y < c.y ? -1 : 1;
              a.y += dir * oy * shareA;
              c.y -= dir * oy * shareC;
              let vy = (a.vy + c.vy) / 2;
              if (Math.abs(vy) < 90) vy = 0;
              if (!aFixed) a.vy = vy;
              if (!cFixed) c.vy = vy;
              if (!aFixed) a.vx *= FRICTION;
              if (!cFixed) c.vx *= FRICTION;
            } else {
              const dir = a.x < c.x ? -1 : 1;
              a.x += dir * ox * shareA;
              c.x -= dir * ox * shareC;
              const vx = (a.vx + c.vx) / 2;
              if (!aFixed) a.vx = vx;
              if (!cFixed) c.vx = vx;
            }
          }
        }
      }

      let moving = Boolean(dragging);
      for (const b of bodies) {
        place(b);
        if (Math.abs(b.vx) > 4 || Math.abs(b.vy) > 4) moving = true;
      }

      if (moving && visible) {
        raf = requestAnimationFrame(step);
      } else {
        raf = 0;
        last = 0;
      }
    };

    const wake = () => {
      if (!raf && visible) {
        last = 0;
        raf = requestAnimationFrame(step);
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) wake();
    });
    io.observe(box);

    const ro = new ResizeObserver(() => {
      W = box.clientWidth;
      H = box.clientHeight;
      wake();
    });
    ro.observe(box);

    const onDown = (e: PointerEvent) => {
      const target = (e.target as HTMLElement).closest<HTMLElement>("[data-word]");
      const b = bodies.find((x) => x.el === target);
      if (!b) return;
      const r = box.getBoundingClientRect();
      dragging = { b, dx: e.clientX - r.left - b.x, dy: e.clientY - r.top - b.y, id: e.pointerId, px: e.clientX, py: e.clientY, t: performance.now() };
      b.el.setPointerCapture(e.pointerId);
      b.el.dataset.dragging = "true";
      b.vx = 0;
      b.vy = 0;
      wake();
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== dragging.id) return;
      const r = box.getBoundingClientRect();
      const now = performance.now();
      const dt = Math.max(0.008, (now - dragging.t) / 1000);
      const b = dragging.b;
      b.x = Math.min(Math.max(0, e.clientX - r.left - dragging.dx), W - b.w);
      b.y = Math.min(e.clientY - r.top - dragging.dy, H - b.h);
      b.vx = (e.clientX - dragging.px) / dt;
      b.vy = (e.clientY - dragging.py) / dt;
      dragging.px = e.clientX;
      dragging.py = e.clientY;
      dragging.t = now;
    };
    const onUp = (e: PointerEvent) => {
      if (!dragging || e.pointerId !== dragging.id) return;
      const b = dragging.b;
      b.vx = Math.max(-2000, Math.min(2000, b.vx));
      b.vy = Math.max(-2000, Math.min(2000, b.vy));
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
      items.forEach((el) => (el.style.transform = ""));
    };
  }, []);

  return (
    <ul
      ref={boxRef}
      aria-label={label}
      className="group/physics relative flex h-full min-h-[14rem] flex-wrap content-end items-end gap-2 overflow-hidden [&[data-live]]:block"
    >
      {words.map((w, i) => (
        <li
          key={w}
          data-word
          className={`inline-flex h-[clamp(3rem,2.4rem+2.4vw,4.75rem)] select-none items-center whitespace-nowrap rounded-full px-[0.9em] font-display text-[clamp(1.25rem,0.9rem+1.6vw,2.25rem)] font-medium uppercase tracking-tight will-change-transform group-data-[live]/physics:absolute group-data-[live]/physics:left-0 group-data-[live]/physics:top-0 group-data-[live]/physics:cursor-grab data-[dragging]:cursor-grabbing ${
            i % 3 === 0 ? "bg-ink text-bg" : i % 3 === 1 ? "bg-surface text-ink" : "bg-surface-2 text-ink"
          }`}
          style={{ touchAction: "pan-y" }}
        >
          {w}
        </li>
      ))}
    </ul>
  );
}
