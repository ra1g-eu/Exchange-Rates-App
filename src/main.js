import axios from "axios";
import VueAxios from "vue-axios";
import {createApp} from 'vue'
import App from './App.vue'
import {createRouter, createWebHistory} from "vue-router";
import {loadFonts} from './plugins/webfontloader'
import 'vuetify/styles'
import {createVuetify} from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import {aliases, mdi} from 'vuetify/iconsets/mdi'
import '@mdi/font/css/materialdesignicons.css'
import {routes} from "./routes";
import i18n from './i18n'

loadFonts()

const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'dark'
    },
    icons: {
        defaultSet: 'mdi',
        aliases,
        sets: {
            mdi,
        }
    },
});

let appV = createApp(App);

axios.defaults.headers.common['App-Request-Header'] = 'ExchangeRatesApp/REQ/ERA/1.0.0';
appV.config.globalProperties.$axios = axios;
appV.config.globalProperties.$loc = i18n;
appV.config.globalProperties.$router = router;
appV.config.globalProperties.$vuetify = vuetify;
appV.config.globalProperties.$apiUrl = 'https://api.ra1g.eu/';
//appV.config.globalProperties.$apiUrl = 'http://localhost:3000/';

appV.use(VueAxios, axios);
appV.use(i18n);
appV.use(vuetify);
appV.use(router);
appV.mount('#app');


