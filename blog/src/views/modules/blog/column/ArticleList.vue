<script lang="ts" setup>
import { h, nextTick, onMounted, ref } from 'vue'
import { useDropdown } from './hooks/dropdown'
import { usePage } from './hooks/page'
import ItemCard from './private/ItemCard.vue'
import { MaterialTypeEnum } from '@/enums'
import { useRenderer } from '@/renderer'
import useStore from '@/store'
import { NDescriptions, NDescriptionsItem, useDialog, useMessage, useThemeVars } from 'naive-ui'
import { useRouter } from 'vue-router'
type ItemCardInfo = typeof articleListStore.data[0]
const props = defineProps<{
  UID: string
  CID: string
}>()
const paginationRef = ref<HTMLElement>()
const dialog = useDialog()
const message = useMessage()
const router = useRouter()
const themeVars = useThemeVars()
const isPaging = ref(false)
const page = usePage()
const dropdown = useDropdown()
const { articleListStore, collectionListStore } = useStore('blog')
const isFloatBtnShow = ref(true) // 浮动翻页按钮隐藏/显示
onMounted(() => {
  articleListStore.$reset()
  articleListStore.fetchAndSet({
    UID: props.UID,
    take: 10,
    skip: 0,
    collectionId: props.CID
  })
  // nextTick(() => {
  //   renderer.implementRef?.addEventListener('scroll', (ev) => {
  //     if (screen.availHeight + renderer.implementRef!.scrollTop > paginationRef.value!.offsetTop + 200) {
  //       isFloatBtnShow.value = false
  //     } else {
  //       isFloatBtnShow.value = true
  //     }
  //   })
  // })
})
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
function handleToTag(tag: string) {
  message.info(tag)
}
</script>
<template>
  <div class="item-showcase">
    <n-card class="card" :title="collectionListStore.data[collectionListStore.data.findIndex((item) => item.id === props.CID)]?.name" size="small">
      <template #header-extra>
        <!-- 排序、过滤 -->
        <!-- <n-dropdown>
          <n-button text>
            <DpzIcon class="icon" :icon="`${MaterialTypeEnum.FILLED}more_vert`" :size="24" />
          </n-button>
        </n-dropdown> -->
      </template>
      <n-list hoverable clickable>
        <ItemCard 
          v-for="item in articleListStore.data"
          :key="item.id"
          :id="item.id"
          :type="item.type"
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
          @to-tag="handleToTag"
        />
        <n-empty v-if="articleListStore.data.length === 0" class="null" description="无数据"></n-empty>
      </n-list>
      <!-- 分页 -->
      <div v-if="articleListStore.data.length !== 0 && isPaging" ref="paginationRef" class="pagination-wrapper">
        <n-pagination v-model:page="page.pageNum.value" @update:page="page.handleUpdate" :page-count="page.pageCount.value" show-quick-jumper>
          <template #goto> 跳转至 </template>
        </n-pagination>
      </div>
    </n-card>
    <!-- 浮动按钮 -->
    <div v-if="articleListStore.data.length !== 0 && isPaging" v-show="isFloatBtnShow" class="float-btn-group">
      <n-space style="width: 100%" :justify="'space-between'">
        <n-button class="float-btn last" strong secondary @click="page.handleLast"> 上一页 </n-button>
        <n-button class="float-btn next" strong secondary @click="page.handleNext"> 下一页 </n-button>
      </n-space>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.null {
  padding: 240px 0;
}
.item-showcase {
  height: 100%;
  width: 100%;
  padding: 0 10px;
  box-sizing: border-box;
  .card {
    padding-bottom: 28px;
  }
  // animation: bounceInRight 0.5s ease-in-out;
  &:hover {
    .float-btn {
      opacity: 1;
    }
  }
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
.pagination-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px;
}
</style>
