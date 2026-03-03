import React from "react";
import type { ComponentProps } from "react";
import { Icon } from "@coinbase/cds-web/icons/Icon";
import { Text } from "@coinbase/cds-web/typography/Text";
import { ListCell } from "@coinbase/cds-web/cells";
import { Button } from "@coinbase/cds-web/buttons/Button";

import type { Region } from "../../RegionContext";
import btcIcon from "cryptocurrency-icons/svg/color/btc.svg";
import ethIcon from "cryptocurrency-icons/svg/color/eth.svg";
import usdcIcon from "cryptocurrency-icons/svg/color/usdc.svg";
import solIcon from "cryptocurrency-icons/svg/color/sol.svg";

// ---------------------------------------------------------------------------
// Balance formatting — all balances must show 2 decimal places (e.g. 10,000.00)
// ---------------------------------------------------------------------------

/** Prototype-only rate for GBP → USD conversion */
export const GBP_TO_USD = 1.27;

/** Fixed height for section title + balance so layout does not jump between Cash / Available to trade / In use screens */
export const SECTION_HEADER_HEIGHT = 80;

export function formatBalance(amount: number, region: Region = "UK"): string {
  if (region === "US") {
    const usd = amount * GBP_TO_USD;
    return `$${usd.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `£${amount.toLocaleString("en-GB", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ---------------------------------------------------------------------------
// Crypto icons
// ---------------------------------------------------------------------------

const CRYPTO_ICONS: Record<string, string> = {
  btc: btcIcon,
  eth: ethIcon,
  usdc: usdcIcon,
  sol: solIcon,
  shib: "https://assets.coingecko.com/coins/images/11939/small/shiba.png",
};

export function CryptoIcon({
  symbol,
  size = 32,
}: {
  symbol: keyof typeof CRYPTO_ICONS;
  size?: number;
}) {
  const src = CRYPTO_ICONS[symbol];
  if (!src) return null;
  return (
    <div
      style={{
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        flexShrink: 0,
        borderRadius: "50%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "var(--color-bgSecondary, #eee)",
      }}
    >
      <img
        src={src}
        alt={symbol.toUpperCase()}
        width={size}
        height={size}
        style={{ display: "block" }}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Circular icon badge used in Rewards and Automations sections
// ---------------------------------------------------------------------------

export function CircleIcon({
  name,
  bg,
  size = 32,
}: {
  /** CDS icon name */
  name: string;
  /** CSS color value for the background circle */
  bg: string;
  size?: number;
}) {
  return (
    <div
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: "50%",
        backgroundColor: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon name={name as any} color="fgInverse" size="s" />
    </div>
  );
}

/** Rounded square icon box with secondary background (Figma automation list cell style). */
export function SecondaryIconBox({
  name,
  size = 32,
  active,
  background,
  iconColor,
  borderRadius,
}: {
  /** CDS icon name */
  name: string;
  size?: number;
  /** When true, render icon in active state */
  active?: boolean;
  /** Override background (e.g. "white" for Do more cards) */
  background?: string;
  /** Override icon color (e.g. "fg" for black); default fg when background overridden, else fg */
  iconColor?: string;
  /** Override border radius (e.g. "50%" for circle) */
  borderRadius?: string;
}) {
  const bg = background ?? "white";
  const color = iconColor ?? "fg";
  const radius = borderRadius ?? "50%";
  return (
    <div
      style={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: radius,
        backgroundColor: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Icon name={name as any} color={color as any} size="s" active={active} />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared typography style for ListCell description overrides
// ---------------------------------------------------------------------------

export const descriptionLabel2: React.CSSProperties = {
  fontSize: "var(--fontSize-label2)",
  fontWeight: "var(--fontWeight-label2)",
  lineHeight: "var(--lineHeight-label2)",
};

// ---------------------------------------------------------------------------
// Configurable list cell for Automations section (reusable within section)
// ---------------------------------------------------------------------------

export interface AutomationListCellItem {
  title: string;
  description: string;
  detail: string;
  icon: string;
  buttonLabel: string;
  /** When true, render icon in active state */
  iconActive?: boolean;
}

export interface AutomationListCellProps {
  item: AutomationListCellItem;
  /** Override the end action; if not set, renders a secondary Button with item.buttonLabel */
  end?: React.ReactNode;
  /** Set to false when the end contains its own interactive element (e.g. Switch) */
  renderAsPressable?: boolean;
}

const automationTitleStyles: React.CSSProperties = {
  fontSize: "var(--fontSize-headline)",
  fontWeight: "var(--fontWeight-headline)",
  lineHeight: "var(--lineHeight-headline)",
};

const automationDescriptionStyles: React.CSSProperties = {
  ...descriptionLabel2,
  color: "var(--color-fgMuted)",
};

function AutomationListCellMedia({ item }: { item: AutomationListCellItem }) {
  return <SecondaryIconBox name={item.icon} active={item.iconActive} />;
}

export function AutomationListCell({ item, end, renderAsPressable }: AutomationListCellProps) {
  return (
    <ListCell
      title={item.title}
      description={item.description}
      detail={item.detail}
      multiline
      renderAsPressable={renderAsPressable}
      styles={{
        title: automationTitleStyles,
        description: automationDescriptionStyles,
      }}
      media={<AutomationListCellMedia item={item} />}
      priority="end"
      end={
        end ?? (
          <Button variant="secondary" compact>
            {item.buttonLabel}
          </Button>
        )
      }
    />
  );
}

// ---------------------------------------------------------------------------
// Configurable list cell for Rewards-style rows (reusable across sections/versions)
// ---------------------------------------------------------------------------

export interface RewardsListCellItem {
  title: string;
  description: string;
  detail: string;
  subdetail: string;
  icon: string;
  iconBg: string;
  buttonLabel: string;
}

export type RewardsListCellEndVariant = "button" | "detail";

export interface RewardsListCellProps {
  item: RewardsListCellItem;
  /** Override description text color (default: var(--color-fgPositive)) */
  descriptionColor?: string;
  /** When "detail", the end slot shows item.detail instead of the button; when "button" (default), shows the secondary button */
  endVariant?: RewardsListCellEndVariant;
  /** Override the end action; if set, takes precedence over endVariant (used for custom end content) */
  end?: React.ReactNode;
}

export function RewardsListCell({ item, descriptionColor, endVariant = "button", end }: RewardsListCellProps) {
  const descriptionStyle: React.CSSProperties = {
    ...descriptionLabel2,
    color: descriptionColor ?? "var(--color-fgPositive)",
  };

  const endContent =
    end !== undefined
      ? end
      : endVariant === "detail"
        ? (
            <Text font="label2" display="block" textAlign="end" color="fgMuted">
              +{item.detail}
            </Text>
          )
        : (
            <Button variant="secondary" compact>
              {item.buttonLabel}
            </Button>
          );

  return (
    <CashListCell
      title={item.title}
      description={item.description}
      detail={item.detail}
      multiline
      subdetailNode={
        <Text font="label2" display="block" textAlign="end" color="fgMuted">
          {item.subdetail}
        </Text>
      }
      styles={{ description: descriptionStyle }}
      media={<CircleIcon name={item.icon} bg={item.iconBg} />}
      priority="end"
      end={endContent}
    />
  );
}

// ---------------------------------------------------------------------------
// Standard asset / transaction list cell for cash screens.
// Delegates entirely to AppListCell — the single source of truth for all
// list rows in the prototype. Change AppListCell to update everything.
// ---------------------------------------------------------------------------

import { AppListCell } from "../../AppListCell";

type CashListCellProps = Omit<ComponentProps<typeof AppListCell>, "paddingX"> & {
  /** Horizontal padding inside the pressable zone. Defaults to 24px. */
  pressablePaddingX?: number;
};

export const CashListCell = ({ pressablePaddingX = 24, ...props }: CashListCellProps) => (
  <AppListCell paddingX={pressablePaddingX} {...props} />
);
