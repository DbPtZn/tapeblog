<script setup lang="ts">
// import elementResizeDetector from 'element-resize-detector'
import { computed, h, nextTick, onMounted, onUnmounted, ref } from 'vue'
import ItemCard from './private/ItemCard.vue'
import { MoreHoriz } from '@/components'
import { MoreVertRound } from '@vicons/material'
import { NDescriptions, useDialog, useThemeVars, NDescriptionsItem, useMessage } from 'naive-ui'
import { MaterialTypeEnum, RouteNameEnum, RoutePathEnum } from '@/enums'
import { useDropdown } from './hooks/dropdown'
import { usePage } from './hooks/page'
import useStore from '@/store'
import { useRouter } from 'vue-router'
type ItemCardInfo = typeof articleListStore.data[0]
const dialog = useDialog()
const message = useMessage()
const elementRef = ref<HTMLElement>()
const paginationRef = ref<HTMLElement>()
const themeVars = useThemeVars()
const router = useRouter()
const isFloatBtnShow = ref(true) // 浮动翻页按钮隐藏/显示
const { articleListStore } = useStore('blog')
const props = defineProps<{
  UID: string
}>()
// const UID = computed(() => router.currentRoute.value.params.UID as string)
onMounted(() => {
  // console.log('mounted')
  // console.log(router.currentRoute.value)
  // console.log(UID.value)
  /** 载入博客数据 */
  if(props.UID) {
    articleListStore.$reset()
    articleListStore.fetchAndSet({ UID: props.UID, take: 10, skip: 0 })
  }
  /** 侦听滚动状态：控制浮动按钮显示/隐藏 */
  // nextTick(() => {
  //   renderer.implementRef?.addEventListener('scroll', (ev) => {
  //     if (screen.availHeight + renderer.implementRef!.scrollTop > paginationRef.value!.offsetTop) {
  //       isFloatBtnShow.value = false
  //     } else {
  //       isFloatBtnShow.value = true
  //     }
  //   })
  // })
})
onUnmounted(() => {})
function handleReadMore(id: string) {
  router.push({ path: `/${props.UID}/article/${id}` })
}
function handleViewAuthor(item: ItemCardInfo) {
  dialog.info({
    title: '作者信息',
    content: () => h(NDescriptions, { labelPlacement: "left", column: 1, bordered: true, style: { padding: '24px 0px' } }, {
      default: () => [
        h(NDescriptionsItem, { label: '笔名' }, { default: () => item.penname }),
        h(NDescriptionsItem, { label: '邮箱' }, { default: () => item.email }),
        h(NDescriptionsItem, { label: '网站' }, { default: () => h('a', { style: { color: themeVars.value.textColor2 }, href: item.homepage, target: '_blank' }, item.homepage) }),
      ]
    })
  })
}
function handleToCollection(collectionId: string) {
  router.push(`/${props.UID}/column/${collectionId}`)
}
function handleToTag(tag: string) {
  message.info(tag)
}
const tabData = [
  {
    id: 1,
    name: 'all',
    tab: '全部',
    disabled: false
  },
  {
    id: 2,
    name: 'recommend',
    tab: '图文',
    disabled: true
  },
  {
    id: 3,
    name: 'collect',
    tab: '动态',
    disabled: true
  }
]
const page = usePage()
const { dropdownState, options, handleClickoutside, handleSelect, handleContextmenu, handleItemMore, handleShowOptions  } = useDropdown()

const isPaging = ref(false)
</script>

