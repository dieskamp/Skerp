"use client"

import { ParallaxImage } from "@/components/motion/parallax-image"
import { ScrubLines } from "@/components/motion/scrub-lines"
import { SectionHeading } from "@/components/motion/section-heading"

export function Over() {
  return (
    <section id="over" aria-labelledby="over-titel" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-10 right-0 font-heading text-[30vw] leading-none font-black text-transparent [-webkit-text-stroke:1px_rgba(233,237,242,0.05)] select-none"
      >
        01
      </div>
      <div className="relative mx-auto grid max-w-6xl gap-14 px-5 py-28 md:grid-cols-12 md:items-center md:py-40">
        <ParallaxImage
          src="/gallery/skerp-1.jpg"
          alt="Werkplek van Skerp Slijpservice"
          sizes="(min-width: 768px) 45vw, 100vw"
          className="aspect-[4/5] md:col-span-5"
        />

        <div className="md:col-span-6 md:col-start-7">
          <SectionHeading index="01" eyebrow="OVER SKERP" title="Een vakman met passie voor staal" id="over-titel" />

          <ScrubLines className="mt-10 space-y-6 text-lg leading-relaxed text-chrome sm:text-xl">
            <p>
              Skerp Slijpservice is het werk van Peter van der Rol. Wat begon als een hobby, het restaureren en
              slijpen van eigen messen, groeide uit tot een ambacht waar precisie en gevoel voor staal centraal
              staan.
            </p>
            <p>
              Voor elk lemmet kies ik de juiste aanpak: een Work Sharp Ken Onion voor gecontroleerd bandwerk,
              japanse waterstenen tot 3000 grit voor handslijpwerk, en een leren strop voor die laatste finishing
              touch.
            </p>
            <p>
              Waarom? Een scherp mes is veiliger, sneller en gewoon leuker om mee te werken, thuis én
              professioneel.
            </p>
          </ScrubLines>
        </div>
      </div>
    </section>
  )
}
