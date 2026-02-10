# CDS Proto Kit

A reusable prototype framework for Coinbase designers, built with CDS (Coinbase Design System) components.

## Features

- **Device Frame**: Realistic iPhone frame with Dynamic Island and status bar
- **Prototype Toolbar**: Restart, dark mode toggle, and flow selection
- **Screen Transitions**: Smooth push/pop navigation between screens
- **CDS Integration**: Full access to CDS components, colors, and spacing
- **Work In Progress Modal**: Built-in handling for unbuilt features
- **Dark Mode Support**: Toggle between light and dark themes
- **Keyboard Shortcuts**: `R` to restart, `ESC` to hide toolbar

## Quick Start

### Option 1: Start Fresh

1. Create your screens in `src/prototype-example/screens/`
2. Configure screens in `src/prototype-example/index.ts`
3. Import and use with `ProtoKit`

```tsx
// src/prototype/screens/HomeScreen.tsx
import { VStack } from "@coinbase/cds-web/layout";
import { Text } from "@coinbase/cds-web/typography/Text";
import { Button } from "@coinbase/cds-web/buttons/Button";
import { ScreenProps } from "../proto-kit";

export const HomeScreen = ({ onNavigate, onShowWorkInProgress }: ScreenProps) => (
  <VStack gap={3} padding={3}>
    <Text font="title1">Welcome</Text>
    <Button onClick={() => onNavigate("detail")}>Next</Button>
    <Button variant="secondary" onClick={onShowWorkInProgress}>
      Coming soon
    </Button>
  </VStack>
);
```

```tsx
// src/prototype/index.ts
import { ScreenConfig } from "../proto-kit";
import { HomeScreen } from "./screens/HomeScreen";
import { DetailScreen } from "./screens/DetailScreen";

export type MyScreen = "home" | "detail";

export const screens: Record<MyScreen, ScreenConfig<MyScreen>> = {
  home: {
    component: HomeScreen,
    header: { left: null, right: "close" },
  },
  detail: {
    component: DetailScreen,
    header: { left: "back", center: "stepper", right: "close" },
  },
};

export const screenOrder: MyScreen[] = ["home", "detail"];
export const initialScreen: MyScreen = "home";
```

```tsx
// src/App.tsx
import { ProtoKit } from "./proto-kit";
import { screens, screenOrder, initialScreen } from "./prototype";

export const App = () => (
  <ProtoKit
    screens={screens}
    screenOrder={screenOrder}
    initialScreen={initialScreen}
  />
);
```

### Option 2: Import Into Existing Prototype

If you have existing screens, wrap them with the ProtoKit:

```tsx
import { ProtoKit, ScreenProps } from "./proto-kit";

// Adapt your existing screen to use ScreenProps
const MyExistingScreen = ({ onNavigate, onShowWorkInProgress }: ScreenProps) => {
  // Your existing screen content...
  return <YourContent />;
};

const screens = {
  home: { component: MyExistingScreen },
  // ... more screens
};

export const App = () => (
  <ProtoKit
    screens={screens}
    screenOrder={["home", "detail", "complete"]}
    initialScreen="home"
  />
);
```

## API Reference

### ProtoKit Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `screens` | `Record<string, ScreenConfig>` | Yes | Map of screen IDs to configurations |
| `screenOrder` | `string[]` | Yes | Ordered list for navigation direction |
| `initialScreen` | `string` | Yes | First screen to display |
| `flows` | `FlowConfig[]` | No | Available flows for toolbar dropdown |
| `totalSteps` | `number` | No | Total steps for progress stepper |
| `getStepForScreen` | `(screen) => number` | No | Map screen to step number |
| `trays` | `TrayConfig[]` | No | Custom bottom sheet overlays |
| `theme` | `ThemeConfig` | No | Custom CDS theme |

### ScreenConfig

```tsx
interface ScreenConfig {
  component: ComponentType<ScreenProps>;
  header?: {
    left?: "back" | "close" | null;
    center?: "stepper" | null;
    right?: "back" | "close" | null;
  };
}
```

### ScreenProps

Props passed to every screen component:

```tsx
interface ScreenProps {
  onNavigate: (screen: string) => void;      // Navigate to another screen
  onShowWorkInProgress: () => void;           // Show WIP modal
  onOpenTray?: (trayId: string) => void;      // Open a custom tray
}
```

### FlowConfig

```tsx
interface FlowConfig {
  id: string;
  name: string;
  disabled?: boolean;
}
```

## Individual Components

For advanced customization, you can use components individually:

```tsx
import {
  IOSStatusBar,
  DeviceFrame,
  PrototypeToolbar,
  ScreenNavigator,
  WorkInProgressModal,
  useViewport,
  useScreenNavigator,
} from "./proto-kit";
```

### IOSStatusBar

```tsx
<IOSStatusBar 
  transparent={false}       // Make background transparent
  lightContent={false}      // Use light text (for dark backgrounds)
  color="#000"              // Override status bar color
/>
```

### DeviceFrame

```tsx
<DeviceFrame scale={0.8}>
  {/* Your content */}
</DeviceFrame>
```

### useViewport Hook

```tsx
const { isMobile, scale } = useViewport();
// isMobile: true if viewport <= 500px
// scale: calculated scale factor to fit device
```

## File Structure

```
src/
├── proto-kit/                 # Reusable kit (don't modify)
│   ├── index.ts               # Public exports
│   ├── ProtoKit.tsx           # Main wrapper
│   ├── DeviceFrame.tsx        # iPhone frame
│   ├── IOSStatusBar.tsx       # Status bar
│   ├── PrototypeToolbar.tsx   # Toolbar
│   ├── ScreenNavigator.tsx    # Transitions
│   ├── WorkInProgressModal.tsx
│   ├── styles.ts              # Animations
│   └── types.ts               # TypeScript types
│
├── prototype-example/         # Example prototype (copy & rename)
│   ├── index.ts               # Screen configuration
│   └── screens/               # Screen components
│       ├── WelcomeScreen.tsx
│       └── ...
│
└── App.tsx                    # Entry point
```

## CDS Best Practices

### Use CDS Components

```tsx
// ✅ Good - uses CDS components
import { VStack, HStack, Box } from "@coinbase/cds-web/layout";
import { Text } from "@coinbase/cds-web/typography/Text";
import { Button } from "@coinbase/cds-web/buttons/Button";

// ❌ Avoid - raw HTML/CSS
<div style={{ display: "flex" }}>
```

### Use CDS Colors

```tsx
// ✅ Good - uses CDS color tokens
<Box background="bgSecondary" />
<Text color="fgMuted" />

// ❌ Avoid - hardcoded colors
<div style={{ backgroundColor: "#f5f5f5" }}>
```

### Use CDS Spacing

```tsx
// ✅ Good - uses CDS spacing scale
<VStack gap={2} padding={3} />

// ❌ Avoid - pixel values
<div style={{ padding: "24px", gap: "16px" }}>
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `R` | Restart prototype |
| `ESC` | Hide/show toolbar |

## Examples

See `prototype-example/` for a complete working example.

## Troubleshooting

### Screens not transitioning?
Make sure your `screenOrder` array includes all screens and they're in the correct order.

### Header not showing?
Add a `header` config to your screen:
```tsx
header: { left: "back", center: "stepper", right: "close" }
```

### Dark mode not working?
The toolbar handles dark mode automatically. Make sure you're using CDS color tokens (`fg`, `bg`, etc.) instead of hardcoded colors.
