import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/styles/main.scss';
import VueCompositionAPI from '@vue/composition-api';

//引入全局组件
import SvgIcon from "./icons/index";

//路由守卫
import './router/premit.js'

Vue.config.productionTip = false;

Vue.use(ElementUI);

Vue.use(VueCompositionAPI);

//引入自定义全局组件


new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app');
