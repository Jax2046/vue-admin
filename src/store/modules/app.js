import Cookie from 'cookie_js'

import { Login } from "../../api/login";
import {
	getUsername,
	setToken,
	setUsername,
	removeUsername,
	removeToken
} from "../../utils/app";

const state = {
	isCollapse: JSON.parse(sessionStorage.getItem('isCollapse')) || false,
	// isCollapse: JSON.parse(Cookie.get('isCollapse')) || false,
	to_ken: '',
	username: getUsername() || ''
}
const mutations = {
	SET_COLLAPSE (state) {
		state.isCollapse = !state.isCollapse;
		sessionStorage.setItem('isCollapse', JSON.stringify(state.isCollapse))
		// Cookie.set('isCollapse', JSON.stringify(state.isCollapse))
	},
	SET_TOKEN (state, value) {
		state.to_ken = value;
	},
	SET_USERNAME (state, value) {
		state.username = value;
	},
}
const actions = {
	login ({ commit }, requestData) {
		return new Promise((resolve, reject) => {
			Login(requestData).then((res) => {
				let resData = res.data.data;
				commit('SET_TOKEN', resData.token)
				commit('SET_USERNAME', resData.username)
				setToken(resData.token)
				setUsername(resData.username)
				resolve(res)
			}).catch(error => {
				reject(error)
			})
		})
	},
	exit ({ commit }) {
		return new Promise((resolve,reject)=>{
			removeToken()
			removeUsername()
			commit('SET_TOKEN', '')
			commit('SET_USERNAME', '')
			resolve()
		})
		
	}
}

export default {
	namespaced: true,
	state,
	mutations,
	actions,
};