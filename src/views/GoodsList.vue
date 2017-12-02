<template>
	<div>
		<nav-header></nav-header>
		<nav-bread>
			<span>Goods</span>
		</nav-bread>
		<div class="accessory-result-page accessory-page">
			<div class="container">
				<div class="filter-nav">
					<span class="sortby">Sort by:</span>
					<a href="javascript:void(0)" class="default cur">Default</a>
					<a href="javascript:void(0)" class="price">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
					<a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
				</div>
				<div class="accessory-result">
					<!-- filter -->
					<div class="filter stopPop" id="filter" :class="{'filterby-show' : filterBy}">
						<dl class="filter-price">
							<dt>Price:</dt>
							<dd>
								<a :class="{ 'cur' : priceChecked === 'All'}" href="javascript:void(0)" @click="setPriceFilter('All')">All</a>
							</dd>
							<dd v-for="(price, index) in priceRange" :key="index">
								<a :class="{ 'cur': priceChecked === index }" href="javascript:void(0)"  @click="setPriceFilter(index)">{{ price.startPrice }} - {{ price.endPrice }}</a>
							</dd>
						</dl>
					</div>

					<!-- search result accessories list -->
					<div class="accessory-list-wrap">
						<div class="accessory-list col-4">
							<ul>
								<li v-for="product in goodsData" :key="product.productId">
									<div class="pic">
										<a href="#"><img v-lazy="'/static/' + product.productImg" alt=""></a>
									</div>
									<div class="main">
										<div class="name">{{ product.productName }}</div>
										<div class="price">{{ product.prodcutPrice }}</div>
										<div class="btn-area">
											<a href="javascript:;" class="btn btn--m">加入购物车</a>
										</div>
									</div>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
		<nav-footer></nav-footer>
	</div>
</template>

<script type="text/ecmascript-6">
	import NavHeader from '@/components/NavHeader'
	import NavBread from '@/components/NavBread'
	import NavFooter from '@/components/NavFooter'

	export default {
		data () {
			return {
				goodsData: '',
				priceChecked: 'All',
				priceRange: [
					{
						startPrice: '0.00',
						endPrice: '500.00'
					},
					{
						startPrice: '500.00',
						endPrice: '1000.00'
					},
					{
						startPrice: '1000.00',
						endPrice: '1500.00'
					},
					{
						startPrice: '1500.00',
						endPrice: '2000.00'
					}
				],
				filterBy: false,
				overLayFlag: false
			}
		},
		mounted () {
			this.getGoodsList()
		},
		methods: {
			getGoodsList () {
				this.$ajax('api/goods').then((res) => {
					this.goodsData = res.data.result
				})
			},
			showFilterPop () {
				this.filterBy = true
				this.overLayFlag = true
			},
			setPriceFilter (index) {
				this.priceChecked = index
				this.closePop()
			},
			closePop () {
				this.filterBy = false
				this.overLayFlag = false
			}
		},
		components: {
			NavHeader,
			NavBread,
			NavFooter
		}
	}
</script>

<style scoped>
 @import '../assets/css/product.css';
</style>
