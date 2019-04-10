<template>
  <div class="table-container">
    <section  class="main-content-wrapper wrapper" style="display: flex;">
        <section id="main-content" style="border-right: 1px solid #ebeef5; padding-right: 20px;">
            <div class="row">
                <div class="col-md-12" >
                    <!-- 查询 -->
                    <ul class="btn-edit fl">
                        <li class="input-serach">
                            <el-input :placeholder="placeholder" v-model="keywords" style="width: 300px;">
                                <el-select v-model="select" @change="searchFieldChange" slot="prepend">
                                    <el-option label="单元" value="courseName"></el-option>
                                </el-select>
                                <el-button type="danger" class="danger" slot="append" icon="el-icon-search" @click="query"></el-button>
                            </el-input>
                        </li>
                    </ul>
                    <!-- 操作 -->
                    <ul class="btn-edit fr">
                        <li >
                            <el-button type="primary" @click="showme()" v-if="teacherLevel=='1'">添加单元</el-button>
                            <el-button type="primary" icon="delete" :disabled="selected.length==0" @click="removeUsers()"  v-if="teacherLevel=='1'">删除</el-button>
                        </li>
                    </ul>
                    <!-- 用户列表-->
                    <el-table :data="users"
                              stripe
                              v-loading="loading"
                              element-loading-text="拼命加载中..."
                              style="width: 100%"
                              height="470"
                              
                              @sort-change="tableSortChange"
                              @selection-change="tableSelectionChange">
                        <el-table-column type="selection"
                                         width="140">
                        </el-table-column>
                        <el-table-column prop="courseName"
                                         label="单元名称"
                                         width="250">
                        </el-table-column>
                        <el-table-column
                                         label="操作"
                                         width="250">
                            <template slot-scope="scope">
                            		<el-button type="primary" size="mini" @click="setCurrent(scope.row)" v-if="teacherLevel=='1'">编辑</el-button>
                                <el-button type="danger" size="mini" @click="removeUser(scope.row)" v-if="teacherLevel=='1'">删除</el-button>
                                <el-button type="success" size="mini" @click="lookUser(scope.row)">详情</el-button>
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
        
        
        <section id="main-content" style="padding-left: 20px;" v-show="unitVisible">
            <div class="row">
                <div class="col-md-12">
                    <!-- 查询 -->
                    <ul class="btn-edit fl">
                        <li class="input-serach">
                            <el-input :placeholder="placeholder1" v-model="keywords" style="width: 300px;">
                                <el-select v-model="select1" @change="searchFieldChange1" slot="prepend">
                                    <el-option label="试卷" value="unitName"></el-option>
                                </el-select>
                                <el-button type="danger" class="danger" slot="append" icon="el-icon-search" @click="query1"></el-button>
                            </el-input>
                        </li>
                    </ul>
                    <!-- 操作 -->
                    <ul class="btn-edit fr">
                        <li >
                            <el-button type="primary" @click="showme1()" v-if="teacherLevel=='1'">添加试卷</el-button>
                            <el-button type="primary" icon="delete" :disabled="selected.length==0" @click="removeUsers1()" v-if="teacherLevel=='1'">删除</el-button>
                        </li>
                    </ul>
                    <!-- 用户列表-->
                    <el-table :data="users1"
                              stripe
                              v-loading="loading"
                              element-loading-text="拼命加载中..."
                              style="width: 100%"
                              height="470"
                              
                              @sort-change="tableSortChange1"
                              @selection-change="tableSelectionChange1">
                        <el-table-column type="selection"
                                         width="140">
                        </el-table-column>
                        <el-table-column prop="unitName"
                                         label="试卷名称"
                                         width="250">
                        </el-table-column>
                        <el-table-column
                                         label="操作"
                                         width="250">
                            <template slot-scope="scope">
                            		<el-button type="primary" size="mini" @click="setCurrent1(scope.row)" v-if="teacherLevel=='1'">编辑</el-button>
                                <el-button type="danger" size="mini" @click="removeUser1(scope.row)" v-if="teacherLevel=='1'">删除</el-button>
                                
                            </template>
                        </el-table-column>
                    </el-table>
                    <!--分页begin-->
                    <el-pagination class="tc mg"
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
        </section>
    </section>
		
		<!-- 创建用户 begin-->
    <el-dialog title="创建单元" :visible.sync="dialogCreateVisible" :close-on-click-modal="true" :close-on-press-escape="true" @close="reset" >
        <el-form id="#create" :model="create" ref="create" label-width="100px">
            <el-form-item label="单元名称" prop="courseName">
                <el-input v-model="create.courseName"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogCreateVisible = false">取 消</el-button>
            <el-button type="primary" :loading="createLoading" @click="createUser">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 修改用户 begin-->
    <el-dialog title="修改单元信息" :visible.sync="dialogUpdateVisible"  :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form id="#update" :model="update" ref="update" label-width="100px">
        	
            <el-form-item label="单元名称" prop="courseName">
                <el-input v-model="update.courseName"></el-input>
            </el-form-item>
           
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogUpdateVisible = false">取 消</el-button>
            <el-button type="primary" :loading="updateLoading" @click="updateUser">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 创建用户 begin-->
    <el-dialog title="创建试卷" :visible.sync="dialogCreateVisible1" :close-on-click-modal="true" :close-on-press-escape="true" @close="reset1" >
        <el-form id="#create1" :model="create1" ref="create1" label-width="100px">
            <el-form-item label="试卷名称" prop="unitName">
                <el-input v-model="create1.unitName"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogCreateVisible1 = false">取 消</el-button>
            <el-button type="primary" :loading="createLoading" @click="createUser1">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 修改用户 begin-->
    <el-dialog title="修改试卷信息" :visible.sync="dialogUpdateVisible1"  :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form id="#update1" :model="update1" ref="update1" label-width="100px">
        	
            <el-form-item label="试卷名称" prop="unitName">
                <el-input v-model="update1.unitName"></el-input>
            </el-form-item>
           
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogUpdateVisible1 = false">取 消</el-button>
            <el-button type="primary" :loading="updateLoading" @click="updateUser1">确 定</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import { getCourse,deleteCourse,saveCourse,getUnit,deleteUnit,saveUnit } from '@/api/manage'
