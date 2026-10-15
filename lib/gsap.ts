"use client"

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import { useGSAP } from "@gsap/react"

// Registreer plugins één keer, alleen in de browser.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP)
}

export { gsap, ScrollTrigger, SplitText, useGSAP }
