import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/USMNT_Roster_Site/',
  plugins: [react()],
})
