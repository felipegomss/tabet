"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

interface UserSettingsContextValue {
  userId: string;
  stakeValue: number | null;
  setStakeValue: (value: number | null) => void;
  bettingHouses: string[];
  setBettingHouses: (value: string[]) => void;
}

const UserSettingsContext = createContext<UserSettingsContextValue | undefined>(
  undefined
);

interface UserSettingsProviderProps {
  userId: string;
  stakeValue: number | null;
  bettingHouses: string[];
  children: ReactNode;
}

export function UserSettingsProvider({
  userId,
  stakeValue: initialStake,
  bettingHouses: initialHouses,
  children,
}: UserSettingsProviderProps) {
  const [stakeValue, setStakeValue] = useState<number | null>(initialStake);
  const [bettingHouses, setBettingHouses] = useState<string[]>(initialHouses);

  const contextValue = useMemo(
    () => ({
      userId,
      stakeValue,
      setStakeValue,
      bettingHouses,
      setBettingHouses,
    }),
    [userId, stakeValue, bettingHouses]
  );

  return (
    <UserSettingsContext.Provider value={contextValue}>
      {children}
    </UserSettingsContext.Provider>
  );
}

export function useUserSettings() {
  const context = useContext(UserSettingsContext);
  if (!context) {
    throw new Error(
      "useUserSettings must be used within a UserSettingsProvider"
    );
  }
  return context;
}
