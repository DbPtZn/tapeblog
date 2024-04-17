<script setup lang="ts">
import useStore from '@/store';
import elementResizeDetector from 'element-resize-detector'
import { useThemeVars } from 'naive-ui'
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router';
const erd = elementResizeDetector()
const elementRef = ref<HTMLElement>()
const themeVars = useThemeVars()
const router = useRouter()
const { collectionListStore } = useStore('blog')
const props = defineProps<{
  UID: string
}>()
onMounted(() => {
  collectionListStore.fetchAndSet(props.UID)
})
onUnmounted(() => {
  // 销毁 erd
  if (elementRef.value) {
    erd.uninstall(elementRef.value)
  }
})
function handleClick(id: string) {
  console.log(id)
  router.push(`/${props.UID}/column/${id}`)
}
</script>

<template>
  <div ref="elementRef" class="classify">
    <n-card title="分类" size="small" :style="{ backgroundColor: themeVars.bodyColor }">
      <n-list hoverable clickable>
        <n-scrollbar :style="{ maxHeight: '280px', backgroundColor: themeVars.bodyColor }">
          <n-list-item class="classify-item" v-for="(item, index) in collectionListStore.data" :key="index" @click="handleClick(item.id)">
            <span class="classify-item-label">{{ item.name }}</span>
            <n-button size="tiny" secondary strong>
              {{ item.quantity }}
            </n-button>
          </n-list-item>
        </n-scrollbar>
      </n-list>
    </n-card>
  </div>
</template>

<style lang="scss" scoped>
.classify {
  display: flex;
  height: 360px;
  width: 100%;
  margin: 0 0 10px 10px;
  box-shadow: var(--dpz-boxShadow4);
  box-sizing: border-box;
  overflow: hidden;
  :deep(.n-list-item__main) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .classify-item {
    .classify-item-label {
      white-space: nowrap;
    }
  }
}
// 卡片标题
:deep(.n-card-header__main) {
  overflow: hidden;
  white-space: nowrap;
}
</style>
