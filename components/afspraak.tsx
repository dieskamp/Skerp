 "use client"

 import Cal, { getCalApi } from "@calcom/embed-react"
 import { useEffect } from "react"

 export function Afspraak() {
   useEffect(() => {
     ;(async () => {
       const cal = await getCalApi({ namespace: "slijpafspraak" })
       cal("ui", {
         theme: "dark",
         cssVarsPerTheme: {
           dark: { "cal-brand": "#60a5fa" },
           light: { "cal-brand": "#60a5fa" },
         },
         hideEventTypeDetails: false,
         layout: "month_view",
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

         <div className="mx-auto mt-10 max-w-3xl rounded-sm border border-[#2a2a2a] bg-card p-6">
           <Cal
             namespace="slijpafspraak"
             calLink="skerp/slijpafspraak"
             calOrigin="https://cal.eu"
             style={{ width: "100%", height: "100%", overflow: "scroll" }}
             config={{ layout: "month_view" }}
           />
         </div>
       </div>
     </section>
   )
 }

