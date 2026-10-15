"use client";

import Image from "next/image";
import { useState } from "react";
import type { GalleryImage } from "@/content/brand-cases";
import { Lightbox } from "./lightbox";

type Tile = GalleryImage & { title: string; description: string };

/** Marcas sem manual: tiles 16:9 que abrem o lightbox. */
export function BrandTiles({ items }: { items: Tile[] }) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {items.map((t, i) => (
          <li key={t.src}>
            <button type="button" onClick={() => setOpen(i)} aria-haspopup="dialog" className="zoom-on-hover block w-full text-left">
              <span className="relative block aspect-video overflow-hidden rounded-xl bg-surface">
                <Image src={t.src} alt="" fill sizes="(min-width: 640px) 30vw, 100vw" loading="eager" className="object-cover" />
              </span>
              <span className="mt-3 block text-body">{t.title}</span>
              <span className="block text-[0.875rem] text-muted">{t.description}</span>
              <span className="sr-only">: ver imagem ampliada</span>
            </button>
          </li>
        ))}
      </ul>
      {open !== null ? (
        <Lightbox
          images={items.map((t) => ({ ...t, alt: `${t.title}: ${t.alt}` }))}
          start={open}
          onClose={() => setOpen(null)}
          label="Outras marcas"
        />
      ) : null}
    </>
  );
}
