"use client";

import { useEffect } from "react";

export type StartTrack = { track: string; slug: string; prompt?: string; tint: string; count: number };

type Props = {
  tracks: StartTrack[];
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
  /** A track was chosen: the globe spins to its nearest pin. */
  onPick: (slug: string) => void;
};

// The "Where would you like to start?" box that floats over the globe.
export function StartPanel({ tracks, open, onOpen, onClose, onPick }: Props) {
  // Escape closes the box.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className="absolute bottom-24 left-1/2 z-10 -translate-x-1/2 rounded-full border border-line bg-white/95 px-5 py-2.5 font-mono text-xs tracking-[0.2em] text-ink uppercase shadow-[0_8px_24px_rgba(14,27,44,0.12)] hover:border-ink"
      >
        Where would you like to start?
      </button>
    );
  }

  return (
    <div className="start-panel absolute top-1/2 left-1/2 z-10 w-[min(92%,560px)] -translate-x-1/2 -translate-y-1/2">
      <div className="relative flex flex-col items-center gap-4 rounded-2xl border border-line bg-white/95 p-7 text-center shadow-[0_20px_60px_rgba(14,27,44,0.16)] backdrop-blur-sm sm:p-9">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close and explore the globe"
          className="absolute top-3 right-3 flex h-10 w-10 items-center justify-center rounded-full text-xl text-muted hover:bg-paper hover:text-ink"
        >
          ×
        </button>
        {/* Location ping: the pale outer circle grows and fades; the dark centre stays still. */}
        <span aria-hidden className="relative flex h-13 w-13 items-center justify-center">
          <span className="gps-ping absolute inset-0 rounded-full bg-[#d5e6e8]" />
          <span className="relative h-4.5 w-4.5 rounded-full bg-ink" />
        </span>
        <h2 id="globe-heading" className="text-2xl font-semibold">
          Where would you like to start?
        </h2>
        <ul className="mt-2 grid w-full gap-3 text-left sm:grid-cols-2">
          {tracks.map((t) => {
            const empty = t.count === 0;
            return (
              <li key={t.slug}>
                <button
                  type="button"
                  disabled={empty}
                  onClick={() => onPick(t.slug)}
                  className={`flex h-full w-full justify-between gap-3 rounded-2xl border px-4 py-3.5 text-left text-[15px] leading-snug ${t.tint} ${
                    empty ? "cursor-not-allowed opacity-55" : "hover:border-ink"
                  }`}
                >
                  <span>
                    <strong className="font-semibold">{t.track}</strong>
                    {t.prompt && (
                      <>
                        <br />
                        {t.prompt}
                      </>
                    )}
                    <span className="mt-0.5 block font-mono text-[11px] tracking-[0.14em] text-muted uppercase">
                      {empty ? "None published yet" : `${t.count} on the map`}
                    </span>
                  </span>
                  {!empty && <span aria-hidden>↑</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
