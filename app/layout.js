import localFont from "next/font/local";
import { RoleProvider } from "../components/RoleProvider";
import "./globals.css";

const manrope = localFont({
  src: "../fonts/manrope-400.woff2",
  variable: "--font-body",
  weight: "400 700",
  display: "swap",
});

const poppins = localFont({
  src: [
    { path: "../fonts/poppins-500.woff2", weight: "500", style: "normal" },
    { path: "../fonts/poppins-600.woff2", weight: "600", style: "normal" },
    { path: "../fonts/poppins-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-display",
  display: "swap",
});

export const metadata = {
  title: "Kynx Influence Hub",
  description: "A clear view of creators, campaigns, reviews, payments, and generated views.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${poppins.variable}`}><RoleProvider>{children}</RoleProvider></body>
    </html>
  );
}
