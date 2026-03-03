import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export type Region = "US" | "UK";

/** URL path prefix for region-specific links (e.g. /prototype/us, /prototype/uk) */
export const REGION_PATH_PREFIX = "/prototype";

function getRegionFromPath(): Region {
  if (typeof window === "undefined") return "UK";
  const path = window.location.pathname;
  return path.endsWith("/us") ? "US" : path.endsWith("/uk") ? "UK" : "UK";
}

function getPathForRegion(region: Region): string {
  return `${REGION_PATH_PREFIX}/${region.toLowerCase()}`;
}

interface RegionContextValue {
  region: Region;
  setRegion: (region: Region) => void;
}

const RegionContext = createContext<RegionContextValue | null>(null);

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegionState] = useState<Region>(getRegionFromPath);

  const setRegion = useCallback((value: Region) => {
    setRegionState(value);
    window.history.replaceState(null, "", getPathForRegion(value));
  }, []);

  useEffect(() => {
    const onPopState = () => setRegionState(getRegionFromPath());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const value: RegionContextValue = { region, setRegion };
  return (
    <RegionContext.Provider value={value}>
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion(): RegionContextValue {
  const ctx = useContext(RegionContext);
  if (!ctx) {
    throw new Error("useRegion must be used within RegionProvider");
  }
  return ctx;
}
