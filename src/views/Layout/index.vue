<template>
  <div
    :class="[menuStatus ? 'close':'open']"
    id="layout-wrap">
    <aside class="aside">
      <layout-nav/>
    </aside>
    <section class="main">
        <header>
          <layout-header></layout-header>
        </header>
        <section class="content">
          <Layout-content></Layout-content>
        </section>
    </section>
  </div>
</template>
<script>
import LayoutNav from './Components/Nav'
import LayoutHeader from './Components/Header'
import LayoutContent from './Components/Content'
import {ref,reactive,computed} from '@vue/composition-api'
export default {
	name: 'layout',
	components: {
		LayoutNav,
		LayoutHeader,
		LayoutContent
	},
	setup (props,{root}) {
		const menuStatus = computed(()=>root.$store.state.app.isCollapse)
    return {
			menuStatus
    }
	}
}
</script>
<style scoped lang="scss">
@import "../../assets/styles/variable";
#layout-wrap {
  display: flex;
  &.close>aside{
    width: 64px !important;
  }
  &.open>section{
    width: 250px !important;
  }
  aside {
    width: 250px;
    background-color: $theme-color;
    height: 100vh;
    transition: width .5s linear;
  }
  section.main {
    flex: 1;
    display: flex;
    flex-direction: column;
    header {
      height: 75px;
    }
    section.content {
      flex: 1;
      border-top: 30px solid #f7f7f7;
      border-left: 30px solid #f7f7f7;
      box-sizing: border-box;
    }
    
  }
}

</style>