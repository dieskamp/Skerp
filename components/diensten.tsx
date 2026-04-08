 import {
   Axe,
   Scissors,
   PocketKnife,
   ChefHat,
   Sparkles,
 } from "lucide-react"
 import { KnifeIcon } from "@/components/icons/knife"

 import {
   Card,
   CardContent,
   CardHeader,
   CardTitle,
 } from "@/components/ui/card"
 import { cn } from "@/lib/utils"

 const diensten = [
   {
     icon: ChefHat,
     titel: "Keukenmes (standaard)",
     prijs: "vanaf €4",
     beschrijving:
       "Westers koksmes, schilmes, fileermes. Geslepen op band en afgewerkt op leer.",
   },
   {
     icon: KnifeIcon,
     titel: "Keukenmes (groot)",
     prijs: "vanaf €6",
     beschrijving: "Grote koksmessen en hakmessen vanaf 20cm.",
   },
   {
     icon: Sparkles,
     titel: "Japans mes",
     prijs: "vanaf €12",
     beschrijving:
       "Honyaki, santoku, nakiri, gyuto. Met de hand op japanse waterstenen tot 3000 grit.",
   },
   {
     icon: Scissors,
     titel: "Schaar",
     prijs: "vanaf €5",
     beschrijving: "Huishoudschaar, kapperschaar, hobbyschaar.",
   },
   {
     icon: PocketKnife,
     titel: "Zakmes / EDC",
     prijs: "vanaf €6",
     beschrijving:
       "Folders en vaste zakmessen, ook premium merken zoals WE Knife, Benchmade, Spyderco.",
   },
   {
     icon: Axe,
     titel: "Slagers- & hakmes",
     prijs: "vanaf €8",
     beschrijving: "Zware messen voor zwaar werk.",
   },
 ] as const

 export function Diensten() {
   return (
     <section id="diensten" className="border-t border-border bg-background">
       <div className="mx-auto max-w-6xl px-5 py-24 md:py-32">
         <p className="font-heading text-xs tracking-[0.22em] text-muted-foreground">
           DIENSTEN &amp; TARIEVEN
         </p>
         <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
           Wat ik voor je slijp
         </h2>

         <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
           {diensten.map((d) => {
             const Icon = d.icon
             return (
               <Card
                 key={d.titel}
                 className={cn(
                   "rounded-sm border border-border bg-card ring-0 transition-colors hover:border-[color:var(--accent)]",
                   "focus-within:border-[color:var(--accent)]"
                 )}
               >
                 <CardHeader className="px-5 pt-5">
                   <div className="flex items-start justify-between gap-4">
                     <div>
                       <CardTitle className="font-heading text-base font-semibold tracking-tight">
                         {d.titel}
                       </CardTitle>
                       <div className="mt-3 text-lg font-semibold text-foreground">
                         {d.prijs}
                       </div>
                     </div>
                     <div className="mt-1 rounded-sm border border-border bg-muted p-2 text-muted-foreground">
                       <Icon className="size-5" aria-hidden="true" />
                     </div>
                   </div>
                 </CardHeader>
                 <CardContent className="px-5 pb-5 pt-0">
                   <p className="text-sm leading-relaxed text-muted-foreground">
                     {d.beschrijving}
                   </p>
                 </CardContent>
               </Card>
             )
           })}
         </div>

         <p className="mt-8 text-sm text-muted-foreground">
           Prijzen zijn indicatief. Beschadigde sneden of speciaal werk in overleg.
         </p>
       </div>
     </section>
   )
 }

