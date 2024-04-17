<!-- 该下拉列表不会跟随触发器的位置 -->
<script setup lang="ts">
import { SelectOption, NDropdown, DropdownOption, MenuOption, NButton } from 'naive-ui'
import { PropType, VNode, VNodeChild, computed, h, ref } from 'vue'
import { DpzIcon } from './_api'
import * as UUID from 'uuid'
import { MenuGroupOption, MenuOptionSharedPart } from 'naive-ui/es/menu/src/interface'
import { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface'
interface CustomDropdownOption {
  type?: string
  label?: string
  icon?: string
  render?: () => VNode
  onClick?: () => void
}
export type DpzDropdownOption = DropdownMixedOption | CustomDropdownOption
const props = defineProps<{
  options: DpzDropdownOption[]
}>()

const dropdownOptions = computed(() => {
  const propsOptions = props.options as any[]
  return propsOptions?.map((item, index, arr) => {
    arr[index].key = UUID.v4()
    return arr[index]
  })
})
/** 自定义渲染 label 节点 */
// const renderLabel = (option: DpzDropdownOption): VNodeChild => {
//   if (option.type === 'group') return option.label + '(Cool!)'
//   return [
//     h(
//       'a',
//       {
//         onClick: option.onClick
//       },
//       option.label as string
//     )
//   ]
// }
/** 自定义渲染 Icon 节点 */
// const renderIcon = (option: any): VNodeChild | undefined => {
//   const isIconShow = option.icon ? true : false
//   return (
//     isIconShow 
//     ? h(DpzIcon, {
//         size: 18,
//         icon: option.icon,
//         onClick: option.onClick
//       })
//     : undefined
//     // h('a', {
//     //     style: { width: '0px' },
//     //     onClick: option.onClick
//     //   })
//   )
// }

const renderOption = (option: any): VNodeChild | undefined => {
  // const isSuffixShow = option.suffix ? true : false
  return h(NButton, {}, [
    h('span', {}, { default: () => option.label })
  ])
}
</script>

<template>
  <n-dropdown :options="dropdownOptions" :render-option="renderOption" >
    <slot />
  </n-dropdown>
</template>

<style lang="scss" scoped>
:deep(.n-dropdown-option-body__suffix) {
  display: none;
}
// .dpz-popselect {
//   display: flex;
//   align-items: center;
//   cursor: pointer;
// }
</style>
