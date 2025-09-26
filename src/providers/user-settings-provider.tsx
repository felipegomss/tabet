"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface UserSettingsContextValue {
  userId: string;
  stakeValue: number | null;
  setStakeValue: (value: number | null) => void;
}

const UserSettingsContext = createContext<UserSettingsContextValue | undefined>(
  undefined
);

interface UserSettingsProviderProps {
  userId: string;
  stakeValue: number | null;
  children: ReactNode;
}

export function UserSettingsProvider({
  userId,
  stakeValue,
  children,
}: UserSettingsProviderProps) {
  const [value, setValue] = useState({ userId, stakeValue });

  useEffect(() => {
    setValue({ userId, stakeValue });
  }, [userId, stakeValue]);

  const setStakeValue = useCallback((nextStake: number | null) => {
    setValue((prev) => ({ ...prev, stakeValue: nextStake }));
  }, []);

  const contextValue = useMemo(
    () => ({
      userId: value.userId,
      stakeValue: value.stakeValue,
      setStakeValue,
    }),
    [value.userId, value.stakeValue, setStakeValue]
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
