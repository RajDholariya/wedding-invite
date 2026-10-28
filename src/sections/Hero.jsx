import { motion, useScroll, useTransform } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Flourish, Letters, Rule, Wipe, Words, ease, easeSoft, fadeUp } from "../motion.jsx";
import { HeartAmp, coverBox, useGateLayout } from "./Gate.jsx";
import { useT } from "../i18n.jsx";

const heroLayout = {
  landscape: { top: "9.5%", size: { kicker: 1.25, title: 3.4, of: 1.35, names: 5.8, date: 1.8, tagline: 2.2 }, stacked: false },
  portrait: { top: "13.4%", size: { kicker: 2.6, title: 6.8, of: 2.7, names: 12, date: 3.6, tagline: 4.4 }, stacked: true },
};
const cream = "text-[oklch(0.94_0.03_70)]";
const blush = "text-[oklch(0.84_0.07_25)] [text-shadow:0_0_0.35em_oklch(0.75_0.1_20/0.45)]";

function HeroTitles({ layout, first, second, date }) {
  const t = useT();
  const l = heroLayout[layout];
  const cq = (n) => `${n}cqw`;
  return (
    // The artboard is centred and cropped on short screens; keep the titles at least 6% of the
    // visible viewport height below its top edge (cqh resolves to the 100svh size container).
    <div
      className="absolute inset-x-0 flex flex-col items-center px-[4%] text-center"
      style={{ top: `max(${l.top}, calc((100% - 100cqh) / 2 + 6cqh))` }}
    >
      <motion.p
        className={`br-serif ${cream}`}
        style={{ fontSize: cq(l.size.kicker) }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6, ease }}
      >
        {t.invitedTo}
      </motion.p>
      <p className={`br-script leading-tight ${blush}`} style={{ fontSize: cq(l.size.title) }}>
        <Wipe delay={0.9}>{t.weddingCeremony}</Wipe>
      </p>
      <div className={`br-serif flex items-center gap-[0.6em] ${cream}`} style={{ fontSize: cq(l.size.of) }}>
        <Rule delay={1.6} />
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 1.6 }}>
          {t.of}
        </motion.span>
        <Rule delay={1.6} flip />
      </div>
      <h1
        className={`br-script flex items-center justify-center leading-[1.05] ${blush} ${l.stacked ? "flex-col" : "gap-[0.25em] whitespace-nowrap"}`}
        style={{ fontSize: cq(l.size.names) }}
      >
        <Letters text={first} delay={1.9} />
        <span className="sr-only">{t.and}</span>
        <HeartAmp delay={2.5} className={l.stacked ? "text-[0.42em]" : "text-[0.45em]"} />
        <Letters text={second} delay={2.6} />
      </h1>
      {date && (
        <motion.p
          className={`br-serif mt-[0.3em] font-semibold uppercase ${cream}`}
          style={{ fontSize: cq(l.size.date) }}
          initial={{ opacity: 0, letterSpacing: "0.6em" }}
          animate={{ opacity: 1, letterSpacing: "0.14em" }}
          transition={{ duration: 1.8, delay: 3.2, ease }}
        >
          {date}
        </motion.p>
      )}
      {/* <p className={`br-script leading-tight ${blush}`} style={{ fontSize: cq(l.size.tagline) }}>
        <Wipe delay={3.7}>{t.togetherForever}</Wipe>
      </p> */}
      <div className="flex items-center gap-[0.4em]" style={{ fontSize: cq(l.size.of) }}>
        <Rule delay={4.2} />
        <HeartAmp delay={4.2} className="text-[0.8em]" />
        <Rule delay={4.2} flip />
      </div>
    </div>
  );
}

function Petals() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 22 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute -top-6 block h-3 w-2.5 rounded-[80%_0_80%_0] md:h-4 md:w-3"
          style={{
            left: `${(41 * i + 11) % 100}%`,
            background:
              i % 3 === 0
                ? "linear-gradient(135deg, oklch(0.9 0.06 20), oklch(0.72 0.13 10))"
                : "linear-gradient(135deg, oklch(0.82 0.1 15), oklch(0.6 0.17 12))",
          }}
          initial={{ y: "-5vh", opacity: 0 }}
          animate={{ y: "110vh", opacity: [0, 1, 1, 0.8], x: [0, 40, -30, 20], rotate: [0, 160, 320, 480], rotateX: [0, 180, 360] }}
          transition={{ duration: 9 + (i % 6) * 1.5, repeat: Infinity, delay: (i % 11) * 0.6, ease: "linear" }}
        />
      ))}
    </div>
  );
}

