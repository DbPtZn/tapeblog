<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import Showcase from './main/Showcase.vue'
import UserInfo from './right/UserInfo.vue'
import ToDoList from './right/ToDoList.vue'
import ClassifyList from './right/ClassifyList.vue'
import { useRouter } from 'vue-router'
import { useThemeVars } from 'naive-ui'
const router = useRouter()
const themeVars = useThemeVars()
const topVal = ref(0)
const sidebarRef = ref<HTMLElement>()
const UID = computed(() => router.currentRoute.value.params.UID as string)
let lastScrollTop = 0
function handleScroll(ev) {
  const sidebarTop = sidebarRef.value!.offsetTop
  const sidebarHeight = sidebarRef.value!.offsetHeight
  const sidebarBottom =  sidebarTop + sidebarHeight
  const scroller = ev.target as HTMLElement
  const scrollTop = ev.target.scrollTop
  const scrollerBottom = scrollTop + scroller.offsetHeight
  if (scrollTop > lastScrollTop) {
      // 向下滚动
      if (scrollerBottom >= sidebarBottom) {
        topVal.value = scrollerBottom - sidebarHeight
      }
  } else if (scrollTop < lastScrollTop) {
      // 向上滚动
      if (scrollTop <= sidebarTop) {
        topVal.value = scrollTop
      }
  }
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop
}
onMounted(() => {
 
})
onUnmounted(() => {
  // console.log('destory render page')
})
</script>
<template>
  <div class="home" @scroll="handleScroll">
    <div class="left-side">
      <!-- 1 -->
    </div>
    <div class="middle">
      <Showcase :UID="UID" />
    </div>
    <div class="right-side">
      <div ref="sidebarRef" class="right-side-container" :style="{ top: `${topVal}px`, position: 'absolute' }">
        <UserInfo :UID="UID" />
        <ToDoList :UID="UID" />
        <ClassifyList :UID="UID" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home {
  padding-top: 12px;
  width: 100%;
  display: flex;
  flex-direction: row;
  overflow-y: auto;
  // background-color: v-bind('themeVars.cardColor');
}
.left-side {
  width: 23.5%;
}
.middle {
  flex: 1;
  background-color: var(--Dpz-cardColor);
}
.right-side {
  position: relative;
  width: 33.5%;
  .right-side-container {
    width: 305px;
    box-sizing: border-box;
    padding-bottom: 80px;
  }
}
/** 定制滚动条 */
/*定义滚动条高宽及背景 高宽分别对应横竖滚动条的尺寸*/
::-webkit-scrollbar {
  width: 4px;
  height: 16px;
  background-color: unset;
}

/*定义滚动条轨道 内阴影+圆角*/
::-webkit-scrollbar-track {
  border-radius: 10px;
  background-color: unset;
}

// /*定义滑块 内阴影+圆角*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: unset;
  // background-color: unset;
  background-color: v-bind('themeVars.scrollbarColor');
}
</style>
