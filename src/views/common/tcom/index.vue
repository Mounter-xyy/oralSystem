<template>
  <div class="expand" style="display: flex;">
    <div class="etree">
    	<h3>我的试卷</h3>
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
      	<div id="content">
      	<div class="content" v-show="contentshow2">暂无试卷...</div>
      	<div v-for="(item,index) in test" :key="index" class="content" v-show="contentshow1" :class="timeIndex[index] == index ? 'default default-active' : 'default' " @click="testcontentedit(index,item.examinationPaperId,item.examinationPaperName,item.examinationPaperScore)">
      		<div style="color: #409eff;margin-top: 10px;">{{item.examinationPaperName}}<span v-if="isArr[index]">（已选中）</span></div>
      		<div style="margin-top: 20px;">
      			<span>试卷类型：考试题</span>
      			<span style="margin-left: 20px;margin-right: 20px;">分数：{{item.examinationPaperScore}}分</span>
      			<svg-icon icon-class="user" style="color: orange;"/><span v-html="getSharetype(item.shareType)"></span>
      		</div>
      		<div style="margin-top: 10px;">上次修改时间：{{item.operatorTime | moment("YYYY-MM-DD HH:mm:ss")}}</div>
      	</div>
      	</div>	
      </div>
  </div>
</template>
<!-- VUE饿了么树形控件添加增删改功能按钮 -->
<script>
import TreeRender from './tree_render'
import { getTest,deleteTest,saveTest,getExamination,saveExamination,deleteExamination,getModel,editModel,deleteModel,getModelQuestion,getExaminationPaper,deleteEPQ,updateEPQS,updateEPQ,addEPQ,moveEPF } from '@/api/test'
  export default{
    name: 'tree',
    data(){
      return{
        isLoadingTree: false,//是否加载节点树
        setTree: [],//节点树数据
        unit:[],//单元数据
        model:[],//模板数据
        test:[],//试卷数据
        folderId:'',//节点树id
        timeIndex:[],
        examinationPaper:{},
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
        dialogTreeVisible:false,
        defaultExpandKeys: [0],//默认展开节点列表
        params:{
        	paramsMap:{}
        },
        addparams:{
        	datas:{}
        },
        users: [],
        users1:[],
        ids:[],
        names:[],
        isArr:[],
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
    mounted:function(){
      this.initExpand()
      this.fetchData()
      this.fetchModel()
      this.defaultExamination()
    },
    methods: {	
    	defaultExamination(){//默认加载一级目录下的试卷
    		this.isArr=[];
    		this.timeIndex=[];
    		getTest(1).then(response => {
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
      		for(let i in response.data.rows){
      			this.isArr[i]=false;
      			this.timeIndex[i]=-1;
      		}
      }).catch(() => {
              return false;
            })
      	})	
    	},
    	showExamination(s,d,n){//点击加载各目录下试题
      	this.contentshow=true;
      	this.params.paramsMap.folderId=d.id;
      	this.spanHtml=d.label;
      	this.isArr=[];
      	this.timeIndex=[];
      	getExamination(this.params).then(response => {
      		if(response.data.total!=0){
      			this.contentshow1=true;
      			this.contentshow2=false;
      		}else{
      			this.contentshow1=false;
      			this.contentshow2=true;
      		}
      		this.test = response.data.rows;
      		for(let i in response.data.rows){
      			this.isArr[i]=false;
      			this.timeIndex[i]=-1;
      		}
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
      	},
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
          })
          .catch((response)=> {
            this.$message.error('错了哦，这是一条错误消息');
          });
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
    	testcontentedit(index,id,name,score) {   
				if(this.isArr[index]==false){
					this.timeIndex[index]=index;
					this.ids.push(id);
					this.names.push(name);
				}else{
					this.timeIndex[index]=-1;
					this.ids.splice(this.ids.indexOf(id), 1);
					this.names.splice(this.names.indexOf(name), 1);
				}
    		this.isArr[index]=!this.isArr[index];
    		this.$set(this.isArr, index, this.isArr[index]);
    		this.$set(this.timeIndex, index, this.timeIndex[index]);
    		let ids='';
    		let names='';
    		ids=this.ids.join(',');
    		names=this.names.join(',');
    		this.$emit("receiveFromChild",{ids,names,score});
    	},
    	fetchData() {
	      	getTest(1).then(response => {
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
        	children.splice(index, 1);
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
	height: 320px;
}
.addQuestion{
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
.questionR{
	margin-top: 10px;
	background: #eeeeee;
	width: 100%;
	height: 65px;
	line-height: 65px;
	border-radius: 10px;
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
</style>

