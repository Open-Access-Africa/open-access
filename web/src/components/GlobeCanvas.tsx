"use client";

import Globe, { type GlobeMethods, type GlobeProps } from "react-globe.gl";
import type { RefObject } from "react";

// Loaded with next/dynamic from HomeGlobe. dynamic() does not pass a `ref` through,
// so the globe's ref travels as an ordinary prop (globeRef) and is attached here.
export default function GlobeCanvas({
  globeRef,
  ...props
}: GlobeProps & { globeRef: RefObject<GlobeMethods | undefined> }) {
  return <Globe ref={globeRef} {...props} />;
}
