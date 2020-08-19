<template>
  <el-row class="tac" id="nav-wrap">
    <el-col :span="24">
      <div class="logo-wrap">
        <h1 class="logo" :class="[isCollapse?'close':'open']">
          <a href=""></a>
        </h1>
      </div>
      <el-menu
        default-active="1"
        text-color="#fff"
        background-color="#344a5f"
        active-text-color="#ccc"
        :collapse="isCollapse"
        router
      >
        <template v-for="(item,index) in routers">
          
          <!--一级菜单-->
          <el-submenu :key="item.name"
                      v-if="!item.hidden"
                      :index="`${index}`"
          >
            <template slot="title">
              <svg-icon :icon-class="item.name" :icon-name="item.meta.icon"/>
              <span>{{item.meta.name}}</span>
            </template>
            
            <!-- 子级菜单         -->
            <el-menu-item
              v-for="subItem in item.children"
              :key="subItem.name"
              :index="subItem.path"
            >
              <template slot="title">
                <svg-icon :icon-class="item.name" :icon-name="subItem.meta.icon"/>
                <span>{{subItem.meta.name}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </template>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
import { ref, reactive, computed } from '@vue/composition-api'

export default {
	name: 'navMenu',
	setup (props, { root }) {
		let isCollapse = computed(() => root.$store.state.app.isCollapse)
		let status = ref(true)
		let routers = reactive(root.$router.options.routes);
		return {
			isCollapse,
			status,
			routers,
		}
	},
}
</script>

<style scoped lang="scss">
@import "../../../assets/styles/variable";

#nav-wrap {
  width: 100%;
  
  .title {
    padding-left: 20px;
    color: #ccc;
    font-size: 20px;;
    text-align: left;
  }
  
  .el-menu {
    border: none !important;
  }
  
  .logo-wrap {
    display: flex;
    align-items: center;
    width: 100%;
    height: 120px;
    
    .logo {
      width: 100%;
      display: flex;
      justify-content: center;
      
      &.close a {
        width: 54px;
        height: 54px;
      }
      
      a {
        display: inline-block;
        margin: 0 auto;
        width: 100px;
        height: 100px;
        text-indent: -999px;
        transition: all .5s linear;
        background: transparent url("../../../assets/logo.png") no-repeat;
        background-size: cover;
      }
    }
    
  }
  
  .el-menu-item {
  
  }
  
  
}
</style>