<script lang="ts" setup>
import { DpzIcon } from '@/components'
import { MaterialTypeEnum } from '@/enums'
import { size } from 'lodash'
import { MenuOption, useThemeVars } from 'naive-ui'
import { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface'
import { defineComponent, h, ref, Component } from 'vue'
import { DragIndicatorFilled, MenuBookRound, BookRound, BookOutlined } from '@vicons/material'
import { useManageStore } from '@/store'
type Collection = ReturnType<typeof useManageStore>['collectionsDataStore']['data'][0]
defineProps<{
  item: Collection
  dropdownOptions?: DropdownMixedOption[]
}>()
const themeVar = useThemeVars()
</script>
<template>
  <n-button class="collection-item" quaternary>
    <div class="prefix move">
      <n-icon :component="DragIndicatorFilled" :size="24" />
    </div>
    <div class="icon">
      <n-icon :component="item.isPublish ? MenuBookRound : BookOutlined" :size="24" />
    </div>
    <div class="label">
      <div class="txt">{{ item.name }}</div>
    </div>
    <div class="menu">
      <n-dropdown trigger="click" :options="dropdownOptions">
        <n-button text type="tertiary" @click.stop.prevent=";">
          <DpzIcon class="menu-icon" :icon="`${MaterialTypeEnum.FILLED}more_horiz`" :size="24" />
        </n-button>
      </n-dropdown>
    </div>
  </n-button>
</template>

<style lang="scss" scoped>
// .collection {
//   width: 100%;
//   // background-color: v-bind('themeVar.buttonColor2');
// }
:deep(.n-button__content) {
  display: flex;
  flex-direction: row;
  width: 100%;
}

.collection-item {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 38px;
  align-items: unset;
  justify-content: unset;
  padding: 0;
  box-sizing: border-box;

  .prefix {
    height: 100%;
    display: flex;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    color: v-bind('themeVar.textColor3');
    &:hover {
      color: v-bind("themeVar.textColor1");
    }
  }
  .icon {
    height: 100%;
    display: flex;
    align-items: center;
  }
  .label {
    height: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    overflow: hidden;
    padding: 0 6px;
    .txt {
      margin-top: 2px;
      line-height: 38px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .menu {
    height: 100%;
    justify-self: end;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    color: v-bind('themeVar.textColor3');
    .menu-icon {
      color: v-bind("themeVar.textColor3");
      &:hover {
        color: v-bind("themeVar.textColor1");
      }
    }
  }
  &:hover {
    .prefix {
      opacity: 1;
    }
    .menu {
      opacity: 1;
    }
  }
}
</style>
