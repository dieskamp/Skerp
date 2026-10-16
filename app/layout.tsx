import type { Metadata, Viewport } from "next";
import { Big_Shoulders, Inter } from "next/font/google";

import { CustomCursor } from "@/components/motion/custom-cursor";
import { Preloader } from "@/components/motion/preloader";
import { ScrollProgress } from "@/components/motion/scroll-progress";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { preloadScript } from "@/lib/preload";
import "./globals.css";

const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Condensed industriële display-letter voor koppen
const fontHeading = Big_Shoulders({
  variable: "--font-heading",
  subsets: ["latin"],
  display: "swap",
  // Next heeft geen metrics voor deze font; zelf een smalle fallback kiezen.
  adjustFontFallback: false,
  fallback: ["Arial Narrow", "Roboto Condensed", "sans-serif"],
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
  themeColor: "#060708",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${fontSans.variable} ${fontHeading.variable} dark h-full antialiased`}
      // Het inline script zet data-preload vóór hydration; dat is bewust.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: preloadScript }} />
      </head>
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <a
          href="#inhoud"
          className="fixed top-3 left-3 z-[300] -translate-y-24 rounded-sm bg-chrome px-4 py-2 text-sm font-medium text-steel-950 focus-visible:translate-y-0"
        >
          Naar de inhoud
        </a>
        <Preloader />
        <ScrollProgress />
        <CustomCursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
