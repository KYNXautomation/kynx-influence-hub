export const basePath = "/kynx-influence-hub";

export function href(path) {
  const [pathname, query] = path.split("?");
  const slashed = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return `${basePath}${slashed}${query ? `?${query}` : ""}`;
}
