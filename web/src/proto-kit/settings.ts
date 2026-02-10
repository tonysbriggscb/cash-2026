/**
 * Prototype Settings - URL parameter parsing and settings management
 */

export interface PrototypeSettings {
  /** Whether to show the toolbar (false = hidden for testers) */
  showToolbar: boolean;
  /** Whether to show the "still working on it" modal */
  showModals: boolean;
  /** Whether to skip the splash screen */
  skipSplash: boolean;
  /** Which flow to start on */
  flow?: string;
}

/**
 * Default settings for designers
 */
export const defaultSettings: PrototypeSettings = {
  showToolbar: true,
  showModals: true,
  skipSplash: false,
};

/**
 * Parse URL parameters to get prototype settings
 */
export function parseSettingsFromUrl(): PrototypeSettings {
  if (typeof window === "undefined") return defaultSettings;

  const params = new URLSearchParams(window.location.search);
  
  // Check for test mode (shorthand for common tester settings)
  const isTestMode = params.get("mode") === "test";
  
  return {
    showToolbar: isTestMode ? false : params.get("toolbar") !== "hidden",
    showModals: isTestMode ? false : params.get("modals") !== "disabled",
    skipSplash: isTestMode ? true : params.get("splash") === "skip",
    flow: params.get("flow") || undefined,
  };
}

/**
 * Generate a URL with the given settings
 */
export function generateTesterUrl(settings: Partial<PrototypeSettings>): string {
  if (typeof window === "undefined") return "";

  const url = new URL(window.location.origin + window.location.pathname);
  
  // Only add params for non-default values
  if (settings.showToolbar === false) {
    url.searchParams.set("toolbar", "hidden");
  }
  if (settings.showModals === false) {
    url.searchParams.set("modals", "disabled");
  }
  if (settings.skipSplash === true) {
    url.searchParams.set("splash", "skip");
  }
  if (settings.flow && settings.flow !== "main") {
    url.searchParams.set("flow", settings.flow);
  }
  
  return url.toString();
}

/**
 * Check if current URL has any test settings applied
 */
export function hasTestSettings(): boolean {
  if (typeof window === "undefined") return false;
  
  const params = new URLSearchParams(window.location.search);
  return params.has("toolbar") || params.has("modals") || params.has("mode");
}
