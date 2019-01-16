<template>
  <div class="pos">
		<el-row>
			<el-col :span='7' class='pos-order' id='order-list'>
				<el-tabs>
					<el-tab-pane label='点餐'>
						<el-table :data = "tableData" border>
							<el-table-column prop='goodsName' label='商品名称'>
								
							</el-table-column>
							<el-table-column prop='count' label='数量' width='60'>
								
							</el-table-column>
							<el-table-column prop='price' label='金额' width='70'>
								
							</el-table-column>
							<el-table-column label='操作' wdth='100' fixed = 'right'>
								<template scope = 'scope'>
									<el-button type='text' size='small' @click="delSingleGoods(scope.row)">删除</el-button>
									<el-button type='text' size='small' @click="addOrderList(scope.row)">增加</el-button>
								</template>
							</el-table-column>
						</el-table>
					</el-tab-pane>
					<el-tab-pane label='挂单'>挂单</el-tab-pane>
					<el-tab-pane label='外卖'>外卖</el-tab-pane>
				</el-tabs>
				<div>
					数量：{{totalCount}} &nbsp;&nbsp;&nbsp;金额：{{totalMoney}}元
				</div>
				<div style="margin-top: 20px;">
					<el-button type="warning">挂单</el-button>
					<el-button type="danger" @click="delAllGoods()">删除</el-button>
					<el-button type="success" @click="checkOut()">结账</el-button>
				</div>
			</el-col>
			<el-col :span='17'>
				<div class="often-goods">
					<div class="title">常用商品</div>
					<div class="often-goods-list">
							<ul>
									<li v-for="goods in oftenGoods" @click="addOrderList(goods)">
											<span>{{goods.goodsName}}</span>
											<span class="o-price">{{goods.price}}</span>
									</li>
							</ul>
					</div>
				</div>
				<div style="clear: both;">
					<el-tabs>
						<el-tab-pane label="汉堡">
							<ul class='cookList'>
									<li v-for="goods in type0Goods" @click="addOrderList(goods)">
											<span class="foodImg"><img :src="goods.goodsImg" width="100%"></span>
											<span class="foodName">{{goods.goodsName}}</span>
											<span class="foodPrice">{{goods.price}}</span>
									</li>
							</ul>
						</el-tab-pane>
						<el-tab-pane label="小食">
							<ul class='cookList'>
									<li v-for="goods in type1Goods" @click="addOrderList(goods)">
											<span class="foodImg"><img :src="goods.goodsImg" width="100%"></span>
											<span class="foodName">{{goods.goodsName}}</span>
											<span class="foodPrice">{{goods.price}}</span>
									</li>
							</ul>
						</el-tab-pane>
						<el-tab-pane label="饮料">
							<ul class='cookList'>
									<li v-for="goods in type2Goods" @click="addOrderList(goods)">
											<span class="foodImg"><img :src="goods.goodsImg" width="100%"></span>
											<span class="foodName">{{goods.goodsName}}</span>
											<span class="foodPrice">{{goods.price}}</span>
									</li>
							</ul>
						</el-tab-pane>
						<el-tab-pane label="套餐">
							<ul class='cookList'>
									<li v-for="goods in type3Goods" @click="addOrderList(goods)">
											<span class="foodImg"><img :src="goods.goodsImg" width="100%"></span>
											<span class="foodName">{{goods.goodsName}}</span>
											<span class="foodPrice">{{goods.price}}</span>
									</li>
							</ul>
						</el-tab-pane>
					</el-tabs>
					
				</div>
			</el-col>
		</el-row>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'pos',
	data(){
		return{
			tableData:[],
			oftenGoods:[],
			type0Goods:[],
			type1Goods:[],
			type2Goods:[],
			type3Goods:[],
			totalCount:0,
			totalMoney:0,
		}
	},
	created(){
		axios.get('https://www.easy-mock.com/mock/5b8b30dbf032f03c5e71de7f/kuaican/oftenGoods')
		.then(response=>{
			console.log(response);
			this.oftenGoods = response.data;
		})
		.catch(error=>{
			console.log(error);
		})
		axios.get('https://www.easy-mock.com/mock/5b8b30dbf032f03c5e71de7f/kuaican/typeGoods')
		.then(response=>{
			console.log(response);
			this.type0Goods = response.data[0];
			this.type1Goods = response.data[1];
			this.type2Goods = response.data[2];
			this.type3Goods = response.data[3];
		})
		.catch(error=>{
			console.log(error)
		})
	},
	mounted() {
		var orderHeight=document.body.clientHeight;
		console.log(orderHeight)
		document.getElementById('order-list').style.height=orderHeight+"px"
	},
	methods:{
		addOrderList(goods){
			//初始化数据
			let isHave = false;//是否含有该商品
			for(let i = 0;i<this.tableData.length;i++){
				if(this.tableData[i].goodsId == goods.goodsId){
					isHave = true;
				}
			}
			//根据isHave判断是增加商品数量还是新建商品
			if(isHave){
				//存在增加商品数量
				let arr = this.tableData.filter(o => o.goodsId == goods.goodsId);
				arr[0].count++;
			}else{
				//不存在新建商品
				let newGoods={goodsId:goods.goodsId,goodsName:goods.goodsName,price:goods.price,count:1};
        this.tableData.push(newGoods);
			}
			this.getAllMoney()
		},
		delSingleGoods(goods){
			 this.tableData=this.tableData.filter(o => o.goodsId !=goods.goodsId);
				this.getAllMoney()
		},
		getAllMoney(){
			this.totalCount = 0;//商品数量清零
			this.totalMoney = 0;//商品总金额清零
			//商品总数量和总价格的计算
			this.tableData.forEach(element=>{
				this.totalCount+=element.count;
				this.totalMoney+=element.price*element.count;
			})
		},
		delAllGoods() {
			this.tableData = [];
			this.totalCount = 0;
			 this.totalMoney = 0;
		},
		checkOut(){
			if(this.totalCount!=0){
				var qs = require('qs');
				axios.post('url',qs.stringify({
					count:this.totalCount,
					money:this.totalMoney
				}))
				.then(response=>{
					if(response.flag == 0){
						this.$message({
							message:"结账陈功！",
							type:"success"
						})
					}else{
						this.$message.error(response.data)
					}
				})
				.catch(error=>{
					console.log(error)
				})
			}else{
				this.$message.error("不能空结")
			}
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	.pos{
		float: left;
		width: 95%;
	}
.pos-order{
	background-color: #f9fafc;
	border-right: 1px solid #c0ccda;
}
.title{
       height: 20px;
       border-bottom:1px solid #D3DCE6;
       background-color: #F9FAFC;
       padding:10px;
   }
   .often-goods-list ul li{
      list-style: none;
      float:left;
      border:1px solid #E5E9F2;
      padding:10px;
      margin:5px;
      background-color:#fff;
			cursor: pointer;
   }
  .o-price{
      color:#58B7FF; 
   }
	 .cookList li{
       list-style: none;
       width:23%;
       border:1px solid #E5E9F2;
       height: auot;
       overflow: hidden;
       background-color:#fff;
       padding: 2px;
       float:left;
       margin: 2px;
			 cursor: pointer;
   }
   .cookList li span{
        display: block;
        float:left;
   }
   .foodImg{
       width: 40%;
   }
   .foodName{
       font-size: 18px;
       padding-left: 10px;
       color:brown;
   }
   .foodPrice{
       font-size: 16px;
       padding-left: 10px;
       padding-top:10px;
   }
</style>
