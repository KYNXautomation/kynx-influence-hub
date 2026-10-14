import { Workspace } from "./layout";

export default function NotFound() {
  return (
    <Workspace active="/">
      <header className="page-head">
        <p className="eyebrow">Missing</p>
        <h1>That record is not in the roster.</h1>
        <p className="lede"><a className="text-link" href="/creators">Back to creators</a></p>
      </header>
    </Workspace>
  );
}
