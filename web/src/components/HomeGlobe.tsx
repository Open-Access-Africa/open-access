"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { MeshBasicMaterial, TOUCH } from "three";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import countries110m from "world-atlas/countries-110m.json";
import type { GlobeMethods } from "react-globe.gl";
import type { GlobePoint } from "@/lib/globe-points";

// three.js needs the browser, so the globe is never rendered on the server.
const Globe = dynamic(() => import("@/components/GlobeCanvas"), { ssr: false });

const topology = countries110m as unknown as Topology<{ countries: GeometryCollection }>;
// The dot layout fails on a few outlines in the map data and then skips every country after them:
// zero-size pieces (North Korea has one made of a single repeated point) and, at the finer
// resolution, Antarctica. Drop those so every other country is drawn.
type Ring = number[][];
const hasArea = (ring: Ring) => new Set(ring.map((p) => p.join(","))).size >= 3;
const land = feature(topology, topology.objects.countries).features
  .filter((f) => (f.properties as { name?: string } | null)?.name !== "Antarctica")
  .map((f) => {
    const g = f.geometry as { type: string; coordinates: Ring[][] } | null;
    if (g?.type !== "MultiPolygon") return f;
    return { ...f, geometry: { ...g, coordinates: g.coordinates.filter((poly) => hasArea(poly[0])) } };
  });

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

// Opening view of the globe. Lower VIEW_ALTITUDE to zoom in, raise it to zoom out.
const VIEW_LAT = 38;
const VIEW_LNG = 8;
const VIEW_ALTITUDE = 1.5;
const VIEW_ALTITUDE_PHONE = 2.3; // used when the screen is taller than it is wide
// Closest the scroll wheel can zoom in. Once reached, scrolling moves on down the page.
const MIN_ALTITUDE = 0.8;
// How close the globe comes when it spins to a pin.
const FOCUS_ALTITUDE = 1.1;

/** Controls the start box and focus card use to move the globe. */
export type GlobeApi = {
  /** Centre of the current view. */
  view: () => { lat: number; lng: number; altitude: number };
  /** Spin to a place. */
  flyTo: (lat: number, lng: number) => void;
  /** Zoom one step in (+1) or out (-1). */
  zoomStep: (direction: 1 | -1) => void;
};

type Props = {
  points: GlobePoint[];
  /** The pin to mark with a ripple, if any. */
  pulse?: GlobePoint | null;
  onApi?: (api: GlobeApi) => void;
  /** Area whose scroll-wheel events zoom the globe (defaults to the globe itself). */
  scrollArea?: RefObject<HTMLElement | null>;
};

