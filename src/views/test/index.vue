<template>
  <div class="expand" style="display: flex;">
    <div class="etree">
    	<div style="margin-bottom: 20px;margin-left: -72px;" v-if="teacherLevel=='1'"><span style="font-weight: bold;">选择学校:</span>
    		<el-select v-model="value" @change="schoolC(value)">
      		<el-option v-for="item in school" :value="item.schoolId" :label="item.schoolName"></el-option>
      	</el-select>
      </div>
    	<h3 v-if="teacherLevel!='1'">试卷管理</h3>
        <!--<el-button @click="handleAddTop">添加顶级节点</el-button>-->
        <el-tree ref="expandMenuList" class="expand-tree"
        v-if="isLoadingTree"
        :data="setTree"
        node-key="id"
        highlight-current
        :props="defaultProps"
        :expand-on-click-node="false"
        :render-content="renderContent"
        :default-expanded-keys="defaultExpandKeys"
        @node-click="handleNodeClick"></el-tree>
      </div>
      <div class="etreeContent" v-show="contentshow">
      	<h4>当前位置<<{{spanHtml}}</h4>
      	<button class="addTest" @click="dialogCreateVisible=true">智能组卷</button>
      	<div id="content">
      	<div class="content" v-show="contentshow2">暂无试卷...</div>
      	<div v-for="(item,index) in test" class="content" v-show="contentshow1">
      		<div style="color: #409eff;margin-top: 10px;cursor: pointer;" @click="showExaminationPaper(item.examinationPaperId)">{{item.examinationPaperName}}</div>
      		<div style="margin-top: 20px;">
      			<span>试卷类型：考试题</span>
      			<span style="margin-left: 20px;margin-right: 20px;">分数：{{item.examinationPaperScore}}分</span>
      			<svg-icon icon-class="user" style="color: orange;"/><!--<span v-html="getSharetype(item.shareType)"></span>--><span>{{item.teacherName}}</span>
      		</div>
      		<div style="margin-top: 10px;">修改时间：{{item.operatorTime | moment("YYYY-MM-DD HH:mm:ss")}}</div>
      		<div class="edit1" v-show="editshow!=index" v-on:mouseover="showChange1(index)" v-if="teacherLevel=='1'||custId==item.createUser||(custId!=item.createUser&&teacherLevel=='2')">修改<svg-icon icon-class="bottom"/></div>
      		<div class="operate" v-show="operateshow==index" v-if="teacherLevel=='1'||custId==item.createUser||(custId!=item.createUser&&teacherLevel=='2')">
      			<div @click="editt(index)">修改</div>
      			<div @click="deletet(index)">删除</div>
      			<div @click="movet(index)">移动</div>
      			<!--<div @click="sharet()">分享</div>-->
      		</div>
      	</div>
      	</div>
      		<el-pagination class="tmg"
                      :current-page="params.pageIndex"
                      :page-sizes="[5, 10, 20, 50]"
                      :page-size="params.pageSize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="total_rows"
                      @size-change="pageSizeChange"
                      @current-change="pageCurrentChange">
        	</el-pagination>
      <!-- 创建用户 begin-->
	    <el-dialog title="智能组卷" :visible.sync="dialogCreateVisible" :close-on-click-modal="true" :close-on-press-escape="true" :model="false" @close="reset">
	        <el-form id="#create" :model="create" :rules="rules" ref="create" label-width="100px">
	        	<el-form-item label="试卷名称" prop="examinationPaperName">
	        		<el-input v-model="create.examinationPaperName"></el-input>
	        	</el-form-item>
	        	<el-form-item label="答题时长" prop="answerTime">
	        		<el-input v-model="create.answerTime"></el-input>
	        	</el-form-item>	
	        	<el-form-item label="组卷数量" prop="examinationPaperNum">
			        <el-select v-model="create.examinationPaperNum">
			        	<el-option v-for="item,index in 20" :value="index+1" :label="index+1"></el-option>
			          <!--<el-option label="1" value="1"></el-option>
			          <el-option label="2" value="2"></el-option>
			          <el-option label="3" value="3"></el-option>
			          <el-option label="4" value="4"></el-option>
			          <el-option label="5" value="5"></el-option>-->
			        </el-select>
		      	</el-form-item>
		      	<el-form-item label="题目来源" prop="questionFroms" v-show="false">
			        <el-checkbox-group v-model="create.questionFroms">
			          <el-checkbox label="1" name="type">我的题库</el-checkbox>
			          <el-checkbox label="2" name="type">本校题库</el-checkbox>
			          <!--<el-checkbox label="3" name="type">共享题库</el-checkbox> -->
			        </el-checkbox-group>
		      	</el-form-item>
		      	<!--<el-form-item label="题目范围" prop="questionRange">
	    			<el-cascader
						:options="unit"
						v-model="create.questionRange"
						multiple>
					</el-cascader>
    			</el-form-item>-->
    			<el-row>
		        	<el-col :span="8">
				        <el-form-item label="题目范围" prop="courseIds" >
					        <el-select v-model="create.courseIds" multiple collapse-tags @change="changeCourse(create.courseIds)" style="width: 150%">
					          <el-option v-for="(item,index) in users" :label="item.courseName" :value="item.courseId"></el-option>
					        </el-select>
				        </el-form-item>
		     		</el-col>
		     		<el-col :span="8">
				        <el-form-item prop="unitIds">
					        <el-select v-model="create.unitIds" multiple collapse-tags @change='selectAll' style="width: 200%">
					        	<!--<el-option label="全选" value="ALL_SELECT"></el-option>-->
					          <el-option v-for="(item,index) in users1" :label="item.unitName" :value="item.unitId"></el-option>
					        </el-select>
				        </el-form-item>
		     		</el-col>
		    	</el-row>
    			<el-row>
		        	<el-col :span="14">
				        <el-form-item label="试卷结构" prop="examinationStructure">
					        <el-select v-model="create.examinationStructure" @change="showTest(create.examinationStructure)">
					          <el-option label="--自定义模板--" value="0"></el-option>
					          <el-option v-for="(item,index) in model" :label="item.modelName" :value="item.modelId"></el-option>
					        </el-select>
				        </el-form-item>
		     		</el-col>
		     		<el-col :span="10">
				        <span style="color: #409eff;line-height: 40px;cursor: pointer;" @click="dialogModelVisible=true">管理我的模板</span>
		     		</el-col>
		    	</el-row>
		     	<el-row v-for="(item,index) in create.questions" prop="questions">
		        	<el-col :span="6">
				        <el-form-item label="题型：" prop="isCreateModel">
					        <span v-html="getType(item.questionType)"></span>
				     	</el-form-item>
		     		</el-col>
		     		<el-col :span="8">
				        <el-form-item label="题目数量" prop="modelName">
					        <el-input v-model="item.questionNum"></el-input>
				     	</el-form-item>
		     		</el-col>
		     		<el-col :span="8">
				        <el-form-item label="每道题分值" prop="modelName">
					        <el-input v-model="item.questionScore"></el-input>
				     	</el-form-item>
		     		</el-col>
		     	</el-row>
		     	<el-form-item label="添加题型" prop="value">
					<el-select v-model="value" @change="addTestType(value)">
			          <el-option label="单选题" value="1"></el-option>
			          <el-option label="填空题" value="2"></el-option>
			          <el-option label="简答题" value="3"></el-option>
			          <el-option label="朗诵题" value="4"></el-option>
			        </el-select>
				</el-form-item>
		        <el-row>
		        	<el-col :span="10">
				        <el-form-item label="是否存为模板" prop="isCreateModel">
					        <el-radio-group v-model="create.isCreateModel" @change="showName(create.isCreateModel)">
					          <el-radio label="Y">是</el-radio>
					          <el-radio label="N">否</el-radio>
					        </el-radio-group>
				     	</el-form-item>
		     		</el-col>
		     		<el-col :span="10">
				        <el-form-item label="模板名称" prop="modelName" v-show="showModelName">
					        <el-input v-model="create.modelName"></el-input>
				     	</el-form-item>
		     		</el-col>
		     	</el-row>
	        </el-form>
	        <div slot="footer" class="dialog-footer">
	            <el-button @click="dialogCreateVisible = false;showModelName=false">取 消</el-button>
	            <el-button type="primary" @click="createUser">确 定</el-button>
	        </div>
	    </el-dialog>
	    <!-- 我的模板begin-->
	    <el-dialog title="我的模板" :visible.sync="dialogModelVisible" :close-on-click-modal="true" :close-on-press-escape="true" :model="false">
	        <el-table :data="model"
                              stripe
                              style="width: 100%"
                              height="470"
                              border
                              >
                        <el-table-column type="selection"
                                         width="60">
                        </el-table-column>
                       	<el-table-column 
                                         label="模板名称"
                                         width="217">
                          	<template slot-scope="scope">
					          <template v-if="scope.row.edit">
					            <el-input class="edit-input"  v-model="scope.row.modelName"></el-input>
					            <el-button class='cancel-btn' size="mini" icon="el-icon-refresh" type="warning" @click="cancelEdit(scope.row)">返回</el-button>
					          </template>
					          <span v-else>{{ scope.row.modelName }}</span>
					        </template>
				        </el-table-column> 
                        <el-table-column prop="useFrequency"
                                         label="使用次数"
                                         width="100">
                       	</el-table-column>
                       	<el-table-column prop="createTestNumber"
                                         label="生成试卷套数"
                                         width="100">
                       </el-table-column> 
                        <el-table-column
                                         label="操作"
                                         width="250">
                            <template slot-scope="scope">
                            	<el-button v-if="scope.row.edit" type="success" @click="confirmEdit(scope.row)" size="mini" icon="el-icon-circle-check-outline">Ok</el-button>
          						<el-button v-else type="primary" @click='scope.row.edit=!scope.row.edit' size="mini" icon="el-icon-edit">编辑</el-button>
                                <el-button type="danger" size="mini" @click="removeUser(scope.$index, scope.row)" icon="el-icon-delete">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
	    </el-dialog>
	    <!-- 展示试卷begin-->
	    <el-dialog title="试卷预览" :visible.sync="examinationPaperVisible" :close-on-click-modal="true" :close-on-press-escape="true" :model="false">
	    	<el-button icon="el-icon-download" @click="downloadt()">下载试卷</el-button>
	    	<div class="page-content">
	    	<div style="text-align: center;font-size: 24px;font-weight: bold;margin-bottom: 20px;">{{examinationPaper.examinationPaperName}}</div>
	    	<div style="text-align: center;font-weight: bold">该卷共四大题总分{{examinationPaper.examinationPaperScore}}分，答题时间{{examinationPaper.answerTime}}分钟</div>
	    	<div class="questionN" v-if="examination1.length!=0">
	    		<div class="questionO">一、单选题</div>
	    		<div v-for="(item,index) in examination1" class="questionP">
	    			<div v-html="index+1+'.'+item.questionStem.replace(/<p>/g,'')" class="equestion"></div>
	    			<audio
    					controls="controls"
    					preload="auto" 
    					:src="item.fileUrl" v-if="item.fileUrl!=null" class="aud">
    				</audio>	
	    			<div v-for="(item1,index) in item.options">{{item1.optionName}}.{{item1.optionValue}}</div>
	    			<div class="questionQ">正确答案：{{item.standardAnswer}}</div>
	    		</div>
	    	</div>
	    	<div class="questionN" v-if="examination2.length!=0">
	    		<div class="questionO">二、填空题</div>
	    		<div v-for="(item,index) in examination2" class="questionP">
	    			<div v-html="index+1+'.'+item.questionStem.replace(/<p>/g,'')" class="equestion"></div>
	    			<audio
    					controls="controls"
    					preload="auto" 
    					:src="item.fileUrl" v-if="item.fileUrl!=null" class="aud">
    				</audio>	
	    			<div class="questionQ">正确答案：{{item.standardAnswer}}</div>
	    		</div>
	    	</div>
	    	<div class="questionN" v-if="examination3.length!=0">
	    		<div class="questionO">三、简答题</div>
	    		<div v-for="(item,index) in examination3" class="questionP">
	    			<div v-html="index+1+'.'+item.questionStem.replace(/<p>/g,'')" class="equestion"></div>
	    			<audio
    					controls="controls"
    					preload="auto" 
    					:src="item.fileUrl" v-if="item.fileUrl!=null" class="aud">
    				</audio>	
	    			<div class="questionQ">正确答案：{{item.standardAnswer}}</div>
	    		</div>
	    	</div>
	    	<div class="questionN" v-if="examination4.length!=0">
	    		<div class="questionO">四、朗诵题</div>
	    		<div v-for="(item,index) in examination4" class="questionP">
	    			<div v-html="index+1+'.'+item.questionStem.replace(/<p>/g,'')" class="equestion"></div>
	    			<div class="questionQ">正确答案：{{item.standardAnswer}}</div>
	    		</div>
	    	</div>
	    	</div>
	    </el-dialog>
	    <!-- 修改试卷begin-->
	    <el-dialog title="试卷修改" :visible.sync="examinationEditVisible" :close-on-click-modal="true" :close-on-press-escape="true" :model="false">
	    	<el-button icon="el-icon-plus" @click="addtq()" style="position: relative;left: 77%;top: 120px;">新增试题</el-button>
	    	<div style="text-align: center;font-size: 24px;font-weight: bold;margin-bottom: 20px;">{{examinationPaper.examinationPaperName}}</div>
	    	<div style="text-align: center;font-weight: bold">该卷共四大题总分{{examinationPaper.examinationPaperScore}}分，答题时间{{examinationPaper.answerTime}}分钟</div>
	    	<div class="editquestionN" v-if="examination1.length!=0">
	    		<div class="questionO">一、单选题</div>
	    		<div v-for="(item,index) in examination1" class="questionP editquestionP">
	    			<div v-html="index+1+'.'+item.questionStem" class="equestion"></div>
	    			<audio
    					controls="controls"
    					preload="auto" 
    					:src="item.fileUrl" v-if="item.fileUrl!=null" class="aud">
    				</audio>	
	    			<div v-for="(item1,index) in item.options">{{item1.optionName}}.{{item1.optionValue}}</div>
	    			<div class="questionQ">正确答案：{{item.standardAnswer}}</div>
	    			<div class="questionR">
	    				<span style="margin-right: 25%;">分值：<button @click="addScore1(index)">+</button><input @change="updateT1(index)" style="width: 30px;text-align: center;" v-model="item.questionScore"></input><button @click="subScore1(index)">-</button>分</span>
	    				<el-button icon="el-icon-edit" @click="changetq(examinationPaper.examinationPaperId,item.questionId)">更换试题</el-button>
	    				<el-button icon="el-icon-delete" @click="deletetq(examinationPaper.examinationPaperId,item.questionId)">删除试题</el-button>
	    			</div>
	    		</div>
	    	</div>
	    	<div class="editquestionN" v-if="examination2.length!=0">
	    		<div class="questionO">二、填空题</div>
	    		<div v-for="(item,index) in examination2" class="questionP editquestionP">
	    			<div v-html="index+1+'.'+item.questionStem" class="equestion"></div>
	    			<audio
    					controls="controls"
    					preload="auto" 
    					:src="item.fileUrl" v-if="item.fileUrl!=null" class="aud">
    				</audio>	
	    			<div class="questionQ">正确答案：{{item.standardAnswer}}</div>
	    			<div class="questionR">
	    				<span style="margin-right: 25%;">分值：<button @click="addScore2(index)">+</button><input @change="updateT2(index)" style="width: 30px;text-align: center;" v-model="item.questionScore"></input><button @click="subScore2(index)">-</button>分</span>
	    				<el-button icon="el-icon-edit" @click="changetq(examinationPaper.examinationPaperId,item.questionId)">更换试题</el-button>
	    				<el-button icon="el-icon-delete" @click="deletetq(examinationPaper.examinationPaperId,item.questionId)">删除试题</el-button>
	    			</div>
	    		</div>
	    	</div>
	    	<div class="editquestionN" v-if="examination3.length!=0">
	    		<div class="questionO">三、简答题</div>
	    		<div v-for="(item,index) in examination3" class="questionP editquestionP">
	    			<div v-html="index+1+'.'+item.questionStem" class="equestion"></div>
	    			<audio
    					controls="controls"
    					preload="auto" 
    					:src="item.fileUrl" v-if="item.fileUrl!=null" class="aud">
    				</audio>	
	    			<div class="questionQ">正确答案：{{item.standardAnswer}}</div>
	    			<div class="questionR">
	    				<span style="margin-right: 25%;">分值：<button @click="addScore3(index)">+</button><input @change="updateT3(index)" style="width: 30px;text-align: center;" v-model="item.questionScore"></input><button @click="subScore3(index)">-</button>分</span>
	    				<el-button icon="el-icon-edit" @click="changetq(examinationPaper.examinationPaperId,item.questionId)">更换试题</el-button>
	    				<el-button icon="el-icon-delete" @click="deletetq(examinationPaper.examinationPaperId,item.questionId)">删除试题</el-button>
	    			</div>
	    		</div>
	    	</div>
	    	<div class="editquestionN" v-if="examination4.length!=0">
	    		<div class="questionO">四、朗诵题</div>
	    		<div v-for="(item,index) in examination4" class="questionP editquestionP">
	    			<div v-html="index+1+'.'+item.questionStem" class="equestion"></div>
	    			<div class="questionQ">正确答案：{{item.standardAnswer}}</div>
	    			<div class="questionR">
	    				<span style="margin-right: 25%;">分值：<button @click="addScore4(index)">+</button><input @change="updateT4(index)" style="width: 30px;text-align: center;" v-model="item.questionScore"></input><button @click="subScore4(index)">-</button>分</span>
	    				<el-button icon="el-icon-edit" @click="changetq(examinationPaper.examinationPaperId,item.questionId)">更换试题</el-button>
	    				<el-button icon="el-icon-delete" @click="deletetq(examinationPaper.examinationPaperId,item.questionId)">删除试题</el-button>
	    			</div>
	    		</div>
	    	</div>
	    	<div slot="footer" class="dialog-footer">
            <el-button @click="examinationEditVisible = false">取 消</el-button>
            <el-button type="primary" @click="updateSure()">确 定</el-button>
        </div>
	    </el-dialog>	
	    <!-- 更换试题begin-->
	    <el-dialog title="更换试题" :visible.sync="questionEditVisible" :close-on-click-modal="true" :close-on-press-escape="true" :model="false">
				<Questions ref="questions" :mes="message" v-on:receiveFromChild="showChildMessage($event)" />
	    	<div slot="footer" class="dialog-footer">
            <el-button @click="questionEditVisible = false">取 消</el-button>
            <el-button type="primary" @click="changeSure()">确 定</el-button>
        </div>
	    </el-dialog>
	    <!-- 增加试题begin-->
	    <el-dialog title="增加试题" :visible.sync="questionAddVisible" :close-on-click-modal="true" :close-on-press-escape="true" :model="false">
				<addQuestions ref="questions" :mes="message1" v-on:addreceiveFromChild="addshowChildMessage($event)" />
	    	<div slot="footer" class="dialog-footer">
            <el-button @click="questionAddVisible = false">取 消</el-button>
            <el-button type="primary" @click="addSure()">确 定</el-button>
        </div>
	    </el-dialog>
	    <!-- 移动节点树 begin-->
    	<el-dialog title="选择目录" :visible.sync="dialogTreeVisible" :close-on-click-modal="true" :close-on-press-escape="true">
        <el-tree ref="expandMenuList" class="expand-tree"
        v-if="isLoadingTree"
        :data="setTree"
        node-key="id"
        highlight-current
        :props="defaultProps"
        :expand-on-click-node="false"
        :render-content="renderContent"
        :default-expanded-keys="defaultExpandKeys"
        @node-click="handleNodeClick">
        </el-tree>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogShareVisible1 = false">取 消</el-button>
            <el-button type="primary" @click="mTest()">确 定</el-button>
        </div>
    	</el-dialog>
      </div>
  </div>
