import axios from 'axios'
import { Message, MessageBox } from 'element-ui'
import store from '../store'
import { getToken,getCustId,getUserType,setCode } from '@/utils/auth'

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 5000000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['x-token'] = getToken()// 让每个请求携带自定义token 请根据实际情况自行修改
    config.headers['x-custId'] = getCustId()// 让每个请求携带自定义custId 请根据实际情况自行修改
    config.headers['x-userType'] = getUserType()
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
  /**
  * code为非1是抛错 可结合自己业务进行修改
  */
    const res = response.data
    console.log(res)
    if (res.status != '1') {
    	if(res.error.code==undefined){
    		res.error.code='';
    	}
    	setCode(res.error.code)
      Message({
        message: res.error.message,
        type: 'error',
        duration: 3 * 1000
      })

     } else {
      return response.data
    }
  },
  error => {
    console.log('err' + error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
