export const roles = [
  { id: "admin", label: "Admin", detail: "KYNX approval, the live tracker, and campaign money. One approver clears a nomination onto the client sheet.", home: "/workspace" },
  { id: "specialists", label: "Specialists", detail: "You own your creators from the pitch through the post. One creator, one PIC.", home: "/creators" },
  { id: "brands", label: "Brands", detail: "The views your campaigns generated. Approve the nomination, then the draft. Rate, MOA, and internal notes stay on the KYNX side.", home: "/workspace" },
  { id: "finance", label: "Finance", detail: "Brand payment, creator cost on the tracker, boosting, and VAT. A rate counts after the three gates.", home: "/payments" },
  { id: "talents", label: "Talent manager", detail: "Your talents: contracts, availability, rate cards, and the campaigns they are on.", home: "/talents" },
  { id: "creators", label: "Creators", detail: "Your confirmation, the post, and the views that post generated.", home: "/workspace" },
];

export function roleById(id) {
  return roles.find((role) => role.id === id) || roles[0];
}

export function navFor(role) {
  if (role === "specialists") return [["/campaigns", "Campaigns"], ["/creators", "Creators"], ["/reviews", "Reviews"]];
  if (role === "brands") {
    return [
      ["/workspace", "Home"],
      ["/reviews", "Reviews"],
      ["/campaigns", "Campaigns"],
    ];
  }
  if (role === "finance") return [["/payments", "Payments"], ["/campaigns", "Campaigns"], ["/impact", "Generated views"]];
  if (role === "talents") return [["/talents", "Talents"], ["/campaigns", "Campaigns"]];
  if (role === "creators") return [["/workspace", "My campaigns"], ["/impact", "Generated views"]];
  return [
    ["/", "Home"],
    ["/workspace", "Overview"],
    ["/roster", "Artists"],
    ["/campaigns", "Campaigns"],
    ["/creators", "Creators"],
    ["/reviews", "Reviews"],
    ["/payments", "Payments"],
    ["/talents", "Talents"],
  ];
}

const brandPages = ["/services", "/about", "/works", "/contact"];

export function allows(role, path) {
  const current = (path || "/").replace(/\/$/, "") || "/";
  if (brandPages.some((page) => current === page || current.startsWith(`${page}/`))) return false;
  if (role === "admin") return current !== "/impact" && !current.startsWith("/impact/");
  const roots = {
    specialists: ["/campaigns", "/creators", "/reviews"],
    brands: ["/campaigns", "/creators", "/reviews"],
    finance: ["/payments", "/campaigns", "/impact", "/creators"],
    creators: ["/creators", "/impact"],
    talents: ["/talents", "/campaigns"],
  };
  if (current === "/" || current === "/workspace" || current === "/login" || current.startsWith("/login/") || current === "/signup" || current.startsWith("/signup/")) return true;
  return (roots[role] || []).some((root) => current === root || current.startsWith(`${root}/`));
}

export function canSeeRecord(role, record, { creatorId, specialist }) {
  if (!record) return false;
  if (role === "creators") return record.creatorId === creatorId;
  if (role === "brands") return record.campaign.brand === "Shopee";
  if (role === "specialists" && specialist !== "all") return record.owner === specialist;
  return true;
}
