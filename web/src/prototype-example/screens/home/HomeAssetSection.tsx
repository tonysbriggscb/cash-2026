import { Button } from "@coinbase/cds-web/buttons/Button";
import { Text } from "@coinbase/cds-web/typography/Text";
import { Icon } from "@coinbase/cds-web/icons/Icon";
import { HomeListCell } from "./shared";
import { CryptoIcon } from "../cash/shared";
import type { AssetItem } from "./constants/mock-us-assets";

interface HomeAssetSectionProps {
  title: string;
  items: AssetItem[];
}

/** Inline SVG brand logos for known stock IDs — no network requests needed */
function StockIcon({ id, size }: { id: string; size: number }) {
  if (id === "aapl") {
    return (
      <div style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: "#000", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
        <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 24 24" fill="#fff">
          <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.46 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
        </svg>
      </div>
    );
  }

  if (id === "goog") {
    return (
      <div style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)" }}>
        <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
      </div>
    );
  }

  if (id === "tsla") {
    return (
      <div style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden", boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.08)" }}>
        <svg width={size * 0.65} height={size * 0.65} viewBox="0 0 24 24" fill="#E31937">
          <path d="M12 5.362l2.475-3.026A10.54 10.54 0 0 1 17.415 3h.79L21 0H3l2.795 3h.79A10.54 10.54 0 0 1 9.525 2.336L12 5.362zM12 24L4.115 7.47C4.11 7.471 0 6.306 0 3h5.13c.84.001 3.246.588 3.246.588L12 11.87l3.624-8.282S18.03 3.001 18.87 3H24c0 3.306-4.11 4.471-4.115 4.47L12 24z" />
        </svg>
      </div>
    );
  }

  // Generic fallback: letter badge
  return (
    <div style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: "var(--color-bgSecondary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
      <Text as="span" font="label2" color="fg">{id.slice(0, 1).toUpperCase()}</Text>
    </div>
  );
}

function formatUSD(amount: number) {
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export const HomeAssetSection = ({ title, items }: HomeAssetSectionProps) => {
  const totalUSD = items.reduce((s, i) => s + i.amountUSD, 0);

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
            {title}
          </Text>
          <Text font="label2" color="fgMuted">
            {formatUSD(totalUSD)} total
          </Text>
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
          aria-label={`View all ${title}`}
        >
          <Icon name="forwardArrow" size="s" dangerouslySetColor="var(--color-fg)" />
        </button>
      </div>

      {items.map((item) => {
        const isNegative = item.changePercent < 0;
        const trendColor = isNegative ? "fgNegative" : "fgPositive";
        const sign = isNegative ? "-" : "+";
        return (
          <HomeListCell
            key={item.id}
            title={item.name}
            description={
              <Text as="span" font="label2" color="fgMuted">
                {item.symbol}
              </Text>
            }
            media={
              item.iconType === "stock" ? (
                <StockIcon id={item.id} size={32} />
              ) : (
                <CryptoIcon
                  symbol={item.symbol.toLowerCase() as "btc" | "eth" | "sol" | "usdc" | "shib"}
                  size={32}
                />
              )
            }
            detail={formatUSD(item.amountUSD)}
            subdetailNode={
              <span style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4 }}>
                <Icon
                  name={isNegative ? "diagonalDownArrow" : "diagonalUpArrow"}
                  color={trendColor as "fgNegative" | "fgPositive"}
                  size="xs"
                />
                <Text as="span" font="label2" color={trendColor}>
                  {sign}{Math.abs(item.changePercent).toFixed(2)}%
                </Text>
              </span>
            }
            onClick={() => {}}
          />
        );
      })}

      <div style={{ padding: "16px 24px 24px" }}>
        <Button variant="secondary" compact width="100%" onClick={() => {}}>
          Show more
        </Button>
      </div>
    </div>
  );
};
