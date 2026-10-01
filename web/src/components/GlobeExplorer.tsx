"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import { GlobeKey } from "@/components/GlobeKey";
import { HomeGlobe, type GlobeApi } from "@/components/HomeGlobe";
import { StartPanel } from "@/components/StartPanel";
import type { GlobePoint } from "@/lib/globe-points";

type TrackPrompt = { track: string; slug: string; prompt?: string; tint: string };

type Props = {
  points: GlobePoint[];
  trackPrompts: TrackPrompt[];
  caption: string;
};

/** Distance in km between two places on the globe. */
function distanceKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const r = Math.PI / 180;
  const h =
    Math.sin(((b.lat - a.lat) * r) / 2) ** 2 +
    Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(((b.lng - a.lng) * r) / 2) ** 2;
  return 12742 * Math.asin(Math.sqrt(h));
}

// The full-screen globe with the start box over it. Choosing a track spins the globe to that
// track's nearest pin and shows a card for it.
export function GlobeExplorer({ points, trackPrompts, caption }: Props) {
  const areaRef = useRef<HTMLDivElement>(null);
  const api = useRef<GlobeApi | null>(null);
  const [panelOpen, setPanelOpen] = useState(true);
  // Set once the visitor drags, scrolls or taps the globe itself.
  const [navigating, setNavigating] = useState(false);
  // Pins of the chosen track, nearest first, and which one is showing.
  const [focus, setFocus] = useState<{ track: string; pins: GlobePoint[]; index: number } | null>(null);

  const tracks = useMemo(
    () => trackPrompts.map((t) => ({ ...t, count: points.filter((p) => p.track === t.slug).length })),
    [trackPrompts, points],
  );

  const pick = useCallback(
    (slug: string) => {
      const here = api.current?.view() ?? { lat: 0, lng: 0 };
      const pins = points
        .filter((p) => p.track === slug)
        .sort((a, b) => distanceKm(here, a) - distanceKm(here, b));
      if (pins.length === 0) return;
      setPanelOpen(false);
      setFocus({ track: trackPrompts.find((t) => t.slug === slug)?.track ?? "", pins, index: 0 });
      api.current?.flyTo(pins[0].lat, pins[0].lng);
    },
    [points, trackPrompts],
  );

  const next = () => {
    if (!focus) return;
    const index = (focus.index + 1) % focus.pins.length;
    setFocus({ ...focus, index });
    api.current?.flyTo(focus.pins[index].lat, focus.pins[index].lng);
  };

  const backToTracks = () => {
    setFocus(null);
    setPanelOpen(true);
  };

  const closePanel = useCallback(() => setPanelOpen(false), []);
  const pin = focus?.pins[focus.index] ?? null;

  return (
    <div ref={areaRef} className="relative h-svh min-h-[560px] w-full">
      <div
        className="globe-mist h-full w-full"
        onPointerDown={() => setNavigating(true)}
        onWheel={() => setNavigating(true)}
      >
        <HomeGlobe points={points} pulse={pin} onApi={(a) => (api.current = a)} scrollArea={areaRef} />
      </div>
      <div aria-hidden className="globe-haze pointer-events-none absolute inset-0" />

      {!focus && (
        <StartPanel
          tracks={tracks}
          open={panelOpen}
          onOpen={() => setPanelOpen(true)}
          onClose={closePanel}
          onPick={pick}
        />
      )}

      {/* Card for the pin a track spun to */}
      {pin && focus && (
        <div
          className="start-panel absolute bottom-24 left-1/2 z-10 w-[min(92%,440px)] -translate-x-1/2 rounded-2xl border border-line bg-white/95 p-5 shadow-[0_20px_60px_rgba(14,27,44,0.16)] backdrop-blur-sm"
          aria-live="polite"
        >
          <p className="font-mono text-[11px] tracking-[0.16em] text-gold-deep uppercase">
            {focus.track} · {focus.index + 1} of {focus.pins.length}
          </p>
          <p className="mt-1.5 font-display text-lg leading-tight font-bold tracking-wide">{pin.label}</p>
          <p className="mt-1 text-sm text-muted">{pin.sublabel}</p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <Link
              href={pin.href}
              className="inline-flex min-h-10 items-center rounded-full bg-ink px-4 text-sm font-semibold text-white hover:bg-ink/90"
            >
              Open case file →
            </Link>
            {focus.pins.length > 1 && (
              <button
                type="button"
                onClick={next}
                className="inline-flex min-h-10 items-center rounded-full border border-line px-4 text-sm font-semibold hover:border-ink"
              >
                Next pin
              </button>
            )}
            <button
              type="button"
              onClick={backToTracks}
              className="inline-flex min-h-10 items-center rounded-full px-3 text-sm text-muted hover:text-ink"
            >
              ← All tracks
            </button>
          </div>
        </div>
      )}

      {/* Zoom buttons, for anyone without a scroll wheel or touchscreen */}
      <div className="absolute right-4 bottom-24 z-10 hidden flex-col overflow-hidden rounded-xl border border-line bg-white/95 shadow-[0_8px_24px_rgba(14,27,44,0.10)] sm:flex">
        <button
          type="button"
          aria-label="Zoom in"
          onClick={() => api.current?.zoomStep(1)}
          className="flex h-10 w-10 items-center justify-center text-lg hover:bg-paper"
        >
          +
        </button>
        <button
          type="button"
          aria-label="Zoom out"
          onClick={() => api.current?.zoomStep(-1)}
          className="flex h-10 w-10 items-center justify-center border-t border-line text-lg hover:bg-paper"
        >
          −
        </button>
      </div>

      {/* Map key, once the start box is closed or the visitor is moving the globe, above the caption */}
      <div className="pointer-events-none absolute right-0 bottom-3 left-0 z-10 flex flex-col items-center gap-2 px-4">
        {(!panelOpen || navigating) && (
          <div className="pointer-events-auto">
            <GlobeKey />
          </div>
        )}
        <p className="text-center font-mono text-xs tracking-[0.2em] text-[#5a6b78] uppercase">{caption}</p>
      </div>
    </div>
  );
}
