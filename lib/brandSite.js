export const brandIntro = {
  title: "Structured Influence. Scalable Impact.",
  lede: "We help brands activate the right creators with structured campaigns designed for scale, credibility, and measurable growth.",
};

export const serviceIntro = "Elevate your brand with our unparalleled marketing services, meticulously crafted to embody sophistication and drive results. Experience the pinnacle of strategic excellence and watch your business flourish in an ever-evolving digital landscape.";

export const services = [
  "Sales Sprint",
  "Always-On Engine",
  "Install/Signup Growth",
  "Launch Blitz",
];

export const aboutCopy = "KYNX Influence Hub partners with brands and platforms to deliver structured, high-impact influencer campaigns across nano to mega-tier creators. We specialize in building creator ecosystems that generate awareness, credibility, and measurable brand impact—bridging influence, content, and performance. Our approach combines strategic planning, curated creator activation, and campaign systems designed to scale.";

const videoRoot = "https://video.squarespace-cdn.com/content/v1/69b03f3c09081c159fdb0d4a";

function workVideo(id) {
  return {
    src: `${videoRoot}/${id}/playlist.m3u8`,
    poster: `${videoRoot}/${id}/thumbnail`,
  };
}

export const works = [
  { creator: "sabbyandsophia", brand: "Glamfix PH", ...workVideo("d8c37823-b489-47aa-bfad-9bdc4ddcf008") },
  { creator: "sharlene.sanpedro", brand: "Crocs", ...workVideo("310ce396-9011-4ed4-9b07-dd29f0d5d298") },
  { creator: "Ivana Alawi", brand: "Red Lotus", ...workVideo("2f542e0e-ad40-4f3a-8068-84c532805a94") },
  { creator: "Toni Gonzaga", brand: "Krazy Garlic", ...workVideo("ee6fd02c-218b-422c-957b-c750619be812") },
  { creator: "Criza Taa", brand: "New Moon" },
  { creator: "Alex Gonzaga", brand: "Krazy Garlic", ...workVideo("d6402a55-63ca-4be5-b7b3-1544c47ab0c4") },
];

export const principles = [
  {
    title: "People-First Approach",
    body: "We don’t just match brands with creators—we build the right partnerships. Every campaign is designed around your goals, ensuring creators align with your audience, message, and business objectives.",
  },
  {
    title: "Long-Term Relationships",
    body: "We focus on building lasting partnerships, not one-off campaigns. By growing alongside our clients and creators, we create consistent, scalable impact over time.",
  },
  {
    title: "Proven Process, Flexible Execution",
    body: "Our system combines strategy-first planning, curated creator matching, and performance tracking—delivering campaigns that are both structured and adaptable for real results.",
  },
];

export const contactDetails = {
  email: "kynx.influencehub@gmail.com",
  phone: "+63 976 148 6539",
  instagram: "https://www.instagram.com/kynxinfluencehub/",
  facebook: "https://www.facebook.com/profile.php?id=61579629596453",
};
