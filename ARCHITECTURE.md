# Test Kit - Architecture & AI Context

> This document provides AI-readable context for the codebase. It reduces token usage and improves accuracy when making changes.

## Project Overview

**Test Kit** is a reusable prototyping framework for Coinbase designers. It wraps prototypes in a device frame with a toolbar, handles screen transitions, and provides utilities for user testing.

- **Live URL**: https://cds-test-kit.vercel.app
- **Repository**: https://github.cbhq.net/ben-webb/test-kit
- **Tech Stack**: React, TypeScript, Vite, CDS (Coinbase Design System)

## Directory Structure

```
test-kit/
├── web/                          # Main web application
│   └── src/
│       ├── App.tsx               # Entry point - configures ProtoKit
│       ├── SplashScreen.tsx      # Lottie animation on startup
│       ├── proto-kit/            # REUSABLE FRAMEWORK (the "kit")
│       │   ├── ProtoKit.tsx      # Main wrapper component
│       │   ├── DeviceFrame.tsx   # iPhone frame + responsive scaling
│       │   ├── IOSStatusBar.tsx  # Fake iOS status bar
│       │   ├── PrototypeToolbar.tsx  # Floating toolbar (restart, dark mode, flows, settings)
│       │   ├── ScreenNavigator.tsx   # Screen transitions + navigation hook
│       │   ├── SettingsPanel.tsx     # Tester settings dropdown
│       │   ├── WorkInProgressModal.tsx # "Still working on it" modal
│       │   ├── settings.ts       # URL parameter utilities
│       │   ├── styles.ts         # CSS animations (keyframes)
│       │   ├── types.ts          # TypeScript interfaces
│       │   └── index.ts          # Public exports
│       └── prototype-example/    # EXAMPLE CONTENT (replaceable)
│           ├── index.ts          # Screen configuration
│           └── screens/          # Individual screen components
│               ├── WelcomeScreen.tsx
│               ├── FeaturesScreen.tsx
│               ├── HowToScreen.tsx
│               ├── TestingScreen.tsx
│               ├── CompleteScreen.tsx
│               └── FlowDemoScreen.tsx
├── mobile/                       # React Native app (separate, not documented here)
└── package.json                  # Yarn workspaces root
```

## Core Concepts

### 1. Proto Kit vs Prototype Content

The codebase has two distinct layers:

| Layer | Location | Purpose |
|-------|----------|---------|
| **Proto Kit** | `web/src/proto-kit/` | Reusable framework - device frame, toolbar, navigation |
| **Prototype Content** | `web/src/prototype-example/` | Example screens - replaceable with any prototype |

When designers clone the repo, they **replace** `prototype-example/` with their own screens while keeping `proto-kit/` unchanged.

### 2. Screen Configuration

Screens are defined as a typed record with component and header config:

```typescript
// Define screen types as a union
type MyScreen = "home" | "detail" | "settings";

// Configure each screen
const screens: Record<MyScreen, ScreenConfig<MyScreen>> = {
  home: {
    component: HomeScreen,
    header: { left: null, center: "stepper", right: "close" }
  },
  detail: {
    component: DetailScreen,
    header: { left: "back", center: "stepper", right: "close" }
  }
};
```

### 3. Screen Props

Every screen component receives these props:

```typescript
interface ScreenProps<TScreen> {
  onNavigate: (screen: TScreen) => void;      // Navigate to another screen
  onShowWorkInProgress: () => void;           // Show "still working on it" modal
  onOpenTray?: (trayId: string) => void;      // Open a bottom sheet
}
```

### 4. Flows

Flows allow designers to test different user journeys (A/B variants, edge cases):

```typescript
const flows: FlowConfig[] = [
  { id: "main", name: "Main flow" },
  { id: "alternate", name: "Example flow" }
];
```

The toolbar dropdown lets users switch flows. Non-main flows render via `renderAlternateFlow` prop.

### 5. Tester Settings

The settings panel generates shareable URLs with configurations:

| Setting | URL Param | Effect |
|---------|-----------|--------|
| Hide toolbar | `?toolbar=hidden` | Hides the floating toolbar |
| Disable modals | `?modals=disabled` | Disables "work in progress" modal |
| Skip splash | `?splash=skip` | Skips the Lottie animation |
| Start on flow | `?flow=alternate` | Opens on a specific flow |

Example tester URL: `https://cds-test-kit.vercel.app?toolbar=hidden&splash=skip&flow=main`

## Key Components

### ProtoKit.tsx
The main wrapper that orchestrates everything:
- Manages dark mode state
- Parses URL settings
- Renders device frame (desktop) or fullscreen (mobile)
- Handles screen navigation via `useScreenNavigator` hook
- Shows/hides toolbar based on settings

### PrototypeToolbar.tsx
Floating toolbar with:
- Expand/collapse toggle
- Restart prototype button
- Dark/light mode toggle
- Settings panel (filter icon)
- Flow dropdown (when multiple flows exist)

