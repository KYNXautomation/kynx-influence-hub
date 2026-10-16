const fills = [
  "linear-gradient(145deg, #f07ab8, #7a1d55)",
  "linear-gradient(145deg, #8eb0ff, #1a3d78)",
  "linear-gradient(145deg, #f0c14d, #8a5a10)",
  "linear-gradient(145deg, #d7a4ff, #5b2a86)",
  "linear-gradient(145deg, #ff8fbe, #3a1d6e)",
];

export function initials(name) {
  return String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function Avatar({ name, size = "md" }) {
  const index = [...String(name)].reduce((sum, char) => sum + char.charCodeAt(0), 0) % fills.length;
  return (
    <span className={`avatar ${size}`} style={{ background: fills[index] }} aria-hidden="true">
      {initials(name)}
    </span>
  );
}
