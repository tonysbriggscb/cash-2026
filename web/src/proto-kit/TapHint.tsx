import { RefObject } from "react";
import { useTapHint } from "./useTapHint";

interface TapHintProps {
  active: boolean;
  containerRef: RefObject<HTMLDivElement | null>;
  currentScreen: string;
}

/**
 * Renders a pulsing overlay over the correct target element
 * when the user clicks the wrong thing. Guides users to the intended action.
 */
export const TapHint = ({ active, containerRef, currentScreen }: TapHintProps) => {
  const { hintRect, hintVisible, hintKey } = useTapHint({
    enabled: active,
    containerRef,
    currentScreen,
  });

  if (!hintVisible || !hintRect) return null;

  return (
    <div
      key={hintKey}
      className="tap-hint-overlay"
      style={{
        position: "absolute",
        top: hintRect.top,
        left: hintRect.left,
        width: hintRect.width,
        height: hintRect.height,
        borderRadius: hintRect.height / 2,
        background: "rgba(0, 0, 0, 0.25)",
        filter: "blur(6px)",
        pointerEvents: "none",
        zIndex: 50,
      }}
    />
  );
};
