"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import {
  CanvasTexture,
  Group,
  Mesh,
  MeshBasicMaterial,
  SphereGeometry,
  Sprite,
  SpriteMaterial,
  TOUCH,
  type Object3D,
} from "three";
import { feature } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import countries110m from "world-atlas/countries-110m.json";
import type { GlobeMethods } from "react-globe.gl";
import { MARKERS, isColonialLaw, isReparation, type GlobePoint } from "@/lib/globe-points";

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

function pinLabel(p: GlobePoint) {
  return `<div style="font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:1px;background:#0e1b2c;color:#fff;padding:6px 9px">${escapeHtml(p.label.toUpperCase())}<br><span style="color:#7fd3cf">${escapeHtml(p.sublabel)}</span></div>`;
}

// Marker sizes. Globe radius is 100 units; point radii are in degrees.
const REPARATION_RADIUS = 0.75; // green circle
const LAW_CORE_RADIUS = 0.42; // yellow pin, in globe units (about half the green circle)
const LAW_GLOW_SIZE = 3.4; // width of the glow around a yellow pin
const LAW_GLOW_SIZE_FOCUSED = 5.6; // glow around the pin a track button spun to

/** Soft round glow, drawn once and shared by every colonial-law pin. */
function makeGlowTexture() {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, `rgba(${MARKERS.colonialLaw.glow},0.95)`);
  g.addColorStop(0.35, `rgba(${MARKERS.colonialLaw.glow},0.45)`);
  g.addColorStop(1, `rgba(${MARKERS.colonialLaw.glow},0)`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new CanvasTexture(canvas);
}