State interactions:
- Opening settings closes flow dropdown
- Opening flow dropdown closes settings
- Clicking any button closes both dropdowns
- Tooltips hidden when any dropdown is open

### ScreenNavigator.tsx
Provides the `useScreenNavigator` hook:

```typescript
const {
  currentScreen,      // Currently active screen
  displayedScreen,    // Screen being rendered (may differ during animation)
  animationPhase,     // "idle" | "entering" | "exiting"
  direction,          // "forward" | "backward"
  navigate,           // Navigate to a screen
  restart,            // Go back to initial screen
  isAtStart,          // Whether at the first screen
  getTransform,       // Get CSS transform for a screen
} = useScreenNavigator({ screens, screenOrder, initialScreen });
```

### DeviceFrame.tsx
iPhone frame with responsive scaling:
- Uses `useViewport` hook to calculate scale based on window size
- Renders notch, home indicator
- Fixed dimensions: 375x812 (iPhone X)

## CDS Component Usage

The project uses Coinbase Design System (`@coinbase/cds-web`):

| Component | Import | Common Usage |
|-----------|--------|--------------|
| `VStack`, `HStack` | `@coinbase/cds-web/layout` | Flex containers |
| `Text` | `@coinbase/cds-web/typography/Text` | Typography with `font` prop |
| `Button` | `@coinbase/cds-web/buttons/Button` | Primary actions |
| `IconButton` | `@coinbase/cds-web/buttons/IconButton` | Toolbar icons |
| `SelectChip` | `@coinbase/cds-web/chips/SelectChip` | Dropdown selector |
| `Switch` | `@coinbase/cds-web/controls/Switch` | Toggle settings |
| `Modal` | `@coinbase/cds-web/modal` | Dialogs |
| `Icon` | `@coinbase/cds-web/icons/Icon` | Icons by name |
| `LogoMark` | `@coinbase/cds-web/icons/LogoMark` | Coinbase logo |

Font tokens: `title1`, `title2`, `headline`, `body`, `label1`, `label2`, `caption`

Color tokens: `fg`, `fgMuted`, `bg`, `bgSecondary`, `primary`, `bgLine`

## CSS & Animations

Animations are defined in `styles.ts` as CSS keyframes injected via `<style>` tag:

| Animation | Class | Purpose |
|-----------|-------|---------|
| Screen transitions | `.screen.enter-from-right` | Slide in/out |
| Toast | `.toast`, `.toast-hiding` | Slide down/up |
| Tooltip | `.toolbar-tooltip-animate` | Fade + scale |
| Settings panel | `.settings-panel-animate` | Slide down 8px |
| Restart icon | `.restart-icon-animate` | Rotate -360deg |

Motion curve: `cubic-bezier(0.4, 0, 0.2, 1)` (CDS expressive)

## State Management

No external state library. Component state via `useState`:

| Component | Key State |
|-----------|-----------|
| `ProtoKit` | `currentFlow`, `isDarkMode`, `workInProgressModalVisible` |
| `PrototypeToolbar` | `isExpanded`, `showSettings`, `flowDropdownOpen`, `tooltipVisible` |
| `ScreenNavigator` | `currentScreen`, `displayedScreen`, `animationPhase` |

## Common Modifications

### Adding a new screen
1. Create component in `prototype-example/screens/`
2. Add to `screens` record in `prototype-example/index.ts`
3. Add to `screenOrder` array
4. Update `getStepForScreen` if using stepper

### Adding a new flow
1. Add to `flows` array in `prototype-example/index.ts`
2. Create content for `renderAlternateFlow` in `App.tsx`

### Adding a new tester setting
1. Add to `PrototypeSettings` interface in `settings.ts`
2. Add parsing logic in `parseSettingsFromUrl`
3. Add URL generation in `generateTesterUrl`
4. Add toggle in `SettingsPanel.tsx`
5. Use setting in `ProtoKit.tsx`

### Modifying toolbar
- Toolbar is in `PrototypeToolbar.tsx`
- Icons use CDS `IconButton` with `name` prop
- Tooltips render outside toolbar to avoid clipping (fixed position)
- Settings panel also renders outside (fixed position)

## Deployment

- **Platform**: Vercel
- **Build**: `yarn build` (runs `vite build`)
- **Deploy**: `vercel --prod` from `web/` directory
- **Custom domain**: `cds-test-kit.vercel.app`

## File Naming Conventions

- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Types: in `types.ts` or inline
- Styles: in `styles.ts` (CSS-in-JS as template literal)

## Important Notes for AI

1. **CDS components have specific APIs** - Check imports, many components have `font`, `color`, `styles` props
2. **z-index hierarchy**: Toolbar (9999) < Backdrop (10000) < Settings panel (10001)
3. **Fixed positioning** for tooltips and settings panel to avoid clipping by parent overflow
4. **URL settings** parsed once on mount with `useMemo`
5. **Animation timing** - Most use 0.2-0.3s with CDS expressive curve
6. **Mobile detection** - `useViewport` hook detects mobile and skips device frame
