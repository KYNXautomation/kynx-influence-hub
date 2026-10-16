"use client";

import { progressIndex, progressSteps } from "../lib/progress";

export function ProgressRail({ record, onMove, compact = false, message = "" }) {
  const index = progressIndex(record);
  const locked = record.status === "Dropped" || record.status === "Rejected";

  return (
    <div className={compact ? "rail rail-compact" : "rail"}>
      <input
        type="range"
        min="0"
        max={progressSteps.length - 1}
        step="1"
        value={index}
        aria-label={`Progress for ${record.creator?.name || "creator"}`}
        aria-valuetext={message || (locked ? record.status : progressSteps[index])}
        disabled={locked || !onMove}
        onChange={(event) => {
          const next = Number(event.target.value);
          onMove?.(next);
          if (next !== index) event.currentTarget.value = String(index);
        }}
      />
      {compact ? (
        <span className={message ? "rail-now note" : "rail-now"}>{message || (locked ? record.status : progressSteps[index])}</span>
      ) : (
        <ol className="rail-steps">
          {progressSteps.map((label, step) => (
            <li key={label} className={step <= index && !locked ? "done" : undefined}>{label}</li>
          ))}
        </ol>
      )}
      {!compact && message ? <p className="meta">{message}</p> : null}
    </div>
  );
}
