<template>
  <div class="expand" style="display: flex;">
    <div class="etree">
    		<div style="margin-bottom: 20px;margin-left: -72px;" v-if="teacherLevel=='1'"><span style="font-weight: bold;">选择学校:</span>
    		<el-select v-model="value" @change="schoolC(value)">
      		<el-option v-for="item in school" :value="item.schoolId" :label="item.schoolName"></el-option>
      	</el-select>
      	</div>
    		<h3 v-if="teacherLevel!='1'">题库管理</h3>
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
      	<div class="ope">
      	<el-upload style="display: inline-block;"
      												:data="data"
														  class="upload-demo"
														  :action=urlQ
														  :on-preview="handlePreview1"
														  :on-remove="handleRemove1"
														  :before-remove="beforeRemove1"
														  multiple
														  :limit="3"
														  :on-exceed="handleExceed1"
														  :on-success="handleSuccess1"
														  :file-list="fileList1">
			<el-button type="primary" icon="el-icon-upload" v-if="teacherLevel=='1'">试题导入</el-button>
			</el-upload>
      <el-button type="primary" icon="el-icon-download" @click="downloadQ" v-if="teacherLevel=='1'">下载模板</el-button>
      	<el-select placeholder="添加" class="addQuestion" v-model="value1" v-if="teacherLevel=='1'">
      		<el-option label="单选题" value="1" @click.native="addq(value1)"></el-option>
      		<el-option label="填空题" value="2" @click.native="addq(value1)"></el-option>
      		<el-option label="简答题" value="3" @click.native="addq(value1)"></el-option>
      		<el-option label="朗诵题" value="4" @click.native="addq(value1)"></el-option>
      	</el-select>
      	</div>
      	<div id="content">
      	<div class="content" v-show="contentshow2">暂无试题...</div>
      	<div v-for="(item,index) in question" class="content" v-show="contentshow1">
      		编号：{{item.questions[0].questionId}}
      		<span style="margin-left: 15px;" v-html="getType(item.groupType)"></span>
      		<span style="margin-left: 15px;margin-right: 15px;">{{item.totalScore}}分</span>
      		难度：<star :size="48" :score="item.degreeDifficulty" style="display: inline;margin-right: 15px;position: relative;top: 3px;"></star>
      		<svg-icon icon-class="user" style="color: orange;"/><!--<span v-html="getSharetype(item.shareType)"></span>--><span>{{item.teacherName}}</span>
      		<div class="qui" style="margin-top: 10px;margin-bottom: 10px;width: 80%;" v-html="item.questions[0].questionStem"></div>
      		<audio
    					controls="controls"
    					preload="auto" 
    					:src="item.questions[0].fileUrl" v-if="item.questions[0].fileUrl!=null&&item.questions[0].fileUrl!=''" style="margin-left: -10px;">
    			</audio>	
      		<div v-for="item1 in item.questions[0].options" v-show="item.optionShow1">{{item1.optionName}}:{{item1.optionValue}}</div>
      		<div style="margin-top: 10px;margin-bottom: 5px;">正确答案：{{item.questions[0].standardAnswer}}</div>
      		<div style="margin-bottom: 5px;">正确解析：{{item.questions[0].problemSolvingAnalysis}}</div>
      		<div style="margin-bottom: 5px;">修改时间：{{item.operatorTime | moment("YYYY-MM-DD HH:mm:ss")}}</div>
      		<div class="edit1" v-show="editshow!=index" v-on:mouseover="showChange1(index)" v-if="teacherLevel=='1'">修改<svg-icon icon-class="bottom"/></div>
      		<div class="operate" v-show="operateshow==index" v-if="teacherLevel=='1'">
      			<div @click="editq(index)">修改</div>
      			<div @click="deleteq(index)">删除</div>
      			<div @click="moveq(index)">移动</div>
      			<!--<div @click="shareq()">分享</div>-->
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
      </div>
      <!-- 创建用户 begin-->
	    <el-dialog title="创建题目" :visible.sync="dialogCreateVisible" :close-on-click-modal="true" :close-on-press-escape="true" :model="false" @close="reset">
	        <el-form id="#create" :model="create" ref="create" label-width="100px">
	        		<el-form-item label="题干" prop="questionStem">
	        			<quill-editor 
	        				    :options="editorOption"
	        						:content="create.questionStem"
					            ref="myQuillEditor1"
					            class="editer"
					            @change="createE($event)">
					      </quill-editor>
					      <input style="display: none" id="uniqueId1" type="file" name="avator" multiple accept="image/jpg,image/jpeg,image/png,image/gif" @change="uploadImg(1)">
	        		</el-form-item>
	        		<el-form-item label="选择录音">
	        		<div class="upload">
						    <div class="oss_file">
						      <input type="file" :id="id1" @change="doUpload1"/>
						    </div>
						    <span>上传进度：</span><el-progress :text-inside="true" :stroke-width="15" :percentage="percentage1" style="width: 200px;display: inline-block;"></el-progress>
						  </div>
						  </el-form-item>
	        		<el-form-item label="选项A" prop="options[0].optionValue" v-show="optionShow">
	        			<el-input type="textarea" v-model="create.options[0].optionValue"></el-input>
	        		</el-form-item>
	        		<el-form-item label="选项B" prop="options[1].optionValue" v-show="optionShow">
	        			<el-input type="textarea" v-model="create.options[1].optionValue"></el-input>
	        		</el-form-item>
	        		<el-form-item label="选项C" prop="options[2].optionValue" v-show="optionShow">
	        			<el-input type="textarea" v-model="create.options[2].optionValue"></el-input>
	        		</el-form-item>
	        		<el-form-item label="选项D" prop="options[3].optionValue" v-show="optionShow">
	        			<el-input type="textarea" v-model="create.options[3].optionValue"></el-input>
	        		</el-form-item>
	        		<el-form-item label="正确答案" prop="standardAnswer" v-show="answerShow1">
				        <el-radio-group v-model="create.standardAnswer">
				          <el-radio label="A"></el-radio>
				          <el-radio label="B"></el-radio>
				          <el-radio label="C"></el-radio>
				          <el-radio label="D"></el-radio>
				        </el-radio-group>
				      </el-form-item>
				      <el-form-item label="正确答案" v-show="answerShow2">
				      	<el-input type="textarea" v-model="create.standardAnswer"></el-input>
				      </el-form-item>
				      <el-form-item label="解析" prop="problemSolvingAnalysis">
	        			<el-input v-model="create.problemSolvingAnalysis"></el-input>
	        		</el-form-item>
	        		<el-row>
	        			<el-col :span="6">
	        				<el-form-item label="分值" prop="questionScore">
			        			<el-input v-model="create.questionScore"></el-input>
			        		</el-form-item>
			        	</el-col>
			        	<el-col :span="8">
	        		 		<el-form-item label="难度" prop="degreeDifficulty">
						        <el-select placeholder="选择难度" v-model="create.degreeDifficulty">
						          <el-option label="简单" value="1"></el-option>
						          <el-option label="一般" value="2"></el-option>
						          <el-option label="中等" value="3"></el-option>
						          <el-option label="较难" value="4"></el-option>
						          <el-option label="困难" value="5"></el-option>
						        </el-select>
						      </el-form-item>
			        	</el-col>
			        	<el-col :span="8">
	        		 		<el-form-item label="共享" prop="shareType">
						        <el-select placeholder="选择共享" v-model="create.shareType" @change="share1(create.shareType)">
						          <el-option label="个人" value="1"></el-option>
						          <el-option label="指定教师" value="2"></el-option>
						          <el-option label="本校教师" value="3"></el-option>
						          <el-option label="所有教师" value="4"></el-option>
						        </el-select>
						      </el-form-item>
			        	</el-col>
	        		</el-row>
	        		<el-form-item label="关联单元" prop="units">
	        			<el-cascader
							    :options="unit"
							    v-model="create.units">
							  </el-cascader>
	        		</el-form-item>	
	        		<el-form-item label="标签" prop="questionLabel">
	        			<el-input placeholder="最多选择三个，多个之间以逗号隔开" v-model="create.questionLabel"></el-input>
	        		</el-form-item>
	        </el-form>
	        <div slot="footer" class="dialog-footer">
	            <el-button @click="dialogCreateVisible = false">取 消</el-button>
	            <el-button type="primary" @click="createUser">确 定</el-button>
	        </div>
	    </el-dialog>
	    <!-- 修改用户 begin-->
	    <el-dialog title="修改题目信息" :visible.sync="dialogUpdateVisible"  :close-on-click-modal="false" :close-on-press-escape="false">
	        <el-form id="#update"  ref="update" label-width="100px">
	        	<el-form-item label="题干">
	        			<quill-editor 
	        				    :options="editorOption"
	        						:content="update.questionStem"
					            ref="myQuillEditor2"
					            class="editer"
					            @change="updateE($event)">
					      </quill-editor>
					      <input style="display: none" id="uniqueId2" type="file" name="avator" multiple accept="image/jpg,image/jpeg,image/png,image/gif" @change="uploadImg(2)">
	        		</el-form-item>
	        		<el-form-item label="选择录音">
	        		<div class="upload">
						    <div class="oss_file">
						      <input type="file" :id="id" @change="doUpload"/>
						    </div>
						    <span>上传进度：</span><el-progress :text-inside="true" :stroke-width="15" :percentage="percentage" style="width: 200px;display: inline-block;"></el-progress>
						  </div>
						  </el-form-item>
	        		<el-form-item label="选项A" v-show="optionShow">
	        			<el-input type="textarea" v-model="update.options[0].optionValue"></el-input>
	        		</el-form-item>
	        		<el-form-item label="选项B" v-show="optionShow">
	        			<el-input type="textarea" v-model="update.options[1].optionValue"></el-input>
	        		</el-form-item>
	        		<el-form-item label="选项C" v-show="optionShow">
	        			<el-input type="textarea" v-model="update.options[2].optionValue"></el-input>
	        		</el-form-item>
	        		<el-form-item label="选项D" v-show="optionShow">
	        			<el-input type="textarea" v-model="update.options[3].optionValue"></el-input>
	        		</el-form-item>
	        		<el-form-item label="正确答案" v-show="answerShow1">
				        <el-radio-group v-model="update.standardAnswer">
				          <el-radio label="A"></el-radio>
				          <el-radio label="B"></el-radio>
				          <el-radio label="C"></el-radio>
				          <el-radio label="D"></el-radio>
				        </el-radio-group>
				      </el-form-item>
				      <el-form-item label="正确答案" v-show="answerShow2">
				      	<el-input type="textarea" v-model="update.standardAnswer"></el-input>
				      </el-form-item>
				      <el-form-item label="解析">
	        			<el-input v-model="update.problemSolvingAnalysis"></el-input>
	        		</el-form-item>
	        		<el-row>
	        			<el-col :span="6">
	        				<el-form-item label="分值">
			        			<el-input v-model="update.questionScore"></el-input>
			        		</el-form-item>
			        	</el-col>
			        	<el-col :span="8">
	        		 		<el-form-item label="难度">
						        <el-select placeholder="选择难度" v-model="update.degreeDifficulty" >
						          <el-option label="简单" value="1"></el-option>
						          <el-option label="一般" value="2"></el-option>
						          <el-option label="中等" value="3"></el-option>
						          <el-option label="较难" value="4"></el-option>
						          <el-option label="困难" value="5"></el-option>
						        </el-select>
						      </el-form-item>
			        	</el-col>
			        	<el-col :span="8">
	        		 		<el-form-item label="共享">
						        <el-select placeholder="选择共享" v-model="update.shareType" @change="share2(update.shareType)">
						          <el-option label="个人" value="1"></el-option>
						          <el-option label="指定教师" value="2"></el-option>
						          <el-option label="本校教师" value="3"></el-option>
						          <el-option label="所有教师" value="4"></el-option>
						        </el-select>
						      </el-form-item>
			        	</el-col>
	        		</el-row>
	        		<el-row>
	        			<el-col :span="12">
			        		<el-form-item label="关联单元">
			        			<el-cascader
									    :options="unit"
									    v-model="update.units">
									  </el-cascader>
			        		</el-form-item>
		        		</el-col>
		        		<el-col :span="10">
			        		<el-form-item label="指定教师">
			        			<el-input v-model="update.teacherName"></el-input>
			        		</el-form-item>
		        		</el-col>
	        		</el-row>
	        		<el-form-item label="标签">
	        			<el-input placeholder="最多选择三个，多个之间以逗号隔开" v-model="update.questionLabel"></el-input>
	        		</el-form-item>
	        </el-form>
	        <div slot="footer" class="dialog-footer">
	            <el-button @click="dialogUpdateVisible = false">取 消</el-button>
	            <el-button type="primary" @click="updateUser">确 定</el-button>
	        </div>
	    </el-dialog>
	    <!-- 创建分享指定老师 begin-->
	    <el-dialog title="分享老师" :visible.sync="dialogShareVisible1" :close-on-click-modal="true" :close-on-press-escape="true" @close="reset">
        <el-form id="#Cshare" :model="create" ref="create" label-width="100px">
        		<el-form-item label="分享老师">
			        <el-checkbox-group v-model="create.teachers">
			          <el-checkbox v-for="(item,index) in teacher":label="item.teacherId" name="type">{{item.teacherName}}</el-checkbox>
			        </el-checkbox-group>
			      </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogShareVisible1 = false">取 消</el-button>
            <el-button type="primary" @click="dialogShareVisible1 = false">确 定</el-button>
        </div>
    	</el-dialog>
    	<!-- 修改分享指定老师 begin-->
	    <el-dialog title="分享老师" :visible.sync="dialogShareVisible2" :close-on-click-modal="true" :close-on-press-escape="true">
        <el-form id="#Eshare" ref="update" label-width="100px">
        		<el-form-item label="分享老师">
			        <el-checkbox-group v-model="update.teachers">
			          <el-checkbox v-for="(item,index) in teacher":label="item.teacherId" name="type">{{item.teacherName}}</el-checkbox>
			        </el-checkbox-group>
			      </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogShareVisible2 = false">取 消</el-button>
            <el-button type="primary" @click="dialogShareVisible2 = false">确 定</el-button>
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
            <el-button @click="dialogTreeVisible = false">取 消</el-button>
            <el-button type="primary" @click="mQuestion()">确 定</el-button>
        </div>
    	</el-dialog>
  </div>
