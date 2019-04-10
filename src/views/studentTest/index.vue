<template>
	<div style="background: #f7f6f6;font-family: '微软雅黑';">
	<navT />
		<div class="studentContent">
			<p class="studentP">
				<img src="../../assets/img/icon_25.png" class="imgM"/>&nbsp;&nbsp;个人信息
				<span @click="logout" style="float: right;cursor: pointer;"><img src="../../assets/img/out.png" class="imgO"/>退出</span>
			</p>
			<div class="pers" style="display: flex;">
				<img src="../../assets/img/men.jpg" v-if="studentSex=='1'" style="margin-right: 30px;"/>
				<img src="../../assets/img/women.jpg" v-if="studentSex=='2'" style="margin-right: 30px;"/>
				<ul style="display: flex;list-style: none;">
					<li><img src="../../assets/img/icon_07.png" />&nbsp;&nbsp;<span>姓名：{{studentName}}</span></li>
					<li><img src="../../assets/img/icon_04.png" />&nbsp;&nbsp;<span v-if="studentSex=='1'">性别：男</span><span v-if="studentSex=='2'">性别：女</span></li>
					<li><img src="../../assets/img/icon_10.png" />&nbsp;&nbsp;<span>学号：{{studentCode}}</span></li>
					<li style="overflow: hidden;text-overflow: ellipsis;white-space:nowrap"><img src="../../assets/img/icon_16.png" />&nbsp;&nbsp;<span>所属院校：{{schoolName}}</span></li>
					<li style="overflow: hidden;text-overflow: ellipsis;white-space:nowrap"><img src="../../assets/img/icon_18.png" />&nbsp;&nbsp;<span>班级：{{className}}</span></li>
					<li><img src="../../assets/img/icon_20.png" />&nbsp;&nbsp;<span style="color: #74bcfe;cursor: pointer;" @click="editPasswordVisible=true">修改个人信息</span></li>
				</ul>
			</div>
			<div class="manag">
				<div class="managT">
					<p class="studentP">
						<img src="../../assets/img/icon_25.png" class="imgM"/>&nbsp;&nbsp;考试管理
					</p>
					<div class="testM">
						<div style="height: 158px;">
						<div v-show="mytest.length==0" style="color: #777777;">当前暂无考试...</div>
						<div v-for="(item,index) in mytest" v-if="index<4">
							<span style="width: 105px;height:28px;margin-right:40px;display: inline-block;overflow: hidden;text-overflow: ellipsis;white-space:nowrap">{{item.testName}}</span>
							<span style="margin-right: 40px;">{{ item.startTime | moment('YYYY-MM-DD HH:mm')}}&nbsp;至&nbsp;{{ item.endTime | moment('YYYY-MM-DD HH:mm')}}</span>
							<span style="color: #ffd89a;" v-if="time>item.startTime">进行中</span>
							<span style="color: #8ebc77;" v-if="time<item.startTime">未开始</span>
							<span style="color: #ff828b;" v-if="time>item.endTime">已结束</span>
						</div>
						</div>
						<button  class="buttonM" @click="lookT" style="margin-top: 35px;margin-left: 60px;">综合测试入口</button>
						<button  class="buttonM" @click="lookL" style="margin-top: 35px;margin-left: 60px;">随堂练习入口</button>
					</div>
				</div>
				<div class="managS">
					<p class="studentP">
						<img src="../../assets/img/icon_25.png" class="imgM"/>&nbsp;&nbsp;成绩管理
					</p>
					<div class="scoreM">
						<!--<div><span style="width: 120px;display: inline-block;">优秀成绩门数</span><span><div style="border-top:1px dashed #cccccc;height: 1px;width:100px;overflow:hidden;display: inline-block;"></div></span><span style="color: #6fbdff;margin-left: 20px;">3</span></div>
						<div><span style="width: 120px;display: inline-block;">良好成绩门数</span><span><div style="border-top:1px dashed #cccccc;height: 1px;width:100px;overflow:hidden;display: inline-block;"></div></span><span style="color: #6fbdff;margin-left: 20px;">3</span></div>-->
						<!--<div><span style="width: 120px;display: inline-block;">及格成绩门数</span><span><div style="border-top:1px dashed #cccccc;height: 1px;width:100px;overflow:hidden;display: inline-block;"></div></span><span style="color: #6fbdff;margin-left: 20px;">{{people.gradeA}}</span></div>
						<div><span style="width: 120px;display: inline-block;">不合格成绩门数</span><span><div style="border-top:1px dashed #cccccc;height: 1px;width:100px;overflow:hidden;display: inline-block;"></div></span><span style="color: red;margin-left: 20px;">{{people.gradeB}}</span></div>
						-->
						<img src="../../assets/img/score.png" />
						<button class="buttonM" style="margin-left: 0;" @click="lookS">成绩查询入口</button>
					</div>
				</div>
			</div>
		</div>
		<el-dialog title="修改密码" :visible.sync="editPasswordVisible"  :close-on-click-modal="false" :close-on-press-escape="false">
			<el-form id="#update" :model="params" :rules="rules" ref="update" label-width="100px">
				<el-form-item label="原密码" prop="oldPassword">
			        <el-input type="password" v-model="params.oldPassword"></el-input>
			    </el-form-item>
			   	<el-form-item label="新密码" prop="newPassword">
			        <el-input type="password" v-model="params.newPassword"></el-input>
			    </el-form-item>
			    <el-form-item label="确认密码" prop="new1Password">
			        <el-input type="password" v-model="params.new1Password"></el-input>
			    </el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
			    <el-button @click="editPasswordVisible = false">取 消</el-button>
			    <el-button type="primary" @click="editP">确 定</el-button>
			</div>
		</el-dialog>
	</div>	
