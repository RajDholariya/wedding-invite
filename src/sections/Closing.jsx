import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { MessageCircle, Phone } from "lucide-react";
import { asset } from "../data.js";
import { Rise, SectionTitle, Stage, Words, ease } from "../motion.jsx";
import { useT } from "../i18n.jsx";

const digits = (phone) => phone.replace(/[^\d+]/g, "");

function ContactCard({ c, i }) {
  const tel = `tel:${digits(c.phone)}`;
  const wa = `https://wa.me/${digits(c.phone).replace("+", "")}`;
  return (
    <Rise delay={0.12 * i} className="h-full min-w-0">
      <motion.div
        className="flex h-full flex-col items-center justify-between rounded-2xl border border-br-gold/30 bg-transparent p-6 text-center transition-colors hover:border-br-gold/60 hover:bg-br-gold/[0.03]"
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
      >
        <div className="flex w-full min-w-0 flex-col items-center">
          <p className="br-script text-2xl leading-none text-br-gold md:text-3xl">{c.relation}</p>
          <h3 className="br-name mt-2 break-words text-base font-medium uppercase leading-snug tracking-[0.12em] text-br-primary md:text-lg">{c.name}</h3>
          <div aria-hidden className="my-3 flex items-center justify-center gap-2">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-br-gold/70" />
            <span className="h-1.5 w-1.5 rotate-45 bg-br-gold/80" />
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-br-gold/70" />
          </div>
          <a href={tel} className="br-display text-sm tracking-[0.12em] text-br-fg transition-colors hover:text-br-gold md:text-base">
            {c.phone}
          </a>
        </div>
        <div className="br-card-font mt-6 flex w-full gap-2.5">
          <motion.a
            href={tel}
            aria-label={`Call ${c.name}`}
            className="br-bg-gold-grad flex flex-1 items-center justify-center gap-2 rounded-full px-3 py-2.5 text-sm font-semibold text-br-primary-fg shadow-sm"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Phone className="h-4 w-4" aria-hidden />
            Call
          </motion.a>
          <motion.a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp ${c.name}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-full border border-br-gold/70 px-3 py-2.5 text-sm font-semibold text-br-gold transition-colors hover:bg-br-gold/10"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            WhatsApp
          </motion.a>
        </div>
      </motion.div>
    </Rise>
  );
}

export function Contacts({ contacts }) {
  if (!contacts.length) return null;
  const cols = contacts.length >= 4 ? "lg:grid-cols-4" : contacts.length === 3 ? "lg:grid-cols-3" : "";
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <SectionTitle kicker="For any help, call us">Get in Touch</SectionTitle>
      <div className={`grid gap-6 sm:grid-cols-2 ${cols}`}>
        {contacts.map((c, i) => (
          <ContactCard key={`${c.name}-${i}`} c={c} i={i} />
        ))}
      </div>
    </section>
  );
}

export function Farewell({ coupleLine, dateLabel, hashtag }) {
  const t = useT();
  return (
    <Stage>
      <Rise className="text-center">
        <p className="br-script text-4xl text-br-gold-deep lg:text-6xl">{t.awaitPresence}</p>
        <h2 className="br-display mt-3 break-words text-4xl text-br-primary md:text-7xl lg:text-8xl">
          <Words text={coupleLine} delay={0.4} />
        </h2>
        {dateLabel && (
          <motion.p
            className="br-display mt-4 tracking-widest text-br-gold-deep"
            animate={{ opacity: [0.6, 1, 0.6], letterSpacing: ["0.1em", "0.18em", "0.1em"] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            {dateLabel}
          </motion.p>
        )}
        {hashtag && <p className="br-display mt-3 text-sm tracking-[0.18em] text-br-gold">{hashtag.startsWith("#") ? hashtag : `#${hashtag}`}</p>}
      </Rise>
    </Stage>
  );
}

/** Couple-on-a-bench illustration that grows into place as the page bottoms out. */
export function BenchFooter() {
  const t = useT();
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const p = useSpring(scrollYProgress, { stiffness: 70, damping: 22, restDelta: 0.001 });
  const scale = useTransform(p, [0, 1], [0.86, 1]);
  const y = useTransform(p, [0, 1], [60, 0]);
  const glow = useTransform(p, [0, 1], [0.25, 0.8]);
  return (
    <footer className="-mt-8 md:-mt-16">
      <section className="relative overflow-hidden pt-10 md:pt-16">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {Array.from({ length: 16 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute h-1 w-1 rounded-full bg-br-gold md:h-1.5 md:w-1.5"
              style={{ left: `${(41 * i + 7) % 96}%`, top: `${10 + ((23 * i) % 55)}%`, boxShadow: "0 0 8px var(--br-gold)" }}
              animate={{ opacity: [0, 0.9, 0], scale: [0.6, 1.2, 0.6] }}
              transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: 0.45 * i }}
            />
          ))}
        </div>
        <div ref={ref} className="relative">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 top-[5%] blur-3xl"
            style={{
              opacity: glow,
              background:
                "radial-gradient(ellipse 55% 60% at 50% 60%, oklch(0.85 0.14 70 / 0.32), oklch(0.68 0.16 35 / 0.14) 55%, transparent 80%)",
            }}
          />
          <motion.div className="relative mx-auto w-full max-w-6xl origin-bottom px-2 sm:px-6 md:px-8" style={{ scale, y }}>
            <motion.img
              src={asset("footer/bench-couple.webp")}
              alt={t.benchAlt}
              width={1672}
              height={940}
              loading="lazy"
              className="mx-auto block h-auto w-full object-contain drop-shadow-[0_-10px_45px_rgba(0,0,0,0.65)]"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 1.4, ease }}
            />
          </motion.div>
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-br-bg to-transparent md:h-24" />
          <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-br-gold/60 to-transparent" />
        </div>
      </section>
    </footer>
  );
}

/** Blossoms drifting down over the whole page; dims once scrolling starts. */
export function FallingBlossoms({ progress }) {
  const opacity = useTransform(progress, [0, 0.05], [1, 0.5]);
  return (
    <motion.div style={{ opacity }} className="pointer-events-none fixed inset-0 z-40 overflow-hidden" aria-hidden>
      {Array.from({ length: 14 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute -top-8 text-lg text-br-accent"
          style={{ left: `${(37 * i) % 100}%` }}
          initial={{ y: "0vh", rotate: 0 }}
          animate={{ y: "110vh", rotate: 360, x: [0, 30, -20, 0] }}
          transition={{ duration: 12 + (i % 5) * 2, repeat: Infinity, delay: 0.9 * i, ease: "linear" }}
        >
          ✿
        </motion.span>
      ))}
    </motion.div>
  );
}
