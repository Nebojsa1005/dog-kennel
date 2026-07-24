/** Converts a stored 'YYYY-MM-DD' string to a local Date, or null if empty/invalid. */
export function isoStringToDate(value: string | undefined | null): Date | null {
  if (!value) return null;
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;

  const [, year, month, day] = match;
  return new Date(Number(year), Number(month) - 1, Number(day));
}

/** Converts a Date to a 'YYYY-MM-DD' string for storage, or '' if null. */
export function dateToIsoString(date: Date | null): string {
  if (!date) return '';
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
