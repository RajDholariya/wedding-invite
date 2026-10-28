import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Heart, X } from "lucide-react";
import { Rise, SectionTitle, ease } from "../motion.jsx";
import { useT } from "../i18n.jsx";

const sway = [-5, 4, -3, 6, -6, 3, -4];

function FloatingHearts() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute bottom-0 text-br-primary"
          style={{ left: `${(37 * i + 6) % 96}%` }}
          initial={{ y: "10%", opacity: 0 }}
          animate={{ y: "-110vh", opacity: [0, 0.5, 0.5, 0], x: [0, 18, -14, 8], rotate: [-12, 12, -8] }}
          transition={{ duration: 14 + (i % 5) * 3, repeat: Infinity, delay: 1.3 * i, ease: "linear" }}
        >
          <Heart className={i % 3 === 0 ? "h-6 w-6" : "h-3.5 w-3.5"} fill="currentColor" strokeWidth={0} />
        </motion.span>
      ))}
    </div>
  );
}

/** Sagging string of fairy lights each polaroid hangs from. */
function FairyLights({ i }) {
  const sag = (x) => 4 + 10 * (1 - ((x - 50) / 50) ** 2);
  return (
    <svg aria-hidden viewBox="0 0 100 24" preserveAspectRatio="none" className="h-8 w-full overflow-visible">
      <path d="M0 4Q50 24 100 4" fill="none" stroke="var(--br-gold)" strokeWidth="0.5" vectorEffect="non-scaling-stroke" />
      {[12, 30, 50, 70, 88].map((x, j) => (
        <motion.ellipse
          key={x}
          cx={x}
          cy={sag(x) + 1.6}
          rx="1.1"
          ry="2.2"
          fill="oklch(0.93 0.1 80)"
          style={{ filter: "drop-shadow(0 0 3px oklch(0.88 0.14 75))" }}
          animate={{ opacity: [0.35, 1, 0.35] }}
          transition={{ duration: 2.2, repeat: Infinity, delay: ((5 * i + j) % 7) * 0.35 }}
        />
      ))}
    </svg>
  );
}

function Lightbox({ photos, index, onClose, onStep }) {
  const photo = photos[index];
  const closeRef = useRef(null);
  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onStep(1);
      if (e.key === "ArrowLeft") onStep(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onStep]);
  if (!photo) return null;
  const nav = "absolute top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-br-gold/60 bg-br-night/70 text-br-gold";
  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={photo.caption}
      className="br-vars fixed inset-0 z-[80] flex items-center justify-center bg-br-night/90 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <AnimatePresence mode="wait">
        <motion.figure
          key={index}
          className="br-shadow-royal m-0 max-w-[min(92vw,34rem)] rounded-sm bg-[oklch(0.97_0.015_70)] p-3 pb-4 [perspective:1000px] md:p-4"
          style={{ rotate: 1 }}
          initial={{ opacity: 0, scale: 0.85, rotateY: -25 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          exit={{ opacity: 0, scale: 0.9, rotateY: 25 }}
          transition={{ duration: 0.5, ease }}
          onClick={(e) => e.stopPropagation()}
        >
          <img src={photo.src} alt={photo.caption} className="max-h-[70vh] w-full object-cover" />
          <figcaption className="br-script mt-3 text-center text-3xl text-br-primary-fg md:text-4xl">{photo.caption}</figcaption>
        </motion.figure>
      </AnimatePresence>
      {photos.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous photo"
            className={`${nav} left-3 md:left-8`}
            onClick={(e) => {
              e.stopPropagation();
              onStep(-1);
            }}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            type="button"
            aria-label="Next photo"
            className={`${nav} right-3 md:right-8`}
            onClick={(e) => {
              e.stopPropagation();
              onStep(1);
            }}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}
      <button
        ref={closeRef}
        type="button"
        aria-label="Close"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full border border-br-gold/60 bg-br-night/70 text-br-gold"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </button>
    </motion.div>
  );
}

const slideWidth = "w-[78%] sm:w-[44%] lg:w-[30%]";
const fadeBeyond = (n) => (n >= 6 ? 3 : n >= 5 ? 2 : Infinity);

