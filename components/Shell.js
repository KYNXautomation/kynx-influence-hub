import { Wordmark } from "./Wordmark";

const links = [
  ["/", "Overview"],
  ["/creators", "Creators"],
  ["/campaigns", "Campaigns"],
  ["/impact", "Impact"],
];

export function Shell({ active, children }) {
  return (
    <div className="shell">
      <aside className="side">
        <Wordmark />
        <p className="tagline">Structured Influence. Scalable Impact.</p>
        <nav className="nav" aria-label="Workspace">
          {links.map(([href, label]) => (
            <a key={href} href={href} className={active === href ? "active" : undefined}>
              {label}
            </a>
          ))}
        </nav>
        <p className="side-note">Internal roster · sample records</p>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
