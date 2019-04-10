<template>
	<div>
		<navT />
		<div class="myT">
		<div style="line-height: 60px;font-size: 18px;color: #75bdfe;">
			<img src="../../assets/img/icon_25.png" class="imgM"/>&nbsp;&nbsp;我的考试
			<span @click="goBack" style="float: right;cursor: pointer;"><img src="../../assets/img/goback.png" class="imgO"/>返回首页</span>
		</div>
		<el-table :data="mytests"
				  class="myTestUnDone"
                  stripe
                  style="width: 100%;margin-bottom: 30px;"
                  :header-cell-style="{background:'#68b6fe'}"
                 >
           <el-table-column width="40">
           </el-table-column>
           <el-table-column label="考试信息" width="330">
           	<template slot-scope="scope">
              <div style="margin-bottom: 10px;">
              	<span style="display: inline-block;width: 200px;font-size: 16px;">{{scope.row.testName}}</span>
              	<!--<span style="color: #ffd89a;" v-if="scope.row.testStatus==2">进行中</span>
				<span style="color: #8ebc77;" v-if="scope.row.testStatus==1">未开始</span>
				<span style="color: #ff828b;" v-if="scope.row.testStatus==3">已结束</span>-->
				<span style="color: #ffd89a;" v-if="time>scope.row.startTime">进行中</span>
				<span style="color: #8ebc77;" v-if="time<scope.row.startTime">未开始</span>
				<span style="color: #ff828b;" v-if="time>scope.row.endTime">已结束</span>
              </div>
              <div>
              	<span style="margin-right: 10px;">考试时长：{{scope.row.testTime}}分钟</span>
              	<span>迟到时间：无限制</span>
              </div>
            </template> 
           </el-table-column>
           <el-table-column label="有效时间" width="250">
           	<template slot-scope="scope">
              <div>开始：{{ scope.row.startTime | moment('YYYY-MM-DD HH:mm:ss')}}</div>
              <div>结束：{{ scope.row.endTime | moment('YYYY-MM-DD HH:mm:ss')}}</div>
            </template> 
           </el-table-column>
           <el-table-column label="总分" width="200">
           	<template slot-scope="scope">
               <span>{{scope.row.testTotalScore}}</span> 
            </template> 
           </el-table-column>
           <el-table-column label="操作" width="200">
             <template slot-scope="scope">               
               <button class="myB" @click="start(scope.row.testId)" v-if="scope.row.testStatus=='2'||time>scope.row.startTime">开始考试</button>
               <span v-if="scope.row.testStatus=='3'||time>scope.row.endTime">考试已结束</span>
            </template>              
           </el-table-column>
        </el-table>
        <!--分页begin-->
        <el-pagination class="pageI"
                       :current-page="filter.pageIndex"
                       :page-sizes="[5, 10, 20, 50]"
                       :page-size="filter.pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total_rows"
                       @size-change="pageSizeChange"
                       @current-change="pageCurrentChange">
        </el-pagination>
        <!--分页end-->
        </div>
	</div>
</template>

<script>
import navT from '../common/nav/index'
import { getMyTest } from '@/api/student'

export default {
	data(){
		return{
			mytests:[],
			total_rows: 0,
			time:'',
			filter:{
              pageSize: 5, // 页大小
              pageIndex: 1 // 当前页
          }
		}
	},
	components:{
		navT
	},
	 mounted: function() {
      this.getMT();
  },
	 methods: {
	 getMT(){
  		getMyTest(this.filter).then((response) => {
             this.mytests = response.data.undoneRows;
             this.total_rows = response.data.undoneTotal;
             this.time = response.data.sysTime;
           })
          .catch((response)=> {
          });
  	},
  	//开始考试
  	start(id){
  		this.$router.push({
  			path:'/attention',
  			name: '注意事项',
  			query: {testId: id}
  		})
  	},
  	pageSizeChange(val) {
        this.filter.pageSize = val;
        this.getMT();
    },
    pageCurrentChange(val) {
        this.filter.pageIndex = val;
        this.getMT();
      },
  	//返回首页
  	goBack(){
  		this.$router.push({
  			path:'/studentTest'
  		})
  	}
//    getParams () {
//      // 取到路由带过来的参数 
//      const routerParams = this.$route.params.dataobj;
//      console.log(routerParams)
//      // 将数据放在当前组件的数据内
//      this.mytests = routerParams;
//      
//    }
    },
//  watch: {
//  // 监测路由变化,只要变化了就调用获取路由参数方法将数据存储本组件即可
//    '$route': 'getParams'
//  }

}
</script>

<style>
	body{
		background: #f7f6f6;
		font-family: "微软雅黑";
	}
	.myT{
		width: 1020px;
		margin: 0 auto;
	}
	.el-table thead tr{
		color: white;
	}
	.myTestUnDone .el-table__body tr{
	height:100px;
	}
	.el-table{
		box-shadow: 2px 2px 10px #e5f1ff;
		border-radius: 10px;
	}
	.myB{
		color: #68b6fe;
		width: 80px;
		height: 30px;
		border: none;
		cursor: pointer;
		border: 1px solid #68b6fe;
		border-radius: 5px;
		background: none;
		outline:none;
	}
	.myB:hover{
		background: #68b6fe;
		color: #ffffff;
	}
	.imgO{
			position: relative;
			top: 8px;
			left: -5px;
		}
	.imgM{
			position: relative;
			top: 5px;
		}
	.pageI{
		text-align: center;
		margin-bottom: 40px;
	}
</style>