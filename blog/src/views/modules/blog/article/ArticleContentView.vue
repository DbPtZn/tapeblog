<script setup lang="ts">
import { computed, markRaw, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
import useStore from '@/store'
import { useMessage, useThemeVars } from 'naive-ui'
import { useControlKit } from './hooks/useControlKit'
import { useRouter } from 'vue-router'
import { ProductTypeEnum } from '@/enums'
import * as untils from '@/utils'
import dayjs from 'dayjs'
import bridge, { OutlineItem } from './bridge'
import { useEditor } from './hooks/_index'
import { Editor } from '@textbus/editor'
import { useDraggable } from '@vueuse/core'
import { DragHandleTwotone } from '@vicons/material'
import { VIEW_DOCUMENT } from '@textbus/platform-browser'
const props = defineProps<{
  id: string
}>()
const { articleStore } = useStore('blog')
const themeVars = useThemeVars()
const router = useRouter()
const message = useMessage()
const getControlOptions = useControlKit()
const contentRef = ref()
const scrollerRef = ref()
const controllerRef = ref()
const elementRef = ref()
const state = reactive({
  //
})
const editor = ref<Editor>()
useEditor(props.id, contentRef, scrollerRef, controllerRef, elementRef).then(e => {
  editor.value = e
  bridge.catchEditorReady(e)
  // const view_document = e.get(VIEW_DOCUMENT)
  /** 目录 */
  // const children = Array.from(contentRef.value!.firstChild.children) as HTMLElement[]
  // console.log(children)
  // const outlines: OutlineItem[] = []
  // children.forEach(element => {
  //   if (['H1', 'H2', 'H3', 'H4', 'H5', 'H6'].includes(element.tagName)) {
  //     outlines.push({
  //       tagName: element.tagName.toLocaleLowerCase() as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
  //       text: element.innerHTML,
  //       offsetTop: element.offsetTop
  //     })
  //   }
  // })
  // if(outlines.length !== 0) {
  //   bridge.outline.setData(outlines)
  //   bridge.outline.setScroller(scrollerRef.value)
  // }
})
const data = computed(() => articleStore.get(props.id))
const methods = {
  handleScroll() {
    bridge.outline.setActiveIndex(scrollerRef.value!.scrollTop)
  }
}
onMounted(() => {
  //
})
onUnmounted(() => {
  //
})

const isDraggable = computed(() => bridge.habit.state.control.placement === 'draggable')
const { x, y, style } = useDraggable(controllerRef, {
  initialValue: { x: document.body.clientWidth / 2 + 350, y: document.body.clientHeight / 2 + 100 },
  preventDefault: true, // 阻止默认事件 (阻止拖拽时选中文本)
  stopPropagation: true // 阻止冒泡
})
</script>

<template>
  <div ref="elementRef" class="article" :style="{ width: bridge.habit.state.platform.width, maxWidth: '90%' }">
    <!-- <n-card :bordered="false"> -->
      <!-- 滚动区 -->
      <div
        ref="scrollerRef"
        :class="['article-scroller', bridge.habit.state.platform.isScrollbarHide && 'scrollbar-hide']"
        style="height: calc(100vh - 68px);"
        @scroll="methods.handleScroll"
      >
        <!-- 文章头部 -->
        <div class="article-header">
          <div class="article-header-item">作者：{{ data.penname || '佚名' }}</div>
          <div class="article-header-item">时间：{{ dayjs(data.createAt).format('YYYY-MM-DD HH:mm:ss') || '' }}</div>
          <div class="article-header-item">字数：{{ data.detail.wordage }}</div>
          <div class="article-header-item" v-if="data.type === ProductTypeEnum.COURSE">时长：{{ dayjs().minute(Math.floor(data.duration/60)).second(data.duration%60).format('mm:ss') }}</div>
        </div>
        <n-divider class="article-header-divider" dashed> </n-divider>
        <!-- 文章主体 -->
        <div class="article-main">
          <div class="article-title">{{ data.title }}</div>
          <div ref="contentRef" id="article-content"></div>
        </div>
        <!-- 文章底部 -->
        <n-divider dashed> </n-divider>
        <div class="article-footer">
          <n-popover trigger="hover">
            <template #trigger>
              <n-button text>
                <DpzIcon icon="material-icons-outlined-chevron_left" :size="24" />
              </n-button>
            </template>
            <span>上一章</span>
          </n-popover>
          <n-popover trigger="hover">
            <template #trigger>
              <n-button text>
                <DpzIcon icon="material-icons-outlined-chevron_right" :size="24" />
              </n-button>
            </template>
            <span>下一章</span>
          </n-popover>
        </div>
      </div>
    <!-- </n-card> -->
    <!-- 播放控制器 -->
    <div ref="controllerRef" :class="[!isDraggable && 'article-control', isDraggable ? 'draggable' : bridge.habit.state.control.placement]" :style="isDraggable ? style : ''">
      <div v-if="isDraggable" ref="draggerRef" class="dragger" :style="{ cursor: isDraggable ? 'move' : 'pointer' }">
        <n-icon :component="DragHandleTwotone" :size="24" />
      </div>
      <n-space
        v-if="editor"
        :class="['article-control-wrapper', bridge.habit.state.control.isAutoHide && 'article-control-hidden']"
        vertical
        :align="'center'"
        :justify="'space-around'"
        :size="'large'"
      >
        <n-button
          v-for="(option, index) in getControlOptions(editor)"
          class="control-btn"
          strong
          circle
          ghost
          :key="index"
          :size="option.size"
          @click="option.onClick"
        >
          <n-icon :component="markRaw(option.icon)" :size="option.iconSize" />
        </n-button>
      </n-space>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.draggable {
  z-index: 1;
  position: fixed;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.article-title {
  font-size: 36px;
  font-weight: 600;
}
.article-header {
  height: 65px;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  padding: 0 12px;
  color: v-bind('themeVars.textColor3');
  .article-header-item {
    margin-left: 24px;
  }
}
.article-header-divider {
  padding-top: 0;
  margin-top: 0;
}
.article-footer {
  height: 30px;
  padding: 0 20px;
  margin-bottom: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.article {
  position: relative;
  display: flex;
  height: 100%;
  box-sizing: border-box;
  padding-top: 1px;
  overflow: hidden;
  .n-card {
    border-radius: 0;
    :deep(.n-card__content) {
      padding: 0;
    }
  }
  &:hover {
    /*定义滑块 内阴影+圆角*/
    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: v-bind('themeVars.scrollbarColorHover');
    }
  }
}
.article-main {
  min-height: 82vh;
  margin: 15px;
  padding: 15px;
  box-sizing: border-box;
}
.article-control {
  position: absolute;
  opacity: 0.5;
  transition: all 0.3s ease-in-out;
  &:hover {
    opacity: 1;
    .article-control-hidden {
      opacity: 1;
    }
  }
}
.article-control-hidden {
  // display: none!important;
  opacity: 0;
}
.inner {
  right: 130px;
  top: 550px;
  .article-control-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
    height: 300px;
    width: 120px;
    transition: all 0.2s ease-in-out;
    &:hover {
      opacity: 1;
    }
  }
}
.rightside {
  right: 0px;
  top: calc(50% - 150px);
  z-index: 1;
  .article-control-wrapper {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: fixed;
    height: 300px;
    padding: 8px;
    // border-top-right-radius: v-bind('themeVars.borderRadius');
    // border-bottom-right-radius: v-bind('themeVars.borderRadius');
    border-top-right-radius: 24px;
    border-bottom-right-radius: 24px;
    background-color: v-bind('themeVars.cardColor');
    transition: all 0.2s ease-in-out;
    &:hover {
      opacity: 1;
    }
  }
}
.leftside {
  left: -56px;
  top: calc(50% - 150px);
  .article-control-wrapper {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    position: fixed;
    height: 300px;
    background-color: v-bind('themeVars.cardColor');
    border-top-left-radius: v-bind('themeVars.borderRadius');
    border-bottom-left-radius: v-bind('themeVars.borderRadius');
    padding: 8px;
    transition: all 0.2s ease-in-out;
    &:hover {
      opacity: 1;
    }
  }
}
.article-scroller {
  width: 100%;
  background-color: var(--dpz-bodyColor1);
  overflow-y: auto;
  overflow-x: hidden;
  /** 定制滚动条 */
  /*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
  &::-webkit-scrollbar {
    width: 6px;
    height: 16px;
    // background-color: v-bind('themeVars.scrollbarColor');
    background-color: unset;
  }

  /*定义滚动条轨道 内阴影+圆角*/
  &::-webkit-scrollbar-track {
    /* -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3); */
    border-radius: 10px;
    // background-color: v-bind('themeVars.scrollbarColor');
    background-color: unset;
  }

  // /*定义滑块 内阴影+圆角*/
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: unset;
    background-color: unset;
  }
}
.scrollbar-hide {
  // /*定义滑块 内阴影+圆角*/
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: unset;
    background-color: unset !important;
  }
}
</style>
