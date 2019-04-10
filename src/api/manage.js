import request from '@/utils/request'

export function getTeacher(params) {
  return request({
    url: '/teacher/queryTeachers',
    method: 'post',
    data:params
  })
}

export function deleteTeacher(teacherIds) {
  return request({
    url: '/teacher/deleteTeachers',
    method: 'post',
    data:{teacherIds}
  })
}

export function saveTeacher(params) {
  return request({
    url: '/teacher/saveTeacher',
    method: 'post',
    data:params
  })
}

export function selectSchool() {
  return request({
    url: '/teacher/selectSchoolNameAndId',
    method: 'post'
  })
}

export function selectTeacher(schoolId) {
  return request({
    url: '/teacher/selectTeacherNameAndId',
    method: 'post',
    data:{schoolId}
  })
}

export function selectClass(schoolId) {
  return request({
    url: '/teacher/selectClassNameAndId',
    method: 'post',
    data:{schoolId}
  })
}

export function getSchool(params) {
  return request({
    url: '/teacher/querySchools',
    method: 'post',
    data:params
  })
}

export function deleteSchool(schoolIds) {
  return request({
    url: '/teacher/deleteSchools',
    method: 'post',
    data:{schoolIds}
  })
}

export function saveSchool(params) {
  return request({
    url: '/teacher/saveSchool',
    method: 'post',
    data:params
  })
}

export function getClass(params) {
  return request({
    url: '/teacher/queryClasses',
    method: 'post',
    data:params
  })
}

export function deleteClass(classIds) {
  return request({
    url: '/teacher/deleteClasses',
    method: 'post',
    data:{classIds}
  })
}

export function saveClass(params) {
  return request({
    url: '/teacher/saveClass',
    method: 'post',
    data:params
  })
}

export function getStudent(params) {
  return request({
    url: '/teacher/queryStudents',
    method: 'post',
    data:params
  })
}

export function deleteStudent(studentIds) {
  return request({
    url: '/teacher/deleteStudents',
    method: 'post',
    data:{studentIds}
  })
}

export function saveStudent(params) {
  return request({
    url: '/teacher/saveStudent',
    method: 'post',
    data:params
  })
}

export function getCourse(params) {
  return request({
    url: '/course/queryCourses',
    method: 'post',
    data:params
  })
}

export function deleteCourse(courseIds) {
  return request({
    url: '/course/deleteCourses',
    method: 'post',
    data:{courseIds}
  })
}

export function saveCourse(params) {
  return request({
    url: '/course/saveCourse',
    method: 'post',
    data:params
  })
}

export function getUnit(params) {
  return request({
    url: '/course/queryUnits',
    method: 'post',
    data:params
  })
}

export function deleteUnit(unitIds) {
  return request({
    url: '/course/deleteUnits',
    method: 'post',
    data:{unitIds}
  })
}

export function saveUnit(params) {
  return request({
    url: '/course/saveUnit',
    method: 'post',
    data:params
  })
}

export function getChooseSchool() {
  return request({
    url: '/teacher/selectLoginSchool',
    method: 'post'
  })
}

export function getUnits(courseIdList) {
  return request({
    url: '/course/queryUnitsWithCourseName',
    method: 'post',
    data:{ courseIdList }
  })
}

export function initPassword(studentId) {
  return request({
    url: '/teacher/initStudentPassword',
    method: 'post',
    data:{ studentId }
  })
}

export function getUnExecuteTests(params) {
  return request({
    url: '/test/getUnExecuteTests',
    method: 'post',
    data:params
  })
}

export function getUnExecuteUnitTests(params) {
  return request({
    url: '/test/getUnExecuteUnitTests',
    method: 'post',
    data:params
  })
}

export function executeUnitTests(startTime,endTime) {
  return request({
    url: '/test/executeUnitTests',
    method: 'post',
    data:{startTime,endTime}
  })
}

export function executeTests(startTime,endTime) {
  return request({
    url: '/test/executeTests',
    method: 'post',
    data:{startTime,endTime}
  })
}

export function getScoreErrorUnitTests(params) {
  return request({
    url: '/test/getScoreErrorUnitTests',
    method: 'post',
    data:params
  })
}

export function excuteScoreErrorUnitTests() {
  return request({
    url: '/test/excuteScoreErrorUnitTests',
    method: 'post'
  })
}