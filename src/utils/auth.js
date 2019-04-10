import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'
const custid = 'Admin-custId'
const usertype = 'Admin-userType'
const code = 'Admin-code'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function setCustId(custId) {
  return Cookies.set(custid, custId)
}

export function getCustId() {
  return Cookies.get(custid)
}

export function setUserType(userType) {
  return Cookies.set(usertype, userType)
}

export function getUserType() {
  return Cookies.get(usertype)
}

export function setCode(jcode) {
  return Cookies.set(code,jcode)
}

export function getCode() {
  return Cookies.get(code)
}

export function removeCode() {
  return Cookies.remove(code)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
