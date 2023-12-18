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

    modules: ["vuetify-nuxt-module"]
})
