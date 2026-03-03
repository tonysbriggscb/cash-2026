import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export type Region = "US" | "UK";

// Region is stored as ?region=us or ?region=uk so the URL is shareable
// on static hosts (GitHub Pages, Vercel) without needing server-side routing.

function getRegionFromSearch(): Region {
  if (typeof window === "undefined") return "UK";
  const params = new URLSearchParams(window.location.search);
  const r = params.get("region")?.toUpperCase();
  return r === "US" ? "US" : "UK";
}

function applyRegionToSearch(region: Region): void {
  const params = new URLSearchParams(window.location.search);
  params.set("region", region.toLowerCase());
  const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
  window.history.replaceState(null, "", newUrl);
}

interface RegionContextValue {
  region: Region;
  setRegion: (region: Region) => void;
}

const RegionContext = createContext<RegionContextValue | null>(null);

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegionState] = useState<Region>(getRegionFromSearch);

  const setRegion = useCallback((value: Region) => {
    setRegionState(value);
    applyRegionToSearch(value);
  }, []);

  useEffect(() => {
    const onPopState = () => setRegionState(getRegionFromSearch());
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
