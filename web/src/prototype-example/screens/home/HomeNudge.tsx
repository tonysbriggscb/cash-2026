import { useState } from "react";
import { NudgeCard } from "@coinbase/cds-web/cards/NudgeCard";

export const HomeNudge = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div style={{ padding: "8px 24px 0" }}>
      <NudgeCard
        title="Start saving today at 3.50% AER"
        description="Daily interest, add or withdraw anytime, FSCS protected."
        pictogram="safe"
        onDismissPress={() => setDismissed(true)}
        onActionPress={() => {}}
        width="100%"
        minWidth={0}
      />
    </div>
  );
};
