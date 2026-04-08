 "use client"

 import Link from "next/link"
 import * as React from "react"
 import { Menu, X } from "lucide-react"

 import { Button } from "@/components/ui/button"
 import { cn } from "@/lib/utils"

 const navItems = [
   { href: "#diensten", label: "Diensten" },
   { href: "#werkwijze", label: "Werkwijze" },
   { href: "#werk", label: "Werk" },
   { href: "#afspraak", label: "Afspraak" },
   { href: "#contact", label: "Contact" },
 ] as const

 function NavLinks({
   className,
   onNavigate,
 }: {
   className?: string
   onNavigate?: () => void
 }) {
   return (
     <ul className={cn("flex items-center gap-6", className)}>
       {navItems.map((item) => (
         <li key={item.href}>
           <Link
             href={item.href}
             className="text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
             onClick={onNavigate}
           >
             {item.label}
           </Link>
         </li>
       ))}
     </ul>
   )
 }

 export function Navbar() {
   const [open, setOpen] = React.useState(false)
   const [scrolled, setScrolled] = React.useState(false)

   React.useEffect(() => {
     const onScroll = () => setScrolled(window.scrollY > 8)
     onScroll()
     window.addEventListener("scroll", onScroll, { passive: true })
     return () => window.removeEventListener("scroll", onScroll)
   }, [])

   React.useEffect(() => {
     if (!open) return
     const onKeyDown = (e: KeyboardEvent) => {
       if (e.key === "Escape") setOpen(false)
     }
     window.addEventListener("keydown", onKeyDown)
     return () => window.removeEventListener("keydown", onKeyDown)
   }, [open])

   return (
     <header className="sticky top-0 z-50">
       <div
         className={cn(
           "border-b border-border/70 supports-[backdrop-filter]:backdrop-blur",
           scrolled ? "bg-background/75" : "bg-transparent"
         )}
       >
         <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
           <Link href="#top" className="flex flex-col items-start">
             <span className="font-heading text-2xl font-extrabold tracking-tighter uppercase text-[#f5f5f5] md:text-3xl">
               SKERP
             </span>
             <span className="-mt-1 text-[10px] tracking-widest uppercase text-[#a3a3a3]">
               SLIJPSERVICE
             </span>
           </Link>

           <div className="hidden md:flex">
             <NavLinks />
           </div>

           <div className="md:hidden">
             <Button
               variant="outline"
               size="icon"
               aria-label={open ? "Menu sluiten" : "Menu openen"}
               aria-expanded={open}
               onClick={() => setOpen((v) => !v)}
               className="rounded-sm border-border bg-background/40 hover:bg-muted"
             >
               {open ? <X /> : <Menu />}
             </Button>
           </div>
         </nav>
       </div>

       {open ? (
         <div className="md:hidden">
           <div className="border-b border-border bg-background/95 px-5 py-4 supports-[backdrop-filter]:backdrop-blur">
             <NavLinks
               className="flex-col items-start gap-4"
               onNavigate={() => setOpen(false)}
             />
           </div>
         </div>
       ) : null}
     </header>
   )
 }

