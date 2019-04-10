<template>
  <div class="table-container">
    <section  class="main-content-wrapper wrapper" >
        <section id="main-content" >
            <div class="row">
                <div class="col-md-12">
                    <!-- 查询 -->
                    <ul class="btn-edit fl">
                        <li class="input-serach">
                            <el-input :placeholder="placeholder" v-model="keywords" style="width: 300px;">
                                <el-select v-model="select" @change="searchFieldChange" slot="prepend" class="el-tc">
                                    <el-option label="姓名" value="teacherName"></el-option>  
                                </el-select>
                            </el-input>
                            <el-select v-model="keywords2" filterable v-if="teacherLevel=='1'">
			          							<el-option v-for="key in school" :value="key.schoolId" :label="key.schoolName"></el-option>
			        							</el-select>
                            <el-button type="danger" class="danger" slot="append" icon="el-icon-search" @click="query"></el-button>
                        </li>
                        
                    </ul>
                    <!-- 操作 -->
                    <ul class="btn-edit fr">
                        <li >
                            <el-button type="primary" icon="el-icon-plus" @click="showme()" v-if="teacherLevel!='3'">添加教师</el-button>
                            <el-button type="danger" icon="delete" :disabled="selected.length==0" @click="removeUsers()" v-if="teacherLevel!='3'">删除</el-button>
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
                        <el-table-column type="selection"
                                         >
                        </el-table-column>
                        <el-table-column prop="schoolId"
                        								:formatter="showSchool"
                                         label="学校">
                        </el-table-column>
                        <el-table-column sortable="custom" prop="teacherCode"
                                         label="用户名">
                        </el-table-column>
                        <el-table-column prop="teacherName"
                                         label="姓名">
                        </el-table-column>
                        <el-table-column prop="teacherPhone"
                                         label="手机">
                        </el-table-column>
                        <el-table-column prop="teacherEmail"
                                         label="邮箱">
                        </el-table-column>
                        <el-table-column prop="createTime" sortable="custom" 
                                         label="注册日期">
                            <template slot-scope="scope">
                            <div>{{ scope.row.createTime | moment('YYYY年MM月DD日 HH:mm:ss')}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                         label="操作">
                            <template slot-scope="scope">
                            		<el-button type="primary" size="mini" @click="setCurrent(scope.row)" v-if="teacherLevel!='3'">编辑</el-button>
                                <el-button type="danger" size="mini" @click="removeUser(scope.row)" v-if="teacherLevel!='3'">删除</el-button>
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
		
    <!-- 创建用户 begin-->
    <el-dialog title="创建用户" :visible.sync="dialogCreateVisible" :close-on-click-modal="true" :close-on-press-escape="true" @close="reset" >
        <el-form id="#create" :model="create" :rules="rules" ref="create" label-width="100px">
        		<el-form-item label="学校" v-if="teacherLevel=='1'">
        			<el-select v-model="create.schoolId" filterable>
			          <el-option v-for="item in school" :value="item.schoolId" :label="item.schoolName"></el-option>
			        </el-select>
        		</el-form-item>
            <el-form-item label="用户名" prop="teacherCode">
                <el-input v-model="create.teacherCode"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="teacherName">
                <el-input v-model="create.teacherName"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="teacherPassword">
                <el-input v-model="create.teacherPassword" type="password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="checkpass">
                <el-input v-model="create.checkpass" type="password"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="teacherPhone">
                <el-input v-model="create.teacherPhone"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="teacherEmail">
                <el-input v-model="create.teacherEmail"></el-input>
            </el-form-item>
            <!--<el-form-item label="是否启用">
						 <el-switch on-text="" off-text="" v-model="create.is_active"></el-switch>
						 </el-form-item>-->
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogCreateVisible = false">取 消</el-button>
            <el-button type="primary" :loading="createLoading" @click="createUser">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 修改用户 begin-->
    <el-dialog title="修改用户信息" :visible.sync="dialogUpdateVisible"  :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form id="#update" :model="update" :rules="updateRules" ref="update" label-width="100px">
        	<el-form-item label="学校" v-if="teacherLevel=='1'">
        			<el-select v-model="update.schoolId" disabled>
			          <el-option v-for="item in school" :value="item.schoolId" :label="item.schoolName"></el-option>
			        </el-select>
        	</el-form-item>
        	<el-form-item label="用户名" prop="teacherCode">
                <el-input v-model="update.teacherCode" readonly></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="teacherName">
                <el-input v-model="update.teacherName"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="teacherPhone">
                <el-input v-model="update.teacherPhone"></el-input>
            </el-form-item>
            <el-form-item label="邮箱" prop="teacherEmail">
                <el-input v-model="update.teacherEmail"></el-input>
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
import { getTeacher,deleteTeacher,saveTeacher,selectSchool } from '@/api/manage'
import md5 from 'js-md5'

var placeholders={"teacherName":"请输入查找姓名"};
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
      		teacherLevel:localStorage.getItem("teacherLevel"),
          users: [],
          school:[],
          create: {
          		schoolId:'',
              teacherCode: '',
              teacherName: '',
              teacherPassword: '',
              checkpass: '',
              teacherPhone: '',
              teacherEmail: '',
              is_active: true
          },
          currentId:'',
          update:{
          		schoolId:'',
          		teacherCode: '',
              teacherName: '',
              teacherPhone: '',
              teacherEmail: '',
              is_active: true
          },
          rules: {
              teacherName: [
                  { required: true, message: '请输入姓名', trigger: 'blur' },
                  { min: 2, max: 15, message: '长度在 2 到 15 个字符'}
              ],
              teacherCode: [
                  { required: true, message: '请输入用户名', trigger: 'blur' },
                  { min: 3, max: 25, message: '长度在 3 到 25 个字符'},
                  { pattern:/^[A-Za-z0-9]+$/, message: '用户名只能为字母和数字'}
              ],
              teacherPassword: [
                  { required: true, message: '请输入密码', trigger: 'blur' },
                  { min: 6, max: 25, message: '长度在 6 到 25 个字符'}
              ],
              checkpass: [
                  { required: true, message: '请再次输入密码', trigger: 'blur' },
                  { validator: validatePass}
              ],
              teacherEmail: [
                  { type: 'email', message: '邮箱格式不正确'}
              ],
              teacherPhone:[
                  { pattern:/^1[34578]\d{9}$/, message: '请输入中国国内的手机号码'}
              ]
          },
          updateRules: {
              teacherName: [
                  { message: '请输入姓名', trigger: 'blur' },
                  { min: 2, max: 15, message: '长度在 2 到 15 个字符'}
              ],
              teacherEmail: [
                  { type: 'email', message: '邮箱格式不正确'}
              ],
              teacherPhone:[
                  { pattern:/^1[34578]\d{9}$/, message: '请输入中国国内的手机号码'}
              ]
          },
          filter: {
              pageSize: 5, // 页大小
              pageIndex: 1, // 当前页
              paramsMap:{},
              username:'',
              phone:'',
              sorts:''
          },
          total_rows: 0,
          keywords: '', //搜索框的关键字内容
          keywords2: '', //搜索框的关键字内容
          select: 'teacherName', //搜索框的搜索字段
          loading: true,
          selected: [], //已选择项
          dialogCreateVisible: false, //创建对话框的显示状态
          dialogUpdateVisible: false, //编辑对话框的显示状态
          createLoading: false,
          updateLoading: false,
          placeholder:placeholders["teacherName"]
      };
  },
  mounted: function() {
      this.getUsers();
      this.getSchools();
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
          this.currentId=user.teacherId;
          this.update.schoolId=user.schoolId;
          this.update.teacherCode=user.teacherCode;
          this.update.teacherName=user.teacherName;
          this.update.teacherPhone=user.teacherPhone;
          this.update.teacherEmail=user.teacherEmail;
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
          this.filter.paramsMap.teacherName=this.keywords;
          this.filter.paramsMap.schoolId=parseInt(this.keywords2);
          this.filter.username='';
          this.filter.phone='';
          this.filter[this.select]=this.keywords;
          this.getUsers();
      },
      //获取学校
      getSchools(){
      	selectSchool().then((response) => {
             this.school = response.data;
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
      // 获取用户列表
      getUsers() {
          this.loading = true;         
          getTeacher(this.filter).then((response) => {
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
          // 主动校验
          this.$refs.create.validate((valid) => {
              if (valid) {
                  this.createLoading=true;
                  this.create.teacherPassword=md5(this.create.teacherPassword);
                  saveTeacher(this.create)
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
              }
               this.$message.success('创建教师成功！');
          });
      },

      // 更新用户资料
      updateUser() {
          this.$refs.update.validate((valid) => {
              if (valid) {
                  this.updateLoading=true;
                  var actions = {
                      update: {method: 'patch'}
                  }
                  this.update.teacherId = this.currentId
                  saveTeacher(this.update)
                      .then((response) => {
                      
                      this.dialogUpdateVisible=false;
                      this.updateLoading=false;
                      this.getUsers();
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
              }
             this.$message.success('修改教师资料成功！');
          });
      },

      // 删除单个用户
      removeUser(user) {
          this.$confirm('此操作将永久删除用户 ' + user.teacherName + ', 是否继续?', '提示', { type: 'warning' })
              .then(() => {
              // 向请求服务端删除
              
              deleteTeacher(user.teacherId)
                  .then((response) => {
                  this.$message.success('成功删除了用户' + user.teacherName + '!');
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
          this.$confirm('此操作将永久删除 ' + this.selected.length + ' 个用户, 是否继续?', '提示', { type: 'warning' })
              .then(() => {
              console.log(this.selected);
          var ids = [];
          //提取选中项的id
          $.each(this.selected,(idx, obj)=> {
                  ids.push(obj.teacherId);
              });
          // 向请求服务端删除
          
          deleteTeacher(ids.join(","))
              .then((response) => {
                  this.$message.success('删除了' + this.selected.length + '个用户!');
                  this.getUsers();
          })
          .catch((response) => {
                  this.$message.error('删除失败!');
          });
      })
      .catch(() => {
          this.$Message('已取消操作!');
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

<style scoped>
	.el-input--suffix{
    	width: 240px;
    }
</style>
