<script lang="ts" setup>
import { VNode, inject, onBeforeMount, onMounted, onUnmounted, ref } from 'vue'
import { useMessage } from 'naive-ui'
import { Injector, Subscription, auditTime, fromEvent } from '@textbus/core'
import _ from 'lodash'
import * as UUID from 'uuid'
import { useDraggable } from '@vueuse/core'
import { Player } from '@/editor'
import { DragHandle } from './toolkit/_utils/_index'
const injector = inject<Injector>('injector')!
const player = injector.get(Player)
const courseRef = player.courseRef as HTMLElement
const props = defineProps<{
  cmpts: VNode[]
}>()
const message = useMessage()
const subs: Subscription[] = []
const controllerData = ref<VNode[]>([])
const controllerRef = ref<HTMLElement | null>(null)
const isFixed = ref(false)
const isAutoHide = ref(false)
const isControllerShow = ref(true)
onBeforeMount(() => {
  controllerData.value = props.cmpts.map(vnode => {
    vnode.key = UUID.v4()
    return vnode
  })
})
const draggerRef = ref<HTMLElement | null>(null)
const { x, y, style } = useDraggable(controllerRef, {
  initialValue: { x: courseRef.clientWidth - 100, y: courseRef.clientHeight / 2 },
  containerElement: courseRef,
  preventDefault: true, // 阻止默认事件 (阻止拖拽时选中文本)
  stopPropagation: true // 阻止冒泡
})
window.onresize = () => {
  // console.log('窗口大小改变')
  if (x.value > courseRef.clientWidth) {
    x.value = courseRef.clientWidth - 100
  }
  if (y.value > courseRef.clientHeight) {
    y.value = courseRef.clientHeight - 100
  }
  isFixed.value = false
}

function handleChange() {
  x.value = courseRef.clientWidth - 100
  y.value = courseRef.clientHeight / 2 - controllerRef.value!.clientHeight / 2
  isFixed.value = !isFixed.value
  isFixed.value ? message.create('开启控制器拖拽') : message.create('关闭控制器拖拽')
  if (isFixed.value) {
    subs.forEach(sub => sub.unsubscribe())
  }
}
function handleHideController() {
  if (isFixed.value) return
  isAutoHide.value = !isAutoHide.value
  if (isAutoHide.value) {
    subs.push(
      fromEvent<MouseEvent>(courseRef, 'mousemove')
        .pipe(auditTime(100))
        .subscribe(ev => {
          const rect = courseRef.getBoundingClientRect()
          isControllerShow.value = rect.right - ev.clientX < 100
        })
    )
    message.create('开启控制器自动隐藏')
  } else {
    subs.forEach(sub => sub.unsubscribe())
    message.create('关闭控制器自动隐藏')
  }
}

onUnmounted(() => {
  console.log('控制器销毁')
})
</script>

<template>
  <div v-show="isControllerShow" ref="controllerRef" :class="['controller', isFixed ? 'fixed' : '']" :style="style">
    <div ref="draggerRef" class="dragger" :style="{ cursor: isFixed ? 'move' : 'pointer' }" @dblclick="handleChange">
      <n-icon :component="DragHandle" :size="24" />
    </div>
    <div class="tools">
      <component class="tool-item" v-for="node in controllerData" :key="(node.key as string)" :is="node" />
    </div>
    <div class="footer" @dblclick="handleHideController"></div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  position: relative;
}
.fixed {
  position: fixed;
}
.controller {
  max-width: 48px;
  border-radius: 3px;
  border: 1px solid var(--tb-dividerColor);
  background-color: var(--tb-cardColor);
  box-sizing: border-box;
  animation: fadeInRight 0.1s ease-in-out;
  .dragger {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 18px;
    background-color: var(--tb-modalColor);
    cursor: move;
    &:hover {
      background-color: var(--tb-buttonColor2Hover);
    }
  }
  .footer {
    height: 18px;
    background-color: var(--tb-modalColor);
  }
  .tools {
    box-sizing: border-box;
    padding: 6px;
  }
}
</style>
