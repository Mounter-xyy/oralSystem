<template>
	<div>
		<div class="nav">
			<div><img src="../../assets/img/welcome.png" />&nbsp;&nbsp;&nbsp;{{studentName}}同学，欢迎您!</div>
		</div>
		<div class="testN">
			<div><span class="login"></span>综合测试卷</div>
		</div>
		<div class="testC">
			<span class="testSpan" style="margin-left: 20px;"><img src="../../assets/img/test1.png" />考生：{{studentName}}</span>
			<span class="testSpan"><img src="../../assets/img/test3.png" />总分：26分</span>
			<span class="testSpan"><img src="../../assets/img/test4.png" />题目总数：{{mytest.questionInfo.questionTypes[0].typeQuestions.length+mytest.questionInfo.questionTypes[1].typeQuestions.length+mytest.questionInfo.questionTypes[2].typeQuestions.length+mytest.questionInfo.questionTypes[3].typeQuestions.length}}小题</span>
			<div class="testT">
				<div class="testCon">
					<span class="testTime">距离考试结束：{{hr}}:{{min}}:{{sec}}</span>
					<el-button type="primary" class="testJ" @click="submitTest">提交测验</el-button>
				</div>
				<div>
					<span class="questionX" @click="type=1;i=1" :class="{questionXS:i===1}" v-if="mytest.questionInfo.questionTypes[0].typeQuestions.length!=0">单选题</span>
					<span class="questionX" @click="type=2;i=2" :class="{questionXS:i===2}" v-if="mytest.questionInfo.questionTypes[1].typeQuestions.length!=0">填空题</span>
					<span class="questionX" @click="type=3;i=3" :class="{questionXS:i===3}" v-if="mytest.questionInfo.questionTypes[2].typeQuestions.length!=0">简答题</span>
					<span class="questionX" @click="type=4;i=4" :class="{questionXS:i===4}" v-if="mytest.questionInfo.questionTypes[3].typeQuestions.length!=0">朗诵题</span>
				</div>
			</div>
			<div class="test" v-if="type==1">
				<div class="testTop">看题选择正确的答案（共{{mytest.questionInfo.questionTypes[0].typeQuestions.length}}小题）</div>
				<div class="testQuestion" v-for="(item,index) in mytest.questionInfo.questionTypes[0].typeQuestions">
					<div v-html="index+1+'.'+item.questionStem.replace(/<p>/g,'')" class="questionS"></div>
					<span class="tScore">{{item.questionScore}}分</span>
					<audio
					controls="controls"
					preload="auto" 
					:src="item.fileUrl" v-if="item.fileUrl!=null && item.fileUrl!=undefined && item.fileUrl!=''" class="aud">
    				</audio>	
					<div class="">
						<el-radio-group v-model="a[index]" v-for="(item1,index1) in item.options" @change="saveQ(mytest.testInfo.testId,custId,item.questionId,a[index])">
				          <el-radio :label="item1.optionName">{{item1.optionName}}.{{item1.optionValue}}</el-radio>
				        </el-radio-group>
					</div>
				</div>
			</div>
			<div class="test" v-if="type==2">
				<div class="testTop">看题填入正确的答案（共{{mytest.questionInfo.questionTypes[1].typeQuestions.length}}小题）</div>
				<div class="testQuestion" v-for="(item,index) in mytest.questionInfo.questionTypes[1].typeQuestions">
					<div v-html="index+1+'.'+item.questionStem.replace(/<p>/g,'')" class="questionS"></div>
					<span class="tScore">{{item.questionScore}}分</span>
					<audio
					controls="controls"
					preload="auto" 
					:src="item.fileUrl" v-if="item.fileUrl!=null && item.fileUrl!=undefined && item.fileUrl!=''" class="aud">
    				</audio>	
					<div class="questionA">
						答题区：<input v-show="item.answerNum==1" type="text" v-model="myAnswer[index]" @change="saveQ(mytest.testInfo.testId,custId,item.questionId,myAnswer[index])"></input>
						<span v-if="item.answerNum!=1">
						<input type="text" v-for="(v,i) in item.answerNum" v-model="mul[index][i]"  @change="saveMQ(mytest.testInfo.testId,custId,item.questionId,i,index)" style="margin-right: 20px;"/>
						</span>
					</div>
				</div>
			</div>
			<div class="test" v-if="type==3">
				<div class="testTop">听录音答题（共{{mytest.questionInfo.questionTypes[2].typeQuestions.length}}小题）</div>
				<div class="testQuestion" v-for="(item,index) in mytest.questionInfo.questionTypes[2].typeQuestions">
					<div v-html="index+1+'.'+item.questionStem.replace(/<p>/g,'')" class="questionS"></div>
					<span class="tScore">{{item.questionScore}}分</span>
					<span class="qaud">题目录音：</span>
					<audio
					controls="controls"
					preload="auto" 
					:src="item.fileUrl" v-if="item.fileUrl!=null && item.fileUrl!=undefined && item.fileUrl!=''" class="aud">
    				</audio>	
					<div class="questionA" style="padding-top: 0;">
						<div v-if="url1[index]!=null" style="margin-bottom: 30px;line-height: 32px;"><span class="qaud_">我的录音：</span><audio controls="controls" :src="url1[index]" ></audio></div>
				        <el-button type="primary" @click="startRecording(index,type)" class="auop" :disabled="dis[index]">录音{{startRecord1[index]}}</el-button>
