const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  studentName: state => state.user.studentName,
  studentCode: state => state.user.studentCode,
  studentSex: state => state.user.studentSex,
  schoolName: state => state.user.schoolName,
  className: state => state.user.className,
  roles: state => state.user.roles
}
export default getters
