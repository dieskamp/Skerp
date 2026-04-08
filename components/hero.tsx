 import Link from "next/link"
 import Image from "next/image"

 import { Button } from "@/components/ui/button"

 export function Hero() {
   return (
     <header id="top" className="relative min-h-screen">
       <div className="absolute inset-0 -z-10">
         <Image
           src="/hero.jpg"
           alt="Werkbank en slijpwerk"
           fill
           priority
           className="object-cover opacity-90"
         />
         <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/75 to-background" />
       </div>

       <div className="mx-auto flex min-h-screen max-w-6xl items-center px-5">
         <div className="max-w-3xl py-24">
           <p className="font-heading text-xs tracking-[0.22em] text-muted-foreground">
            MESSENSLIJPERIJ, LEEUWARDEN
           </p>
           <h1 className="mt-5 font-heading text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl md:text-6xl">
            Slijpwerk uit Leeuwarden, scherpte voor het leven.
           </h1>
           <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Van japans koksmes tot zakmes, Skerp brengt elk lemmet terug naar
             fabrieksstaat. Door een vakman, in Leeuwarden.
           </p>

           <div className="mt-10 flex flex-col gap-3 sm:flex-row">
             <Button asChild className="rounded-sm">
               <Link href="#afspraak">Maak afspraak</Link>
             </Button>
             <Button asChild variant="outline" className="rounded-sm">
               <Link href="#diensten">Bekijk diensten</Link>
             </Button>
           </div>
         </div>
       </div>
     </header>
   )
 }

