/**
 * Convert 24h time string (e.g. "14:30") to 12h format (e.g. "2:30 PM").
 * Returns the original string if it can't be parsed.
 */
export function to12Hour(time: string | undefined): string {
  if (!time) return 'TBA';
  const match = time.match(/^(\d{1,2}):(\d{2})$/);
  if (!match) return time;

  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const period = hours >= 12 ? 'PM' : 'AM';

  if (hours === 0) hours = 12;
  else if (hours > 12) hours -= 12;

  return `${hours}:${minutes} ${period}`;
}
