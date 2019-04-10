import request from '@/utils/request'

export function getTree(questionFolderId,schoolId) {
  return request({
    url: '/folder/queryFolders',
    method: 'post',
    data:{questionFolderId,schoolId}
  })
}

export function saveTree(parentFolderId,questionFolderName) {
  return request({
    url: '/folder/saveQuestionFolder',
    method: 'post',
    data:{parentFolderId,questionFolderName}
  })
}

export function editTree(questionFolderId,questionFolderName) {
  return request({
    url: '/folder/saveQuestionFolder',
    method: 'post',
    data:{questionFolderId,questionFolderName}
  })
}

export function deleteTree(questionFolderId) {
  return request({
    url: '/folder/deleteQuestionFolder',
    method: 'post',
    data:{questionFolderId}
  })
}

export function getQuestion(params) {
  return request({
    url: '/question/queryQuestions',
    method: 'post',
    data:params
  })
}

export function saveQuestion(params) {
  return request({
    url: '/question/saveQuestion',
    method: 'post',
    data:params
  })
}

export function deleteQuestion(questionGroupId) {
  return request({
    url: '/question/deleteQuestionGroup',
    method: 'post',
    data:{questionGroupId}
  })
}

export function moveQuestion(questionGroupId,folderId) {
  return request({
    url: '/question/moveQuestionFolder',
    method: 'post',
    data:{questionGroupId,folderId}
  })
}

export function withUnit() {
  return request({
    url: '/question/queryUnitsWithCourses',
    method: 'post'
  })
}

export function withTeacher() {
  return request({
    url: '/question/queryTeachersWithSchool',
    method: 'post'
  })
}

export function getEPQS(params) {
  return request({
    url: '/question/queryExaminationQuestions',
    method: 'post',
    data:params
  })
}