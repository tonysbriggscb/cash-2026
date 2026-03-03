import { ReactNode, ComponentType } from "react";

/**
 * Header configuration for a screen
 */
export type HeaderIcon = "back" | "close" | null;
export type HeaderCenter = "stepper" | string | null;

export interface HeaderConfig {
  left?: HeaderIcon;
  center?: HeaderCenter;
  right?: HeaderIcon;
  /** Make the entire header invisible but still take up space */
  invisible?: boolean;
  /** When true, the back button is shown but does nothing when tapped */
  backDisabled?: boolean;
}

/**
 * Screen configuration
 */
export interface ScreenConfig<TScreen extends string = string> {
  /** The screen component to render */
  component: ComponentType<ScreenProps<TScreen>>;
  /** Header configuration for this screen */
  header?: HeaderConfig;
  /** Custom component to render as the header instead of the default nav bar */
  headerComponent?: ComponentType;
  /** When true, the bottom tab bar is hidden on this screen */
  hideTabBar?: boolean;
  /** Override the CTA buttons above the tab bar for this specific screen */
  actionButtons?: {
    left?: ActionButtonConfig;
    right?: ActionButtonConfig;
  };
}

/**
 * Props passed to each screen component
 */
export interface ScreenProps<TScreen extends string = string> {
  /** Navigate to another screen */
  onNavigate: (screen: TScreen) => void;
  /** Show the "work in progress" modal for unbuilt features */
  onShowWorkInProgress: () => void;
  /** Open a custom tray/bottom sheet */
  onOpenTray?: (trayId: string) => void;
}

/**
 * Flow configuration for the toolbar dropdown
 */
export interface FlowConfig {
  id: string;
  name: string;
  disabled?: boolean;
}

/**
 * Tray/bottom sheet configuration
 */
export interface TrayConfig {
  id: string;
  component: ComponentType<TrayProps>;
}

/**
 * Props passed to tray components
 */
export interface TrayProps {
  visible: boolean;
  onClose: () => void;
  onNavigate?: (screen: string) => void;
}

/**
 * Configuration for a single action button above the tab bar
 */
export interface ActionButtonConfig {
  label: string;
  /** Tray to open when tapped — if omitted the button does nothing */
  trayId?: string;
}

/**
 * Single tab in the bottom tab bar
 */
export interface BottomTabConfig<TScreen extends string = string> {
  /** Unique identifier for this tab — used to track the active tab independently of screen */
  id: string;
  screen: TScreen;
  label: string;
  /** CDS icon name (e.g. "home", "trading", "arrowsVertical", "invoice") */
  icon: string;
  /**
   * When false, the tab is not clickable, has no navigation/URL, and never shows active state.
   * @default true
   */
  actionable?: boolean;
  /** Override the two action buttons shown above the tab bar when this tab is active */
  actionButtons?: {
    left?: ActionButtonConfig;
    right?: ActionButtonConfig;
  };
}

/**
 * Main ProtoKit configuration
 */
export interface ProtoKitConfig<TScreen extends string = string> {
  /** Map of screen IDs to their configurations */
  screens: Record<TScreen, ScreenConfig<TScreen>>;
  /** Ordered list of screens for navigation direction calculation */
  screenOrder: TScreen[];
  /** Initial screen to display */
  initialScreen: TScreen;
  /** Available flows for the toolbar dropdown */
  flows?: FlowConfig[];
  /** Custom trays/bottom sheets */
  trays?: TrayConfig[];
  /** Bottom tab bar fixed at the bottom of the device frame */
  bottomTabBar?: { tabs: BottomTabConfig<TScreen>[] };
  /** Custom header component (optional) */
  renderHeader?: (screen: TScreen, config: HeaderConfig) => ReactNode;
  /** Total steps for stepper (if using stepper in header) */
  totalSteps?: number;
  /** Function to get current step for a screen */
  getStepForScreen?: (screen: TScreen) => number;
  /** Render alternate flow content (shown when non-primary flow selected) */
  renderAlternateFlow?: (flowId: string, onSwitchToMain: () => void) => ReactNode;
  /** Optional extra content rendered in the prototype toolbar (e.g. region switcher) */
  renderToolbarExtra?: () => ReactNode;
  /** Optional label for the Deposit CTA button — defaults to "Deposit" */
  renderDepositLabel?: () => ReactNode;
  /** Optional initial navigation history so the initial screen can show the back button (e.g. ["complete"] when starting on cash) */
  initialHistory?: TScreen[];
}

/**
 * Canvas note for designer annotations on the desktop canvas
 */
export interface CanvasNote {
  id: string;
  text: string;
  x: number;
  y: number;
  /** "permanent" notes are visible on all screens; "screen" notes only on the pinned screen */
  scope: "permanent" | "screen";
  /** Screen ID this note is pinned to (only used when scope is "screen") */
  screen?: string;
}

/**
 * Device dimensions
 */
export const DEVICE_WIDTH = 375;
export const DEVICE_HEIGHT = 812;
