export type BetResult = "pending" | "green" | "red" | "refund" | "cashout";

export const BET_RESULT_BADGE_VARIANT: Record<
  BetResult,
  "default" | "secondary" | "destructive" | "outline" | "info" | "warning"
> = {
  green: "default",
  red: "destructive",
  refund: "warning",
  cashout: "info",
  pending: "outline",
};

export const BET_RESULT_ICON_COLOR: Record<BetResult, string> = {
  green: "text-primary",
  red: "text-destructive",
  refund: "text-yellow-500",
  cashout: "text-blue-500",
  pending: "text-secondary-foreground",
};
