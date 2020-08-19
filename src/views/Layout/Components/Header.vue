<template>
  <div id="header-wrap">
    <h2 class="pull-left" @click="toggleCollapse">
      <svg-icon icon-class="menu" icon-name="menu"></svg-icon>
    </h2>
    <div class="pull-right users">
      <div class="avatar">
        <img src="" alt="">
        <span>{{username}}</span>
      </div>
      <div class="close" @click="exit">
        <svg-icon icon-name="close"></svg-icon>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from '@vue/composition-api'

export default {
	name: '',
	setup (props, { root }) {
		const toggleCollapse = () => {
			root.$store.commit('app/SET_COLLAPSE');
		}
		const username = root.$store.state.app.username
		const exit = (() => {
			root.$store.dispatch('app/exit')
				.then(() => {
					root.$router.push({ name: 'Login' })
				})
		})
		return {
			toggleCollapse,
			username,
			exit
		}
	}
}
</script>

<style scoped lang="scss">
#header-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 75px;
  background-color: #fff;
  box-shadow: 0 3px 9px 0 rgba(0, 0, 0, 0.1);
  
  .pull-left {
    width: 100px;
    height: 60px;
    font-size: 40px;
    padding-left: 30px;
    padding-top: 10px;
    box-sizing: border-box;
    color: #999;
  }
  
  .pull-right {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    .avatar {
      text-align: center;
      display: flex;
      align-items: center;
      
      img {
        display: inline-block;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: 1px solid #000;
      }
      
      span {
        display: inline-block;
        font-size: 18px;
        margin-left: 20px;
      }
    }
    
    .close {
      width: 50px;
      font-size: 30px;
    }
  }
}
</style>