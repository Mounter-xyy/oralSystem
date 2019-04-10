<template>
  <div class="expand" style="display: flex;">
    <div class="etree" style="padding-left: 45px;">
    		<h3>我的题库</h3>
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
      <div class="etreeContent c_etreeContent" v-show="contentshow">
      	<h4>当前位置<<{{spanHtml}}</h4>
      	<!--<el-select placeholder="添加试题" class="addQuestion" v-model="value" @change="addq(value)">
      		<el-option label="单选题" value="1"></el-option>
      		<el-option label="填空题" value="2"></el-option>
      		<el-option label="简答题" value="3"></el-option>
      		<el-option label="朗诵题" value="4"></el-option>
      	</el-select>-->
      	<div id="child_content">
      	<div class="content" v-show="contentshow2">暂无试题...</div>
      	<div v-for="(item,index) in question" class="content" :class="timeIndex === index ? 'default default-active' : 'default' " v-show="contentshow1" @click="contentedit(index,item.questions[0].questionId)">
      		编号：{{item.questions[0].questionId}}
      		<span style="margin-left: 15px;" v-html="getType(item.groupType)"></span>
      		<span style="margin-left: 15px;margin-right: 15px;">{{item.totalScore}}分</span>
      		难度：<star :size="48" :score="item.degreeDifficulty" style="display: inline;margin-right: 15px;position: relative;top: 3px;"></star>
      		<svg-icon icon-class="user" style="color: orange;"/><span v-html="getSharetype(item.shareType)"></span>
      		<div style="margin-top: 10px;margin-bottom: 10px;" v-html="item.questions[0].questionStem"></div>
      		<audio
    					controls="controls"
    					preload="auto" 
    					:src="item.questions[0].fileUrl" v-if="item.questions[0].fileUrl!=null" style="margin-left: -10px;">
    			</audio>	
      		<div v-for="item1 in item.questions[0].options" v-show="item.optionShow1">{{item1.optionName}}:{{item1.optionValue}}</div>
      		<div style="margin-top: 10px;">正确答案：{{item.questions[0].standardAnswer}}</div>
      		<div>解析：{{item.questions[0].problemSolvingAnalysis}}</div>
      		<div>上次修改时间：{{item.createTime}}</div>
      	</div>
      	</div>
      	<!--<el-pagination class="tc mg"
                      :current-page="params.pageIndex"
                      :page-sizes="[5, 10, 20, 50]"
                      :page-size="params.pageSize"
                      layout="total, sizes, prev, pager, next, jumper"
                      :total="total_rows"
                      @size-change="pageSizeChange"
                      @current-change="pageCurrentChange">
        </el-pagination>-->
      </div>
  </div>
