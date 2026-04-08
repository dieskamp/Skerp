 import Image from "next/image"

 const fotos = [
   { src: "/gallery/skerp-1.jpg", alt: "Geslepen lemmet detail" },
   { src: "/gallery/skerp-2.jpg", alt: "Werkbank tijdens slijpen" },
   { src: "/gallery/skerp-3.jpg", alt: "Afwerking op leren strop" },
   { src: "/gallery/skerp-5.jpg", alt: "Voor en na slijpresultaat" },
   { src: "/gallery/skerp-6.jpg", alt: "Japanse waterstenen" },
   { src: "/gallery/skerp-7.jpg", alt: "Klaar om op te halen" },
 ] as const

 export function Werk() {
   return (
     <section id="werk" className="border-t border-border bg-background">
       <div className="mx-auto max-w-6xl px-5 py-24 md:py-32">
         <p className="font-heading text-xs tracking-[0.22em] text-muted-foreground">
           WERK IN BEELD
         </p>
         <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
           Het resultaat
         </h2>

         <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-12 md:gap-5">
           {fotos.map((f, idx) => (
             <div
               key={f.src}
               className={[
                 "relative overflow-hidden rounded-sm border border-border bg-muted",
                 "h-36 sm:h-44 md:h-52",
                 idx === 0 ? "md:col-span-6" : "",
                 idx === 1 ? "md:col-span-6" : "",
                 idx === 2 ? "md:col-span-4" : "",
                 idx === 3 ? "md:col-span-4" : "",
                 idx === 4 ? "md:col-span-4" : "",
                 idx === 5 ? "md:col-span-12 md:h-56" : "",
               ].join(" ")}
             >
               <Image src={f.src} alt={f.alt} fill className="object-cover" />
             </div>
           ))}
         </div>
       </div>
     </section>
   )
 }

