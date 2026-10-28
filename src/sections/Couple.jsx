import { useId } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Heart } from "lucide-react";
import { Rise, SectionTitle, Shine, ease } from "../motion.jsx";
import { useT } from "../i18n.jsx";

// Notched-corner mask for the name plaque.
const notched = (r) => {
  const m = ["top left", "top right", "bottom left", "bottom right"]
    .map((c) => `radial-gradient(circle at ${c}, transparent ${r}px, #000 ${r + 0.5}px) ${c} / 51% 51% no-repeat`)
    .join(", ");
  return { mask: m, WebkitMask: m };
};

function PlaqueDivider() {
  return (
    <div aria-hidden className="relative mx-auto my-2 flex items-center justify-center gap-1.5 md:my-2.5">
      <motion.span
        className="h-px w-10 origin-right bg-gradient-to-r from-transparent to-[var(--br-gold-deep)] md:w-20"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 1, ease }}
      />
      <span className="h-1 w-1 rounded-full bg-[var(--br-gold-deep)]" />
      <span className="h-2 w-2 rotate-45 border border-[var(--br-gold-deep)]" />
      <span className="h-1 w-1 rounded-full bg-[var(--br-gold-deep)]" />
      <motion.span
        className="h-px w-10 origin-left bg-gradient-to-l from-transparent to-[var(--br-gold-deep)] md:w-20"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 1, ease }}
      />
    </div>
  );
}

const GoldStops = ({ id, mid = "oklch(0.88 0.11 85)" }) => (
  <defs>
    <linearGradient id={id} x1="0" x2="1">
      <stop offset="0" stopColor="oklch(0.62 0.12 65)" />
      <stop offset="0.5" stopColor={mid} />
      <stop offset="1" stopColor="oklch(0.6 0.12 60)" />
    </linearGradient>
  </defs>
);

/** Swinging temple bell (ghungroo) hanging off the arch. */
function Bell({ side, delay, id }) {
  const gid = `${id}-bell-${side}`;
  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute top-[17%] w-[9%] ${side === "left" ? "-left-[6.5%]" : "-right-[6.5%]"}`}
      style={{ transformOrigin: "50% 0%" }}
      animate={{ rotate: [-7, 7, -7] }}
      transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <svg viewBox="0 0 20 80" className="w-full overflow-visible">
        <GoldStops id={gid} />
        {Array.from({ length: 7 }).map((_, i) => (
          <circle key={i} cx="10" cy={2 + 5 * i} r="1.6" fill={`url(#${gid})`} />
        ))}
        <path d="M10 36c-5 0-7 6-7.5 13L1 58h18l-1.5-9C17 42 15 36 10 36Z" fill={`url(#${gid})`} />
        <rect x="0" y="57" width="20" height="2.6" rx="1.3" fill="oklch(0.7 0.12 70)" />
        <circle cx="10" cy="62.5" r="2.4" fill={`url(#${gid})`} />
        <path d="M10 65c-2.2 3-2.2 6 0 8 2.2-2 2.2-5 0-8Z" fill="oklch(0.97 0.01 90)" stroke="oklch(0.75 0.08 70)" strokeWidth="0.5" />
      </svg>
    </motion.div>
  );
}

function Blossom({ x, y, r, fill, edge }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <ellipse key={a} cy={-(0.55 * r)} rx={0.55 * r} ry={0.6 * r} transform={`rotate(${a})`} fill={fill} stroke={edge} strokeWidth="0.6" />
      ))}
      <circle r={0.55 * r} fill={fill} stroke={edge} strokeWidth="0.6" />
      <path
        d={`M0 ${-(0.3 * r)}C${0.35 * r} ${-(0.3 * r)} ${0.35 * r} ${0.25 * r} 0 ${0.25 * r}C${-(0.2 * r)} ${0.25 * r} ${-(0.2 * r)} 0 0 0`}
        fill="none"
        stroke={edge}
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <circle r={0.12 * r} fill="oklch(0.8 0.12 80)" />
    </g>
  );
}

