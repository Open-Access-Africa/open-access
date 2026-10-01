"use client";

import Link from "next/link";
import { useState } from "react";

type Prompt = { track: string; prompt?: string; tint: string };

// The "Where would you like to start?" box that floats over the globe.
// Clicking a track opens the archive; the × hides the box so the globe can be explored.
export function StartPanel({ prompts }: { prompts: Prompt[] }) {
  const [state, setState] = useState<"open" | "closing" | "closed">("open");

  if (state === "closed") {
    return (
      <button
        type="button"
        onClick={() => setState("open")}
        className="absolute bottom-12 left-1/2 z-10 -translate-x-1/2 rounded-full border border-line bg-white/95 px-5 py-2.5 font-mono text-xs tracking-[0.2em] text-ink uppercase shadow-[0_8px_24px_rgba(14,27,44,0.12)] hover:border-ink"
      >
        Where would you like to start?
      </button>
    );
  }

  return (
    <div
      onTransitionEnd={() => state === "closing" && setState("closed")}
      className={`absolute top-1/2 left-1/2 z-10 w-[min(92%,560px)] -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${
        state === "closing" ? "pointer-events-none scale-95 opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative flex flex-col items-center gap-4 rounded-2xl border border-line bg-white/95 p-7 text-center shadow-[0_20px_60px_rgba(14,27,44,0.16)] backdrop-blur-sm sm:p-9">
        <button
          type="button"
          onClick={() => setState("closing")}
          aria-label="Close and explore the globe"
          className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full text-xl text-muted hover:bg-paper hover:text-ink"
        >
          ×
        </button>
        <span aria-hidden className="flex h-13 w-13 items-center justify-center rounded-full bg-[#d5e6e8]">
          <span className="h-4.5 w-4.5 rounded-full bg-ink" />
        </span>
        <h2 id="globe-heading" className="text-2xl font-semibold">
          Where would you like to start?
        </h2>
        <ul className="mt-2 grid w-full gap-3 text-left sm:grid-cols-2">
          {prompts.map((p) => (
            <li key={p.track}>
              <Link
                href="/archive"
                onClick={() => setState("closing")}
                className={`flex h-full justify-between gap-3 rounded-2xl border px-4 py-3.5 text-[15px] leading-snug hover:border-ink ${p.tint}`}
              >
                <span>
                  <strong className="font-semibold">{p.track}</strong>
                  {p.prompt && (
                    <>
                      <br />
                      {p.prompt}
                    </>
                  )}
                </span>
                <span aria-hidden>↑</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
