export const roles = [
  { id: "admin", label: "Admin", detail: "Operations workspace: campaigns, roster, reviews, finance, and generated views.", home: "/" },
  { id: "specialists", label: "Specialists", detail: "Creator search, campaign records, and draft review.", home: "/campaigns" },
  { id: "brands", label: "Brands", detail: "Final review of drafts and the views those posts generated.", home: "/reviews" },
  { id: "finance", label: "Finance", detail: "Billing checks, account flags, and payment readiness.", home: "/payments" },
  { id: "creators", label: "Creators", detail: "Your campaigns, deliverables, and generated views.", home: "/" },
];

export function roleById(id) {
  return roles.find((role) => role.id === id) || roles[0];
}

export function navFor(role) {
  if (role === "specialists") return [["/campaigns", "Campaigns"], ["/creators", "Creators"], ["/reviews", "Reviews"]];
  if (role === "brands") return [["/reviews", "Reviews"], ["/campaigns", "Campaigns"], ["/impact", "Generated views"]];
  if (role === "finance") return [["/payments", "Payments"], ["/impact", "Generated views"]];
  if (role === "creators") return [["/", "My campaigns"], ["/impact", "Generated views"]];
  return [
    ["/", "Overview"],
    ["/campaigns", "Campaigns"],
    ["/creators", "Creators"],
    ["/reviews", "Reviews"],
    ["/payments", "Payments"],
    ["/impact", "Generated views"],
  ];
}

export function allows(role, path) {
  const current = path || "/";
  if (role === "admin") return true;
  const roots = {
    specialists: ["/campaigns", "/creators", "/reviews"],
    brands: ["/campaigns", "/creators", "/reviews", "/impact"],
    finance: ["/payments", "/impact", "/creators"],
    creators: ["/creators", "/impact"],
  };
  if (current === "/") return true;
  return (roots[role] || []).some((root) => current === root || current.startsWith(`${root}/`));
}

export function canSeeRecord(role, record, { creatorId, specialist }) {
  if (!record) return false;
  if (role === "creators") return record.creatorId === creatorId;
  if (role === "brands") return record.campaign.brand === "Shopee";
  if (role === "specialists" && specialist !== "all") return record.owner === specialist;
  return true;
}
