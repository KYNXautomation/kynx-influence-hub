export const progressSteps = [
  "Pitching",
  "Confirmed",
  "KYNX",
  "Brand",
  "Draft",
  "Clear to post",
  "Posted",
];

export function progressIndex(record) {
  if (!record || record.status === "Dropped" || record.status === "Rejected") return 0;
  if (record.postDate || record.stage === "Posted") return 6;
  if (record.stage === "Approved for posting") return 5;
  if (record.draftStatus === "For review" || record.draftStatus === "For revision") return 4;
  if (record.onTracker) return 3;
  if (record.kynxApproval === "Approved") return 2;
  if (record.kolConfirmation === "Confirmed") return 1;
  return 0;
}

export function progressMove(record, index, role) {
  const current = progressIndex(record);
  if (index === current) return { ok: true, patch: null };
  if (record.status === "Dropped" || record.status === "Rejected") {
    return { ok: false, message: "Dropped and rejected rows stay in place." };
  }
  const specialist = role === "admin" || role === "specialists";
  const brand = role === "admin" || role === "brands";
  if (index === 0 && specialist) return { ok: true, patch: { kolConfirmation: "Pitching" } };
  if (index === 1 && (specialist || role === "creators")) return { ok: true, patch: { kolConfirmation: "Confirmed" } };
  if (index === 2 && role === "admin") {
    if (record.kolConfirmation !== "Confirmed") return { ok: false, message: "The creator confirms before KYNX approves." };
    return { ok: true, patch: { kynxApproval: "Approved" } };
  }
  if (index === 3 && brand) {
    if (record.kynxApproval !== "Approved") return { ok: false, message: "KYNX approves before the brand does." };
    return { ok: true, patch: { brandApproval: "Approved" } };
  }
  if (index === 4 && specialist) {
    if (!record.onTracker) return { ok: false, message: "The draft starts after all three gates." };
    return { ok: true, patch: { draftStatus: "For review" } };
  }
  if (index === 5 && brand) {
    if (record.draftStatus !== "For review" && record.draftStatus !== "For revision") {
      return { ok: false, message: "A draft has to be in review before it is cleared to post." };
    }
    return { ok: true, patch: { draftStatus: "Approved" } };
  }
  if (index === 6 && specialist) {
    if (record.stage !== "Approved for posting" && record.draftStatus !== "Approved" && record.draftStatus !== "Approved after revision") {
      return { ok: false, message: "The brand clears the draft before it is marked posted." };
    }
    return { ok: true, post: true };
  }
  return { ok: false, message: "That step belongs to another side." };
}
