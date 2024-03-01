import { withTV } from 'tailwind-variants/dist/transformer.js'
import type { Config } from 'tailwindcss'

const config = {
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {},
  plugins: [],
} as const satisfies Config

export default withTV(config)
