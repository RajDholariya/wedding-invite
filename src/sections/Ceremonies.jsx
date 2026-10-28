import { useId, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { CalendarDays, Clock } from "lucide-react";
import { SectionTitle, ease } from "../motion.jsx";
import { useT } from "../i18n.jsx";

function KurtaIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 2c-.6 0-1 .4-1.2.9L9.5 6H8c-.6 0-1 .4-1 1v1c0 .3.1.6.4.8L8.6 10l-2.4 10.2c-.1.5.2 1 .8 1.1.1 0 .2 0 .3 0h9.4c.5 0 1-.4 1-1 0-.1 0-.2 0-.3L15.4 10l1.2-1.2c.3-.2.4-.5.4-.8V7c0-.6-.4-1-1-1h-1.5l-1.3-3.1c-.2-.5-.6-.9-1.2-.9zM10.8 7h2.4l1 2.5-1.7 1.7-.5-1.2h0l-.5 1.2-1.7-1.7 1-2.5z" />
    </svg>
  );
}

function SprigIcon({ className }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M8 32C14 26 22 20 34 10" />
      <path d="M18 24C17 21 19 18 22 18C23 20 22 23 18 24Z" fill="currentColor" fillOpacity="0.25" />
      <path d="M25 18C25 15 28 13 31 14C31 17 29 19 25 18Z" fill="currentColor" fillOpacity="0.25" />
      <path d="M13 28C10 27 9 24 11 22C13 23 14 26 13 28Z" fill="currentColor" fillOpacity="0.25" />
      <path d="M22 26C24 28 26 31 25 33C23 33 21 30 22 26Z" fill="currentColor" fillOpacity="0.25" />
      <circle cx="34" cy="10" r="1.5" fill="currentColor" />
    </svg>
  );
}

function PinIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        fillRule="evenodd"
        fill="currentColor"
        d="M12 2a7 7 0 0 0-7 7c0 5.2 6.1 12.2 6.4 12.5a.8.8 0 0 0 1.2 0C12.9 21.2 19 14.2 19 9a7 7 0 0 0-7-7Zm0 4.2a2.8 2.8 0 1 1 0 5.6 2.8 2.8 0 0 1 0-5.6Z"
      />
    </svg>
  );
}

