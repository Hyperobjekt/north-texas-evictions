/**
 * Returns true if the date is in the correct ISO8601 format
 */
export const isValidDateFormat = (dateString) => {
  const isIso8601 = /^\d{4}-\d{2}-\d{2}$/.test(dateString);
  if (!isIso8601) return false;
};
