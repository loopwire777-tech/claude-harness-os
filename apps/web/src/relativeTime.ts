const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const MONTH = 30 * DAY;
const YEAR = 12 * MONTH;

export function formatRelativeTime(isoString: string, now: Date = new Date()): string {
  const diffMs = now.getTime() - new Date(isoString).getTime();

  if (diffMs < MINUTE) {
    return "just now";
  }
  if (diffMs < HOUR) {
    return `${Math.round(diffMs / MINUTE)}m ago`;
  }
  if (diffMs < DAY) {
    return `${Math.round(diffMs / HOUR)}h ago`;
  }
  if (diffMs < MONTH) {
    return `${Math.round(diffMs / DAY)}d ago`;
  }
  if (diffMs < YEAR) {
    return `${Math.round(diffMs / MONTH)}mo ago`;
  }
  return `${Math.round(diffMs / YEAR)}y ago`;
}
