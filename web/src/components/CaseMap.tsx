"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import * as maplibregl from "maplibre-gl";
import { useEffect, useRef } from "react";
import { feature, mesh } from "topojson-client";
import type { Topology, GeometryCollection } from "topojson-specification";
import countries50m from "world-atlas/countries-50m.json";

export type MapPoint = { lat: number; lng: number; label: string; main?: boolean; exact?: boolean };

// Load MapLibre's worker from /public (copied there on npm install).
maplibregl.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");

const topology = countries50m as unknown as Topology<{ countries: GeometryCollection }>;
const land = feature(topology, topology.objects.countries);
const borders = mesh(topology, topology.objects.countries, (a, b) => a !== b);

/*
  Dark navy case-file map. The basemap is drawn from Natural Earth country shapes
  (public domain) bundled with the site, so no tile service or API key is needed.
*/
export function CaseMap({ points }: { points: MapPoint[] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current || points.length === 0) return;

    const data: GeoJSON.FeatureCollection = {
      type: "FeatureCollection",
      features: points.map((p) => ({
        type: "Feature",
        properties: { label: p.label.toUpperCase(), main: p.main ? 1 : 0 },
        geometry: { type: "Point", coordinates: [p.lng, p.lat] },
      })),
    };

    const map = new maplibregl.Map({
      container: ref.current,
      attributionControl: { compact: true, customAttribution: "Natural Earth" },
      style: {
        version: 8,
        glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
        sources: {
          land: { type: "geojson", data: land },
          borders: { type: "geojson", data: borders },
          points: { type: "geojson", data },
        },
        layers: [
          { id: "bg", type: "background", paint: { "background-color": "#081326" } },
          { id: "land", type: "fill", source: "land", paint: { "fill-color": "#16294a" } },
          { id: "borders", type: "line", source: "borders", paint: { "line-color": "#2c4468", "line-width": 0.8 } },
          {
            id: "glow",
            type: "circle",
            source: "points",
            paint: {
              "circle-radius": ["case", ["==", ["get", "main"], 1], 26, 18],
              "circle-color": ["case", ["==", ["get", "main"], 1], "#f2c96e", "#9fe3e0"],
              "circle-opacity": 0.28,
              "circle-blur": 1,
            },
          },
          {
            id: "dot",
            type: "circle",
            source: "points",
            paint: {
              "circle-radius": ["case", ["==", ["get", "main"], 1], 7, 5],
              "circle-color": ["case", ["==", ["get", "main"], 1], "#f2c96e", "#9fe3e0"],
              "circle-stroke-color": "#081326",
              "circle-stroke-width": 1.5,
            },
          },
          {
            id: "label",
            type: "symbol",
            source: "points",
            layout: {
              "text-field": ["get", "label"],
              "text-font": ["Open Sans Semibold"],
              "text-size": 11,
              "text-letter-spacing": 0.12,
              "text-offset": [0, 1.4],
              "text-anchor": "top",
            },
            paint: { "text-color": "#e6ecf2", "text-halo-color": "#081326", "text-halo-width": 1.5 },
          },
        ],
      },
    });
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), "bottom-left");

    const bounds = new maplibregl.LngLatBounds();
    points.forEach((p) => bounds.extend([p.lng, p.lat]));
    if (points.length === 1) {
      map.jumpTo({ center: [points[0].lng, points[0].lat], zoom: points[0].exact ? 6 : 4 });
    } else {
      map.fitBounds(bounds, { padding: 80, maxZoom: 6, duration: 0 });
    }
    return () => map.remove();
  }, [points]);

  return (
    <div
      ref={ref}
      role="img"
      aria-label={`Map of ${points.map((p) => p.label).join(", ")}`}
      className="h-[420px] w-full sm:h-[560px]"
    />
  );
}
