import Link from "next/link";

export function Wordmark() {
  return (
    <Link className="brand" href="/" aria-label="Kynx Influence Hub">
      <span className="brand-row">
        <span className="brand-name">KYN</span>
        <svg className="brand-x" viewBox="0 0 32 32" aria-hidden="true">
          <path d="M6 5 L26 27" />
          <path d="M26 5 L17.5 13.5" />
          <path d="M14.5 18.5 L6 27" />
        </svg>
      </span>
      <span className="brand-sub">Influence Hub</span>
    </Link>
  );
}
