import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueLazyload from 'vue-lazyload'
import infiniteScroll from 'vue-infinite-scroll'
import $ from 'jquery'
import './assets/css/base.css'
import './assets/js/jquery.slimscroll.min.js'

Vue.use(infiniteScroll)

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