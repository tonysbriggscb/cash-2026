import { PortalProvider } from "@coinbase/cds-web/overlays/PortalProvider";
import { ThemeProvider } from "@coinbase/cds-web/system/ThemeProvider";
import { coinbaseTheme } from "@coinbase/cds-web/themes/coinbaseTheme";

import "@coinbase/cds-web/globalStyles";

import { Demo } from "./Demo";

export const App = () => (
  <PortalProvider>
    <ThemeProvider theme={coinbaseTheme} activeColorScheme="light">
      <Demo />
    </ThemeProvider>
  </PortalProvider>
);
