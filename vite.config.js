import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // El sitio vive en https://errordubal23.github.io/data_warehousing/ (project
  // page, no user page), así que todos los assets deben resolverse bajo ese
  // subdirectorio — sin esto el build carga pero JS/CSS dan 404 y la página
  // queda en blanco igual.
  base: "/data_warehousing/",
  plugins: [react(), tailwindcss()],
})