/** Blue-and-ivory rose cluster tucked onto the frame corners. */
function Bouquet({ className, flip = false, delay = 0 }) {
  const blue = "oklch(0.62 0.13 258)";
  const blueEdge = "oklch(0.42 0.13 262)";
  const ivory = "oklch(0.97 0.02 85)";
  const ivoryEdge = "oklch(0.75 0.06 75)";
  return (
    <motion.div
      aria-hidden
      className={`pointer-events-none absolute ${className}`}
      initial={{ scale: 0, opacity: 0, rotate: flip ? 30 : -30 }}
      whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, delay: 0.5 + delay, ease }}
    >
      <motion.svg
        viewBox="-50 -50 100 100"
        className="h-full w-full overflow-visible drop-shadow-[0_6px_8px_rgba(0,0,0,0.45)]"
        style={{ scaleX: flip ? -1 : 1 }}
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay }}
      >
        {[-160, -120, -60, -15, 35, 95, 140].map((a, i) => (
          <path
            key={a}
            d="M0 0C9-8 24-8 34 0C24 8 9 8 0 0Z"
            transform={`rotate(${a}) translate(8 0)`}
            fill={i % 2 ? "oklch(0.78 0.11 80)" : "oklch(0.66 0.11 70)"}
            stroke="oklch(0.55 0.1 65)"
            strokeWidth="0.5"
          />
        ))}
        <Blossom x={-10} y={4} r={15} fill={blue} edge={blueEdge} />
        <Blossom x={13} y={-9} r={11} fill={ivory} edge={ivoryEdge} />
        <Blossom x={12} y={15} r={8} fill={blue} edge={blueEdge} />
        <Blossom x={-24} y={-16} r={6} fill={ivory} edge={ivoryEdge} />
        {[
          [26, -24],
          [-30, 14],
          [2, -26],
          [28, 4],
        ].map(([cx, cy]) => (
          <circle key={`${cx}${cy}`} cx={cx} cy={cy} r="1.8" fill="oklch(0.97 0.01 90)" stroke="oklch(0.75 0.08 70)" strokeWidth="0.4" />
        ))}
      </motion.svg>
    </motion.div>
  );
}

