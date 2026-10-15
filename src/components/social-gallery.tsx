"use client";

import Image from "next/image";
import { useState } from "react";
import { socialItems } from "@/content/social";
import { Lightbox } from "./lightbox";

/** Mosaico (colunas CSS) de pranchas; cada uma abre o lightbox em carrossel. */
export function SocialGallery() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <>
      <ul className="columns-2 gap-3 md:columns-3 md:gap-4 xl:columns-4">
        {socialItems.map((it, i) => (
          <li key={it.src} className="mb-3 break-inside-avoid md:mb-4">
            <button
              type="button"
              onClick={() => setOpen(i)}
              aria-haspopup="dialog"
              className="zoom-on-hover group block w-full overflow-hidden rounded-xl bg-surface text-left"
            >
              <span className="block overflow-hidden">
                <Image
                  src={it.thumb}
                  alt=""
                  width={it.thumbWidth}
                  height={it.thumbHeight}
                  sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw"
                  loading="eager"
                  className="h-auto w-full"
                />
              </span>
              <span className="flex flex-col gap-0.5 px-3 py-2.5">
                <span className="text-[0.9375rem] leading-snug">{it.title}</span>
                <span className="label">{it.kind}</span>
              </span>
              <span className="sr-only">: ver em tela cheia</span>
            </button>
          </li>
        ))}
      </ul>
      {open !== null ? (
        <Lightbox images={socialItems} start={open} onClose={() => setOpen(null)} label="Social media e web design" />
      ) : null}
    </>
  );
}
