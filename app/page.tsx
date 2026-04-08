import { Afspraak } from "@/components/afspraak"
import { Diensten } from "@/components/diensten"
import { Faq } from "@/components/faq"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/hero"
import { Navbar } from "@/components/navbar"
import { Over } from "@/components/over"
import { Werk } from "@/components/werk"
import { Werkwijze } from "@/components/werkwijze"

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
      <main>
        <Hero />
        <Over />
        <Diensten />
        <Werkwijze />
        <Werk />
        <Afspraak />
        <Faq />
      </main>
      <Footer />
    </div>
  );
}
