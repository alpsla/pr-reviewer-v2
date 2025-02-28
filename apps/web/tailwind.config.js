/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
    },
    extend: {
      colors: {
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--primary)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        error: {
          DEFAULT: "var(--error)",
          foreground: "var(--error-foreground)",
        },
        success: {
          DEFAULT: "var(--success)",
          foreground: "var(--success-foreground)",
        },
        warning: {
          DEFAULT: "var(--warning)",
          foreground: "var(--warning-foreground)",
        },
        // Diff colors
        diff: {
          added: {
            bg: '#dcfce7', // Success light bg
            text: '#166534', // Success dark text
          },
          removed: {
            bg: '#fee2e2', // Error light bg
            text: '#991b1b', // Error dark text
          },
          changed: {
            bg: '#fef3c7', // Warning light bg
            text: '#92400e', // Warning dark text
          },
        },
        // Background colors
        background: {
          DEFAULT: '#f8fafc', // Slate 50
          dark: '#1e293b', // Slate 800
          card: '#ffffff',
          cardDark: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        // Consistent typographic scale
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      spacing: {
        // Based on 4px scale as specified
        px: '1px',
        0: '0',
        0.5: '2px', // 2px
        1: '4px',   // 4px
        1.5: '6px', // 6px
        2: '8px',   // 8px
        2.5: '10px', // 10px
        3: '12px',  // 12px
        3.5: '14px', // 14px
        4: '16px',  // 16px
        5: '20px',  // 20px
        6: '24px',  // 24px
        7: '28px',  // 28px
        8: '32px',  // 32px
        9: '36px',  // 36px
        10: '40px', // 40px
        11: '44px', // 44px
        12: '48px', // 48px
        14: '56px', // 56px
        16: '64px', // 64px
        20: '80px', // 80px
        24: '96px', // 96px
      },
      borderRadius: {
        // Border radius system
        sm: '4px',   // Small
        DEFAULT: '6px', // Medium (default)
        md: '6px',   // Medium (alias)
        lg: '8px',   // Large
        xl: '12px',  // Extra large
        '2xl': '16px', // 2XL
        '3xl': '24px', // 3XL
        full: '9999px', // Round (pills, avatars)
      },
      boxShadow: {
        // Shadow system
        sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
        DEFAULT: '0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },
      animation: {
        // Animation presets
        'spin-slow': 'spin 3s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-in-out',
        'slide-down': 'slideDown 0.3s ease-in-out',
        'slide-left': 'slideLeft 0.3s ease-in-out',
        'slide-right': 'slideRight 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
      transitionTimingFunction: {
        // Easing curves
        'in-out-standard': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'in-standard': 'cubic-bezier(0.4, 0, 1, 1)',
        'out-standard': 'cubic-bezier(0, 0, 0.2, 1)',
      },
      transitionDuration: {
        // Transition durations
        'fast': '150ms',
        'medium': '300ms',
        'slow': '500ms',
      },
    },
  },
  plugins: [],
}