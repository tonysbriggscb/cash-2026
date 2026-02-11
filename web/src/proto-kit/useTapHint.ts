import { useState, useEffect, useCallback, RefObject } from "react";

interface HintRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface UseTapHintOptions {
  enabled: boolean;
  containerRef: RefObject<HTMLDivElement | null>;
  currentScreen: string;
}

/**
 * Checks whether an element is actually visible and interactable.
 */
function isVisible(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return false;
  const style = window.getComputedStyle(el);
  if (style.opacity === "0" || style.visibility === "hidden" || style.display === "none") return false;
  let parent = el.parentElement;
  while (parent) {
    const ps = window.getComputedStyle(parent);
    if (ps.opacity === "0" || ps.visibility === "hidden" || ps.display === "none") return false;
    if (ps.pointerEvents === "none" && parent !== el) {
      const pr = parent.getBoundingClientRect();
      if (pr.height > 0) return false;
    }
    parent = parent.parentElement;
  }
  return true;
}

/**
 * Checks if an element has a click handler (React or native).
 */
function hasClickHandler(el: HTMLElement): boolean {
  if (el.onclick) return true;
  const keys = Object.keys(el);
  for (const key of keys) {
    if (key.startsWith("__reactProps") || key.startsWith("__reactFiber")) {
      const props = (el as Record<string, unknown>)[key] as Record<string, unknown> | undefined;
      if (props && typeof props.onClick === "function") return true;
    }
  }
  return false;
}

/**
 * Finds ALL interactive elements (buttons, clickable elements) inside the
 * container including the header and screen content.
 */
function findAllHintTargets(container: HTMLElement): HTMLElement[] {
  // Explicit data-hint elements take priority
  const explicitTargets = container.querySelectorAll<HTMLElement>("[data-hint]");
  const explicitVisible: HTMLElement[] = [];
  for (const el of explicitTargets) {
    if (isVisible(el)) explicitVisible.push(el);
  }
  if (explicitVisible.length > 0) return explicitVisible;

  // Search the entire container for interactive elements (header + screens)
  const seen = new Set<HTMLElement>();
  const interactiveElements: HTMLElement[] = [];

  const addIfNew = (el: HTMLElement) => {
    if (!seen.has(el) && isVisible(el)) {
      seen.add(el);
      interactiveElements.push(el);
    }
  };

  // All buttons (including header icon buttons and screen CTAs)
  const buttons = container.querySelectorAll<HTMLElement>("button:not(:disabled)");
  for (const btn of buttons) addIfNew(btn);

  // Elements with role="button" or data-clickable
  const clickables = container.querySelectorAll<HTMLElement>("[role='button'], [data-clickable]");
  for (const el of clickables) addIfNew(el);

  // Anchors with href
  const links = container.querySelectorAll<HTMLElement>("a[href]");
  for (const el of links) addIfNew(el);

  // Divs/spans with React onClick handlers
  const allElements = container.querySelectorAll<HTMLElement>("div, span");
  for (const el of allElements) {
    if (!seen.has(el) && isVisible(el) && hasClickHandler(el)) {
      // Skip if a child is already in the list (prefer the most specific element)
      const hasChildInList = interactiveElements.some(existing => el.contains(existing));
      if (!hasChildInList) {
        addIfNew(el);
      }
    }
  }

  return interactiveElements;
}

/**
 * Hook that shows pulsing hint overlays over ALL interactive elements
 * when the user clicks somewhere that isn't one of them.
 */
export function useTapHint({ enabled, containerRef, currentScreen }: UseTapHintOptions) {
  const [hintRects, setHintRects] = useState<HintRect[]>([]);
  const [hintVisible, setHintVisible] = useState(false);
  const [hintKey, setHintKey] = useState(0);

  // Reset hints when the screen changes
  useEffect(() => {
    setHintVisible(false);
    setHintRects([]);
  }, [currentScreen]);

  // Auto-hide after 1.5s
  useEffect(() => {
    if (!hintVisible) return;
    const timer = setTimeout(() => {
      setHintVisible(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, [hintVisible, hintKey]);

  const handleClick = useCallback(
    (e: MouseEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const targets = findAllHintTargets(container);
      if (targets.length === 0) return;

      // Check if the user clicked on any of the interactive elements
      const clickedEl = e.target as HTMLElement;
      const clickedOnTarget = targets.some(t => t.contains(clickedEl));
      if (clickedOnTarget) return;

      // Show hints on ALL interactive elements
      const padding = 4;
      const rects = targets.map(target => {
        const rect = target.getBoundingClientRect();
        return {
          top: rect.top - padding,
          left: rect.left - padding,
          width: rect.width + padding * 2,
          height: rect.height + padding * 2,
        };
      });

      setHintRects(rects);
      setHintKey((k) => k + 1);
      setHintVisible(true);
    },
    [containerRef]
  );

  // Attach/detach click listener
  useEffect(() => {
    const container = containerRef.current;
    if (!enabled || !container) return;

    container.addEventListener("click", handleClick, true);
    return () => {
      container.removeEventListener("click", handleClick, true);
    };
  }, [enabled, handleClick, containerRef]);

  return { hintRects, hintVisible, hintKey };
}
