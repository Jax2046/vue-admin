import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import login from './modules/login.js'
import app from './modules/app.js'

export default new Vuex.Store({
	modules: {
		app,
		login
	}
});