<!--				        <el-button type="warning" @click="stopRecording(index,type)" class="auop">{{stopRecord1[index]}}停止</el-button>-->
				        <el-button type="danger" @click="uploadAudio(mytest.testInfo.testId,custId,item.questionId,index,type)" class="auop" :disabled="disab[index]">提交</el-button>
				        <span style="color: red;" v-if="show1[index]==index">提交中请稍等...</span>
				        <span style="color: red;" v-if="show_1[index]==index">提交失败,请检查录音设备是否正常!</span>
				        <span style="color:green" v-if="show2[index]==index">提交完成!</span>
				        <!--<input @click="playRecording()" type="button" value="播放" />-->
					</div>
				</div>
			</div>
			<div class="test testL" v-if="type==4">
				<div class="testTop">请朗诵题目（共{{mytest.questionInfo.questionTypes[3].typeQuestions.length}}小题）</div>
				<div class="testQuestion" v-for="(item,index) in mytest.questionInfo.questionTypes[3].typeQuestions">
					<div v-html="index+1+'.'+item.questionStem.replace(/<p>/g,'')" class="questionS"></div>
					<span class="tScore">{{item.questionScore}}分</span>
					<div class="questionA">
						<div v-if="url2[index]!=null" style="margin-bottom: 30px;"><span class="qaud_">我的录音：</span><audio controls="controls" :src="url2[index]" ></audio></div>
				        <el-button type="primary" @click="startRecording(index,type)" class="auop">录音{{startRecord2[index]}}</el-button>
<!--				        <el-button type="warning" @click="stopRecording(index,type)" class="auop">{{stopRecord2[index]}}停止</el-button>-->
				        <el-button type="danger" @click="uploadAudio(mytest.testInfo.testId,custId,item.questionId,index,type)" class="auop">提交</el-button>
				        <span style="color: red;" v-if="show3[index]==index">提交中请稍等...</span>
				         <span style="color: red;" v-if="show_3[index]==index">提交失败,请检查录音设备是否正常!</span>
				        <span style="color:green" v-if="show4[index]==index">提交完成!</span>
					</div>
				</div>
			</div>
		</div>
		<!--<div id="goTop" @click="goTop" v-show="">
			<img src="../../assets/img/goTop.png"  />
			<p>回到顶部</p>
		</div>-->
		<el-main>
			<el-scrollbar class="scroller-box" id="scroller-box">
				<transition name="fade" mode="out-in">
					<router-view></router-view>
				</transition>
				<scroll-top></scroll-top>
			</el-scrollbar>	
		</el-main>	
	</div>
</template>

