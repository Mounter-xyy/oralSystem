import { loginS,loginT,logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken,setCustId,setUserType } from '@/utils/auth'
import md5 from 'js-md5'
const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = md5(userInfo.password.trim())
      const userType = userInfo.userType.trim()
      const schoolId = userInfo.chooseSchool
      setUserType(userType)
      if(schoolId==null){
      	alert("请选择学校");
      }
      else if(schoolId!=null&&userType==1){
      return new Promise((resolve, reject) => {
        loginS(username,password,userType,schoolId).then(response => {
          const data = response.data
          console.log(data)
          setToken(data.token)
          setCustId(data.custId)
          commit('SET_TOKEN', data.token)
          localStorage.setItem("custId",data.custId);
          localStorage.setItem("studentName",data.studentName);
          localStorage.setItem("studentCode",data.studentCode);
          localStorage.setItem("studentSex",data.studentSex);
          localStorage.setItem("schoolName",data.schoolName);
          localStorage.setItem("className",data.className);
          resolve()
        }).catch(error => {
          reject(error)
        })
      })}else if(schoolId!=null&&userType==2){
      	return new Promise((resolve, reject) => {
        loginT(username,password,userType,schoolId).then(response => {
          const data = response.data
          console.log(data)
          setToken(data.token)
          setCustId(data.custId)
          commit('SET_TOKEN', data.token)
          localStorage.setItem("teacherName",data.teacherName);
          localStorage.setItem("teacherLevel",data.teacherLevel);
          localStorage.setItem("schoolId",data.schoolId);
          localStorage.setItem("custId",data.custId);
          localStorage.setItem("accessKeyId",data.accessKeyId);
          localStorage.setItem("accessKeySecret",data.accessKeySecret);
          localStorage.setItem("securityToken",data.securityToken);
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
      }
      
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
//    return new Promise((resolve, reject) => {
//      getInfo(state.token).then(response => {
//        const data = response.data
//        if (data) { // 验证返回的roles是否是一个非空数组
//          commit('SET_ROLES', data.custId)
//        } else {
//          reject('getInfo: data must be a non-null array !')
//        }
//        commit('SET_NAME', data.custName)
//        commit('SET_AVATAR', "https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif?")
//        resolve(response)
//      }).catch(error => {
//        reject(error)
//      })
//    })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
        	localStorage.removeItem('mytests');
        	localStorage.removeItem('test');
        	localStorage.removeItem('pTest');
        	localStorage.removeItem('peaceTest');
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}
export default user
