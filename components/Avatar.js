const fills = ["var(--accent)"];

export function initials(name) {
  return String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function Avatar({ name, size = "md", src = "" }) {
  const index = [...String(name)].reduce((sum, char) => sum + char.charCodeAt(0), 0) % fills.length;
  if (src) {
    return <img className={`avatar ${size}`} src={src} alt="" />;
  }
  return (
    <span className={`avatar ${size}`} style={{ background: fills[index] }} aria-hidden="true">
      {initials(name)}
    </span>
  );
}
