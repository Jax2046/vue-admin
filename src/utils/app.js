import Cookie from 'cookie_js'

const adminToken = 'admin_token'
const usernameKey = 'username'

export function getToken () {
	return Cookie.get('admin_token')
}

export function setToken (token) {
	return Cookie.set(adminToken, token)
}
export function removeToken () {
	return Cookie.remove(adminToken)
}
export function removeUsername () {
	return Cookie.remove(usernameKey)
}
export function getUsername() {
	return Cookie.get(usernameKey)
}

export function setUsername (value) {
	return Cookie.set(usernameKey, value)
}