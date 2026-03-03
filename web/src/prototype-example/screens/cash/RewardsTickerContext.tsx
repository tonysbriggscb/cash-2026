import { createContext, useContext, useState, type ReactNode } from "react";

export interface RewardsTickerContextValue {
  rewardUnits: number;
  setRewardUnits: React.Dispatch<React.SetStateAction<number>>;
}

const RewardsTickerContext = createContext<RewardsTickerContextValue | null>(null);

export function useRewardsTicker() {
  return useContext(RewardsTickerContext);
}

export function RewardsTickerProvider({
  initialUnits,
  children,
}: {
  initialUnits: number;
  children: ReactNode;
}) {
  const [rewardUnits, setRewardUnits] = useState(initialUnits);
  return (
    <RewardsTickerContext.Provider value={{ rewardUnits, setRewardUnits }}>
      {children}
    </RewardsTickerContext.Provider>
  );
}
