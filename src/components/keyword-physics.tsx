"use client";

import { useEffect, useRef } from "react";
import type MatterNS from "matter-js";

const STEP_MS = 1000 / 120; // passo fixo da simulação
const WALL = 200; // espessura das paredes, fora da área visível

/**
 * Palavras-chave como peças soltas: caem numa faixa, quicam, tombam quando
 * ficam sem apoio, assentam e podem ser arrastadas e arremessadas.
 *
 * Física de corpo rígido (matter-js, carregado só no navegador): cada palavra
 * é uma pílula com rotação, atrito e restituição de verdade, então nenhuma
 * fica equilibrada na quina de outra.
 * Sem JS ou com prefers-reduced-motion, as palavras já aparecem pousadas.
 * A lista é texto real; o arrasto é um extra visual.
 */
export function KeywordPhysics({ words, label }: { words: string[]; label: string }) {
  const boxRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const box = boxRef.current;
    if (!box) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;
    let cleanup = () => {};

    import("matter-js").then(({ default: Matter }) => {
      if (cancelled) return;
      cleanup = simulate(Matter, box);
    });

    return () => {
      cancelled = true;
      cleanup();
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

type Piece = { el: HTMLElement; w: number; h: number; body: MatterNS.Body; spawn: number; live: boolean };

function simulate(Matter: typeof MatterNS, box: HTMLElement) {
  const { Engine, Bodies, Body, Composite, Constraint, Sleeping } = Matter;

  // Só simula as peças visíveis (no celular algumas ficam ocultas).
  const items = Array.from(box.querySelectorAll<HTMLElement>("[data-word]")).filter((el) => el.offsetWidth > 0);
  box.dataset.live = "true";
  let W = box.clientWidth;
  let H = box.clientHeight;

  const engine = Engine.create({ enableSleeping: true, positionIterations: 10, velocityIterations: 8 });
  engine.gravity.y = 1.6;

  const wallOpts = { isStatic: true, restitution: 0.3, friction: 0.6 };
  const floor = Bodies.rectangle(W / 2, H + WALL / 2, W * 3, WALL, wallOpts);
  const left = Bodies.rectangle(-WALL / 2, 0, WALL, H * 6, wallOpts);
  const right = Bodies.rectangle(W + WALL / 2, 0, WALL, H * 6, wallOpts);
  Composite.add(engine.world, [floor, left, right]);

  const makeBody = (w: number, h: number, x: number, y: number, angle: number) =>
    Bodies.rectangle(x, y, w, h, {
      chamfer: { radius: h / 2 - 0.5 }, // formato de pílula, igual ao visual
      restitution: 0.45, // quique perceptível ao bater
      friction: 0.35,
      frictionStatic: 0.6,
      frictionAir: 0.012,
      density: 0.0015,
      angle,
      sleepThreshold: 45,
    });

  const pieces: Piece[] = items.map((el, i) => {
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const x = w / 2 + (W - w) * ((i * 0.61 + 0.17) % 1);
    const y = -h - 10;
    const body = makeBody(w, h, x, y, (Math.random() - 0.5) * 0.5);
    Body.setVelocity(body, { x: (Math.random() - 0.5) * 3, y: 0 });
    Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.06);
    el.style.opacity = "0";
    return { el, w, h, body, spawn: 150 + i * 130, live: false };
  });

  const draw = () => {
    for (const p of pieces) {
      if (!p.live) continue;
      const { x, y } = p.body.position;
      p.el.style.transform = `translate3d(${x - p.w / 2}px, ${y - p.h / 2}px, 0) rotate(${p.body.angle}rad)`;
    }
  };

  let elapsed = 0;
  let drag: { piece: Piece; constraint: MatterNS.Constraint; id: number } | null = null;

  const update = () => {
    elapsed += STEP_MS;
    for (const p of pieces) {
      if (!p.live && elapsed >= p.spawn) {
        p.live = true;
        p.el.style.opacity = "";
        Composite.add(engine.world, p.body);
      }
    }
    Engine.update(engine, STEP_MS);
    // Peça arremessada para fora volta para dentro da faixa.
    for (const p of pieces) {
      const { x, y } = p.body.position;
      if (p.live && (y > H + 200 || x < -200 || x > W + 200)) {
        Body.setPosition(p.body, { x: Math.min(Math.max(x, p.w), W - p.w), y: -p.h });
        Body.setVelocity(p.body, { x: 0, y: 0 });
      }
    }
  };

  const settled = () => !drag && pieces.every((p) => p.live && p.body.isSleeping);

  let raf = 0;
  let last = 0;
  let acc = 0;
  let visible = true;

  const frame = (now: number) => {
    acc += Math.min(100, last ? now - last : STEP_MS);
    last = now;
    while (acc >= STEP_MS) {
      update();
      acc -= STEP_MS;
    }
    draw();
    if (settled() || !visible) {
      raf = 0;
      last = 0;
      acc = 0;
      return;
    }
    raf = requestAnimationFrame(frame);
  };
  const wake = () => {
    if (!raf && visible) raf = requestAnimationFrame(frame);
  };
  const wakeAll = () => {
    for (const p of pieces) Sleeping.set(p.body, false);
    wake();
  };

  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) wake();
  });
  io.observe(box);

  // Remede a faixa e as peças quando algo muda de tamanho (fonte carregada, rotação da tela).
  const ro = new ResizeObserver(() => {
    const nw = box.clientWidth;
    const nh = box.clientHeight;
    if (nw !== W || nh !== H) {
      W = nw;
      H = nh;
      Body.setPosition(floor, { x: W / 2, y: H + WALL / 2 });
      Body.setPosition(right, { x: W + WALL / 2, y: 0 });
    }
    for (const p of pieces) {
      const w = p.el.offsetWidth;
      const h = p.el.offsetHeight;
      if (w === p.w && h === p.h) continue;
      const { position, angle } = p.body;
      const body = makeBody(w, h, Math.min(Math.max(position.x, w / 2), W - w / 2), Math.min(position.y, H - h), angle);
      if (p.live) {
        Composite.remove(engine.world, p.body);
        Composite.add(engine.world, body);
      }
      Object.assign(p, { w, h, body });
    }
    wakeAll();
  });
  ro.observe(box);
  items.forEach((el) => ro.observe(el));

  const local = (e: PointerEvent) => {
    const r = box.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const onDown = (e: PointerEvent) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>("[data-word]");
    const piece = pieces.find((p) => p.el === el);
    if (!piece || !piece.live) return;
    const point = local(e);
    const { body } = piece;
    // Prende a peça no ponto exato do clique: ela gira e balança como objeto de verdade.
    const offset = Matter.Vector.rotate(Matter.Vector.sub(point, body.position), -body.angle);
    const constraint = Constraint.create({ bodyA: body, pointA: offset, pointB: point, stiffness: 0.25, damping: 0.1, length: 0 });
    Composite.add(engine.world, constraint);
    drag = { piece, constraint, id: e.pointerId };
    el!.setPointerCapture(e.pointerId);
    el!.dataset.dragging = "true";
    wakeAll();
  };
  const onMove = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.id) return;
    const p = local(e);
    drag.constraint.pointB = { x: Math.min(Math.max(p.x, 0), W), y: Math.min(p.y, H) };
    Sleeping.set(drag.piece.body, false);
  };
  const onUp = (e: PointerEvent) => {
    if (!drag || e.pointerId !== drag.id) return;
    Composite.remove(engine.world, drag.constraint);
    delete drag.piece.el.dataset.dragging;
    drag = null;
    wakeAll();
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
    Engine.clear(engine);
    delete box.dataset.live;
    items.forEach((el) => {
      el.style.transform = "";
      el.style.opacity = "";
    });
  };
}