function Polaroid({ g, i, d, onPick }) {
  const active = d === 0;
  const tilt = sway[i % sway.length] ?? 0;
  return (
    <>
      <FairyLights i={i} />
      <div className="-mt-3 px-5 [perspective:1000px] md:px-7">
        <motion.div
          className="origin-top"
          animate={{ rotate: active ? [-1.2, 1.2, -1.2] : [tilt - 1, tilt + 1, tilt - 1] }}
          transition={{ duration: 5 + (i % 3), repeat: Infinity, ease: "easeInOut" }}
        >
          <span aria-hidden className="br-bg-gold-grad relative z-10 mx-auto block h-5 w-2.5 rounded-sm shadow-md" />
          <motion.figure
            className="br-shadow-royal m-0 -mt-2 rounded-sm bg-[oklch(0.97_0.015_70)] p-2.5 pb-3 md:p-3"
            initial={false}
            animate={{ scale: active ? 1.04 : 0.86, rotateY: active ? 0 : d < 0 ? 18 : -18, opacity: active ? 1 : 0.7 }}
            transition={{ duration: 0.8, ease }}
            whileHover={{ scale: active ? 1.07 : 0.9 }}
          >
            <button
              type="button"
              tabIndex={Math.abs(d) > 1 ? -1 : 0}
              className="relative block w-full overflow-hidden"
              aria-label={active ? `Open photo: ${g.caption}` : `Show photo: ${g.caption}`}
              onClick={onPick}
            >
              <img src={g.src} alt={g.caption} loading="lazy" draggable={false} className="aspect-[4/5] w-full object-cover" />
              <AnimatePresence>
                {active && (
                  <motion.span
                    aria-hidden
                    className="absolute right-2 top-2 flex h-9 w-9 items-center justify-center rounded-full bg-white/85 text-[oklch(0.62_0.16_15)] shadow-md"
                    initial={{ scale: 0, rotate: -40 }}
                    animate={{ scale: [0, 1.25, 1], rotate: 0 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <Heart className="h-[18px] w-[18px]" fill="currentColor" strokeWidth={0} />
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <figcaption className="br-script mt-2 truncate text-center text-2xl leading-tight text-br-primary-fg md:text-3xl">{g.caption}</figcaption>
          </motion.figure>
        </motion.div>
      </div>
    </>
  );
}

export default function Gallery({ photos }) {
  const t = useT();
  const n = photos.length;
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [open, setOpen] = useState(null);
  const [mounted, setMounted] = useState(false);
  const dragging = useRef(false);
  const reduce = useReducedMotion();

  useEffect(() => setMounted(true), []);
  const go = useCallback((i) => setCurrent(((i % n) + n) % n), [n]);

  // Auto-advance every 3.8s unless hovered, focused, lightboxed or reduced-motion.
  useEffect(() => {
    if (paused || reduce || open !== null || n < 2) return;
    const t = setTimeout(() => go(current + 1), 3800);
    return () => clearTimeout(t);
  }, [paused, reduce, open, n, current, go]);

  const step = useCallback((s) => setOpen((o) => (o === null ? o : (o + s + n) % n)), [n]);
  const close = useCallback(() => setOpen(null), []);
  const ctrl = "flex h-12 w-12 items-center justify-center rounded-full border border-br-gold/60 bg-white/5 text-br-gold";

  return (
    <section className="relative overflow-hidden py-16 md:py-28">
      <FloatingHearts />
      <SectionTitle kicker={t.galleryKicker}>{t.galleryTitle}</SectionTitle>
      <Rise>
        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Wedding gallery"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <motion.div
            className="relative cursor-grab pb-10 active:cursor-grabbing"
            drag={n > 1 && "x"}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.18}
            dragSnapToOrigin
            onDragStart={() => {
              dragging.current = true;
            }}
            onDragEnd={(_, info) => {
              const swipe = info.offset.x + 0.2 * info.velocity.x;
              if (swipe < -50) go(current + 1);
              else if (swipe > 50) go(current - 1);
              setTimeout(() => {
                dragging.current = false;
              }, 0);
            }}
          >
            {/* invisible sizer so the absolutely-positioned slides get a height */}
            <div aria-hidden className={`invisible mx-auto ${slideWidth}`}>
              <Polaroid g={photos[0]} i={0} d={0} onPick={() => {}} />
            </div>
            {photos.map((g, i) => {
              let d = (((i - current) % n) + n) % n;
              if (d > n / 2) d -= n;
              return (
                <motion.div
                  key={`${g.src}-${i}`}
                  className={`absolute left-1/2 top-0 ${slideWidth}`}
                  style={{ zIndex: 10 - Math.min(Math.abs(d), 5) }}
                  initial={false}
                  animate={{ x: `${100 * d - 50}%`, opacity: Math.abs(d) >= fadeBeyond(n) ? 0 : 1 }}
                  transition={{ duration: 0.8, ease }}
                  aria-hidden={Math.abs(d) > 1}
                >
                  <Polaroid
                    g={g}
                    i={i}
                    d={d}
                    onPick={() => {
                      if (dragging.current) return;
                      if (d === 0) setOpen(i);
                      else go(i);
                    }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
          {n > 1 && (
            <div className="flex items-center justify-center gap-5 px-4">
              <motion.button type="button" aria-label="Previous photo" className={ctrl} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => go(current - 1)}>
                <ChevronLeft className="h-6 w-6" />
              </motion.button>
              <div className="flex min-w-0 flex-wrap items-center justify-center gap-2">
                {photos.map((g, i) => (
                  <button
                    key={`${g.src}-${i}`}
                    type="button"
                    aria-label={`Show photo ${i + 1}: ${g.caption}`}
                    aria-current={i === current}
                    onClick={() => go(i)}
                    className="flex h-4 w-4 items-center justify-center"
                  >
                    <Heart
                      className={`transition-all duration-500 ${i === current ? "h-4 w-4 text-br-primary" : "h-2.5 w-2.5 text-br-gold/50"}`}
                      fill="currentColor"
                      strokeWidth={0}
                    />
                  </button>
                ))}
              </div>
              <motion.button type="button" aria-label="Next photo" className={ctrl} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => go(current + 1)}>
                <ChevronRight className="h-6 w-6" />
              </motion.button>
            </div>
          )}
        </div>
      </Rise>
      {mounted &&
        createPortal(
          <AnimatePresence>{open !== null && <Lightbox photos={photos} index={open} onClose={close} onStep={step} />}</AnimatePresence>,
          document.body,
        )}
    </section>
  );
}
