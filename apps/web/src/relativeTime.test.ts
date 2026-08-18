import { describe, expect, it } from "vitest";
import { formatRelativeTime } from "./relativeTime";

const NOW = new Date("2026-08-18T12:00:00.000Z");

function isoBefore(ms: number): string {
  return new Date(NOW.getTime() - ms).toISOString();
}

describe("formatRelativeTime", () => {
  it("returns 'just now' for less than 60 seconds", () => {
    expect(formatRelativeTime(isoBefore(0), NOW)).toBe("just now");
    expect(formatRelativeTime(isoBefore(59 * 1000), NOW)).toBe("just now");
  });

  it("returns minutes for less than 60 minutes", () => {
    expect(formatRelativeTime(isoBefore(60 * 1000), NOW)).toBe("1m ago");
    expect(formatRelativeTime(isoBefore(5 * 60 * 1000), NOW)).toBe("5m ago");
    expect(formatRelativeTime(isoBefore(59 * 60 * 1000), NOW)).toBe("59m ago");
  });

  it("returns hours for less than 24 hours", () => {
    expect(formatRelativeTime(isoBefore(60 * 60 * 1000), NOW)).toBe("1h ago");
    expect(formatRelativeTime(isoBefore(2 * 60 * 60 * 1000), NOW)).toBe("2h ago");
    expect(formatRelativeTime(isoBefore(23 * 60 * 60 * 1000), NOW)).toBe("23h ago");
  });

  it("rounds hours like the other units, including near the day boundary", () => {
    expect(formatRelativeTime(isoBefore(23 * 60 * 60 * 1000 + 45 * 60 * 1000), NOW)).toBe(
      "24h ago"
    );
    expect(formatRelativeTime(isoBefore(23 * 60 * 60 * 1000 + 15 * 60 * 1000), NOW)).toBe(
      "23h ago"
    );
  });

  it("returns days for less than 30 days", () => {
    expect(formatRelativeTime(isoBefore(24 * 60 * 60 * 1000), NOW)).toBe("1d ago");
    expect(formatRelativeTime(isoBefore(3 * 24 * 60 * 60 * 1000), NOW)).toBe("3d ago");
    expect(formatRelativeTime(isoBefore(29 * 24 * 60 * 60 * 1000), NOW)).toBe("29d ago");
  });

  it("returns months for less than 12 months", () => {
    expect(formatRelativeTime(isoBefore(30 * 24 * 60 * 60 * 1000), NOW)).toBe("1mo ago");
    expect(formatRelativeTime(isoBefore(6 * 30 * 24 * 60 * 60 * 1000), NOW)).toBe("6mo ago");
    expect(formatRelativeTime(isoBefore(11 * 30 * 24 * 60 * 60 * 1000), NOW)).toBe("11mo ago");
  });

  it("returns years for 12 months or more", () => {
    expect(formatRelativeTime(isoBefore(12 * 30 * 24 * 60 * 60 * 1000), NOW)).toBe("1y ago");
    expect(formatRelativeTime(isoBefore(2 * 12 * 30 * 24 * 60 * 60 * 1000), NOW)).toBe("2y ago");
  });
});