</template>

<script>
import { editPassword,getMyTest } from '@/api/student'
import navT from '../common/nav/index'
import md5 from 'js-md5'

export default {
	data(){
		var validatePass = (rule, value, callback) => {            
                            if (value === '') {
                                callback(new Error('请再次输入密码'));
                              } else if (value !== this.params.newPassword) {
                                callback(new Error('两次输入密码不一致!'));
                              } else {
                                callback();
                              }
        };
		return{
			editPasswordVisible:false,
			mytest:[],
			people:[],
			time:'',
			params:{
				oldPassword:'',
				newPassword:'',
				new1Password:''
			},
			obj:{
				paramsMap:{
					oldPassword:'',
					newPassword:'',
					new1Password:''
				}
			},
			studentName:localStorage.getItem("studentName"),
			studentCode:localStorage.getItem("studentCode"),
			studentSex:localStorage.getItem("studentSex"),
			schoolName:localStorage.getItem("schoolName"),
			className:localStorage.getItem("className"),
			rules:{
					oldPassword:{ required: true, message: '密码不能为空', trigger: 'blur' },
					newPassword:[{ required: true, message: '请输入密码', trigger: 'blur' },
                  		{ min: 6, max: 25, message: '长度在 6 到 25 个字符'}],
                    new1Password:[
                        {validator: validatePass, trigger: 'blur' }
                    ]    
                }
		}
	},
	components: {
        navT
   },
  mounted: function() {
      this.getMT();
      	//禁止页面回退
      	history.pushState(null, null, document.URL);
		window.addEventListener('popstate', function () {
		    history.pushState(null, null, document.URL);
		});
  },
  methods: {
  	editP(){
  		this.$refs.update.validate((valid) => {
        if (valid) { 
  		this.obj.paramsMap.oldPassword=md5(this.params.oldPassword);
  		this.obj.paramsMap.newPassword=md5(this.params.newPassword);
  		editPassword(this.obj).then(response => {
          this.editPasswordVisible=false;
          this.paramsMap={};
          if(response.status=="1"){
          	this.$message.success("修改密码成功！")
          }
        }).catch(error => {
          reject(error)
        })
       }
        })
  	},
  	//获取我的考试信息
  	getMT(){
  		getMyTest().then((response) => {
  			this.people = response.data;	
            this.mytest = response.data.undoneRows;
            this.time = response.data.sysTime;
           })
          .catch((response)=> {
              this.$message.error(response.data.error);
          });
  	},
  	//跳转考试详情页
  	lookT(){
  		this.$router.push({
  			path:'/myTestUnDone',
  			name: '我的考试呀'
  		})
  	},
  	lookL(){
		this.$router.push({
			path:'/peaceTimeList',
			name: '平时测验列表'
		})
  	},
  	lookS(){
  		this.$router.push({
  			path:'/myTestDone',
  			name: '我的考试'
  		})
  	},
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
	
</script>

<style>
		.studentContent{
			width: 1020px;
			margin: 0 auto;
			margin-bottom: 40px;
		}
		.studentP{
			line-height: 38px;
			color: #75bdfe;
			font-size: 18px;
		}
		.pers{
			width: 1020px;
			background: white;
			border-radius: 10px;
			height: 190px;
			box-shadow: 2px 2px 10px #e5f1ff;
			font-size: 16px;
			color: #777777;
			padding-top: 36px;
			padding-left: 30px;
			padding-bottom: 36px;
		}
		.pers ul{	
			flex-flow: wrap;
		}
		.pers li{
			width: 220px;
			height: 34px;
			margin-right: 50px;
			line-height: 34px;
			margin-bottom: 20px;
		}
		.pers li:hover{
			overflow: visible !important;
		}
		.pers li img{
			position: relative;
			top: 2px;
		}
		.manag{
			display: flex;
			justify-content: space-between;
		}
		.managT{
			width: 606px;
		}
		.managS{
			width: 351px;
		}
		.testM{
			width: 606px;
			height: 305px;
			background: white;
			border-radius: 10px;
			box-shadow: 2px 2px 10px #e5f1ff;
			padding-top: 30px;
			padding-left: 30px;
		}
		.testM span,.scoreM span{
			font-size: 16px;
			color: #777777;
		}
		.testM div,.scoreM div{
			line-height: 40px;
		}
		.scoreM{
			width: 351px;
			height: 305px;
			text-align: center;
			background: white;
			border-radius: 10px;
			box-shadow: 2px 2px 10px #e5f1ff;
			padding-top: 30px;
		}
		.scoreM div{
			line-height: 80px;
		}
		.imgM{
			position: relative;
			top: 5px;
		}
		.buttonM{
			width: 180px;
			height: 40px;
			line-height: 36px;
			text-align: center;
			border: 1px solid #75bdfe;
			border-radius: 18px;
			color: #75bdfe;
			background: none;
			/*margin-left: 175px;*/
			margin-top: 30px;
			cursor: pointer;
			outline:none;
		}
		.buttonM:hover{
			background: #75bdfe;
			color: white;
		}
		.imgO{
			position: relative;
			top: 8px;
			left: -5px;
		}
</style>
<style >
	body{
		background: #f7f6f6;
	}
</style>