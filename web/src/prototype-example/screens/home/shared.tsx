import type { ComponentProps } from "react";
import { ListCell } from "@coinbase/cds-web/cells";

/**
 * Thin wrapper around CDS ListCell that locks in the consistent row spacing
 * used throughout all home-screen asset lists (Holdings, Crypto, Watchlist).
 *
 * Keeps every section visually identical without repeating the same spacing
 * props in three different places.
 */
type HomeListCellProps = Omit<
  ComponentProps<typeof ListCell>,
  "spacingVariant" | "outerSpacing" | "styles"
>;

export const HomeListCell = (props: HomeListCellProps) => (
  <ListCell
    {...props}
    spacingVariant="condensed"
    outerSpacing={{ paddingX: 0, paddingY: 0 }}
    styles={{
      root: { paddingTop: 0, paddingBottom: 0, marginTop: 0, marginBottom: 0 },
      contentContainer: { paddingTop: 4, paddingBottom: 4 },
    }}
  />
);
