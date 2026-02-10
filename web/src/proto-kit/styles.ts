/**
 * Global styles for the Proto Kit
 * These handle animations, transitions, and scrollbar hiding
 */
export const protoKitStyles = `
  /* Hide scrollbars globally */
  .proto-kit *::-webkit-scrollbar {
    display: none;
  }
  .proto-kit * {
    -ms-overflow-style: none;
    scrollbar-width: none;
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
`;
