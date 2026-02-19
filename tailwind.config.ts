import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Outfit", "system-ui", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "#10b981",
          50: "#ecfdf5",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
        },
        warning: {
          DEFAULT: "#f59e0b",
          50: "#fffbeb",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
        },
        error: {
          DEFAULT: "#ef4444",
          50: "#fef2f2",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
        },
        eld: {
          "space-indigo": "#22223b",
          "dusty-grape": "#4a4e69",
          "lilac-ash": "#9a8c98",
          "almond-silk": "#c9ada7",
          seashell: "#f2e9e4",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        "theme-xs": "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
        "theme-sm":
          "0px 1px 2px 0px rgba(16, 24, 40, 0.06), 0px 1px 3px 0px rgba(16, 24, 40, 0.10)",
        "theme-md":
          "0px 2px 4px -2px rgba(16, 24, 40, 0.06), 0px 4px 8px -2px rgba(16, 24, 40, 0.10)",
        "theme-lg":
          "0px 4px 6px -2px rgba(16, 24, 40, 0.03), 0px 12px 16px -4px rgba(16, 24, 40, 0.08)",
        "theme-xl":
          "0px 8px 8px -4px rgba(16, 24, 40, 0.03), 0px 20px 24px -4px rgba(16, 24, 40, 0.08)",
        "theme-2xl": "0px 24px 48px -12px rgba(16, 24, 40, 0.18)",
      },
      fontSize: {
        "theme-xs": ["0.75rem", { lineHeight: "1.125rem" }],
        "theme-sm": ["0.875rem", { lineHeight: "1.25rem" }],
        "theme-base": ["1rem", { lineHeight: "1.5rem" }],
        "theme-lg": ["1.125rem", { lineHeight: "1.75rem" }],
        "theme-xl": ["1.25rem", { lineHeight: "1.875rem" }],
        "theme-2xl": ["1.5rem", { lineHeight: "2rem" }],
        "theme-3xl": ["1.875rem", { lineHeight: "2.375rem" }],
        "title-sm": ["1.5rem", { lineHeight: "2rem" }],
        "title-md": ["1.875rem", { lineHeight: "2.375rem" }],
        "title-lg": ["2.25rem", { lineHeight: "2.75rem" }],
      },
      screens: {
        "2xsm": "375px",
        xsm: "425px",
        "3xl": "2000px",
      },
      spacing: {
        "sidebar-collapsed": "90px",
        "sidebar-expanded": "290px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
