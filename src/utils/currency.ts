export function formatNumber(
  value: number,
  locale: string = navigator.language,
  minimumFractionDigits = 0,
  maximumFractionDigits = 2,
): string {
  if (!Number.isFinite(value)) return "";

  return new Intl.NumberFormat(locale, {
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
}