var placeholders={"courseName":"请输入查找单元","unitName":"请输入查找试卷"};
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
          users: [],
          users1:[],
          create: {
              courseName: '',
              is_active: true
          },
          create1: {
              unitName: '',
              is_active: true
          },
          currentId:'',
          currentId1:'',
          update:{
              courseName: '',
              is_active: true
          },
          update1:{
              unitName: '',
              is_active: true
          },
          filter: {
              pageSize: 5, // 页大小
              pageIndex: 1, // 当前页
              paramsMap:{}
          },
          filter1: {
              pageSize: 5, // 页大小
              pageIndex: 1, // 当前页
              paramsMap:{}
          },
          total_rows: 0,
          total_rows1: 0,
          keywords: '', //搜索框的关键字内容
          select: 'courseName', //搜索框的搜索字段
          select1: 'unitName', //搜索框的搜索字段
          loading: true,
          selected: [], //已选择项
          dialogCreateVisible: false, //创建对话框的显示状态
          dialogUpdateVisible: false, //编辑对话框的显示状态
          dialogCreateVisible1: false, //创建对话框的显示状态
          dialogUpdateVisible1: false, //编辑对话框的显示状态
          unitVisible: true,
          createLoading: false,
          updateLoading: false,
          placeholder:placeholders["courseName"],
          placeholder1:placeholders["unitName"]
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
      setCurrent(user){
          this.currentId=user.courseId;
          this.update.courseName=user.courseName;
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
          this.filter.paramsMap.courseName=this.keywords;
          this.filter[this.select]=this.keywords;
          this.getUsers();
      },
      // 获取用户列表
      getUsers() {
          this.loading = true;
          getCourse(this.filter).then((response) => {
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
                  saveCourse(this.create)
                      .then((response) => {
                      this.$message.success('创建成功！');
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
             
      },
			//查看详情
			lookUser(user){
				this.unitVisible = true;
				this.filter1.paramsMap.courseId=user.courseId;
				getUnit(this.filter1).then((response) => {
              this.users1 = response.data.rows;
              this.total_rows1 = response.data.total;
              this.loading = false;
              this.selected.splice(0,this.selected.length);
          })
          .catch((response)=> {
              this.loading = false;
          });

			},
      // 更新用户资料
      updateUser() {
          
                  this.updateLoading=true;
                  
                  this.update.courseId = this.currentId
                  saveCourse(this.update)
                      .then((response) => {
                      this.$message.success('修改成功！');
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
             
      },

      // 删除单个用户
      removeUser(user) {
          this.$confirm('此操作将永久删除 ' + user.courseName + ', 是否继续?', '提示', { type: 'warning' })
              .then(() => {
              // 向请求服务端删除
              
              deleteCourse(user.courseId)
                  .then((response) => {
                  this.$message.success('成功删除了' + user.courseName + '!');
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
          this.$confirm('此操作将永久删除 ' + this.selected.length + ' 个, 是否继续?', '提示', { type: 'warning' })
              .then(() => {
              console.log(this.selected);
          var ids = [];
          //提取选中项的id
          $.each(this.selected,(idx, obj)=> {
                  ids.push(obj.courseId);
              });
          // 向请求服务端删除
          
          deleteCourse(ids.join(","))
              .then((response) => {
                  this.$message.success('删除了' + this.selected.length + '个!');
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
      
      
      tableSelectionChange1(val) {
          this.selected = val;
      },
      tableSortChange1(val) {
          console.log(`排序属性: ${val.prop}`);
          console.log(`排序: ${val.order}`);
          if(val.prop!=null){
              if(val.order=='descending'){
                  this.filter1.sorts = '-'+val.prop;
              }
              else{
                  this.filter1.sorts = ''+val.prop;
              }
          }
          else{
              this.filter1.sorts = '';
          }
          this.getUsers1();
      },
      searchFieldChange1(val) {
          this.placeholder=placeholders[val];
          console.log(`搜索字段： ${val} `);
      },
      pageSizeChange1(val) {
          console.log(`每页 ${val} 条`);
          this.filter1.pageSize = val;
          this.getUsers1();
      },
      pageCurrentChange1(val) {
          console.log(`当前页: ${val}`);
          this.filter1.pageIndex = val;
          this.getUsers1();
      },
      setCurrent1(user){
          this.currentId1=user.unitId;
          this.update1.unitName=user.unitName;
          this.update1.is_active=user.is_active;
          this.dialogUpdateVisible1=true;
      },
      showme1(){
      	this.dialogCreateVisible1 = true;
      },
      // 重置表单
      reset1() {
          this.$refs.create1.resetFields();
      },
      query1(){
          this.filter1.paramsMap.unitName=this.keywords;
          this.filter1[this.select]=this.keywords;
          this.getUsers1();
      },
      // 获取用户列表
      getUsers1() {
          this.loading = true;
         
          getUnit(this.filter1).then((response) => {
              this.users1 = response.data.rows;
              this.total_rows1 = response.data.total;
              this.loading = false;
              this.selected.splice(0,this.selected.length);
          })
          .catch((response)=> {
              this.loading = false;
          });

      },

      // 创建用户
      createUser1(){          
                  this.createLoading=true;
                  this.create1.courseId = this.filter1.paramsMap.courseId;
                  saveUnit(this.create1)
                      .then((response) => {
                      this.$message.success('创建成功！');
                      this.dialogCreateVisible1=false;
                      this.createLoading=false;
                      this.reset1();
                      this.getUsers1();
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
             
      },
      // 更新用户资料
      updateUser1() {
          
                  this.updateLoading=true;
                  var actions = {
                      update1: {method: 'patch'}
                  }
                  this.update1.unitId = this.currentId1
                  saveUnit(this.update1)
                      .then((response) => {
                      this.$message.success('修改成功！');
                      this.dialogUpdateVisible1=false;
                      this.updateLoading=false;
                      this.getUsers1();
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
             
      },

      // 删除单个用户
      removeUser1(user) {
          this.$confirm('此操作将永久删除 ' + user.unitName + ', 是否继续?', '提示', { type: 'warning' })
              .then(() => {
              // 向请求服务端删除
              
              deleteUnit(user.unitId)
                  .then((response) => {
                  this.$message.success('成功删除了' + user.unitName + '!');
                  this.getUsers1();
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
      removeUsers1() {
          this.$confirm('此操作将永久删除 ' + this.selected.length + ' 个, 是否继续?', '提示', { type: 'warning' })
              .then(() => {
              console.log(this.selected);
          var ids = [];
          //提取选中项的id
          $.each(this.selected,(idx, obj)=> {
                  ids.push(obj.unitId);
              });
          // 向请求服务端删除
          
          deleteUnit(ids.join(","))
              .then((response) => {
                  this.$message.success('删除了' + this.selected.length + '个!');
                  this.getUsers1();
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
