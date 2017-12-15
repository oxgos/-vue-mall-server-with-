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
					<a href="javascript:void(0)" class="price" :class="{'sort-up':sortFlag}" @click="sortBy">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
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
										<a href="#"><img v-lazy="'/static/' + product.productImage" alt=""></a>
									</div>
									<div class="main">
										<div class="name">{{ product.productName }}</div>
										<div class="price">{{ product.salePrice }}</div>
										<div class="btn-area">
											<a href="javascript:;" class="btn btn--m" @click="addCart(product.productId)">加入购物车</a>
										</div>
									</div>
								</li>
							</ul>
							<div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="50" style="text-align: center;">
								<img src="../assets/loading-spinning-bubbles.svg" alt="" v-show="loading">
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
		<modal :modalFlag="failFlag" @changeFlag="closeModal">
			<p slot="message">
				请先登录,否则无法加入到购物车中!
			</p>
			<div slot="btnGroup">
				<a href="javascript: void(0);" class="btn btn--m" @click="failFlag = false" >关 闭</a>
			</div>
		</modal>
		<modal :modalFlag="successFlag" @changeFlag="closeModal">
			<p slot="message">
				<svg class="icon-status-ok">
					<use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
				</svg>
				<span>加入购物车成!</span>
			</p>
			<div slot="btnGroup">
				<a class="btn btn--m" href="javascript:;" @click="successFlag = false">继续购物</a>
				<router-link class="btn btn--m btn--red" href="javascript:;" to="/cart">查看购物车</router-link>
			</div>
		</modal>
		<nav-footer></nav-footer>
	</div>
</template>

<script type="text/ecmascript-6">
	import NavHeader from '@/components/NavHeader'
	import NavBread from '@/components/NavBread'
	import NavFooter from '@/components/NavFooter'
	import Modal from '@/components/commonModal'
	export default {
		data () {
			return {
				busy: false,
				sortFlag: true,
				page: 1,
				pageSize: 8,
				loading: false,
				goodsData: '',
				priceChecked: 'All',
				failFlag: false,
				successFlag: false,
				priceRange: [
					{
						startPrice: '0.00',
						endPrice: '100.00'
					},
					{
						startPrice: '100.00',
						endPrice: '500.00'
					},
					{
						startPrice: '500.00',
						endPrice: '1000.00'
					},
					{
						startPrice: '1000.00',
						endPrice: '5000.00'
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
			// 封装获取数据请求方法
			getGoodsList (flag) {
				let param = {
					page: this.page,
					pageSize: this.pageSize,
					sort: this.sortFlag ? 1 : -1,
					priceLevel: this.priceChecked
				}
				// 未获取数据后，显示loading图标
				this.loading = true

				// ajax请求/goods接口
				this.$ajax('/goods/list', {
					params: param
				}).then((res) => {
					// 已获取数据后，隐藏loading图标
					this.loading = false
					if (res.data.status === '0') {
						if (flag) {
							this.goodsData.push(...res.data.result.list)
							if (res.data.result.count < this.pageSize) {
								this.busy = true
							} else {
								this.busy = false
							}
						} else {
							this.goodsData = res.data.result.list
							this.busy = false
						}
					}
				})
			},
			addCart (id) {
				this.$ajax.post('/goods/addCart', {
					productId: id
				}).then((response) => {
					let res = response.data
					if (res.status === '10001') {
						this.failFlag = true
					} else {
						this.successFlag = true
					}
				})
			},
			loadMore () {
				this.busy = true
				setTimeout(() => {
					this.page++
					this.getGoodsList(true)
				}, 1000)
			},
			sortBy () {
				this.sortFlag = !this.sortFlag
				this.page = 1
				this.getGoodsList()
			},
			showFilterPop () {
				this.filterBy = true
				this.overLayFlag = true
			},
			setPriceFilter (index) {
				this.priceChecked = index
				this.page = 1
				this.getGoodsList()
				this.closePop()
			},
			closePop () {
				this.filterBy = false
				this.overLayFlag = false
			},
			closeModal () {
				this.failFlag = false
				this.successFlag = false
			}
		},
		components: {
			NavHeader,
			NavBread,
			NavFooter,
			Modal
		}
	}
</script>

<style scoped>
 @import '../assets/css/product.css';
</style>
