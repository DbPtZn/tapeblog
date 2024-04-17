<script setup lang="ts">
import elementResizeDetector from 'element-resize-detector'
import { useThemeVars } from 'naive-ui'
import dayjs from 'dayjs'
import { onMounted, onUnmounted, ref } from 'vue'
interface ToDoItem {
  id: string
  content: string
  isdo: boolean
}
const erd = elementResizeDetector()
const themeVars = useThemeVars()
const elementRef = ref<HTMLElement>()
const isAvatarShow = ref(true)
const props = defineProps<{
  UID: string
}>()
onMounted(() => {
  erd.listenTo(elementRef.value!, () => {
    if (elementRef.value!.offsetWidth < 300) {
      isAvatarShow.value = false
    } else {
      isAvatarShow.value = true
    }
  })
})
onUnmounted(() => {
  // 销毁 erd
  if (elementRef.value) {
    erd.uninstall(elementRef.value)
  }
})
const data: ToDoItem[] = [
  // {
  //   id: '1',
  //   content: '今天要做一百个俯卧撑！今天要做一百个俯卧撑！今天要做一百个俯卧撑！今天要做一百个俯卧撑！',
  //   isdo: true
  // },
  // {
  //   id: '2',
  //   content: '今天要做一百个后空翻！',
  //   isdo: false
  // },
  // {
  //   id: '3',
  //   content: '今天要做一百个引体向上！！',
  //   isdo: true
  // },
  // {
  //   id: '4',
  //   content: '今天要做一百个引体向上！！',
  //   isdo: true
  // },
  // {
  //   id: '5',
  //   content: '今天要做一百个引体向上！！',
  //   isdo: true
  // },
  // {
  //   id: '6',
  //   content: '今天要做一百个引体向上！！',
  //   isdo: true
  // },
  // {
  //   id: '7',
  //   content: '今天要做一百个引体向上！！',
  //   isdo: true
  // },
]
</script>

<template>
  <div ref="elementRef" class="todo-list">
    <n-card :style="{ backgroundColor: themeVars.bodyColor }">
      <Header :height="'15%'">
        <n-space style="display: flex;flex: 1;" :justify="'space-between'">
          <div style="font-size: 16px;">
            <n-button text>To-Do List</n-button>
            <!-- <n-button text>待办列表</n-button> -->
          </div>
          <div style="font-size: 16px;">{{ dayjs(Date.now()).format("YYYY年MM月DD") }}</div>
        </n-space>
      </Header>
      <Main class="main" :flex="1">
        <n-scrollbar style="max-height: 180px">
          <n-space
            class="todo-item" 
            style="display: flex;flex: 1;" 
            :justify="'space-between'"
            v-for="item in data"
            :key="item.id"
          >
            <n-popover trigger="click" width="trigger">
              <template #trigger>
              <div class="content">{{ item.content }}</div>
              </template>
              <span>{{ item.content }}</span>
            </n-popover>
            <n-checkbox disabled  :checked="item.isdo"/>
          </n-space>
        </n-scrollbar>
        <n-empty v-if="data.length === 0" size="large" description="近期无计划" :style="{ marginTop: '24px' }" />
      </Main>
      <Footer></Footer>
    </n-card>
  </div>
</template>

<style lang="scss" scoped>
.todo-list {
  display: flex;
  width: 100%;
  // height: 100%;
  // height: 360px;
  box-sizing: border-box;
  overflow: hidden;
  white-space: nowrap;
  margin: 0 0 10px 10px;
  box-shadow: var(--dpz-boxShadow4);
  .n-card {
    overflow: hidden;
  }
}

.main {
  display: flex;
  flex-direction: column;
  .todo-item {
    padding: 3px 0;
    .content {
      max-width: 220px;
      text-overflow: ellipsis;
      overflow: hidden;
      font-size: 16px;
    }
  }
}
</style>
