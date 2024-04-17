<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
// import { useThemeVars } from 'naive-ui'
import ArticleList from './ArticleList.vue'
import CollectionList from './CollectionList.vue'
import router from '@/router'
// import useStore from '@/store'
const CID = computed(() => router.currentRoute.value.params.CID as string)
const UID = computed(() => router.currentRoute.value.params.UID as string)
// const themeVars = useThemeVars()
// const { collectionListStore, articleListStore } = useStore('blog')
onMounted(() => {
  // console.log(CID.value)
})
onUnmounted(() => {
  // console.log('destory render page')
})
</script>
<template>
  <div class="column">
    <div class="column__left"></div>
    <div class="column__center">
      <div class="collection-list">
        <CollectionList :UID="UID" :CID="CID"/>
      </div>
      <div class="product-list" v-if="CID">
        <ArticleList :key="$route.fullPath" :UID="UID" :CID="CID"/>
      </div>
    </div>
    <div class="column__right"></div>
  </div>
</template>

<style lang="scss" scoped>
.column {
  padding-top: 12px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  background-color: var(--dpz-bodyColor);
}
.column__center {
  width: 1108px;
  display: flex;
  flex-direction: row;
  .collection-list {
    width: 280px;
  }
  .product-list {
    width: 828px;
  }
}

</style>./ArticleList.vue
