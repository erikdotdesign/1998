import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/1998/',
  plugins: [react()],
  assetsInclude: ['**/*.glb'],
})