export function HomeGlobe({ points, pulse, onApi, scrollArea }: Props) {
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const maxAltitude = useRef(VIEW_ALTITUDE);

  const material = useMemo(
    () => new MeshBasicMaterial({ color: "#e8f3f4", transparent: true, opacity: 0.9 }),
    [],
  );

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) =>
      setSize({ w: Math.round(e.contentRect.width), h: Math.round(e.contentRect.height) }),
    );
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Scroll wheel: while the globe fills the screen, scrolling zooms it. When the zoom reaches its
  // limit (in or out), the scroll goes back to the page, so visitors can carry on to the footer.
  useEffect(() => {
    const el = scrollArea?.current ?? wrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const g = globeRef.current;
      if (!g || e.ctrlKey) return; // ctrl + wheel is the browser's own zoom
      const rect = el.getBoundingClientRect();
      const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      if (visible / rect.height < 0.85) return; // globe not filling the screen: just scroll the page

      const pov = g.pointOfView();
      const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      const zoomingIn = delta > 0;
      const atLimit = zoomingIn
        ? pov.altitude <= MIN_ALTITUDE + 0.005
        : pov.altitude >= maxAltitude.current - 0.005;
      if (atLimit) return; // let the page scroll

      e.preventDefault();
      // Line the globe up with the top of the screen while zooming.
      if (Math.abs(rect.top) > 2) window.scrollBy({ top: rect.top, behavior: "instant" as ScrollBehavior });
      const altitude = Math.min(
        maxAltitude.current,
        Math.max(MIN_ALTITUDE, pov.altitude * Math.exp(-delta * 0.0015)),
      );
      g.pointOfView({ ...pov, altitude }, 0);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [scrollArea]);

  const onReady = (tries = 0) => {
    const g = globeRef.current;
    // The globe can report "ready" a moment before it can be controlled, so try again briefly.
    if (!g) {
      if (tries < 30) requestAnimationFrame(() => onReady(tries + 1));
      return;
    }
    // Opening view: centred between Ghana and Norway, close enough that both fill the frame.
    const altitude = size.w < size.h ? VIEW_ALTITUDE_PHONE : VIEW_ALTITUDE;
    maxAltitude.current = altitude;
    g.pointOfView({ lat: VIEW_LAT, lng: VIEW_LNG, altitude }, 0);

    const controls = g.controls();
    controls.autoRotate = false; // true makes the globe spin slowly on its own
    controls.autoRotateSpeed = 0.35;
    // The scroll wheel is handled above. On touch screens, one finger scrolls the page and
    // two fingers rotate and zoom the globe, so the globe never traps the page.
    const touch = window.matchMedia("(pointer: coarse)").matches;
    controls.enableZoom = touch;
    controls.minDistance = 100 * (1 + MIN_ALTITUDE);
    controls.maxDistance = 100 * (1 + altitude);
    if (touch) {
      controls.touches = { ONE: -1 as TOUCH, TWO: TOUCH.DOLLY_ROTATE };
      g.renderer().domElement.style.touchAction = "pan-y";
    }

    onApi?.({
      view: () => g.pointOfView(),
      flyTo: (lat, lng) =>
        g.pointOfView({ lat, lng, altitude: Math.min(g.pointOfView().altitude, FOCUS_ALTITUDE) }, 1600),
      zoomStep: (direction) => {
        const pov = g.pointOfView();
        const altitude = Math.min(
          maxAltitude.current,
          Math.max(MIN_ALTITUDE, pov.altitude * (direction === 1 ? 0.7 : 1 / 0.7)),
        );
        g.pointOfView({ ...pov, altitude }, 400);
      },
    });
  };

  return (
    <div ref={wrapRef} className="relative h-full w-full">
      {size.w > 0 && (
        <Globe
          globeRef={globeRef}
          width={size.w}
          height={size.h}
          backgroundColor="rgba(0,0,0,0)"
          globeMaterial={material}
          showAtmosphere
          atmosphereColor="#7fd3cf"
          atmosphereAltitude={0.25}
          hexPolygonsData={land}
          hexPolygonResolution={4} //finer dots
          hexPolygonMargin={0.4} // gap around each dot
          hexPolygonUseDots //dot color and transparency
          hexPolygonColor={() => "rgb(159, 218, 212)"}
          pointsData={points}
          pointLat="lat"
          pointLng="lng"
          pointColor={() => "#ec20fd"} //color of published entry markers
          pointAltitude={0.02}
          pointRadius={0.77}
          pointsMerge={false}
          pointLabel={(d: object) => {
            const p = d as GlobePoint;
            return `<div style="font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:1px;background:#0e1b2c;color:#fff;padding:6px 9px">${escapeHtml(p.label.toUpperCase())}<br><span style="color:#7fd3cf">${escapeHtml(p.sublabel)}</span></div>`;
          }}
          onPointClick={(d: object) => router.push((d as GlobePoint).href)}
          // Ripple around the pin a track button spun to, like a location ping on a map.
          ringsData={pulse ? [pulse] : []}
          ringLat="lat"
          ringLng="lng"
          ringColor={() => (t: number) => `rgba(236,32,253,${1 - t})`}
          ringMaxRadius={4}
          ringPropagationSpeed={2.5}
          ringRepeatPeriod={1100}
          ringAltitude={0.021}
          onGlobeReady={() => onReady()}
        />
      )}
    </div>
  );
}
