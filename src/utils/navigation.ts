export function getFirstSearchParamValue(
  value: string | string[] | undefined | null
): string | undefined {
  if (Array.isArray(value)) {
    return value[0];
  }

  return typeof value === "string" ? value : undefined;
}

export function getSafeRedirectPath(
  value: unknown,
  fallback: string = "/dashboard"
): string {
  if (typeof value !== "string") {
    return fallback;
  }

  const trimmed = value.trim();

  if (!trimmed || !trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return fallback;
  }

  return trimmed;
}
