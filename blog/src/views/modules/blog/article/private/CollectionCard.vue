/** 合辑卡片 */
<script setup lang="ts">
import { useThemeVars } from 'naive-ui'
import { computed } from 'vue'
const themeVars = useThemeVars()
export interface CollectionCardData {
  id: string
  date?: string
  title?: string
  content?: string
  image?: string
}
const props = defineProps<{
  data: CollectionCardData
  width?: string | number
  height?: string | number
  size?: 'small' | 'medium' | 'large' | 'huge'
}>()
const widthVal = computed<string>(() => {
  if (!props.width) return '100%'
  if (typeof props.width === 'number') return props.width + 'px'
  return props.width
})
const heightVal = computed<string>(() => {
  if (!props.height) return '100%'
  if (typeof props.height === 'number') return props.height + 'px'
  return props.height
})
const methods = {
  handleError: (ev: Event) => {
    const target = ev.target as HTMLImageElement
    target.src = './default.png'
  }
}
</script>

<template>
  <div class="collection">
    <n-card class="collection-card" :size="'small'" hoverable>
      <!-- 左侧 -->
      <LeftSide :width="'110px'">
        <div class="collection-card-left">
          <img :src="data.image" @error="methods.handleError" />
        </div>
      </LeftSide>
      <!-- 中间 -->
      <MiddleSide :flex="1">
        <div class="collection-card-middle-wrapper">
          <span class="collection-card-middle-title">{{ data.title }}</span>
          <span class="collection-card-middle-content">{{ data.content }}</span>
          <small class="collection-card-middle-time">{{ data.date }}</small>
        </div>
      </MiddleSide>
    </n-card>
  </div>
</template>

<style lang="scss" scoped>
.collection {
  display: flex;
  width: v-bind(widthVal);
  height: v-bind(heightVal);
  box-sizing: border-box;
  // padding: 3px;
  .collection-card {
    display: flex;
    flex-direction: row;
    cursor: pointer;
    padding: 6px;
    :deep(.n-card__content) {
      display: flex;
      flex-direction: row;
    }
  }
}
.left-side {
  .collection-card-left {
    width: 100px;
    overflow: hidden;
    border-radius: 6px;
    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }
  }
}

.middle-side {
  .collection-card-middle-wrapper {
    width: 110px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 6px;
    .collection-card-middle-time {
      color: v-bind('themeVars.textColor3');
    }
    .collection-card-middle-title {
      font-size: 1em;
      font-weight: 600;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .collection-card-middle-content {
      display: -webkit-box;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
}
</style>
