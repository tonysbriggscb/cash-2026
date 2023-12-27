import { PortalProvider } from "@cbhq/cds-web/overlays/PortalProvider";
import {
  DevicePreferencesProvider,
  FeatureFlagProvider,
} from "@cbhq/cds-web/system";
import { ThemeProvider } from "@cbhq/cds-web/system/ThemeProvider";
import { HStack, VStack } from "@cbhq/cds-web/layout";

import "@cbhq/cds-web/globalStyles";


import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

export const App = () => (
  <FeatureFlagProvider frontier>
    <DevicePreferencesProvider>
      <ThemeProvider scale="xLarge" spectrum="light">
        <PortalProvider>
          <HStack height={'100vh'} width={'100%'}>
            <Sidebar />
            <VStack overflow="clip" width={'100%'}>
              <Navbar />
            </VStack>
          </HStack>
        </PortalProvider>
      </ThemeProvider>
    </DevicePreferencesProvider>
  </FeatureFlagProvider>
);
