import tailwindCssAnimate from 'tailwindcss-animate'
import { fontFamily } from 'tailwindcss/defaultTheme'
import { fonts } from './src/config/fonts'

/** @type {import('tailwindcss').Config} */
export default {
	darkMode: ['class'],
	content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
	safelist: fonts.map((font) => `font-${font}`),
	theme: {
		container: {
			center: 'true',
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			animation: {
				"spin-slow": "spin 4s linear infinite",
				"spin-medium": "spin 2s linear infinite",
				"spin-fast": "spin 1s linear infinite",
			},
			keyframes: {
				spin: {
					"0%": { transform: "rotate(0deg)" },
					"100%": { transform: "rotate(360deg)" },
				},
			},


			fontFamily: {
				sans: [
					'Inter',
					'sans-serif'
				],
				serif: [
					'Merriweather',
					'serif'
				],
				inter: [
					'Inter',
					...fontFamily.sans
				],
				manrope: [
					'Manrope',
					...fontFamily.sans
				]
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			colors: {
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
					50: 'var(--color-primary-50)',
					100: 'var(--color-primary-100)',
					200: 'var(--color-primary-200)',
					300: 'var(--color-primary-300)',
					400: 'var(--color-primary-400)',
					500: 'var(--color-primary-500)',
					600: 'var(--color-primary-600)',
					700: 'var(--color-primary-700)',
					800: 'var(--color-primary-800)',
					900: 'var(--color-primary-900)',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
					50: 'var(--color-secondary-50)',
					100: 'var(--color-secondary-100)',
					200: 'var(--color-secondary-200)',
					300: 'var(--color-secondary-300)',
					400: 'var(--color-secondary-400)',
					500: 'var(--color-secondary-500)',
					600: 'var(--color-secondary-600)',
					700: 'var(--color-secondary-700)',
					800: 'var(--color-secondary-800)',
					900: 'var(--color-secondary-900)',
				},
				logo: {
					50: 'var(--color-logo-50)'
				},

				// Neutral Colors
				neutral: {
					50: 'var(--color-neutral-50)',
					100: 'var(--color-neutral-100)',
					200: 'var(--color-neutral-200)',
					300: 'var(--color-neutral-300)',
					400: 'var(--color-neutral-400)',
					500: 'var(--color-neutral-500)',
					600: 'var(--color-neutral-600)',
					700: 'var(--color-neutral-700)',
					800: 'var(--color-neutral-800)',
					900: 'var(--color-neutral-900)',
				},
				card: {
					50: 'var(--color-card-50)',
					100: 'var(--color-card-100)',
					200: 'var(--color-card-200)',
					300: 'var(--color-card-300)',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},

			},
			keyframes: {
				'spinSlow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' },
				},
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'spin-slow': 'spinSlow 2s linear infinite',
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			}
		}
	},
	plugins: [tailwindCssAnimate],
}
