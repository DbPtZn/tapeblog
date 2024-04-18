<script lang="ts" setup>
import { ref } from 'vue'
import { CollapseButton } from './private'
import { useThemeVars } from 'naive-ui'
import useStore from '@/store'
import { ManagerShell } from '@/views'
import { useShell } from '@/renderer'
const { settingStore } = useStore('manage')
const shell = useShell<ManagerShell>()
const themeVars = useThemeVars()
/** 侧边栏折叠/展开 */
const collapseVisible = ref(false) /** 控制容器展开/折叠按钮显示 */
function handleCollapseSidebar() {
  settingStore.isSidebarCollapse ? shell.expandSidebar() : shell.collapseSidebar()
}
</script>
<template>
  <div class="sidebar-container" @mouseover="collapseVisible = true" @mouseleave="collapseVisible = false">
    <slot />
    <!-- 展开/折叠按钮 -->
    <CollapseButton
      v-if="collapseVisible || settingStore.isSidebarCollapse"
      :is-collapse="settingStore.isSidebarCollapse"
      @click="handleCollapseSidebar"
    />
  </div>
</template>

<style lang="scss" scoped>
.sidebar-container {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  border-right: 1px solid v-bind('themeVars.dividerColor');
  background-color:  v-bind('themeVars.bodyColor');
}
.collapse-item {
  user-select: none;
  .collapse-item-btn {
    font-size: 18px;
  }
  .collapse-item-icon {
    transition: opacity 0.3s ease-in-out;
    opacity: 0;
  }
  &:hover {
    .collapse-item-icon {
      opacity: 1;
    }
  }
}
</style>
