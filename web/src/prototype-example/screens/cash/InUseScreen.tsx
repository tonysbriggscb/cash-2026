import { VStack } from "@coinbase/cds-web/layout";
import { Text } from "@coinbase/cds-web/typography/Text";
import { Icon } from "@coinbase/cds-web/icons/Icon";
import React from "react";

import { defaultOverviewData } from "./data";
import { CashListCell, formatBalance, CryptoIcon, SECTION_HEADER_HEIGHT } from "./shared";
import { useRegion } from "../../RegionContext";

const inUseAmount =
  defaultOverviewData.breakdown.find((i) => i.label === "In use")?.amount ?? 5_000;

// ---------------------------------------------------------------------------
// Shared styles
// ---------------------------------------------------------------------------


// ---------------------------------------------------------------------------
// UK components
// ---------------------------------------------------------------------------

function FiatGbpIcon() {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        backgroundColor: "var(--color-bgPositive)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon name="savingsBank" size="s" dangerouslySetColor="white" />
    </div>
  );
}

function BlockSectionHeader({ title }: { title: string }) {
  return (
    <Text
      font="caption"
      color="fgMuted"
      style={{ marginBottom: 8, paddingLeft: 24, paddingRight: 24, textTransform: "uppercase" }}
    >
      {title}
    </Text>
  );
}

// ---------------------------------------------------------------------------
// US components
// ---------------------------------------------------------------------------

interface USCellProps {
  media: React.ReactNode;
  title: string;
  description: React.ReactNode;
  detail: string;
}

function USCell({ media, title, description, detail }: USCellProps) {
  const [hovered, setHovered] = React.useState(false);
  return (
    <div
      onClick={() => {}}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 4,
        paddingBottom: 4,
        minHeight: 48,
        cursor: "pointer",
        backgroundColor: hovered ? "var(--color-bgSecondary)" : "transparent",
        transition: "background-color 0.15s ease",
      }}
    >
      <div style={{ flexShrink: 0 }}>{media}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <Text font="headline" color="fg" style={{ display: "block" }}>{title}</Text>
        <div style={{ marginTop: 1 }}>
          {typeof description === "string" ? (
            <Text font="label2" color="fgMuted">{description}</Text>
          ) : (
            description
          )}
        </div>
      </div>
      <Text font="headline" color="fg" style={{ flexShrink: 0 }}>{detail}</Text>
    </div>
  );
}

function USSectionHeader({ title }: { title: string }) {
  return (
    <Text
      font="caption"
      color="fgMuted"
      style={{
        paddingLeft: 24,
        paddingRight: 24,
        paddingTop: 24,
        paddingBottom: 8,
        textTransform: "uppercase",
        display: "block",
      }}
    >
      {title}
    </Text>
  );
}

function PredictionsIcon() {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        backgroundColor: "var(--color-bgSecondary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 16,
        flexShrink: 0,
      }}
    >
      👍
    </div>
  );
}

function LendingIcon() {
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        backgroundColor: "var(--color-bgSecondary)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon name="percentBadge" size="s" color="fg" />
    </div>
  );
}

function AvailableTag() {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        marginTop: 2,
      }}
    >
      <Text font="label2" color="fgMuted">
        Available
      </Text>
      <Icon name="info" size="xs" color="fgMuted" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// UK screen
// ---------------------------------------------------------------------------

function InUseScreenUK() {
  const { region } = useRegion();
  const totalFormatted = formatBalance(inUseAmount, region);

  return (
    <VStack
      gap={0}
      style={{ flex: 1, minHeight: 0, overflow: "auto", paddingBottom: 60 }}
    >
      <VStack
        gap={0}
        style={{
          paddingTop: 14,
          paddingBottom: 16,
          paddingLeft: 24,
          paddingRight: 24,
          height: SECTION_HEADER_HEIGHT,
          flexShrink: 0,
        }}
      >
        <Text as="h1" font="title3" color="fg" style={{ marginBottom: 2 }}>
          In use
        </Text>
        <Text font="title2" color="fg">
          {totalFormatted}
        </Text>
      </VStack>

      <Text
        font="body"
        color="fgMuted"
        style={{ paddingLeft: 24, paddingRight: 24, marginTop: 16, marginBottom: 12 }}
      >
        The amount of cash that is currently being used for the following positions.
      </Text>

      <VStack gap={0} style={{ paddingLeft: 0, paddingRight: 0 }}>
        <VStack gap={0} style={{ marginTop: 24 }}>
          <BlockSectionHeader title="Savings" />
          <VStack gap={0} className="in-use-breakdown">
            <CashListCell
              title="GBP Savings"
              description={
                <Text font="label2" color="fgPositive">
                  3.50% AER
                </Text>
              }
              detail={formatBalance(inUseAmount, region)}
              media={<FiatGbpIcon />}
              multiline
            />
          </VStack>
        </VStack>
      </VStack>
    </VStack>
  );
}

// ---------------------------------------------------------------------------
// US screen
// ---------------------------------------------------------------------------

function InUseScreenUS() {
  const totalFormatted = "$6,350.00";

  return (
    <VStack
      gap={0}
      style={{ flex: 1, minHeight: 0, overflow: "auto", paddingBottom: 60 }}
    >
      {/* Header */}
      <VStack
        gap={0}
        style={{
          paddingTop: 14,
          paddingBottom: 16,
          paddingLeft: 24,
          paddingRight: 24,
          height: SECTION_HEADER_HEIGHT,
          flexShrink: 0,
        }}
      >
        <Text as="h1" font="title3" color="fg" style={{ marginBottom: 2 }}>
          In use
        </Text>
        <Text font="title2" color="fg">
          {totalFormatted}
        </Text>
      </VStack>

      <Text
        font="body"
        color="fgMuted"
        style={{ paddingLeft: 24, paddingRight: 24, marginTop: 16, marginBottom: 4 }}
      >
        The amount of cash that is currently being used for the following positions.
      </Text>

      {/* Lending */}
      <USSectionHeader title="Lending" />
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <USCell
          media={<CryptoIcon symbol="usdc" />}
          title="Steakhouse USDC"
          description={<Text font="label2" color="fgPositive">7.20% APY</Text>}
          detail="$1,000.00"
        />
      </div>

      {/* Limit Orders */}
      <USSectionHeader title="Limit orders" />
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <USCell
          media={<CryptoIcon symbol="shib" />}
          title="SHIB limit sell"
          description="Sell @ $0.000024"
          detail="$1,000.00"
        />
        <USCell
          media={<CryptoIcon symbol="btc" />}
          title="BTC limit buy"
          description="Buy @ $60,000.00"
          detail="$1,000.00"
        />
      </div>

      {/* Derivatives */}
      <USSectionHeader title="Derivatives" />
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <USCell
          media={<CryptoIcon symbol="btc" />}
          title="Sell BTC PERP"
          description="2 contracts"
          detail="$1,000.00"
        />
      </div>

      {/* Predictions */}
      <USSectionHeader title="Predictions" />
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <USCell
          media={<PredictionsIcon />}
          title="Sell Yes · Noah Wyle"
          description="Emmy Award for Drama Actor?"
          detail="$1,000.00"
        />
      </div>
    </VStack>
  );
}

// ---------------------------------------------------------------------------
// Main export — region-switched
// ---------------------------------------------------------------------------

export function InUseScreen() {
  const { region } = useRegion();
  return region === "US" ? <InUseScreenUS /> : <InUseScreenUK />;
}