/** Jharokha (Mughal arch) portrait frame. */
function ArchPortrait({ src, alt, focus, delay }) {
  const id = `br-arch-${useId().replace(/:/g, "")}`;
  const clip = { clipPath: `url(#${id})`, WebkitClipPath: `url(#${id})` };
  const layer = (inset) => ({ ...clip, position: "absolute", inset });
  return (
    <div className="relative mx-[7%] aspect-[4/5]">
      <svg aria-hidden className="absolute h-0 w-0">
        <clipPath id={id} clipPathUnits="objectBoundingBox">
          <path d="M0,1 L0,.3 C0,.22 .06,.18 .14,.17 C.2,.09 .32,.06 .41,.055 C.45,.03 .48,.012 .5,0 C.52,.012 .55,.03 .59,.055 C.68,.06 .8,.09 .86,.17 C.94,.18 1,.22 1,.3 L1,1 Z" />
        </clipPath>
      </svg>
      <div className="br-bg-gold-grad br-shadow-royal" style={layer("0")} />
      <div
        style={{
          ...layer("1.8% 2.2% 1.8% 2.2%"),
          background: "radial-gradient(circle at 50% 40%, oklch(0.98 0.015 85), oklch(0.92 0.035 78)), oklch(0.95 0.03 80)",
        }}
      >
        <div
          className="absolute inset-0 opacity-40"
          style={{ backgroundImage: "radial-gradient(circle, oklch(0.75 0.07 70 / 0.6) 1px, transparent 1.5px)", backgroundSize: "12px 12px" }}
        />
      </div>
      <div className="br-bg-gold-grad" style={layer("5.5% 6.5% 4% 6.5%")} />
      <div className="overflow-hidden bg-[oklch(0.95_0.03_80)]" style={layer("6.3% 7.3% 4.8% 7.3%")}>
        <motion.img
          src={src}
          alt={alt}
          loading="lazy"
          className="h-full w-full object-cover"
          style={{ objectPosition: focus, transformOrigin: focus }}
          animate={{ scale: [1, 1.07, 1] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay }}
        />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-t from-[oklch(0.3_0.08_275/0.45)] to-transparent" />
        <Shine delay={delay} />
      </div>
      <motion.svg
        aria-hidden
        viewBox="0 0 40 40"
        className="absolute -top-[9%] left-1/2 w-[15%] drop-shadow-md"
        style={{ x: "-50%" }}
        initial={{ y: -12, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, delay: 0.4 + delay, ease }}
      >
        <GoldStops id={`${id}-gold`} mid="oklch(0.9 0.1 85)" />
        <path d="M20 2c2 4 5 6 5 10a5 5 0 0 1-10 0c0-4 3-6 5-10Z" fill={`url(#${id}-gold)`} />
        <path d="M8 22c4-5 20-5 24 0-2 8-6 12-12 13-6-1-10-5-12-13Z" fill={`url(#${id}-gold)`} />
        <circle cx="20" cy="26" r="3" fill="oklch(0.55 0.2 25)" stroke="oklch(0.9 0.1 85)" strokeWidth="0.8" />
        <rect x="14" y="35" width="12" height="3" rx="1.5" fill={`url(#${id}-gold)`} />
      </motion.svg>
      <Bell side="left" delay={delay} id={id} />
      <Bell side="right" delay={delay + 0.8} id={id} />
      <Bouquet className="-left-[12%] top-[4%] w-[38%]" delay={delay} />
      <Bouquet className="-right-[12%] bottom-[-6%] w-[42%]" flip delay={delay + 0.3} />
    </div>
  );
}

