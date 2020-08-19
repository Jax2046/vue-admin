import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
	return originalPush.call(this, location).catch(err => err)
}
const routes = [
	{
		path: '/',
		name: '',
		redirect: '/login',
		hidden: true,
		meta: {
			name: '首页'
		}
	},
	{
		path: '/login',
		name: 'Login',
		hidden: true,
		meta: {
			name: '登录'
		},
		component: () => import('../views/Login/index3.0')
	},
	{
		path: '/console',
		name: 'Console',
		hidden: false,
		meta: {
			name: '控制台',
			icon: 'console'
		},
		component: () => import('../views/Layout'),
	},
	{
		path: '/info',
		name: 'Info',
		hidden: false,
		meta: {
			name: '信息管理',
			icon: 'menu'
		},
		component: () => import('../views/Layout/index.vue'),
		children: [
			{
				path: '/infoIndex',
				name: 'IndexIndex',
				meta: {
					name: '信息列表',
					icon: 'list'
				},
				hidden: false,
				component: () => import('../views/Info/index')
			},
			{
				path: '/infoCategory',
				name: 'InfoCategory',
				meta: {
					name: '信息分类',
					icon: 'sort'
				},
				hidden: false,
				component: () => import('../views/Info/category')
			},
		]
	},
	{
		path: '/user',
		name: 'User',
		hidden: false,
		meta: {
			name: '用户管理',
			icon: 'users'
		},
		component: () => import('../views/Layout/index.vue'),
		children: [
			{
				path: '/index',
				name: 'UserIndex',
				hidden: false,
				meta: {
					name: '用户列表',
					icon: 'list'
				},
				component: () => import ('../views/User/index')
			}
		]
	},

];

const router = new Router({
	routes
});

export default router;