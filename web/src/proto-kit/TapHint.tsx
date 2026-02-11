import { RefObject } from "react";
import { createPortal } from "react-dom";
import { useTapHint } from "./useTapHint";

interface TapHintProps {
  active: boolean;
  containerRef: RefObject<HTMLDivElement | null>;
  currentScreen: string;
}

/**
 * Renders focus-ring style hints over ALL interactive elements on screen
 * when the user clicks the wrong thing. Guides users to available actions.
 *
 * Uses a portal to render at document.body level, bypassing all
 * overflow:hidden and CSS transform scaling issues.
 */
export const TapHint = ({ active, containerRef, currentScreen }: TapHintProps) => {
  const { hintRects, hintVisible, hintKey } = useTapHint({
    enabled: active,
    containerRef,
    currentScreen,
  });

  if (!active || !hintVisible || hintRects.length === 0) return null;

  return createPortal(
    <>
      {hintRects.map((rect, i) => (
        <div
          key={`${hintKey}-${i}`}
          style={{
            position: "fixed",
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            borderRadius: rect.height / 2,
            boxShadow: "0 0 0 2px #8A85FF",
            background: "transparent",
            pointerEvents: "none",
            zIndex: 99999,
            animation: "protoKitHintPulse 1.5s ease forwards",
          }}
        />
      ))}
    </>,
    document.body
  );
};
