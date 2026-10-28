import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";

// Easing curves used throughout the reference.
export const ease = [0.22, 1, 0.36, 1];
export const easeSoft = [0.16, 1, 0.3, 1];

export const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease } },
};

/** Lift-in on first view (opacity, y 90 → 0, scale .94 → 1). */
export function Rise({ children, delay = 0, x = 0, className = "" }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 90, x, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 1.3, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

/** Word-by-word tilt-up reveal. */
export function Words({ text, delay = 0 }) {
  return (
    <motion.span
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.5 }}
      transition={{ staggerChildren: 0.09, delayChildren: delay }}
    >
      {String(text || "")
        .split(" ")
        .map((w, i) => (
          <span key={i}>
            <motion.span
              className="inline-block"
              variants={{
                hidden: { opacity: 0, y: 36, rotate: 4 },
                show: { opacity: 1, y: 0, rotate: 0, transition: { duration: 1, ease } },
              }}
            >
              {w}
            </motion.span>{" "}
          </span>
        ))}
    </motion.span>
  );
}

/** Scroll-linked wrapper: fades/rises in as it enters, fades/lifts as it leaves. */
export function ScrollScene({ children }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress: enter } = useScroll({ target: ref, offset: ["start end", "start 35%"] });
  const { scrollYProgress: leave } = useScroll({ target: ref, offset: ["end 18%", "end start"] });
  const spring = { stiffness: 60, damping: 20, restDelta: 0.001 };
  const a = useSpring(enter, spring);
  const b = useSpring(leave, spring);
  const opacity = useTransform(() => a.get() * (1 - 0.5 * b.get()));
  const y = useTransform(() => (1 - a.get()) * 110 - 30 * b.get());
  if (reduce) return <div ref={ref}>{children}</div>;
  return (
    <motion.div ref={ref} style={{ opacity, y }}>
      {children}
    </motion.div>
  );
}

/** Diagonal light sweep across a card. */
export function Shine({ delay = 0, repeatDelay = 3, className = "via-white/30" }) {
  return (
    <motion.span
      aria-hidden
      className={`pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent to-transparent ${className}`}
      style={{ skewX: -12 }}
      animate={{ x: ["-150%", "450%"] }}
      transition={{ duration: 2.2, repeat: Infinity, repeatDelay, delay, ease: "easeInOut" }}
    />
  );
}

export const twinkle = {
  animate: { opacity: [0.35, 1, 0.35], scale: [0.9, 1.2, 0.9] },
  transition: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
};

/** Gold rule ── ❖ ── with the diamond slowly spinning. */
export function Flourish() {
  const line = (origin) => (
    <motion.span
      className={`h-px w-16 bg-br-gold ${origin}`}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay: 0.5, ease }}
    />
  );
  return (
    <div className="flex items-center justify-center gap-3 text-br-gold" aria-hidden>
      {line("origin-right")}
      <motion.span className="text-xl" animate={{ rotate: 360 }} transition={{ duration: 16, repeat: Infinity, ease: "linear" }}>
        ❖
      </motion.span>
      {line("origin-left")}
    </div>
  );
}

export function SectionTitle({ kicker, children }) {
  return (
    <Rise className="mb-8 text-center md:mb-14">
      <p className="br-script text-3xl text-br-gold-deep md:text-4xl lg:text-5xl">{kicker}</p>
      <h2 className="br-display mt-2 text-3xl text-br-primary md:text-5xl lg:text-6xl">
        <Words text={children} delay={0.2} />
      </h2>
      <div className="mt-4">
        <Flourish />
      </div>
    </Rise>
  );
}

export function Stage({ children, className = "min-h-[70vh] md:min-h-screen" }) {
  return (
    <section className={`relative flex items-center justify-center overflow-hidden px-6 py-16 md:py-28 ${className}`}>
      <div className="relative z-10 w-full">{children}</div>
    </section>
  );
}

// Split by grapheme so Gujarati conjuncts and vowel signs stay attached to their letter.
const segmenter = typeof Intl !== "undefined" && Intl.Segmenter ? new Intl.Segmenter(undefined, { granularity: "grapheme" }) : null;
const graphemes = (text) => (segmenter ? Array.from(segmenter.segment(text), (s) => s.segment) : Array.from(text));

/** Letter-by-letter flip-up with a blur/brightness flash. */
export function Letters({ text, delay = 0 }) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden className="inline-block [perspective:800px]">
        {graphemes(String(text || "")).map((ch, i) => (
          <motion.span
            key={i}
            className="inline-block origin-bottom"
            initial={{ opacity: 0, y: "0.4em", rotateX: -90, filter: "blur(8px) brightness(2)" }}
            animate={{
              opacity: 1,
              y: "0em",
              rotateX: 0,
              filter: ["blur(8px) brightness(2)", "blur(0px) brightness(1.4)", "blur(0px) brightness(1)"],
            }}
            transition={{ duration: 1.1, delay: delay + 0.07 * i, ease }}
          >
            {ch === " " ? " " : ch}
          </motion.span>
        ))}
      </span>
    </>
  );
}

/** Left-to-right clip-path wipe. */
export function Wipe({ children, delay, className = "" }) {
  return (
    <motion.span
      className={`inline-block ${className}`}
      initial={{ opacity: 0, clipPath: "inset(-20% 100% -20% 0)" }}
      animate={{ opacity: 1, clipPath: "inset(-20% 0% -20% 0)" }}
      transition={{ duration: 1.5, delay, ease: "easeInOut" }}
    >
      {children}
    </motion.span>
  );
}

/** Thin blush rule that grows out from the centre. */
export function Rule({ delay, flip = false }) {
  return (
    <motion.span
      aria-hidden
      className={`block h-px w-[1.6em] from-transparent to-[oklch(0.86_0.08_40)] ${flip ? "origin-left bg-gradient-to-l" : "origin-right bg-gradient-to-r"}`}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 1.1, delay, ease }}
    />
  );
}
