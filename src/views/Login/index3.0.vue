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
        <el-form-item prop="username" class="item-form">
          <label for="username">账户:</label>
          <el-input
            id="username"
            type="text"
            v-model="ruleForm.username"
            placeholder="请输入邮箱"
            autocomplete="off"
          >
          </el-input>
        </el-form-item>
        
        <el-form-item prop="password"
                      class="item-form">
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
        
        <el-form-item
          prop="password2"
          class="item-form"
          v-if="mode.value==='register'"
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
              <el-button class="block"
                         @click="getSms"
                         type="success">
                获取验证码
              </el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <!--        -->
        <el-form-item class="item-form">
          <el-button
            type="danger"
            class="block mt20"
            @click="submitForm('ruleForm')"
            :disabled="loginButtonStatus"
          >
            {{ mode.value==='register'?'注册':'登录' }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {
	reactive,
	ref,
	onMounted,
} from "@vue/composition-api";
import { GetSms } from "@/api/login";
import {
	stringFilter,
	validateEmail,
	validatePassword,
} from "@/utils/validator.js";

export default {
	name: "Login",
	setup (props, { refs, root }) {
		/*
		* attrs: this.$attrs
		* emit:   this.$emit
		* listeners  this.$listeners
		* parent    this.parent
		* refs      this.refs
		* root      this
		* */
		//获取验证码：
		const getSms = () => {
			if (!ruleForm.username) {
				root.$message.error('邮箱不能为空！');
				return false;
			}
			if (!validateEmail(ruleForm.username)) {
				root.$message.error('邮箱格式有误，请重新输入！')
				return false;
			}
			
			//定义参数；
			let requestOption = {
				username: ruleForm.username,
				module: 'login'
			}
			//请求数据；
			GetSms(requestOption).then(response => {
				console.log(response);
			}).catch(error => {
				console.log(error);
			})
		}
		//提交：
		const submitForm = (formName) => {
			refs[formName].validate((valid) => {
				if (valid) {
					alert("submit!");
				} else {
					console.log("error submit!!");
					return false;
				}
			});
		};
		//切换页面
		const toggleMenu = (data) => {
			menuTab.forEach(item => item.isActive = false)
			data.isActive = true;
			mode.value = ref(data.type)
		};
		//验证码验证
		const checkCode = (rule, value, callback) => {
			let reg = /^[a-zA-Z0-9]{6}$/;
			if (!value) {
				return callback(new Error("验证码不能为空"));
			} else if (!reg.test(value)) {
				return callback(new Error("验证码有误"));
			} else {
				return callback();
			}
		};
		//邮箱验证
		const validateUsername = (rule, value, callback) => {
			if (value === "") {
				callback(new Error("请输入邮箱"));
			} else if (!validateEmail(value)) {
				callback(new Error("请输入正确的邮箱"));
			} else {
				callback();
			}
		};
		//密码验证
		const validatePass = (rule, value, callback) => {
			ruleForm.password = stringFilter(value);
			value = ruleForm.password;
			if (value === "") {
				callback(new Error("请输入密码"));
			} else if (validatePassword(value)) {
				callback(
					new Error(
						"密码长度为6-20位且至少包含一个数字,大写字母,小写字母,特殊字符!"
					)
				);
			} else {
				callback();
			}
		};
		//重复密码验证
		const validatePass2 = (rule, value, callback) => {
			if (mode.value === "login") {
				callback();
			}
			ruleForm.password2 = stringFilter(value);
			value = ruleForm.password2;
			if (value === '') {
				callback('请再次输入密码')
			} else if (value !== ruleForm.password) {
				callback(new Error("重复密码不正确"));
			} else {
				callback();
				
			}
		};
		const mode = ref('login');
		const loginButtonStatus = ref(true)
		const ruleForm = reactive({
			username: "",
			password: "",
			password2: "",
			checkCode: "",
		});
		const menuTab = reactive([
			{
				txt: "登录",
				isActive: true,
				type: "login",
			},
			{
				txt: "注册",
				isActive: false,
				type: "register",
			},
		]);
		const rules = reactive({
			username: [{ validator: validateUsername, trigger: "blur" }],
			password: [{ validator: validatePass, trigger: "blur" }],
			password2: [{ validator: validatePass2, trigger: "blur" }],
			code: [{ validator: checkCode, trigger: "blur" }],
		});
		
		//onMounted
		onMounted(() => {
		
		});
		
		
		//验证码
		return {
			menuTab,
			rules,
			ruleForm,
			loginButtonStatus,
			mode,
			toggleMenu,
			submitForm,
			getSms
		};
	},
	
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
@import "./index.scss";
</style>
