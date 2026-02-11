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
  // Walk up to check if any ancestor hides it
  let parent = el.parentElement;
  while (parent) {
    const ps = window.getComputedStyle(parent);
    if (ps.opacity === "0" || ps.visibility === "hidden" || ps.display === "none") return false;
    if (ps.pointerEvents === "none" && parent !== el) {
      // Check if this is the invisible header wrapper
      const pr = parent.getBoundingClientRect();
      if (pr.height > 0) return false;
    }
    parent = parent.parentElement;
  }
  return true;
}

/**
 * Resolves the hint target element inside the container.
 * Priority: visible [data-hint] element, then the last visible button
 * in the active screen (typically the primary CTA at the bottom).
 */
function findHintTarget(container: HTMLElement): HTMLElement | null {
  // Explicit data-hint takes priority
  const explicitTargets = container.querySelectorAll<HTMLElement>("[data-hint]");
  for (const el of explicitTargets) {
    if (isVisible(el)) return el;
  }

  // Find buttons inside the .screen elements (skip header area)
  const screenEls = container.querySelectorAll<HTMLElement>(".screen");
  for (const screen of screenEls) {
    const buttons = screen.querySelectorAll<HTMLElement>("button:not(:disabled)");
    // Return the last visible button -- typically the primary CTA at the bottom
    let lastVisible: HTMLElement | null = null;
    for (const btn of buttons) {
      if (isVisible(btn)) lastVisible = btn;
    }
    if (lastVisible) return lastVisible;
  }

  return null;
}

/**
 * Hook that shows a pulsing hint overlay over the correct target element
 * when the user clicks something else on the screen.
 */
export function useTapHint({ enabled, containerRef, currentScreen }: UseTapHintOptions) {
  const [hintRect, setHintRect] = useState<HintRect | null>(null);
  const [hintVisible, setHintVisible] = useState(false);
  // Incrementing key forces the CSS animation to replay on each trigger
  const [hintKey, setHintKey] = useState(0);

  // Reset hint when the screen changes
  useEffect(() => {
    setHintVisible(false);
    setHintRect(null);
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

      const target = findHintTarget(container);
      if (!target) return;

      const clickedEl = e.target as HTMLElement;
      if (target.contains(clickedEl)) return;

      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      const padding = 8;
      setHintRect({
        top: targetRect.top - containerRect.top - padding,
        left: targetRect.left - containerRect.left - padding,
        width: targetRect.width + padding * 2,
        height: targetRect.height + padding * 2,
      });
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

  return { hintRect, hintVisible, hintKey };
}