<script>
import { saveMA,getMA,submitT,getSystime } from '@/api/student'
import { getOT } from '@/api/login'
import ScrollTop from './ScrollTop'
import '../../../static/HZRecorder'
var recorder;
var audio = document.querySelector('audio');
export default {
	data(){
		return{
			mytest:JSON.parse(localStorage.getItem("peaceTest")),
			test:[],
			studentName:localStorage.getItem("studentName"),
			custId:localStorage.getItem("custId"),
			dis:[],
			disab:[],
			a:[],
			mul:[],
			type:1,
			i:1,
			hr: 0,
			min: 0,
			sec: 0,
			myAnswer:[],
			MyA:{},
			region: 'oss-cn-hangzhou',
	        bucket: 'oraltest2018',
	        accessKeyId:'',
	        accessKeySecret:'',
	        securityToken:'',
	        sysTime:Date.parse(new Date()),
	        url1:[],
	        url2:[],
	        show1:[],
	        show_1:[],
	        show2:[],
	        show3:[],
	        show_3:[],
	        show4:[],
	        startRecord1:[],
	        stopRecord1:[],
	        startRecord2:[],
	        stopRecord2:[]
		}
	},
	mounted: function () {
	this.getQ(); 
	//禁止页面回退
//    	history.pushState(null, null, document.URL);
//		window.addEventListener('popstate', function () {
//		    history.pushState(null, null, document.URL);
//		});
  	},
  	components:{
  		'scroll-top':ScrollTop
  	},
	methods: {
	getQ(){
		this.countdown();
        for(var i=0;i<this.mytest.questionInfo.questionTypes[1].typeQuestions.length;i++){
			this.mul[i]=[];
		}
        for(var i=0;i<this.mytest.questionInfo.questionTypes[2].typeQuestions.length;i++){
        	this.dis[i]=false;
			this.disab[i]=true;
		}
  		this.test=JSON.parse(localStorage.getItem("pTest"));	
		for(var i=0;i<this.test.length;i++){
			this.MyA['questionId'+this.test[i].questionId]=this.test[i].myAnswer;
		}
		for(var i=0;i<this.mytest.questionInfo.questionTypes[0].typeQuestions.length;i++){
			this.a[i]=this.MyA['questionId'+this.mytest.questionInfo.questionTypes[0].typeQuestions[i].questionId];
		}
		for(var i=0;i<this.mytest.questionInfo.questionTypes[1].typeQuestions.length;i++){
			if(this.MyA['questionId'+this.mytest.questionInfo.questionTypes[1].typeQuestions[i].questionId]==null){
				this.myAnswer[i]='';
			}else{
				this.myAnswer[i]=this.MyA['questionId'+this.mytest.questionInfo.questionTypes[1].typeQuestions[i].questionId];
			}
			if(this.mytest.questionInfo.questionTypes[1].typeQuestions[i].answerNum!=1){
				if(this.MyA['questionId'+this.mytest.questionInfo.questionTypes[1].typeQuestions[i].questionId]){
					this.mul[i]=this.MyA['questionId'+this.mytest.questionInfo.questionTypes[1].typeQuestions[i].questionId].split(',');
				}else{
					for(let j=0;j<this.mytest.questionInfo.questionTypes[1].typeQuestions[i].answerNum;j++){
						this.mul[i][j]='';
					}
				}
			}
		}
		for(var i=0;i<this.mytest.questionInfo.questionTypes[2].typeQuestions.length;i++){
			this.url1[i]=this.MyA['questionId'+this.mytest.questionInfo.questionTypes[2].typeQuestions[i].questionId];
		}
		for(var i=0;i<this.mytest.questionInfo.questionTypes[3].typeQuestions.length;i++){
			this.url2[i]=this.MyA['questionId'+this.mytest.questionInfo.questionTypes[3].typeQuestions[i].questionId];
		}	    
    },
    countdown(){
      var end = localStorage.getItem("endT");
      var now = this.sysTime;
      var msec = end - now;
      let hr = parseInt(msec / 1000 / 60 / 60 % 24)
      let min = parseInt(msec / 1000 / 60 % 60)
      let sec = parseInt(msec / 1000 % 60)
      this.hr = hr > 9 ? hr : '0' + hr
      this.min = min > 9 ? min : '0' + min
      this.sec = sec > 9 ? sec : '0' + sec
      const that = this
      setTimeout(function () {
        that.countdown();
        that.sysTime=that.sysTime+1000;
        if(msec<0){ 
			 let data=[];
              if(JSON.parse(localStorage.getItem("pTest")).length==0){
              	data.push({
              		studentId:this.custId,
              	})
              }else{
              	 for(let i in JSON.parse(localStorage.getItem("pTest"))){
	        	data.push({
	        		studentId:this.custId,	
	        		unitName:this.mytest.testInfo.name,
	        		questionId:JSON.parse(localStorage.getItem("pTest"))[i].questionId,
	        		myAnswer:JSON.parse(localStorage.getItem("pTest"))[i].myAnswer,
	        	})
	        	}
              }       
	          submitT(data).then((response) =>{
	          	localStorage.removeItem('pTest');
	    		alert('提交成功');
	    		this.$router.push({
			path:'/peaceTimeList',
			name: '平时测验列表'
		})
	         })
	        .catch((response)=> {
	            alert('提交失败');
	        });
        }
      }, 1000)
    },
    
    //返回顶部
    goTop(){
        document.documentElement.scrollTop = document.body.scrollTop = 0;      
        },
    startRecording(index,type) {
    	for(var i=0;i<this.mytest.questionInfo.questionTypes[2].typeQuestions.length;i++){
			this.disab[i]=true;
			this.dis[i]=true;
		}
    	this.disab[index]=false;
    	if(type==3){this.startRecord1[index]="(中)";this.stopRecord1[index]=""}
        else if(type==4){this.startRecord2[index]="(中)";this.stopRecord2[index]=""}
        HZRecorder.get(function (rec) {
            recorder = rec;
            recorder.start();
        });
    },
    stopRecording(index,type) {
    	if(type==3){this.startRecord1[index]="";this.stopRecord1[index]="(已)"}
        else if(type==4){this.startRecord2[index]="";this.stopRecord2[index]="(已)"}
        recorder.stop();
    },
    uploadAudio(tid,sid,qid,index,type) {
		const _this = this;
		for(var i=0;i<_this.mytest.questionInfo.questionTypes[2].typeQuestions.length;i++){
			_this.dis[i]=false;
		}
		if(type==3){_this.show1[index]=index;}
		else if(type==4){_this.show3[index]=index;}
        const client = new OSS.Wrapper({
            region: _this.region,
            secure: true, 
            accessKeyId: JSON.parse(localStorage.getItem("oss")).accessKeyId,
            accessKeySecret:JSON.parse(localStorage.getItem("oss")).accessKeySecret,
            stsToken: JSON.parse(localStorage.getItem("oss")).securityToken,
            bucket: _this.bucket
        })
         _this.percentage = 0;
              // 随机命名
              let random_name = 'answer/'+sid+"_"+new Date().getTime() + '.wav'
              // 上传
               	var reader = new FileReader();
    			if(recorder==undefined){
    				if(type==3){_this.startRecord1[index]="";_this.stopRecord1[index]="";_this.show1[index]=index+1;_this.show_1[index]=index;}
					else if(type==4){_this.startRecord2[index]="";_this.stopRecord2[index]="";_this.show3[index]=index+1;_this.show_3[index]=index;}
    			}else{
    			reader.readAsArrayBuffer(recorder.getBlob());
    			reader.onload = function (event) {
    			var buffer = new OSS.Buffer(event.target.result);
            	client.put(random_name,buffer, {
                progress: function* (percentage, cpt) {
                  // 上传进度
                  _this.percentage = percentage
                }
              }).then((results) => {
                // 上传完成
                if(type==3){_this.startRecord1[index]="";_this.stopRecord1[index]="";_this.show1[index]=index+1;
                _this.show2[index]=index;}
        		else if(type==4){_this.startRecord2[index]="";_this.stopRecord2[index]="";_this.show3[index]=index+1;
                _this.show4[index]=index;}
                _this.$message.success('上传成功');
                const url = 'https://oraltest2018.oss-cn-hangzhou.aliyuncs.com/'+ results.name;
                _this.url = url;
                if(type==3){_this.url1[index]=url;}
                else if(type==4){_this.url2[index]=url;}
//              saveMA(_this.mytest.questionInfo.examinationPaper.examinationPaperId,tid,sid,qid,url).then((response) => {   	
//		         })
//		        .catch((response)=> {
//		            
//		        });
				let arr = JSON.parse(localStorage.getItem("pTest"));
				let newObj={
					questionId:qid,
					myAnswer:url
				}
				for (let i = 0; i < arr.length; i += 1) {
			      if (arr[i].questionId == newObj.questionId) {
			        arr[i].myAnswer = newObj.myAnswer
			        localStorage.setItem("pTest", JSON.stringify(arr));
			        return
			      } 
			    }
			    arr.push(newObj);
			    localStorage.setItem("pTest", JSON.stringify(arr));
              })
              .catch((err) => { console.log(err) })} }
    },
    saveQ(tid,sid,qid,mas){
//		saveMA(this.mytest.questionInfo.examinationPaper.examinationPaperId,tid,sid,qid,mas).then((response) => {   
//       })
//      .catch((response)=> {
//          
//      });
		let arr = JSON.parse(localStorage.getItem("pTest"));
		let newObj={
			questionId:qid,
			myAnswer:mas
		}
		for (let i = 0; i < arr.length; i += 1) {
	      if (arr[i].questionId == newObj.questionId) {
	        arr[i].myAnswer = newObj.myAnswer
	        localStorage.setItem("pTest", JSON.stringify(arr));
	        return
	      } 
	    }
	    arr.push(newObj);
	    localStorage.setItem("pTest", JSON.stringify(arr));
    },
    saveMQ(tid,sid,qid,i,index){
//  	let answer;
//  	answer = this.mul[index].join(',');
//		saveMA(this.mytest.questionInfo.examinationPaper.examinationPaperId,tid,sid,qid,answer).then((response) => {   
//       })
//      .catch((response)=> {
//          
//      });
		let arr = JSON.parse(localStorage.getItem("pTest"));
		let newObj={
			questionId:qid,
			myAnswer:this.mul[index].join(',')
		}
		for (let i = 0; i < arr.length; i += 1) {
	      if (arr[i].questionId == newObj.questionId) {
	        arr[i].myAnswer = newObj.myAnswer
	        localStorage.setItem("pTest", JSON.stringify(arr));
	        return
	      } 
	    }
	    arr.push(newObj);
	    localStorage.setItem("pTest", JSON.stringify(arr));
    },
    submitTest(){
    	this.$confirm('提交之后将不能进行考试，是否继续?', '提示', { type: 'warning' })
              .then(() => {
              // 向请求服务端提交
              let data=[];
              let a=0;
              if(JSON.parse(localStorage.getItem("pTest")).length==0){
              	data.push({
              		studentId:this.custId,
              	})
              }else{
              	for(let i in JSON.parse(localStorage.getItem("pTest"))){
              	if(JSON.parse(localStorage.getItem("pTest"))[i].myAnswer==null || JSON.parse(localStorage.getItem("pTest"))[i].myAnswer==""){
              		a++;	
              	}else{
              		a+=0;
              	}
	        	data.push({
	        		studentId:this.custId,	
	        		unitName:this.mytest.testInfo.name,
	        		questionId:JSON.parse(localStorage.getItem("pTest"))[i].questionId,
	        		myAnswer:JSON.parse(localStorage.getItem("pTest"))[i].myAnswer,
	        	})
	        	}
              }  
              if(a==JSON.parse(localStorage.getItem("pTest")).length){
              	this.$message.error('答卷不能为空！');
              }else{
              	submitT(data).then((response) => {
	          	localStorage.removeItem('pTest');
	    		alert('提交成功');
	    		this.$router.push({
			path:'/peaceTimeList',
			name: '平时测验列表'
		})
		         })
		        .catch((response)=> {
		            alert('提交失败');
		        });
              } 
          })
          .catch(() => {
              this.$message.info('已取消操作!');
          });
    }
  }
}
</script>

