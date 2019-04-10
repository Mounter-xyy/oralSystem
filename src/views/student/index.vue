<template>
  <div class="table-container">
    <section  class="main-content-wrapper wrapper" >
        <section id="main-content" >
            <div class="row">
                <div class="col-md-12">
                    <!-- 查询 -->
                    <ul class="btn-edit fl">
                        <li class="input-serach">
                            <el-input :placeholder="placeholder" v-model="keywords" style="width: 180px;">
                                <el-select v-model="select" @change="searchFieldChange" slot="prepend">
                                    <el-option label="学生" value="studentName"></el-option>
                                </el-select>  
                            </el-input>
                            <el-select v-model="keywords2" @change="getClasses2(keywords2)" v-if="teacherLevel=='1'" filterable placeholder="请选择查找学校">
			          							<el-option v-for="key in school" :value="key.schoolId" :label="key.schoolName"></el-option>
			        							</el-select>
			        							<el-select v-model="keywords3" placeholder="请选择查找班级" filterable>
			          							<el-option v-for="key in class2" :value="key.classId" :label="key.className"></el-option>
			        							</el-select>
			        							<el-button type="danger" class="danger" slot="append" icon="el-icon-search" @click="query"></el-button>
                        </li>
                    </ul>
                    <!-- 操作 -->
                    <ul class="btn-edit fr">
                        <li >
                        		<el-button type="primary" icon="el-icon-search" :disabled="!keywords3" @click="detailScore()">测验成绩</el-button>
                        		<el-upload style="display: inline-block;"
                        			v-if="teacherLevel=='1'"
														  class="upload-demo"
															:data="data"
														  :action=urlS
														  :on-preview="handlePreview"
														  :on-remove="handleRemove"
														  :before-remove="beforeRemove"
														  multiple
														  :limit="3"
														  :on-exceed="handleExceed"
														  :on-success="handleSuccess"
														  :file-list="fileList">
														  <el-button type="primary" icon="el-icon-upload" v-if="teacherLevel=='1'">学生导入</el-button>
														  <!--<div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>-->
														</el-upload>
                            <el-button type="primary" icon="el-icon-download" @click="download" v-if="teacherLevel=='1'">下载模板</el-button>
                            <el-button type="primary" icon="el-icon-plus" @click="showme()" v-if="teacherLevel=='1'">添加学生</el-button>
                            <el-button type="danger" icon="delete" :disabled="selected.length==0" v-if="teacherLevel=='1'" @click="removeUsers()"  >删除</el-button>
                        </li>
                    </ul>
                    <!-- 用户列表-->
                    <el-table :data="users"
                    					:header-cell-style="{background:'#f5f7fa'}"
                              stripe
                              v-loading="loading"
                              element-loading-text="拼命加载中..."
                              style="width: 100%"
                              height="470"
                              border
                              @sort-change="tableSortChange"
                              @selection-change="tableSelectionChange">
                        <el-table-column type="selection">
                        </el-table-column>
                       <el-table-column prop="schoolId"
                        								:formatter="showSchool"
                                         label="学校">
                        </el-table-column>
                        <el-table-column prop="classId"
                        								:formatter="showClass"
                                         label="班级">
                        </el-table-column>
                       <el-table-column prop="studentCode"
                                         label="学号">
                       </el-table-column> 
                       <el-table-column prop="studentName"
                                         label="姓名">
                       </el-table-column> 
                       <el-table-column prop="studentSex"
                       									:formatter="showSex"
                                         label="性别">
                       </el-table-column> 
                        <el-table-column prop="createTime" sortable="custom" 
                                         label="注册日期">
                            <template slot-scope="scope">
                            <div>{{ scope.row.createTime | moment('YYYY年MM月DD日 HH:mm:ss')}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                         label="操作"
                                         width="350">
                            <template slot-scope="scope">
                            		<el-button type="primary" size="mini" @click="setCurrent(scope.row)" v-if="teacherLevel=='1'">编辑</el-button>
                                <el-button type="danger" size="mini" @click="removeUser(scope.row)" v-if="teacherLevel=='1'">删除</el-button>
                                <el-button type="primary" size="mini" @click="lookPeace(scope.row)">平时测验</el-button>
                                <el-button type="primary" size="mini" @click="initP(scope.row)">初始化密码</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--分页begin-->
                    <el-pagination class="tc mg"
                                   :current-page="filter.pageIndex"
                                   :page-sizes="[5, 10, 20, 50,1000]"
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
		
    <!-- 创建用户 begin-->
    <el-dialog title="创建学生" :visible.sync="dialogCreateVisible" :close-on-click-modal="true" :close-on-press-escape="true" @close="reset" >
        <el-form id="#create" :model="create" ref="create" label-width="100px">
        		<el-form-item label="学校" v-if="teacherLevel=='1'">
        			<el-select v-model="create.schoolId" @change="getClasses(create.schoolId)" filterable>
			          <el-option v-for="item in school" :value="item.schoolId" :label="item.schoolName"></el-option>
			        </el-select>
        		</el-form-item>
            <el-form-item label="班级">
              <el-select v-model="create.classId" filterable>
			          <el-option v-for="item in class3" :value="item.classId" :label="item.className"></el-option>
			        </el-select>
            </el-form-item>
            <el-form-item label="学号" prop="studentCode">
                <el-input v-model="create.studentCode"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="studentName">
                <el-input v-model="create.studentName"></el-input>
            </el-form-item>
            <el-form-item label="性别">  
							<el-select v-model="create.studentSex">
			          <el-option value="1" label="男"></el-option>
			          <el-option value="2" label="女"></el-option>
			        </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogCreateVisible = false">取 消</el-button>
            <el-button type="primary" :loading="createLoading" @click="createUser">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 修改用户 begin-->
    <el-dialog title="修改用户信息" :visible.sync="dialogUpdateVisible"  :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form id="#update" :model="update" ref="update" label-width="100px">
        	<el-form-item label="学校" v-if="teacherLevel=='1'">
        			<el-select v-model="update.schoolId" :disabled="true">
			          <el-option v-for="item in school" :value="item.schoolId" :label="item.schoolName"></el-option>
			        </el-select>
        	</el-form-item>
        	<el-form-item label="班级">
              <el-select v-model="update.classId" filterable>
			          <el-option v-for="item in class3" :value="item.classId" :label="item.className"></el-option>
			        </el-select>
            </el-form-item>
            </el-form-item>
            <el-form-item label="学号" prop="studentCode">
                <el-input v-model="update.studentCode" readonly></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="studentName">
                <el-input v-model="update.studentName"></el-input>
            </el-form-item>
            <el-form-item label="性别">  
							<el-select v-model="update.studentSex">
			          <el-option value="1" label="男"></el-option>
			          <el-option value="2" label="女"></el-option>
			        </el-select>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogUpdateVisible = false">取 消</el-button>
            <el-button type="primary" :loading="updateLoading" @click="updateUser">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import { getStudent,deleteStudent,saveStudent,selectSchool,selectClass,initPassword } from '@/api/manage'
var placeholders={"studentName":"请输入查找学生"};
function getuuid(){
    var uid = [];
    var hexDigits = "0123456789abcdefghijklmnopqrst";
    for (var i = 0; i < 32; i++) {
        uid[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    uid[6] = "4";
    uid[15] = hexDigits.substr((uid[15] & 0x3) | 0x8, 1);
    var uuid = uid.join("");
    return uuid;
}
export default {
  data: function() {
      return {
      		teacherLevel:localStorage.getItem("teacherLevel"),
      		fileList:[],
          users: [],
          school:[],
          class3:[],
          class1:[],
          class2:[],
          create: {
              schoolId: '',
              classId: '',
              studentCode:'',
              studentName:'',
              studentSex:'',
              is_active: true
          },
          currentId:'',
          update:{
          		schoolId: '',
              classId: '',
              studentCode:'',
              studentName:'',
              studentSex:'',
              is_active: true
          },
          filter: {
              pageSize: 5, // 页大小
              pageIndex: 1, // 当前页
              paramsMap:{},
              sorts:''
          },
          urlS:'',
          total_rows: 0,
          keywords: '', //搜索框的关键字内容
          keywords2: '', //搜索框的关键字内容
          keywords3: '', //搜索框的关键字内容
          select: 'studentName', //搜索框的搜索字段
          loading: true,
          selected: [], //已选择项
          dialogCreateVisible: false, //创建对话框的显示状态
          dialogUpdateVisible: false, //编辑对话框的显示状态
          createLoading: false,
          updateLoading: false,
          placeholder:placeholders["studentName"]
      };
  },
  computed:{
  	data(){
  		return{custId:localStorage.getItem("custId"),schoolId:localStorage.getItem("schoolId")}
  	}
  },
  mounted: function() {
      this.getUsers();
      this.getSchools();
      this.getClasses1();
      this.urlS=process.env.BASE_API+"/file/importStudentByExcel";
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
      setCurrent(user){
          this.currentId=user.studentId;
          this.update.schoolId=user.schoolId;
          this.getClasses(user.schoolId);
          this.update.classId=user.classId;
          this.update.studentCode=user.studentCode;
         	this.update.studentName=user.studentName;
         	this.update.studentSex=user.studentSex;
          this.update.is_active=user.is_active;
          this.dialogUpdateVisible=true;
      },
      showme(){
      	this.dialogCreateVisible = true;
      },
      // 重置表单
      reset() {
          this.$refs.create.resetFields();
      },
      query(){
          this.filter.paramsMap.studentName=this.keywords;
          if(this.keywords2!=""){
          	this.filter.paramsMap.schoolId=this.keywords2;
          }
          if(this.keywords3!=""){
          	this.filter.paramsMap.classId=this.keywords3;
          }
          this.filter.studentName='';
          this.filter[this.select]=this.keywords;
          this.getUsers();
      },
      //获取学校
      getSchools(){
      	selectSchool().then((response) => {
             this.school = response.data;
             this.schoolId = response.data[0].schoolId;
             selectClass().then((response) => {
             		this.class2 = response.data;
             		this.class3 = response.data;
	           })
	          .catch((response)=> {
	              this.loading = false;
	          });
           })
          .catch((response)=> { 
              this.loading = false;
          });
      },
      showSchool(row,column){
      	for(var i=0;i<this.school.length;i++){
	      	if(row.schoolId==this.school[i].schoolId){
	      		return this.school[i].schoolName;
	      	}
      	}
      },
      //获取班级
      getClasses1(){
      	selectClass().then((response) => {
             this.class1 = response.data;
           })
          .catch((response)=> {
              this.loading = false;
          });
      },
      getClasses2(schoolId){
      	selectClass(schoolId).then((response) => {
             this.class2 = response.data;
           })
          .catch((response)=> {
              this.loading = false;
          });
      },
      getClasses(schoolId){
      	selectClass(schoolId).then((response) => {
             this.class3 = response.data;
           })
          .catch((response)=> {
              this.loading = false;
          });
      },
      showClass(row,column){
      	for(var i=0;i<this.class1.length;i++){
	      	if(row.classId==this.class1[i].classId){
	      		return this.class1[i].className;
	      	}
      	}
      },
      //展示性别
      showSex(row,column){
      	if(row.studentSex==1){
      		return "男";
      	}else{
      		return "女";
      	}
      },
      // 获取用户列表
      getUsers() {
          this.loading = true;

          
          getStudent(this.filter).then((response) => {
              this.users = response.data.rows;
              this.total_rows = response.data.total;
              this.loading = false;
              this.selected.splice(0,this.selected.length);
          })
          .catch((response)=> {
              this.loading = false;
          });

      },

      // 创建用户
      createUser(){
                  this.createLoading=true;
                  saveStudent(this.create)
                      .then((response) => {
                      
                      this.dialogCreateVisible=false;
                      this.createLoading=false;
                      this.reset();
                      this.getUsers();
              })
              .catch((response) => {
                      var data=response.data;
                      if(data instanceof Array){
                          this.$message.error(data[0]["message"]);
                      }
                      else if(data instanceof Object){
                          this.$message.error(data["message"]);
                      }
                      this.createLoading=false;
                  });
            this.$message.success('创建学生成功！'); 
      },

      // 更新用户资料
      updateUser() {
         
                  this.updateLoading=true;
                  var actions = {
                      update: {method: 'patch'}
                  }
                  this.update.StudentId = this.currentId
                  saveStudent(this.update)
                      .then((response) => {
                      
                      this.dialogUpdateVisible=false;
                      this.updateLoading=false;
                      this.getUsers();
                      this.reset();
              })
              .catch((response) => {
                  var data=response.data;
                  console.log(data);
                  if(data instanceof Array){
                      this.$message.error(data[0]["message"]);
                  }
                  else if(data instanceof Object){
                      this.$message.error(data["message"]);
                  }
                  this.updateLoading=false;
              });
          this.$message.success('修改学生资料成功！');  
      },

      // 删除单个用户
      removeUser(user) {
          this.$confirm('此操作将永久删除学生 ' + user.studentName + ', 是否继续?', '提示', { type: 'warning' })
              .then(() => {
              // 向请求服务端删除
              
              deleteStudent(user.studentId)
                  .then((response) => {
                  this.$message.success('成功删除了学生' + user.studentName + '!');
                  this.getUsers();
              })
              .catch((response) => {
                      this.$message.error('删除失败!');
               });
          })
          .catch(() => {
              this.$message.info('已取消操作!');
          });
      },
      //删除多个用户
      removeUsers() {
          this.$confirm('此操作将永久删除 ' + this.selected.length + ' 个学生, 是否继续?', '提示', { type: 'warning' })
              .then(() => {
              console.log(this.selected);
          var ids = [];
          //提取选中项的id
          $.each(this.selected,(idx, obj)=> {
                  ids.push(obj.studentId);
              });
          // 向请求服务端删除
          
          deleteStudent(ids.join(","))
              .then((response) => {
                  this.$message.success('删除了' + this.selected.length + '个学生!');
                  this.getUsers();
          })
          .catch((response) => {
                  this.$message.error('删除失败!');
          });
      })
      .catch(() => {
          this.$Message('已取消操作!');
      });
      },
      lookPeace(user){
      	this.$router.push({
  			path:'/peaceList',
  			name:'PeaceList',
  			query: {studentId: user.studentId, studentName: user.studentName}
  		})
      },
      detailScore(){
      	this.$router.push({
  			path:'/detailScore',
  			name:'DetailScore',
  			query: {classId: this.keywords3}
  		})
      },
      //初始化密码
      initP(user){
      	 this.$confirm('此操作将初始化' + user.studentName + '的密码, 是否继续?', '提示', { type: 'warning' })
              .then(() => {
          initPassword(user.studentId)
              .then((response) => {
              		if(response.status==1){
              			 this.$message.success('初始化密码成功!');
              		}
          })
          .catch((response) => {
                  this.$message.error('初始化密码失败!');
          });
      })
      .catch(() => {
          this.$Message('已取消操作!');
      });
      },
      //下载学生模板
      download(){
      	window.location.href = process.env.BASE_API+"/file/getExcelById?type=student";
      },
      //学生导入
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      handleExceed(files, fileList) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      beforeRemove(file, fileList) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      handleSuccess(response, file, fileList){
      	this.$message.success("导入成功");
      	this.getUsers();
      }
  }
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
