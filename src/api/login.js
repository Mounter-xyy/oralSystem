import request from '@/utils/request'

//export function login(username, password,userType) {
//return request({
//  url: '/login/userLogin',
//  method: 'post',
//  data: {
//    username,
//    password,
//    userType
//  }
//})
//}

export function loginT(username, password,userType,schoolId) {
  return request({
    url: '/login/teacherLogin',
    method: 'post',
    data: {
      username,
      password,
      userType,
      schoolId
    }
  })
}

export function loginS(username, password,userType,schoolId) {
  return request({
    url: '/login/studentLogin',
    method: 'post',
    data: {
      username,
      password,
      userType,
      schoolId
    }
  })
}

export function getInfo(token) {
  return request({
    url: '/login/getUserInfo',
    method: 'post',
    data: { token }
  })
}

export function logout() {
  return request({
    url: '/login/logout',
    method: 'post'
  })
}

export function getOT() {
  return request({
    url: '/login/getOssToken',
    method: 'post'
  })
}