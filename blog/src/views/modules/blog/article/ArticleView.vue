<script lang="ts" setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import ArticleContentView from './ArticleContentView.vue'
import ArticleLeftSideView from './ArticleLeftSideView.vue'
import ArticleRightSideView from './ArticleRightSideView.vue'
import { useRouter } from 'vue-router'
import useStore from '@/store'

const router = useRouter()

const AID = computed(() => router.currentRoute.value.params.AID as string)

onMounted(() => {
  console.log(AID.value)
  const { articleStore } = useStore('blog')
  /** 获取页面数据 */
  articleStore.fetchAndSet(AID.value)
})
onUnmounted(() => {
  // console.log('destory render page')
})
</script>
<template>
  <div class="article">
    <ArticleLeftSideView :id="AID" />
    <ArticleContentView :id="AID" />
    <ArticleRightSideView :id="AID" />
  </div>
</template>

<style lang="scss" scoped>
.article {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  overflow-x: hidden;
  // .left {

  // }
  // .content {

  // }
  // .right {

  // }
}
</style>
