import Link from "next/link";
import { basePath } from "../lib/paths";

export function Wordmark() {
  return (
    <Link className="brand" href="/" aria-label="Kynx Influence Hub">
      <img className="brand-mark" src={`${basePath}/brand-mark.png`} alt="" />
      <span>
        <span className="brand-name">KYNX</span>
        <span className="brand-sub">Influence Hub</span>
      </span>
    </Link>
  );
}
