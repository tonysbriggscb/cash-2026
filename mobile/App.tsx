import React, { memo, StrictMode, useMemo } from 'react';
import { Platform } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useTheme } from '@cbhq/cds-mobile/hooks/useTheme';
import { PortalProvider } from '@cbhq/cds-mobile/overlays/PortalProvider';
import { StatusBar } from '@cbhq/cds-mobile/system/StatusBar';
import { ThemeProvider } from '@cbhq/cds-mobile/system/ThemeProvider';
import { defaultTheme } from '@cbhq/cds-mobile/themes/defaultTheme';
import { useDeviceColorScheme } from '@cbhq/cds-mobile/hooks/useDeviceColorScheme';

import { Demo } from './Demo';


// this code allows the use of toLocaleString() on Android
if (Platform.OS === 'android') {
  require('intl');
  require('intl/locale-data/jsonp/en-US');
}

const CdsSafeAreaProvider: React.FC<React.PropsWithChildren<unknown>> = memo(({ children }) => {
  const theme = useTheme();
  const style = useMemo(() => ({ backgroundColor: theme.color.bg }), [theme.color.bg]);
  return <SafeAreaProvider style={style}>{children}</SafeAreaProvider>;
});

const LocalStrictMode = ({ children }: { children: React.ReactNode }) => {
  const strict = process.env.CI !== 'true';
  return strict ? <StrictMode>{children}</StrictMode> : <>{children}</>;
};

const App = memo(() => {
  const deviceColorScheme = useDeviceColorScheme();
  
  return (
    <LocalStrictMode>
      <ThemeProvider activeColorScheme={deviceColorScheme} theme={defaultTheme}>
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

export default App;
