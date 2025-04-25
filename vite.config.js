import react from '@vitejs/plugin-react'
import vike from 'vike/plugin'

export default {
  plugins: [
    react(),
    vike()
  ],
  base: '/',
  build: { outDir: 'build' },
  server: { port: 3000 }
}