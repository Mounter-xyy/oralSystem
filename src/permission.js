import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken,removeToken,getUserType,getCode,removeCode } from '@/utils/auth' // 验权

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    	if(to.path==='/dashboard'&&getUserType()==1){
      next({ path: '/studentTest' })
      NProgress.done()
      
    	}
    	else if(to.path==='/studentTest'&&getUserType()==2){
    	next({ path: '/dashboard' })
      NProgress.done()
		  }
    	else if(to.path!='/login'&&getCode()=="X1500090000"){
    	next({ path: '/login' })
      NProgress.done()
      removeCode()
      removeToken()
    	}
			else {
        next()
     }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
