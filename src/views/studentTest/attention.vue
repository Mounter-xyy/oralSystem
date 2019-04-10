<template>
	<div style="padding-top: 80px;">
		<div class="attention">
			<div class="atts">注意事项</div>
			<div class="attp">
				<p><span class="yuan">1</span>检查浏览器是否可以正常使用。浏览器除IE以外都可，如果是360浏览器需设置成极速模式。</p>
				<p><span class="yuan">2</span>学生点击开始考试，若试卷一直加载，查看右上角浏览器是否拦截。<br />
				<span class="yuan1"></span>若拦截，点击始终允许，刷新浏览器并再次点击开始考试。</p>
				<p><span class="yuan">3</span>学生答题时，简答题录完上一题才能点击下一题录音。（录完是指提交完，并且有上传成功的标识，<br />
				<span class="yuan1"></span>不能同时点击不同题的录音按钮）若要修改此题，可等提交完再次点击录音。朗诵题同。</p>
				<p><span class="yuan">4</span>学生答题结束需点击交卷按钮并确认交卷，否则成绩会是0分。</p>
				<p><span class="yuan">5</span>试卷顶部会显示交卷的剩余时间，当剩余时间为0时，系统将自动提交答卷。</p>
			</div>
		</div>
		<div style="width: 1020px;margin: 0 auto;margin-top: 40px;">
			加载试卷：<el-progress :percentage="progressing" color="#68b6fe"></el-progress>
		</div>
		<div style="text-align: center;margin-top: 20px;">
		<button class="startB" @click="startT">我知道了，开始考试</button>
		</div>
	</div>
</template>

<script>
	
import { getMTQ } from '@/api/student'
export default {
	data(){
		return{
			progressing:0,
			status:'',
		}
	},
	methods: {
		startT(){
		let testId = this.$route.query.testId;
		var _this = this
		clearInterval(this.time);
	       this.time = setInterval(function(){            
	           if(_this.progressing<100){
	               _this.progressing += 10;//进程条
	           }else{                 
	           }          
	       },500)
		getMTQ(testId).then((response) => {
              if(!JSON.parse(localStorage.getItem("test"))){
//            	localStorage.setItem("test", JSON.stringify([]));
				let arr=[];
				for(let i in response.data.questionInfo.questionTypes){
					for(let j in response.data.questionInfo.questionTypes[i].typeQuestions){
						arr.push({
							questionId:response.data.questionInfo.questionTypes[i].typeQuestions[j].questionId,
							myAnswer:null
						})
					}
				}
				localStorage.setItem("test", JSON.stringify(arr));
              }
              localStorage.setItem("mytests", JSON.stringify(response.data));
              this.progressing = 100;
              clearInterval(this.time);
              if(response.status=="1"){
				const {href} = this.$router.resolve({
				name: '开始考试'
				});
				window.open(href,'_blank')
				}
           })
          .catch((response)=> {
              this.$message.error(response.error.message);
//            clearInterval(this.time);
          });
//		let timer =	setInterval(() => {this.dTime++;if(this.status!="1"){this.dTime=0};if(this.dTime==100){
//			clearInterval(timer);
//			if(this.status=="1"){
//			const {href} = this.$router.resolve({
//			name: '开始考试'
//		});
//		window.open(href,'_blank')}
//		}},25);
		}
	}
}
</script>

<style>
	body{
		background: #f7f6f6;
		font-family: "微软雅黑";
		
	}
	.attention{	
		width: 1020px;
		height: 400px;
		margin: 0 auto;
		background: #ffffff;
		box-shadow: 2px 2px 10px #e5f1ff;
		border-radius: 10px;
	}
	.atts{
		width: 100%;
		height: 60px;
		background: #68b6fe;
		border-radius: 10px 10px 0 0;
		line-height: 60px;
		text-indent: 20px;
		font-size: 18px;
		color: white;
	}
	.attp{
		padding: 20px 80px 0 80px;
	}
	.attp p{
		margin-bottom: 25px;
	}
	.yuan{
		width: 25px;
		height: 25px;
		background: #68b6fe;
		border-radius: 50%;
		text-align: center;
		color: white;
		box-shadow: 0px 0px 8px 2px #68b6fe;
		display: inline-block;
		margin-right: 20px;
		line-height: 25px;
	}
	.yuan1{
		width: 25px;
		height: 25px;
		display: inline-block;
		margin-right: 20px;
	}
	.startB{
		width: 200px;
		height: 50px;
		line-height: 48px;
		text-align: center;
		background: #f76a2c;
		border: none;
		border-radius: 5px;
		cursor: pointer;
		outline: none;
		color: white;
	}
</style>