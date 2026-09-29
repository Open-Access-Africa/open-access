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
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

const topology = countries110m as unknown as Topology<{ countries: GeometryCollection }>;
const land = feature(topology, topology.objects.countries).features;

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export function HomeGlobe({ points }: { points: GlobePoint[] }) {
  const router = useRouter();
  const wrapRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [size, setSize] = useState(0);

  const material = useMemo(
    () => new MeshBasicMaterial({ color: "#e8f3f4", transparent: true, opacity: 0.9 }),
    [],
  );

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize(Math.round(e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const onReady = () => {
    const g = globeRef.current;
    if (!g) return;
    g.pointOfView({ lat: 4, lng: 16, altitude: 2.1 }, 0);
    const controls = g.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.35;
    controls.enableZoom = true;
    controls.minDistance = 180;
    controls.maxDistance = 500;
  };

  return (
    <div ref={wrapRef} className="relative mx-auto aspect-square w-full max-w-[860px]">
      {size > 0 && (
        <Globe
          ref={globeRef}
          width={size}
          height={size}
          backgroundColor="rgba(0,0,0,0)"
          globeMaterial={material}
          showAtmosphere
          atmosphereColor="#7fd3cf"
          atmosphereAltitude={0.14}
          hexPolygonsData={land}
          hexPolygonResolution={3}
          hexPolygonMargin={0.4}
          hexPolygonUseDots
          hexPolygonColor={() => "rgba(30,127,131,0.78)"}
          pointsData={points}
          pointLat="lat"
          pointLng="lng"
          pointColor={() => "#0e1b2c"}
          pointAltitude={0.02}
          pointRadius={0.55}
          pointsMerge={false}
          pointLabel={(d: object) => {
            const p = d as GlobePoint;
            return `<div style="font-family:'IBM Plex Mono',monospace;font-size:12px;letter-spacing:1px;background:#0e1b2c;color:#fff;padding:6px 9px">${escapeHtml(p.label.toUpperCase())}<br><span style="color:#7fd3cf">${escapeHtml(p.sublabel)}</span></div>`;
          }}
          onPointClick={(d: object) => router.push((d as GlobePoint).href)}
          onGlobeReady={onReady}
        />
      )}
    </div>
  );
}
