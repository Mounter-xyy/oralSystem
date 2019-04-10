<template>
  <div class="table-container">
    <section  class="main-content-wrapper wrapper" >
        <section id="main-content" >
            <div class="row">
                <div class="col-md-12">
                    <!-- 查询 -->
                    <ul class="btn-edit fl">
                        <li class="input-serach htc">
                        	任务名称：
                            <el-select v-model="keywords">
                            	<el-option v-for="item in tasks" :value="item.testId" :label="item.testName"></el-option>
                            </el-select>
                            <el-button type="danger" class="danger" slot="append" icon="el-icon-search" @click="query"></el-button>
                        </li>
                        
                    </ul>
                    
                    <!-- 用户列表-->
                    <el-table :data="users"
                              stripe
                              element-loading-text="拼命加载中..."
                              style="width: 100%"
                              height="470"
                              border
                              @sort-change="tableSortChange"
                              @selection-change="tableSelectionChange">
                        <el-table-column type="selection"
                                        >
                        </el-table-column>
                        <el-table-column prop="testName"
                        				width="200"
                                         label="任务名称"
                                         >
                        </el-table-column>
                        <el-table-column prop="questionType"
                        				width="150"
                                         label="题型">
                            <template slot-scope="scope">
                            	<span v-if="scope.row.questionType==1">单选题</span>
                            	<span v-if="scope.row.questionType==2">填空题</span>
                            	<span v-if="scope.row.questionType==3">问答题</span>
                            	<span v-if="scope.row.questionType==4">朗诵题</span>
                            </template> 
                        </el-table-column>
                        <el-table-column prop="questionStem"
                                         label="题干">
                            <template slot-scope="scope">
                            	<div v-html="scope.row.questionStem" class="questionA"></div>
                            	<div v-for="item in scope.row.options">{{item.optionName}}：{{item.optionValue}}</div>
                            </template> 
                        </el-table-column>
                        <el-table-column prop="optionSelectInfos"
                        				width="180"
                                         label="选择率">
                            <template slot-scope="scope">
                            	<div v-for="item in scope.row.optionSelectInfos">选择{{item.myAnswer}}：{{item.NUM}}人</div>
                            	<div v-if="scope.row.optionSelectInfos==undefined">-</div>
                            	<div v-if="scope.row.optionSelectInfos!=undefined">总人数：{{count}}人</div>
                           	</template> 
                        </el-table-column>
                        <el-table-column prop="optionTrueInfos"
                        				width="180"
                                         label="正答率">
                            <template slot-scope="scope">
                            	<div v-for="item in scope.row.optionTrueInfos">
                            		<div v-if="item.isRight==2" style="color: green;">正确：{{item.NUM}}人</div>
                            		<div v-if="item.isRight==0" style="color: red;">错误：{{item.NUM}}人</div>
                            		<div v-if="item.isRight==1">部分正确：{{item.NUM}}人</div>
                            	</div>
                            	<div>总人数：{{count}}人</div>
                           	</template> 
                        </el-table-column>
                        <!--<el-table-column label="操作" width="150">
						             	<template slot-scope="scope">               
						               <button class="myB" @click="lookP(scope.row)">查看图形</button>
						            	</template>              
						           </el-table-column>-->
                    </el-table>
                    <!--分页begin-->
                    <el-pagination class="tc mg"
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
        </section>
    </section>
    <!-- 查看饼图 begin-->
    <!--<el-dialog title="试题分析" :visible.sync="dialogBarVisible"  :close-on-click-modal="false" :close-on-press-escape="false">
        <schart :canvasId="canvasId1"
            :type="type"
            :width="width"
            :height="height"
            :data="data1"
            :options="options1"
        ></schart><br />
        <schart :canvasId="canvasId2"
            :type="type"
            :width="width"
            :height="height"
            :data="data2"
            :options="options2"
        ></schart>
    </el-dialog>-->
  </div>
</template>
<script>
import { getQTOI,getQTIT } from '@/api/test'
import Schart from 'vue-schart'

