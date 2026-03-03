import { useState } from "react";
import { VStack } from "@coinbase/cds-web/layout";
import { SelectChip } from "@coinbase/cds-web/chips/SelectChip";
import { SelectOption } from "@coinbase/cds-web/controls/SelectOption";
import { useRegion } from "./RegionContext";
import type { Region } from "./RegionContext";

/**
 * Region switcher (US / UK) for the prototype toolbar.
 * Styled to match the "Main flow" SelectChip and other toolbar controls.
 */
export function RegionSwitcher() {
  const { region, setRegion } = useRegion();
  const [open, setOpen] = useState(false);

  return (
    <SelectChip
        value={region}
        valueLabel={region}
        open={open}
        onOpenChange={setOpen}
        onChange={(value: string) => {
          if (value === "US" || value === "UK") setRegion(value as Region);
        }}
        transparentWhileInactive
        paddingX={0}
        font="label1"
        height={40}
        background="bgSecondary"
        minWidth={72}
        content={
          <VStack>
            <SelectOption title="US" value="US" font="label1" />
            <SelectOption title="UK" value="UK" font="label1" />
          </VStack>
        }
      />
  );
}
