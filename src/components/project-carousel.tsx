"use client";

import Image from "next/image";
import Link from "next/link";
import { ViewTransition, useCallback, useEffect, useRef, useState } from "react";
import type { ProjectImage } from "@/content/projects";
import { RollText } from "./roll-text";

export type CarouselItem = {
  slug: string;
  name: string;
  category: string;
  description: string;
  image: ProjectImage;
  hasCase: boolean;
};

const SPEED = 36; // px por segundo
const DRAG_THRESHOLD = 6;

/**
 * Carrossel "Mais projetos".
 *
 * - Sem JS e com prefers-reduced-motion: lista com rolagem horizontal manual
 *   (setas, arrastar no touch, teclado) e nenhum clone.
 * - Com JS e movimento liberado: passa sozinho (marquee), em loop, com uma
 *   segunda cópia dos itens marcada aria-hidden + inert. Pausa no hover, no
 *   foco e pelo botão Pausar (WCAG 2.2.2). Setas e arrastar também funcionam.
 * - Produto abre o case resumido; marca abre um <dialog> com a imagem grande.
 */
export function ProjectCarousel({ items, labelledBy }: { items: CarouselItem[]; labelledBy: string }) {
  const [marquee, setMarquee] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [open, setOpen] = useState<CarouselItem | null>(null);

  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);

  const offset = useRef(0);
  const setWidth = useRef(0);
  const hover = useRef(false);
  const focused = useRef(false);
  const paused = useRef(false);
  const tween = useRef<{ from: number; to: number; t0: number; dur: number } | null>(null);
  const drag = useRef<{ x: number; start: number; id: number; moved: boolean } | null>(null);
  const suppressClick = useRef(false);

  useEffect(() => {
    paused.current = userPaused;
  }, [userPaused]);

  // Liga o modo marquee só quando o movimento é permitido.
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setMarquee(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const wrap = useCallback((x: number) => {
    const w = setWidth.current;
    if (!w) return x;
    while (x <= -w) x += w;
    while (x > 0) x -= w;
    return x;
  }, []);

  const apply = useCallback(() => {
    if (trackRef.current) trackRef.current.style.transform = `translate3d(${offset.current}px,0,0)`;
  }, []);

  // Laço de animação do marquee.
  useEffect(() => {
    if (!marquee) {
      if (trackRef.current) trackRef.current.style.transform = "";
      offset.current = 0;
      return;
    }
    const track = trackRef.current;
    if (!track) return;
    const measure = () => {
      const clone = track.querySelector<HTMLElement>("[data-clone]");
      const first = track.firstElementChild as HTMLElement | null;
      if (clone && first) setWidth.current = clone.offsetLeft - first.offsetLeft;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    let raf = 0;
    let last = performance.now();
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(track);

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (tween.current) {
        const { from, to, t0, dur } = tween.current;
        const k = Math.min(1, (now - t0) / dur);
        const e = 1 - Math.pow(1 - k, 4);
        offset.current = from + (to - from) * e;
        if (k >= 1) {
          offset.current = wrap(offset.current);
          tween.current = null;
        }
        apply();
      } else if (!drag.current && !hover.current && !focused.current && !paused.current && visible) {
        offset.current = wrap(offset.current - SPEED * dt);
        apply();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
    };
  }, [marquee, wrap, apply]);

  const stepWidth = () => {
    const first = trackRef.current?.firstElementChild as HTMLElement | null;
    return first ? first.getBoundingClientRect().width + 16 : 320;
  };

  const go = (dir: 1 | -1) => {
    if (marquee) {
      const from = offset.current;
      // Mantém o destino dentro de um ciclo para não "pular" no loop.
      let to = from - dir * stepWidth();
      if (to > 0) {
        offset.current = from - setWidth.current;
        to -= setWidth.current;
      }
      tween.current = { from: offset.current, to, t0: performance.now(), dur: 450 };
    } else {
      viewportRef.current?.scrollBy({ left: dir * stepWidth(), behavior: "smooth" });
    }
  };

  // Arrastar (mouse e touch) no modo marquee. No modo manual, a rolagem nativa resolve.
  const onPointerDown = (e: React.PointerEvent) => {
    if (!marquee || e.button !== 0) return;
    tween.current = null;
    drag.current = { x: e.clientX, start: offset.current, id: e.pointerId, moved: false };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.id) return;
    const dx = e.clientX - d.x;
    if (!d.moved && Math.abs(dx) > DRAG_THRESHOLD) {
      d.moved = true;
      viewportRef.current?.setPointerCapture(e.pointerId);
    }
    if (d.moved) {
      offset.current = wrap(d.start + dx);
      apply();
    }
  };
  const endDrag = (e: React.PointerEvent) => {
    const d = drag.current;
    if (!d || e.pointerId !== d.id) return;
    suppressClick.current = d.moved;
    drag.current = null;
  };
  const onClickCapture = (e: React.MouseEvent) => {
    if (suppressClick.current) {
      e.preventDefault();
      e.stopPropagation();
      suppressClick.current = false;
    }
  };

  // Item focado pelo teclado: traz para dentro da área visível.
  const onFocusIn = (e: React.FocusEvent) => {
    focused.current = true;
    if (!marquee) return;
    const vp = viewportRef.current;
    const li = (e.target as HTMLElement).closest("li");
    if (!vp || !li) return;
    const vr = vp.getBoundingClientRect();
    const r = li.getBoundingClientRect();
    if (r.left < vr.left || r.right > vr.right) {
      tween.current = null;
      offset.current = wrap(offset.current + (vr.left + 16 - r.left));
      apply();
    }
  };
  const onFocusOut = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) focused.current = false;
  };

  const openDialog = (item: CarouselItem, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    setOpen(item);
  };
  useEffect(() => {
    if (open) dialogRef.current?.showModal();
  }, [open]);
  const onDialogClose = () => {
    setOpen(null);
    triggerRef.current?.focus();
  };

  const renderItem = (item: CarouselItem, clone: boolean) => {
    const media = (
      <div aria-hidden="true" className="relative aspect-[4/3] overflow-hidden rounded-xl bg-surface">
        <Image
          src={item.image.src}
          alt={clone ? "" : item.image.alt}
          fill
          sizes="(min-width: 768px) 26rem, 80vw"
          loading="eager"
          draggable={false}
          className="object-cover"
        />
      </div>
    );
    const caption = (
      <span className="mt-3 flex items-baseline justify-between gap-3 text-left">
        <span className="text-body">
          <RollText>{item.name}</RollText>
        </span>
        <span className="label shrink-0">{item.category}</span>
      </span>
    );
    const cls = "zoom-on-hover block w-full rounded-xl text-left";
    if (item.hasCase) {
      return (
        <Link href={`/projetos/${item.slug}`} className={cls} draggable={false}>
          {clone ? media : (
            <ViewTransition name={`capa-${item.slug}`} share="morph" default="none">
              {media}
            </ViewTransition>
          )}
          {caption}
        </Link>
      );
    }
    return (
      <button
        type="button"
        className={cls}
        aria-haspopup="dialog"
        onClick={(e) => openDialog(item, e.currentTarget)}
      >
        {media}
        {caption}
        <span className="sr-only">: ver imagem ampliada</span>
      </button>
    );
  };

  return (
    <div
      role="region"
      aria-roledescription="carrossel"
      aria-labelledby={labelledBy}
      className="mt-8"
      onPointerEnter={(e) => e.pointerType === "mouse" && (hover.current = true)}
      onPointerLeave={() => (hover.current = false)}
      onFocus={onFocusIn}
      onBlur={onFocusOut}
    >
      <div className="mx-auto mb-5 flex max-w-[90rem] items-center justify-end gap-2 px-4 md:px-10">
        {marquee ? (
          <button
            type="button"
            onClick={() => setUserPaused((v) => !v)}
            aria-pressed={userPaused}
            className="btn-quiet mr-auto"
          >
            {userPaused ? "Reproduzir" : "Pausar"}
            <span className="sr-only"> a passagem automática</span>
          </button>
        ) : null}
        <button type="button" onClick={() => go(-1)} aria-label="Projeto anterior" className="btn-quiet !w-11 !px-0 justify-center">
          <span aria-hidden="true">←</span>
        </button>
        <button type="button" onClick={() => go(1)} aria-label="Próximo projeto" className="btn-quiet !w-11 !px-0 justify-center">
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <div
        ref={viewportRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onClickCapture={onClickCapture}
        className={
          marquee
            ? "cursor-grab overflow-hidden select-none active:cursor-grabbing"
            : "snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-px-4 pb-4 md:scroll-px-10"
        }
        style={marquee ? { touchAction: "pan-y" } : undefined}
      >
        <ul ref={trackRef} className="flex w-max gap-4 px-4 will-change-transform md:px-10">
          {items.map((it) => (
            <li key={it.slug} className="w-[min(80vw,26rem)] shrink-0 snap-start">
              {renderItem(it, false)}
            </li>
          ))}
          {marquee
            ? items.map((it, i) => (
                <li key={`${it.slug}-clone`} data-clone={i === 0 ? "" : undefined} aria-hidden="true" inert className="w-[min(80vw,26rem)] shrink-0">
                  {renderItem(it, true)}
                </li>
              ))
            : null}
        </ul>
      </div>

      <dialog
        ref={dialogRef}
        onClose={onDialogClose}
        onClick={(e) => e.target === dialogRef.current && dialogRef.current?.close()}
        aria-labelledby="projeto-dialogo-titulo"
        className="m-auto w-[min(92vw,72rem)] max-w-none rounded-2xl bg-bg p-0 text-ink backdrop:bg-black/70"
      >
        {open ? (
          <div className="p-4 md:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 id="projeto-dialogo-titulo" className="font-display text-head font-medium uppercase tracking-tight">
                  {open.name}
                </h4>
                <p className="label mt-1">{open.category}</p>
              </div>
              <button type="button" onClick={() => dialogRef.current?.close()} className="btn-quiet shrink-0">
                Fechar
              </button>
            </div>
            <div className="relative mt-5 aspect-video overflow-hidden rounded-xl bg-surface">
              <Image src={open.image.src} alt={open.image.alt} fill sizes="(min-width: 1200px) 72rem, 92vw" className="object-contain" />
            </div>
            <p className="mt-4 max-w-[60ch] text-body">{open.description}</p>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
