<template>
	<div>
		<navT />
		<div class="myT">
		<div style="line-height: 80px;font-size: 18px;color: #75bdfe;">
			<img src="../../assets/img/icon_25.png" class="imgM"/><!--&nbsp;&nbsp;我的考试-->
			<el-select v-model="testType" style="border:none">
				<el-option value="我的考试" label="我的考试"></el-option>
				<el-option value="平时测验" label="平时测验"></el-option>
			</el-select>
			<el-input v-if="testType=='我的考试'" v-model="filter.testName" placeholder="请输入试卷名" style="width: 160px;margin-left: 80px;"></el-input>
			<el-date-picker
			  class="input-class"
			  v-if="testType=='我的考试'"
		      v-model="filter.startTime"
		      type="date"
		      placeholder="选择开始时间"
		      >
		    </el-date-picker>
			<span  v-if="testType=='我的考试'">至</span>
		    <el-date-picker
		      v-model="filter.endTime"
		      v-if="testType=='我的考试'"
		      class="input-class"
		      type="date"
		      placeholder="选择结束时间">
		    </el-date-picker>
		    <el-button v-if="testType=='我的考试'" type="danger" icon="el-icon-search" @click="query"></el-button>
		    <el-button type="primary" @click="goBack">返回首页</el-button>
			<!--<span @click="goBack" style="float: right;cursor: pointer;"><img src="../../assets/img/goback.png" class="imgO"/>返回首页</span>-->
		</div>
		<div v-if="testType=='我的考试'">
		<el-table :data="mytests"
			      class="myTestDone"
                  stripe
                  style="width: 100%;margin-bottom: 30px;"
                  :header-cell-style="{background:'#68b6fe'}"
                 >
           <el-table-column width="40">
           </el-table-column>
           <el-table-column label="考试信息" width="300">
           	<template slot-scope="scope">
              <div style="margin-bottom: 10px;">
              	<span style="display: inline-block;width: 200px;font-size: 16px;">{{scope.row.testName}}</span>
              	<span style="color: #ffd89a;" v-if="scope.row.testStatus==2">进行中</span>
				<span style="color: #8ebc77;" v-if="scope.row.testStatus==1">未开始</span>
				<span style="color: #ff828b;" v-if="scope.row.testStatus==3">已结束</span>
              </div>
              <div>
              	<span style="margin-right: 10px;">考试时长：{{scope.row.testTime}}分钟</span>
              	<span>迟到时间：无限制</span>
              </div>
            </template> 
           </el-table-column>
           <el-table-column label="有效时间" width="230">
           	<template slot-scope="scope">
              <div>开始：{{ scope.row.startTime | moment('YYYY-MM-DD HH:mm:ss')}}</div>
              <div>结束：{{ scope.row.endTime | moment('YYYY-MM-DD HH:mm:ss')}}</div>
            </template> 
           </el-table-column>
           <el-table-column label="总分" width="80">
           	<template slot-scope="scope">
               <span>{{scope.row.testTotalScore}}</span> 
            </template> 
           </el-table-column>
           <el-table-column label="批改状态" width="100">
           	<template slot-scope="scope">
               	<span style="color: #ffd89a;" v-if="scope.row.myTestStatus==2">进行中</span>
				<span style="color: #ff828b;" v-if="scope.row.myTestStatus==3">已完成</span>
            </template> 
           </el-table-column>
           <el-table-column label="成绩" width="120">
            <template slot-scope="scope">
               <span v-if="scope.row.myTestStatus==2">目前得分：{{scope.row.testScore}}</span> 
               <span v-if="scope.row.myTestStatus==3">总得分：{{scope.row.testScore}}</span> 
            </template>                 
           </el-table-column>
           <el-table-column label="操作" width="150">
             <template slot-scope="scope">               
               <button class="myB" @click="record(scope.row.testId,scope.row.testScore)" v-if="scope.row.isShowResult=='Y'&&scope.row.myTestStatus!='1'">答题记录</button>
               <span v-if="scope.row.myTestStatus=='1'">未作答</span>
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
        <div v-if="testType=='平时测验'">
        <el-table :data="peaceList"  
        		   class="myTestDone"
                  stripe
                  style="width: 100%;margin-bottom: 30px;"
                  :header-cell-style="{background:'#68b6fe'}" >
           	<el-table-column prop="unitPaperName"
                             label="单元名称">
            </el-table-column>
            <el-table-column label="批改状态">
				           	<template slot-scope="scope">
				               	<el-button type="primary" size="mini" v-if="scope.row.status==2" icon="el-icon-loading">进行中</el-button>
                  				<el-button type="success" size="mini" v-if="scope.row.status==3" icon="el-icon-check">已完成</el-button>
				            </template> 
				          </el-table-column>
        		<el-table-column prop="score"
                             label="学生成绩">
                <template slot-scope="scope">
					               <span v-if="scope.row.status==2">目前得分：{{scope.row.score}}</span> 
					               <span v-if="scope.row.status==3">总得分：{{scope.row.score}}</span> 
					            </template>     
            </el-table-column>
           	<el-table-column prop="createTime"
                             label="测验时间">
                <template slot-scope="scope">
                <div>{{ scope.row.createTime | moment('YYYY年MM月DD日 HH:mm:ss')}}</div>
                </template>
            </el-table-column>
            <el-table-column
                             label="操作"
                             >
                <template slot-scope="scope">
                	<el-button type="primary" size="mini" @click="peaceDetail(scope.row)">答题详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--分页begin-->
        <el-pagination class="pageI"
                       :current-page="filter1.pageIndex"
                       :page-sizes="[5, 10, 20, 50]"
                       :page-size="filter1.pageSize"
                       layout="total, sizes, prev, pager, next, jumper"
                       :total="total_rows1"
                       @size-change="pageSizeChange1"
                       @current-change="pageCurrentChange1">
        </el-pagination>
        <!--分页end-->
        </div>
        </div>
	</div>
