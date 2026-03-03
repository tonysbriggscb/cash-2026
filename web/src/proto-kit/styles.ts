/**
 * Global styles for the Proto Kit
 * These handle animations, transitions, and scrollbar hiding
 */
export const protoKitStyles = `
  /* Cash screen: no padding above "Cash and Stablecoins" header */
  .proto-kit .overview-section-header,
  .proto-kit .overview-section-header > * {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    margin-top: 0 !important;
  }

  /* Cap font weight at 500; title1 (e.g. Cash & Stablecoins) at 400 for a lighter look */
  .proto-kit {
    --fontWeight-title1: 500;
    --fontWeight-title2: 400;
    --fontWeight-title3: 500;
    --fontWeight-headline: 500;
    --fontWeight-label1: 500;
    --fontWeight-caption: 500;
  }

  /* Hide scrollbars globally */
  .proto-kit *::-webkit-scrollbar {
    display: none;
  }
  .proto-kit * {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  /* Disable text selection in prototype screens */
  .proto-kit .screen-container,
  .proto-kit .screen-container * {
    -webkit-user-select: none;
    user-select: none;
  }

  /* Screen transition container */
  .proto-kit .screen-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .proto-kit .screen {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    min-height: 0;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .proto-kit .screen.enter-from-right {
    transform: translateX(100%);
  }

  .proto-kit .screen.enter-from-left {
    transform: translateX(-100%);
  }

  .proto-kit .screen.active {
    transform: translateX(0);
  }

  .proto-kit .screen.exit-to-left {
    transform: translateX(-100%);
  }

  .proto-kit .screen.exit-to-right {
    transform: translateX(100%);
  }

  /* Open orders accordion: header title uses label1 (same as History section title) */
  .proto-kit .cash-open-orders-accordion button:first-of-type,
  .proto-kit .cash-open-orders-accordion button:first-of-type [class*="headline"] {
    font-size: var(--fontSize-label1) !important;
    font-weight: var(--fontWeight-label1) !important;
    line-height: var(--lineHeight-label1) !important;
  }

  /* Open orders accordion: compact variant (reduced padding and min-height) */
  .proto-kit .cash-open-orders-accordion button:first-of-type > div {
    min-height: 44px !important;
  }
  .proto-kit .cash-open-orders-accordion #accordion-item-open-orders-panel,
  .proto-kit .cash-open-orders-accordion #accordion-item-open-orders-panel > * {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  /* Open orders ListCell: align with global list cell padding (8px top/bottom, 48px min-height); no horizontal padding */
  .proto-kit .cash-open-orders-accordion #accordion-item-open-orders-panel .cds-Cell,
  .proto-kit .cash-open-orders-accordion #accordion-item-open-orders-panel [class*="cds-ListCell"] {
    padding-top: 8px !important;
    padding-bottom: 8px !important;
    padding-left: 0 !important;
    padding-right: 0 !important;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    min-height: 48px !important;
  }
  .proto-kit .cash-open-orders-accordion #accordion-item-open-orders-panel .cds-ListCell > div,
  .proto-kit .cash-open-orders-accordion #accordion-item-open-orders-panel .cds-ListCell > button,
  .proto-kit .cash-open-orders-accordion #accordion-item-open-orders-panel .cds-ListCell [class*="HStack"],
  .proto-kit .cash-open-orders-accordion #accordion-item-open-orders-panel .cds-ListCell [class*="VStack"] {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }
  /* First open-order row: no top padding so it sits flush under the accordion header */
  .proto-kit .cash-open-orders-accordion .open-orders-first-row,
  .proto-kit .cash-open-orders-accordion .open-orders-first-row .cds-ListCell,
  .proto-kit .cash-open-orders-accordion .open-orders-first-row [class*="cds-ListCell"] {
    padding-top: 0 !important;
    margin-top: 0 !important;
  }
  /* Last open-order row: no bottom padding so History sits flush below accordion */
  .proto-kit .cash-open-orders-accordion .open-orders-last-row,
  .proto-kit .cash-open-orders-accordion .open-orders-last-row .cds-ListCell,
  .proto-kit .cash-open-orders-accordion .open-orders-last-row [class*="cds-ListCell"] {
    padding-bottom: 0 !important;
    margin-bottom: 0 !important;
  }

  /* List cells: 8px top/bottom padding, no vertical margin, 48px min-height */
  .proto-kit .cds-ListCell {
    padding-top: 8px !important;
    padding-bottom: 8px !important;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
    min-height: 48px !important;
  }

  /* ListCell description: allow 2 lines, no single-line truncation */
  .proto-kit .cds-ListCell .overflowCss-onthvgs,
  .proto-kit .cds-ListCell [class*="titleStack"] [class*="description"],
  .proto-kit .cds-ListCell [class*="description"] {
    display: -webkit-box !important;
    -webkit-line-clamp: 2 !important;
    -webkit-box-orient: vertical !important;
    overflow: hidden !important;
    text-overflow: ellipsis !important;
  }

  /* ListCell detail/end: never truncate (target end slot by alignment so we don't affect main content) */
  .proto-kit .cds-ListCell [class*="HStack"] > div:has([style*="text-align: end"]),
  .proto-kit .cds-ListCell [class*="HStack"] > div:has([style*="text-align:end"]),
  .proto-kit .cds-ListCell [class*="end"] {
    overflow: visible !important;
    min-width: min-content !important;
  }
  .proto-kit .cds-ListCell [class*="HStack"] > div:has([style*="text-align: end"]) *,
  .proto-kit .cds-ListCell [class*="HStack"] > div:has([style*="text-align:end"]) *,
  .proto-kit .cds-ListCell [class*="end"] * {
    overflow: visible !important;
    text-overflow: clip !important;
    white-space: normal !important;
  }
  .proto-kit .cds-ListCell > div,
  .proto-kit .cds-ListCell > button,
  .proto-kit .cds-ListCell > div > div,
  .proto-kit .cds-ListCell > button > div,
  .proto-kit .cds-ListCell [class*="HStack"],
  .proto-kit .cds-ListCell [class*="VStack"] {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }

  /* Overview section: minimal padding and margin, tighter row height */
  .proto-kit .overview-breakdown-cell .cds-ListCell,
  .proto-kit .overview-breakdown-cell .cds-ListCell > div,
  .proto-kit .overview-breakdown-cell .cds-ListCell > button,
  .proto-kit .overview-breakdown-cell .cds-ListCell > div > div,
  .proto-kit .overview-breakdown-cell .cds-ListCell > button > div,
  .proto-kit .overview-breakdown-cell .cds-ListCell [class*="HStack"],
  .proto-kit .overview-breakdown-cell .cds-ListCell [class*="VStack"] {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    margin-top: 0 !important;
    margin-bottom: 0 !important;
  }
  .proto-kit .overview-breakdown-cell .cds-ListCell {
    min-height: 40px !important;
  }
  .proto-kit .overview-breakdown-cell .cds-ListCell > div,
  .proto-kit .overview-breakdown-cell .cds-ListCell > button > div {
    min-height: 40px !important;
  }

  /* Caret accessories: use fg colour instead of the default fgMuted */
  .proto-kit [data-icon-name="caretRight"],
  .proto-kit [data-icon-name="caretLeft"] {
    color: var(--color-fg) !important;
  }

  /* Fixed bottom tab bar – stays at bottom when content scrolls */
  .proto-kit .proto-kit-bottom-tab-bar {
    flex-shrink: 0;
    min-height: 56px;
  }

  /* Header icon animations */
  @keyframes protoKitHeaderIconScaleUp {
    from {
      transform: scale(0.8);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  .proto-kit .header-icon-animate {
    animation: protoKitHeaderIconScaleUp 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  /* Restart icon animation */
  @keyframes protoKitRestartRotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(-360deg);
    }
  }

  .proto-kit .restart-icon-animate {
    animation: protoKitRestartRotate 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  /* Toast animations */
  @keyframes protoKitToastEnter {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  @keyframes protoKitToastExit {
    from {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
    to {
      opacity: 0;
      transform: translateX(-50%) translateY(-20px);
    }
  }

  .proto-kit .toast {
    animation: protoKitToastEnter 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  .proto-kit .toast-hiding {
    animation: protoKitToastExit 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  /* Toolbar animations */
  .proto-kit .toolbar-container {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes protoKitTooltipEnter {
    from {
      opacity: 0;
      transform: translateY(-4px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .proto-kit .toolbar-tooltip-animate {
    animation: protoKitTooltipEnter 0.15s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  /* Settings panel animation - starts at 0px from toolbar, ends 8px away */
  @keyframes protoKitSettingsPanelEnter {
    from {
      opacity: 0;
      transform: translateY(-8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .proto-kit .settings-panel-animate {
    animation: protoKitSettingsPanelEnter 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  /* Tray/bottom sheet animations */
  @keyframes protoKitTraySlideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  @keyframes protoKitTraySlideDown {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(100%);
    }
  }

  @keyframes protoKitOverlayFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes protoKitOverlayFadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  .proto-kit .tray-enter {
    animation: protoKitTraySlideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  .proto-kit .tray-exit {
    animation: protoKitTraySlideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  .proto-kit .overlay-enter {
    animation: protoKitOverlayFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  .proto-kit .overlay-exit {
    animation: protoKitOverlayFadeOut 0.3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  /* Circle background animation (for intro screens) */
  @keyframes protoKitCircleScaleUp {
    from {
      transform: translateX(-50%) scale(0.8);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) scale(1);
      opacity: 1;
    }
  }

  .proto-kit .circle-bg-animate {
    animation: protoKitCircleScaleUp 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  /* Canvas sticky note animations */
  @keyframes protoKitNoteAppear {
    from {
      opacity: 0;
      transform: scale(0.9) translateY(8px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }

  .proto-kit .canvas-note {
    animation: protoKitNoteAppear 0.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  }

  /* Fade wrapper for notes appearing/disappearing on screen change */
  .proto-kit .canvas-note-wrapper {
    transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* Tap hint focus-ring animation (global keyframes for fixed-position elements) */
  @keyframes protoKitHintPulse {
    0% {
      opacity: 0;
      transform: scale(0.92);
    }
    15% {
      opacity: 1;
      transform: scale(1);
    }
    85% {
      opacity: 1;
      transform: scale(1);
    }
    100% {
      opacity: 0;
      transform: scale(0.96);
    }
  }

  /* ── Home screen: collapsible chart ── */

  .proto-kit .chart-collapse {
    display: grid;
    grid-template-rows: 1fr;
    opacity: 1;
    transition: grid-template-rows 300ms cubic-bezier(0.16, 1, 0.3, 1),
                opacity 300ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .proto-kit .chart-collapse.collapsed {
    grid-template-rows: 0fr;
    opacity: 0;
    transition: grid-template-rows 200ms cubic-bezier(0.16, 1, 0.3, 1),
                opacity 200ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  .proto-kit .chart-collapse > .chart-collapse-inner {
    overflow: hidden;
    min-height: 0;
  }


  /* Ensure the LineChart fills the full collapse container width */
  .proto-kit .chart-collapse > .chart-collapse-inner > * {
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
  }

  /* Let the SVG overflow so the bottom of the chart line isn't clipped */
  .proto-kit .chart-collapse svg {
    overflow: visible !important;
  }


  /* Period selector: 32px pill tabs */
  .proto-kit .home-chart-period-selector [role="tablist"] {
    min-height: 32px !important;
    align-items: center !important;
  }
  .proto-kit .home-chart-period-selector [role="tablist"] > div {
    min-height: 0 !important;
    height: 32px !important;
  }
  .proto-kit .home-chart-period-selector button[role="tab"] {
    min-height: 32px !important;
    height: 32px !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
    line-height: 1 !important;
    border-radius: 1000px !important;
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
  }
`;
