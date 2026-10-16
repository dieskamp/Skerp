import { Marquee } from "@/components/motion/marquee"
import { Afspraak } from "@/components/sections/afspraak"
import { Diensten } from "@/components/sections/diensten"
import { Faq } from "@/components/sections/faq"
import { Footer } from "@/components/sections/footer"
import { Hero } from "@/components/sections/hero"
import { Navbar } from "@/components/sections/navbar"
import { Over } from "@/components/sections/over"
import { VoorNa } from "@/components/sections/voor-na"
import { Werk } from "@/components/sections/werk"
import { Werkwijze } from "@/components/sections/werkwijze"

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Skerp Slijpservice",
            description:
              "Vakkundig messen slijpen in Leeuwarden. Van keukenmes tot japans staal, scheermesscherp terug door een vakman.",
            areaServed: "Leeuwarden",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Leeuwarden",
              addressRegion: "Friesland",
              addressCountry: "NL",
            },
            url: "https://skerp.vercel.app",
            founder: "Peter van der Rol",
            keywords: [
              "knife sharpening service",
              "messen slijpen",
              "Leeuwarden",
              "Friesland",
            ],
          }),
        }}
      />

      <Navbar />
      <main id="inhoud">
        <Hero />
        <Over />
        <Diensten />
        <Werkwijze />
        <VoorNa />
        <Werk />
        <Marquee text="Skerp · Slijpservice · Leeuwarden · " />
        <Afspraak />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
