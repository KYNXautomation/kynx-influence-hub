import { Shell } from "./Shell";

export function Workspace({ active, children }) {
  return <Shell active={active}>{children}</Shell>;
}
