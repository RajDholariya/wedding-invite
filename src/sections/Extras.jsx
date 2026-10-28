import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useT } from "../i18n.jsx";

/** Plain fade-up used by the shared (non-themed) widgets. */
function Reveal({ children, delay = 0, className }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

const confettiColors = ["#F4A300", "#D4AF37", "#C1272D"];
const storageKey = "scratch-revealed-preview";

function paintCover(ctx, w, h, colors) {
  const grad = ctx.createLinearGradient(0, 0, w, h);
  colors.forEach((c, i) => grad.addColorStop(i / (colors.length - 1), c));
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
  for (let y = 7; y < h; y += 14)
    for (let x = 7; x < w; x += 14) {
      ctx.beginPath();
      ctx.arc(x, y, 1.4, 0, 2 * Math.PI);
      ctx.fill();
    }
}

function ScratchCard({ date, time, colors, revealText, subText }) {
  const t = useT();
  const boxRef = useRef(null);
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const last = useRef(null);
  const lastCheck = useRef(0);
  const scratching = useRef(false);
  const done = useRef(false);
  const [revealed, setRevealed] = useState(false);
  const [fading, setFading] = useState(false);
  const [hint, setHint] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(storageKey) === "true") {
        setRevealed(true);
        done.current = true;
      }
    } catch {}
  }, []);

  const paint = useCallback(() => {
    const canvas = canvasRef.current;
    const box = boxRef.current;
    if (!canvas || !box || done.current) return;
    const r = box.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = r.width * dpr;
    canvas.height = r.height * dpr;
    canvas.style.width = `${r.width}px`;
    canvas.style.height = `${r.height}px`;
    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr);
    ctxRef.current = ctx;
    paintCover(ctx, r.width, r.height, colors);
    setReady(true);
  }, [colors]);

  useEffect(() => {
    paint();
    const box = boxRef.current;
    if (!box || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => {
      if (!done.current) paint();
    });
    ro.observe(box);
    return () => ro.disconnect();
  }, [paint]);

  const reveal = useCallback(() => {
    if (done.current) return;
    done.current = true;
    setFading(true);
    try {
      sessionStorage.setItem(storageKey, "true");
    } catch {}
    import("canvas-confetti")
      .then(({ default: confetti }) => confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 }, colors: confettiColors }))
      .catch(() => {});
    setTimeout(() => setRevealed(true), 600);
  }, []);

  // Sample every 4th pixel's alpha; reveal once 55% is cleared.
  const check = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = ctxRef.current;
    if (!canvas || !ctx || !canvas.width || !canvas.height) return;
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 16) {
      total++;
      if (data[i] === 0) clear++;
    }
    if (total && (clear / total) * 100 >= 55) reveal();
  }, [reveal]);

  const dab = useCallback((x, y) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    ctx.save();
    ctx.globalCompositeOperation = "destination-out";
    const g = ctx.createRadialGradient(x, y, 0, x, y, 28);
    g.addColorStop(0, "rgba(0,0,0,1)");
    g.addColorStop(0.7, "rgba(0,0,0,1)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, 2 * Math.PI);
    ctx.fill();
    ctx.restore();
  }, []);

  const stroke = useCallback(
    (x, y) => {
      const p = last.current;
      if (p) {
        const dx = x - p.x;
        const dy = y - p.y;
        const steps = Math.max(1, Math.floor(Math.sqrt(dx * dx + dy * dy) / 6));
        for (let i = 0; i <= steps; i++) dab(p.x + (dx * i) / steps, p.y + (dy * i) / steps);
      } else dab(x, y);
      last.current = { x, y };
      const now = Date.now();
      if (now - lastCheck.current > 120) {
        lastCheck.current = now;
        check();
      }
    },
    [dab, check],
  );

  const local = (cx, cy) => {
    const r = canvasRef.current.getBoundingClientRect();
    return { x: cx - r.left, y: cy - r.top };
  };
  const start = (cx, cy) => {
    if (done.current) return;
    scratching.current = true;
    setHint(false);
    last.current = null;
    const { x, y } = local(cx, cy);
    stroke(x, y);
  };
  const move = (cx, cy) => {
    if (!scratching.current || done.current) return;
    const { x, y } = local(cx, cy);
    stroke(x, y);
  };
  const end = () => {
    scratching.current = false;
    last.current = null;
  };

  return (
    <div ref={boxRef} className="relative mx-auto aspect-[4/3] w-full max-w-sm">
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-white/20 bg-white/90 px-6 text-center shadow-lg"
        initial={{ opacity: 0, scale: 0.85 }}
        animate={revealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.85 }}
        transition={{ type: "spring", stiffness: 220, damping: 20 }}
      >
        <p className="font-playfair text-2xl font-semibold text-stone-800">{revealText}</p>
        {date && <p className="mt-2 font-cormorant text-3xl text-stone-900">{date}</p>}
        {time && <p className="mt-1 font-inter text-sm text-stone-600">{time}</p>}
        {subText && <p className="mt-3 font-inter text-xs text-stone-500">{subText}</p>}
      </motion.div>
      {!revealed && (
        <motion.canvas
          ref={canvasRef}
          role="img"
          aria-label={t.scratchAria}
          className="absolute inset-0 h-full w-full rounded-2xl"
          style={{ touchAction: "none", cursor: ready ? "pointer" : "default" }}
          animate={{ opacity: fading ? 0 : 1 }}
          transition={{ duration: 0.6 }}
          onMouseDown={(e) => start(e.clientX, e.clientY)}
          onMouseMove={(e) => move(e.clientX, e.clientY)}
          onMouseUp={end}
          onMouseLeave={end}
          onTouchStart={(e) => start(e.touches[0].clientX, e.touches[0].clientY)}
          onTouchMove={(e) => {
            if (!scratching.current || done.current) return;
            e.preventDefault();
            move(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchEnd={end}
        />
      )}
      {!revealed && hint && (
        <motion.div
          className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.6, repeat: Infinity }}
        >
          <span className="rounded-full bg-black/40 px-3 py-1 font-inter text-xs text-white">👆 {t.scratchHint}</span>
        </motion.div>
      )}
      {!revealed && (
        <button type="button" onClick={reveal} className="absolute bottom-1 right-1 rounded bg-white/70 px-2 py-1 font-inter text-[10px] text-stone-700 underline">
          {t.reveal}
        </button>
      )}
    </div>
  );
}

