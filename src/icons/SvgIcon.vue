<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="svgName"/>
  </svg>
</template>

<script>
import { ref, reactive, computed } from '@vue/composition-api'

export default {
	name: 'SvgIcon',
	props: {
		iconClass: {
			type: String,
			default: '',
		},
		iconName: {
			type: String,
			default: '',
		}
	},
	setup (props) {
		const svgName = computed(() => `#icon-${ props.iconName }`)
		const svgClass = computed(() => {
			if (props.className) {
				return `svg-icon ${ props.className }`
			} else {
				return 'svg-icon'
			}
		})
		return {
			svgName,
			svgClass
		}
	}
}
</script>

<style scoped>
  svg{
    width: 1em;
    height: 1em;
    fill: currentColor;
    color: inherit;
    padding: 0 5px;
  }
</style>