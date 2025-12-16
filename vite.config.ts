import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import checker from "vite-plugin-checker";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  server: { open: true, port: 3800 },
  build: {
    sourcemap: true,
  },
  plugins: [
    svgr(),
    react(),
    checker({ eslint: { lintCommand: "eslint src" }, overlay: false }),
    VitePWA({
      registerType: "prompt",
      includeAssets: ["favicon.ico", "apple-touch-icon.png", "android-chrome-192x192.png", "android-chrome-512x512.png"],
      manifest: {
        name: "miFIN Qualtech Lead Management",
        short_name: "miFIN Lead",
        description: "miFIN Qualtech Lead Management System with offline support",
        theme_color: "#2f4cdd",
        background_color: "#2f4cdd",
        display: "standalone",
        scope: "/mifinLead/",
        start_url: "/mifinLead/worklist",
        orientation: "any",
        categories: ["business", "finance", "productivity"],
        icons: [
          {
            src: "/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable"
          },
          {
            src: "/android-chrome-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ],
        shortcuts: [
          {
            name: "My Worklist",
            short_name: "Worklist",
            description: "View your work list",
            url: "/mifinLead/worklist",
            icons: [{ src: "/android-chrome-192x192.png", sizes: "192x192" }]
          },
          {
            name: "New Lead",
            short_name: "New Lead",
            description: "Create a new lead",
            url: "/mifinLead/lead",
            icons: [{ src: "/android-chrome-192x192.png", sizes: "192x192" }]
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,woff,woff2,ttf,eot}"],
        globIgnores: ["**/pincode.json"],
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api/, /\.(?:png|jpg|jpeg|svg|gif|webp)$/],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        runtimeCaching: [
          {
            urlPattern: /^https?:\/\/localhost:3800.*\.(js|css)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "assets-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https?:\/\/localhost:3800\/mifinLead/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "pages-cache",
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https?:\/\/.*\/mifin(Lead)?.*\/(getMasters|getDependentMaster|getLeadDetails|contactDetail)/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 500,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/.*\/mifin\/.*/i,
            handler: "NetworkFirst",
            options: {
              cacheName: "api-general-cache",
              networkTimeoutSeconds: 5,
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 7 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /\.(png|jpg|jpeg|svg|gif|webp|ico)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: "module"
      }
    })
  ],
  publicDir: "public",
  resolve: {
    alias: {
      "@mifin": path.resolve(__dirname, "src"),
    },
  },
});
