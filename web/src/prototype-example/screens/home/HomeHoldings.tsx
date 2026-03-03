import { Icon } from "@coinbase/cds-web/icons/Icon";
import { HOLDINGS, US_ONLY_HOLDINGS } from "./constants/mock-holdings";
import { defaultOverviewData, getCashDisplayTotal } from "../cash/data";
import { formatBalance } from "../cash/shared";
import { useRegion } from "../../RegionContext";
import { HomeListCell } from "./shared";

export const HomeHoldings = ({ onNavigate }: { onNavigate?: (screen: string) => void }) => {
  const { region } = useRegion();
  const isUS = region === "US";
  const cashDetail = formatBalance(getCashDisplayTotal(region), region);
  const cashName = isUS ? "Cash" : defaultOverviewData.title;

  // For US: crypto → stocks → derivatives → predictions → cash
  // For other regions: crypto → cash
  const [cryptoHolding, cashHolding] = HOLDINGS;
  const orderedHoldings = isUS
    ? [cryptoHolding, ...US_ONLY_HOLDINGS, cashHolding]
    : HOLDINGS;

  return (
    <div style={{ paddingTop: 8, paddingBottom: 16, paddingLeft: 0, paddingRight: 0 }}>
      {orderedHoldings.map((holding) => {
        const isCash = holding.id === "cash";
        let detail: string | undefined;
        if (isCash) {
          detail = cashDetail;
        } else if (holding.balanceGBP != null) {
          detail = formatBalance(holding.balanceGBP, region);
        } else if (holding.balanceUSD != null) {
          detail = `$${holding.balanceUSD.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        }

        return (
          <HomeListCell
            key={holding.id}
            title={isCash ? cashName : holding.name}
            detail={detail}
            onClick={isCash ? () => onNavigate?.("cash") : undefined}
            media={
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 16,
                  background: "var(--color-bgSecondary)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Icon
                  name={holding.iconName as any}
                  size="s"
                  dangerouslySetColor="var(--color-fg)"
                />
              </div>
            }
          />
        );
      })}
    </div>
  );
};
