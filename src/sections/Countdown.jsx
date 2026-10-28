import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flourish, Rise, Shine, Stage, Words, ease } from "../motion.jsx";
import { useT } from "../i18n.jsx";

function useRemaining(target) {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (now === null) return [0, 0, 0, 0];
  const ms = Math.max(0, target - now);
  return [ms / 864e5, (ms / 36e5) % 24, (ms / 6e4) % 60, (ms / 1e3) % 60].map(Math.floor);
}

function Clock({ target }) {
  const t = useT();
  const parts = useRemaining(target);
  return (
    <div className="mx-auto grid w-full max-w-2xl grid-cols-4 gap-2.5 sm:gap-5 lg:max-w-3xl lg:gap-7">
      {t.units.map((label, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 40, rotateX: -60 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.3 + 0.12 * i, ease }}
        >
          <motion.div
            className="br-shadow-royal relative overflow-hidden rounded-b-lg rounded-t-full border-2 border-br-gold bg-br-night px-1 pb-3 pt-7 text-br-night-fg ring-1 ring-inset ring-br-gold/50 sm:pb-6 sm:pt-12"
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 * i }}
          >
            <Shine delay={0.6 * i} />
            {i === 3 && (
              <motion.span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-[inherit]"
                animate={{
                  boxShadow: [
                    "inset 0 0 0 0 oklch(0.76 0.13 78 / 0)",
                    "inset 0 0 22px 2px oklch(0.76 0.13 78 / 0.55)",
                    "inset 0 0 0 0 oklch(0.76 0.13 78 / 0)",
                  ],
                }}
                transition={{ duration: 1, repeat: Infinity, ease: "easeOut" }}
              />
            )}
            <motion.div
              className="relative text-[0.6rem] leading-none text-br-gold sm:text-sm"
              aria-hidden
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              ❖
            </motion.div>
            <div className="br-display relative mt-1.5 overflow-hidden text-[1.6rem] leading-tight sm:mt-3 sm:text-5xl lg:text-6xl">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={parts[i]}
                  initial={{ y: "100%", opacity: 0, scale: 0.6 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: "-100%", opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.5, ease }}
                >
                  {t.num(String(parts[i]).padStart(2, "0"))}
                </motion.div>
              </AnimatePresence>
            </div>
            <div className="relative mx-auto my-1.5 h-px w-6 bg-br-gold/70 sm:my-3 sm:w-10" />
            <div className="br-display relative text-[0.55rem] uppercase tracking-[0.12em] text-br-gold sm:text-xs sm:tracking-[0.25em]">{label}</div>
          </motion.div>
        </motion.div>
      ))}
    </div>
  );
}

export default function Countdown({ countdownTo }) {
  const t = useT();
  return (
    <Stage className="md:min-h-[80vh]">
      <Rise className="mx-auto max-w-2xl text-center lg:max-w-4xl">
        <p className="br-script text-4xl text-br-gold-deep lg:text-6xl">{t.withFamilies}</p>
        <p className="br-serif mt-4 text-2xl italic text-br-primary md:text-3xl lg:text-4xl lg:leading-snug">
          <Words text={t.requestHonour} delay={0.3} />
        </p>
        <div className="mt-8">
          <Flourish />
        </div>
        {countdownTo && (
          <>
            <p className="br-script mt-10 text-3xl text-br-gold-deep lg:text-5xl">{t.countingMoments}</p>
            <div className="mt-5">
              <Clock target={countdownTo} />
            </div>
          </>
        )}
      </Rise>
    </Stage>
  );
}
