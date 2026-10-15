import Link from "next/link";
import { Workspace } from "../components/Workspace";

export default function NotFound() {
  return (
    <Workspace active="/">
      <header className="page-head">
        <p className="eyebrow">Missing</p>
        <h1>That record is not in the roster.</h1>
        <p className="lede"><Link className="text-link" href="/creators">Back to creators</Link></p>
      </header>
    </Workspace>
  );
}
