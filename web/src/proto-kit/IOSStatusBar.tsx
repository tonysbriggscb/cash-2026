import { useTheme } from "@coinbase/cds-web/hooks/useTheme";

interface IOSStatusBarProps {
  /** Override the status bar color (defaults to theme-aware fg color) */
  color?: string;
  /** Use light text (for dark backgrounds) */
  lightContent?: boolean;
  /** Make the background transparent */
  transparent?: boolean;
}

/**
 * iOS Status Bar component with Dynamic Island
 * Renders the time, signal, WiFi, and battery indicators
 */
export const IOSStatusBar = ({ 
  color, 
  lightContent = false,
  transparent = false,
}: IOSStatusBarProps) => {
  const theme = useTheme();
  
  // Determine status bar color based on props and theme
  const statusBarColor = color ?? (
    lightContent 
      ? "var(--color-fgInverse)" 
      : "var(--color-fg)"
  );

  return (
    <div
      style={{
        height: 54,
        position: "relative",
        backgroundColor: transparent ? "transparent" : "var(--color-bg)",
      }}
    >
      {/* Dynamic Island */}
      <div
        style={{
          position: "absolute",
          top: 12,
          left: "50%",
          transform: "translateX(-50%)",
          width: 126,
          height: 37,
          backgroundColor: "#1c1c1e",
          borderRadius: 24,
        }}
      />
      
      {/* Time - vertically centered with dynamic island */}
      <div
        style={{
          position: "absolute",
          left: 24,
          top: 12,
          height: 37,
          display: "flex",
          alignItems: "center",
          fontFamily: "'SF Pro Text', -apple-system, BlinkMacSystemFont, sans-serif",
          fontSize: 16,
          fontWeight: 500,
          color: statusBarColor,
          letterSpacing: -0.32,
        }}
      >
        9:41
      </div>
      
      {/* Status Icons - vertically centered with dynamic island */}
      <div
        style={{
          position: "absolute",
          right: 24,
          top: 12,
          height: 37,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        {/* Signal Bars */}
        <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
          <rect x="0" y="8" width="3" height="4" rx="1" fill={statusBarColor}/>
          <rect x="4" y="5" width="3" height="7" rx="1" fill={statusBarColor}/>
          <rect x="8" y="3" width="3" height="9" rx="1" fill={statusBarColor}/>
          <rect x="12" y="0" width="3" height="12" rx="1" fill={statusBarColor}/>
        </svg>
        
        {/* WiFi */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <path d="M8.5 2.5C11.5 2.5 14 3.8 15.5 5.8L14.2 7.1C13 5.5 10.9 4.4 8.5 4.4C6.1 4.4 4 5.5 2.8 7.1L1.5 5.8C3 3.8 5.5 2.5 8.5 2.5Z" fill={statusBarColor}/>
          <path d="M8.5 6C10.3 6 11.9 6.8 12.9 8L11.6 9.3C10.9 8.5 9.8 8 8.5 8C7.2 8 6.1 8.5 5.4 9.3L4.1 8C5.1 6.8 6.7 6 8.5 6Z" fill={statusBarColor}/>
          <circle cx="8.5" cy="11" r="1.5" fill={statusBarColor}/>
        </svg>
        
        {/* Battery */}
        <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
          <rect x="0.5" y="0.5" width="23" height="12" rx="3" stroke={statusBarColor} strokeOpacity="0.35"/>
          <rect x="2" y="2" width="20" height="9" rx="2" fill={statusBarColor}/>
          <path d="M25 4V9C26.1 9 27 8.1 27 7V6C27 4.9 26.1 4 25 4Z" fill={statusBarColor} fillOpacity="0.4"/>
        </svg>
      </div>
    </div>
  );
};
