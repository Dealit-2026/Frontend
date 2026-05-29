const EXPLICIT_TIME_ZONE_PATTERN = /(Z|[+-]\d{2}:?\d{2})$/i;

export function parseApiDate(value: string | null | undefined): Date | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const normalized = EXPLICIT_TIME_ZONE_PATTERN.test(trimmed)
    ? trimmed
    : `${trimmed}Z`;
  const date = new Date(normalized);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function getApiTime(value: string | null | undefined): number {
  return parseApiDate(value)?.getTime() ?? 0;
}

export function formatApiDate(
  value: string | null | undefined,
  options: Intl.DateTimeFormatOptions,
): string {
  const date = parseApiDate(value);
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    ...options,
  }).format(date);
}

export function getApiDateTimeParts(
  value: string | null | undefined,
  options: { includeSecond?: boolean } = {},
): Record<string, string> | null {
  const date = parseApiDate(value);
  if (!date) {
    return null;
  }

  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: options.includeSecond ? "2-digit" : undefined,
    hourCycle: "h23",
  });

  return Object.fromEntries(
    formatter
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
}
