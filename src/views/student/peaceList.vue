<template>
	<div class="table-container">
    <section  class="main-content-wrapper wrapper" >
        <section id="main-content" >
            <div class="row">
                <div class="col-md-12">
                    <!-- 查询 -->
                    <ul class="btn-edit fl">
                        <!--<li class="input-serach">
                            <el-input :placeholder="placeholder" v-model="keywords" style="width: 300px;">
                                <el-select v-model="select" @change="searchFieldChange" slot="prepend">
                                    <el-option label="学生" value="studentName"></el-option>
                                </el-select>  
                            </el-input>
                            <el-select v-model="keywords2" @change="getClasses2(keywords2)" v-if="teacherLevel=='1'" placeholder="请选择查找学校">
			          							<el-option v-for="key in school" :value="key.schoolId" :label="key.schoolName"></el-option>
			        							</el-select>
			        							<el-select v-model="keywords3" placeholder="请选择查找班级">
			          							<el-option v-for="key in class2" :value="key.classId" :label="key.className"></el-option>
			        							</el-select>
			        							<el-button type="danger" class="danger" slot="append" icon="el-icon-search" @click="query"></el-button>
                        </li>-->
                    </ul>
                    <!-- 操作 -->
                    <ul class="btn-edit fr">
                        
                    </ul>
                    <!-- 用户列表-->
                    <el-table :data="peaceList"
                    		  :header-cell-style="{background:'#f5f7fa'}"
                              stripe
                              style="width: 100%"
                              height="470"
                              border >
                        <el-table-column type="selection">
                        </el-table-column>
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
                                         width="250">
                            <template slot-scope="scope">
                            	<el-button type="primary" size="mini" @click="peaceDetail(scope.row)">答题详情</el-button>
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
import { getPeaceList } from '@/api/student'

export default {
	data(){
		return{
			peaceList:[],
			total_rows: 0,
			time:'',
			filter:{
              pageSize: 5, // 页大小
              pageIndex: 1,// 当前页
              studentId:this.$route.query.studentId
          }
		}
	},
	 mounted: function() {
      this.getPL();
  },
	 methods: {
	 getPL(){
  		getPeaceList(this.filter).then((response) => {
             this.peaceList = response.data.rows;
             this.total_rows = response.data.total;
           })
          .catch((response)=> {
          });
  	},
  	//开始考试
//	start(id){
//		this.$router.push({
//			path:'/attention',
//			name: '注意事项',
//			query: {testId: id}
//		})
//	},
	peaceDetail(user){
		const {href}=this.$router.resolve({
  			path:'/peaceDetail',
			name:'PeaceDetail',
  			query: {unitPaperId: user.unitPaperId,studentName: this.$route.query.studentName,studentId: this.$route.query.studentId,testScore: user.score}
  			})
  		window.open(href,'_blank')
	},
  	pageSizeChange(val) {
        this.filter.pageSize = val;
        this.getPL();
    },
    pageCurrentChange(val) {
        this.filter.pageIndex = val;
        this.getPL();
    },
    },


}
</script>

<style>
    @import '../../assets/plugins/bootstrap/css/bootstrap.min.css';
    @import '../../assets/css/global.css';
    @import '../../assets/css/main.min.css';
    
</style>
<style scoped>
		.el-input--suffix{
    	width: 240px;
    }
</style>

	