export function SaveTheDate({ date, time, theme, subText }) {
  const t = useT();
  return (
    <div className="px-4 pb-10">
      <div className="br-shadow-royal mx-auto max-w-2xl rounded-3xl border-2 border-br-gold bg-[#fdf6ef] py-6">
        <section className="px-6 text-center">
          <Reveal>
            <h2 className="font-cinzel-decorative text-2xl text-stone-800 sm:text-3xl">{t.saveTheDate}</h2>
            <p className="mt-2 font-inter text-sm text-stone-500">{t.scratchBelow}</p>
          </Reveal>
          <Reveal delay={0.15} className="mt-8">
            <ScratchCard date={date} time={time} subText={subText} revealText={t.gettingMarried} colors={[theme.primaryColor, theme.secondaryColor]} />
          </Reveal>
        </section>
      </div>
    </div>
  );
}

/** Guest wishes plus a "leave a wish" form (local thank-you state, as in the reference preview). */
export function WishesWall({ wishes, theme }) {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const input = "w-full rounded-lg border border-stone-300 px-4 py-2 font-inter text-sm text-stone-800";
  return (
    <div className="px-4 py-10">
      <div className="br-shadow-royal mx-auto max-w-3xl overflow-hidden rounded-3xl border-2 border-br-gold bg-[#fdf6ef]">
        <section className="px-6 py-16">
          <Reveal>
            <h2 className="font-cinzel-decorative text-center text-2xl text-stone-800 sm:text-3xl">Wishes Wall</h2>
          </Reveal>
          {wishes.length > 0 && (
            <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
              {wishes.map((w, i) => (
                <Reveal key={`${w.name}-${i}`} delay={0.05 * i}>
                  <div className="rounded-xl bg-white p-4 shadow-sm">
                    <p className="font-inter text-sm text-stone-700">“{w.message}”</p>
                    <p className="mt-2 font-inter text-xs font-medium text-stone-500">
                      — {w.name}
                      {w.relation ? `, ${w.relation}` : ""}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
          <Reveal delay={0.15} className="mx-auto mt-8 max-w-md">
            {sent ? (
              <p className="text-center font-inter text-stone-700">Thank you for your wish! It will appear here once approved. 💐</p>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="space-y-3"
              >
                <input type="text" required placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} className={input} />
                <textarea required placeholder="Leave a wish for the couple" value={message} onChange={(e) => setMessage(e.target.value)} className={input} rows={3} />
                <button
                  type="submit"
                  className="w-full rounded-full py-2 font-inter text-sm font-medium text-white"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  Leave a Wish
                </button>
              </form>
            )}
          </Reveal>
        </section>
      </div>
    </div>
  );
}
