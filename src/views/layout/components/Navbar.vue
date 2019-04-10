<template>
  <el-menu class="navbar" mode="horizontal">
    <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    <breadcrumb></breadcrumb>
   	<!--<span style="position: absolute;left: 35%;font-size: 22px;color: #409EFF;font-weight: bold;">瑞安市职业中等专业教育集团学校</span>-->
    <el-dropdown class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
      	
        <img class="user-avatar" src="../../../assets/img/teacherAdmin.png">
        <i class="el">{{teacherName}}</i>
      </div>
      <el-dropdown-menu class="user-dropdown" slot="dropdown">
        <router-link class="inlineBlock" to="/">
          <el-dropdown-item>
            	首页
          </el-dropdown-item>
        </router-link>
        <el-dropdown-item divided style="padding: 0;">
          <span @click="logout" style="display:block;text-align: center;">登出</span>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
export default {
	data(){
		return{
			teacherName:localStorage.getItem("teacherName"),
		}
	},
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters([
    	'name',
      'sidebar',
      'avatar'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // 为了重新实例化vue-router对象 避免bug
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 30px;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el {
      	position: relative;
      	top: -10px;
        font-size: 16px;
      }
    }
  }
}
.el-dropdown-menu__item--divided:before{
	margin: 0;
}
</style>