export default {
  data: function() {
      return {
          currentId:'',
//        canvasId1: 'myCanvas1',
//        canvasId2: 'myCanvas2',
//      type: 'bar',
//      width: 500,
//      height: 400,
//      data1: [],
//      data2: [],
//      options1: {
//          title: '选择率'
//      },
//      options2: {
//          title: '正答率'
//      },
      users:[],
      tasks:[],
      searchValue:'',
      filter: {
          pageSize: 5, // 页大小
          pageIndex: 1, // 当前页 
          paramsMap:{
          },
      },
      total_rows: 0,
      count:0,
      keywords: '', //搜索框的关键字内容
      dialogBarVisible: false,
      selected: [], //已选择项
      };
  },
  components:{
        Schart
  },
  mounted: function() {
      this.getTasks();
  },
  methods: {
  		getTasks() {
          getQTIT().then((response) => {
            this.tasks = response.data;
            this.keywords = response.data[0].testId;
            this.filter.paramsMap.testId = response.data[0].testId;
            getQTOI(this.filter).then((response) => {
            this.users = response.data.rows;
            this.count = response.data.count;
            this.total_rows = response.data.total;   
            this.selected.splice(0,this.selected.length);
          })
          .catch((response)=> {
          });
          })
          .catch((response)=> {
          });
     },
      tableSelectionChange(val) {
          this.selected = val;
      },
      tableSortChange(val) {
          console.log(`排序属性: ${val.prop}`);
          console.log(`排序: ${val.order}`);
          if(val.prop!=null){
              if(val.order=='descending'){
                  this.filter.sorts = '-'+val.prop;
              }
              else{
                  this.filter.sorts = ''+val.prop;
              }
          }
          else{
              this.filter.sorts = '';
          }
          this.getUsers();
      },
//    searchFieldChange(val) {
//        this.select1=placeholders[val];
//        console.log(`搜索字段： ${val} `);
//    },
      pageSizeChange(val) {
          console.log(`每页 ${val} 条`);
          this.filter.pageSize = val;
          this.getUsers();
      },
      pageCurrentChange(val) {
          console.log(`当前页: ${val}`);
          this.filter.pageIndex = val;
          this.getUsers();
      },
      showme(){
      	this.dialogCreateVisible = true;
      },
      query(){
      		this.filter.paramsMap.testId=this.keywords;
          	this.getUsers();
      },
//   	lookP(user){
//   		this.dialogBarVisible=true;
//   		this.data1=[];
//   		this.data2=[];
//   		console.log(user.optionSelectInfos,user.optionTrueInfos)
//   		if(user.optionSelectInfos==undefined){
//   			this.data1=[];
//   		}else{
//	     		for(var i=0;i<user.optionSelectInfos.length;i++){
//	     			this.data1[i]={name:user.optionSelectInfos[i].myAnswer,value:user.optionSelectInfos[i].NUM}
//	     		}
//   		}
//   		for(var i=0;i<user.optionTrueInfos.length;i++){
//   			this.data2[i]={name:user.optionTrueInfos[i].isRight,value:user.optionSelectInfos[i].NUM}
//   		}
//   	},
      //答题记录
//	record(tid,sid,cid,sname,tscore){
//		const {href}=this.$router.resolve({
//			path: '/record',
//			name: '答题记录',
//			query: {
//				testId: tid,
//				studentId:sid,
//				classId:cid,
//				studentName:sname,
//				testScore:tscore
//			}
//			})
//		window.open(href,'_blank')
//	},
  	
      // 获取用户列表
      getUsers() { 
          getQTOI(this.filter).then((response) => {
            this.users = response.data.rows;
            this.count = response.data.count;
            this.total_rows = response.data.total;
            this.selected.splice(0,this.selected.length);
          })
          .catch((response)=> {
          });
      }
  }
}
</script>
<style>
    @import '../../assets/plugins/bootstrap/css/bootstrap.min.css';
    @import '../../assets/css/global.css';
    @import '../../assets/css/main.min.css';
</style>
<style>
	.htc .el-input--suffix{
		width: 200px;
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
	.questionA img{
		width: 120px;
		height: 120px;
	}
	
</style>
