// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    devtools: { enabled: true },

    vuetify: {
        vuetifyOptions: {
            theme: {
                defaultTheme: "dark"
            }
        }
    },

    vite: {
        optimizeDeps: {
            exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util']
        },
        server: {
            headers: {
                'Cross-Origin-Opener-Policy': 'same-origin',
                'Cross-Origin-Embedder-Policy': 'require-corp'
            }
        }
    },

    modules: ["vuetify-nuxt-module"]
})
