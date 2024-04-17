<script lang="ts" setup>
import { onMounted, onUnmounted, ref, CSSProperties, computed } from 'vue'
import { DehazeFilled, HomeFilled, SearchOutlined } from '@vicons/material'
import { useRouter } from 'vue-router'
import { RouteNameEnum, ThemeEnum } from '@/enums'
import { useThemeVars } from 'naive-ui'
import { Github, Facebook } from '@/components'
import useStore from '@/store'
const { settingStore } = useStore()
const UID = computed(() => router.currentRoute.value.params.UID as string)
const router = useRouter()
const themeVars = useThemeVars()
const options = [
  {
    label: '首页',
    onClick: () => {
      router.push({ path: `/${UID.value}` })
    }
  },
  {
    label: '专栏',
    onClick: () => {
      router.push({ path: `/${UID.value}/column` })
    }
  },
  {
    label: '标签',
    disabled: true,
    onClick: () => {
      router.push({ path: `/${UID.value}/tag` })
    }
  },
  {
    label: '关于我',
    disabled: true,
    onClick: () => {
      //
    }
  }
]
function handleThemeUpdate() {
  settingStore.getCurrentTheme() === ThemeEnum.DARK ? settingStore.useLight() : settingStore.useDark()  
}
const railStyle = ({ focused, checked }: { focused: boolean; checked: boolean }) => {
  const style: CSSProperties = {}
  if (checked) {
    style.background = themeVars.value.modalColor
    if (focused) {
      // style.boxShadow = `0 0 0 2px #d0305040`
    }
  } else {
    style.background = themeVars.value.baseColor
    if (focused) {
      // style.boxShadow = '0 0 0 2px #2080f040'
    }
  }
  return style
}
function handleDbclick() {
  router.push({ name: RouteNameEnum.MANAGE })
}

function handleSelect() {}
onMounted(() => {})
onUnmounted(() => {
  // console.log('destory render page')
})
</script>
<template>
  <div v-if="!settingStore.isPureMode" class="nav">
    <div class="left">
      <n-button text>
        <!-- <n-icon :component="HomeFilled" :size="36" /> -->
        <span :style="{ fontSize: '32px' }" @dblclick="handleDbclick">GUM</span>
      </n-button>
    </div>
    <div class="middle">
      <n-flex align="center" :size="[24, 0]">
        <n-button text v-for="(option, index) in options" :key="index" :disabled="option.disabled" @click="option.onClick">
          <span class="nav-btn"> {{ option.label }} </span>
        </n-button>
      </n-flex>
      <div class="tools">
        <n-input class="search" placeholder="搜索" disabled>
          <template #suffix>
            <n-button class="btn" text ghost>
              <n-icon :component="SearchOutlined" :size="18" />
            </n-button>
          </template>
        </n-input>
        <n-switch class="theme-switch" @update:value="handleThemeUpdate" :value="settingStore.getCurrentTheme() === 'light'" size="medium" :rail-style="railStyle">
          <template #icon>
            <span v-if="settingStore.getCurrentTheme() === 'light'">☀</span>
            <span v-if="settingStore.getCurrentTheme() === 'dark'">🌙</span>
          </template>
        </n-switch>
      </div>
    </div>
    <div class="right">
      <!-- 用户配置自定义外链（图标 + 超链接） -->
        <n-button text>
          <n-icon class="nav-btn" :component="Github" :size="24" />
        </n-button>
        <n-divider vertical />
        <n-button text>
          <n-icon class="nav-btn" :component="Facebook" :size="24" />
        </n-button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.nav {
  // z-index: 1;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  width: 100%;
  height: 68px;
  min-height: 68px;
  background-color: var(--dpz-bodyColor1);
  box-shadow: var(--dpz-boxShadow4);
  .nav-container {
    height: 100%;
    padding: 0 20px;
  }
  .nav-btn {
    font-size: 16px;
  }
}
.left {
  width: 23.5%;
  display: flex;
  justify-content: end;
  padding-right: 36px;
  box-sizing: border-box;
}
.middle {
  flex: 1;
  min-width: 600px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  .tools {
    width: 340px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .theme-switch {
      margin-left: 20px;
    }
  }
}
.right {
  width: 21.5%;
  display: flex;
  align-items: center;
  justify-content: start;
  padding-left: 24px;
  box-sizing: border-box;
}
</style>
