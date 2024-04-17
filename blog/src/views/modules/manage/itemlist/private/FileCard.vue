<script lang="ts" setup>
import { NButton, useThemeVars } from 'naive-ui'
import { MaterialTypeEnum } from '@/enums'
import { PropType } from 'vue'
import { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface'
const themeVars = useThemeVars()
const props = defineProps({
  /** 笔记 id */
  id: {
    type: String,
    require: false
  },
  /** 笔记 title */
  title: {
    type: String,
    default: ''
  },
  /** 笔记缩略 */
  abbrev: {
    type: String,
    default: ''
  },
  /** 笔记最近更新时间 */
  date: {
    type: [String, Number],
    default: ''
  },
  dropdownOptions: {
    type: Array as PropType<DropdownMixedOption[]>,
    require: true,
    default: () => []
  },
  /** 卡片聚焦状态  */
  active: {
    type: Boolean,
    defalut: false
  }
})
</script>

<template>
  <!-- 注意：这里不可以再裹一层 div，会破坏 css 的选择器逻辑 -->
  <n-card :class="['file-card', props.active && 'active']" size="small" :bordered="false">
    <template #header>
      <n-text class="header-title" :depth="2"> {{ title }} </n-text>
    </template>
    <template #header-extra>
      <n-dropdown :options="dropdownOptions" :trigger="'click'" :show-arrow="true">
        <n-button text class="header-icon" @click.prevent.stop="''">
          <DpzIcon :icon="`${MaterialTypeEnum.FILLED}more_vert`" size="18" />
        </n-button>
      </n-dropdown>
    </template>
    <template #default>
      <n-text class="content" :depth="3"> {{ abbrev }} </n-text>
    </template>
    <template #footer>
      <n-text class="footer" :depth="3">{{ date }}</n-text>
    </template>
  </n-card>
</template>

<style lang="scss" scoped>
.active {
  background-color: v-bind('themeVars.buttonColor2') !important;
  border-radius: v-bind('themeVars.borderRadius') !important;
  border-top: 1px solid #ffffff00 !important;
  border-bottom: 1px solid #ffffff00 !important;
}
.active + .file-card {
  border-top: 1px solid #ffffff00;
}
.file-card {
  margin-top: 1px;
  cursor: default;
  user-select: none;
  background-color: unset;
  border-radius: 0;
  border-top: 1px solid v-bind('themeVars.dividerColor');
  border-bottom: 1px solid #ffffff00 !important;
  transition: unset;
  .header-icon {
    cursor: pointer;
    transition: opacity 0.1s ease-in-out;
    opacity: 0;
  }
  &:hover {
    border-radius: v-bind('themeVars.borderRadius');
    .header-icon {
      opacity: 1;
    }
    background-color: v-bind('themeVars.cardColor');
    border-top: 1px solid #ffffff00;
    &:last-child {
      border-bottom: 1px solid #ffffff00;
    }
  }
  &:first-child {
    border-top: 1px solid #ffffff00;
  }
  &:last-child {
    border-bottom: 1px solid v-bind('themeVars.dividerColor');
  }
  &:hover + .file-card {
    border-top: 1px solid #ffffff00;
  }
  &:hover + div {
    border-top: 1px solid #ffffff00;
  }
}
.header-title {
  margin-right: 6px;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.content {
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  font-size: 12px;
}

.footer {
  font-size: 12px;
}
</style>