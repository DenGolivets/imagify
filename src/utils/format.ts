/**
 * Formats a date to a human-readable string.
 */
export const formatDate = (
  date: string | number | Date,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  },
): string => {
  return new Intl.DateTimeFormat("en-US", options).format(new Date(date));
};

/**
 * Formats a number as USD currency.
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

/**
 * Truncates text with an ellipsis.
 */
export const truncateText = (text: string, length: number): string => {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
};
