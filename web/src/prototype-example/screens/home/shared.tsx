import type { ComponentProps } from "react";
import { AppListCell } from "../../AppListCell";

/**
 * Home-screen list cell — a preset of AppListCell with no horizontal padding
 * on the pressable (the parent section already provides 24px side context).
 *
 * Changing AppListCell updates every row across the whole prototype.
 */
type HomeListCellProps = Omit<ComponentProps<typeof AppListCell>, "paddingX">;

export const HomeListCell = (props: HomeListCellProps) => (
  <AppListCell paddingX={0} {...props} />
);
