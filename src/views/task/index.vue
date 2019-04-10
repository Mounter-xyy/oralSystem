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
                                <el-select v-model="select" @change="searchFieldChange" slot="prepend">
                                    <el-option label="任务" value="taskName"></el-option>
                                </el-select>
                                
                            </el-input>
							<el-button type="danger" class="danger" slot="append" icon="el-icon-search" @click="query"></el-button>
                        </li>
                    </ul>
                    <!-- 操作 -->
                    <ul class="btn-edit fr">
                        <li >
                            <el-button type="primary" @click="showme()">添加任务</el-button>
                            <!--<el-button type="primary" icon="delete" :disabled="selected.length==0" @click="removeUsers()"  >删除</el-button>-->
                        </li>
                    </ul>
                    <!-- 用户列表-->
                    <el-table :data="tasks"
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
                        <el-table-column prop="testName"
                                         label="考试名称"
                                         width="150">
                       </el-table-column> 
                       <el-table-column prop="testStatus"
                                         label="执行状态"
                                         width="120">
                            <template slot-scope="scope">
                            		<el-button type="danger " size="mini" v-if="scope.row.testStatus==-1" icon="el-icon-close">未执行</el-button>
                            		<el-button type="success " size="mini" v-if="scope.row.testStatus!=-1" icon="el-icon-check">已执行</el-button>
                            </template>   
                        </el-table-column>
                        <el-table-column prop="testStatus"
                                         label="任务状态"
                                         width="120">
                            <template slot-scope="scope">
  															<el-button type="warning " size="mini" v-if="scope.row.testStatus==1" icon="el-icon-close">未开始</el-button>
                                <el-button type="primary" size="mini" v-if="scope.row.testStatus==2" icon="el-icon-loading">进行中</el-button>
                                <el-button type="success" size="mini" v-if="scope.row.testStatus==3" icon="el-icon-check">已结束</el-button>
                                <el-button type="danger" size="mini" v-if="scope.row.testStatus==-1&&(scope.row.testStatus==3||new Date()>scope.row.endTime)" icon="el-icon-check">已失效</el-button>
                            </template>   
                        </el-table-column>
                        <el-table-column label="有效期">
                            <template slot-scope="scope">
                            <div>{{ scope.row.startTime | moment('YYYY年MM月DD日 HH:mm:ss')}}  至      {{ scope.row.endTime | moment('YYYY年MM月DD日 HH:mm:ss')}} </div>
                            </template>
                        </el-table-column>
                       <el-table-column prop="teacherName"
                                         label="发布者"
                                         width="100">
                       </el-table-column> 
                        <el-table-column
                                         label="操作"
                                         width="480">
                            <template slot-scope="scope">
                            	<el-button type="primary" size="mini" @click="executeTask(scope.row)" v-if="scope.row.testStatus==-1&&new Date()<scope.row.endTime">执行任务</el-button>
                            	<el-button type="primary" size="mini" @click="lookTest(scope.row)">查看考试</el-button>
                            	<el-button type="primary" size="mini" @click="setCurrent(scope.row)" v-if="scope.row.testStatus==-1">编辑考试</el-button>
                            	<el-button type="primary" size="mini" @click="setCurrent1(scope.row)" v-if="scope.row.testStatus==-1">编辑批次</el-button>
                              <el-button type="danger" size="mini" @click="removeUser(scope.row)" v-if="scope.row.testStatus==-1">删除</el-button>
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
    <el-dialog title="创建任务" :visible.sync="dialogCreateVisible" :close-on-click-modal="true" :close-on-press-escape="true" @close="reset" >
    	<el-steps :active="active" finish-status="success">
		  <el-step title="创建考试">
		  	
		  </el-step>
		  <el-step title="创建批次">
		  	
		  </el-step>
		  <el-step title="完成">
		  	
		  </el-step>
		</el-steps>
			
        <el-form id="#create" :model="create" ref="create" :rules="rules1" label-width="100px" style="margin-top: 30px;margin-left: 100px;" v-if="showindex==1">
            <el-form-item label="考试名称" prop="testName">
                <el-input v-model="create.testName" style="width: 380px;" placeholder="考试名称"></el-input>
            </el-form-item>
            <el-form-item label="考试时长" prop="testTime">
                <el-input v-model="create.testTime" style="width: 380px;" placeholder="分钟"></el-input>
            </el-form-item>
            <el-form-item label="考试分数" prop="testTotalScore" v-if="create.testTotalScore!=null">
                <el-input v-model="create.testTotalScore" style="width: 380px;" readOnly></el-input>
            </el-form-item>
            <el-form-item label="及格分数" prop="passScore" v-if="create.passScore!=null">
                <el-input v-model="create.passScore" style="width: 380px;"></el-input>
            </el-form-item>
            <!--<el-form-item label="考试次数" prop="testNum">
		        <el-radio-group v-model="create.testNum1">
		          <el-radio label="0">不限制</el-radio>
		          <el-radio label="1">最多&nbsp;&nbsp;<el-input v-model="create.testNum" :disabled="create.testNum1!=1+''" class="sinput"></el-input>&nbsp;&nbsp;次</el-radio>
		        </el-radio-group>
		     	</el-form-item>
		     	<el-form-item label="迟到时间" prop="lateTime">
			        <el-radio-group v-model="create.lateTime1">
			          <el-radio label="0">不限制</el-radio>
			          <el-radio label="1">最多&nbsp;&nbsp;<el-input v-model="create.lateTime" :disabled="create.lateTime1!=1+''" class="sinput"></el-input>&nbsp;&nbsp;分钟</el-radio>
			        </el-radio-group>
		     	</el-form-item>
		     	<el-form-item label="是否显示考试结果" prop="isShowResult">
			        <el-radio-group v-model="create.isShowResult1">
			          <el-radio label="Y">立即显示</el-radio>
			          <el-radio label="1"><el-input v-model="create.isShowResult" :disabled="create.isShowResult1!=1+''" class="sinput"></el-input>&nbsp;&nbsp;天后显示</el-radio>
			          <el-radio label="N">不显示</el-radio>
			        </el-radio-group>
		     	</el-form-item>
		     	<el-form-item label="显示范围" prop="showRange" v-if="create.isShowResult1!='N'">
			        <el-checkbox-group v-model="create.showRange">
			          <el-checkbox label="1" name="type">成绩</el-checkbox>
			          <el-checkbox label="2" name="type">答题记录</el-checkbox>
			          <el-checkbox label="3" name="type">正确答案</el-checkbox> 
			        </el-checkbox-group>
		      	</el-form-item>-->
		      	<el-form-item label="试卷" prop="examinationPaperId">
                <span style="color: #50a8fe;cursor: pointer;" @click="dialogTestVisible=true">选择试卷</span>
                <!--<span style="border: 1px solid darkgray;padding: 5px; border-radius: 3px; margin-left: 20px;">{{create.examinationPaperName}}</span>-->
            </el-form-item>
            <el-form-item label="已选择试卷" v-if="create.examinationPaperName!=''">
            		<el-input type="textarea" v-model="create.examinationPaperName" readonly></el-input>
            </el-form-item>
        </el-form>
        
        <el-form id="#create" :model="create" ref="create" label-width="100px" style="margin-top: 30px;" v-if="showindex==2">
        	<div v-for="(item,index) in params.testBatchs" style="margin-bottom: 20px;">
        		<p style="background: #f2f2f3;height: 40px;line-height: 40px;text-indent: 10px;"><span>批次{{index+1}}</span><span class="cha" @click="minus(index)" v-if="item.endTime==''">x</span></p>
        		<el-form-item label="考试时间：">
        			<el-date-picker
					      v-model="item.startTime"
					      type="datetime"
					      placeholder="选择开始时间"
					      @change="getCEndT(index)"
					      >
					    </el-date-picker>
					    至
					    <el-date-picker
					    	id="cEndtime"
					      v-model="item.endTime"
					      type="datetime"
					      placeholder="选择结束时间">
					    </el-date-picker>
					    <!--<span style="color: red;" v-show="timeCompare1[index]!=0">&nbsp;请设置同一天时间</span>-->
					    <span style="color: red;" v-show="timeCompare2[index]<new Date()">&nbsp;开始时间不能小于当前时间</span>
        		</el-form-item>	
        		<el-form-item label="考试对象：" prop="testClass" class="classes">
			        <el-select v-model="item.testClass" multiple filterable>
			          <el-option v-for="(item,index) in classes" :label="item.className" :value="item.classId"></el-option>
			        </el-select>
		        </el-form-item>
		        
		        <el-button @click="evenBatchs(index)" icon="el-icon-plus" style="margin-left: 15px;" :disabled="!(timeCompare2[index]>new Date)">保存</el-button>
        	</div>
        	<div class="addB" @click="addBatchs">添加新的批次</div>
        </el-form>
        
        <el-form id="#create" :model="create" ref="create" label-width="100px" style="margin-top: 30px;margin-left: 100px;" v-if="showindex==3">
        	<p style="color: orangered;text-indent:35%;font-size: 18px;">创建成功!!!</p>
        </el-form>
        <div slot="footer" class="dialog-footer">
        		<el-button @click="next" v-if="showindex!=3">下一步</el-button>
        		<el-button type="primary" @click="successTest" v-if="showindex==3">完成</el-button>
            <!--<el-button @click="dialogCreateVisible = false">取 消</el-button>-->
        </div>
    </el-dialog>
    
    <!-- 选择试卷 begin-->
    <el-dialog title="选择试卷" :visible.sync="dialogTestVisible"  :close-on-click-modal="false" :close-on-press-escape="false">
        <chooseTest ref="tests" v-on:receiveFromChild="showChildTest($event)"/>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogTestVisible = false">取 消</el-button>
            <el-button type="primary" @click="chooseTest">确 定</el-button>
        </div>
    </el-dialog>
    
    <!-- 查看考试 begin-->
    <el-dialog title="修改考试信息" :visible.sync="lookTestVisible"  :close-on-click-modal="false" :close-on-press-escape="false">
    	<el-form id="#update" :model="update" ref="update" label-width="100px">
       <el-form-item label="考试名称">
                <el-input v-model="update.testName" style="width: 380px;" placeholder="考试名称" readonly></el-input>
            </el-form-item>
            <el-form-item label="考试时长">
                <el-input v-model="update.testTime" style="width: 380px;" placeholder="分钟" readonly></el-input>
            </el-form-item>
            <el-form-item label="考试分数">
                <el-input v-model="update.testTotalScore" style="width: 380px;" placeholder="分" readonly></el-input>
            </el-form-item>
            <el-form-item label="及格分数">
                <el-input v-model="update.passScore" style="width: 380px;" placeholder="分" readonly></el-input>
            </el-form-item>
            <el-form-item label="考试次数">
		        <el-radio-group v-model="update.testNum1" disabled>
		          <el-radio label="0">不限制</el-radio>
		          <el-radio label="1">最多&nbsp;&nbsp;<el-input v-model="update.testNum" :disabled="update.testNum1!=1+''" class="sinput" readonly></el-input>&nbsp;&nbsp;次</el-radio>
		        </el-radio-group>
		     	</el-form-item>
		     	<el-form-item label="迟到时间">
			        <el-radio-group v-model="update.lateTime1" disabled>
			          <el-radio label="0">不限制</el-radio>
			          <el-radio label="1">最多&nbsp;&nbsp;<el-input v-model="update.lateTime" :disabled="update.lateTime1!=1+''" class="sinput" readonly></el-input>&nbsp;&nbsp;分钟</el-radio>
			        </el-radio-group>
		     	</el-form-item>
		     	<el-form-item label="是否显示考试结果">
			        <el-radio-group v-model="update.isShowResult1" disabled>
			          <el-radio label="Y">立即显示</el-radio>
			          <el-radio label="1"><el-input v-model="update.isShowResult" :disabled="update.isShowResult1!=1+''" class="sinput" readonly></el-input>&nbsp;&nbsp;天后显示</el-radio>
			          <el-radio label="N">不显示</el-radio>
			        </el-radio-group>
		     	</el-form-item>
		     	<el-form-item label="显示范围" v-if="update.isShowResult1!='N'">
			        <el-checkbox-group v-model="update.showRange" disabled>
			          <el-checkbox label="1" name="type">成绩</el-checkbox>
			          <el-checkbox label="2" name="type">答题记录</el-checkbox>
			          <el-checkbox label="3" name="type">正确答案</el-checkbox> 
			        </el-checkbox-group>
		      	</el-form-item>
		      	<el-form-item label="已选择试卷" v-if="update.examinationPaperName!=''">
            		<el-input type="textarea" v-model="update.examinationPaperName" readonly></el-input>
            </el-form-item>
         </el-form>
    </el-dialog>
    
    <!-- 编辑考试 begin-->
    <el-dialog title="修改考试信息" :visible.sync="UpdateTestVisible"  :close-on-click-modal="false" :close-on-press-escape="false">
    	<el-form id="#update" :model="update" ref="update" label-width="100px">
       <el-form-item label="考试名称">
                <el-input v-model="update.testName" style="width: 380px;" placeholder="考试名称"></el-input>
            </el-form-item>
            <el-form-item label="考试时长">
                <el-input v-model="update.testTime" style="width: 380px;" placeholder="分钟"></el-input>
            </el-form-item>
            <el-form-item label="考试分数">
                <el-input v-model="update.testTotalScore" style="width: 380px;" placeholder="分"></el-input>
            </el-form-item>
            <el-form-item label="及格分数">
                <el-input v-model="update.passScore" style="width: 380px;" placeholder="分"></el-input>
            </el-form-item>
            <el-form-item label="考试次数">
		        <el-radio-group v-model="update.testNum1">
		          <el-radio label="0">不限制</el-radio>
		          <el-radio label="1">最多&nbsp;&nbsp;<el-input v-model="update.testNum" :disabled="update.testNum1!=1+''" class="sinput"></el-input>&nbsp;&nbsp;次</el-radio>
		        </el-radio-group>
		     	</el-form-item>
		     	<el-form-item label="迟到时间">
			        <el-radio-group v-model="update.lateTime1">
			          <el-radio label="0">不限制</el-radio>
			          <el-radio label="1">最多&nbsp;&nbsp;<el-input v-model="update.lateTime" :disabled="update.lateTime1!=1+''" class="sinput"></el-input>&nbsp;&nbsp;分钟</el-radio>
			        </el-radio-group>
		     	</el-form-item>
		     	<el-form-item label="是否显示考试结果">
			        <el-radio-group v-model="update.isShowResult1">
			          <el-radio label="Y">立即显示</el-radio>
			          <el-radio label="1"><el-input v-model="update.isShowResult" :disabled="update.isShowResult1!=1+''" class="sinput"></el-input>&nbsp;&nbsp;天后显示</el-radio>
			          <el-radio label="N">不显示</el-radio>
			        </el-radio-group>
		     	</el-form-item>
		     	<el-form-item label="显示范围" v-if="update.isShowResult1!='N'">
			        <el-checkbox-group v-model="update.showRange">
			          <el-checkbox label="1" name="type">成绩</el-checkbox>
			          <el-checkbox label="2" name="type">答题记录</el-checkbox>
			          <el-checkbox label="3" name="type">正确答案</el-checkbox> 
			        </el-checkbox-group>
		      	</el-form-item>
		      	<el-form-item label="试卷">
                <span style="display: inline-block;color: #50a8fe;cursor: pointer;" @click="dialogTestVisible=true">选择试卷</span>
                <!--<span style="display: inline-block;border: 1px solid darkgray;padding: 5px; border-radius: 3px; margin-left: 20px;">{{update.examinationPaperName}}</span>-->
            </el-form-item>
            <el-form-item label="已选择试卷" v-if="update.examinationPaperName!=''">
            		<el-input type="textarea" v-model="update.examinationPaperName" readonly></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="UpdateTestVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveT">确 定</el-button>
        	</div>
    </el-dialog>
    <!-- 编辑批次 begin-->
    <el-dialog title="修改批次信息" :visible.sync="UpdateBatchVisible"  :close-on-click-modal="false" :close-on-press-escape="false">
       <el-form id="#params" :model="params" ref="params" label-width="100px">
        	<div v-for="(item,index) in params.updatetestBatchs" style="margin-bottom: 20px;">
        		<p style="background: #f2f2f3;height: 40px;line-height: 40px;text-indent: 10px;">
        			<span>批次{{index+1}}</span>
        			<span style="color: #ffd89a;" v-if="item.batchStatus==2">进行中</span>
							<span style="color: #8ebc77;" v-if="item.batchStatus==1">未开始</span>
							<span style="color: #ff828b;" v-if="item.batchStatus==3">已结束</span>
        			<span class="cha" @click="minus1(index)" v-if="item.endTime==''">x</span>
        		</p>
        		<el-form-item label="考试时间：">
        			<el-date-picker
					      v-model="item.startTime"
					      type="datetime"
					      placeholder="选择开始时间"
					      @change="getEndT(index)">
					    </el-date-picker>
					    至
					    <el-date-picker
					      v-model="item.endTime"
					      type="datetime"
					      placeholder="选择结束时间">
					    </el-date-picker>
					   <!-- <span style="color: red;" v-show="timeCompare[index]==0">&nbsp;请设置同一天时间</span>-->
					    <span style="color: red;" v-show="timeCompare3[index]<new Date()">&nbsp;开始时间不能小于当前时间</span>
        		</el-form-item>	
        		<el-form-item label="考试对象：" prop="testClass" class="classes">
			        <el-select v-model="item.testClass" multiple>
			          <el-option v-for="(item,index) in classes" :label="item.className" :value="item.classId"></el-option>
			        </el-select>
		        </el-form-item>
		        
		        <el-button @click="evenBatchs1(index)" v-if="item.batchStatus==null" icon="el-icon-plus" style="margin-left: 15px;" :disabled="!(timeCompare3[index]>new Date)">保存</el-button>
		        <el-button @click="editBatchs1(index,item.batchId)" v-if="item.batchStatus==1" icon="el-icon-plus" style="margin-left: 15px;">修改</el-button>
        	</div>
        	<div class="addB" @click="addBatchs1">添加新的批次</div>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="UpdateBatchVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveB">确 定</el-button>
        	</div>
    </el-dialog>
    
  </div>
