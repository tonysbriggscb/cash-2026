import React, { memo, StrictMode, useMemo } from "react";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useTheme } from "@coinbase/cds-mobile/hooks/useTheme";
import { PortalProvider } from "@coinbase/cds-mobile/overlays/PortalProvider";
import { StatusBar } from "@coinbase/cds-mobile/system/StatusBar";
import { ThemeProvider } from "@coinbase/cds-mobile/system/ThemeProvider";
import { defaultTheme } from "@coinbase/cds-mobile/themes/defaultTheme";
import { useDeviceColorScheme } from "@coinbase/cds-mobile/hooks/useDeviceColorScheme";

import { Demo } from "./Demo";

// this code allows the use of toLocaleString() on Android
if (Platform.OS === "android") {
  require("intl");
  require("intl/locale-data/jsonp/en-US");
}

interface CdsSafeAreaProviderProps {
  children: React.ReactNode;
}

const CdsSafeAreaProvider = memo<CdsSafeAreaProviderProps>(
  ({ children }: CdsSafeAreaProviderProps) => {
    const theme = useTheme();
    const style = useMemo(
      () => ({ backgroundColor: theme.color.bg }),
      [theme.color.bg]
    );
    return <SafeAreaProvider style={style}>{children}</SafeAreaProvider>;
  }
);

CdsSafeAreaProvider.displayName = "CdsSafeAreaProvider";

const LocalStrictMode = ({ children }: { children: React.ReactNode }) => {
  const strict = process.env.CI !== "true";
  return strict ? <StrictMode>{children}</StrictMode> : <>{children}</>;
};

const App = memo(() => {
  const deviceColorScheme = useDeviceColorScheme();

  return (
    <LocalStrictMode>
      <ThemeProvider
        activeColorScheme={deviceColorScheme}
        theme={defaultTheme}
      >
        <CdsSafeAreaProvider>
          <PortalProvider>
            <StatusBar hidden={!__DEV__} />
            <Demo />
          </PortalProvider>
        </CdsSafeAreaProvider>
      </ThemeProvider>
    </LocalStrictMode>
  );
});

App.displayName = "App";

export default App;
