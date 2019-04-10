import request from '@/utils/request'

export function editPassword(params) {
  return request({
    url: '/teacher/updateStudentPassword',
    method: 'post',
    data: params
  })
}

export function getMyTest(params) {
  return request({
    url: '/test/queryMyTests',
    method: 'post',
    data:params
  })
}

export function queryMyDoneTests(params) {
  return request({
    url: '/test/queryMyDoneTests',
    method: 'post',
    data:params
  })
}

export function getMTQ(testId) {
  return request({
    url: '/test/queryMyTestQuestions',
    method: 'post',
    data:{testId}
  })
}

export function saveMA(examinationPaperId,testId,studentId,questionId,myAnswer) {
  return request({
    url: '/activemq/saveMyAnswer',
    method: 'post',
    data:{examinationPaperId,testId,studentId,questionId,myAnswer}
  })
}

export function getMA(testId) {
  return request({
    url: '/test/queryMyTestAnswers',
    method: 'post',
    data:{testId}
  })
}

export function submitT(params) {
  return request({
    url: '/activemq/saveMyAnswer',
    method: 'post',
    data:params
  })
}

export function getRecord(userType,testId,studentId,classId) {
  return request({
    url: '/test/queryStudentAnswers',
    method: 'post',
    data:{userType,testId,studentId,classId}
  })
}

export function getSystime() {
  return request({
    url: 'test/getSystime',
    method: 'post'
  })
}

export function getPeaceTimeTest(unitIds) {
  return request({
    url: '/examinationPaper/getUnitQuestions',
    method: 'post',
    data:{unitIds}
  })
}

export function getPeaceList(params) {
  return request({
    url: '/examinationPaper/getMyUnitTests',
    method: 'post',
    data:params
  })
}

export function getPeaceRecord(params) {
  return request({
    url: '/examinationPaper/getUnitPaperAnswers',
    method: 'post',
    data:params
  })
}