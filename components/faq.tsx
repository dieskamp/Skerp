 import {
   Accordion,
   AccordionContent,
   AccordionItem,
   AccordionTrigger,
 } from "@/components/ui/accordion"

 const items = [
   {
     q: "Hoe lang duurt het?",
     a: "Meestal 2-4 dagen, afhankelijk van drukte en het aantal messen.",
   },
   {
     q: "Kan ik wachten terwijl je slijpt?",
     a: "Op afspraak voor enkele kleine klussen mogelijk, maar voor het beste resultaat neem ik graag de tijd.",
   },
   {
     q: "Welke messen slijp je niet?",
     a: "Keramische messen kan ik helaas niet behandelen. Kartelmessen alleen op aanvraag.",
   },
   {
     q: "Wat als mijn mes beschadigd is?",
     a: "Lichte beschadigingen kan ik meestal verhelpen. Bij grotere schade overleg ik altijd eerst.",
   },
   {
     q: "Hoe kan ik betalen?",
     a: "Contant of via Tikkie bij ophalen.",
   },
   {
     q: "Werk je ook voor restaurants?",
     a: "Ja, neem contact op voor een abonnement of doorlopende afspraak.",
   },
 ] as const

 export function Faq() {
   return (
     <section id="faq" className="border-t border-border bg-background">
       <div className="mx-auto max-w-6xl px-5 py-24 md:py-32">
         <p className="font-heading text-xs tracking-[0.22em] text-muted-foreground">
           VEELGESTELDE VRAGEN
         </p>
         <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
           Goed om te weten
         </h2>

         <div className="mt-10 max-w-3xl">
           <Accordion type="single" collapsible>
             {items.map((it) => (
               <AccordionItem
                 key={it.q}
                 value={it.q}
                 className="border-border"
               >
                 <AccordionTrigger className="rounded-sm px-0 hover:no-underline">
                   {it.q}
                 </AccordionTrigger>
                 <AccordionContent className="px-0 text-muted-foreground">
                   {it.a}
                 </AccordionContent>
               </AccordionItem>
             ))}
           </Accordion>
         </div>
       </div>
     </section>
   )
 }

