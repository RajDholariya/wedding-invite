import { motion } from "framer-motion";
import { Heart } from "lucide-react";
import { asset } from "../data.js";
import { Rise, SectionTitle } from "../motion.jsx";

const maskUrl = asset("family/frame-mask.png");
const frameMask = {
  maskImage: `url(${maskUrl})`,
  maskSize: "100% 100%",
  maskRepeat: "no-repeat",
  WebkitMaskImage: `url(${maskUrl})`,
  WebkitMaskSize: "100% 100%",
  WebkitMaskRepeat: "no-repeat",
};

/** Blue-rose oval frame artwork with the photo masked into its window. */
export function RoseFrame({ children, delay = 0 }) {
  return (
    <div className="relative aspect-[1080/1407]">
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-[6%] rounded-[30%] blur-2xl"
        style={{ background: "radial-gradient(circle, oklch(0.72 0.1 250 / 0.45), transparent 70%)" }}
      />
      <div className="absolute inset-0" style={frameMask}>
        <div
          className="absolute overflow-hidden"
          style={{
            left: "22.6%",
            right: "22.5%",
            top: "15.8%",
            bottom: "17.1%",
            background: "radial-gradient(ellipse at 50% 35%, oklch(0.97 0.02 85), oklch(0.86 0.05 250))",
          }}
        >
          {children}
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent"
            style={{ skewX: -12 }}
            animate={{ x: ["-150%", "300%"] }}
            transition={{ duration: 2.4, repeat: Infinity, repeatDelay: 5, delay, ease: "easeInOut" }}
          />
        </div>
      </div>
      <img
        src={asset("family/frame.webp")}
        alt=""
        aria-hidden
        loading="lazy"
        className="pointer-events-none absolute inset-0 h-full w-full drop-shadow-[0_16px_24px_rgba(0,0,0,0.55)]"
      />
    </div>
  );
}

function Member({ m, i }) {
  return (
    <Rise delay={0.15 * i} className="w-[calc(50%-0.75rem)] text-center sm:w-44 lg:w-60">
      <motion.div
        className="mx-auto w-full"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 * i }}
        whileHover={{ scale: 1.05 }}
      >
        <RoseFrame delay={0.8 * i}>
          <img src={asset(`family/${m.art}.webp`)} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
        </RoseFrame>
      </motion.div>
      <p className="br-display mt-5 text-[0.65rem] uppercase tracking-[0.15em] text-br-gold-deep lg:text-xs lg:tracking-[0.2em]">{m.relation}</p>
      <h4 className="br-display mt-1 break-words text-base leading-snug text-br-primary md:text-lg lg:text-2xl">{m.name}</h4>
    </Rise>
  );
}

export default function Family({ family }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 md:px-6 md:py-28">
      <SectionTitle kicker="With love and blessings">Our Family</SectionTitle>
      <div className="grid gap-14 md:gap-20">
        {family.map((side) => (
          <div key={side.side}>
            <Rise className="mb-8 text-center md:mb-10">
              <h3 className="br-script text-4xl text-br-gold-deep lg:text-5xl">{side.title}</h3>
            </Rise>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-10 lg:gap-x-12">
              {side.members.map((m, i) => (
                <Member key={`${m.name}-${i}`} m={m} i={i} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Story({ story }) {
  return (
    <section className="relative mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-28">
      <SectionTitle kicker="Once upon a time">Our Love Story</SectionTitle>
      <ol className="relative grid gap-16 md:gap-24">
        <span
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-br-gold/60 to-transparent md:block"
        />
        {story.map((s, i) => {
          const odd = i % 2 === 1;
          return (
            <li key={`${s.title}-${i}`} className="relative grid items-center gap-6 md:grid-cols-2 md:gap-20">
              <span
                aria-hidden
                className="absolute left-1/2 top-1/2 hidden h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-br-gold/70 bg-br-bg md:grid"
              >
                <Heart className="h-4 w-4 fill-br-primary text-br-primary" />
              </span>
              <Rise x={odd ? 60 : -60} className={`mx-auto w-48 sm:w-56 ${odd ? "md:order-2 md:ml-0 md:mr-auto" : "md:ml-auto md:mr-0"}`}>
                <RoseFrame delay={0.8 * i}>
                  <div aria-hidden className="flex h-full w-full flex-col items-center justify-center gap-1">
                    <Heart className="h-5 w-5 text-br-primary-fg/70" strokeWidth={1.5} />
                    <span className="br-script text-5xl leading-none text-br-primary-fg">{s.year}</span>
                  </div>
                </RoseFrame>
              </Rise>
              <Rise delay={0.15} className={`text-center ${odd ? "md:text-right" : "md:text-left"}`}>
                <p className="br-script text-3xl text-br-gold-deep md:text-4xl">{s.when}</p>
                <h3 className="br-display mt-2 break-words text-2xl text-br-primary md:text-3xl">{s.title}</h3>
                <p
                  className={`br-serif mt-3 max-w-md whitespace-pre-line break-words text-base leading-relaxed text-br-fg/85 md:text-lg ${odd ? "mx-auto md:ml-auto md:mr-0" : "mx-auto md:mx-0"}`}
                >
                  {s.description}
                </p>
              </Rise>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
