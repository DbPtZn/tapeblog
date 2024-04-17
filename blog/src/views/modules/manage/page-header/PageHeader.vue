<script lang="ts" setup>
import { defineComponent } from 'vue'
import { useMessage, useThemeVars } from 'naive-ui'
import { Blogger } from '@/components'
import { MaterialTypeEnum, RoutePathEnum } from '@/enums'
import { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface'
import { useShell } from '@/renderer'
import { ManagerShell } from '../shell'
import useStore from '@/store'
import { useRouter } from 'vue-router'
const themeVar = useThemeVars()
const message = useMessage()
const router = useRouter()
const shell = useShell<ManagerShell>()
const { userStore } = useStore('manage')
function handleBack() {
  shell.useBlogger()
}
const options: DropdownMixedOption[] = [
  {
    label: '跳转到博客',
    key: '1',
    props: {
      onClick: () => {
        const UID = userStore.UID
        router.push({
          path: '/' + UID,
        })
      }
    }
  },
  {
    label: '设置',
    disabled: true,
    key: '2'
  },
  {
    label: '登出',
    key: '3',
    props: {
      onClick: () => {
        userStore.logout()
      }
    }
  }
]
// function handleToBlog() {
//   shell.useBlogger()
// }
</script>
<template>
  <div class="header">
    <n-page-header subtitle="" @back="handleBack">
      <template #back>
        <n-icon :component="Blogger"  :size="20" />
      </template>
      <template #title>
        <a href="#" style="text-decoration: none; color: inherit">{{ userStore.nickname }}</a>
      </template>
      <template #extra>
        <n-space>
          <n-button>预览</n-button>
          <n-dropdown :options="options" placement="bottom-start">
            <n-button :bordered="false" style="padding: 0 4px">
              <DpzIcon :icon="`${MaterialTypeEnum.FILLED}more_horiz`" :size="24" />
            </n-button>
          </n-dropdown>
        </n-space>
      </template>
    </n-page-header>
  </div>
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 0 18px;
  box-sizing: border-box;
  border-bottom: 1px solid v-bind('themeVar.borderColor');
}
</style>
