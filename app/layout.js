import { Manrope, Poppins } from "next/font/google";
import { Shell } from "../components/Shell";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
});

export const metadata = {
  title: "Kynx Influence Hub",
  description: "Creator roster, campaign matching, and documented views for Kynx Influence Hub.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${poppins.variable}`}>{children}</body>
    </html>
  );
}

export function Workspace({ active, children }) {
  return <Shell active={active}>{children}</Shell>;
}
