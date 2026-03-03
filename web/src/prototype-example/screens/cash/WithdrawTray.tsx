import { useEffect, useState } from "react";
import { ListCell } from "@coinbase/cds-web/cells";
import { Icon } from "@coinbase/cds-web/icons/Icon";
import { Text } from "@coinbase/cds-web/typography/Text";
import type { TrayProps } from "../../../proto-kit";

function IconMedia({ name }: { name: string }) {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        backgroundColor: "var(--color-bgPrimary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon name={name as any} size="s" color="fgInverse" />
    </div>
  );
}

export function WithdrawTray({ visible, onClose }: TrayProps) {
  const [rendered, setRendered] = useState(visible);
  const [animClass, setAnimClass] = useState<"tray-enter" | "tray-exit" | "">(
    visible ? "tray-enter" : ""
  );
  const [overlayClass, setOverlayClass] = useState<"overlay-enter" | "overlay-exit" | "">(
    visible ? "overlay-enter" : ""
  );

  useEffect(() => {
    if (visible) {
      setRendered(true);
      requestAnimationFrame(() => {
        setAnimClass("tray-enter");
        setOverlayClass("overlay-enter");
      });
    } else {
      setAnimClass("tray-exit");
      setOverlayClass("overlay-exit");
      const timer = setTimeout(() => setRendered(false), 310);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!rendered) return null;

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      {/* Backdrop */}
      <div
        className={overlayClass}
        onClick={onClose}
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        }}
      />

      {/* Sheet wrapper: pill above + white sheet below */}
      <div
        className={animClass}
        style={{ position: "relative" }}
      >
        {/* Drag handle — floats 4px above the sheet */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            position: "absolute",
            top: -12,
            left: 0,
            right: 0,
          }}
        >
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 100,
              backgroundColor: "rgba(255,255,255,0.6)",
            }}
          />
        </div>

        {/* Sheet — 16px padding top of options block; bottom padding only on home indicator (8px below pill) */}
        <div
          style={{
            backgroundColor: "var(--color-bg)",
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            overflow: "hidden",
            paddingTop: 16,
          }}
        >
          {/* List cells */}
          <ListCell
            title="Withdraw cash"
            description={<Text font="label2" color="fgMuted">Transfer funds to your bank</Text>}
            media={<IconMedia name="bank" />}
            onClick={onClose}
            styles={{ root: { paddingTop: 4, paddingBottom: 4 } }}
          />
          <ListCell
            title="Withdraw from GBP savings"
            description={<Text font="label2" color="fgMuted">From your FSCS protected account</Text>}
            media={<IconMedia name="savingsBank" />}
            onClick={onClose}
            styles={{ root: { paddingTop: 4, paddingBottom: 4 } }}
          />

          {/* Home indicator — 16px between options and pill, 8px below pill */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              paddingTop: 16,
              paddingBottom: 8,
            }}
          >
            <div
              style={{
                width: 134,
                height: 5,
                borderRadius: 100,
                backgroundColor: "var(--color-fg)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
