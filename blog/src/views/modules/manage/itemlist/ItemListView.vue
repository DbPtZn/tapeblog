<script lang="ts" setup>
import { NButton, useThemeVars } from 'naive-ui'
import { LibraryEnum, MaterialTypeEnum } from '@/enums'
import { onMounted, ref } from 'vue'
import { FileCard, FolderCard, CollapseButton } from './private'
import useStore, { SortType } from '@/store'
import utils from '@/utils'
import { ManagerShell } from '../shell'
import { useShell } from '@/renderer'
import { ItemListDropDown } from './dropdown'
import { DropdownMixedOption } from 'naive-ui/es/dropdown/src/interface'
import * as UUID from 'uuid'
const shell = useShell<ManagerShell>()
const themeVars = useThemeVars()
const dropdown = new ItemListDropDown()
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
function handleBack() {}
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
      key: UUID.v4(),
      props: {
        onClick: () => {
          console.log('45')
        }
      }
    },
    {
      label: '重命名',
      key: UUID.v4(),
      props: {
        onClick: () => {
          console.log('45')
        }
      }
    },
    {
      label: '移除',
      key: UUID.v4(),
      props: {
        onClick: () => {
          console.log('45')
        }
      }
    }
  ]
}
function generateCardOptions (id: string, isPublish: boolean): DropdownMixedOption[] {
  if (collectionStore.id === 'unfiled') {
    return dropdown.getUnfiledDropdownOptions(id)
  }
  return dropdown.getFileDropdownOptions(id, isPublish)
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
</script>
<template>
  <div class="itemlist" @mouseover="collapseVisible = true" @mouseleave="collapseVisible = false">
    <Header class="header">
      <n-page-header subtitle="" @back="handleBack">
        <template #back>
          <!-- <DpzIcon :icon="`${MaterialTypeEnum.FILLED}share`" :size="18" /> -->
        </template>
        <template #title>
          <span>{{ collectionStore.name }}</span>
        </template>
        <template #extra>
          <n-space>
            <n-dropdown trigger="click" :options="generateHeaderBtnOptions()" placement="bottom-start">
              <n-button :bordered="false" style="padding: 0 4px">
                <DpzIcon :icon="`${MaterialTypeEnum.FILLED}more_vert`" :size="24" />
              </n-button>
            </n-dropdown>
          </n-space>
        </template>
      </n-page-header>
    </Header>
    <Main class="main" :flex="1">
      <div ref="listRef" class="list" @contextmenu="dropdown.handleContextmenu">
        <FileCard
          v-for="item in collectionStore.subfiles"
          :id="item.id"
          :title="`${item.title}${item.isPublish ? '' : '[未发布]'}` || '未命名文档'"
          :abbrev="item.abbrev"
          :date="utils.dateFormat2(new Date(item.updateAt))"
          :key="item.id"
          :active="shell.workbench.itemId === item.id"
          :dropdown-options="generateCardOptions(item.id, item.isPublish)"
          @click="handleToFile(item.id, item.isParsed)"
          draggable="true"
          @dragstart="dragMethods.handleDragStart($event, item.id)"
          @dragend="dragMethods.handleDragEnd"
        />
      </div>
    </Main>
    <!-- 折叠按钮 -->
    <CollapseButton 
      v-if="collapseVisible || settingStore.isItemListCollapse" 
      :is-collapse="settingStore.isItemListCollapse" 
      @click="handleCollapseItemlist" 
    />
  </div>
  <!-- 右击下拉列表 -->
  <n-dropdown
      placement="bottom-start"
      trigger="manual"
      :x="dropdown.getDropDownX()"
      :y="dropdown.getDropDownY()"
      :options="dropdown.getContextmenuDropdownOptions()"
      :show="dropdown.getShowDropdown()"
      @clickoutside="dropdown.handleHideDropdown()"
    />
</template>

<style lang="scss" scoped>
.header {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 24px 12px 18px 12px;
  // border-bottom: 1px solid v-bind('themeVars.dividerColor');
}
.main {
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 12px 12px;
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