</template>
<!-- VUE饿了么树形控件添加增删改功能按钮 -->
<script>
import TreeRender from './tree_render'
import { selectSchool } from '@/api/manage'
import { getCourse,getUnits } from '@/api/manage'
import { getTest,deleteTest,saveTest,getExamination,saveExamination,deleteExamination,getModel,editModel,deleteModel,getModelQuestion,getExaminationPaper,deleteEPQ,updateEPQS,updateEPQ,addEPQ,moveEPF } from '@/api/test'
import { withUnit } from '@/api/tree'
import Questions from '../common/qcom/index'
import addQuestions from '../common/qcom/addindex'
import $ from './jqueryexport'
import saveAs from './fileexport'
import '../../../static/jquery.wordexport'
  export default{
    name: 'tree',
    data(){
      return{
      	custId:localStorage.getItem("custId"),
      	teacherLevel:localStorage.getItem("teacherLevel"),
      	school:[],
        isLoadingTree: false,//是否加载节点树
        setTree: [],//节点树数据
        unit:[],//单元数据
        model:[],//模板数据
        test:[],//试卷数据
        folderId:'',//节点树id
        examinationPaper:{},
        examination1:[],//单选题数据
        examination2:[],//填空题数据
        examination3:[],//简答题数据
        examination4:[],//朗诵题数据
        examinationPaperId:'',
        questionId:'',
        selectQuestionId:'',
        message:'',
        message1:'',
        value:'',
        spanHtml:'',
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        dialogCreateVisible:false,
        dialogModelVisible:false,
        showModelName:false,
        contentshow:false,
        contentshow1:false,
        contentshow2:false,
        operateshow:false,
        editshow:false,
        examinationPaperVisible:false,
        examinationEditVisible:false,
        questionEditVisible:false,
        questionAddVisible:false,
        dialogTreeVisible:false,
        defaultExpandKeys: [0],//默认展开节点列表
        create:{
        	examinationPaperName:'',//试卷名称
        	answerTime:'',//答题时长
        	examinationPaperNum:'1',//组卷数量
        	questionFroms:['1','2'],//题目来源
        	questionRange:'',//题目范围
        	examinationStructure:"0",
        	questions:[],//添加题目信息
        	isCreateModel:'',//是否加入模板
        	modelName:'',//模板名称
        	courseIds:[],
        	unitIds:[],
        },
        rules:{
              examinationPaperName: [
                  { required: true, message: '请输入试卷名称', trigger: 'blur' },
              ],
              answerTime: [
                  { required: true, message: '请输入答题时长', trigger: 'blur' },
              ],
              courseIds: [
                  { required: true, message: '请选择课程', trigger: 'change' },
              ],
              unitIds: [
              	{ required: true, message: '请选择单元', trigger: 'change' },
              ]
          },
        total_rows: 0,
        params:{
        	pageSize:5,
        	pageIndex:1,
        	paramsMap:{}
        },
        addparams:{
        	datas:{}
        },
        users: [],
        users1:[],
        oldOptions: [],
        filter: {
              pageSize: 100, // 页大小
              pageIndex: 1, // 当前页
              paramsMap:{}
          },
        filter1: {
              pageSize: 100, // 页大小
              pageIndex: 1, // 当前页
              paramsMap:{}
          }
      }
    },
    components: {
        Questions,
        addQuestions
    },
    mounted:function(){
      this.initExpand()
      this.fetchData()
//    this.getUnits()
      this.getUsers1()
      this.fetchModel()
      this.defaultExamination()
      if(this.teacherLevel=="1"){
      	this.getSch();
      }
    },
    methods: {	
    	selectAll(val) {
			const allValues = []
			// 保留所有值
			for (const item of this.users1) {
			allValues.push(item.unitId)
			}
			// 用来储存上一次的值，可以进行对比
			const oldVal = this.oldOptions.length === 1 ? this.oldOptions[0] : []
			// 若是全部选择
			if (val.includes(0)) this.create.unitIds = allValues
			
			// 取消全部选中 上次有 当前没有 表示取消全选
			if (oldVal.includes(0) && !val.includes(0)) this.create.unitIds = []
			
			// 点击非全部选中 需要排除全部选中 以及 当前点击的选项
			// 新老数据都有全部选中
			if (oldVal.includes(0) && val.includes(0)) {
			const index = val.indexOf(0)
			val.splice(index, 1) // 排除全选选项
			this.create.unitIds = val
			}
			
			// 全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
			if (!oldVal.includes(0) && !val.includes(0)) {
			if (val.length === allValues.length - 1) this.create.unitIds = [0].concat(val)
			}
			
			// 储存当前最后的结果 作为下次的老数据
			this.oldOptions[0] = this.create.unitIds
			console.log(this.create.unitIds)
			},
    	getSch(){
    		selectSchool().then((response) => {
             this.school = response.data;
           })
          .catch((response)=> {
              this.loading = false;
          });
    	},
    	schoolC(v){
    		this.schoolId=v;
    		this.defaultExamination();
    		this.fetchData()
    	},
    	defaultExamination(){//默认加载一级目录下的试卷
    		getTest(1,this.schoolId).then(response => {
      		this.contentshow=true;
      		this.params.paramsMap.folderId=response.data[0].children[0].id;
      		this.spanHtml=response.data[0].children[0].label;
      	getExamination(this.params).then(response => {
      		if(response.data.total!=0){
      			this.contentshow1=true;
      			this.contentshow2=false;
      		}else{
      			this.contentshow1=false;
      			this.contentshow2=true;
      		}
      		this.test = response.data.rows;
      		this.total_rows = response.data.total;
      		
      }).catch(() => {
              return false;
            })
      	})	
    	},
    	showExamination(s,d,n){//点击加载各目录下试题
      	this.contentshow=true;
      	this.params.paramsMap.folderId=d.id;
      	this.spanHtml=d.label;
      	getExamination(this.params).then(response => {
      		if(response.data.total!=0){
      			this.contentshow1=true;
      			this.contentshow2=false;
      		}else{
      			this.contentshow1=false;
      			this.contentshow2=true;
      		}
      		this.test = response.data.rows;
      		this.total_rows = response.data.total;
      }).catch(() => {
              return false;
            })
      },
      showChange1(index){
    		this.editshow=index;
    		this.operateshow=index;
    	},
    // 重置表单
      	reset() {
          this.$refs.create.resetFields();
          this.create.questions=[];
      	},
    // 获取用户列表
      getUsers1() {
          getCourse(this.filter).then((response) => {
              this.users = response.data.rows;
          })
          .catch((response)=> {
          });
      },
      pageSizeChange(val) {
          console.log(`每页 ${val} 条`);
          this.params.pageSize = val;
          this.getUsers();
      },
      pageCurrentChange(val) {
          console.log(`当前页: ${val}`);
          this.params.pageIndex = val;
          this.getUsers();
      },
      changeCourse(ids){
      	this.users1=[];
				getUnits(ids).then((response) => {
              for(let i in response.data){
              	this.users1.push({
              		unitId:response.data[i].unitId,
              		unitName:response.data[i].courseName+response.data[i].unitName
              	})
              }
              this.users1.unshift({
								unitId:0,
								unitName:'全选'
							})
          })
          .catch((response)=> {
          });
      },
    //获取单元信息
//    	getUnits() {
//	      	withUnit().then((response) => {  
//	      		this.unit = response.data;
//	          })
//	          .catch((response)=> {
//	            this.$message.error('错了哦，这是一条错误消息');
//	          });
//	    },
    	showName(val){
    		if(val=="Y"){
    			this.showModelName=true;
    		}else{
    			this.showModelName=false;
    		}
    	},
    // 获取用户列表
      getUsers() {
          getExamination(this.params).then((response) => {
            if(response.data.total!=0){
      			this.contentshow1=true;
      			this.contentshow2=false;
      		}else{
      			this.contentshow1=false;
      			this.contentshow2=true;
      		}
      		this.test = response.data.rows;
      		this.total_rows = response.data.total;
          })
          .catch((response)=> {
          });
      },
   	//	添加题型
   		addTestType(val){
   			this.create.questions.push({
   				questionType:parseInt(val),
   				questionNum:'',
   				questionScore:''
   			})
   		},
    // 创建试卷
      	createUser(){
      		this.$refs.create.validate((valid) => {
              if (valid) {
      		this.create.folderId=this.params.paramsMap.folderId;
      			if(this.create.questions.length==0){
      				this.$message.error('请添加题型！');
      			}else{
      				saveExamination(this.create)
                .then((response) => {
                if(response.status=='0'){
                	 this.$message.error(response.data.error.message);
                }else{
                	this.$message.success('创建试卷成功！');
	                this.dialogCreateVisible=false;
	                this.fetchModel();
	                this.getUsers();
	                this.reset();
                } 
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
      			}
            
             }
          });
      	},
      //修改模板
      cancelEdit(row) {
	      row.modelName = row.oModelName
	      row.edit = false
	      this.$message({
	        message: '已返回',
	        type: 'warning'
	      })
	    },
	    confirmEdit(row) {
	      row.edit = false
	      row.oModelName = row.modelName
	      editModel(row.modelId,row.oModelName)
                      .then((response) => {
                       this.$message({
								        message: '修改成功',
								        type: 'success'
								      })
                      this.fetchModel();
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
        }); 
	    },
      //删除模板
      removeUser(index,row){
      	deleteModel(row.modelId)
                  .then((response) => {
                  this.$message.success('成功删除了' + row.modelName + '!');
                  this.fetchModel();
              })
              .catch((response) => {
                      this.$message.error('删除失败!');
               });
      },
     
      //获取试卷信息
      	showTest(id){
      		getModelQuestion(id).then(response => {
	      		this.create.questions = response.data
	      	})
      	},
      	getType(t){
    		switch (t){
    			case 1:
    			return "单选题";
    				break;
    				case 2:
    			return "填空题";
    				break;
    				case 3:
    			return "简答题";
    				break;
    				case 4:
    			return "朗诵题";
    				break;
    			default:
    			return "综合题";
    				break;
    		}
    	},
    	getSharetype(t){
    		switch (t){
    			case 1:
    			return "个人";
    				break;
    				case 2:
    			return "指定教师";
    				break;
    				case 3:
    			return "本校教师";
    				break;
    			default:
    			return "所有教师";
    				break;
    		}
    	},
    	//展示试卷
    	showExaminationPaper(id){
    		this.examinationPaperVisible=true;
    		getExaminationPaper(id).then(response => {
    				this.examinationPaper = response.data.examinationPaper;
	      		this.examination1 = response.data.questionTypes[0].typeQuestions;
	      		this.examination2 = response.data.questionTypes[1].typeQuestions;
	      		this.examination3 = response.data.questionTypes[2].typeQuestions;
	      		this.examination4 = response.data.questionTypes[3].typeQuestions;
	      	})
    	},
    	//修改试卷
    	editt(i) {
    		this.examinationEditVisible=true;
    		this.examinationPaperId = this.test[i].examinationPaperId
    		getExaminationPaper(this.test[i].examinationPaperId).then(response => {
    				this.examinationPaper = response.data.examinationPaper;
	      		this.examination1 = response.data.questionTypes[0].typeQuestions;
	      		this.examination2 = response.data.questionTypes[1].typeQuestions;
	      		this.examination3 = response.data.questionTypes[2].typeQuestions;
	      		this.examination4 = response.data.questionTypes[3].typeQuestions;
	      	})
    	},
    	getUser1(){
    		getExaminationPaper(this.examinationPaperId).then(response => {
    				this.examinationPaper = response.data.examinationPaper;
	      		this.examination1 = response.data.questionTypes[0].typeQuestions;
	      		this.examination2 = response.data.questionTypes[1].typeQuestions;
	      		this.examination3 = response.data.questionTypes[2].typeQuestions;
	      		this.examination4 = response.data.questionTypes[3].typeQuestions;
	      	})
    	},
    	//删除试卷
      deletet(i) {
          this.$confirm('此操作将永久删除此试卷 ,是否继续?', '提示', { type: 'warning' })
              .then(() => {
              // 向请求服务端删除
              deleteExamination(this.test[i].examinationPaperId)
                  .then((response) => {
                  this.$message.success('成功删除了该试卷!');
                  this.getUsers()
              })
              .catch((response) => {
                      this.$message.error('删除失败!');
               });
          })
          .catch(() => {
              this.$message.info('已取消操作!');
          });
      },
      //移动试卷
      movet(i){
      	this.dialogTreeVisible=true;
      	this.examinationPaperId=this.test[i].examinationPaperId;
      },
      mTest(){
      	 moveEPF(this.examinationPaperId,this.folderId)
                      .then((response) => {
                      this.$message.success('移动试卷成功！');
                      this.dialogTreeVisible=false;
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
      //删除题目
      deletetq(id1,id2) {
      	this.$confirm('此操作将永久删除此题 ,是否继续?', '提示', { type: 'warning' })
              .then(() => {
              // 向请求服务端删除
              deleteEPQ(id1,id2)
                  .then((response) => {
                  this.$message.success('成功删除了该题!');
                  this.getUser1()
              })
              .catch((response) => {
                      this.$message.error('删除失败!');
               });
          })
          .catch(() => {
              this.$message.info('已取消操作!');
          });
      },
      //更换题目
      changetq(id1,id2) {
      	this.questionEditVisible=true;
      	this.message=id1;
      	this.questionId=id2;
      },
      showChildMessage(data){
      	this.selectQuestionId=data;
      },
      changeSure(){
      	this.$confirm('此操作将更换此题 ,是否继续?', '提示', { type: 'warning' })
              .then(() => {
              // 向请求服务端删除
              updateEPQ(this.message,this.questionId,this.selectQuestionId)
                  .then((response) => {
                  this.$message.success('成功更换了该题!');
                  this.questionEditVisible=false;
                  this.getUser1();
              })
              .catch((response) => {
                      this.$message.error('更换失败!');
               });
          })
          .catch(() => {
              this.$message.info('已取消操作!');
          });
      },
      //增加题目
      addtq(){
      	this.questionAddVisible=true;
      	this.message1=this.examinationPaper.examinationPaperId;
      },
      addshowChildMessage(data){
      	this.addparams.examinationPaperId=this.examinationPaper.examinationPaperId;
      	this.addparams.datas.questionId=data.id;
      	this.addparams.datas.questionScore=data.score;
      	this.addparams.datas.questionType=data.type;
      },
      addSure(){
      	addEPQ(this.addparams).then((response) => {
                  this.$message.success('成功增加了题目!');
                  this.questionAddVisible=false;
                  this.getUser1();
              })
              .catch((response) => {
                      this.$message.error('增加失败!');
              });
      },
      addScore1(i){
      	this.examination1[i].questionScore++;
      	updateEPQS(this.examinationPaperId,this.examination1[i].questionId,this.examination1[i].questionScore).then(response =>{})
      },
      addScore2(i){
      	this.examination2[i].questionScore++;
      	updateEPQS(this.examinationPaperId,this.examination2[i].questionId,this.examination2[i].questionScore).then(response =>{})
      },
      addScore3(i){
      	this.examination3[i].questionScore++;
      	updateEPQS(this.examinationPaperId,this.examination3[i].questionId,this.examination3[i].questionScore).then(response =>{})
      },
      addScore4(i){
      	this.examination4[i].questionScore++;
      	updateEPQS(this.examinationPaperId,this.examination4[i].questionId,this.examination4[i].questionScore).then(response =>{})
      },
      subScore1(i){
      	this.examination1[i].questionScore--;
      	updateEPQS(this.examinationPaperId,this.examination1[i].questionId,this.examination1[i].questionScore).then(response =>{})
      },
      subScore2(i){
      	this.examination2[i].questionScore--;
      	updateEPQS(this.examinationPaperId,this.examination2[i].questionId,this.examination2[i].questionScore).then(response =>{})
      },
      subScore3(i){
      	this.examination3[i].questionScore--;
      	updateEPQS(this.examinationPaperId,this.examination3[i].questionId,this.examination3[i].questionScore).then(response =>{})
      },
      subScore4(i){
      	this.examination4[i].questionScore--;
      	updateEPQS(this.examinationPaperId,this.examination4[i].questionId,this.examination4[i].questionScore).then(response =>{})
      },
      updateT1(i){
      	updateEPQS(this.examinationPaperId,this.examination1[i].questionId,this.examination1[i].questionScore).then(response =>{})
      },
      updateT2(i){
      	updateEPQS(this.examinationPaperId,this.examination2[i].questionId,this.examination2[i].questionScore).then(response =>{})
      },
      updateT3(i){
      	updateEPQS(this.examinationPaperId,this.examination3[i].questionId,this.examination3[i].questionScore).then(response =>{})
      },
      updateT4(i){
      	updateEPQS(this.examinationPaperId,this.examination4[i].questionId,this.examination4[i].questionScore).then(response =>{})
      },
      updateSure(){
      	this.getUsers();
      	this.$message.success('成功修改了该卷!');
      	this.examinationEditVisible=false;
      },
      downloadt(event){
      	$(".questionQ").hide();
      	$(".page-content").wordExport();
      },
    	fetchData() {
	      	getTest(1,this.schoolId).then(response => {
	      		this.setTree = response.data
	      	})
	  	},
  		fetchModel(){
  			getModel().then(response => {
	      		var items = response.data
	      		this.model = items.map(v => {
		          this.$set(v, 'edit', false) // https://vuejs.org/v2/guide/reactivity.html
		          v.oModelName = v.modelName //  will be used when user click the cancel botton
		          return v
        })
	      	})
  		},
      initExpand(){
        this.setTree.map((a) => {
          this.defaultExpandKeys.push(a.id)
        });
        this.isLoadingTree = true;
      },
      handleNodeClick(d,n,s){//点击节点
        // console.log(d,n)
        this.folderId=d.id;
        d.isEdit = false;//放弃编辑状态
      },
      renderContent(h,{node,data,store}){//加载节点
        let that = this;
        return h(TreeRender,{
          props: {
            DATA: data,
            NODE: node,
            STORE: store, 
          },
          on: {
            nodeAdd: ((s,d,n) => that.handleAdd(s,d,n)),
            nodeEdit: ((s,d,n) => that.handleEdit(s,d,n)),
            nodeDel: ((s,d,n) => that.handleDelete(s,d,n)),
            showExamination:((s,d,n) => that.showExamination(s,d,n)),
          }
        });
      },
      handleAddTop(){
        this.setTree.push({
          label: '新增节点',
          pid: '',
          isEdit: false,
          children: []
        })
      },
      handleAdd(s,d,n){//增加节点
        console.log(s,d,n)
        if(n.level >=6){
          this.$message.error("最多只支持五级！")
          return false;
        }saveTest(d.id,"新增节点").then(response => {
        	//添加数据
        	console.log(response.data)
        	d.children.push({
          label: response.data.folderName,
          
          id:response.data.folderId,
          isEdit: false,
          children: []
        });
      });
        
        //展开节点
        if(!n.expanded){
          n.expanded = true;
        }
      },
      handleEdit(s,d,n){//编辑节点
        
      },
      handleDelete(s,d,n){//删除节点
        const parent = n.parent;
  			const children = parent.data.children || parent.data;
  			const index = children.findIndex(data => data.id === d.id);
  			this.$confirm('确定要删除该节点吗？', '温馨提示', {
    		confirmButtonText: '确定',
    		cancelButtonText: '取消',
    		type: 'warning'
  			}).then(() => {
  				deleteTest(d.id).then(response => {
        	if(response.status==1){
        	children.splice(index, 1);
        }else{
        	this.$message.success("删除成功");
        }
      });
              
            }).catch(() => {
              return false;
            })

      },
    },
    
  }
</script>

<style>
.expand{
  width:100%;
  height:100%;
  overflow:hidden;
}
.etree{
  height:85%;
  padding-top:50px;
  padding-left: 100px;
  width:50%;
  max-width:400px;
  overflow-y:auto;
}
.etreeContent{
	margin-top: 40px;
	margin-left: 60px;
	position: relative;
	width: 100%;
}
#content{
	overflow: auto;
	height: 500px;
}
.addTest{
	color:white;
	background: dodgerblue;
	outline: none;
	cursor: pointer;
	width: 110px;
	height: 40px;
	position: absolute;
	right:140px;
	top: 0px;
	line-height: 38px;
	border: none;
	border-radius: 5px;
}
.content{
	color: darkgray;
	padding: 10px 20px;
	border: 1px solid darkgray;
	border-radius: 8px;
	width: 85%;
	margin-bottom: 20px;
	position: relative;
}
.operate{
	color: black;
	text-align: center;
	width: 70px;
	height: 90px;
	border: 1px solid darkgray;
	border-radius: 5px;
	position: absolute;
	right: 35px;
	top: 15px;
	z-index: 1000;
	background: white;
}
.operate div{
	cursor: pointer;
	line-height: 30px;
	width: 69px;
	height: 30px;
}
.operate :first-child,.operate :last-child{
	border-radius: 5px;
}
.operate div:hover{
	background: dodgerblue;
	color: white;
}
.edit1{
	cursor: pointer;
	font-size: 14px;
	line-height: 30px;
	color: orangered;
	text-align: center;
	width: 70px;
	height: 30px;
	border: 1px solid darkgray;
	border-radius: 5px;
	position: absolute;
	right: 35px;
	top: 15px;
}
.expand>div::-webkit-scrollbar-track{
  box-shadow: inset 0 0 6px rgba(0,0,0,.3);
  border-radius:5px;
}
.expand>div::-webkit-scrollbar-thumb{
  background-color:rgba(50, 65, 87, 0.5);
  outline:1px solid slategrey;
  border-radius:5px;
}
.expand>div::-webkit-scrollbar{
  width:10px;
}
.expand-tree{
  border:none;
  margin-top:10px;
}
.expand-tree .el-tree-node.is-current,
.expand-tree .el-tree-node:hover{
  overflow:hidden;
}
.expand-tree .is-current>.el-tree-node__content .tree-btn,
.expand-tree .el-tree-node__content:hover .tree-btn{
  display:inline-block;
}
.expand-tree .is-current>.el-tree-node__content .tree-label{
  font-weight:600;
  white-space:normal;
}
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 19px;
}
.equestion{
	line-height: 30px;
	padding: 0 20px 0 0px;
	text-indent: 0;
}
.equestion p{
	display: inline;
}
.questionN{
	padding-left: 15%;
}
.questionO{
	font-weight: bold;
	font-size: 16px;
	margin-bottom: 15px;
	margin-top: 30px;
}
.questionP{
	font-weight: bold;
	font-size: 16px;
	margin-bottom: 15px;
	margin-top: 25px;
}
.questionP div{
	font-weight: normal;
}
.questionQ{
	color: green;
	margin-top: 10px;
}
.editquestionN{
	padding-left: 5%;
	padding-right: 5%;
}
.editquestionP{
	text-indent: 20px;
	padding-top: 10px;
	border: 1px solid darkgray;
	border-radius: 10px;
}
.editquestionP .equestion{
	padding-left: 20px;
}
.questionR{
	margin-top: 10px;
	background: #eeeeee;
	width: 100%;
	height: 65px;
	line-height: 65px;
	border-radius: 10px;
}
.questionP img{
	width: 300px;
	height: 180px;
	display: block;
	margin-left: 20px;
}
.editquestionP .aud{
	margin-left: 14px;
}
.tmg{
	margin-top: 20px;
	margin-left: 9%;
}
</style>

