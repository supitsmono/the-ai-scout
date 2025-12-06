/** @type {import("tailwindcss").Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}"
  ],

  theme: {
    /* ========================================================= */
    /* BRAND COLORS — THE AI SCOUT                              */
    /* ========================================================= */
    colors: {
      transparent: "transparent",
      white: "#ffffff",
      black: "#000000",

      // Neutral palette (Linear/Vercel style)
      slate: {
        50:  "#f8fafc",
        100: "#f1f5f9",
        200: "#e2e8f0",
        300: "#cbd5e1",
        400: "#94a3b8",
        500: "#64748b",
        600: "#475569",
        700: "#334155",
        800: "#1e293b",
        900: "#0f172a",
        950: "#020617"
      },

      // Brand accent colors
      emerald: {
        400: "#34d399",
        500: "#10b981",
        600: "#059669"
      },

      cyan: {
        400: "#22d3ee",
        500: "#06b6d4"
      },

      sky: {
        400: "#38bdf8",
        500: "#0ea5e9"
      }
    },

    /* ========================================================= */
    /* FONTS                                                     */
    /* ========================================================= */
    fontFamily: {
      sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif']
    },

    /* ========================================================= */
    /* LAYOUT + SPACING                                          */
    /* ========================================================= */
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1500px"
      }
    },

    borderRadius: {
      none: "0px",
      sm: "4px",
      DEFAULT: "8px",
      md: "12px",
      lg: "16px",
      xl: "20px",
      "2xl": "28px",
      full: "9999px"
    },

    /* ========================================================= */
    /* SHADOWS — PREMIUM SAAS STYLE                              */
    /* ========================================================= */
    boxShadow: {
      none: "none",
      soft: "0 4px 14px rgba(0,0,0,0.12)",
      card: "0 8px 24px rgba(0,0,0,0.18)",
      strong: "0 0 60px rgba(0,0,0,0.45)",
      glow: "0 0 24px rgba(56,189,248,0.45)", // cyan glow
      brand: "0 0 28px rgba(16,185,129,0.45)" // emerald glow
    },

    /* ========================================================= */
    /* GRADIENTS — BRAND SIGNATURE                               */
    /* ========================================================= */
    extend: {
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(to right, #34d399, #22d3ee, #38bdf8)",
        "brand-soft":
          "linear-gradient(to bottom right, rgba(34,197,94,0.12), rgba(14,165,233,0.10))"
      },

      /* ========================================================= */
      /* MOTION TOKENS                                            */
      /* ========================================================= */
      transitionTimingFunction: {
        "ease-out-smooth": "cubic-bezier(0.16, 1, 0.3, 1)",
        "ease-in-smooth": "cubic-bezier(0.7, 0, 0.84, 0)"
      },

      transitionDuration: {
        fast: "120ms",
        default: "180ms",
        slow: "250ms"
      },

      /* ========================================================= */
      /* BLUR / BACKDROP                                           */
      /* ========================================================= */
      backdropBlur: {
        xs: "2px",
        sm: "4px",
        md: "8px",
        lg: "14px",
        xl: "20px"
      }
    }
  },

  plugins: []
};
