/// <reference types="vite/client" />

declare module '*.css' {}

declare module 'swiper/css' {}
declare module 'swiper/css/virtual' {}

declare module 'virtual:pwa-register' {
  import type { RegisterSWOptions } from 'vite-plugin-pwa'
  export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>
}
