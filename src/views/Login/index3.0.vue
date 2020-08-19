<template>
  <div id="login">
    <div class="login-wrap">
      <ul class="menu-tab">
        <li
          v-for="(item, i) in menuTab"
          :key="i"
          @click="toggleMenu(item)"
          :class="{ active: item.isActive }"
        >
          {{ item.txt }}
        </li>
      </ul>
      <el-form
        :model="ruleForm"
        size="small"
        status-icon
        :rules="rules"
        ref="ruleForm"
        class="login-form"
      >
        <!--邮箱-->
        <el-form-item prop="username" class="item-form">
          <label for="username">邮箱:</label>
          <el-input
            id="username"
            type="text"
            v-model="ruleForm.username"
            placeholder="请输入邮箱"
            autocomplete="off"
          >
          </el-input>
        </el-form-item>
        <!--密码-->
        <el-form-item prop="password" class="item-form">
          <label for="password">密码:</label>
          <el-input
            id="password"
            type="password"
            :show-password="true"
            maxlength="20"
            minlength="6"
            placeholder="请输入密码"
            v-model="ruleForm.password"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <!--重复密码-->
        <el-form-item
          prop="password2"
          class="item-form"
          v-if="model.value === 'register'"
        >
          <label for="password2">重复密码:</label>
          <el-input
            id="password2"
            type="password"
            :show-password="true"
            maxlength="20"
            minlength="6"
            placeholder="请再次输入密码"
            v-model="ruleForm.password2"
            autocomplete="off"
          >
          </el-input>
        </el-form-item>
        <!--验证码-->
        <el-form-item prop="code" class="item-form">
          <label for="code">验证码:</label>
          <el-row :gutter="12">
            <el-col :span="15">
              <el-input
                id="code"
                v-model="ruleForm.code"
                maxlength="6"
                minlength="6"
              ></el-input>
            </el-col>
            <el-col :span="9">
              <el-button
                class="block"
                :class="{ gray: codeButtonStatus.status }"
                :disabled="codeButtonStatus.status"
                @click="getSms(model.value)"
                type="success"
              >
                {{ codeButtonStatus.text }}
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <!-- 提交按钮   -->
        <el-form-item class="item-form">
          <el-button
            type="danger"
            class="block mt20"
            @click="submitForm('ruleForm')"
            :disabled="loginButtonStatus"
          >
            {{ model.value === 'register' ? '注册' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { reactive, ref, onMounted } from '@vue/composition-api';
import { GetSms, Register, Login } from '../../api/login';
import {
	stringFilter,
	validateEmail,
	validatePassword
} from '../../utils/validator.js';
import sha1 from 'js-sha1';

export default {
	name: 'Login',
	setup (props, { refs, root }) {
  
		/*
		 *attrs:        this.$attrs
     * emit:        this.$emit
     * listeners    this.$listeners
     * parent       this.parent
     * refs         this.refs
     * root         this
    */
    
		let loginButtonStatus = ref(true);
		
		let codeButtonStatus = reactive(
			{
				status: false,
				text: '获取验证码'
			});
		
		let model = reactive(
			{
				type: 'string',
				value: 'login'
			});
		
		let ruleForm = reactive(
			{
				username: 'vue2020@outlook.com',
				password: 'asdf123@',
				password2: '',
				code: ''
			});
		
		let menuTab = reactive(
			[{
				txt: '登录',
				isActive: true,
				type: 'login'
			},
				{
					txt: '注册',
					isActive: false,
					type: 'register'
				}
			]);
		
		let timer = ref(null);
		
		/*********************************************************
		 * 函数
		 *
     */
			
			//验证码验证
		const checkCode = (rule, value, callback) => {
				let reg = /^[a-zA-Z0-9]{6}$/;
				if (!value) {
					return callback(new Error('验证码不能为空'));
				} else if (!reg.test(value)) {
					return callback(new Error('验证码有误'));
				} else {
					return callback();
				}
			};
		
		//邮箱验证
		const validateUsername = (rule, value, callback) => {
			if (value === '') {
				callback(new Error('请输入邮箱'));
			} else if (!validateEmail(value)) {
				callback(new Error('请输入正确的邮箱'));
			} else {
				callback();
			}
		};
		
		//密码验证
		const validatePass = (rule, value, callback) => {
			ruleForm.password = stringFilter(value);
			value = ruleForm.password;
			if (value === '') {
				callback(new Error('请输入密码'));
			} else if (validatePassword(value)) {
				callback(
					new Error(
						'密码长度为6-20位且至少包含一个数字,大写字母,小写字母,特殊字符!'
					)
				);
			} else {
				callback();
			}
		};
		
		//重复密码验证
		const validatePass2 = (rule, value, callback) => {
			let passValue = stringFilter(value);
			if (passValue === '') {
				callback('请再次输入密码');
			} else if (passValue !== ruleForm.password) {
				callback(new Error('重复密码不正确'));
			} else {
				callback();
			}
		};
		
		//改变按钮状态
		const updateButtonStatus = options => {
			codeButtonStatus.status = options.status;
			codeButtonStatus.text = options.text;
		};
		
		let rules = reactive(
			{
				username: [
					{
						validator: validateUsername,
						trigger: 'blur'
					}
				],
				password: [
					{
						validator: validatePass,
						trigger: 'blur'
					}
				],
				password2: [
					{
						validator: validatePass2,
						trigger: 'blur'
					}
				],
				code: [
					{
						validator: checkCode,
						trigger: 'blur'
					}
				]
			}
		);
		
		//重置表单
		
		let resetForm = () => {
			refs.ruleForm.resetFields();
		};
		
		//切换页面
		const toggleMenu = data => {
			if (data.type !== model.value) clearCountDown();
			menuTab.forEach(item => (item.isActive = false));
			data.isActive = true;
			model.value = data.type;
			//重置表单
			resetForm();
			updateButtonStatus(
				{
					status: false,
					text: '获取验证码'
				}
			);
			
		};
		
		/*******************************************************************
		 * 倒计时
		 * */
		
		const countDown = number => {
			if (timer.value) {
				clearInterval(timer.value);
			}
			let time = number;
			timer.value = setInterval(() => {
				time--;
				if (time === 0) {
					clearInterval(timer.value);
					updateButtonStatus({
						text: `再次获取`,
						status: false
					});
				} else {
					updateButtonStatus({
						text: `${ time }秒后重新获取...`,
						status: true
					});
				}
			}, 1000);
		};
		
		//获取验证码：
		const getSms = () => {
			if (!ruleForm.username) {
				root.$message({
					message: '邮箱不能为空',
					type: 'error',
					duration: 1500
				});
				return false;
			}
			if (!validateEmail(ruleForm.username)) {
				root.$message.error({
					message: '邮箱格式有误，请重新输入',
					type: 'error',
					duration: 1500
				});
				return false;
			}
			codeButtonStatus.text = '发送中...';
			codeButtonStatus.status = true;
			//定义参数；
			let requestOption = {
				username: ruleForm.username,
				module: model.value
			};
			//请求数据；
			GetSms(requestOption)
				.then(response => {
					let data = response.data;
					//设置状态信息
					root.$message({
						message: data.message,
						type: 'success',
						duration: 1500
					});
					//开启登录或注册按钮
					loginButtonStatus.value = false;
					//设置60秒倒计时
					countDown(60);
				})
				.catch(() => {
					updateButtonStatus({
						text: '再次获取验证码',
						status: false
					});
				});
		};
		
		//清除倒计时
		const clearCountDown = () => {
			clearInterval(timer.value);
		};
		
		//注册
		const register = data => {
			Register(data)
				.then(resData => {
					let msg = resData.data;
					root.$message({
						message: msg.message,
						type: 'success'
					});
					//更新按钮状态
					updateButtonStatus({
						text: '获取验证码',
						status: false
					});
					clearCountDown();
					//注册成功自动跳转登录模块
					toggleMenu(menuTab[0]);
				})
				.catch(error => {
					console.log(error);
				});
		};
		
		//登录
		const login = data => {
			root.$store.dispatch('app/login', data).then(resData => {
				let msg = resData.data;
				root.$message({
					message: msg.message,
					type: 'success',
					duration: 1500
				});
				root.$router.push({
					name: 'Console'
				})
			});
		};
		
		// 提交：
		const submitForm = formName => {
			refs[formName].validate(valid => {
				if (valid) {
					let requestData = {
						username: ruleForm.username,
						password: sha1(ruleForm.password),
						code: ruleForm.code
					};
					if (model.value === 'register') {
						register(requestData);
					}
					if (model.value === 'login') {
						login(requestData);
					}
				} else {
					console.log('error submit!!');
					return false;
				}
			});
		};
		
		//onMounted
		onMounted(() => {
		});
		
		//验证码
		return {
			menuTab,
			rules,
			ruleForm,
			loginButtonStatus,
			codeButtonStatus,
			model,
			login,
			getSms,
			register,
			countDown,
			resetForm,
			toggleMenu,
			submitForm,
			clearCountDown,
			updateButtonStatus
		};
	}
	
	/*data () {
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
  },*/
};
</script>

<style scoped lang="scss">
@import './index.scss';

.gray {
  color: #888 !important;
}
</style>
