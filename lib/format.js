export function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

export function formatFollowers(value) {
  if (value >= 1_000_000) {
    const scaled = value / 1_000_000;
    return `${scaled.toFixed(scaled >= 10 ? 0 : 1)}M`;
  }
  if (value >= 1000) {
    const scaled = value / 1000;
    const digits = Number.isInteger(scaled) ? 0 : 1;
    return `${scaled.toFixed(digits)}K`;
  }
  return String(value);
}

export function formatPeso(value) {
  return `₱${formatNumber(value)}`;
}

export function formatDate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(Date.UTC(year, month - 1, day)));
}
