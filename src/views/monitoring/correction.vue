<template>
  <div class="table-container">
    <section  class="main-content-wrapper wrapper" >
        <section id="main-content" >
            <div class="row">
                <div class="col-md-12">
                    <!-- 查询 -->
                    <ul class="btn-edit fl">
                        <!--<li class="input-serach">
                            <el-date-picker
						      v-model="keywords1"
						      type="datetime"
						      placeholder="选择开始时间"
						      >
						    </el-date-picker>
						    至
						    <el-date-picker
						      v-model="keywords2"
						      type="datetime"
						      placeholder="选择结束时间">
						    </el-date-picker>
			        		<el-button type="danger" class="danger" slot="append" icon="el-icon-search" @click="query"></el-button>
                        </li>-->
                    </ul>
                    <!-- 操作 -->
                    <ul class="btn-edit fr">
                        <el-button type="primary" class="primary" slot="append" @click="perform">执行纠错</el-button>
                    </ul>
                    <!-- 用户列表-->
                    <el-table :data="users"
                    		  :header-cell-style="{background:'#f5f7fa'}"
                              stripe
                              element-loading-text="拼命加载中..."
                              v-loading="loading"
                              style="width: 100%"
                              height="470"
                              border
                              @sort-change="tableSortChange"
                              @selection-change="tableSelectionChange">
                        <!--<el-table-column type="selection"
                                         width="60">
                        </el-table-column>-->
                       	<el-table-column prop="unitPaperName"
                                         label="任务名称">
                        </el-table-column>
                        <el-table-column prop="schoolName"
                                         label="学校名称">
                       	</el-table-column>
                       	<el-table-column prop="className"
                                         label="班级名称">
                       	</el-table-column>
                      	<el-table-column prop="studentName"
                                         label="学生姓名">
                       	</el-table-column>
                       	<el-table-column prop="score"
                                         label="错误分数">
                       	</el-table-column>
                       	<el-table-column prop="realScore"
                                         label="真实分数">
                       	</el-table-column>
                    </el-table>
                    <!--分页begin-->
                    <el-pagination class="tc mg"
                                   :current-page="filter.pageIndex"
                                   :page-sizes="[10, 20, 50, 100]"
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
import { getScoreErrorUnitTests,excuteScoreErrorUnitTests } from '@/api/manage'

export default {
  props:['msg'],
  data: function() {
      return {
          users: [], 
          filter: {
              pageSize: 10, // 页大小
              pageIndex: 1, // 当前页
          },
          loading:true,
          total_rows: 0,
      };
  },
  mounted: function() {
      this.getUsers();
  },
  methods: {
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
      searchFieldChange(val) {
          this.placeholder=placeholders[val];
          console.log(`搜索字段： ${val} `);
      },
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
      
      // 获取用户列表
      getUsers() {
      	this.loading=true;
	      getScoreErrorUnitTests(this.filter).then((response) => {
	      	this.loding=false;
          this.users = response.data.rows;
          this.total_rows = response.data.total;
          this.loading = false;
      })
      .catch((response)=> {
      });	 
      },  
      // 执行纠错
      perform(){
      	excuteScoreErrorUnitTests().then((response) => {
          if(response.status==1){
          this.$message.success('执行成功！');
        }    
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
