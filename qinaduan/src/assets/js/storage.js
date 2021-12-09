import cookie from 'js-cookie'

//写入 修改 cookie 某个值
function getCookie(key, value) {
	return cookie.get(key, value)
}

//获取 cookie 某个值
function setCookie(value) {
	return cookie.set(value)
}

//删除 cookie 某个值
function removeCookie(value) {
	return cookie.remove(value)
}


//写入 修改 sessionStorage
function setSession(key, value) {
	sessionStorage.setItem(key, value);
}

//获取 sessionStorage 某个值
function getSession(key) {
	return sessionStorage.getItem(key)
}

//删除 sessionStorage 某个值
function removeSession(key) {
	sessionStorage.removeItem(key);
}

//删除 sessionStorage 全部数据
function removeAllSession() {
	sessionStorage.clear();
}


//写入 修改 localStorage
function setLocal(key, value) {
	localStorage.setItem(key, value);
}

//获取 localStorage 某个值
function getLocal(key) {
	return localStorage.getItem(key);
}

//删除 localStorage 某个值
function removeLocal(key) {
	localStorage.removeItem(key)
}

//删除 localStorage 全部数据
function removeAllLocal() {
	localStorage.clear();
}


export default {
	getCookie,
	setCookie,
	removeCookie,
	setSession,
	getSession,
	removeSession,
  setLocal,
	getLocal,
	removeLocal,
	removeAllLocal
}
