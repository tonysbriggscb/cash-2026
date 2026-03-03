import { Icon } from "@coinbase/cds-web/icons/Icon";
import { Button } from "@coinbase/cds-web/buttons/Button";
import { Text } from "@coinbase/cds-web/typography/Text";
import { Sparkline } from "@coinbase/cds-web-visualization";
import { useSparklinePath } from "@coinbase/cds-common/visualizations/useSparklinePath";
import { WATCHLIST } from "./constants/mock-watchlist";
import { CryptoIcon, formatBalance } from "../cash/shared";
import { useRegion } from "../../RegionContext";
import { HomeListCell } from "./shared";

const SPARK_WIDTH = 56;
const SPARK_HEIGHT = 28;

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const path = useSparklinePath({ data, width: SPARK_WIDTH, height: SPARK_HEIGHT });
  return (
    <div style={{ width: SPARK_WIDTH, height: SPARK_HEIGHT, flexShrink: 0 }}>
      <Sparkline path={path} color={color} width={SPARK_WIDTH} height={SPARK_HEIGHT} />
    </div>
  );
}

export const HomeWatchlist = () => {
  const { region } = useRegion();
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
        <Text as="h2" font="title3">
          Watchlist
        </Text>
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

      {WATCHLIST.map((item) => {
        const isNegative = item.changePercent < 0;
        const sparkColor = isNegative
          ? "var(--color-fgNegative)"
          : "var(--color-fgPositive)";

        return (
          <HomeListCell
            key={item.id}
            title={item.name}
            description={
              item.apyLabel ? (
                <Text as="span" color="fgPositive" font="label2">
                  {item.apyLabel}
                </Text>
              ) : (
                <Text as="span" font="label2" color="fgMuted">{item.symbol}</Text>
              )
            }
            media={
              <CryptoIcon
                symbol={item.id as "btc" | "eth" | "sol" | "usdc" | "shib"}
                size={32}
              />
            }
            intermediary={<MiniSparkline data={item.sparkline} color={sparkColor} />}
            detail={formatBalance(item.price, region)}
            subdetailNode={
              <Text font="label2" display="block" textAlign="end" color={isNegative ? "fgNegative" : "fgPositive"}>
                {isNegative ? "↘" : "↗"} {Math.abs(item.changePercent).toFixed(2)}%
              </Text>
            }
            variant={isNegative ? "negative" : "positive"}
            onClick={() => {}}
          />
        );
      })}

      {region !== "US" && (
        <div style={{ padding: "16px 24px 0" }}>
          <p
            style={{
              margin: 0,
              lineHeight: "140%",
              fontSize: "var(--fontSize-legal)",
              color: "var(--color-fgMuted)",
              fontFamily: "inherit",
            }}
          >
            Past performance is not a reliable indicator of future results. APYs
            are indicative, and may vary.{" "}
            <span
              style={{
                color: "var(--color-fgAccent)",
                textDecoration: "underline",
              }}
            >
              Learn more about asset risks
            </span>
          </p>
        </div>
      )}

      <div style={{ padding: "16px 24px 24px" }}>
        <Button variant="secondary" compact width="100%" onClick={() => {}}>
          Manage
        </Button>
      </div>
    </div>
  );
};
