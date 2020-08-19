import router from "./index";
import { getToken, removeToken, removeUsername } from "../utils/app";
import store from '../store/index'

const whiteRouter = ['/login']

router.beforeEach((to, from, next) => {
	if (getToken()) {
		if (to.path === '/login') {
			removeToken()
			removeUsername()
			store.commit('app/SET_TOKEN', '')
			store.commit('app/SET_USERNAME', '')
		}
		next()
	} else {
		console.log(to.path);
		if (whiteRouter.indexOf(to.path) !== -1) {
			console.log('555');
			next()
		} else {
			next('/login')
		}
	}
})