</template>

<script>
import navT from '../common/nav/index'
import { queryMyDoneTests } from '@/api/student'
import { getPeaceList } from '@/api/student'
export default {
	data(){
		return{
			mytests:[],
			peaceList:[],
			total_rows: 0,
			total_rows1: 0,
			testType:"我的考试",
			filter1:{
              pageSize: 5, // 页大小
              pageIndex: 1// 当前页
          },
			filter:{
              pageSize: 5, // 页大小
              pageIndex: 1, // 当前页
              startTime:null,
              endTime:null,
              testName:''
          }
		}
	},
	components:{
		navT
	},
	 mounted: function() {
	 	this.getMT()
  },
	 methods: {
	 	getPL(){
  		getPeaceList(this.filter1).then((response) => {
             this.peaceList = response.data.rows;
             this.total_rows1 = response.data.total;
           })
          .catch((response)=> {
          });
  	},
	 getMT(){
  		queryMyDoneTests(this.filter).then((response) => {
             this.mytests = response.data.rows;
             this.total_rows = response.data.total;
           })
          .catch((response)=> {
          });
  },
  	query(){
  		this.getMT();
  	},
  	//答题记录
  	record(id,tscore){
  		const {href}=this.$router.resolve({
  			path: '/record',
  			name: '答题记录',
  			query: {testId: id,testScore: tscore}
  			})
  		window.open(href,'_blank')
  	},
  	pageSizeChange(val) {
        this.filter.pageSize = val;
        this.getMT();
    },
    pageCurrentChange(val) {
        this.filter.pageIndex = val;
        this.getMT();
      },
      pageSizeChange1(val) {
        this.filter1.pageSize = val;
        this.getPL();
    },
    pageCurrentChange1(val) {
        this.filter1.pageIndex = val;
        this.getPL();
      },
      peaceDetail(user){
		const {href}=this.$router.resolve({
  			path:'/peaceDetail',
			name:'PeaceDetail',
  			query: {unitPaperId: user.unitPaperId,testScore: user.score}
  			})
  		window.open(href,'_blank')
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
    watch: {
  	testType(val){
  		if(val=='我的考试'){
  			 this.getMT();
  		}else{
  			 this.getPL();
  		}
  	}
    }

}
</script>

<style>
	body{
		background: #f7f6f6;
		font-family: "微软雅黑";
	}
	.input-class{
    width: 150px !important;
}
	.myT{
		width: 1020px;
		margin: 0 auto;
	}
	.el-table thead tr{
		color: white;
	}
	.myTestDone .el-table__body tr{
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