import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // Lắng nghe trên tất cả interface (cần cho Docker)
    port: 5173,      // Thay đổi port mặc định từ 5173 sang 3003 (hoặc port bạn muốn)
    strictPort: true, // Nếu port đã được sử dụng, Vite sẽ báo lỗi thay vì tự chọn port khác
  },
  plugins: [react({}), TanStackRouterVite()],
  worker: {
    format: "es", // Đảm bảo worker dùng ES Module
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),

      // fix loading all icon chunks in dev mode
      // https://github.com/tabler/tabler-icons/issues/1233
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
  define: {
    "import.meta.env.MODE": JSON.stringify(process.env.NODE_ENV || "development"),
  },
})
