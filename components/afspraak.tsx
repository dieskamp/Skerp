 "use client"

 import Cal, { getCalApi } from "@calcom/embed-react"
 import * as React from "react"

 export function Afspraak() {
   React.useEffect(() => {
     ;(async () => {
       const cal = await getCalApi({ namespace: "skerp" })
       cal("ui", {
         theme: "dark",
         styles: { branding: { brandColor: "#60a5fa" } },
       })
     })()
   }, [])

   return (
     <section id="afspraak" className="border-t border-border bg-background">
       <div className="mx-auto max-w-6xl px-5 py-24 md:py-32">
         <p className="font-heading text-xs tracking-[0.22em] text-muted-foreground">
           MAAK EEN AFSPRAAK
         </p>
         <h2 className="mt-4 font-heading text-3xl font-bold tracking-tight sm:text-4xl">
           Plan je slijpbeurt
         </h2>
         <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
           Kies een moment dat jou uitkomt. Je krijgt direct een bevestiging per
           mail.
         </p>

         <div className="mx-auto mt-10 max-w-3xl rounded-sm border border-border bg-card p-6">
           <Cal
             namespace="skerp"
             calLink="skerp-slijpservice/intake"
             style={{ width: "100%" }}
             config={{
               theme: "dark",
             }}
           />
           <p className="mt-4 text-xs text-muted-foreground">
             TODO: vervang de Cal.com username zodra het account live is.
           </p>
         </div>
       </div>
     </section>
   )
 }

