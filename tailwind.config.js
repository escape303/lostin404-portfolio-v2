/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ground: "#0A0C0E",
        deep: "#050505",
        panel: "#101317",
        elevated: "#18181B",
        ink: "#EDE7DC",
        muted: "#9EA5A8",
        dim: "#6C7378",
        accent: "#3A29FF",
        accent2: "#5227FF",
        accentSoft: "#8B7BFF",
        lime: "#BFFF00",
        bone: "#F2ECE1",
        hair: "rgba(237,231,220,0.13)",
        hairsoft: "rgba(237,231,220,0.07)",
      },
      fontFamily: {
        display: ["Syne", "ui-sans-serif", "system-ui", "sans-serif"],
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      maxWidth: {
        read: "880px",
        wide: "1280px",
      },
      letterSpacing: {
        tightest: "-0.05em",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        "marquee-left": {
          from: { transform: "translate3d(0,0,0)" },
          to: { transform: "translate3d(-50%,0,0)" },
        },
        "marquee-right": {
          from: { transform: "translate3d(-50%,0,0)" },
          to: { transform: "translate3d(0,0,0)" },
        },
        sweep: {
          from: { transform: "translateX(-120%) rotate(12deg)" },
          to: { transform: "translateX(220%) rotate(12deg)" },
        },
      },
      animation: {
        "marquee-left": "marquee-left var(--marquee-duration, 32s) linear infinite",
        "marquee-right": "marquee-right var(--marquee-duration, 32s) linear infinite",
      },
    },
  },
  plugins: [],
};
