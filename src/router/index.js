import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  	{ path: '/login', component: () => import('@/views/login/index'), hidden: true },
  	{ path: '/404', component: () => import('@/views/404'), hidden: true },
	{path: '/studentTest',component: () => import('@/views/studentTest/index'), hidden: true},
	{path: '/myTestDone',name: '我的考试',component: () => import('@/views/studentTest/myTestDone'), hidden: true},
	{path: '/peaceTime',name: '平时测验',component: () => import('@/views/studentTest/peaceTime'), hidden: true},
	{path: '/peaceTimeList',name: '平时测验列表',component: () => import('@/views/studentTest/peaceTimeList'), hidden: true},
	{path: '/myTestUnDone',name: '我的考试呀',component: () => import('@/views/studentTest/myTestUnDone'), hidden: true},
	{path: '/attention',name: '注意事项',component: () => import('@/views/studentTest/attention'), hidden: true},
	{path: '/startTest',name: '开始考试',component: () => import('@/views/studentTest/startTest'), hidden: true},
	{path: '/record',name: '答题记录',component: () => import('@/views/studentTest/record'), hidden: true},
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    name: 'Dashboard',
    meta: { requiresAuth: true },
    hidden: true,
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index')
    }]
  },

  {
    path: '/example',
    component: Layout,
    redirect: '/example/teacher',
    name: 'Example',
    meta: { title: '教学管理', icon: 'teachmanage' },
    children: [
    {
        path: 'school',
        name: 'School',
        component: () => import('@/views/school/index'),
        meta: { title: '学校管理', icon: 'school' }
      },
      {
        path: 'teacher',
        name: 'Teacher',
        component: () => import('@/views/teacher/index'),
        meta: { title: '教师管理', icon: 'teacher' }
      },
      {
        path: 'class',
        name: 'Class',
        component: () => import('@/views/class/index'),
        meta: { title: '班级管理', icon: 'class' }
      },
      {
        path: 'student',
        name: 'Student',
        component: () => import('@/views/student/index'),
        meta: { title: '学生管理', icon: 'student' }
      },
       {
        path: 'peaceList',
        name: 'PeaceList',
        component: () => import('@/views/student/peaceList'),
        hidden: true
      },
      {
        path: 'detailScore',
        name: 'DetailScore',
        component: () => import('@/views/student/detailScore'),
        hidden: true
      }
    ]
  },
	{
    path: '/question',
    component: Layout,
    redirect: '/question/index',
    meta: { title: '考试管理', icon: 'testmanage' }, 
    children: [
    	{
        path: 'question',
        name: 'Question',
        component: () => import('@/views/question/index'),
        meta: { title: '题库管理', icon: 'tree' }
      },
      {
        path: 'test',
        name: 'Test',
        component: () => import('@/views/test/index'),
        meta: { title: '试卷管理', icon: 'test' }
      },
      {
        path: 'task',
        name: 'Task',
        component: () => import('@/views/task/index'),
        meta: { title: '任务管理', icon: 'task' }
      },
       {
        path: 'unit',
        name: 'Unit',
        component: () => import('@/views/unit/index'),
        meta: { title: '单元管理', icon: 'knowledge' }
      }
    ]
  },
  {
    path: '/score',
    component: Layout,
    redirect: '/score/index',
    meta: { title: '成绩管理', icon: 'form' }, 
    children: [
      {
        path: 'score',
        name: 'Score',
        component: () => import('@/views/score/index'),
        meta: { title: '成绩信息', icon: 'form' }
      },
      {
        path: 'analyse',
        name: 'Analyse',
        component: () => import('@/views/analyse/index'),
        meta: { title: '试题分析', icon: 'form' }
      }
    ]
  },
   {
    path: '/monitoring',
    component: Layout,
    redirect: '/monitoring/peaceIndex',
    meta: { title: '监测管理', icon: 'form' }, 
    children: [
      {
        path: 'peaceIndex',
        name: 'PeaceIndex',
        component: () => import('@/views/monitoring/peaceIndex'),
        meta: { title: '平时检测', icon: 'form' }
      },
      {
        path: 'testIndex',
        name: 'TestIndex',
        component: () => import('@/views/monitoring/testIndex'),
        meta: { title: '考试任务', icon: 'form' }
      },
      {
        path: 'correction',
        name: 'Correction',
        component: () => import('@/views/monitoring/correction'),
        meta: { title: '监测纠错', icon: 'form' }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true },
  {
        path: '/peaceDetail',
        name: 'PeaceDetail',
        component: () => import('@/views/student/peaceDetail'),
        hidden: true
      }
]

export default new Router({
//mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

