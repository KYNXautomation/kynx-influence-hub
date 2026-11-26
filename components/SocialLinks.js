// Instagram, TikTok and Facebook links for an artist, as icon buttons.
const paths = {
  instagram: (
    <>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </>
  ),
  tiktok: <path d="M16 3c.4 2.6 2 4.3 4.5 4.6v3.2c-1.7 0-3.2-.5-4.5-1.4v6.3a5.7 5.7 0 1 1-5.7-5.7c.3 0 .6 0 .9.1v3.3a2.5 2.5 0 1 0 1.6 2.3V3H16z" />,
  facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
};

const networks = [["instagram", "Instagram"], ["tiktok", "TikTok"], ["facebook", "Facebook"]];

export function Icon({ name, size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={name === "tiktok" ? "currentColor" : "none"} stroke={name === "tiktok" ? "none" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {name === "arrow" ? <path d="M5 12h14M13 6l6 6-6 6" /> : paths[name]}
    </svg>
  );
}

export function SocialLinks({ creator, className = "social-links" }) {
  const links = networks.filter(([key]) => creator[key]);
  if (!links.length) return null;
  return (
    <div className={className}>
      {links.map(([key, label]) => (
        <a key={key} href={creator[key]} target="_blank" rel="noreferrer" aria-label={`${creator.name} on ${label}`}>
          <Icon name={key} />
        </a>
      ))}
    </div>
  );
}
