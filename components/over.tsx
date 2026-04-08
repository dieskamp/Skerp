 import Image from "next/image"

 export function Over() {
   return (
     <section id="over" className="border-t border-border bg-background">
       <div className="mx-auto grid max-w-6xl gap-10 px-5 py-24 md:grid-cols-2 md:items-center md:gap-14 md:py-32">
         <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-border bg-muted">
           <Image
             src="/gallery/skerp-1.jpg"
             alt="Werkplek van Skerp Slijpservice"
             fill
             className="object-cover"
           />
           <div className="pointer-events-none absolute inset-0 ring-1 ring-foreground/5" />
         </div>

         <div>
           <p className="font-heading text-xs tracking-[0.22em] text-muted-foreground">
             OVER SKERP
           </p>
           <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
             Een vakman met passie voor staal
           </h2>

           <div className="mt-6 space-y-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
             <p>
               Skerp Slijpservice is het werk van Peter van der Rol. Wat begon
              als een hobby, het restaureren en slijpen van eigen messen, groeide
               uit tot een ambacht waar precisie en gevoel voor staal centraal
               staan.
             </p>
             <p>
               Voor elk lemmet kies ik de juiste aanpak: een Work Sharp Ken Onion
               voor gecontroleerd bandwerk, japanse waterstenen tot 3000 grit voor
               handslijpwerk, en een leren strop voor die laatste finishing touch.
             </p>
             <p>
               Waarom? Een scherp mes is veiliger, sneller en gewoon leuker om mee
              te werken, thuis én professioneel.
             </p>
           </div>
         </div>
       </div>
     </section>
   )
 }

