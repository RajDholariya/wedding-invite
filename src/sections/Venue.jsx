import { motion } from "framer-motion";
import { CalendarDays, ChevronRight, Clock, MapPin, Navigation } from "lucide-react";
import { asset } from "../data.js";
import { Flourish, Rise, SectionTitle, Shine, ease, fadeUp } from "../motion.jsx";
import { useT } from "../i18n.jsx";

function Rosette() {
  const petals = [0, 45, 90, 135, 180, 225, 270, 315];
  return (
    <svg viewBox="-50 -50 100 100" className="h-full w-full drop-shadow-lg" aria-hidden>
      {petals.map((a) => (
        <ellipse key={a} cx="0" cy="-27" rx="11" ry="20" transform={`rotate(${a})`} fill="var(--br-primary)" stroke="var(--br-gold)" strokeWidth="1.5" />
      ))}
      {petals.map((a) => (
        <ellipse key={`in-${a}`} cx="0" cy="-17" rx="7.5" ry="14" transform={`rotate(${a + 22.5})`} fill="var(--br-gold)" stroke="var(--br-gold-deep)" strokeWidth="1" />
      ))}
      <circle r="9" fill="var(--br-gold-deep)" stroke="var(--br-card)" strokeWidth="2" />
      <circle r="3" fill="var(--br-card)" />
    </svg>
  );
}

const fade = (dir, stop) => ({
  maskImage: `linear-gradient(${dir}, black ${stop}, transparent)`,
  WebkitMaskImage: `linear-gradient(${dir}, black ${stop}, transparent)`,
});

export default function Venue({ venue }) {
  const t = useT();
  const rows = [
    { Icon: MapPin, label: t.address, text: venue.address },
    { Icon: CalendarDays, label: t.date, text: venue.date },
    { Icon: Clock, label: t.time, text: venue.time },
  ].filter((r) => r.text);

  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-28">
      <SectionTitle kicker={t.venueKicker}>{t.venueTitle}</SectionTitle>
      <Rise>
        <div className="br-shadow-royal relative overflow-hidden rounded-3xl border-2 border-br-gold bg-white/[0.04]">
          <div aria-hidden className="absolute inset-0">
            <img
              src={asset("gallery/jharokha.jpg")}
              alt=""
              loading="lazy"
              className="absolute inset-x-0 top-0 h-56 w-full object-cover object-top opacity-60 md:hidden"
              style={fade("to bottom", "20%")}
            />
            <img
              src={asset("gallery/jharokha.jpg")}
              alt=""
              loading="lazy"
              className="absolute inset-y-0 left-0 hidden h-full w-[31%] object-cover object-left opacity-80 md:block"
              style={fade("to right", "30%")}
            />
            <img
              src={asset("gallery/courtyard.jpg")}
              alt=""
              loading="lazy"
              className="absolute inset-x-0 bottom-0 h-[32%] w-full object-cover object-[center_35%] opacity-45"
              style={fade("to top", "15%")}
            />
          </div>
          <div aria-hidden className="pointer-events-none absolute inset-2.5 rounded-2xl border border-br-gold/70 md:inset-4" />
          <div className="relative grid gap-10 px-6 pb-12 pt-44 md:grid-cols-[1.05fr_1fr] md:items-center md:gap-10 md:py-16 md:pl-[21%] md:pr-12 lg:py-20">
            <motion.div
              className="min-w-0 text-center md:text-left"
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
              transition={{ staggerChildren: 0.14, delayChildren: 0.2 }}
            >
              <motion.p variants={fadeUp} className="br-script text-4xl text-br-primary lg:text-5xl">
                {t.joinUsAt}
              </motion.p>
              <motion.h3 variants={fadeUp} className="br-display mt-2 break-words text-3xl leading-tight text-br-primary md:text-5xl lg:text-6xl">
                {venue.name}
              </motion.h3>
              <motion.div variants={fadeUp} className="mt-5 flex justify-center md:justify-start">
                <Flourish />
              </motion.div>
              <ul className="mt-7 space-y-5 text-left">
                {rows.map(({ Icon, label, text }, i) => (
                  <motion.li key={label} variants={fadeUp} className="flex items-center gap-5">
                    <motion.span
                      className="br-shadow-royal flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-br-gold bg-white/5 text-br-primary ring-4 ring-br-gold/25 lg:h-16 lg:w-16"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 0.5 * i }}
                    >
                      <Icon className="h-6 w-6 lg:h-7 lg:w-7" aria-hidden />
                    </motion.span>
                    <span className="min-w-0">
                      <span className="br-display block text-xs uppercase tracking-[0.25em] text-br-gold-deep">{label}</span>
                      <span className="block break-words text-xl leading-snug text-br-fg lg:text-2xl">{text}</span>
                    </span>
                  </motion.li>
                ))}
              </ul>
              <motion.div variants={fadeUp}>
                <motion.a
                  href={venue.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="br-display br-shadow-royal relative mt-9 inline-flex items-center gap-3 overflow-hidden rounded-full border-2 border-br-gold bg-br-primary px-9 py-3.5 text-sm tracking-[0.2em] text-br-primary-fg ring-1 ring-inset ring-br-gold/50 lg:text-base"
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <Shine />
                  <Navigation className="h-4 w-4" aria-hidden />
                  {t.getDirections}
                  <ChevronRight className="h-4 w-4" aria-hidden />
                </motion.a>
              </motion.div>
            </motion.div>
            <motion.div
              className="br-shadow-royal relative rounded-3xl border-2 border-br-gold bg-white/[0.04] p-2.5 ring-1 ring-br-gold/40"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 1.1, delay: 0.3, ease }}
            >
              {["-top-6", "-bottom-6"].map((pos) => (
                <div key={pos} aria-hidden className={`absolute ${pos} left-1/2 z-10 h-12 w-12 -translate-x-1/2`}>
                  <motion.div className="h-full w-full" animate={{ rotate: 360 }} transition={{ duration: 14, repeat: Infinity, ease: "linear" }}>
                    <Rosette />
                  </motion.div>
                </div>
              ))}
              <iframe
                title={`Map of ${venue.name}`}
                className="block h-72 w-full rounded-2xl md:h-96 lg:h-[30rem]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={venue.embedUrl}
              />
            </motion.div>
          </div>
        </div>
      </Rise>
    </section>
  );
}
