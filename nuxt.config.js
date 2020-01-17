require('dotenv').config();
const webpack = require('webpack')

export default {
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || '0.0.0.0'
  },
  env: {
    apiUrl: process.env.API_PROD,
  },
  mode: 'spa',
  /*
  ** Headers of the page
  */

  head: {
    title: process.env.npm_package_name || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    script: [
      { src: '/assets/libs/jquery/dist/jquery.min.js' },
      { src: '/assets/js/materialize.min.js' },
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.3/TweenMax.min.js' },
      // { src: '/assets/libs/perfect-scrollbar/dist/js/perfect-scrollbar.jquery.min.js' },
      // { src: '/assets/js/app.js' },
      // { src: '/assets/js/app.init.horizontal-fullwidth.js' },
      // { src: '/assets/js/app-style-switcher.js' },
      { src: '/assets/js/custom.js' },
      // { src: '/assets/extra-libs/prism/prism.js' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', type: 'text/css', href: '/assets/css/style.css' },
      { rel: 'stylesheet', type: 'text/css', href: '/assets/extra-libs/prism/prism.css' },
      { rel: 'stylesheet', type: 'text/css', href: '/assets/css/fix_styles.css' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
  ],
  /*
  ** Plugins to load before mounting the App
  */
  router: {
    // middleware: ['i18n-redirect', 'cookie', 'clearTitle']
    middleware: ['cookie', 'clearTitle', 'auth']
  },
  plugins: [
    // '~/plugins/i18n.js',
    // { src: '~/plugins/i18n.js', mode: 'client'},
    '~/plugins/http',
    '~/plugins/vuetify',
    { src: '~/plugins/vue-select', ssr: false },
    { src: '~/plugins/calendar', ssr: false },
    { src: '~/plugins/editor', ssr: false },
    '~/plugins/load-script',
    '~/plugins/filters.js',
    { src: '~/plugins/after-each.js', mode: 'client' }
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://axios.nuxtjs.org/usage
    '@nuxtjs/axios',
    '@nuxtjs/toast',
    'cookie-universal-nuxt',

    // ["nuxt-i18n"]
    ['nuxt-i18n', {
      strategy: 'prefix_except_default',
      defaultLocale: 'en',
      locales: [
        'ru',
        'en',  // Make sure that defualt locale is the last one!
      ]
    }]
  ],

  i18n: {

    locales: [
      { code: "ru", iso: "ru-RU", name: "Русский", file: "ru.js" },
      { code: "en", iso: "en-US", name: "English", file: "en.js" }
    ],

    baseUrl: process.env.API_PROD,

    defaultLocale: 'en',
    strategy: "prefix_except_default",
    langDir: "lang/",
    lazy: true,

    parsePages: false,
    encodePaths: false,

    detectBrowserLanguage: {
      // cookieKey: 'i18n_cookie',
      useCookie: true,
      // alwaysRedirect: true,
      fallbackLocale: 'en'
    },


    vuex: {
      moduleName: "i18n",
      syncLocale: true,
      syncMessages: true,
      syncRouteParams: true
    }
  },

  /*
  ** Axios module configuration
  ** See https://axios.nuxtjs.org/options
  */
  axios: {},
  toast: {
    position: 'top-right',
    duration: 3000,
    theme: 'bubble',
    register: [ // Register custom toasts
      {
        name: 'error',
        message: 'Oops...Something went wrong',
        options: {
          type: 'error'
        }
      },
      {
        name: 'success',
        message: 'Success!',
        options: {
          type: 'success'
        }
      }
    ]
  },
  /*
  ** Build configuration
  */
  build: {
    vendor: ["nuxt-i18n"],

    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
      })
    ],

    /*
    ** You can extend webpack config here
    */
    extend(config, { isDev, isClient }) {
      if (isDev && isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          exclude: /(node_modules)/
        })
      }
    }
  }
}
