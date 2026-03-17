import type { Metadata } from "next";
import { DM_Serif_Display, DM_Sans, Caveat } from "next/font/google";
import "./globals.css";

const dmSerif = DM_Serif_Display({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-dm-serif",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
});

export const metadata: Metadata = {
  title: "Brekkie | Protein Banana Bread - NYC",
  description:
    "Sweet enough for dessert. Smart enough for breakfast. 12g protein banana bread, baked in small batches in New York City.",
  openGraph: {
    title: "Brekkie | Protein Banana Bread",
    description: "Sweet enough for dessert. Smart enough for breakfast.",
    url: "https://brekkiebakery.com",
    siteName: "Brekkie",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSerif.variable} ${dmSans.variable} ${caveat.variable}`}
    >
      <body className="bg-cream text-espresso font-body antialiased">
        {children}
      </body>
    </html>
  );
}
