// src/utils/formatNumber.ts

export function formatNumber(
  value: number | undefined,
  locale: string = "en-US"
): string {
  if (isNaN(value as number) || value === undefined) {
    return "-";
  }
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(value);
}
