import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import eslintPlugin from 'vite-plugin-eslint'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    eslintPlugin({
      include: ['src/**/*.js', 'src/**/*.vue', 'src/**/*.ts'],
      exclude: ['./node_modules/**'],
      cache: false
    }),
    Components({
      extensions: ['vue'],
      resolvers: [NaiveUiResolver()],
      // dirs: ['src/components'],
      // 可以指定放置类型声明文件的位置和名称
      dts: 'src/types/components.d.ts'
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, 'src'), // 路径别名
    },
  }
})
