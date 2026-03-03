/**
 * AppListCell — the single source of truth for all asset/transaction rows
 * across the prototype (home screen and cash screen alike).
 *
 * Every list row in the app uses this component, so any change here
 * propagates everywhere automatically. Callers only supply props that
 * differ from the defaults:
 *
 *   paddingX  — horizontal padding on the pressable (default 24px for cash
 *               screens; pass 0 for home-screen rows where the parent
 *               section already provides horizontal context).
 */
import { useState } from "react";
import type { ComponentProps } from "react";
import { ListCell } from "@coinbase/cds-web/cells";

type ListCellStyleSlots = NonNullable<ComponentProps<typeof ListCell>["styles"]>;

type AppListCellProps = Omit<ComponentProps<typeof ListCell>, "spacingVariant" | "outerSpacing"> & {
  /** Horizontal padding applied to the pressable element (default 24). */
  paddingX?: number;
  styles?: ListCellStyleSlots;
};

export const AppListCell = ({
  paddingX = 24,
  styles: stylesProp,
  ...props
}: AppListCellProps) => {
  const [hovered, setHovered] = useState(false);

  // Multi-line rows get 8px vertical content padding for breathing room.
  // Single-line rows use minHeight: 40 on the pressable to override the CDS
  // condensed default of 56px (padding stays 0 so the row is exactly 40px).
  const isMultiLine =
    props.description != null ||
    props.descriptionNode != null ||
    props.subtitle != null ||
    props.subtitleNode != null ||
    props.subdetail != null ||
    props.subdetailNode != null ||
    props.multiline === true;
  const contentPadding = isMultiLine ? 8 : 0;

  return (
    <div
      className={isMultiLine ? undefined : "app-list-cell-single"}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%",
        display: "block",
        backgroundColor: hovered ? "var(--color-bgSecondary)" : "transparent",
        transition: "background-color 0.15s ease",
      }}
    >
      <ListCell
        {...props}
        spacingVariant="condensed"
        outerSpacing={{ paddingX: 0, paddingY: 0 }}
        styles={{
          ...stylesProp,
          root: {
            paddingTop: 0,
            paddingBottom: 0,
            marginTop: 0,
            marginBottom: 0,
            paddingLeft: 0,
            paddingRight: 0,
            minHeight: 40,
            ...stylesProp?.root,
          },
          pressable: {
            paddingTop: 0,
            paddingBottom: 0,
            paddingLeft: paddingX,
            paddingRight: paddingX,
            minHeight: 40,
            ...stylesProp?.pressable,
          },
          contentContainer: {
            paddingTop: contentPadding,
            paddingBottom: contentPadding,
            ...stylesProp?.contentContainer,
          },
        }}
      />
    </div>
  );
};
