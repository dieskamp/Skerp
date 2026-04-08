 import Image from "next/image"
 import Link from "next/link"

 const links = [
   { href: "#diensten", label: "Diensten" },
   { href: "#werkwijze", label: "Werkwijze" },
   { href: "#werk", label: "Werk" },
   { href: "#afspraak", label: "Afspraak" },
   { href: "#faq", label: "FAQ" },
 ] as const

 export function Footer() {
   return (
     <footer id="contact" className="border-t border-border bg-[#050505]">
       <div className="mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-3">
         <div>
           <Image
             src="/logo.png"
             alt="Skerp Slijpservice"
             width={140}
             height={36}
             className="h-8 w-auto"
           />
           <p className="mt-4 text-sm text-muted-foreground">
             Vakkundig slijpwerk in Leeuwarden
           </p>
         </div>

         <div>
           <div className="font-heading text-xs tracking-[0.22em] text-muted-foreground">
             CONTACT
           </div>
           <div className="mt-4 space-y-2 text-sm">
             <p className="text-foreground">
               <span className="text-muted-foreground">Mail:</span>{" "}
               <a className="hover:text-foreground" href="mailto:info@skerp.nl">
                 info@skerp.nl
               </a>
             </p>
             <p className="text-foreground">
               <span className="text-muted-foreground">Telefoon:</span>{" "}
               <a className="hover:text-foreground" href="tel:+31600000000">
                 +31 6 0000 0000
               </a>
             </p>
             <p className="text-muted-foreground">Leeuwarden e.o.</p>
           </div>
         </div>

         <div>
           <div className="font-heading text-xs tracking-[0.22em] text-muted-foreground">
             SNEL NAAR
           </div>
           <ul className="mt-4 space-y-2 text-sm">
             {links.map((l) => (
               <li key={l.href}>
                 <Link
                   href={l.href}
                   className="text-muted-foreground hover:text-foreground"
                 >
                   {l.label}
                 </Link>
               </li>
             ))}
             <li>
               <a
                 href="https://facebook.com"
                 className="text-muted-foreground hover:text-foreground"
                 target="_blank"
                 rel="noopener noreferrer"
               >
                 Facebook
               </a>
             </li>
           </ul>
         </div>
       </div>

       <div className="border-t border-border/80">
         <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-6 text-xs text-muted-foreground md:flex-row md:items-center md:justify-between">
           <div>© 2026 Skerp Slijpservice</div>
           <div>KvK TODO · BTW TODO</div>
           <div className="flex gap-4">
             <Link href="/privacy" className="hover:text-foreground">
               Privacy
             </Link>
             <Link href="/voorwaarden" className="hover:text-foreground">
               Voorwaarden
             </Link>
           </div>
         </div>
       </div>
     </footer>
   )
 }

