<script setup lang="ts">
import useStore from '@/store'
import elementResizeDetector from 'element-resize-detector'
import { backTopDark, useThemeVars } from 'naive-ui'
import { onMounted, onUnmounted, ref } from 'vue'
const erd = elementResizeDetector()
const elementRef = ref<HTMLElement>()
const isAvatarShow = ref(true)
const themeVars = useThemeVars()
const { bloggerStore } = useStore('blog')
const props = defineProps<{
  UID: string
}>()
onMounted(() => {
  // 获取博主信息
  bloggerStore.get(props.UID)
  // 头像显示控制
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
</script>

<template>
  <div ref="elementRef" class="user-info">
    <n-card :style="{ display: 'flex', flexDirection: 'column', backgroundColor: themeVars.bodyColor }">
      <Header :height="'20%'">
        <n-avatar
          v-show="isAvatarShow"
          round
          :size="'medium'"
          :src="bloggerStore.avatar"
          fallback-src="./avatar03.png"
        />
        <div class="user-name">
            <span class="user-name-primary">{{ bloggerStore.nickname }}</span>
        </div>
      </Header>
      <Main :flex="1" class="main">
        <n-popover trigger="click" width="trigger">
          <template #trigger>
            <span class="detail">{{ bloggerStore.desc || '博主暂无自我介绍😀。' }}</span>
          </template>
          <span>{{ bloggerStore.desc }}</span>
        </n-popover>
        <!-- <section>
          <span>文章</span>
          <span>94</span>
          <n-button text>
            <SearchIcon :size="16"/>
          </n-button>
        </section>
        <section>
          <span>分类</span>
          <span>5</span>
          <n-button text>
            <SearchIcon :size="16"/>
          </n-button>
        </section>
        <section>
          <span>标签</span>
          <span>9</span>
          <n-button text>
            <SearchIcon :size="16"/>
          </n-button>
        </section> -->
      </Main>
      <Footer :height="'20%'" class="footer">
        <div class="contact">
          <n-popover trigger="click">
            <template #trigger>
              <span class="detail"><n-button block >联系我</n-button></span>
            </template>
            <span>{{ bloggerStore.email ? `邮箱：${bloggerStore.email}` : '博主暂无提供联系方式' }}</span>
          </n-popover>
        </div>
      </Footer>
    </n-card>
  </div>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  // .n-avatar {
  //   // padding: 0 10px;
  //   // width: 70px;
  //   // height: 70px;
  //   // margin: 0 20px;
  // }
  .user-name {
    flex: 1;
    padding: 0 10px;
    display: flex;
    flex-direction: column;
    // align-items: center;
    justify-content: center;
    .user-name-primary {
      font-size: 24px;
    }
    .user-name-secondary {
      font-size: 14px;
    }
  }
}

.main {
  display: flex;
  flex-direction: row;
  // justify-content: space-around;
  .detail {
    margin-top: 20px;
    width: 100%;
    height: 40px;
    overflow: hidden;
    display: -webkit-box;
    text-overflow: ellipsis;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    word-break: break-all;
    white-space: pre-line;
    text-indent: 2em;
  }
  section {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
    height: 110px;
  }
}

.footer {
  // width: 100%;
  // padding: 10px 0;
  .contact {
    width: 100%;
  }
}
.user-info {
  display: flex;
  width: 100%;
  height: 240px;
  box-sizing: border-box;
  overflow: hidden;
  white-space: nowrap;
  margin: 0 0 10px 10px;
  box-shadow: var(--dpz-boxShadow4);
  .n-card {
    overflow: hidden;
  }
}

:deep(.n-card > .n-card__content) {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
</style>
