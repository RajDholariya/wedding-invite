import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, HeartCrack, Minus, Plus, Send, User, Users } from "lucide-react";
import { Rise, SectionTitle, Shine, ease, fadeUp, twinkle } from "../motion.jsx";

const choices = [
  { value: true, Icon: Heart, title: "Joyfully accept", note: "We will be there" },
  { value: false, Icon: HeartCrack, title: "Regretfully decline", note: "With you in spirit" },
];

const label = "br-display mb-2 block text-[0.65rem] uppercase tracking-[0.25em] text-br-gold-deep";
const field =
  "br-serif w-full rounded-xl border border-br-gold/60 bg-white/5 px-4 py-3 text-lg text-br-fg outline-none transition placeholder:text-br-muted/70 focus:border-br-primary focus:ring-2 focus:ring-br-primary/40";
const stepper = "flex h-10 w-10 items-center justify-center rounded-full border border-br-gold bg-br-primary text-br-primary-fg disabled:opacity-40";

/**
 * RSVP card. Like the reference's preview mode, submitting shows the thank-you state locally;
 * pass `onSubmit` (async, receives the response) to send it somewhere real.
 */
export default function Rsvp({ coupleLine, dateLabel, onSubmit }) {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState(true);
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || status === "sending") return;
    setError("");
    if (!onSubmit) {
      setStatus("done");
      return;
    }
    setStatus("sending");
    try {
      await onSubmit({
        guestName: name.trim().slice(0, 120),
        attending: attending ? "yes" : "no",
        guestCount: attending ? Math.min(12, Math.max(1, guests)) : undefined,
        message: message.trim().slice(0, 500),
      });
      setStatus("done");
    } catch (err) {
      setError(err?.message || "Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  return (
    <section className="px-4 py-16 md:px-6 md:py-28">
      <SectionTitle kicker="Kindly respond">RSVP</SectionTitle>
      <Rise className="mx-auto max-w-xl lg:max-w-2xl">
        <div className="br-shadow-royal rounded-3xl border-2 border-br-gold bg-white/[0.04] p-2.5 md:p-4">
          <div className="relative rounded-2xl border border-br-gold/60 px-5 py-8 md:px-10 md:py-10">
            {["left-2 top-2", "right-2 top-2", "bottom-2 left-2", "bottom-2 right-2"].map((pos) => (
              <motion.span key={pos} aria-hidden {...twinkle} className={`absolute text-sm leading-none text-br-gold ${pos}`}>
                ❖
              </motion.span>
            ))}
            {status === "done" ? (
              <motion.div
                className="py-6 text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 160, damping: 14 }}
              >
                <motion.div
                  className="br-bg-gold-grad br-shadow-royal mx-auto flex h-20 w-20 items-center justify-center rounded-full text-br-primary-fg"
                  animate={{ scale: [1, 1.12, 1] }}
                  transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden
                >
                  <Heart className="h-9 w-9" fill="currentColor" />
                </motion.div>
                <p className="br-script mt-6 text-5xl text-br-gold-deep">Dhanyavaad!</p>
                <p className="mt-3 text-xl text-br-primary">Your response has been received with joy.</p>
                <p className="mt-1 italic text-br-muted">
                  {attending
                    ? dateLabel
                      ? `We look forward to celebrating with you on ${dateLabel}.`
                      : "We look forward to celebrating with you."
                    : "You will be missed, and remembered in our prayers."}
                </p>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={submit}
                className="space-y-6"
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                transition={{ staggerChildren: 0.12, delayChildren: 0.3 }}
              >
                <motion.div variants={fadeUp} className="text-center">
                  <p className="br-script text-4xl text-br-gold-deep">Will you join us?</p>
                  <p className="br-display mt-1 break-words text-xs tracking-[0.2em] text-br-primary">{coupleLine}</p>
                </motion.div>
                <motion.div variants={fadeUp}>
                  <label htmlFor="br-rsvp-name" className={label}>
                    Your name
                  </label>
                  <div className="relative flex items-center">
                    <User className="pointer-events-none absolute left-4 h-5 w-5 text-br-gold-deep" aria-hidden />
                    <input
                      id="br-rsvp-name"
                      className={`${field} pl-12`}
                      placeholder="Full name"
                      value={name}
                      maxLength={120}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </motion.div>
                <motion.fieldset variants={fadeUp}>
                  <legend className={label}>Will you attend?</legend>
                  <div className="grid grid-cols-2 gap-3">
                    {choices.map(({ value, Icon, title, note }) => {
                      const on = attending === value;
                      return (
                        <motion.button
                          key={title}
                          type="button"
                          aria-pressed={on}
                          onClick={() => setAttending(value)}
                          whileTap={{ scale: 0.96 }}
                          className={`flex flex-col items-center gap-1 rounded-b-xl rounded-t-[3rem] border px-2 pb-4 pt-6 text-center transition-colors duration-300 ${
                            on ? "br-shadow-royal border-br-gold bg-br-primary text-br-primary-fg" : "border-br-gold/60 bg-white/5 text-br-primary"
                          }`}
                        >
                          <motion.span
                            className="inline-flex"
                            animate={on ? { scale: [1, 1.25, 1] } : { scale: 1 }}
                            transition={{ duration: 1.1, repeat: on ? Infinity : 0, ease: "easeInOut" }}
                          >
                            <Icon className={`h-7 w-7 ${on ? "text-br-primary-fg" : "text-br-gold-deep"}`} fill={on ? "currentColor" : "none"} aria-hidden />
                          </motion.span>
                          <span className="br-display mt-1 text-xs leading-tight tracking-wide sm:text-sm">{title}</span>
                          <span className={`text-sm italic ${on ? "text-br-primary-fg/80" : "text-br-muted"}`}>{note}</span>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.fieldset>
                <AnimatePresence initial={false}>
                  {attending && (
                    <motion.div
                      key="guests"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.5, ease }}
                      className="overflow-hidden"
                    >
                      <span id="br-rsvp-guests" className={label}>
                        Number of guests
                      </span>
                      <div
                        role="group"
                        aria-labelledby="br-rsvp-guests"
                        className="flex items-center justify-between rounded-xl border border-br-gold/60 bg-white/5 px-4 py-2.5"
                      >
                        <span className="flex items-center gap-3 whitespace-nowrap text-lg text-br-muted">
                          <Users className="h-5 w-5 text-br-gold-deep" aria-hidden />
                          Including you
                        </span>
                        <span className="flex items-center gap-3">
                          <motion.button
                            type="button"
                            aria-label="Fewer guests"
                            className={stepper}
                            whileTap={{ scale: 0.85 }}
                            disabled={guests <= 1}
                            onClick={() => setGuests((g) => Math.max(1, g - 1))}
                          >
                            <Minus className="h-4 w-4" />
                          </motion.button>
                          <span aria-live="polite" className="br-display w-8 text-center text-2xl text-br-primary">
                            {guests}
                          </span>
                          <motion.button
                            type="button"
                            aria-label="More guests"
                            className={stepper}
                            whileTap={{ scale: 0.85 }}
                            disabled={guests >= 12}
                            onClick={() => setGuests((g) => Math.min(12, g + 1))}
                          >
                            <Plus className="h-4 w-4" />
                          </motion.button>
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                <motion.div variants={fadeUp}>
                  <label htmlFor="br-rsvp-message" className={label}>
                    Blessings for the couple
                  </label>
                  <textarea
                    id="br-rsvp-message"
                    className={field}
                    rows={3}
                    maxLength={500}
                    placeholder="Write your wishes…"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </motion.div>
                <motion.button
                  type="submit"
                  variants={fadeUp}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  disabled={status === "sending"}
                  className="br-display br-bg-gold-grad br-shadow-royal relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full py-3.5 tracking-widest text-br-primary-fg disabled:opacity-60"
                >
                  <Shine />
                  <Send className="h-4 w-4" aria-hidden />
                  {status === "sending" ? "Sending…" : "Send RSVP"}
                </motion.button>
                {status === "error" && (
                  <p role="alert" className="text-center text-br-danger">
                    {error || "Something went wrong. Please try again."}
                  </p>
                )}
              </motion.form>
            )}
          </div>
        </div>
      </Rise>
    </section>
  );
}
