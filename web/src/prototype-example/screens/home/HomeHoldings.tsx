import { Icon } from "@coinbase/cds-web/icons/Icon";
import { HOLDINGS } from "./constants/mock-holdings";
import { defaultOverviewData, getCashDisplayTotal } from "../cash/data";
import { formatBalance } from "../cash/shared";
import { useRegion } from "../../RegionContext";
import { HomeListCell } from "./shared";

export const HomeHoldings = ({ onNavigate }: { onNavigate?: (screen: string) => void }) => {
  const { region } = useRegion();
  const cashDetail = formatBalance(getCashDisplayTotal(region), region);
  const cashName = region === "US" ? "Cash" : defaultOverviewData.title;

  return (
    <div style={{ paddingTop: 4, paddingBottom: 8, paddingLeft: 0, paddingRight: 0 }}>
      {HOLDINGS.map((holding) => {
        const isCash = holding.id === "cash";
        const handleClick = isCash ? () => onNavigate?.("cash") : undefined;
        return (
          <div
            key={holding.id}
            onClick={handleClick}
            style={{ cursor: handleClick ? "pointer" : undefined }}
          >
            <HomeListCell
              title={isCash ? cashName : holding.name}
              detail={
                isCash
                  ? cashDetail
                  : holding.balanceGBP != null
                    ? formatBalance(holding.balanceGBP, region)
                    : undefined
              }
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
          </div>
        );
      })}
    </div>
  );
};
