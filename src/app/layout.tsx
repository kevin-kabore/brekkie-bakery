import type { Metadata } from "next";
import { Inter, Lilita_One, Pacifico } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const lilitaOne = Lilita_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-lilita",
});

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico",
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
      className={`${inter.variable} ${lilitaOne.variable} ${pacifico.variable}`}
    >
      <body className="bg-cream text-navy font-body antialiased">
        {children}
      </body>
    </html>
  );
}
