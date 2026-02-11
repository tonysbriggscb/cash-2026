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
│       │   ├── PrototypeToolbar.tsx  # Floating toolbar (restart, dark mode, flows, settings, notes)
│       │   ├── ScreenNavigator.tsx   # Screen transitions + navigation hook
│       │   ├── SettingsPanel.tsx     # Tester settings dropdown (includes tap hints toggle)
│       │   ├── CanvasNotes.tsx       # Draggable sticky notes on the canvas
│       │   ├── useCanvasNotes.ts     # Note state management + URL persistence
│       │   ├── TapHint.tsx           # Pulsing overlay guiding users to the correct button
│       │   ├── useTapHint.ts         # Tap hint target detection + click handling
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

### 5. Canvas Notes

Designers can annotate their prototypes with draggable sticky notes on the canvas (the area around the device frame). Notes are persisted via a base64-encoded `?notes=` URL parameter so they survive page reloads and can be shared.

Each note has a **scope**:

| Scope | Behavior |
|-------|----------|
| **Permanent** (default) | Visible on every screen |
| **Screen** | Only visible when the pinned screen is active |

Scope is toggled via a badge on the note header. The badge shows "All" for permanent notes or the screen name for screen-scoped notes.

**Keyboard shortcuts:**
- `N` — Add a new permanent note
- `Shift+N` — Add a new screen-scoped note (pinned to the current screen)

Notes stack vertically when created; when the viewport bottom is reached they wrap to the next column. The toolbar also has an "Add note" button (compose icon).

**Key files:**
- `CanvasNotes.tsx` — Renders the note layer and individual `StickyNote` components (drag, edit, delete, scope toggle)
- `useCanvasNotes.ts` — State management, non-overlapping positioning (`findOpenPosition`), URL encode/decode

### 6. Tap Hint Guide

An optional overlay that guides users to interactive elements when they click the wrong thing. When triggered, a 2px purple focus-ring (`box-shadow`) appears around ALL interactive elements currently in view, then fades out after 1.5 seconds.

**How it works:**
1. User clicks anywhere inside the screen/header that isn't an interactive element
2. The hook discovers all interactive targets: `data-hint` elements (explicit), buttons, `[role="button"]`, `[data-clickable]`, anchors, and divs/spans with React `onClick` handlers
3. Focus-ring overlays appear on every found target simultaneously for 1.5 seconds

**Enabling tap hints:**
- Via URL: `?hints=on`
- Via the "Tap hints" toggle in the settings panel (activates immediately)

**Targeting priority:**
1. Elements with `data-hint` attribute (explicit, takes precedence over auto-detection)
2. Auto-detected: `button:not(:disabled)`, `[role="button"]`, `[data-clickable]`, `a[href]`, divs/spans with React `onClick`

**Implementation notes:**
- Uses `createPortal` to render hints to `document.body` with `position: fixed`, bypassing `overflow: hidden` and CSS transform scaling on the device frame
- Works across all flows (main and alternate) via separate `TapHint` instances with their own container refs

**Key files:**
- `TapHint.tsx` — Renders focus-ring overlays via a portal to `document.body`
- `useTapHint.ts` — Click listener, multi-target resolution (`findAllHintTargets`), visibility checks (`isVisible`, `hasClickHandler`)

### 7. Tester Settings

The settings panel generates shareable URLs with configurations:

| Setting | URL Param | Effect |
|---------|-----------|--------|
| Hide toolbar | `?toolbar=hidden` | Hides the floating toolbar |
| Disable modals | `?modals=disabled` | Disables "work in progress" modal |
| Skip splash | `?splash=skip` | Skips the Lottie animation |
| Start on flow | `?flow=alternate` | Opens on a specific flow |
| Tap hints | `?hints=on` | Enables tap hint guide overlay |

Notes are persisted separately via `?notes=<base64>` (managed automatically by `useCanvasNotes`).

Example tester URL: `https://cds-test-kit.vercel.app?toolbar=hidden&splash=skip&flow=main&hints=on`

## Key Components

### ProtoKit.tsx
The main wrapper that orchestrates everything:
- Manages dark mode state
- Parses URL settings
- Renders device frame (desktop) or fullscreen (mobile)
- Handles screen navigation via `useScreenNavigator` hook
- Shows/hides toolbar based on settings
- Manages canvas notes via `useCanvasNotes` hook
- Manages tap hint state (`showHints`) and provides `screenContentRef` to `TapHint`
- Handles keyboard shortcuts (`N` for notes, `Shift+N` for screen-scoped notes)

### PrototypeToolbar.tsx
Floating toolbar with:
- Expand/collapse toggle
- Restart prototype button
- Dark/light mode toggle
- Add note button (compose icon)
- Settings panel (filter icon) — includes live tap hints toggle
- Flow dropdown (when multiple flows exist)

State interactions:
- Opening settings closes flow dropdown
- Opening flow dropdown closes settings
- Clicking any button closes both dropdowns
- Tooltips hidden when any dropdown is open

### CanvasNotes.tsx
Renders draggable sticky notes on the canvas around the device frame:
- Each `StickyNote` supports drag-to-move, inline text editing, delete, and scope toggling
- `CanvasNotes` filters notes by the current screen (permanent notes always shown, screen-scoped notes only on their pinned screen)
- Notes have a colored header: yellow for permanent, blue for screen-scoped

### TapHint.tsx
Renders a blurred, semi-transparent pulsing circle over the target element:
- Uses `useTapHint` hook for target detection and positioning
- `key` prop set to `hintKey` to force remount and re-trigger the CSS animation on each "wrong" click
- Positioned absolutely within the screen content container

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
| Note appear | `.canvas-note` | Scale + fade in on creation |
| Note fade | `.canvas-note-wrapper` | Opacity transition for screen-scoped notes |
| Tap hint pulse | `.tap-hint-overlay` | Scale + fade pulse (1.5s) over target element |

Motion curve: `cubic-bezier(0.4, 0, 0.2, 1)` (CDS expressive)

## State Management

No external state library. Component state via `useState`:

| Component / Hook | Key State |
|------------------|-----------|
| `ProtoKit` | `currentFlow`, `isDarkMode`, `workInProgressModalVisible`, `showHints` |
| `PrototypeToolbar` | `isExpanded`, `showSettings`, `flowDropdownOpen`, `tooltipVisible` |
| `ScreenNavigator` | `currentScreen`, `displayedScreen`, `animationPhase` |
| `useCanvasNotes` | `notes` (array of `CanvasNote`), synced to `?notes=` URL param |
| `useTapHint` | `hintRect`, `hintVisible`, `hintKey` (incremented to re-trigger animation) |

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
2. **z-index hierarchy**: Toolbar (9999) < Backdrop (10000) < Settings panel (10001) < Tap hint (50, within screen content)
3. **Fixed positioning** for tooltips and settings panel to avoid clipping by parent overflow
4. **URL settings** parsed once on mount with `useMemo`
5. **Animation timing** - Most use 0.2-0.3s with CDS expressive curve
6. **Mobile detection** - `useViewport` hook detects mobile and skips device frame
7. **Canvas notes** are persisted via base64-encoded `?notes=` URL param; use `useCanvasNotes` hook for all note operations
8. **Tap hint re-animation** - The `hintKey` state is incremented on each trigger and used as a React `key` to force remount and restart the CSS animation
9. **Tap hint targeting** - `data-hint` attribute takes priority; fallback auto-detects the last visible button in the `.screen` container using the `isVisible` helper
