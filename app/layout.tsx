import type { Metadata, Viewport } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fontHeading = Archivo({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Skerp Slijpservice, messen slijpen in Leeuwarden",
  description:
    "Vakkundig messen slijpen in Leeuwarden. Van keukenmes tot japans staal, scheermesscherp terug door een vakman.",
  applicationName: "Skerp Slijpservice",
  metadataBase: new URL("https://skerp.vercel.app"),
  openGraph: {
    title: "Skerp Slijpservice, messen slijpen in Leeuwarden",
    description:
      "Vakkundig messen slijpen in Leeuwarden. Van keukenmes tot japans staal, scheermesscherp terug door een vakman.",
    type: "website",
    locale: "nl_NL",
    images: [
      {
        url: "/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Skerp Slijpservice, messen slijpen in Leeuwarden",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${fontSans.variable} ${fontHeading.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
