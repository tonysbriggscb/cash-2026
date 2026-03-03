import { VStack, HStack } from "@coinbase/cds-web/layout";
import { Text } from "@coinbase/cds-web/typography/Text";
import { SectionHeader } from "@coinbase/cds-web/section-header";
import { Divider } from "@coinbase/cds-web/layout";

import { PrototypeMediaCard } from "../../../proto-kit";
import { defaultOverviewData } from "./data";
import { CashListCell, CryptoIcon, formatBalance, SECTION_HEADER_HEIGHT } from "./shared";
import { useRegion } from "../../RegionContext";
import type { Region } from "../../RegionContext";

const availableToTradeAmount =
  defaultOverviewData.breakdown.find((i) => i.label === "Available to trade")?.amount ?? 10_000;

/** Split available-to-trade total into USDC and the regional fiat currency (50/50 for prototype). */
function getBreakdown(total: number, region: Region) {
  const half = Math.floor(total / 2);
  if (region === "UK") {
    return [
      { label: "GBP", amount: total - half, mediaType: "fiat-gbp" as const },
      { label: "USDC", amount: half, mediaType: "usdc" as const },
    ];
  }
  return [
    { label: "US Dollar", amount: total - half, mediaType: "fiat-usd" as const },
    { label: "USDC", amount: half, mediaType: "usdc" as const },
  ];
}

const YOU_MAY_ALSO_LIKE_UK: Array<{ title: string; description: string; icon: string }> = [
  { title: "Crypto", description: "See what's trending", icon: "crypto" },
  { title: "Save", description: "Earn interest on your cash", icon: "savingsBank" },
];

const YOU_MAY_ALSO_LIKE_US: Array<{ title: string; description: string; icon: string }> = [
  { title: "Crypto", description: "See what's trending", icon: "crypto" },
  { title: "Predictions", description: "Predict the outcome of events", icon: "nft" },
  { title: "Stocks", description: "Buy shares in public companies", icon: "candlesticks" },
  { title: "Derivatives", description: "Trade perps and futures", icon: "derivativesProductNew" },
];

function FiatIcon({ symbol }: { symbol: "$" | "£" }) {
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
        fontSize: 14,
        fontWeight: 500,
        color: "var(--color-fgInverse)",
      }}
    >
      {symbol}
    </div>
  );
}

export function AvailableToTradeScreen() {
  const { region } = useRegion();
  const totalFormatted = formatBalance(availableToTradeAmount, region);
  const breakdown = getBreakdown(availableToTradeAmount, region);

  return (
    <VStack
      gap={0}
      style={{
        flex: 1,
        minHeight: 0,
        overflow: "auto",
        paddingBottom: 60,
      }}
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
          Available to trade
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
        The amount of cash that is currently available to trade on Coinbase.
      </Text>

      <VStack gap={0} className="available-to-trade-breakdown">
        {breakdown.map((row) => (
          <CashListCell
            key={row.label}
            title={row.label}
            detail={formatBalance(row.amount, region)}
            media={
              row.mediaType === "usdc" ? (
                <CryptoIcon symbol="usdc" size={32} />
              ) : row.mediaType === "fiat-gbp" ? (
                <FiatIcon symbol="£" />
              ) : (
                <FiatIcon symbol="$" />
              )
            }
          />
        ))}
      </VStack>

      <Divider direction="horizontal" style={{ marginTop: 8 }} />

      <VStack gap={0} style={{ paddingTop: 16, paddingBottom: 16 }}>
        <SectionHeader
          title={
            <Text as="h3" display="block" font="title3">
              You may also like
            </Text>
          }
          paddingX={3}
        />
        <VStack gap={0} style={{ paddingLeft: 24, paddingRight: 24 }}>
          <HStack gap={0} style={{ flexWrap: "wrap", gap: 8 }}>
            {(region === "UK" ? YOU_MAY_ALSO_LIKE_UK : YOU_MAY_ALSO_LIKE_US).map((item) => (
              <div key={item.title} style={{ width: "calc(50% - 4px)", minWidth: 0 }}>
                <PrototypeMediaCard item={item} layout="stacked" />
              </div>
            ))}
          </HStack>
        </VStack>
      </VStack>
    </VStack>
  );
}
