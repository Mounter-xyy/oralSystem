import request from '@/utils/request'

export function getTest(folderId,schoolId) {
  return request({
    url: '/folder/queryTestpaperFolders',
    method: 'post',
    data:{folderId,schoolId}
  })
}

export function saveTest(parentFolderId,folderName) {
  return request({
    url: '/folder/saveTestpaperQuestionFolder',
    method: 'post',
    data:{parentFolderId,folderName}
  })
}

export function editTest(folderId,folderName) {
  return request({
    url: '/folder/saveTestpaperQuestionFolder',
    method: 'post',
    data:{folderId,folderName}
  })
}

export function deleteTest(folderId) {
  return request({
    url: '/folder/deleteTestpaperQuestionFolder',
    method: 'post',
    data:{folderId}
  })
}

export function getExamination(params) {
  return request({
    url: '/examinationPaper/queryExaminationPapers',
    method: 'post',
    data:params
  })
}

export function saveExamination(params) {
  return request({
    url: '/examinationPaper/saveExaminationPaper',
    method: 'post',
    data:params
  })
}

export function deleteExamination(examinationPaperId) {
  return request({
    url: '/examinationPaper/deleteExaminationPaper',
    method: 'post',
    data:{examinationPaperId}
  })
}

export function getExaminationPaper(examinationPaperId) {
  return request({
    url: '/examinationPaper/queryExaminationPaperQuestions',
    method: 'post',
    data:{examinationPaperId}
  })
}

export function getModel() {
  return request({
    url: '/examinationPaper/queryTestModels',
    method: 'post'
  })
}

export function getModelQuestion(modelId) {
  return request({
    url: '/examinationPaper/queryModelQuestions',
    method: 'post',
    data:{modelId}
  })
}

export function editModel(modelId,modelName) {
  return request({
    url: '/examinationPaper/editTestModel',
    method: 'post',
    data:{modelId,modelName}
  })
}

export function deleteModel(modelId) {
  return request({
    url: '/examinationPaper/deleteTestModel',
    method: 'post',
    data:{modelId}
  })
}

export function deleteEPQ(examinationPaperId,questionId) {
  return request({
    url: '/examinationPaper/deleteExaminationPaperQuestion',
    method: 'post',
    data:{examinationPaperId,questionId}
  })
}

export function updateEPQS(examinationPaperId,questionId,questionScore) {
  return request({
    url: '/examinationPaper/updateExaminationPaperQuestionScore',
    method: 'post',
    data:{examinationPaperId,questionId,questionScore}
  })
}

export function updateEPQ(examinationPaperId,questionId,selectQuestionId) {
  return request({
    url: '/examinationPaper/updateExaminationPaperQuestion',
    method: 'post',
    data:{examinationPaperId,questionId,selectQuestionId}
  })
}

export function addEPQ(params) {
  return request({
    url: '/examinationPaper/addExaminationPaperQuestion',
    method: 'post',
    data:params
  })
}

export function moveEPF(examinationPaperId,folderId) {
  return request({
    url: '/examinationPaper/moveExaminationPaperFolder',
    method: 'post',
    data:{examinationPaperId,folderId}
  })
}

export function getSS(params) {
  return request({
    url: 'test/queryStudentTests',
    method: 'post',
    data:params
  })
}

export function getQTOI(params) {
  return request({
    url: 'test/queryTestOptionInfos',
    method: 'post',
    data:params
  })
}

export function getQTIT() {
  return request({
    url: 'test/queryTestIdAndTestNames',
    method: 'post'
  })
}



