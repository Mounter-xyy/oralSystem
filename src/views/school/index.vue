<template>
  <div class="table-container">
    <section  class="main-content-wrapper wrapper" >
        <section id="main-content" >
            <div class="row">
                <div class="col-md-12">
                    <!-- 查询 -->
                    <ul class="btn-edit fl">
                        <li class="input-serach">
                            <el-input :placeholder="placeholder" v-model="keywords" style="width: 350px;">
                                <el-select v-model="select" @change="searchFieldChange" slot="prepend">
                                    <el-option label="学校" value="schoolName"></el-option>
                                </el-select>
                                <el-button type="danger" class="danger" slot="append" icon="el-icon-search" @click="query"></el-button>
                            </el-input>
                        </li>
                    </ul>
                    <!-- 操作 -->
                    <ul class="btn-edit fr">
                        <li >
                            <el-button type="primary" icon="el-icon-plus" @click="showme()">添加学校</el-button>
                            <el-button type="danger" icon="delete" :disabled="selected.length==0" @click="removeUsers()"  >删除</el-button>
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
                                         width="60">
                        </el-table-column>
                        <el-table-column 
                                         label="编号"
                                         width="80">
                            <template slot-scope="scope">
                            <div>{{ scope.$index+1+filter.pageSize*(filter.pageIndex-1) }}</div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="schoolCode"
                                         label="学校编码"
                                         width="200">
                        </el-table-column>
                        <el-table-column prop="schoolName"
                                         label="学校名称"
                                         width="200">
                        </el-table-column>
                       	<el-table-column prop="schoolSharePower"
                                         label="共享试卷"
                                         :formatter="showShare"
                                         width="100">
                        </el-table-column>
                        <el-table-column prop="createTime" sortable="custom" 
                                         label="注册日期">
                            <template slot-scope="scope">
                            <div>{{ scope.row.createTime | moment('YYYY年MM月DD日 HH:mm:ss')}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                         label="操作"
                                         width="250">
                            <template slot-scope="scope">
                            		<el-button type="primary" size="mini" @click="setCurrent(scope.row)">编辑</el-button>
                                <el-button type="danger" size="mini" @click="removeUser(scope.row)">删除</el-button>
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
    <el-dialog title="创建学校" :visible.sync="dialogCreateVisible" :close-on-click-modal="true" :close-on-press-escape="true" @close="reset" >
        <el-form id="#create" :model="create" ref="create" label-width="100px">
            <el-form-item label="学校编码" prop="schoolCode">
                <el-input v-model="create.schoolCode"></el-input>
            </el-form-item>
            <el-form-item label="学校名称" prop="schoolName">
                <el-input v-model="create.schoolName"></el-input>
            </el-form-item>
            <el-form-item label="共享试卷" prop="schoolSharePower">
                <el-radio-group v-model="create.schoolSharePower">
					          <el-radio label="Y">是</el-radio>
					          <el-radio label="N">否</el-radio>
					      </el-radio-group>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogCreateVisible = false">取 消</el-button>
            <el-button type="primary" :loading="createLoading" @click="createUser">确 定</el-button>
        </div>
    </el-dialog>
    <!-- 修改用户 begin-->
    <el-dialog title="修改学校信息" :visible.sync="dialogUpdateVisible"  :close-on-click-modal="false" :close-on-press-escape="false">
        <el-form id="#update" :model="update" ref="update" label-width="100px">
        	<el-form-item label="学校编码" prop="schoolCode">
                <el-input v-model="update.schoolCode" readonly></el-input>
            </el-form-item>
            <el-form-item label="学校名称" prop="schoolName">
                <el-input v-model="update.schoolName"></el-input>
            </el-form-item>
           	<el-form-item label="共享试卷" prop="schoolSharePower">
                <el-radio-group v-model="update.schoolSharePower">
					          <el-radio label="Y">是</el-radio>
					          <el-radio label="N">否</el-radio>
					      </el-radio-group>
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
import { getSchool,deleteSchool,saveSchool } from '@/api/manage'
var placeholders={"schoolName":"请输入查找学校"};
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
          users: [],
          create: {
              schoolCode: '',
              schoolName: '',
              schoolSharePower:'N',
              is_active: true
          },
          currentId:'',
          update:{
          		schoolCode: '',
              schoolName: '',
              schoolSharePower:'',
              is_active: true
          },
          filter: {
              pageSize: 5, // 页大小
              pageIndex: 1, // 当前页
              paramsMap:{teacherName:''},
              username:'',
              phone:'',
              sorts:''
          },
          total_rows: 0,
          keywords: '', //搜索框的关键字内容
          select: 'schoolName', //搜索框的搜索字段
          loading: true,
          selected: [], //已选择项
          dialogCreateVisible: false, //创建对话框的显示状态
          dialogUpdateVisible: false, //编辑对话框的显示状态
          createLoading: false,
          updateLoading: false,
          placeholder:placeholders["schoolName"]
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
          this.currentId=user.schoolId;
          this.update.schoolCode=user.schoolCode;
          this.update.schoolName=user.schoolName;
          this.update.schoolSharePower=user.schoolSharePower;
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
          this.filter.paramsMap.schoolName=this.keywords;
          this.filter[this.select]=this.keywords;
          this.getUsers();
      },
      // 获取用户列表
      getUsers() {
          this.loading = true;
          getSchool(this.filter).then((response) => {
              this.users = response.data.rows;
              this.total_rows = response.data.total;
              this.loading = false;
              this.selected.splice(0,this.selected.length);
          })
          .catch((response)=> {
//          this.$message.error(response.error.message);
            this.loading = false;
          });

      },

      // 创建用户
      createUser(){
                  this.createLoading=true;
                  saveSchool(this.create)
                      .then((response) => {
//                    this.$message.success('创建学校成功！');
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
             this.$message.success('创建学校成功！');
      },

      // 更新用户资料
      updateUser() {
          
                  this.updateLoading=true;
                  var actions = {
                      update: {method: 'patch'}
                  }
                  this.update.schoolId = this.currentId
                  saveSchool(this.update)
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
             this.$message.success('修改学校资料成功！');
      },

      // 删除单个用户
      removeUser(user) {
          this.$confirm('此操作将永久删除 ' + user.schoolName + ', 是否继续?', '提示', { type: 'warning' })
              .then(() => {
              // 向请求服务端删除
              
              deleteSchool(user.schoolId)
                  .then((response) => {
                  this.$message.success('成功删除了' + user.schoolName + '!');
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
      showShare(row,column){
      	if(row.schoolSharePower=="Y"){
      		return "是";
      	}else{
      		return "否";
      	}
      },
      //删除多个用户
      removeUsers() {
          this.$confirm('此操作将永久删除 ' + this.selected.length + ' 个, 是否继续?', '提示', { type: 'warning' })
              .then(() => {
              console.log(this.selected);
          var ids = [];
          //提取选中项的id
          $.each(this.selected,(ids, obj)=> {
                  ids.push(obj.schoolId);
              });
          // 向请求服务端删除
          deleteSchool(ids.join(","))
              .then((response) => {
              		if(response.status==1){
              			this.$message.success('删除了' + this.selected.length + '个!');
                  	this.getUsers();
              		}else{
              			this.$message.error(response.error.message);
              		}      
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
