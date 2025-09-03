import { PortalProvider } from "@cbhq/cds-web/overlays/PortalProvider";
import { ThemeProvider } from "@cbhq/cds-web/system/ThemeProvider";
import { defaultTheme } from "@cbhq/cds-web/themes/defaultTheme";

import "@cbhq/cds-web/globalStyles";

import { Demo } from "./Demo";

export const App = () => (
  <PortalProvider>
    <ThemeProvider theme={defaultTheme} activeColorScheme="light">
      <Demo />
    </ThemeProvider>
  </PortalProvider>
);