function Sheen() {
  return (
    <motion.span
      aria-hidden
      className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/30 to-transparent"
      style={{ skewX: -12 }}
      animate={{ x: ["-150%", "450%"] }}
      transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
    />
  );
}

export default function Hero({ sectionRef, first, second, shortDate, dateLabel, placeLabel, revealAlt }) {
  const g = useGateLayout();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const textOpacity = useTransform(scrollYProgress, [0.25, 0.6], [1, 0]);

  return (
    <section ref={sectionRef} className="relative flex flex-col items-center">
      <div className="relative h-[100svh] w-full overflow-hidden bg-br-night [container-type:size]">
        {g && (
          <motion.div key={g.layout} className="absolute left-1/2 top-1/2 [container-type:inline-size]" style={coverBox(g.reveal.aspect)}>
            {/* the blur lives on its own layer and is cleared once sharp, so the long zoom isn't rasterised through a filter */}
            <motion.div
              className="absolute inset-0"
              style={{ y: imageY }}
              initial={{ filter: "blur(8px)" }}
              animate={{ filter: "blur(0px)", transitionEnd: { filter: "none" } }}
              transition={{ duration: 2.4, ease: easeSoft }}
            >
              <motion.img
                src={g.reveal.image}
                alt={revealAlt}
                className="absolute inset-0 h-full w-full"
                initial={{ scale: 1.35 }}
                animate={{ scale: [1.35, 1, 1.05] }}
                transition={{ duration: 18, times: [0, 0.18, 1], ease: [easeSoft, "easeInOut"] }}
              />
            </motion.div>
            <motion.div className="absolute inset-0" style={{ y: textY, opacity: textOpacity }}>
              <HeroTitles layout={g.layout} first={first} second={second} date={shortDate} />
            </motion.div>
          </motion.div>
        )}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <motion.span
            className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent mix-blend-soft-light"
            style={{ skewX: -12 }}
            initial={{ x: "-150%" }}
            animate={{ x: ["-150%", "420%"] }}
            transition={{ duration: 2.6, delay: 5, repeat: Infinity, repeatDelay: 6, ease: "easeInOut" }}
          />
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-0">
          {Array.from({ length: 14 }).map((_, i) => (
            <motion.span
              key={i}
              className="absolute h-1.5 w-1.5 rounded-full bg-[oklch(0.97_0.05_85)] shadow-[0_0_10px_3px_oklch(0.85_0.13_80)]"
              style={{ left: `${(29 * i + 5) % 96}%`, top: `${(47 * i + 9) % 70}%` }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0] }}
              transition={{ duration: 2.2, delay: 1.5 + (i % 7) * 0.6, repeat: Infinity, repeatDelay: 2 + (i % 4) }}
            />
          ))}
        </div>
        <Petals />
      </div>

      {(dateLabel || placeLabel) && (
        <motion.div
          className="relative z-20 flex w-full flex-col items-center px-6 pb-10 pt-8"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.4 }}
          transition={{ staggerChildren: 0.2 }}
        >
          <motion.div variants={fadeUp}>
            <Flourish />
          </motion.div>
          <motion.div
            className="mt-5 max-w-full"
            variants={{
              hidden: { opacity: 0, scale: 0.8, y: 40 },
              show: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 120, damping: 14 } },
            }}
          >
            <motion.div
              className="br-shadow-royal relative overflow-hidden rounded-2xl border-2 border-br-gold bg-br-night px-8 py-4 text-center text-br-night-fg ring-1 ring-inset ring-br-gold/50 sm:rounded-full sm:px-14"
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sheen />
              {dateLabel && (
                <p className="br-display relative text-base tracking-[0.12em] sm:text-xl lg:text-3xl">
                  <Words text={dateLabel} delay={0.4} />
                </p>
              )}
              {placeLabel && (
                <p className="br-display relative mt-1 break-words text-[0.7rem] uppercase tracking-[0.3em] text-br-gold sm:text-xs">{placeLabel}</p>
              )}
            </motion.div>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-5 text-br-primary" aria-hidden>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}>
              <ChevronDown className="h-6 w-6" />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </section>
  );
}
