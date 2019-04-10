import request from '@/utils/request'

export function getTask(params) {
  return request({
    url: '/test/queryTests',
    method: 'post',
    data:params
  })
}

export function deleteTask(testId) {
  return request({
    url: '/test/deleteTest ',
    method: 'post',
    data:{testId}
  })
}

export function saveTask(params) {
  return request({
    url: '/test/saveTest',
    method: 'post',
    data:params
  })
}

export function getTBI(testId) {
  return request({
    url: '/test/queryTestById',
    method: 'post',
    data:{testId}
  })
}

export function getTestBatch(testId) {
  return request({
    url: '/test/queryTestBatchs',
    method: 'post',
    data:{testId}
  })
}

export function saveTestBatch(params) {
  return request({
    url: '/test/saveTestBatch',
    method: 'post',
    data:params
  })
}

export function getCBS() {
  return request({
    url: '/teacher/queryClassesBySchoolId',
    method: 'post'
  })
}

export function eTask(testId) {
  return request({
    url: 'test/excuteTest',
    method: 'post',
    data:{testId}
  })
}