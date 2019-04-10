<template>
	<div class="Logi">
	<div class="loginImg"></div>
  <div class="login-container">
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left">
      <p class="ctitle">浙江省中职实用英语口语学习与测试平台</p>
      <p class="etitle">Practical English Oral Examination System</p>
      <el-form-item prop="username" class="bor">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user" />
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item prop="password" class="bor">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input name="password" :type="pwdType" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on"
          placeholder="请输入密码"></el-input>
          <span class="show-pwd" @click="showPwd"><svg-icon icon-class="eye" /></span>
      </el-form-item>
      <el-form-item prop="chooseSchool" class="choose">
        <span class="svg-container">
          <svg-icon icon-class="school" style="width: 18px;height: 18px;"/>
        </span>
        <el-select v-model="loginForm.chooseSchool" filterable placeholder="请选择学校">
        	<el-option label="杭州东博" value="0"></el-option>
			<el-option v-for="item in school" :value="item.schoolId" :label="item.schoolName"></el-option>
		</el-select>
		<hr style="height:1px;border:none;border-bottom: 1px solid #dcdcdc;"/>
		
      </el-form-item>
      <el-form-item class="userType">
      	<el-radio-group v-model="loginForm.userType">
          <el-radio label="1">学生</el-radio>
          <el-radio label="2">教师</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item style="text-align: center;">
        <el-button type="primary" style="width:90%;border-radius: 50px;margin-top: 20px;" :loading="loading" @click.native.prevent="handleLogin">
          登录
        </el-button>
      </el-form-item>
      <!--<div class="tips">
        <span style="margin-right:20px;">username: admin</span>
        <span> password: admin</span>
      </div>-->
    </el-form>
  </div>
  </div>
</template>

<script>
import { isvalidUsername } from '@/utils/validate'
import { getChooseSchool } from '@/api/manage'

export default {
  name: 'login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!isvalidUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else {
        callback()
      }
    }
    const validatePass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位'))
      } else {
        callback()
      }
    }
    return {
    	school:[],
    	chooseSchool:null,
      loginForm: {
        username: '',
        password: '',
        userType: '1',
        chooseSchool:null
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }]
      },
      loading: false,
      pwdType: 'password'
    }
  },
   mounted:function(){
		this.getSch();
    },
  methods: {
  	getSch(){
    		getChooseSchool().then((response) => {
             this.school = response.data;
           })
          .catch((response)=> {
              this.loading = false;
          });
    	},
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.loading = false
            if(this.loginForm.userType=="1"){
            	this.$router.push({ path: '/studentTest' })
            }else{
            	this.$router.push({ path: '/' })
            }
            
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg:#2d3a4b;
$light_gray:#eee;
.Logi{
	display: flex;
	height: 100%;
}
.loginImg{
	width: 61.8%;
	height: 100%;
	background-image: url(../../assets/img/home.jpg);
	background-size: 100% 100%;
	background-repeat: no-repeat;
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #a1a1a1;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px transparent inset !important;
        -webkit-text-fill-color: #a1a1a1 !important;
      }
    }
  }
  .bor{
  	/*border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.4);
    border-radius: 5px;*/
    border-bottom: 1px solid #dcdcdc;
  }
  /*.el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.4);
    border-radius: 5px;
    color: #454545;
  }*/
  .userType{
  	color: #777777;
  }
  .userType div{
  	margin-left: 8px;
  }
  .el-form-item__content{
  	line-height: 0px;
  }
  .el-form-item{
  	width: 50%;
  	margin: 0 auto;
  	margin-bottom: 20px;
  }
  .el-input__inner{
  -webkit-text-fill-color: #a1a1a1;
	caret-color: #a1a1a1; /* 光标颜色 */
  }
  .el-input__inner:focus { outline: none; }
  .el-input__inner:-webkit-autofill{ 　-webkit-text-fill-color: #000 !important;　-webkit-text-fill-color: #a1a1a1fff;
transition: background-color 5000s ease-in-out 0s; } /* 谷歌浏览器去除记住密码的黄色框 */
}
	
	.choose .el-select{
		display: inline;
	}
	.choose i{
		color: #409eff !important;
		position: relative;
		left: 8px;
	}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
.login-container {
	width: 38.2%;
	height: 100%;
	display: inline-block;
  /*position: fixed;
  height: 100%;
  width: 100%;
  background-image: url(../../assets/img/bg3.jpg);
  background-size: 100%;*/
  /*.login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 550px;
    height: 420px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
    background: rgba(255,255,255,0.7);
    border-radius: 10px;
  }*/
  .tips {
    font-size: 14px;
    color: #a1a1a1;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color:#409eff;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .ctitle {
  	margin-top: 20%;
    font-size: 28px;
    color: #409eff;
    /*line-height: 0px;*/
    text-align: center;
  }
  .etitle{
  	color: #409eff;
  	font-size: 18px;
  	letter-spacing: 1px;
  	text-align: center;
  	margin-bottom: 50px;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 15px;
    font-size: 16px;
    color: #409eff;
    cursor: pointer;
    user-select: none;
  }
}
</style>