<template>
  <div ref="elementRef" class="showcase showbtn">
    <!-- 项目列表 -->
    <n-card class="showcase-card" size="small" :style="{ backgroundColor: themeVars.bodyColor }">
      <!-- 头部按钮 -->
      <div class="more-btn">
        <n-icon :component="MoreVertRound" :size="24" @click="handleShowOptions"/>
      </div>
      <div class="item-list-wrapper">
        <div :class="['item-list', 'paging']">
          <!-- 标签页 -->
          <n-tabs type="line" size="large" animated>
            <n-tab-pane v-for="item in tabData" :key="item.id" :name="item.name" :tab="item.tab" :disabled="item.disabled">
              <div class="showcase-item" v-for="(item, index) in articleListStore.data" :key="index">
                <ItemCard
                  :id="item.id"
                  :penname="item.penname"
                  :firstPicture="item.firstPicture"
                  :title="item.title"
                  :abbrev="item.abbrev"
                  :collectionName="item.collectionName"
                  :tags="item.tags"
                  :createAt="item.createAt"
                  :count="item.count"
                  @read-more="handleReadMore"
                  @view-author="handleViewAuthor(item)"
                  @to-collection="handleToCollection(item.collectionId)"
                  @to-tag="handleToTag"
                 />
              </div>
              <n-empty v-if="articleListStore.data.length === 0" class="null" description="无数据"></n-empty>
            </n-tab-pane>
          </n-tabs>
        </div>
      </div>
    </n-card>
    <!-- 分页 -->
    <div v-if="articleListStore.data.length !== 0 && isPaging" ref="paginationRef" class="pagination-wrapper">
      <n-pagination v-model:page="page.pageNum.value" @update:page="page.handleUpdate" :page-count="page.pageCount.value" show-quick-jumper>
        <template #goto>
          跳转至
        </template>
      </n-pagination>
    </div>
    <!-- 浮动按钮 -->
    <div v-if="articleListStore.data.length !== 0 && isPaging" v-show="isFloatBtnShow" class="float-btn-group">
      <n-space style="width: 100%;" :justify="'space-between'">
        <n-button class="float-btn last" strong secondary @click="page.handleLast"> 上一页 </n-button>
        <n-button class="float-btn next" strong secondary @click="page.handleNext"> 下一页 </n-button>
      </n-space>
    </div>
  </div>
  <!-- 右击下拉列表 -->
  <n-dropdown
    v-if="articleListStore.data.length !== 0"
    :showArrow="dropdownState.showArrowRef"
    :placement="dropdownState.placementRef"
    trigger="manual"
    :x="dropdownState.xRef"
    :y="dropdownState.yRef"
    :options="options"
    :show="dropdownState.showDropdownRef"
    @select="handleSelect"
    @clickoutside="handleClickoutside"
  />
</template>

<style lang="scss" scoped>
.null {
  padding: 30px 0;
}
.float-btn-group {
  width: inherit;
  height: 20px;
  .float-btn {
    position: fixed;
    bottom: 12px;
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }
  .last {
    transform: translateX(10%);
  }
  .next {
    transform: translateX(-110%);
  }
}
.more-btn {
  // background-color: #fff;
  height: 63px;
  width: 300px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-right: 20px;
  position: absolute;
  right: 0px;
  opacity: 0;
  cursor: pointer;
  transition: opacity 0.3s ease-in-out;
  z-index: 1;
  &:hover {
    opacity: 1;
  }
}
:deep(.n-tabs-wrapper) {
  padding: 8px 6px;
  .n-tabs-tab--active {
    color: v-bind('themeVars.successColor') !important;
  }
  .n-tabs-tab__label {
    font-weight: 500;
    font-size: 18px;
    line-height: 18px;
    display: flex;
    align-items: center;
  }
  .n-tabs-tab {
    margin: 0px 18px;
  }
}
:deep(.n-tabs-bar) {
  display: none;
}
:deep(.n-tab-pane) {
  padding: 0;
  min-height: 1200px;
}
.showcase {
  height: 100%;
  width: 100%;
  min-width: 800px;
  display: flex;
  flex-direction: column;
  // box-sizing: border-box;
  position: relative;
  background-color: v-bind('themeVars.bodyColor');
  box-shadow: var(--dpz-boxShadow4);
  .showcase-card {
    width: 100%;
  }
  .item-list-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    .item-list {
      .showcase-item {
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
}
.showbtn {
  &:hover {
    .float-btn {
      opacity: 1;
    }
  }
}
.pagination-wrapper {
  // height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
  box-sizing: border-box;
  padding-bottom: 120px;
}
// 卡片标题
:deep(.n-card > .n-card__content) {
  padding: 0;
}
</style>
