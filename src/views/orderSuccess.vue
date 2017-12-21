<template>
   <div class="orderSuccess">
       <nav-header></nav-header>
       <nav-bread></nav-bread>
       <div class="container">
            <div class="page-title-normal">
            <h2 class="page-title-h2"><span>check out</span></h2>
            </div>
            <!-- 进度条 -->
            <div class="check-step">
            <ul>
                <li class="cur"><span>Confirm</span> address</li>
                <li class="cur"><span>View your</span> order</li>
                <li class="cur"><span>Make</span>cd  payment</li>
                <li class="cur"><span>Order</span> confirmation</li>
            </ul>
            </div>

            <div class="order-create">
            <div class="order-create-pic"><img src="" alt=""></div>
            <div class="order-create-main">
                <h3>Congratulations! <br>Your order is under processing!</h3>
                <p>
                <span>Order ID：{{ orderId }}</span>
                <span>Order total：{{ orderTotal | currency }}</span>
                </p>
                <div class="order-create-btn-wrap">
                <div class="btn-l-wrap">
                    <router-link to="/cart" href="javascript:;" class="btn btn--m">Cart List</router-link>
                </div>
                <div class="btn-r-wrap">
                    <router-link to="/" href="javascript:;" class="btn btn--m">Goods List</router-link>
                </div>
                </div>
            </div>
            </div>
        </div>
        <nav-footer></nav-footer>
   </div>
</template>

<script type="text/ecmascript-6">
    import NavHeader from '@/components/NavHeader'
	import NavBread from '@/components/NavBread'
    import NavFooter from '@/components/NavFooter'
    import { currency } from '../util/currency'
    export default {
        data () {
            return {
                orderId: this.$route.query.orderId,
                orderTotal: 0
            }
        },
        mounted () {
            this.init()
        },
        methods: {
            init () {
                this.$ajax('/users/orderDetail', {
                    params: {
                        orderId: this.orderId
                    }
                }).then((res) => {
                    if (res.data.status === '0') {
                        this.orderTotal = res.data.result
                    }
                })
            }
        },
        filters: {
            currency: currency
        },
        components: {
            NavHeader,
            NavBread,
            NavFooter
        }
    }
</script>

<style scoped>
    @import './../assets/css/checkout.css';
</style>