</template>
<script>
import { getTask,deleteTask,saveTask,getCBS,getTBI,getTestBatch,saveTestBatch,eTask } from '@/api/task'
import chooseTest from '../common/tcom/index'
var placeholders={"taskName":"请输入查找任务"};
export default {
  data: function() {
      return {
          tasks: [],
          classes:[],
          testId:'',
          create: {
            testName: '',
            testTime: null,
            testTotalScore:null,
            passScore:null,
            testNum:null,
            lateTime:null,
            isShowResult:'',
            testNum1:"0",
            lateTime1:"0",
            isShowResult1:"Y",
            showRange:["1"],
            examinationPaperId:'',
            examinationPaperName:'',
            is_active: true
          },
          rules1:{
          	testName: [
                  { required: true, message: '请输入考试名称', trigger: 'blur' },
              ],
	          testTime: [
	              { required: true, message: '请输入考试时长', trigger: 'blur' },
	          ],
          },
          batchTF:false,
          testTime:null,
          params:{
          	testId:'',
          	testBatchs:[{startTime:'',endTime:'',testClass:[]}],
          	updatetestBatchs:[]
          },
          currentId:'',
          update:{
          	testName: '',
            testTime: null,
            testTotalScore:null,
            passScore:null,
            testNum:null,
            lateTime:null,
            isShowResult:'',
            testNum1:"",
            lateTime1:"",
            isShowResult1:"",
            showRange:[],
            examinationPaperId:'',
            examinationPaperName:'',
            is_active: true
          },
          filter: {
              pageSize: 5, // 页大小
              pageIndex: 1, // 当前页
              paramsMap:{folderId:1},
              sorts:''
          },
          active: 1,
          showindex:1,
          total_rows: 0,
          keywords: '', //搜索框的关键字内容
          keywords2: '', //搜索框的关键字内容
          keywords3: '', //搜索框的关键字内容
          select: 'taskName', //搜索框的搜索字段
          loading: true,
          selected: [], //已选择项
          dialogCreateVisible: false, //创建对话框的显示状态
          dialogUpdateVisible: false, //编辑对话框的显示状态
          dialogTestVisible:false,
          lookTestVisible:false,
          UpdateTestVisible:false,//修改考试显示状态
          UpdateBatchVisible:false,//修改批次显示状态
          timeCompare:[],
          timeCompare1:[],
          timeCompare2:[],
          timeCompare3:[],
          placeholder:placeholders["taskName"]
      };
  },
  components: {
        chooseTest
    },
  mounted: function() {
      this.getUsers();
      this.getClasses();
  },
  methods: {
      getClasses(){
      	getCBS().then((response) => {
              this.classes = response.data.rows;
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
//    setCurrent(user){
//        this.currentId=user.classId;
//        this.update.schoolId=user.schoolId;
//        this.getTeachers(user.schoolId);
//        this.update.classTeacher=user.classTeacher;
//       	this.update.className=user.className;
//        this.update.is_active=user.is_active;
//        this.dialogUpdateVisible=true;
//    },
      showme(){
      	this.dialogCreateVisible = true;
      	this.showindex=1;
      	this.create={
            testName: '',
            testTime: null,
            testTotalScore:null,
            passScore:null,
            testNum:null,
            lateTime:null,
            isShowResult:'',
            testNum1:"0",
            lateTime1:"0",
            isShowResult1:"Y",
            showRange:["1"],
            examinationPaperId:'',
            examinationPaperName:'',
            is_active: true
          };
      },
      // 重置表单
      reset() {
          this.$refs.create.resetFields();
      },
      query(){
          this.filter.paramsMap.testName=this.keywords;
          this.filter[this.select]=this.keywords;
          this.getUsers();
      },
      // 获取用户列表
      getUsers() {
          this.loading = true;
          getTask(this.filter).then((response) => {
              this.tasks = response.data.rows;
              this.total_rows = response.data.total;
              this.loading = false;
              this.selected.splice(0,this.selected.length);
          })
          .catch((response)=> {
              this.loading = false;
          });

      },
			showChildTest(data){
				this.create.examinationPaperId=data.ids;
				this.create.examinationPaperName=data.names;
				this.create.testTotalScore=data.score;
				this.create.passScore=data.score*0.6;
				this.update.examinationPaperId=data.ids;
				this.update.examinationPaperName=data.names;
				this.update.testTotalScore=data.score;
				this.update.passScore=data.score*0.6;
			},
			chooseTest(){
				this.dialogTestVisible=false;
			},
			//添加新的批次
			addBatchs(){
				this.params.testBatchs.push({
					startTime:'',
					endTime:'',
					testClass:[]
				})
			},
			//删除批次
			minus(index){
				this.params.testBatchs.splice(index,1);
			},
			//保存批次
			evenBatchs(index){
				let params1=this.params.testBatchs[index];
	  		params1.testId = this.params.testId;
	  		if(params1.startTime.getDate()-params1.endTime.getDate()==0){
	  		saveTestBatch(params1)
	                  .then((response) => {
	                  if(response.status=='0'){
	                  	this.$message.error(response.error.message);
	                  }else{
	                  this.$message.success('保存成功！');
	                  this.batchTF = true;
	                  } 
	          })
	      }else{
	      	this.$message.error("开始时间和结束时间必须为同一天！");
	      }
			},
			
      // 创建用户
      next() {
      	if(this.showindex==1){
      		this.$refs.create.validate((valid) => {
              if (valid) {
      		if(this.create.testNum1=="0"){
                  	this.create.testNum=0;
                  }
                  if(this.create.lateTime1=="0"){
                  	this.create.lateTime=0;
                  }
                  if(this.create.isShowResult1=="Y"){
                  	this.create.isShowResult="Y";
                  }
                  else if(this.create.isShowResult1=="N"){
                  	this.create.isShowResult="N";
                  }
                  if(this.create.examinationPaperId==''){
                  	 this.$message.error('请选择试卷！');
                  }else{
                  	 saveTask(this.create)
                      .then((response) => {
                      this.$message.success('创建任务步骤一成功！');
                      this.showindex++;
                      this.active++;
                      this.params.testId=response.data.testId;
             			 })
                  }
                   }
              })
      	}
      	else if(this.showindex==2){
      		if(this.batchTF){
      			this.$message.success('创建任务步骤二成功！');
      			this.showindex++;
      			this.active++;
      		}else{
      			this.$message.error('请保存批次！');
      		}	
      	}
        if (this.active > 2) this.active = 0;
        if (this.showindex > 3) this.showindex = 1;
      },
      //点击完成事件
      successTest(){
    		this.showindex=1;
      	this.getUsers();
      	this.$message.success('创建任务成功！');
      	this.dialogCreateVisible=false;
      	this.reset();
      },
      // 更新用户资料
      updateUser() {
                  this.updateLoading=true;
                  var actions = {
                      update: {method: 'patch'}
                  }
                  this.update.taskId = this.taskId
                  saveTask(this.update)
                      .then((response) => {
                      this.$message.success('修改成功！');
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
             
      },

      // 删除单个用户
      removeUser(user) {
          this.$confirm('此操作将永久删除 ' + user.testName + ', 是否继续?', '提示', { type: 'warning' })
              .then(() => {
              // 向请求服务端删除
              
              deleteTask(user.testId)
                  .then((response) => {
                  this.$message.success('成功删除了' + user.testName + '!');
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
      //执行任务
      executeTask(user){
      	this.$confirm('执行后将不可修改， 是否继续?', '提示', { type: 'warning' })
              .then(() => {
              this.loading = true;
              eTask(user.testId).then((response) => {
              		this.loading = false;
                  this.$message.success("执行成功！");
          				this.getUsers();
              })
              .catch(error => {
               });
          })
          .catch(() => {
              this.$message.info('已取消操作!');
          });
      },
      //查看考试
      lookTest(user){
      	this.lookTestVisible=true;
      	this.testId=user.testId;
      	getTBI(user.testId).then((response) => {       
          this.update.testName=response.data.testName;
          this.update.testTime=response.data.testTime;
          this.update.passScore=response.data.passScore;
          this.update.testTotalScore=response.data.testTotalScore;
					if(response.data.testNum==0){
						this.update.testNum1="0";
					}else{
						this.update.testNum1="1";
						this.update.testNum=response.data.testNum;
					}
					if(response.data.lateTime==0){
						this.update.lateTime1="0";
					}else{
						this.update.lateTime1="1";
						this.update.lateTime=response.data.lateTime;
					}
					if(response.data.isShowResult=="Y"){
						this.update.isShowResult1="Y";
					}else if(response.data.isShowResult=="N"){
						this.update.isShowResult1="N";
					}else{
						this.update.isShowResult1="1";
						this.update.isShowResult=response.data.isShowResult;
					}
					
          this.update.showRange=response.data.showRange.split(',');
          this.update.examinationPaperId=response.data.examinationPaperId;
          let arr=[];
          for(let i in response.data.examinationPapers){
          	arr.push(response.data.examinationPapers[i].examinationPaperName)
          }
          this.update.examinationPaperName=arr.join(',');
              })
      },
      //编辑考试
      setCurrent(user){
      	this.UpdateTestVisible=true;
      	this.testId=user.testId;
      	getTBI(user.testId).then((response) => {       
          this.update.testName=response.data.testName;
          this.update.testTime=response.data.testTime;
          this.update.passScore=response.data.passScore;
          this.update.testTotalScore=response.data.testTotalScore;
					if(response.data.testNum==0){
						this.update.testNum1="0";
					}else{
						this.update.testNum1="1";
						this.update.testNum=response.data.testNum;
					}
					if(response.data.lateTime==0){
						this.update.lateTime1="0";
					}else{
						this.update.lateTime1="1";
						this.update.lateTime=response.data.lateTime;
					}
					if(response.data.isShowResult=="Y"){
						this.update.isShowResult1="Y";
					}else if(response.data.isShowResult=="N"){
						this.update.isShowResult1="N";
					}else{
						this.update.isShowResult1="1";
						this.update.isShowResult=response.data.isShowResult;
					}
					
          this.update.showRange=response.data.showRange.split(',');
          this.update.examinationPaperId=response.data.examinationPaperId;
          let arr=[];
          for(let i in response.data.examinationPapers){
          	arr.push(response.data.examinationPapers[i].examinationPaperName)
          }
          this.update.examinationPaperName=arr.join(',');
              })
      },
      //保存考试修改
      saveT(){
      	this.update.testId=this.testId;
      	if(this.update.testNum1=="0"){
	      	this.update.testNum=0;
	      }
	      if(this.update.lateTime1=="0"){
	      	this.update.lateTime=0;
	      }
	      if(this.update.isShowResult1=="Y"){
	      	this.update.isShowResult="Y";
	      }
	      else if(this.update.isShowResult1=="N"){
	      	this.update.isShowResult="N";
	      }
      	saveTask(this.update)
                      .then((response) => {
                      this.$message.success('修改成功！');
                      this.UpdateTestVisible=false;
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
      });
      },
      //编辑批次
      setCurrent1(user){
      	this.UpdateBatchVisible=true;
      	this.params.testId=user.testId;
      	getTestBatch(user.testId).then((response) => {
             this.params.updatetestBatchs=response.data.testBatchs;
             this.testTime=response.data.test.testTime;
             for(var i=0;i<response.data.testBatchs.length;i++){
             	this.params.updatetestBatchs[i].testClass=response.data.testBatchs[i].testClass.split(',').map(Number);
             	this.params.updatetestBatchs[i].startTime = new Date(response.data.testBatchs[i].startTime);
             	this.params.updatetestBatchs[i].endTime = new Date(response.data.testBatchs[i].endTime);
             }
             console.log(this.params.updatetestBatchs)
          })
      },
      addBatchs1(){
				this.params.updatetestBatchs.push({
					startTime:'',
					endTime:'',
					testClass:[]
				})
			},
			getEndT(index){
				this.params.updatetestBatchs[index].endTime=this.params.updatetestBatchs[index].startTime.getTime()+this.testTime*60*1000;
//				this.timeCompare[index]=this.params.updatetestBatchs[index].startTime-this.params.updatetestBatchs[index].endTime;
				this.timeCompare3[index]=this.params.updatetestBatchs[index].startTime;
				
			},
			getCEndT(index){
				this.params.testBatchs[index].endTime=new Date(this.params.testBatchs[index].startTime.getTime()+this.create.testTime*60*1000);
//				this.timeCompare1[index]=this.params.testBatchs[index].startTime-this.params.testBatchs[index].endTime;
				this.timeCompare2[index]=this.params.testBatchs[index].startTime;			
			},
			minus1(index){
				this.params.updatetestBatchs.splice(index,1);
			},
			evenBatchs1(index){
				let params2=this.params.updatetestBatchs[index];
	  		params2.testId = this.params.testId;
	  		if(params2.startTime.getDate()-params2.endTime.getDate()==0){
	  			saveTestBatch(params2)
	                  .then((response) => {
	                  if(response.status=='0'){
	                  	this.$message.error(response.error.message);
	                  }else{
	                  this.$message.success('保存成功！');
	                  this.getUsers();
	                  } 
	          }).catch((response)=> {
              
          });
	  		}else{
	  			this.$message.error("开始时间和结束时间必须为同一天！");
	  		}	
			},
			//修改批次
			editBatchs1(index,id){
				let params2=this.params.updatetestBatchs[index];
	  		params2.testId = this.params.testId;
	  		params2.testStudent=[];
	  		params2.batchId = id;
	  		if(params2.startTime.getDate()-params2.endTime.getDate()==0){
	  		saveTestBatch(params2)
	                  .then((response) => {
	                  this.$message.success('修改成功！');
	                  this.getUsers();
	          })
	      	}else{
	  			this.$message.error("开始时间和结束时间必须为同一天！");
	  		}	
			},
			saveB(){
				this.$message.success('修改批次信息成功！');
				this.UpdateBatchVisible=false;
			}
	}
}
</script>
<style>
    @import '../../assets/plugins/bootstrap/css/bootstrap.min.css';
    @import '../../assets/css/global.css';
    @import '../../assets/css/main.min.css';
    .sinput{
    	width: 60px;
    }
    .classes .el-select input{
    	width: 250px;
    }
    .cha{
    	float: right;
    	margin-right: 10px;
    	color: red;
    	font-size: 18px;
    	cursor: pointer;
    }
    .addB{
    	cursor: pointer;
    	color: #50a8fe;
    	margin-top: 20px;
    }
</style>
