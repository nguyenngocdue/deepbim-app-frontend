import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import ignore from 'rollup-plugin-ignore';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import path from 'path';
import { normalizePath } from 'vite';

import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pdfjsDistPath = path.dirname(require.resolve('pdfjs-dist/package.json'));
const cMapsDir = normalizePath(path.join(pdfjsDistPath, 'cmaps'));
// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0', // Lắng nghe trên tất cả interface (cần cho Docker)
    port: 3003,      // Thay đổi port mặc định từ 5173 sang 3003 (hoặc port bạn muốn)
    strictPort: true, // Nếu port đã được sử dụng, Vite sẽ báo lỗi thay vì tự chọn port khác
  },
  plugins: [react({}), TanStackRouterVite(), 
    {
      ...ignore([
        'three/examples/jsm/libs/lottie_canvas.module.js',
        'three/examples/jsm/libs/chevrotain.module.min.js'
      ]),
      enforce: 'pre',
      apply: 'build',
    },
   viteStaticCopy({
      targets: [
        {
          src: cMapsDir,
          dest: '.',
        },
      ],
    }),
  ],
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
    "import.meta.env.MODE": JSON.stringify(process.env.NODE_ENV || "production"),
  },
  
})