function PartnerCard({ role, name, parents, portrait, x }) {
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 120, damping: 14 };
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-12, 12]), spring);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [10, -10]), spring);
  const z = (n) => ({ transform: `translateZ(${n}px)` });
  const delay = x > 0 ? 1.5 : 0;

  return (
    <Rise x={x} className="min-w-0 text-center">
      <div
        className="mx-auto w-full max-w-[19rem] [perspective:1000px] sm:max-w-[21rem] md:max-w-[22rem] lg:max-w-[24rem]"
        onPointerMove={(e) => {
          if (e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width - 0.5);
          py.set((e.clientY - r.top) / r.height - 0.5);
        }}
        onPointerLeave={() => {
          px.set(0);
          py.set(0);
        }}
      >
        <motion.div
          className="relative [transform-style:preserve-3d]"
          style={{ rotateX, rotateY }}
          animate={{ y: [0, -8, 0] }}
          transition={{ y: { duration: 6, repeat: Infinity, ease: "easeInOut", delay } }}
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[40%] h-[80%] w-[95%] rounded-full blur-3xl"
            style={{
              transform: "translate(-50%, -50%) translateZ(-70px)",
              background: "radial-gradient(circle, oklch(0.82 0.14 70 / 0.4) 0%, oklch(0.6 0.15 20 / 0.18) 50%, transparent 75%)",
            }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative [transform-style:preserve-3d]" style={z(30)}>
            <ArchPortrait src={portrait.src} alt={name} focus={portrait.focus} delay={delay} />
            <div aria-hidden className="pointer-events-none absolute inset-0" style={z(40)}>
              {Array.from({ length: 7 }).map((_, i) => (
                <motion.span
                  key={i}
                  className="absolute bottom-[15%] h-1 w-1 rounded-full bg-br-gold md:h-1.5 md:w-1.5"
                  style={{ left: `${12 + ((31 * i) % 76)}%`, boxShadow: "0 0 8px var(--br-gold)" }}
                  animate={{ y: [0, -220], opacity: [0, 1, 0], scale: [0.5, 1.2, 0.4] }}
                  transition={{ duration: 4 + (i % 3), repeat: Infinity, delay: 0.7 * i, ease: "easeOut" }}
                />
              ))}
            </div>
          </div>
          <motion.div
            className="relative -mx-[3%] -mt-1"
            style={{ z: 50 }}
            initial={{ opacity: 0, y: 30, rotateX: -40 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 1.1, delay: 0.6, ease }}
          >
            <div className="br-bg-gold-grad br-shadow-royal p-[2px]" style={notched(18)}>
              <div
                className="relative overflow-hidden px-3 pb-5 pt-4 md:px-6 md:pb-7 md:pt-5"
                style={{
                  ...notched(17),
                  background: "linear-gradient(180deg, oklch(0.98 0.015 85), oklch(0.94 0.03 80) 70%, oklch(0.91 0.04 75))",
                }}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-[5px] border border-[color-mix(in_oklch,var(--br-gold-deep)_45%,transparent)]"
                  style={notched(13)}
                />
                <Shine delay={x > 0 ? 2.5 : 1} />
                <p className="br-script relative text-2xl leading-none text-[var(--br-gold-deep)] md:text-4xl">{role}</p>
                {name && (
                  <>
                    <PlaqueDivider />
                    <h3 className="br-name relative break-words text-lg font-semibold uppercase leading-tight tracking-[0.12em] text-[oklch(0.3_0.1_270)] md:text-3xl lg:text-[2.1rem]">
                      {name}
                    </h3>
                  </>
                )}
                {parents && (
                  <>
                    <PlaqueDivider />
                    <p className="relative text-xs italic leading-snug text-[oklch(0.32_0.08_270)] md:text-sm lg:text-base">{parents}</p>
                  </>
                )}
              </div>
            </div>
            <motion.span
              aria-hidden
              className="absolute -bottom-3 left-1/2 block h-5 w-5 border-2 border-[var(--br-gold-deep)] bg-[oklch(0.94_0.03_80)] md:-bottom-3.5 md:h-6 md:w-6"
              style={{ x: "-50%", rotate: 45 }}
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      </div>
    </Rise>
  );
}

function Joiner() {
  return (
    <div aria-hidden className="flex items-center justify-center md:h-full md:flex-col">
      <span className="h-px w-10 bg-gradient-to-r from-transparent to-br-gold md:h-28 md:w-px md:bg-gradient-to-b" />
      <motion.span
        className="relative mx-2 flex h-14 w-14 items-center justify-center md:mx-0 md:my-3 md:h-20 md:w-20"
        animate={{ scale: [1, 1.12, 1, 1.08, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, repeatDelay: 1 }}
      >
        <Heart className="absolute h-full w-full text-br-primary" fill="currentColor" strokeWidth={0} />
        <span className="br-script br-amp relative -mt-1 text-2xl text-br-primary-fg md:text-3xl">&amp;</span>
      </motion.span>
      <span className="h-px w-10 bg-gradient-to-l from-transparent to-br-gold md:h-28 md:w-px md:bg-gradient-to-t" />
    </div>
  );
}

export default function Couple({ couple }) {
  const t = useT();
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-28">
      <SectionTitle kicker={t.coupleKicker}>{t.coupleTitle}</SectionTitle>
      <div className="grid grid-cols-2 items-start gap-x-4 gap-y-8 md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-10">
        <PartnerCard role={t.groom} name={couple.groom.full} parents={couple.groom.parents} portrait={couple.groom.portrait} x={-80} />
        <div className="order-last col-span-2 md:order-none md:col-span-1">
          <Joiner />
        </div>
        <PartnerCard role={t.bride} name={couple.bride.full} parents={couple.bride.parents} portrait={couple.bride.portrait} x={80} />
      </div>
    </section>
  );
}