<style>
	body{
		background: #f7f6f6;
		font-family: "微软雅黑";
	}
	.nav{
		width: 100%;
		height: 60px;
		background: #333333;
		margin-bottom: 20px;
		line-height: 60px;
		color: #ffffff;
		font-size: 20px;
	}
	.nav div{
		margin-left: 200px;
	}
	.nav img{
		position: relative;
		top: 5px;
	}
	.testN{
		width: 1020px;
		height: 80px;
		line-height: 60px;
		background: #ffffff;
		color: #40a3fd;
		margin: 0 auto;
		border-radius: 5px;
	}
	.login{
		display: inline-block;
		width: 4px;
		height: 20px;
		background: #40a3fd;
		border-radius: 2px;
		position: relative;
		top: 3px;
		margin-right: 10px;
		margin-left: 20px;
	}
	.testN div{
		width: 1020px;
		margin: 0 auto;
		font-size: 20px;
		line-height: 80px;
	}
	.testC{
		width: 1020px;
		height: 100px;
		margin: 0 auto;
		background: #ffffff;
	}
	.testSpan img{
		width: 18px;
		height: 18px;
	}
	/*.questionS img{
		width: 300px;
		height: 180px;
	}*/
	.testSpan{
		margin-right: 30px;
	}
	.testSpan img{
		position: relative;
		top: 3px;
		margin-right: 5px;
	}
	.testT{
		/*margin-top: 20px;*/
		margin-bottom: 30px;
		width: 100%;
		height: 110px;
		background: #ffffff;
		box-shadow: 2px 2px 10px #e5f1ff;
		border-radius: 5px;
	}
	.test{
		background: #ffffff;
		box-shadow: 2px 2px 10px #e5f1ff;
		border-radius: 5px;
		margin-bottom: 30px;
	}
	.testTop{
		text-indent: 2em;
		width: 100%;
		height: 60px;
		line-height: 60px;
		background: #68b6fe;
		margin-top: 10px;
		color: white;
	}
	.questionA{
		padding: 20px;
	}
	.questionA input{
		border: none;
		border-bottom: 1px solid darkgray;
		text-align: center;
		outline: none;
	}
	.questionS{
		background: #fffff;
		/*height: 100px;*/
		width: 90%;
		padding: 20px 20px 15px 20px;
	}
	.testQuestion{
		border: 1px solid #f6f4f4;
		padding: 15px 20px 15px 20px;
		position: relative;
	}
	.testCon{
		height: 70px;
		border-bottom: 1px solid #e5f1ff;
		line-height: 70px;
	}
	.testTime{
		color: red;
		font-size: 16px;
		margin-left: 20px;
	}
	.testJ{
		position: relative;
		top: -100px;
		float: right;
		margin-top: 20px;
		margin-right: 40px;
	}
	.questionX{
		display: inline-block;
		width: 80px;
		height: 40px;
		line-height: 40px;
		text-align: center;
	}
	.questionXS{
		border-top: 1px solid #40a3fd;
	}
	.questionX:hover{
		border-top: 1px solid #40a3fd;
		background: #f7f6f6;
	}
	.el-radio-group{
		display: block;
		line-height: 40px;
		margin-left: 20px;
	}
	.aud{
		margin-left: 14px;
		margin-bottom: 15px;
	}
	.tScore{
		position: absolute;
		top: 35px;
		right: 40px;
	}
	.qaud{
		position: relative;
		top: -25px;
		left: 20px;
	}
	.qaud_{
		position: relative;
		top: -10px;
	}
	.auop{
		width: 80px;
		height: 20px;
		line-height: 0;
		padding-left: 0;
		padding-right: 0;
		text-align: center;
	}
	.testL img{
		cursor: pointer;
		transition: all 0.6s;
	}
	.testL img:hover{
		transform: scale(2);
		margin-left: 30%;
	}
</style>