function Sparks() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute bottom-[12%] h-1 w-1 rounded-full bg-br-gold md:h-1.5 md:w-1.5"
          style={{ left: `${8 + ((37 * i) % 84)}%`, boxShadow: "0 0 8px var(--br-gold)" }}
          animate={{ y: [0, -260], x: [0, i % 2 ? 14 : -14], opacity: [0, 1, 0], scale: [0.5, 1.2, 0.4] }}
          transition={{ duration: 4 + (i % 4), repeat: Infinity, delay: 0.55 * i, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

/** Illustrated couple on a glowing stage; tilts with scroll and the mouse. */
function EventArt({ e, side }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const p = useSpring(scrollYProgress, { stiffness: 70, damping: 20, restDelta: 0.001 });
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { stiffness: 120, damping: 16 };
  const sx = useSpring(mx, spring);
  const sy = useSpring(my, spring);
  const scrollY = useTransform(p, [0, 0.45, 1], [40 * side, 0, -(18 * side)]);
  const scrollX = useTransform(p, [0, 0.45, 1], [14, 0, -8]);
  const rotateY = useTransform(() => scrollY.get() + 22 * sx.get());
  const rotateX = useTransform(() => scrollX.get() - 16 * sy.get());
  const scale = useTransform(p, [0, 0.45, 1], [0.82, 1, 0.94]);
  const z = (n) => ({ transform: `translateZ(${n}px)` });

  return (
    <div
      ref={ref}
      className="mx-auto w-[92%] max-w-md [perspective:1200px] md:w-full md:max-w-lg"
      onPointerMove={(ev) => {
        if (ev.pointerType !== "mouse") return;
        const r = ev.currentTarget.getBoundingClientRect();
        mx.set((ev.clientX - r.left) / r.width - 0.5);
        my.set((ev.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <motion.div className="relative aspect-square [transform-style:preserve-3d]" style={{ rotateY, rotateX, scale }}>
        <motion.div
          aria-hidden
          className="absolute inset-[6%] rounded-full blur-3xl"
          style={{ z: -90, background: `radial-gradient(circle, ${e.color}, transparent 68%)` }}
          animate={{ opacity: [0.45, 0.75, 0.45], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        />
        <div aria-hidden className="absolute inset-x-[8%] bottom-[2%] h-[26%]" style={{ transform: "translateZ(0px) rotateX(78deg)", transformOrigin: "50% 100%" }}>
          <motion.div
            className="h-full w-full rounded-[50%]"
            style={{ background: `radial-gradient(ellipse, color-mix(in oklch, ${e.color}, white 30%), transparent 70%)` }}
            animate={{ opacity: [0.5, 0.85, 0.5] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
        <div
          aria-hidden
          className="absolute bottom-[3%] left-1/2 h-[7%] w-[70%] rounded-[50%] bg-black/50 blur-xl"
          style={{ transform: "translateX(-50%) translateZ(10px)" }}
        />
        <div className="absolute inset-x-[2%] bottom-[5%] top-[4%] flex items-end justify-center" style={z(60)}>
          <motion.div
            className="flex h-full w-full items-end justify-center"
            initial={{ opacity: 0, y: 60, scale: 0.85 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 1.3, ease }}
          >
            <motion.img
              src={e.art}
              alt={e.name}
              loading="lazy"
              className="max-h-full max-w-full object-contain drop-shadow-[0_24px_30px_rgba(0,0,0,0.6)]"
              style={{ transformOrigin: "50% 100%" }}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
        <div className="absolute inset-0" style={z(110)}>
          <Sparks />
        </div>
      </motion.div>
    </div>
  );
}

function EventCard({ e, side }) {
  const t = useT();
  const slide = (i) => ({
    initial: { opacity: 0, x: 20 * side },
    whileInView: { opacity: 1, x: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, delay: 0.5 + 0.12 * i, ease },
  });
  const pop = (i) => ({
    initial: { scale: 0, rotate: -60 },
    whileInView: { scale: 1, rotate: 0 },
    viewport: { once: true },
    transition: { type: "spring", stiffness: 260, damping: 14, delay: 0.6 + 0.12 * i },
  });
  const rows = [
    e.dateLong && { key: "date", Icon: CalendarDays, body: <span className="font-bold">{e.dateLong}</span> },
    e.time && { key: "time", Icon: Clock, body: <span>{e.time}</span> },
    (e.venueName || e.address) && {
      key: "place",
      Icon: PinIcon,
      start: true,
      body: (
        <span className="min-w-0">
          {e.venueName && <span className="block font-bold">{e.venueName}</span>}
          {e.address && (
            <span className="block break-words" style={{ color: `color-mix(in oklch, var(--br-event), ${e.cardText} 35%)` }}>
              {e.address}
            </span>
          )}
          {e.mapUrl && (
            <a
              href={e.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm font-semibold underline underline-offset-4"
              style={{ color: "color-mix(in oklch, var(--br-event), black 15%)" }}
            >
              {t.getDirections}
            </a>
          )}
        </span>
      ),
    },
    e.dressCode && {
      key: "dress",
      Icon: KurtaIcon,
      start: true,
      body: (
        <span className="flex flex-wrap gap-x-2">
          <span className="shrink-0 font-bold">{t.dressCode}</span>
          <span>{e.dressCode}</span>
        </span>
      ),
    },
  ].filter(Boolean);

  return (
    <motion.div
      className="br-card-font br-shadow-royal relative rounded-[1.75rem] p-4 text-left md:p-6"
      style={{
        background: `linear-gradient(160deg, color-mix(in oklch, ${e.cardBg}, white 35%), color-mix(in oklch, ${e.cardBg}, var(--br-event) 10%))`,
        transformOrigin: side === 1 ? "left center" : "right center",
      }}
      initial={{ opacity: 0, rotateY: -35 * side, rotateX: 10, z: -80 }}
      whileInView={{ opacity: 1, rotateY: 0, rotateX: 0, z: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 1.1, delay: 0.1, ease }}
      whileHover={{ scale: 1.015 }}
    >
      <div className="mb-2 flex items-end gap-2 px-1 md:mb-3">
        <motion.h3
          className="br-event min-w-0 break-words pb-1 pr-2 pt-1 text-5xl font-bold leading-tight md:text-6xl lg:text-7xl"
          style={{
            color: "color-mix(in oklch, var(--br-event), black 18%)",
            textShadow: "0 1px 0 color-mix(in oklch, var(--br-event), white 55%), 0 3px 10px color-mix(in oklch, var(--br-event) 35%, transparent)",
          }}
          initial={{ y: 14, scale: 0.94 }}
          whileInView={{ y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, delay: 0.2, ease }}
        >
          {e.name}
        </motion.h3>
        <motion.span
          className="mb-1 inline-block w-9 shrink-0 md:w-11"
          style={{ color: "color-mix(in oklch, var(--br-event), black 10%)" }}
          initial={{ scale: 0, rotate: -30 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1, ease }}
        >
          <motion.span className="block" animate={{ rotate: [-4, 4, -4] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
            <SprigIcon className="h-full w-full" />
          </motion.span>
        </motion.span>
      </div>
      {e.line && (
        <p className="-mt-1 mb-3 px-1 text-sm font-semibold md:text-base" style={{ color: "color-mix(in oklch, var(--br-event), black 30%)" }}>
          {e.line}
        </p>
      )}
      {(rows.length > 0 || e.note) && (
        <div className="rounded-2xl border-[1.5px] px-4 py-4 md:px-6 md:py-5" style={{ background: e.cardBg, borderColor: e.cardBorder }}>
          {rows.length > 0 && (
            <ul className="space-y-3 text-[15px] leading-snug md:space-y-4 md:text-lg" style={{ color: e.cardText }}>
              {rows.map(({ key, Icon, body, start }, i) => (
                <motion.li key={key} className={`flex gap-3 md:gap-4 ${start ? "items-start" : "items-center"}`} {...slide(i)}>
                  <motion.span className="flex h-7 w-7 shrink-0 items-center justify-center md:h-8 md:w-8" style={{ color: "var(--br-event)" }} {...pop(i)}>
                    <Icon className="h-6 w-6 md:h-7 md:w-7" strokeWidth={2.2} aria-hidden />
                  </motion.span>
                  {body}
                </motion.li>
              ))}
            </ul>
          )}
          {e.note && (
            <p
              className={`text-[15px] italic leading-snug md:text-base ${rows.length ? "mt-4 border-t pt-3" : ""}`}
              style={{ color: e.cardText, borderColor: e.cardBorder }}
            >
              {e.note}
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}

const trail = "M40 2C40 60 160 25 160 74";

/** Dashed S-curve that draws itself between ceremonies, with a spark travelling along it. */
function Trail({ flip }) {
  const reduce = useReducedMotion();
  const id = `br-dash-${useId().replace(/:/g, "")}`;
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 85"
      className="mx-auto -my-1 block w-44 overflow-visible text-br-gold/80 md:w-80"
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <mask id={id}>
        <path d={trail} fill="none" stroke="white" strokeWidth="3.2" strokeDasharray="6 6" strokeLinecap="round" />
      </mask>
      <motion.path
        d={trail}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        mask={`url(#${id})`}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1.4, ease: "easeInOut" }}
      />
      <motion.path
        d="M152 64L160 76L168 64"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ opacity: 0, y: -6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.5, delay: 1.3 }}
      />
      {!reduce && (
        <circle r="2.8" fill="var(--br-gold)" style={{ filter: "drop-shadow(0 0 5px var(--br-gold))" }}>
          <animateMotion dur="3.2s" repeatCount="indefinite" path={trail} />
        </circle>
      )}
    </svg>
  );
}

export default function Ceremonies({ events }) {
  const t = useT();
  return (
    <section className="overflow-hidden px-4 py-16 md:px-6 md:py-28">
      <SectionTitle kicker={t.ceremoniesKicker}>{t.ceremoniesTitle}</SectionTitle>
      <ol className="mx-auto max-w-6xl space-y-10 md:space-y-16">
        {events.map((e, i) => {
          const side = i % 2 === 0 ? 1 : -1;
          return (
            <li key={e.id} style={{ "--br-event": e.color }}>
              <div className="grid items-center gap-8 md:grid-cols-2 md:gap-14">
                <div className={side === 1 ? "" : "md:order-2"}>
                  <EventArt e={e} side={side} />
                </div>
                <div className="min-w-0 text-center md:text-left">
                  <EventCard e={e} side={side} />
                </div>
              </div>
              {i < events.length - 1 && <Trail flip={side === -1} />}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
