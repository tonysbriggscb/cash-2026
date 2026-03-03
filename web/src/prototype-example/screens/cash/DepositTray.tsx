import { useEffect, useState } from "react";
import { ListCell } from "@coinbase/cds-web/cells";
import { Icon } from "@coinbase/cds-web/icons/Icon";
import { Tag } from "@coinbase/cds-web/tag";
import { Text } from "@coinbase/cds-web/typography/Text";
import type { TrayProps } from "../../../proto-kit";
import { useRegion } from "../../RegionContext";

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

const UK_OPTIONS = [
  { title: "Deposit cash", description: "Transfer funds from your bank", icon: "bank" },
  { title: "Deposit into GBP Savings", description: "Earn 3.5% AER, FSCS protected", icon: "savingsBank", descriptionPositive: true },
  { title: "Receive USDC", description: "Receive from another crypto wallet", icon: "arrowDown" },
] as const;

const US_OPTIONS = [
  { title: "Deposit cash", description: "Transfer funds from your bank", icon: "bank" },
  { title: "Receive USDC", description: "Receive from another crypto wallet", icon: "arrowDown" },
  { title: "Wire transfer", description: "For large transfers", icon: "wireTransfer" },
  { title: "Direct deposit", description: "Send your paycheck to Coinbase", icon: "directDepositIcon" },
] as const;

export function DepositTray({ visible, onClose, onNavigate }: TrayProps) {
  const { region } = useRegion();
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
      // Trigger enter animation on next tick so the element is in the DOM first
      requestAnimationFrame(() => {
        setAnimClass("tray-enter");
        setOverlayClass("overlay-enter");
      });
    } else {
      setAnimClass("tray-exit");
      setOverlayClass("overlay-exit");
      // Unmount after animation completes
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

        {/* List cells — US: 4 options per Figma; UK: 3 options */}
        {region === "US"
          ? US_OPTIONS.map((opt) => (
              <ListCell
                key={opt.title}
                title={opt.title}
                description={<Text font="label2" color="fgMuted">{opt.description}</Text>}
                media={<IconMedia name={opt.icon} />}
                onClick={
                  opt.title === "Deposit cash"
                    ? () => onNavigate?.("depositInput")
                    : onClose
                }
                styles={{ root: { paddingTop: 4, paddingBottom: 4 } }}
                {...(opt.title === "Wire transfer" && { detail: <Tag colorScheme="green">No limit</Tag> })}
                {...(opt.accessory != null && { accessory: opt.accessory })}
              />
            ))
          : UK_OPTIONS.map((opt) => (
              <ListCell
                key={opt.title}
                title={opt.title}
                description={
                  opt.descriptionPositive ? (
                    <Text font="label2" color="fgMuted" as="span">
                      <Text font="label2" color="fgPositive" as="span">Earn 3.5% AER</Text>
                      {", FSCS protected"}
                    </Text>
                  ) : (
                    <Text font="label2" color="fgMuted">{opt.description}</Text>
                  )
                }
                media={<IconMedia name={opt.icon} />}
                onClick={
                  opt.title === "Deposit cash"
                    ? () => onNavigate?.("depositInput")
                    : onClose
                }
                styles={{ root: { paddingTop: 4, paddingBottom: 4 } }}
              />
            ))}

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
        </div>{/* end inner sheet */}
      </div>{/* end sheet wrapper */}
    </div>
  );
}
