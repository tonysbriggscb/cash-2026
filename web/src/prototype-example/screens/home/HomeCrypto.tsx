import { Button } from "@coinbase/cds-web/buttons/Button";
import { Text } from "@coinbase/cds-web/typography/Text";
import { Icon } from "@coinbase/cds-web/icons/Icon";
import { CRYPTO_ASSETS } from "./constants/mock-crypto";
import { CryptoIcon, formatBalance } from "../cash/shared";
import { PERIOD_CHANGES } from "./constants/mock-portfolio";
import type { TimePeriod } from "./constants/mock-portfolio";
import { useRegion } from "../../RegionContext";
import { HomeListCell } from "./shared";

interface HomeCryptoProps {
  period: TimePeriod;
}

export const HomeCrypto = ({ period }: HomeCryptoProps) => {
  const { region } = useRegion();
  const { change, changePercent } = PERIOD_CHANGES[period];
  const isNegative = change < 0;
  const trendColor = isNegative ? "fgNegative" : "fgPositive";
  const changeFormatted = formatBalance(Math.abs(change), region);
  const percentFormatted = `(${Math.abs(changePercent).toFixed(2)}%)`;

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "24px 24px 16px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Text as="h2" font="title3">
            Crypto
          </Text>
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Icon
              name={isNegative ? "diagonalDownArrow" : "diagonalUpArrow"}
              color={trendColor as "fgNegative" | "fgPositive"}
              size="xs"
            />
            <Text as="span" font="label2" color={trendColor as "fgNegative" | "fgPositive"}>
              {changeFormatted} {percentFormatted} today
            </Text>
          </span>
        </div>
        <button
          onClick={() => {}}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 40,
            height: 40,
            borderRadius: 20,
            background: "var(--color-bgSecondary)",
            border: "none",
            cursor: "pointer",
            flexShrink: 0,
          }}
          aria-label="View all"
        >
          <Icon name="forwardArrow" size="s" dangerouslySetColor="var(--color-fg)" />
        </button>
      </div>

      {CRYPTO_ASSETS.map((item) => (
        <HomeListCell
          key={item.id}
          title={item.name}
          description={
            <Text as="span" font="label2" color="fgMuted">
              {item.symbol}
            </Text>
          }
          media={
            <div style={{ width: 32, height: 32, borderRadius: 16, overflow: "hidden", flexShrink: 0 }}>
              <CryptoIcon
                symbol={item.id as "btc" | "eth" | "sol" | "usdc" | "shib"}
                size={32}
              />
            </div>
          }
          detail={formatBalance(item.amount, region)}
          subdetailNode={
            <span style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
              <Icon
                name={isNegative ? "diagonalDownArrow" : "diagonalUpArrow"}
                color={trendColor as "fgNegative" | "fgPositive"}
                size="xs"
              />
              <Text as="span" font="label2" color={trendColor}>
                {changeFormatted} {percentFormatted}
              </Text>
            </span>
          }
          variant={isNegative ? "negative" : "positive"}
          onClick={() => {}}
        />
      ))}

      <div style={{ padding: "16px 24px 24px" }}>
        <Button variant="secondary" compact width="100%" onClick={() => {}}>
          Show more
        </Button>
      </div>
    </div>
  );
};
