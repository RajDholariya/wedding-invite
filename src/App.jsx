import { useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useScroll,
  useSpring,
} from "framer-motion";
import { LangProvider } from "./i18n.jsx";
import { ScrollScene } from "./motion.jsx";
import Gate from "./sections/Gate.jsx";
import Hero from "./sections/Hero.jsx";
import Countdown from "./sections/Countdown.jsx";
import Couple from "./sections/Couple.jsx";
import Ceremonies from "./sections/Ceremonies.jsx";
import Gallery from "./sections/Gallery.jsx";
import Venue from "./sections/Venue.jsx";
import { SaveTheDate } from "./sections/Extras.jsx";
import { BenchFooter, FallingBlossoms, Farewell } from "./sections/Closing.jsx";

export default function App({ d, t }) {
  const [open, setOpen] = useState(false);
  // The gate stays on top until the hero image has painted, so the hand-off never flashes the bare background.
  const [heroReady, setHeroReady] = useState(false);
  // The sections below the hero mount a moment later, so their work doesn't stutter the hand-off.
  const [rest, setRest] = useState(false);
  useEffect(() => {
    if (!heroReady) return;
    const id = setTimeout(() => setRest(true), 900);
    return () => clearTimeout(id);
  }, [heroReady]);
  const heroRef = useRef(null);
  // Background music: must start inside the door-click gesture (browsers block autoplay), then fades in.
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(false);
  const startMusic = () => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = 0;
    a.play().then(() => {
      const t0 = performance.now();
      const step = (now) => {
        const k = Math.min((now - t0) / 4000, 1);
        a.volume = 0.6 * k;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }).catch(() => {});
  };
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 24,
    restDelta: 0.001,
  });
  const { groom, bride } = d.couple;

  // Smooth mouse-wheel scrolling on desktop once the gate is open; touch scrolling stays native.
  useEffect(() => {
    if (!open || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, syncTouch: false });
    let raf = requestAnimationFrame(function loop(time) {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    });
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [open]);

  return (
    <LangProvider value={t}>
      <MotionConfig reducedMotion="user">
        <main className="br-root relative isolate min-h-screen overflow-x-clip">
          <audio ref={audioRef} src={`${import.meta.env.BASE_URL}music/wedding.mp3`} loop preload="auto" />
          <AnimatePresence>
            {!heroReady && (
              <Gate
                first={groom.first}
                second={bride.first}
                onOpen={() => setOpen(true)}
                onStart={startMusic}
              />
            )}
          </AnimatePresence>
          {open && (
            <>
              <FallingBlossoms progress={scrollYProgress} />
              <motion.div
                style={{ scaleX: progress }}
                className="br-bg-gold-grad fixed inset-x-0 top-0 z-50 h-1 origin-left"
              />
              <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                aria-label={muted ? "Play music" : "Mute music"}
                className="br-card-font fixed left-3 top-3 z-50 rounded-full border border-br-gold/60 bg-br-night/80 px-3 py-1.5 text-sm text-br-gold shadow-lg backdrop-blur hover:bg-br-night"
              >
                {muted ? "♪ Off" : "♪ On"}
              </button>
              <motion.a
                href={t.switchHref}
                lang={t.lang === "gu" ? "en" : "gu"}
                className="br-card-font fixed right-3 top-3 z-50 rounded-full border border-br-gold/60 bg-br-night/80 px-4 py-1.5 text-sm text-br-gold shadow-lg backdrop-blur hover:bg-br-night"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5, duration: 0.6 }}
              >
                {t.switchLabel}
              </motion.a>
              <Hero
                sectionRef={heroRef}
                first={groom.first}
                second={bride.first}
                shortDate={d.shortDate}
                dateLabel={d.dateLabel}
                placeLabel={d.placeLabel}
                revealAlt={d.revealAlt}
                onReady={() => requestAnimationFrame(() => requestAnimationFrame(() => setHeroReady(true)))}
              />
              {rest && (
              <>
              <ScrollScene>
                <Countdown countdownTo={d.countdownTo} />
              </ScrollScene>
              <SaveTheDate
                date={d.shortDate}
                time={t.onwards(d.weddingTime)}
                subText={t.saveSub}
                theme={d.theme}
              />
              <ScrollScene>
                <Couple couple={d.couple} />
              </ScrollScene>
              <ScrollScene>
                <Ceremonies events={d.events} />
              </ScrollScene>
              <ScrollScene>
                <Gallery photos={d.gallery} />
              </ScrollScene>
              <ScrollScene>
                <Venue venue={d.venue} />
              </ScrollScene>
              <ScrollScene>
                <Farewell
                  coupleLine={d.coupleLine}
                  dateLabel={d.dateLabel}
                  hashtag={d.hashtag}
                />
              </ScrollScene>
              <BenchFooter />
              </>
              )}
            </>
          )}
        </main>
      </MotionConfig>
    </LangProvider>
  );
}
