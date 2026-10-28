import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Pointer } from "lucide-react";
import { gate } from "../data.js";
import { Letters, Rule, Wipe, ease } from "../motion.jsx";
import { useT } from "../i18n.jsx";

/** Portrait art below a 1:1 aspect ratio, landscape art above it. */
export function useGateLayout() {
  const [layout, setLayout] = useState(null);
  useEffect(() => {
    const mq = window.matchMedia("(max-aspect-ratio: 1/1)");
    const update = () => setLayout(mq.matches ? gate.portrait : gate.landscape);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return layout;
}

/** "object-fit: cover" box for a fixed-aspect artboard inside a size container. */
export function coverBox(aspect, anchor = "center") {
  return {
    width: `max(100cqw, 100cqh * ${aspect})`,
    aspectRatio: aspect,
    x: "-50%",
    ...(anchor === "top" ? { top: 0, y: "0%" } : { y: "-50%" }),
  };
}

/** Heart badge with an "&" inside: springs in, then beats. */
export function HeartAmp({ delay, className = "" }) {
  return (
    <motion.span
      aria-hidden
      className={`relative inline-flex items-center justify-center ${className}`}
      initial={{ scale: 0, rotate: -30 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ delay, type: "spring", stiffness: 160, damping: 10 }}
    >
      <motion.span
        className="inline-flex"
        animate={{ scale: [1, 1.15, 1, 1.1, 1] }}
        transition={{ duration: 1.6, delay: delay + 1, repeat: Infinity, repeatDelay: 1.2 }}
      >
        <Heart className="h-[1em] w-[1em] fill-[oklch(0.82_0.09_15)] text-[oklch(0.82_0.09_15)] drop-shadow-[0_0_0.3em_oklch(0.8_0.12_15/0.7)]" />
      </motion.span>
      <span className="br-serif br-amp absolute text-[0.32em] text-[oklch(0.35_0.08_15)]">&amp;</span>
    </motion.span>
  );
}

// Seconds into the opening sequence.
const T = { unlockAt: 0.8, swingAt: 1.1, swing: 2.1, pushAt: 2.3, push: 2.4, done: 3.9 };
const vignetteTimes = [0, 0.9 / T.done, (T.done - 0.6) / T.done, 1];

const titleLayout = {
  landscape: { title: "1.2%", names: "36.5%", size: { small: 2.4, big: 5.2, names: 3.7 } },
  portrait: { title: "2.4%", names: "31%", size: { small: 5.2, big: 11.5, names: 8.6 } },
};
const goldText =
  "bg-gradient-to-b from-[oklch(0.95_0.07_90)] via-[oklch(0.84_0.12_80)] to-[oklch(0.7_0.12_65)] bg-clip-text text-transparent drop-shadow-[0_0.05em_0.15em_oklch(0.2_0.05_40/0.7)]";

function GateTitles({ layout, first, second }) {
  const t = useT();
  const l = titleLayout[layout];
  const cq = (n) => `${n}cqw`;
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      <div className="absolute inset-x-0 flex flex-col items-center" style={{ top: l.title }}>
        <motion.span
          className={`br-serif leading-none ${goldText}`}
          style={{ fontSize: cq(l.size.small) }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease }}
        >
          {t.gateThe}
        </motion.span>
        <span className={`br-script leading-tight ${goldText}`} style={{ fontSize: cq(l.size.big) }}>
          <Wipe delay={0.8}>{t.gateWedding}</Wipe>
        </span>
        <div className="flex items-center gap-[0.4em]" style={{ fontSize: cq(0.6 * l.size.small) }}>
          <Rule delay={1.6} />
          <HeartAmp delay={1.7} className="text-[0.9em]" />
          <Rule delay={1.6} flip />
        </div>
      </div>
      <div
        className="br-script absolute inset-x-0 flex flex-col items-center leading-[1.05] text-[oklch(0.84_0.07_25)] [text-shadow:0_0_0.35em_oklch(0.75_0.1_20/0.5)]"
        style={{ top: l.names, fontSize: cq(l.size.names) }}
      >
        <Letters text={first} delay={1.4} />
        <HeartAmp delay={2} className="text-[0.42em]" />
        <Letters text={second} delay={2.1} />
        <div className="mt-[0.15em] flex items-center gap-[0.3em] text-[0.3em]">
          <Rule delay={2.6} />
          <Rule delay={2.6} flip />
        </div>
      </div>
    </div>
  );
}

