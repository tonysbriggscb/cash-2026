import { PortalProvider } from '@cbhq/cds-web/overlays/PortalProvider'
import { DevicePreferencesProvider, FeatureFlagProvider } from '@cbhq/cds-web/system'
import { ThemeProvider } from '@cbhq/cds-web/system/ThemeProvider'

import '@cbhq/cds-web/globalStyles'

import { Test } from './Test'

export const App = () => (
  <FeatureFlagProvider frontier>
    <DevicePreferencesProvider>
      <ThemeProvider scale="xLarge" spectrum="dark">
        <PortalProvider>
          <Test />
        </PortalProvider>
      </ThemeProvider>
    </DevicePreferencesProvider>
  </FeatureFlagProvider>
)
