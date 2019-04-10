<template>
  <div class="table-container">
    <section  class="main-content-wrapper wrapper" >
        <section id="main-content" >
            <div class="row">
                <div class="col-md-12">
                    <!-- 查询 -->
                    <ul class="btn-edit fl">
                        <li class="input-serach htc">
                            <el-input placeholder="查找条件支持模糊匹配" v-model="searchValue" style="width: 350px;">
                                <el-select v-model="select1" slot="prepend">
                                    <el-option label="任务名称" value="testName"></el-option>
                                    <!--<el-option label="班级" value="className"></el-option> -->
                                    <el-option label="学号" value="studentCode"></el-option> 
                                    <el-option label="姓名" value="studentName"></el-option> 
                                </el-select>
                            </el-input>
                            <el-select v-model="select3" placeholder="请选择查找班级" filterable class="lookClass">
                                <el-option v-for="key in classes" :value="key.classId" :label="key.className"></el-option>
                            </el-select>
                            <el-input v-model="minScore" style="width: 240px;" placeholder="最低">
                                <el-select v-model="select2" slot="prepend">
                                    <el-option label="分数段" value="minScore"></el-option>  
                                </el-select>
                            </el-input>
                            <span>~</span>
                            <el-input style="width: 100px;position: relative;top: -2px;" v-model="maxScore" placeholder="最高"></el-input>
                            <el-button type="danger" class="danger" slot="append" icon="el-icon-search" @click="query"></el-button>
                        </li>
                        
                    </ul>
                    <!-- 操作 -->
                    <ul class="btn-edit fr">
                        <li >
                            <el-button type="primary" icon="el-icon-plus" @click="educe()">导出Excel</el-button>
                        </li>
                    </ul>
                    <!-- 用户列表-->
                    <el-table :data="users"
                              stripe
                              v-loading="loading"
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
                                         label="任务名称"
                                         >
                        </el-table-column>
                        <el-table-column prop="className"
                                         label="班级名称">
                        </el-table-column>
                        <el-table-column prop="studentCode"
                                         label="学号">
                        </el-table-column>
                        <el-table-column prop="studentName"
                                         label="学生姓名"
                                         >
                        </el-table-column>
                        <el-table-column label="批改状态">
							           	<template slot-scope="scope">
							               	<el-button type="primary" size="mini" v-if="scope.row.testStatus==2" icon="el-icon-loading">进行中</el-button>
                              <el-button type="success" size="mini" v-if="scope.row.testStatus==3" icon="el-icon-check">已完成</el-button>
							            </template> 
							          </el-table-column>
                    		<el-table-column prop="testScore"
                                         label="学生成绩">
                            <template slot-scope="scope">
								               <span v-if="scope.row.testStatus==2">目前得分：{{scope.row.testScore}}</span> 
								               <span v-if="scope.row.testStatus==3">总得分：{{scope.row.testScore}}</span> 
								            </template>     
                        </el-table-column>
                        <el-table-column label="操作" width="150">
						             	<template slot-scope="scope">               
						               <button class="myB" @click="record(scope.row.testId,scope.row.studentId,scope.row.classId,scope.row.studentName,scope.row.testScore)">答题记录</button>
						               <span v-if="scope.row.myTestStatus=='1'">未作答</span>
						            	</template>              
						           </el-table-column>
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
  </div>
</template>
<script>
import { getSS,educeS } from '@/api/test'
import { selectClass } from '@/api/manage'
export default {
  data: function() {

      var validatePass = (rule, value, callback) => {
          if (value === '') {
              callback(new Error('请再次输入密码'));
          } else if (value !== this.create.teacherPassword) {
              callback(new Error('两次输入密码不一致!'));
          } else {
              callback();
          }
      };

      return {
      		teacherLevel:localStorage.getItem('teacherLevel'),
      		schoolId:localStorage.getItem('schoolId'),
      		users:[],
      		classes:[],
          currentId:'',
          searchValue:'',
          minScore:null,
          maxScore:null,
          filter: {
              pageSize: 5, // 页大小
              pageIndex: 1, // 当前页
              paramsMap:{
              	minScore:0,
              	maxScore:200,
              },
          },
          total_rows: 0,
          keywords: '', //搜索框的关键字内容
          keywords2: '', //搜索框的关键字内容
          select1: 'testName', //搜索框的搜索字段
          select2: 'minScore', //搜索框的搜索字段
          select3: null, //搜索框的搜索字段
          loading: true,
          selected: [], //已选择项
      };
  },
  mounted: function() {
      this.getUsers();
      this.getClasses1();
  },
  methods: {
  		getClasses1(){
      	selectClass().then((response) => {
             this.classes = response.data;
           })
          .catch((response)=> {
              this.loading = false;
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
      		this.filter.paramsMap.searchType=this.select1;
      		this.filter.paramsMap.searchValue=this.searchValue;
      		this.filter.paramsMap.classId = this.select3;
      		if(this.minScore==null || this.minScore==''){
      			this.filter.paramsMap.minScore=0;	
      		}
      		if(this.maxScore==null || this.minScore==''){	
      			this.filter.paramsMap.maxScore=200;
      		}
      		else{
      			this.filter.paramsMap.minScore=parseInt(this.minScore);
          	this.filter.paramsMap.maxScore=parseInt(this.maxScore); 
      		}
          this.filter[this.select]=this.keywords;
          this.getUsers();
      },
      //导出excel
      educe(){
      	this.filter.paramsMap.searchValue=this.searchValue;
      		if(this.minScore==null || this.minScore==''){
      			this.filter.paramsMap.minScore=0;	
      	}
      		if(this.maxScore==null || this.minScore==''){	
      			this.filter.paramsMap.maxScore=200;
      	}
      		else{
      			this.filter.paramsMap.minScore=parseInt(this.minScore);
          	this.filter.paramsMap.maxScore=parseInt(this.maxScore); 
      	}
      	window.location.href=process.env.BASE_API+"/test/exportTestScoreList?searchType="+this.filter.paramsMap.searchType+"&searchValue="+this.filter.paramsMap.searchValue+"&classId="+this.select3+"&teacherLevel="+this.teacherLevel+"&schoolId="+this.schoolId+"&minScore="+this.filter.paramsMap.minScore+"&maxScore="+this.filter.paramsMap.maxScore
      },
      //答题记录
  	record(tid,sid,cid,sname,tscore){
  		const {href}=this.$router.resolve({
  			path: '/record',
  			name: '答题记录',
  			query: {
  				testId: tid,
  				studentId:sid,
  				classId:cid,
  				studentName:sname,
  				testScore:tscore
  			}
  			})
  		window.open(href,'_blank')
  	},
      // 获取用户列表
      getUsers() {
          this.loading = true; 
          getSS(this.filter).then((response) => {
            this.users = response.data.rows;
            this.total_rows = response.data.total;
            this.loading = false;
            this.selected.splice(0,this.selected.length);
          })
          .catch((response)=> {
            this.loading = false;
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
		width: 120px !important;
	}
	.lookClass .el-input--suffix{
		width: 240px !important;
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
</style>
