<script lang="ts" setup>
import { NButton, useThemeVars } from 'naive-ui'
import { LibraryEnum, MaterialTypeEnum } from '@/enums'
import { onMounted, ref } from 'vue'
import { FileCard } from './private'
import useStore, { SortType } from '@/store'
import utils from '@/utils'
import { ManagerShell } from '../shell'
import { useShell } from '@/renderer'
import { useListDropDown } from './hooks/useDropdown'
import { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface'
import { MoreHorizFilled, ChevronLeftFilled } from '@vicons/material'
import ItemListContainer from './ItemListContainer.vue'
const shell = useShell<ManagerShell>()
const themeVars = useThemeVars()

const value = ref()
const listRef = ref<HTMLElement>()
const { collectionStore, productStore } = useStore('manage')
const { settingStore } = useStore()
const sortType = ref<SortType>(SortType.UPDATE_REVERSE)
/** 折叠/展开项目列表 */
const collapseVisible = ref(false)
const handleCollapseItemlist = () => {
  settingStore.isItemListCollapse
  ? (settingStore.isSidebarCollapse ? (shell.expandItemlist(), shell.expandSidebar()) : shell.expandItemlist())
  : (shell.collapseItemlist())
}
function generateHeaderBtnOptions (): DropdownMixedOption[] {
  return [
    {
      label: '排序',
      key: 'file-list-sort',
      children: [
        {
          label: `按更新时间排序${sortType.value === SortType.UPDATE ? ' ↑' : (sortType.value === SortType.UPDATE_REVERSE ? ' ↓' : ' ')}`,
          key: 'sortByUpdateAt',
          props: {
            onClick: () => {
              sortType.value === SortType.UPDATE ? (sortType.value = SortType.UPDATE_REVERSE) : (sortType.value = SortType.UPDATE)
            }
          }
        },
        {
          label: `按创建时间排序${sortType.value === SortType.CREATE ? ' ↑' : (sortType.value === SortType.CREATE_REVERSE ? ' ↓' : ' ')}`,
          key: 'sortByCreateAt',
          props: {
            onClick: () => {
              sortType.value === SortType.CREATE ? (sortType.value = SortType.CREATE_REVERSE) : (sortType.value = SortType.CREATE)
            }
          }
        },
        {
          label: `按名称排序${sortType.value === SortType.NAME ? ' ↑' : (sortType.value === SortType.NAME_REVERSE ? ' ↓' : ' ')}`,
          key: 'sortByName',
          props: {
            onClick: () => {
              sortType.value === SortType.NAME ? (sortType.value = SortType.NAME_REVERSE) : (sortType.value = SortType.NAME)
            }
          }
        }
      ]
    },
    {
      label: '设置',
      key: 'settings',
      disabled: true,
      props: {
        onClick: () => {
          console.log('45')
        }
      }
    }
  ]
}

function handleToFile(id: string, isParsed: boolean) {
  console.log(isParsed)
  shell.useWorkbench()
  shell.workbench.setById({ id }, isParsed ? 'product' : 'unparsed')
}
const dragMethods = {
  handleDragStart(ev: DragEvent, id: string) {
    // console.log(ev)
    ev.dataTransfer?.setData('id', id)
  },
  handleDragEnd(ev: DragEvent) {
    // console.log(ev)
  }
}
const { dropdownState, options, handleClickoutside, handleContextmenu, handleMoreAction, handleSelect } = useListDropDown()
</script>
<template>
  <ItemListContainer>
  <div class="itemlist" @mouseover="collapseVisible = true" @mouseleave="collapseVisible = false">
    <div class="header">
      <!-- 顶部导航 -->
      <div class="header-nav">
        <!-- 当前文件夹 -->
        <div class="header-nav-left">
          <!-- 普通文件夹模式下 -->
          <div class="header-nav-left-item">
            <div class="name">
              {{ collectionStore.name }} 
            </div>
          </div>
        </div>
        <!-- 按钮 -->
        <div class="header-nav-right">
          <n-dropdown trigger="click" :options="generateHeaderBtnOptions()" placement="bottom-start">
            <n-button text >
              <n-icon :component="MoreHorizFilled" :size="24" />
            </n-button>
          </n-dropdown>
        </div>
      </div>
    </div>
    <div ref="scrollerRef" class="main">
      <div ref="listRef" class="list">
        <FileCard
          v-for="item in collectionStore.getSubfiles(sortType)"
          :id="item.id"
          :type="item.type"
          :is-publish="item.isPublish"
          :title="item.title"
          :abbrev="item.abbrev"
          :date="utils.dateFormat2(new Date(item.updateAt))"
          :key="item.id"
          :active="shell.workbench.itemId === item.id"
          draggable="true"
          @dragstart="dragMethods.handleDragStart($event, item.id)"
          @dragend="dragMethods.handleDragEnd"
          @click="handleToFile(item.id, item.isParsed)"
          @on-more-action="handleMoreAction($event, item)"
          @contextmenu="handleContextmenu($event, item)"
        />
      </div>
    </div>
  </div>
</ItemListContainer>
  <!-- 右击下拉列表 -->
  <n-dropdown
    trigger="manual"
    :placement="dropdownState.placementRef"
    :show-arrow="dropdownState.showArrowRef"
    :x="dropdownState.xRef"
    :y="dropdownState.yRef"
    :options="options"
    :show="dropdownState.showDropdownRef"
    @select="handleSelect"
    @clickoutside="handleClickoutside"
  />
</template>

<style lang="scss" scoped>
.header-nav {
  width: 100%;
  display: flex;
  flex-direction: row;
  // align-items: center;
  // justify-content: space-between;
  .header-nav-left {
    display: flex;
    align-items: center;
    overflow: hidden;
    flex: 1;
    .header-nav-left-item {
      width: 100%;
      display: flex;
      align-items: center;
      overflow: hidden;
      .name {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }
  .header-nav-right {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 6px;
    }
}
.header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px 12px 18px 12px;
}
.main {
  flex: 1;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 12px;
  box-sizing: border-box;
  .list {
    height: 100%;
    width: 100%;
  }
}

.itemlist {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-right: 1px solid v-bind('themeVars.dividerColor');
  &:hover {
    /*定义滑块 内阴影+圆角*/
    ::-webkit-scrollbar-thumb {
      border-radius: 10px;
      background-color: v-bind('themeVars.scrollbarColor');
    }
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
  background-color: unset;
}
</style>