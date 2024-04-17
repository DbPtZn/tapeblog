<script lang="ts" setup>
import { MaterialTypeEnum } from '@/enums'
import { MaybeArray } from 'naive-ui/es/_utils'
import { OnUpdateExpandedNames } from 'naive-ui/es/collapse/src/interface'
interface CollapseOptions {
  label: string
  name: string
}
defineProps<{
  options: CollapseOptions[]
}>()
const emits = defineEmits<{
  onReadMore: [string]
}>()
function handleClick(ev: PointerEvent, name: string) {
  ev.preventDefault()
  ev.stopPropagation()
  emits('onReadMore', name)
}
// let expandedNames = []
// function handleExpand(args: Array<string>) {
//   emits()
// }
</script>

<template>
  <n-collapse>
    <n-collapse-item class="item" v-for="(item, index) in options" :key="index" :title="item.label" :name="item.name">
      <slot :slotName="item.name" />
      <template #header-extra>
        <DpzIcon class="icon" :icon="`${MaterialTypeEnum.FILLED}read_more`" :size="22" @click="handleClick($event, item.name)" />
      </template>
    </n-collapse-item>
  </n-collapse>
</template>

<style lang="scss" scoped>
.item {
  user-select: none;
  .icon {
    opacity: 0;
  }
  &:hover {
    .icon {
      opacity: 1;
    }
  }
}
</style>
