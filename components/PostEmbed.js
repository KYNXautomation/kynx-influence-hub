// An Instagram or TikTok post, embedded so it plays on the page.
export function embedUrl(url) {
  const tiktok = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
  if (tiktok) return `https://www.tiktok.com/embed/v2/${tiktok[1]}`;
  const instagram = url.match(/instagram\.com\/(?:p|reel)\/([\w-]+)/);
  if (instagram) return `https://www.instagram.com/p/${instagram[1]}/embed/captioned/`;
  return "";
}

export function PostEmbed({ url, title }) {
  const src = embedUrl(url);
  if (!src) return null;
  return <iframe className="post-embed" src={src} title={title} loading="lazy" allow="encrypted-media; picture-in-picture" allowFullScreen />;
}
