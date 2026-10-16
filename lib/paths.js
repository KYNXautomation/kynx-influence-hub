import { campaignIds, recordIds } from "./model";

export const basePath = "/kynx-influence-hub";

export function creatorPath(id) {
  return recordIds().includes(id) ? `/creators/${id}` : `/creators/?record=${encodeURIComponent(id)}`;
}

export function campaignPath(id) {
  return campaignIds().includes(id) ? `/campaigns/${id}` : `/campaigns/?open=${encodeURIComponent(id)}`;
}

export function href(path) {
  const [pathname, query] = path.split("?");
  const slashed = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return `${basePath}${slashed}${query ? `?${query}` : ""}`;
}
