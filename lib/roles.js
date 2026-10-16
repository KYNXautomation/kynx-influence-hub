export const roles = [
  { id: "admin", label: "Admin", detail: "KYNX approval, the live tracker, and campaign money. One approver clears a nomination onto the client sheet.", home: "/" },
  { id: "specialists", label: "Specialists", detail: "You own your creators from the pitch through the post. One creator, one PIC.", home: "/creators" },
  { id: "brands", label: "Brands", detail: "Approve the nomination, then the draft. Rate, MOA, and internal notes stay on the KYNX side.", home: "/reviews" },
  { id: "finance", label: "Finance", detail: "Brand payment, creator cost on the tracker, boosting, and VAT. A rate counts after the three gates.", home: "/payments" },
  { id: "creators", label: "Creators", detail: "Your confirmation, the post, and the views that post generated.", home: "/" },
];

export function roleById(id) {
  return roles.find((role) => role.id === id) || roles[0];
}

export function navFor(role) {
  if (role === "specialists") return [["/campaigns", "Campaigns"], ["/creators", "Creators"], ["/reviews", "Reviews"]];
  if (role === "brands") return [["/reviews", "Reviews"], ["/campaigns", "Campaigns"], ["/impact", "Generated views"]];
  if (role === "finance") return [["/payments", "Payments"], ["/campaigns", "Campaigns"], ["/impact", "Generated views"]];
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
    finance: ["/payments", "/campaigns", "/impact", "/creators"],
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
