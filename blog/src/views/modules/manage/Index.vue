<script lang="ts" setup>
import { FractalContainer, useRendererStore, useShell } from '@/renderer'
import { onMounted, ref, watch } from 'vue'
import useStore from '@/store'
import { ManagerShell, managerShell } from '@/views'
import { onUnmounted } from 'vue'
const { collectionStore, userStore } = useStore('manage')
const rendererStore = useRendererStore()
rendererStore.set(managerShell)
const shell = useShell<ManagerShell>()
const implementRef = ref<HTMLElement>()
onMounted(() => {
  implementRef.value && rendererStore.setImplementRef(implementRef.value) // 注入实现层
  userStore.fetchAndSet()
  // console.log('载入容器')
})
onUnmounted(() => {
  // console.log('卸载容器')
})
watch(
  () => collectionStore.id,
  () => {
    shell.useItemlist()
  }
)
</script>
<template>
  <div ref="implementRef" class="render-page">
    <FractalContainer :data="rendererStore.data" :use-aux-lines="rendererStore.useAuxLines" />
  </div>
</template>

<style lang="scss" scoped>
.render-page {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: v-bind('rendererStore.getHeight');
  width: v-bind('rendererStore.getWidth');
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>
