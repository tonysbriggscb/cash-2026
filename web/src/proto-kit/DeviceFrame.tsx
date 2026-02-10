import { ReactNode, useState, useEffect } from "react";
import { useTheme } from "@coinbase/cds-web/hooks/useTheme";
import { DEVICE_WIDTH, DEVICE_HEIGHT } from "./types";

interface DeviceFrameProps {
  children: ReactNode;
  /** Scale factor for the device (1 = full size) */
  scale?: number;
}

/**
 * iPhone device frame with proper styling and shadow
 * Wraps prototype content in a realistic device shell
 */
export const DeviceFrame = ({ children, scale = 1 }: DeviceFrameProps) => {
  const theme = useTheme();
  const isDarkMode = theme.activeColorScheme === "dark";

  return (
    <div
      style={{
        height: "100vh",
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: isDarkMode ? "#1a1a1a" : "#e8e8ed",
        overflow: "hidden",
        boxSizing: "border-box",
        paddingTop: 32,
        paddingBottom: 32,
      }}
    >
      <div
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
      >
        {/* Device Frame - clean white/dark with subtle shadow */}
        <div
          style={{
            width: DEVICE_WIDTH,
            height: DEVICE_HEIGHT,
            position: "relative",
            borderRadius: 44,
            backgroundColor: "var(--color-bg)",
            boxSizing: "border-box",
            boxShadow: isDarkMode
              ? "0 50px 100px -20px rgba(0, 0, 0, 0.5), 0 30px 60px -30px rgba(0, 0, 0, 0.6)"
              : "0 50px 100px -20px rgba(0, 0, 0, 0.2), 0 30px 60px -30px rgba(0, 0, 0, 0.25)",
            overflow: "hidden",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
};

/**
 * Hook to calculate viewport info and device scale
 */
export const useViewport = () => {
  const [viewport, setViewport] = useState({ 
    isMobile: false, 
    scale: 1 
  });

  useEffect(() => {
    const calculate = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width <= 500;
      
      // 32px top + 32px bottom padding
      const horizontalPadding = 48;
      const verticalPadding = 64;
      const availableWidth = width - horizontalPadding;
      const availableHeight = height - verticalPadding;
      const scaleX = availableWidth / DEVICE_WIDTH;
      const scaleY = availableHeight / DEVICE_HEIGHT;
      const scale = Math.min(1, scaleX, scaleY);

      setViewport({ isMobile, scale });
    };

    calculate();
    window.addEventListener("resize", calculate);
    return () => window.removeEventListener("resize", calculate);
  }, []);

  return viewport;
};

