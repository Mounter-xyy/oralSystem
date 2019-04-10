<template>
	<div>
		<div class="nav">
			<div><img src="../../assets/img/welcome.png" />&nbsp;&nbsp;&nbsp;{{studentName}}同学，欢迎您!</div>
		</div>
		<div class="testN">
			<div><span class="login"></span>综合测试卷<span class="totalS">得分：{{totalScore}}分</span></div>
		</div>
		<div class="testC" style="height: 80px;">
			<span class="testSpan" style="margin-left: 20px;"><img src="../../assets/img/test1.png" />考生：{{studentName}}</span>
			<span class="testSpan"><img src="../../assets/img/test3.png" />总分：{{peaceTotalScore}}分</span>
			<span class="testSpan"><img src="../../assets/img/test4.png" />题目总数：{{mytest[0].typeQuestions.length+mytest[1].typeQuestions.length+mytest[2].typeQuestions.length+mytest[3].typeQuestions.length}}小题</span>
			<div class="testT" style="height: 60px;">
				<div class="testCon" style="height: 20px;"></div>
				<div>
					<span class="questionX" @click="type=1;i=1" :class="{questionXS:i===1}" v-if="mytest[0].typeQuestions.length!=0">单选题</span>
					<span class="questionX" @click="type=2;i=2" :class="{questionXS:i===2}" v-if="mytest[1].typeQuestions.length!=0">填空题</span>
					<span class="questionX" @click="type=3;i=3" :class="{questionXS:i===3}" v-if="mytest[2].typeQuestions.length!=0">简答题</span>
					<span class="questionX" @click="type=4;i=4" :class="{questionXS:i===4}" v-if="mytest[3].typeQuestions.length!=0">朗诵题</span>
				</div>
			</div>
			<div class="test" v-if="type==1">
				<div class="testTop">看题选择正确的答案（共{{mytest[0].typeQuestions.length}}小题）</div>
				<div class="testQuestion" v-for="(item,index) in mytest[0].typeQuestions">
					<div v-html="index+1+'.'+item.questionStem.replace(/<p>/g,'')" class="questionS"></div>
					<span class="tScore">共：{{item.questionScore}}分</span>
					<span class="dScore">得：{{item.myScore}}分</span>
					<audio
					controls="controls"
					preload="auto" 
					:src="item.fileUrl" v-if="item.fileUrl!=null && item.fileUrl!=undefined && item.fileUrl!=''" class="aud">
    				</audio>	
					<div v-for="(item1,index1) in item.options" class="rChoose">
						<div>{{item1.optionName}}.{{item1.optionValue}}</div>
					</div>
					<div class="answe" :class="item.isRight==2?'answe':'answe_'">我的答案：{{item.myAnswer}}</div>
					<div class="answe">正确答案：{{item.standardAnswer}}</div>
				</div>
			</div>
			<div class="test" v-if="type==2">
				<div class="testTop">看题填入正确的答案（共{{mytest[1].typeQuestions.length}}小题）</div>
				<div class="testQuestion" v-for="(item,index) in mytest[1].typeQuestions">
					<div v-html="index+1+'.'+item.questionStem.replace(/<p>/g,'')" class="questionS"></div>
					<span class="tScore">共：{{item.questionScore}}分</span>
					<span class="dScore">得：{{item.myScore}}分</span>
					<audio
					controls="controls"
					preload="auto" 
					:src="item.fileUrl" v-if="item.fileUrl!=null && item.fileUrl!=undefined && item.fileUrl!=''" class="aud">
    				</audio>	
					<div class="answe" :class="item.isRight==2?'answe':'answe_'">我的答案：{{item.myAnswer}}</div>
					<div class="answe">正确答案：{{item.standardAnswer}}</div>
				</div>
			</div>
			<div class="test" v-if="type==3">
				<div class="testTop">听录音答题（共{{mytest[2].typeQuestions.length}}小题）</div>
				<div class="testQuestion" v-for="(item,index) in mytest[2].typeQuestions">
					<div v-html="index+1+'.'+item.questionStem.replace(/<p>/g,'')" class="questionS"></div>
					<span class="tScore">共：{{item.questionScore}}分</span>
					<span class="dScore">得：{{item.myScore}}分</span>
					<span class="qaud">题目录音：</span>
					<audio
					controls="controls"
					preload="auto" 
					:src="item.fileUrl" v-if="item.fileUrl!=null && item.fileUrl!=undefined && item.fileUrl!=''" class="aud">
    				</audio>
    				<div style="margin-bottom: 30px;margin-left: 20px;"><span class="qaud_">我的录音：</span><audio controls="controls" :src="item.myAnswer" ></audio></div>
    				<div class="answe" :class="item.isRight==2?'answe':'answe_'">我的答案：{{item.myTranslate}}</div>
					<div class="answe">正确答案：{{item.standardAnswer}}</div>
				</div>
			</div>
			<div class="test" v-if="type==4">
				<div class="testTop">请朗诵题目（共{{mytest[3].typeQuestions.length}}小题）</div>
				<div class="testQuestion" v-for="(item,index) in mytest[3].typeQuestions">
					<div v-html="index+1+'.'+item.questionStem.replace(/<p>/g,'')" class="questionS"></div>
					<span class="tScore">共：{{item.questionScore}}分</span>
					<span class="dScore">得：{{item.myScore}}分</span>
					<div style="margin-bottom: 30px;margin-left: 20px;"><span class="qaud_">我的录音：</span><audio controls="controls" :src="item.myAnswer" ></audio></div>
					<div class="answe" :class="item.isRight==2?'answe':'answe_'">我的答案：{{item.myTranslate}}</div>
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
import { saveMA,getMA,submitT,getPeaceRecord } from '@/api/student'
import { getOT } from '@/api/login'
import { getUserType } from '@/utils/auth'
import ScrollTop from '../studentTest/ScrollTop'
import '../../../static/HZRecorder'
var recorder;
var audio = document.querySelector('audio');

