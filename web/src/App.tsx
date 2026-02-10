/**
 * CDS Proto Kit - Example Application
 * 
 * This demonstrates how to use the Proto Kit with example screens.
 * 
 * To use your own prototype:
 * 1. Create your screens in a new folder (e.g., src/my-prototype/screens/)
 * 2. Export your screen configuration from src/my-prototype/index.ts
 * 3. Import and pass to ProtoKit below
 */

import { useState, useMemo } from "react";
import { ProtoKit, parseSettingsFromUrl } from "./proto-kit";
import { SplashScreen } from "./SplashScreen";
import { 
  screens, 
  screenOrder, 
  initialScreen, 
  totalSteps,
  getStepForScreen,
  flows,
} from "./prototype-example";
import { FlowDemoScreen } from "./prototype-example/screens/FlowDemoScreen";

export const App = () => {
  // Parse URL settings once on mount
  const urlSettings = useMemo(() => parseSettingsFromUrl(), []);
  
  // Skip splash if URL param says so
  const [showSplash, setShowSplash] = useState(!urlSettings.skipSplash);
  const [isEntering, setIsEntering] = useState(urlSettings.skipSplash);

  const handleSplashComplete = () => {
    setShowSplash(false);
    // Small delay to ensure gray background is visible, then trigger entrance animation
    setTimeout(() => setIsEntering(true), 50);
  };

  return (
    <div style={{ backgroundColor: "#E3E3E3", minHeight: "100vh" }}>
      {showSplash && (
        <SplashScreen onComplete={handleSplashComplete} />
      )}
      <ProtoKit
        screens={screens}
        screenOrder={screenOrder}
        initialScreen={initialScreen}
        totalSteps={totalSteps}
        getStepForScreen={getStepForScreen}
        flows={flows}
        isEntering={isEntering}
        renderAlternateFlow={(flowId, onSwitchToMain) => (
          <FlowDemoScreen onSwitchToMain={onSwitchToMain} />
        )}
      />
    </div>
  );
};
