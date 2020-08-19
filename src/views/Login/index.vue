<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li v-for="(item,i) in menuTab"
            :key="i"
            @click="toggleMenu($event,item.type)"
            :class="{'active':item.isActive}">
          {{ item.txt }}
        </li>
      </ul>
      <el-form :model="ruleForm"
               size="small"
               status-icon
               :rules="rules"
               ref="ruleForm"
               class="login-form">
        
        <el-form-item prop="username" class="item-form">
          <label for="">账户:</label>
          <el-input type="text"
                    v-model="ruleForm.username"
                    placeholder="请输入邮箱"
                    autocomplete="off">
          
          </el-input>
        </el-form-item>
        
        <el-form-item prop="password"
                      class="item-form">
          <label for="">密码:</label>
          <el-input type="password"
                    :show-password="true"
                    maxlength="20"
                    minlength="6"
                    placeholder="请输入密码"
                    v-model="ruleForm.password"
                    autocomplete="off"></el-input>
        </el-form-item>
        
        <el-form-item prop="password2"
                      class="item-form"
                      v-show="mode==='register'"
        >
          <label for="">重复密码:</label>
          <el-input type="password"
                    :show-password="true"
                    maxlength="20"
                    minlength="6"
                    placeholder="请再次输入密码"
                    v-model="ruleForm.password2"
                    autocomplete="off">
          </el-input>
        </el-form-item>
        
        <el-form-item prop="code" class="item-form">
          <label for="">验证码:</label>
          <el-row :gutter="12">
            <el-col :span="16">
              <el-input v-model="ruleForm.code"
                        maxlength="6"
                        minlength="6"
              ></el-input>
            </el-col>
            <el-col :span="8">
              <el-button
                class="block"
                type="success"
              >
                获取验证码
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <!--        -->
        <el-form-item class="item-form">
          <el-button type="danger"
                     class="block mt20"
                     @click="submitForm('ruleForm')">
            提交
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  
  </div>
</template>

<script>
import {
	stringFilter,
	validateEmail,
	validatePassword
} from "../../utils/validator.js";

export default {
	name: "login",
	data () {
		//邮箱验证
		let validateUsername = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入邮箱'));
			} else if (validateEmail(value)) {
				callback(new Error('请输入正确的邮箱'));
			} else {
				callback();
			}
		};
		//密码验证
		let validatePass = (rule, value, callback) => {
			this.ruleForm.password = stringFilter(value);
			value = this.ruleForm.password;
			if (value === '') {
				callback(new Error('请输入密码'));
			} else if (validatePassword(value)) {
				callback(new Error('密码长度为6-20位且至少包含一个数字,大写字母,小写字母,特殊字符!'));
			} else {
				callback();
			}
		};
		let validatePass2 = (rule, value, callback) => {
			if (this.mode === 'login') {
				return callback();
			} else {
				this.ruleForm.password2 = stringFilter(value);
				value = this.ruleForm.password2;
				if (value !== this.ruleForm.password) {
					return callback(new Error('重复密码不正确'))
				} else {
					return callback()
				}
			}
		};
		//验证码
		let checkCode = (rule, value, callback) => {
			let reg = /^[a-zA-Z0-9]{6}$/
			if (!value) {
				return callback(new Error('验证码不能为空'));
			} else if (!reg.test(value)) {
				return callback(new Error('验证码有误'));
			} else {
				return callback()
			}
		};
		return {
			mode: 'login',
			ruleForm: {
				username: '',
				password: '',
				password2: '',
				checkCode: ''
			},
			rules: {
				username: [
					{ validator: validateUsername, trigger: 'blur' }
				],
				password: [
					{ validator: validatePass, trigger: 'blur' }
				],
				password2: [
					{ validator: validatePass2, trigger: 'blur' }
				],
				code: [
					{ validator: checkCode, trigger: 'blur' }
				]
			},
			menuTab: [
				{
					txt: '登录',
					isActive: true,
					type: 'login'
				},
				{
					txt: '注册',
					isActive: false,
					type: 'register'
				},
			],
		}
	},
	
	methods: {
		toggleMenu (e, mode) {
			//传统做法:先清空样式，再绑定当前样式；
			// this.menuTab.forEach(item=>item.isActive= false)
			// i.isActive = true;
			//优化写法:获取active元素，移除active类名，再修改当前点击对象的样式；
			let currentActiveEle = document.querySelector('.menu-tab li.active')
			currentActiveEle.classList.remove('active')
			e.target.className = 'active'
			this.mode = mode
		},
		submitForm (formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					alert('submit!');
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		},
		
	}
}
</script>

<style scoped lang="scss">
@import './index.scss';
</style>