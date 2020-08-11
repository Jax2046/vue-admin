/*
* 过滤特殊字符
* */
export function stringFilter (s) {
	let pattern = new RegExp("[`~!#$^&*()=|{}':;,\\[\\].<>/?！￥…（）—【】‘；：”“。，、？]")
	let rs = '';
	for (let i = 0; i < s.length; i++) {
		rs = rs + s.substr(i, 1).replace(pattern, '');
	}
	return rs;
}

/*
* 验证邮箱
* */
export function validateEmail(s){
	let reg = /^([A-Za-z0-9_+-.])+@([A-Za-z0-9\-.])+\.([A-Za-z]{2,22})$/
	return reg.test(s);
}
/*
* 验证密码
* */
export function validatePassword(s){
	let reg = /^(?![a-zA-Z]+$)(?![0-9]+$)(?![._~!@#$^&*]+$)(?![0-9a-zA-Z]+$)(?![0-9._~!@#$^&*]+$)(?![a-zA-Z._~!@#$^&*]+$)[A-Za-z0-9._~!@#$^&*]{6,20}$/
	return !reg.test(s)
}