</template>
<!-- VUE饿了么树形控件添加增删改功能按钮 -->
<script>
import TreeRender from './tree_render'
import star from './star'
import { getTree,deleteTree,saveTree,getQuestion,saveQuestion,deleteQuestion,moveQuestion,withUnit,withTeacher,getEPQS } from '@/api/tree'

  export default{
    name: 'tree',
    components:{
 		star
 		},
 		props:['mes'],
    data(){
      return{
      	total_rows: 0,
        isLoadingTree: false,//是否加载节点树
        setTree: [],//节点树数据
        question:[],//题目数据
				timeIndex:-1,
        folderId:'',//节点树id
        questionGroupId:'',//题目id
        questionId:'',
        type:'',//题目类型
        value:'',
        spanHtml:'',
        contentshow:false,//题目默认不展示
        contentshow1:false,
        contentshow2:false,
        dialogTreeVisible:false,
        operateshow:true,//初始化
        editshow:true,//初始化
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
    mounted:function(){
      this.initExpand()
      this.fetchData()
//    this.getUnits()
//    this.getTeachers()
      this.defaultQuestion()
    },
    methods: {
    	defaultQuestion(){//默认加载一级目录下的题目
    		getTree(1).then(response => {
      		this.contentshow=true;
      		this.params.paramsMap.folderId=response.data[0].children[0].id;
      		this.spanHtml=response.data[0].children[0].label;
      		this.params.paramsMap.examinationPaperId=this.mes;
      	getEPQS(this.params).then(response => {
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
      	this.params.paramsMap.examinationPaperId=this.mes;
      	getEPQS(this.params).then(response => {
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
    	contentedit(index,id) {   
    		this.timeIndex = index;
    		this.questionId=id;
    		this.$emit("receiveFromChild",id);
    	},
//  	createE({ editor, html, text }){
//  		this.create.questionStem=html;
//  	},
//  	updateE({ editor, html, text }){
//  		this.update.questionStem=html;
//  	},
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
//    getUnits() {
//    	withUnit().then((response) => {  
//    		this.unit = response.data;
//        })
//        .catch((response)=> {
//          this.$message.error('错了哦，这是一条错误消息');
//        });
//    },
      //获取关联老师信息
//    getTeachers() {
//    	withTeacher().then((response) => {  
//    		this.teacher = response.data;
//        })
//        .catch((response)=> {
//          this.$message.error('错了哦，这是一条错误消息');
//        });
//    },
      // 获取用户列表
//    getUsers() {
//        getQuestion(this.params).then((response) => {
//          if(response.data.total!=0){
//    			this.contentshow1=true;
//    			this.contentshow2=false;
//    		}else{
//    			this.contentshow1=false;
//    			this.contentshow2=true;
//    		}
//    		this.question = response.data.rows;
//    		for(var i=0;i<this.question.length;i++){
//    			question[i].isA=true;
//						question[i].isB=false;
//    			if(this.question[i].questions[0].questionType==1){
//    				this.question[i].optionShow1=true;
//    			}else{
//    				this.question[i].optionShow1=false;
//    			}
//    		}
//        })
//        .catch((response)=> {
//          this.$message.error('错了哦，这是一条错误消息');
//        });
//    },
      //添加题目
//    addq(val){
//    	this.type=val;
//    	if(this.type==1){
//    		this.optionShow=true;
//    		this.answerShow1=true;
//    		this.answerShow2=false;
//    	}else{
//    		this.optionShow=false;
//    		this.answerShow2=true;
//    		this.answerShow1=false;
//    	}
//    	this.dialogCreateVisible=true;
//    },
    	//修改题目
//  	editq(i){
//  			if(this.question[i].questions[0].questionType==1){
//	      		this.optionShow=true;
//	      		this.answerShow1=true;
//    			this.answerShow2=false;
//	      	}else{
//	      		this.optionShow=false;
//	      		this.answerShow2=true;
//    			this.answerShow1=false;
//	      	}
//  			this.update.teacherName='';
//        this.update.questionId=this.question[i].questions[0].questionId;
//        this.update.questionType=this.question[i].questions[0].questionType;
//        this.update.questionStem=this.question[i].questions[0].questionStem;
//        this.update.options[0].optionValue=this.question[i].questions[0].options[0].optionValue;
//        this.update.options[1].optionValue=this.question[i].questions[0].options[1].optionValue;
//        this.update.options[2].optionValue=this.question[i].questions[0].options[2].optionValue;
//        this.update.options[3].optionValue=this.question[i].questions[0].options[3].optionValue;
//        this.update.standardAnswer=this.question[i].questions[0].standardAnswer;
//        this.update.problemSolvingAnalysis=this.question[i].questions[0].problemSolvingAnalysis;
//        this.update.questionScore=this.question[i].questions[0].questionScore;
//        this.update.degreeDifficulty=this.question[i].degreeDifficulty;
//        this.update.shareType=this.question[i].shareType+'';
//        var result=this.question[i].questionUnit.split(',');
//        for(var a=0;a<result.length;a++){
//        	this.update.units[a]=parseInt(result[a]);
//        }
//        for(var a=0;a<this.question[i].shareTeachers.length;a++){
//        	this.update.teachers[a]=this.question[i].shareTeachers[a].teacherId;
//        	this.update.teacherName=this.update.teacherName+this.question[i].shareTeachers[a].teacherName+',';
//        }
//        this.update.teacherName = this.update.teacherName.substr(0,this.update.teacherName.length-1);
//        this.update.questionLabel=this.question[i].questions[0].questionLabel;
//        this.dialogUpdateVisible=true;
//    },
    	// 创建题目
//    createUser(){
//    						this.create.folderId=this.params.paramsMap.folderId;
//    						this.create.questionType=this.type;
//                saveQuestion(this.create)
//                    .then((response) => {
//                    this.$message.success('创建题目成功！');
//                    this.dialogCreateVisible=false;
//                    this.getUsers()
//                    this.reset();
//            })
//            .catch((response) => {
//                    var data=response.data;
//                    if(data instanceof Array){
//                        this.$message.error(data[0]["message"]);
//                    }
//                    else if(data instanceof Object){
//                        this.$message.error(data["message"]);
//                    }
//               }); 
//    },
      // 更新题目资料
//    updateUser() {
//                var actions = {
//                    update: {method: 'patch'}
//                }
//                saveQuestion(this.update)
//                    .then((response) => {
//                    this.$message.success('修改题目资料成功！');
//                    this.dialogUpdateVisible=false;
//                    this.getUsers()
//                    this.reset();
//            })
//            .catch((response) => {
//                var data=response.data;
//                console.log(data);
//                if(data instanceof Array){
//                    this.$message.error(data[0]["message"]);
//                }
//                else if(data instanceof Object){
//                    this.$message.error(data["message"]);
//                }
//            });
//    },
      // 删除题目
//    deleteq(i) {
//        this.$confirm('此操作将永久删除此道题 ,是否继续?', '提示', { type: 'warning' })
//            .then(() => {
//            // 向请求服务端删除
//            deleteQuestion(this.question[i].questionGroupId)
//                .then((response) => {
//                this.$message.success('成功删除了该题!');
//                this.getUsers()
//            })
//            .catch((response) => {
//                    this.$message.error('删除失败!');
//             });
//        })
//        .catch(() => {
//            this.$message.info('已取消操作!');
//        });
//    },
      //移动题目
//    moveq(i){
//    	this.dialogTreeVisible=true;
//    	this.questionGroupId=this.question[i].questionGroupId;
//    },
//    mQuestion(){
//    	moveQuestion(this.questionGroupId,this.folderId)
//                    .then((response) => {
//                    this.$message.success('移动题目成功！');
//                    this.dialogTreeVisible=false;
//                    this.getUsers();
//            })
//            .catch((response) => {
//                    var data=response.data;
//                    if(data instanceof Array){
//                        this.$message.error(data[0]["message"]);
//                    }
//                    else if(data instanceof Object){
//                        this.$message.error(data["message"]);
//                    }
//               }); 
//    },
//    share1(i){
//    	if(i==2){
//    		this.dialogShareVisible1=true;
//    	}else{
//    		this.dialogShareVisible1=false;
//    	}
//    },
//    share2(i){
//    	if(i==2){
//    		this.dialogShareVisible2=true;
//    	}else{
//    		this.dialogShareVisible2=false;
//    	}
//    },
    	fetchData() {
      getTree(1).then(response => {
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
        	children.splice(index, 1);
      });
              
            }).catch(() => {
              return false;
            })

      },
    }
    
  }
</script>

<style>
.expand{
  width:100%;
  height:100%;
  /*overflow:hidden;*/
}
.etree{
  height:85%;
  padding-top:50px;
  padding-left: 100px;
  width:50%;
  max-width:400px;
  overflow-y:auto;
}
.c_etreeContent{
	margin-top: 40px;
	margin-left: 60px;
	position: relative;
	width: 100%;
}
#child_content{
	overflow: auto;
	height: 300px;
}

.addQuestion{
	outline: none;
	cursor: pointer;
	width: 110px;
	height: 40px;
	position: absolute;
	right:160px;
	top: 0px;
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
.contentedit{
	cursor: pointer;
}
.default{
	cursor: pointer;
}
.default-active{
	border: 1px solid dodgerblue;
	box-shadow: 1px 1px 1px #50a8fe;
}
.tc{
	margin-top: 5px;
}
.c_etreeContent img{
	width: 300px;
	height: 180px;
	display: block;
}
</style>

