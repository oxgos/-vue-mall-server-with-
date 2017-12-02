import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueLazyload from 'vue-lazyload'

import './assets/css/base.css'

Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: 'static/loading-svg/loading-spinning-bubbles.svg',
    loading: 'static/loading-svg/loading-spinning-bubbles.svg',
    attempt: 1
})

Vue.prototype.$ajax = axios

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    render: h => h(App)
})