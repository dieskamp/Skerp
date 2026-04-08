 const stappen = [
   {
     nr: "01",
     titel: "Plan online",
     tekst: "Kies een datum en tijd via het afsprakenformulier.",
   },
   {
     nr: "02",
     titel: "Breng langs",
     tekst: "Lever je messen veilig verpakt af op het afgesproken moment in Leeuwarden.",
   },
   {
     nr: "03",
     titel: "Vakwerk",
     tekst: "Peter beoordeelt elk mes en kiest de juiste methode: band, steen of een combinatie.",
   },
   {
     nr: "04",
     titel: "Scheermesscherp terug",
     tekst: "Binnen enkele dagen kun je je messen ophalen, klaar voor jaren plezier.",
   },
 ] as const

 export function Werkwijze() {
   return (
     <section id="werkwijze" className="border-t border-border bg-background">
       <div className="mx-auto max-w-6xl px-5 py-24 md:py-32">
         <p className="font-heading text-xs tracking-[0.22em] text-muted-foreground">
           ZO WERKT HET
         </p>
         <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
           Van bot naar scherp in vier stappen
         </h2>

         <div className="mt-12 grid gap-6 md:grid-cols-4">
           {stappen.map((s) => (
             <div
               key={s.nr}
               className="rounded-sm border border-border bg-card p-6 transition-colors hover:border-[color:var(--accent)]"
             >
               <div className="font-heading text-2xl font-extrabold tracking-tight text-foreground">
                 {s.nr}
               </div>
               <div className="mt-4 font-heading text-sm font-semibold tracking-tight text-foreground">
                 {s.titel}
               </div>
               <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                 {s.tekst}
               </p>
             </div>
           ))}
         </div>
       </div>
     </section>
   )
 }

