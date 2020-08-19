<template>
  <div id="content-wrap">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
	name: 'layout-content',
  setup(){
		const msg = {
			name:'手把手撸码',
      title:'title is not title'
    }
	  return {
			msg
    }
  }
}
</script>

<style scoped>
 #content-wrap {
 
 }
</style>
