"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { MeshBasicMaterial } from "three";
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

export function HomeGlobe({ points }: { points: GlobePoint[] }) {
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [size, setSize] = useState({ w: 0, h: 0 });

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

  const onReady = (tries = 0) => {
    const g = globeRef.current;
    // The globe can report "ready" a moment before it can be controlled, so try again briefly.
    if (!g) {
      if (tries < 30) requestAnimationFrame(() => onReady(tries + 1));
      return;
    }
    // Opening view: centred between Ghana and Norway, close enough that both fill the frame.
    const altitude = size.w < size.h ? VIEW_ALTITUDE_PHONE : VIEW_ALTITUDE;
    g.pointOfView({ lat: VIEW_LAT, lng: VIEW_LNG, altitude }, 0);
    const controls = g.controls();
    controls.autoRotate = false; // true makes the globe spin slowly on its own
    controls.autoRotateSpeed = 0.35;
    controls.enableZoom = true;
    controls.minDistance = 140;
    controls.maxDistance = 500;
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
          onGlobeReady={() => onReady()}
        />
      )}
    </div>
  );
}
