<script setup lang="ts">
import { RouteNameEnum } from '@/enums'
import { NIcon, useThemeVars } from 'naive-ui'
import useStore from '@/store'
import { useRouter } from 'vue-router'
import { h, reactive, ref, Component, markRaw } from 'vue'
import { LightModeOutlined, ModeNightOutlined, FullscreenExitOutlined, FullscreenOutlined, SettingsOutlined, ListAltOutlined  } from '@vicons/material'
import bridge from './bridge'
interface ArticleNavOptions {
  label?: string
  icon?: Component
  text?: boolean
  ghost?: boolean
  quaternary?: boolean
  textColor?: string
  type?: 'default' | 'tertiary' | 'primary' | 'success' | 'info' | 'warning' | 'error'
  onClick: () => void
}
const props = defineProps<{
  id: string
}>()
const elementRef = ref<HTMLElement>()
const { settingStore } = useStore()
const router = useRouter()
const themeVars = useThemeVars()
const isDrawShow = ref<boolean>(false)
const methods = {
  //
}
/** 侧边导航栏 */
const state = reactive({
  pureMode: ref<ArticleNavOptions>(),
  theme: ref<ArticleNavOptions>(),
  outline: ref<ArticleNavOptions>(),
  settings: ref<ArticleNavOptions>()
})
const generateOptions = () => {
  const options = ref<ArticleNavOptions[]>([
    (state.pureMode = {
      label: settingStore.isPureMode ? '退出全屏' : '全屏',
      icon: settingStore.isPureMode ? markRaw(FullscreenExitOutlined) : markRaw(FullscreenOutlined),
      text: true,
      onClick: () => {
        settingStore.isPureMode = !settingStore.isPureMode
      }
    }),
    (state.theme = {
      label: settingStore.theme ? '暗黑主题' : '浅色主题',
      icon: settingStore.theme ? markRaw(ModeNightOutlined) : markRaw(LightModeOutlined),
      text: true,
      onClick: () => {
        settingStore.theme ? settingStore.useLight() : settingStore.useDark()
      }
    }),
    (state.outline = {
      label: '目录',
      icon: markRaw(ListAltOutlined),
      text: true,
      ghost: true,
      textColor: bridge.habit.state.platform.isOutlineHide ? themeVars.value.primaryColor : '',
      onClick: () => {
        bridge.habit.state.platform.isOutlineHide = !bridge.habit.state.platform.isOutlineHide
        state.outline!.textColor = bridge.habit.state.platform.isOutlineHide ? themeVars.value.primaryColor : ''
      }
    }),
    (state.settings = {
      label: '设置',
      icon: markRaw(SettingsOutlined),
      text: true,
      ghost: true,
      onClick: () => {
        isDrawShow.value = !isDrawShow.value
      }
    })
  ])
  return options.value
}
/** 折叠侧边栏 */
const handleCollapseSidebar = (value: boolean, aside: 'left' | 'right') => {
  //
}
</script>
<template>
  <div ref="elementRef" class="article-right-side">
    <!-- 头部 -->
    <Header :height="'8%'">
      <!-- <component class="login" :is="userStore.account ? Logging : LoginBtn" @click="methods.handleLogin" /> -->
      <!-- <div v-if="userStore.account" class="avatar-background"></div> -->
    </Header>
    <!-- 核心 -->
    <Main :flex="1">
      <div class="article-nav">
        <n-button
          v-for="(option, index) in generateOptions()"
          :key="index"
          :ghost="option.ghost"
          :quaternary="option.quaternary"
          :text="option.text"
          :type="option.type"
          :text-color="option.textColor"
          @click="option.onClick"
        >
          <n-popover trigger="hover" placement="left">
            <template #trigger>
              <n-icon :component="option.icon" :size="24" />
            </template>
            <span>{{ option.label }}</span>
          </n-popover>
        </n-button>
      </div>
    </Main>
    <!-- 底部 -->
    <Footer :height="'10%'"></Footer>
  </div>
  <!-- 抽屉 -->
  <n-drawer v-model:show="isDrawShow" :width="320" placement="left">
    <n-drawer-content title="设置">
      <!-- 控制器配置 -->
      <n-space vertical size="large">
        <n-space :justify="'space-between'" :align="'center'">
          <span>控制器位置</span>
          <n-select v-model:value="bridge.habit.state.control.placement" :options="bridge.habit.controlPlaceOptions" size="small" :consistent-menu-width="false" />
        </n-space>
        <n-space :justify="'space-between'" :align="'center'">
          <span>控制器自动隐藏</span>
          <n-switch v-model:value="bridge.habit.state.control.isAutoHide" />
        </n-space>
      </n-space>
      <n-divider />
      <!-- 平台配置 -->
      <n-space vertical size="large">
        <n-space :justify="'space-between'" :align="'center'">
          <span>隐藏滚动条</span>
          <n-switch v-model:value="bridge.habit.state.platform.isScrollbarHide" />
        </n-space>
        <n-space :justify="'space-between'" :align="'center'">
          <span>隐藏大纲视图</span>
          <n-switch v-model:value="bridge.habit.state.platform.isOutlineHide" />
        </n-space>
        <n-space :justify="'space-between'" :align="'center'">
          <span>平台宽度</span>
          <n-select v-model:value="bridge.habit.state.platform.width" :options="bridge.habit.platformWidthOptions" size="small" :consistent-menu-width="false" />
        </n-space>
      </n-space>
      <n-divider />
      <!-- 播放配置 -->
      <n-space vertical size="large">
        <n-space :justify="'space-between'" :align="'center'">
          <span>播放速度</span>
          <n-select v-model:value="bridge.habit.state.course.playrate" :options="bridge.habit.playRateOptions" size="small" :consistent-menu-width="false" />
        </n-space>
        <n-space :justify="'space-between'" :align="'center'">
          <span>隐藏字幕</span>
          <n-switch v-model:value="bridge.habit.state.course.isSubtitlesHide" />
        </n-space>
      </n-space>
      <n-divider />
      <!-- 页面配置 -->
      <n-space vertical size="large">
        <n-space :justify="'space-between'" :align="'center'">
          <span>折叠侧边栏（左）</span>
          <n-switch @update:value="handleCollapseSidebar($event, 'left')" />
        </n-space>
        <n-space :justify="'space-between'" :align="'center'">
          <span>折叠侧边栏（右）</span>
          <n-switch @update:value="handleCollapseSidebar($event, 'right')" />
        </n-space>
      </n-space>
      <n-divider />
      <!-- 文章详情 -->
      <n-descriptions label-placement="left" label-align="center" :column="1" :bordered="true" title="详情">
        <n-descriptions-item label="作者"> 摩尔冈特 </n-descriptions-item>
        <n-descriptions-item label="发布时间"> 2023年5月19日 </n-descriptions-item>
        <n-descriptions-item label="更新时间"> 2023年5月19日 </n-descriptions-item>
        <n-descriptions-item label="字数"> 1756 </n-descriptions-item>
        <n-descriptions-item label="时长"> 16:56 </n-descriptions-item>
      </n-descriptions>
    </n-drawer-content>
  </n-drawer>
</template>

<style lang="scss" scoped>
.article-right-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.header {
  display: flex;
  justify-content: flex-end;
  padding: 16px;
  .login {
    z-index: 1;
  }
  .avatar-background {
    width: 200px;
    height: 200px;
    top: -100px;
    right: -100px;
    position: absolute;
    background-color: v-bind('themeVars.cardColor');
    transform: rotate(45deg);
  }
}
.main {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  // border: 1px solid #fff;
  .article-nav {
    display: flex;
    flex-direction: column;
    // height: 50%;
    border-bottom-left-radius: v-bind('themeVars.borderRadius');
    border-top-left-radius: v-bind('themeVars.borderRadius');
    background-color: v-bind('themeVars.cardColor');
    // border: 1px solid #fff;
    .n-button {
      height: 45px;
      width: 45px;
      margin-bottom: 10px;
      animation: lightSpeedInRight 0.8s ease-in-out;
    }
  }
}

.setting-option {
  display: flex;
  flex-direction: column;
}
</style>