/** Small stagger so the reparation pings do not all pulse in step. */
function pingPeriod(p: GlobePoint) {
  let h = 0;
  for (const c of p.label) h = (h * 31 + c.charCodeAt(0)) % 997;
  return 1500 + (h % 600);
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
  /** The pin a track button spun to, if any: a reparation pin pings wider, a law pin glows brighter. */
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
  const [ready, setReady] = useState(false);

  const material = useMemo(
    () => new MeshBasicMaterial({ color: "#e8f3f4", transparent: true, opacity: 0.9 }),
    [],
  );

  // Reparations Cases and the other modern tracks are drawn as points; Colonial Laws as glowing pins.
  const flatPoints = useMemo(() => points.filter((p) => !isColonialLaw(p)), [points]);
  const lawPins = useMemo(() => points.filter(isColonialLaw), [points]);
  const pings = useMemo(() => points.filter(isReparation), [points]);

  // Shared three.js parts for the colonial-law pins. Built in the browser only (the canvas needs `document`).
  const lawParts = useRef<{ core: SphereGeometry; coreMaterial: MeshBasicMaterial; glow: SpriteMaterial } | null>(null);
  const lawObject = (d: object): Object3D => {
    if (!lawParts.current) {
      lawParts.current = {
        core: new SphereGeometry(LAW_CORE_RADIUS, 16, 12),
        coreMaterial: new MeshBasicMaterial({ color: MARKERS.colonialLaw.color }),
        glow: new SpriteMaterial({ map: makeGlowTexture(), transparent: true, depthWrite: false }),
      };
    }
    const { core, coreMaterial, glow } = lawParts.current;
    const group = new Group();
    const halo = new Sprite(glow);
    const size = d === pulse ? LAW_GLOW_SIZE_FOCUSED : LAW_GLOW_SIZE;
    halo.scale.set(size, size, 1);
    group.add(halo);
    group.add(new Mesh(core, coreMaterial));
    return group;
  };

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
  // The zoom eases towards its target over a few frames instead of jumping on every wheel event.
  const targetAltitude = useRef<number | null>(null);
  useEffect(() => {
    const el = scrollArea?.current ?? wrapRef.current;
    if (!el) return;
    let frame = 0;
    const ease = () => {
      const g = globeRef.current;
      const target = targetAltitude.current;
      if (!g || target === null) return;
      const pov = g.pointOfView();
      const altitude = pov.altitude + (target - pov.altitude) * 0.25;
      g.pointOfView({ ...pov, altitude }, 0);
      if (Math.abs(target - altitude) > 0.002) frame = requestAnimationFrame(ease);
      else targetAltitude.current = null;
    };
    const onWheel = (e: WheelEvent) => {
      const g = globeRef.current;
      if (!g || e.ctrlKey) return; // ctrl + wheel is the browser's own zoom
      const rect = el.getBoundingClientRect();
      const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0);
      if (visible / rect.height < 0.85) return; // globe not filling the screen: just scroll the page

      const current = targetAltitude.current ?? g.pointOfView().altitude;
      const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
      const zoomingIn = delta > 0;
      const atLimit = zoomingIn
        ? current <= MIN_ALTITUDE + 0.005
        : current >= maxAltitude.current - 0.005;
      if (atLimit) return; // let the page scroll

      e.preventDefault();
      targetAltitude.current = Math.min(
        maxAltitude.current,
        Math.max(MIN_ALTITUDE, current * Math.exp(-delta * 0.0015)),
      );
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(ease);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      cancelAnimationFrame(frame);
    };
  }, [scrollArea]);

  // Stop drawing the globe while it is scrolled out of view, so the rest of the page scrolls smoothly.
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      const g = globeRef.current;
      if (!g) return;
      if (e.isIntersecting) g.resumeAnimation();
      else g.pauseAnimation();
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

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
    // Retina screens would draw the full-screen globe at 4x the pixels; 1.5x looks the same and is far lighter.
    g.renderer().setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    setReady(true);

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
      {/* Soft placeholder shown while the globe loads; the globe fades in over it. */}
      <div
        aria-hidden
        className={`absolute top-1/2 left-1/2 aspect-square h-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_45%_40%,#eef6f7,#dcecee_70%,#cfe5e7)] shadow-[0_0_80px_30px_rgba(127,211,207,0.25)] transition-opacity duration-700 ${
          ready ? "opacity-0" : "animate-pulse"
        }`}
      />
      {size.w > 0 && (
        <div className={`h-full w-full transition-opacity duration-700 ${ready ? "opacity-100" : "opacity-0"}`}>
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
            hexPolygonResolution={3} // dot density: 3 loads fast; 4 is finer but has ~7x the dots and loads slowly
            hexPolygonMargin={0.3} // gap around each dot
            hexPolygonUseDots //dot color and transparency
            hexPolygonColor={() => "rgb(159, 218, 212)"}
            // Reparations Cases: flat green circles. Other modern tracks keep the magenta marker for now.
            pointsData={flatPoints}
            pointLat="lat"
            pointLng="lng"
            pointColor={(d: object) => (isReparation(d as GlobePoint) ? MARKERS.reparation.color : MARKERS.other.color)}
            pointAltitude={0.004}
            pointRadius={REPARATION_RADIUS}
            pointResolution={32}
            pointsMerge={false}
            pointLabel={(d: object) => pinLabel(d as GlobePoint)}
            onPointClick={(d: object) => router.push((d as GlobePoint).href)}
            // Colonial Laws: smaller yellow pins with a soft, steady glow.
            objectsData={lawPins}
            objectLat="lat"
            objectLng="lng"
            objectAltitude={0.005}
            objectThreeObject={lawObject}
            objectLabel={(d: object) => pinLabel(d as GlobePoint)}
            onObjectClick={(d: object) => router.push((d as GlobePoint).href)}
            // Only Reparations Cases ping. The pin a track button spun to pings wider.
            ringsData={pings}
            ringLat="lat"
            ringLng="lng"
            ringColor={() => (t: number) => `rgba(${MARKERS.reparation.ping},${0.9 * (1 - t)})`}
            ringMaxRadius={(d: object) => (d === pulse ? 4.5 : 2.6)}
            ringPropagationSpeed={2}
            ringRepeatPeriod={(d: object) => pingPeriod(d as GlobePoint)}
            ringAltitude={0.005}
            onGlobeReady={() => onReady()}
          />
        </div>
      )}
    </div>
  );
}
