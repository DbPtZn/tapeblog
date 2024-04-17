<!-- 该下拉列表不会跟随触发器的位置 -->
<script setup lang="ts">
import { SelectOption, NPopselect } from 'naive-ui'
import { PropType, VNodeChild, h } from 'vue'
import { DpzIcon } from './_api'
interface DpzPopselectOption extends SelectOption {
  label?: string
  icon?: string
  value?: string
  onClick?: () => void
}
defineProps({
  options: {
    type: [] as PropType<DpzPopselectOption[]>
  }
})
/** 自定义渲染 label 节点 */
const renderLabel = (option: DpzPopselectOption): VNodeChild => {
  if (option.type === 'group') return option.label + '(Cool!)'
  return [
    h(DpzIcon, {
      icon: option.icon,
      style: {
        verticalAlign: '-0.15em',
        marginRight: '4px'
      }
    }),
    h(
      'span',
      {
        onClick: option.onClick
      },
      option.label as string
    )
  ]
}
</script>

<template>
  <n-popselect :options="options" :render-label="renderLabel">
    <slot />
  </n-popselect>
</template>

<style lang="scss" scoped>
// .dpz-popselect {
//   display: flex;
//   align-items: center;
//   cursor: pointer;
// }
</style>