</template>
<!-- VUE饿了么树形控件添加增删改功能按钮 -->
<script>
import TreeRender from './tree_render'
import star from './star'
import { selectSchool } from '@/api/manage'
import { getTree,deleteTree,saveTree,getQuestion,saveQuestion,deleteQuestion,moveQuestion,withUnit,withTeacher } from '@/api/tree'
import { getOT } from '@/api/login'
// 工具栏配置
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
//['blockquote', 'code-block'],
//
//[{'header': 1}, {'header': 2}],               // custom button values
//[{'list': 'ordered'}, {'list': 'bullet'}],
//[{'script': 'sub'}, {'script': 'super'}],      // superscript/subscript
//[{'indent': '-1'}, {'indent': '+1'}],          // outdent/indent
//[{'direction': 'rtl'}],                         // text direction
//
//[{'size': ['small', false, 'large', 'huge']}],  // custom dropdown
//[{'header': [1, 2, 3, 4, 5, 6, false]}],

  [{'color': []}, {'background': []}],          // dropdown with defaults from theme
//[{'font': []}],
//[{'align': []}],
  ['image'],
//['clean']                                         // remove formatting button
]
  export default{
    name: 'tree',
    components:{
 		star
 		},
    data(){
      return{
      	editorOption: {
                    placeholder: '',
                    theme: 'snow',  // or 'bubble'
                    modules: {
                        toolbar: {
                          	container: toolbarOptions,  // 工具栏
                            handlers: {
                                'image': function (value) {
                                    if (value) {
                                      this.quill.root.parentNode.parentNode.nextSibling.nextSibling.click()
                                    } else {
                                        this.quill.format('image', false);
                                    }
                                }
                            }
                        }
                    }
                },
      	custId:localStorage.getItem("custId"),
      	teacherLevel:localStorage.getItem("teacherLevel"),
      	school:[],
      	schoolId:null,
      	value1:null,
      	total_rows: 0,
      	fileList1:[],
        isLoadingTree: false,//是否加载节点树
        setTree: [],//节点树数据
        question:[],//题目数据
        unit:[],//单元数据
        teacher:[],//关联老师数据
        folderId:'',//节点树id
        questionGroupId:'',//题目id
        type:'',//题目类型
        value:'',
        urlQ:'',
        create:{
        			questionStem:'',
        			fileUrl:'',
              options:[
              		{"optionName":"A","optionValue":""},
									{"optionName":"B","optionValue":""},
									{"optionName":"C","optionValue":""},
									{"optionName":"D","optionValue":""}
              ],
              standardAnswer:'',
              problemSolvingAnalysis:'',
              questionScore:'',
              degreeDifficulty:'',
              shareType:'',
              teachers:[],
              units:[],
              questionLabel:'',
              is_active: true
        },
        update:{
        			questionStem:'',
        			fileUrl:'',
              options:[
              		{"optionName":"A","optionValue":""},
									{"optionName":"B","optionValue":""},
									{"optionName":"C","optionValue":""},
									{"optionName":"D","optionValue":""}
              ],
              standardAnswer:'',
              problemSolvingAnalysis:'',
              questionScore:'',
              degreeDifficulty:'',
              shareType:'',
              teachers:[],
              teacherName:'',
              units:[],
              questionLabel:'',
              is_active: true
        },
        region: 'oss-cn-hangzhou',
        bucket: 'oraltest2018',
        accessKeyId:'',
        accessKeySecret:'',
        securityToken:'',
        id: 'upload',
        id1:'upload1',
        percentage: 0,
        percentage1: 0,
        url:'',
        urls:[],
        spanHtml:'',
        contentshow:false,//题目默认不展示
        contentshow1:false,
        contentshow2:false,
        dialogTreeVisible:false,
        operateshow:true,//初始化
        editshow:true,//初始化
        dialogCreateVisible:false,
        dialogUpdateVisible:false,
        dialogShareVisible1:false,
        dialogShareVisible2:false,
        optionShow:false,
        optionShow1:false,
        answerShow1:false,
        answerShow2:false,
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        defaultExpandKeys: [0],//默认展开节点列表
        params:{
        	pageSize:5,
        	pageIndex:1,
        	paramsMap:{}
        }
      }
    },
    computed: {
    	data() {
            return {folderId:this.folderId};
       } 
    },
    mounted:function(){
      this.initExpand()
      this.fetchData()
      this.getUnits()
      this.getTeachers()
      this.defaultQuestion()
      this.urlQ=process.env.BASE_API+"/file/importQuestionByExcel";
      if(this.teacherLevel=="1"){
      	this.getSch();
      }
    },
    methods: {
    	//富文本框自定义图片上传方法
		uploadImg (index) {
        const _this = this;
        const urls = [];
        getOT().then((response) => {
        const client = new OSS.Wrapper({
        		region: _this.region,
            accessKeyId: response.data.accessKeyId,
            accessKeySecret:response.data.accessKeySecret,
            stsToken: response.data.securityToken,
            bucket: _this.bucket
        })
//       _this.percentage1 = 0;
          const files = document.getElementById('uniqueId'+index)
          if (files.files) {
            const fileLen = document.getElementById('uniqueId'+index).files
            for (let i = 0; i < fileLen.length; i++) {
              const file = fileLen[i]
              // 随机命名
              let random_name = 'image/'+new Date().getTime() + '.' + file.name.split('.').pop()
              // 上传
              
              client.multipartUpload(random_name, file, {
//              progress: function* (percentage1, cpt) {
//                // 上传进度
//                _this.percentage1 = percentage1*100
//              }
              }).then((results) => {
                // 上传完成
                const url = 'https://oraltest2018.oss-cn-hangzhou.aliyuncs.com/'+results.name;let quill = this.$refs['myQuillEditor'+index].quill;// 获取光标所在位置
                    let length = quill.getSelection().index;quill.insertEmbed(length, 'image', url);quill.setSelection(length + 1)
  }).catch((err) => { console.log(err) }) } } })}, 
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
    		this.defaultQuestion();
    		this.fetchData()
    	},
    	defaultQuestion(){//默认加载一级目录下的题目
    		getTree(1,this.schoolId).then(response => {
      		this.contentshow=true;
      		this.params.paramsMap.folderId=response.data[0].children[0].id;
      		this.spanHtml=response.data[0].children[0].label;
      	getQuestion(this.params).then(response => {
      		if(response.data.total!=0){
      			this.contentshow1=true;
      			this.contentshow2=false;
      		}else{
      			this.contentshow1=false;
      			this.contentshow2=true;
      		}
      		this.question = response.data.rows;
      		this.total_rows = response.data.total;
      		for(var i=0;i<this.question.length;i++){
      			if(this.question[i].questions[0].questionType==1){
      				this.question[i].optionShow1=true;
      			}else{
      				this.question[i].optionShow1=false;
      			}
      		}
      		console.log(this.question)
      }).catch(() => {
              return false;
            })
      	})
    		
    	},
    	showQuestion(s,d,n){//点击加载各目录下试题
      	this.contentshow=true;
      	this.params.paramsMap.folderId=d.id;
      	this.spanHtml=d.label;
      	getQuestion(this.params).then(response => {
      		if(response.data.total!=0){
      			this.contentshow1=true;
      			this.contentshow2=false;
      		}else{
      			this.contentshow1=false;
      			this.contentshow2=true;
      		}
      		this.question = response.data.rows;
      		this.total_rows = response.data.total;
      		for(var i=0;i<this.question.length;i++){
      			if(this.question[i].questions[0].questionType==1){
      				this.question[i].optionShow1=true;
      			}else{
      				this.question[i].optionShow1=false;
      			}
      		}
      		console.log(this.question)
      }).catch(() => {
              return false;
            })
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
    	showChange1(index){
    		this.editshow=index;
    		this.operateshow=index;
    	},
    	createE({ editor, html, text }){
    		this.create.questionStem=html;
    	},
    	updateE({ editor, html, text }){
    		this.update.questionStem=html;
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
    	// 重置表单
      reset() {
          this.$refs.create.resetFields();
      },
      //获取单元信息
      getUnits() {
      	withUnit().then((response) => {  
      		this.unit = response.data;
          })
          .catch((response)=> {
          });
      },
      //获取关联老师信息
      getTeachers() {
      	withTeacher().then((response) => {  
      		this.teacher = response.data;
          })
          .catch((response)=> {
          });
      },
      // 获取用户列表
      getUsers() {
          getQuestion(this.params).then((response) => {
            if(response.data.total!=0){
      			this.contentshow1=true;
      			this.contentshow2=false;
      		}else{
      			this.contentshow1=false;
      			this.contentshow2=true;
      		}
      		this.question = response.data.rows;
      		this.total_rows = response.data.total;
      		for(var i=0;i<this.question.length;i++){
      			if(this.question[i].questions[0].questionType==1){
      				this.question[i].optionShow1=true;
      			}else{
      				this.question[i].optionShow1=false;
      			}
      		}
          })
          .catch((response)=> {
          });
      },
      //添加题目
      addq(val){
      	this.type=val;
      	if(this.type==1){
      		this.optionShow=true;
      		this.answerShow1=true;
      		this.answerShow2=false;
      	}else{
      		this.optionShow=false;
      		this.answerShow2=true;
      		this.answerShow1=false;
      	}
      	this.dialogCreateVisible=true;
      },
    	//修改题目
    	editq(i){
    			this.update.units=[];
    			if(this.question[i].questions[0].questionType==1){
	      		this.optionShow=true;
	      		this.answerShow1=true;
      			this.answerShow2=false;
	      	}else{
	      		this.optionShow=false;
	      		this.answerShow2=true;
      			this.answerShow1=false;
	      	}
    			this.update.teacherName='';
          this.update.questionId=this.question[i].questions[0].questionId;
          this.update.questionType=this.question[i].questions[0].questionType;
          this.update.questionStem=this.question[i].questions[0].questionStem;
          for(var a=0;a<this.question[i].questions[0].options.length;a++){
          	this.update.options[a].optionValue=this.question[i].questions[0].options[a].optionValue;
          }
          this.update.standardAnswer=this.question[i].questions[0].standardAnswer;
          this.update.problemSolvingAnalysis=this.question[i].questions[0].problemSolvingAnalysis;
          this.update.questionScore=this.question[i].questions[0].questionScore;
          this.update.degreeDifficulty=this.question[i].degreeDifficulty;
          this.update.shareType=this.question[i].shareType+'';
          var result=this.question[i].questionUnit.split(',');
          for(var a=0;a<result.length;a++){
						this.update.units[a] = parseInt(result[a]);
          }
          if(this.question[i].shareTeachers!=null){
          	for(var a=0;a<this.question[i].shareTeachers.length;a++){
          	this.update.teachers[a]=this.question[i].shareTeachers[a].teacherId;
          	this.update.teacherName=this.update.teacherName+this.question[i].shareTeachers[a].teacherName+',';
          }
          this.update.teacherName = this.update.teacherName.substr(0,this.update.teacherName.length-1);
          }
          
          this.update.questionLabel=this.question[i].questions[0].questionLabel;
          this.dialogUpdateVisible=true;
      },
    	// 创建题目
      createUser(){
      						this.create.folderId=this.params.paramsMap.folderId;
      						this.create.questionType=this.type;
                  saveQuestion(this.create)
                      .then((response) => {
                      if(response.status==0){
                      		this.$message.error(response.error.message);
                      }else{
                      this.$message.success('创建题目成功！');
                      this.dialogCreateVisible=false;
                      this.getUsers()
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
      },
      // 更新题目资料
      updateUser() {
                  var actions = {
                      update: {method: 'patch'}
                  }
                  saveQuestion(this.update)
                      .then((response) => {
                      if(response.status==0){
                      		this.$message.error(response.error.message);
                      }else{
                      this.$message.success('修改题目资料成功！');
                      this.dialogUpdateVisible=false;
                      this.getUsers()
                      this.reset();
                      }
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
      // 删除题目
      deleteq(i) {
          this.$confirm('此操作将永久删除此道题 ,是否继续?', '提示', { type: 'warning' })
              .then(() => {
              // 向请求服务端删除
              deleteQuestion(this.question[i].questionGroupId)
                  .then((response) => {
                  this.$message.success('成功删除了该题!');
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
      //移动题目
      moveq(i){
      	this.dialogTreeVisible=true;
      	this.questionGroupId=this.question[i].questionGroupId;
      },
      mQuestion(){
      	moveQuestion(this.questionGroupId,this.folderId)
                      .then((response) => {
                      this.$message.success('移动题目成功！');
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
      share1(i){
      	if(i==2){
      		this.dialogShareVisible1=true;
      	}else{
      		this.dialogShareVisible1=false;
      	}
      },
      share2(i){
      	if(i==2){
      		this.dialogShareVisible2=true;
      	}else{
      		this.dialogShareVisible2=false;
      	}
      },
      //增加上传音频
      doUpload1 () {
        const _this = this;
        const urls = [];
        getOT().then((response) => {
        const client = new OSS.Wrapper({
            region: _this.region,
            secure: true,
            accessKeyId: response.data.accessKeyId,
            accessKeySecret:response.data.accessKeySecret,
            stsToken: response.data.securityToken,
            bucket: _this.bucket
        })
         _this.percentage1 = 0;
          const files = document.getElementById(_this.id1)
          if (files.files) {
            const fileLen = document.getElementById(_this.id1).files
            let resultUpload = ''
            for (let i = 0; i < fileLen.length; i++) {
              const file = fileLen[i]
              // 随机命名
              let random_name = 'question/'+localStorage.getItem("custId")+'_'+new Date().getTime() + '.' + file.name.split('.').pop()
              // 上传
              
              client.multipartUpload(random_name, file, {
                progress: function* (percentage1, cpt) {
                  // 上传进度
                  _this.percentage1 = percentage1*100
                }
              }).then((results) => {
                // 上传完成
                const url = 'http://oraltest2018.oss-cn-hangzhou.aliyuncs.com/'+results.name;  _this.url = url; _this.create.fileUrl=url;console.log(url); }).catch((err) => { console.log(err) }) } } })}, 
      //修改上传音频
       doUpload () {
        const _this = this;
        const urls = [];
        getOT().then((response) => {
        const client = new OSS.Wrapper({
            region: _this.region,
            secure: true,
            accessKeyId: response.data.accessKeyId,
            accessKeySecret:response.data.accessKeySecret,
            stsToken: response.data.securityToken,
            bucket: _this.bucket
        })
         _this.percentage = 0;
          const files = document.getElementById(_this.id)
          if (files.files) {
            const fileLen = document.getElementById(_this.id).files
            let resultUpload = ''
            for (let i = 0; i < fileLen.length; i++) {
              const file = fileLen[i]
              // 随机命名
              let random_name = 'question/'+localStorage.getItem("custId")+'_'+new Date().getTime() + '.' + file.name.split('.').pop()
              // 上传
              client.multipartUpload(random_name, file, {
                progress: function* (percentage, cpt) {
                  // 上传进度
                  _this.percentage = percentage*100; 
                }
              }).then((results) => {
                // 上传完成
                
                const url = 'https://oraltest2018.oss-cn-hangzhou.aliyuncs.com/'+ results.name;  _this.url = url; _this.update.fileUrl=url;console.log(url); }).catch((err) => { console.log(err) }) } } })}, 
			
    	fetchData() {
      getTree(1,this.schoolId).then(response => {
      		this.setTree = response.data
      		console.log(this.setTree)
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
            showQuestion:((s,d,n) => that.showQuestion(s,d,n)),
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
        }saveTree(d.id,"新增节点").then(response => {
        	//添加数据
        	console.log(response.data)
        	d.children.push({
          label: response.data.questionFolderName,
          
          id:response.data.questionFolderId,
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
  				deleteTree(d.id).then(response => {
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
      //下载模板
      downloadQ(){
      	window.location.href = process.env.BASE_API+"/file/getExcelById?type=question";
      },
      //试题导入
      handleRemove1(file, fileList1) {
        console.log(file, fileList1);
      },
      handlePreview1(file) {
        console.log(file);
      },
      handleExceed1(files, fileList1) {
        this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList1.length} 个文件`);
      },
      beforeRemove1(file, fileList1) {
        return this.$confirm(`确定移除 ${ file.name }？`);
      },
      handleSuccess1(response, file, fileList1){
      	this.$message.success("导入成功");
      	this.getUsers();
      }
    }
    
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
.addQuestion{
	outline: none;
	cursor: pointer;
	width: 90px;
	height: 40px;
	line-height: 38px;
	border: none;
	border-radius: 5px;
}
.addQuestion .el-input__inner{
	color:white;
	background: dodgerblue;
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
.ope{
	position: absolute;
	top: 0px;
	right: 160px;
}
.el-upload-list__item:first-child{
	margin-top: -40px;
	margin-left: -150px;
}
.tmg{
	margin-top: 20px;
	margin-left: 9%;
}
.qui img{
	width: 300px;
	height: 180px;
}
/*.oss_file { 
	height: 150px; width: 150px; border-radius: 50%;
	 // background: red; img{ width:100%; display: inline-block; float: right; } }
	  .oss_file input { right: 0; top: 0; opacity: 0; filter: alpha(opacity=1); cursor: pointer; 
	  width: 150px; height: 150px;}*/
</style>

