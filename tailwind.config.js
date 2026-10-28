/** Blush Romance palette — values read from the reference's computed CSS (.br-root). */
const c = (l, ch, h) => `oklch(${l} ${ch} ${h} / <alpha-value>)`;

export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        br: {
          bg: c(0.25, 0.085, 275),
          fg: c(0.94, 0.025, 55),
          card: c(0.29, 0.085, 275),
          primary: c(0.8, 0.095, 35),
          "primary-fg": c(0.22, 0.08, 275),
          gold: c(0.82, 0.085, 45),
          "gold-deep": c(0.74, 0.11, 22),
          night: c(0.18, 0.07, 275),
          "night-fg": c(0.95, 0.03, 60),
          accent: c(0.78, 0.11, 30),
          muted: c(0.8, 0.04, 40),
          danger: c(0.68, 0.2, 25),
        },
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        playfair: ['"Playfair Display"', "serif"],
        cormorant: ['"Cormorant Garamond"', "serif"],
        "cinzel-decorative": ['"Cinzel Decorative"', "serif"],
      },
    },
  },
  plugins: [],
};
