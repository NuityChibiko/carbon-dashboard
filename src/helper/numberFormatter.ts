export const formatNumber = (
  value: number,
  decimalPlaces: number = 3
): string => {
  if (decimalPlaces === 0) {
    return value.toLocaleString("en-US", { minimumFractionDigits: 0 });
  }
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces,
  });
};