/** Full-screen padlocked palace gate. Tapping drops the lock, swings the doors and pushes through. */
export default function Gate({ first, second, onOpen }) {
  const t = useT();
  const g = useGateLayout();
  const [opening, setOpening] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => {
    if (g) new Image().src = g.reveal.image;
  }, [g]);

  const door = (side) => (
    <motion.img
      src={g[side].image}
      alt=""
      className="absolute max-w-none"
      style={{ ...g[side].box, transformOrigin: `${side} center` }}
      animate={opening ? { rotateY: side === "left" ? 88 : -88, filter: "brightness(0.45)" } : { rotateY: 0, filter: "brightness(1)" }}
      transition={{ duration: T.swing, delay: T.swingAt, ease: [0.5, 0, 0.2, 1] }}
    />
  );
  const [cx, cy] = g ? g.centre.split(" ") : ["50%", "50%"];

  return (
    <motion.div
      className="fixed inset-0 z-50 overflow-hidden bg-br-night [container-type:size]"
      exit={{ opacity: 0, filter: "blur(8px)" }}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      {g && (
        <motion.div
          key={g.image}
          className="absolute left-1/2 top-1/2 [container-type:inline-size]"
          style={{ ...coverBox(g.aspect, "top"), transformOrigin: g.centre, perspective: 1400, perspectiveOrigin: g.centre }}
          initial={{ scale: 1.15, opacity: 0 }}
          animate={loaded ? (opening ? { scale: [null, 1.22, 1.22, 5.5], opacity: 1 } : { scale: [1.15, 1, 1.05, 1], opacity: 1 }) : { scale: 1.15, opacity: 0 }}
          transition={
            opening
              ? {
                  scale: {
                    duration: T.pushAt + T.push,
                    times: [0, 0.6 / (T.pushAt + T.push), T.pushAt / (T.pushAt + T.push), 1],
                    ease: ["easeOut", "linear", [0.7, 0, 0.3, 1]],
                  },
                }
              : {
                  opacity: { duration: 1.8 },
                  scale: { duration: 16, times: [0, 0.2, 0.6, 1], repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
                }
          }
        >
          <img
            src={g.image}
            alt={t.gateAlt}
            className="absolute inset-0 h-full w-full"
            ref={(el) => el?.complete && setLoaded(true)}
            onLoad={() => setLoaded(true)}
          />

          {/* the garden revealed through the archway */}
          <motion.div
            className="absolute"
            style={{
              left: g.left.box.left,
              top: g.left.box.top,
              height: g.left.box.height,
              width: `calc(${g.right.box.left} + ${g.right.box.width} - ${g.left.box.left})`,
              maskImage: `url(${g.opening})`,
              maskSize: "100% 100%",
              WebkitMaskImage: `url(${g.opening})`,
              WebkitMaskSize: "100% 100%",
              background: `linear-gradient(to bottom, oklch(0.78 0.11 70 / 0.8), oklch(0.7 0.1 60 / 0.3) 22%, transparent 40%), url(${g.reveal.image}) 50% 85% / auto 170%`,
            }}
            initial={{ filter: "brightness(0.35)" }}
            animate={{ filter: opening ? "brightness(1.08)" : "brightness(0.35)" }}
            transition={{ duration: T.swing + 0.6, delay: opening ? T.swingAt : 0 }}
          />
          {door("left")}
          {door("right")}

          {/* god rays */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute aspect-square mix-blend-screen"
            style={{
              left: cx,
              top: cy,
              width: "90%",
              x: "-50%",
              y: "-50%",
              background: "repeating-conic-gradient(from 0deg, oklch(0.85 0.13 75 / 0.3) 0deg 4deg, transparent 4deg 13deg)",
              maskImage: "radial-gradient(circle, transparent 12%, black 22%, transparent 62%)",
              WebkitMaskImage: "radial-gradient(circle, transparent 12%, black 22%, transparent 62%)",
            }}
            initial={{ opacity: 0, rotate: 0, scale: 0.5 }}
            animate={opening ? { opacity: [0, 0.35], rotate: 25, scale: 1.1 } : { opacity: 0 }}
            transition={{ duration: 3, delay: opening ? T.swingAt + 0.3 : 0, ease: "easeOut" }}
          />
          {/* warm halo */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute aspect-square rounded-full mix-blend-screen blur-2xl"
            style={{
              left: cx,
              top: cy,
              width: "45%",
              x: "-50%",
              y: "-50%",
              background: "radial-gradient(circle, transparent 20%, oklch(0.8 0.14 70 / 0.45) 45%, transparent 68%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: opening ? 1 : 0 }}
            transition={{ duration: 2, delay: opening ? T.swingAt : 0, ease: "easeIn" }}
          />
          {/* light leaking through the seam */}
          <motion.div
            aria-hidden
            className="absolute w-[0.45%] rounded-full bg-[oklch(0.9_0.12_82)] blur-[2px]"
            style={{ x: "-50%", left: g.right.box.left, top: g.left.box.top, height: g.left.box.height }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={opening ? { opacity: [0, 1, 1, 0], scaleY: [0, 1, 1, 1] } : { opacity: 0, scaleY: 0 }}
            transition={{ duration: T.swingAt + 0.9 - T.unlockAt, delay: opening ? T.unlockAt - 0.1 : 0, times: [0, 0.35, 0.75, 1], ease: "easeOut" }}
          />
          {/* padlock: rattles, hops, falls */}
          <motion.img
            src={g.lock.image}
            alt=""
            className="absolute max-w-none"
            style={{ ...g.lock.box, transformOrigin: "50% 15%" }}
            animate={
              opening
                ? {
                    rotate: [0, -7, 6, -4, 3, 0, 32],
                    y: ["0%", "0%", "0%", "0%", "0%", "-10%", "520%"],
                    opacity: [1, 1, 1, 1, 1, 1, 0],
                    filter: ["brightness(1)", "brightness(1.2)", "brightness(1.4)", "brightness(1.6)", "brightness(1.8)", "brightness(2.2)", "brightness(0.6)"],
                  }
                : { rotate: 0, y: "0%", opacity: 1, filter: "brightness(1)" }
            }
            transition={{ duration: T.unlockAt + 1.1, times: [0, 0.09, 0.18, 0.27, 0.34, 0.42, 1], ease: "easeIn" }}
          />
          {/* unlock flash */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute aspect-square rounded-full mix-blend-screen"
            style={{
              left: cx,
              top: cy,
              width: `calc(${g.lock.box.width} * 2.2)`,
              x: "-50%",
              y: "-50%",
              background: "radial-gradient(circle, oklch(0.93 0.12 88) 0%, oklch(0.82 0.15 78 / 0.8) 30%, transparent 70%)",
            }}
            initial={{ opacity: 0, scale: 0.3 }}
            animate={opening ? { opacity: [0, 0.6, 1, 0], scale: [0.3, 0.8, 1.6, 4] } : { opacity: 0 }}
            transition={{ duration: 1.5, delay: opening ? 0.2 : 0, times: [0, 0.35, 0.5, 1], ease: "easeOut" }}
          />
          {/* pulsing rings over the lock */}
          <AnimatePresence>
            {loaded && !opening && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute flex flex-col items-center"
                style={{ left: cx, top: cy, x: "-50%", y: "-50%" }}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.6, transition: { duration: 0.4 } }}
                transition={{ duration: 0.9, delay: 1.8, ease }}
              >
                <span className="relative block h-20 w-20 md:h-28 md:w-28">
                  {[0, 0.8, 1.6].map((d) => (
                    <motion.span
                      key={d}
                      className="absolute inset-0 rounded-full border-2 border-br-gold shadow-[0_0_18px_var(--br-gold)]"
                      animate={{ scale: [0.7, 1.9], opacity: [0.95, 0] }}
                      transition={{ duration: 2.4, repeat: Infinity, delay: d, ease: "easeOut" }}
                    />
                  ))}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
      {/* titles sit outside the zooming artboard so the zoom never pushes them off-screen */}
      {g && loaded && (
        <motion.div
          className="pointer-events-none absolute left-1/2 top-1/2 [container-type:inline-size]"
          style={coverBox(g.aspect, "top")}
          animate={{ opacity: opening ? 0 : 1 }}
          transition={{ duration: 0.6 }}
        >
          <GateTitles layout={g.layout} first={first} second={second} />
        </motion.div>
      )}

      {/* rising embers */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {Array.from({ length: 18 }).map((_, i) => (
          <motion.span
            key={i}
            className="absolute bottom-0 h-1.5 w-1.5 rounded-full bg-br-gold blur-[1px]"
            style={{ left: `${(53 * i + 7) % 100}%` }}
            initial={{ y: 0, opacity: 0 }}
            animate={{ y: "-95vh", opacity: [0, 0.9, 0], x: [0, 14, -10, 0] }}
            transition={{ duration: 7 + (i % 5) * 1.6, repeat: Infinity, delay: 0.5 * i, ease: "linear" }}
          />
        ))}
      </div>
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse at center, transparent 45%, oklch(0.12 0.04 40 / 0.75))" }}
        animate={{ opacity: opening ? [0.35, 0.6, 0.6, 0] : 0.35 }}
        transition={opening ? { duration: T.done, times: vignetteTimes } : { duration: 0.9 }}
      />
      {g && !opening && (
        <button
          type="button"
          onClick={() => {
            if (opening) return;
            setOpening(true);
            timer.current = setTimeout(onOpen, 1000 * T.done);
          }}
          aria-label={t.gateAria}
          className="absolute inset-0 h-full w-full cursor-pointer"
        />
      )}
      <AnimatePresence>
        {loaded && !opening && (
          <motion.p
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] text-center"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16, transition: { duration: 0.4 } }}
            transition={{ duration: 0.9, delay: 2.2, ease }}
          >
            <span className="br-display inline-flex items-center gap-2 rounded-full border border-br-gold/50 bg-br-night/75 px-4 py-1.5 text-[0.62rem] tracking-[0.32em] text-br-night-fg md:text-xs">
              <Pointer className="h-3.5 w-3.5 text-br-gold" />
              {t.tapToUnlock}
            </span>
          </motion.p>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
