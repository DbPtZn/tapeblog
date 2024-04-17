<script lang="ts" setup>
import useStore from '@/store'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
const props = defineProps<{
  UID: string
  CID?: string
}>()
const { collectionListStore } = useStore('blog')
const router = useRouter()
onMounted(() => {
  collectionListStore.fetchAndSet(props.UID)
})
function handleClick(id: string) {
  router.push(`/${props.UID}/column/${id}`)
}
</script>
<template>
  <div class="collection-list">
    <n-card class="card" title="专栏" size="small">
      <n-list hoverable clickable>
        <n-scrollbar style="max-height: 880px">
          <n-list-item :class="['classify-item', CID === item.id ? 'active' : '']" v-for="(item, index) in collectionListStore.data" :key="index" @click="handleClick(item.id)">
            <span class="classify-item-label">{{ item.name }}</span>
            <n-button size="tiny" secondary strong>
              {{ item.quantity }}
            </n-button>
          </n-list-item>
        </n-scrollbar>
      </n-list>
    </n-card>
  </div>
</template>

<style lang="scss" scoped>
.collection-list {
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  :deep(.n-list-item__main) {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
}
.classify-item {
  opacity: 0.8;
}
.active {
  opacity: 1;
}
</style>