export default {
	data(){
		return{
			mytest:[],
			studentName:localStorage.getItem("studentName"),
			a:[],
			type:1,
			i:1,
			score1:0,
			score2:0,
			score3:0,
			score4:0,
			totalScore:0,
			peaceTotalScore:0
		}
	},
	mounted: function () {
	this.getR();
	if(getUserType()==2){
		this.studentName=this.$route.query.studentName;
	}
  	},
  	components:{
  		'scroll-top':ScrollTop
  	},
	methods: { 
	
	getR(){
		let data={};
		data.unitPaperId = this.$route.query.unitPaperId;
		data.studentId = this.$route.query.studentId;
		this.totalScore = this.$route.query.testScore;
		let userType = getUserType();
		getPeaceRecord(data).then((response) => {
			this.peaceTotalScore=0;
    		this.mytest=response.data;
    		for(var i=0;i<response.data[0].typeQuestions.length;i++){
    			this.peaceTotalScore+=response.data[0].typeQuestions[i].questionScore;
    		}
    		for(let i=0;i<response.data[1].typeQuestions.length;i++){
    			this.peaceTotalScore+=response.data[1].typeQuestions[i].questionScore;
    		}
    		for(let i=0;i<response.data[2].typeQuestions.length;i++){
    			this.peaceTotalScore+=response.data[2].typeQuestions[i].questionScore;
    		}
    		for(let i=0;i<response.data[3].typeQuestions.length;i++){
    			this.peaceTotalScore+=response.data[3].typeQuestions[i].questionScore;
    		}
    		
         })
        .catch((response)=> {
//          this.$message.error(response.error.message);
        });
	},
    //返回顶部
    goTop(){
        document.documentElement.scrollTop = document.body.scrollTop = 0;      
        },
 
    
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
	.questionS img{
		width: 300px;
		height: 180px;
	}
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
	.dScore{
		position: absolute;
		top: 65px;
		right: 40px;
		color: red;
	}
	.qaud{
		position: relative;
		top: -26px;
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
	.rChoose{
		padding: 0 0 15px 20px;
	}
	.answe{
		padding: 10px 0 15px 20px;
		color: green;
	}
	.answe_{
		color: red;
	}
	.totalS{
		float: right;
		color: red;
		font-weight: bold;
		font-size: 20px;
		margin-right: 50px;
	}
</style>