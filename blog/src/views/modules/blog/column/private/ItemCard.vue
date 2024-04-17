/** 文章卡片 */
<script setup lang="ts">
import { useThemeVars } from 'naive-ui'
import { reactive, PropType } from 'vue'
import { MaterialTypeEnum } from '@/enums'
import { PlayLessonRound } from '@vicons/material'
import dayjs from 'dayjs'
interface Count {
  like: number //点赞数
  comment: number // 评论数
  collection: number // 收藏数
  read: number // 阅读数
}
const themeVars = useThemeVars()
const props = defineProps({
  id: {
    type: String,
    require: true
  },
  type: {
    type: String as PropType<'course' | 'note'>,
    require: false
  },
  msg: {
    type: String,
    require: false,
    vaildator(value: string) {
      return value.length <= 30
    }
  },
  createAt: {
    type: String,
    require: false
  },
  avatar: {
    type: String,
    require: false
  },
  penname: {
    type: String,
    require: false
  },
  detail: {
    type: String,
    require: false
  },
  firstPicture: {
    type: String,
    require: false
  },
  title: {
    type: String,
    require: false
  },
  abbrev: {
    type: String,
    require: false
  },
  collectionName: {
    type: String,
    require: false
  },
  tags: {
    type: Array as PropType<string[]>,
    require: false
  },
  count: {
    type: Object as PropType<Count>,
    require: false
  }
})

const state = reactive({
  id: props.id || undefined,
  type: props.type || '',
  msg: props.msg || '',
  createAt: dayjs(props.createAt).format('YYYY-MM-DD HH:mm:ss') || '',
  avatar: props.avatar || './avatar03.png',
  penname: props.penname || '佚名',
  detail: props.detail || '',
  firstPicture: props.firstPicture || '',
  title: props.title || '无标题',
  abbrev: props.abbrev || '无内容',
  collectionName: props.collectionName || '',
  tags: props.tags || [],
  count: props.count || { like: 0, comment: 0, collection: 0, read: 0 }
})
const methods = {
  handleError: (ev: Event) => {
    const target = ev.target as HTMLImageElement
    target.src = './error.png'
  }
}
const emits = defineEmits<{
  readMore: [id: string]
  viewAuthor: []
  toTag: [tag: string]
}>()
</script>

<template>
  <div class="item-card">
    <Header class="header">
      <div class="createAt">{{ state.createAt }}</div>
      <div class="penname" @click="emits('viewAuthor')">
        <span>{{ state.penname }}</span>
      </div>
    </Header>
    <Main class="main">
      <div class="container">
        <div class="title"  @click="emits('readMore', state.id!)">
          <span class="title-text">{{ state.title }}</span>
          <n-icon v-if="state.type === 'course'" class="title-icon" :component="PlayLessonRound" :size="24" />
        </div>
        <div class="content">
          <div class="left">
            <div class="text">
              {{ state.abbrev.slice(0, 60) }}
              <span>...</span>
              <a class="expand"  @click="emits('readMore', state.id!)">
                <span>阅读全文</span>
                <DpzIcon class="icon" :icon="`${MaterialTypeEnum.FILLED}keyboard_arrow_down`" :size="18" />
              </a>
            </div>
            <!-- <div class="count"></div> -->
          </div>
          <div class="right first-image" v-if="state.firstPicture">
            <img :src="state.firstPicture" alt="" @error="methods.handleError" />
          </div>
        </div>
      </div>
    </Main>
    <Footer class="footer">
      <n-space :align="'center'" :justify="'start'" :size="[6, 0]">
        <n-tag class="tag" v-for="tag in state.tags" :key="tag" :bordered="false" @click="emits('toTag', tag)" >
          {{ tag }}
        </n-tag>
      </n-space>
    </Footer>
  </div>
</template>

<style lang="scss" scoped>

.item-card {
  // min-height: 200px;
  // max-height: 200px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 16px 20px;
  border-bottom: 1px solid v-bind('themeVars.borderColor');
  .item-card-wrapper {
    display: flex;
  }
  &:hover {
    .more {
      opacity: 1;
    }
  }
}
.header {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  .penname {
    margin-left: 10px;
    font-synthesis: style;
    font-weight: 600;
    cursor: pointer;
  }
  .author-info {
    display: flex;
    align-items: center;
    .author-info-txt {
      font-size: 16px;
      text-align: center;
      vertical-align: middle;
    }
  }
  margin-bottom: 4px;
}
.main {
  flex: 1;
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
  overflow: hidden;
  // margin-bottom: 10px;
  .container {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .title {
    display: flex;
    align-items: center;
    .title-text {
      overflow: hidden;
      cursor: pointer;
      font-size: 18px;
      font-synthesis: style;
      font-weight: 600;
      word-break: break-word;

      display: -webkit-box;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
      white-space: pre-line;
    }
    .title-icon {
      margin-left: 6px;
    }
  }
  .content {
    display: flex;
    flex-direction: row;
    max-height: 100px;
    margin-top: 5px;
    word-break: break-word;
    line-height: 1.72;
    font-size: 16px;
    .left {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-right: 6px;
      .text {
        flex: 1;
        overflow: hidden;
        display: -webkit-box;
        text-overflow: ellipsis;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        word-break: break-all;
        white-space: pre-line;
        margin-bottom: 6px;
        .expand {
          display: inline-flex;
          cursor: pointer;
          align-items: center;
          text-align: center;
          margin-left: 5px;
          color: v-bind('themeVars.textColor3');
          &:hover {
            color: v-bind('themeVars.textColor2');
          }
        }
      }
      .count {
        // margin-top: 6px;
        font-size: 14px;
        line-height: 14px;
      }
    }
    .right {
      display: flex;
      width: 190px;
      height: 105px;
      img {
        height: 100%;
        width: 100%;
        // object-fit: cover;
      }
    }
  }
}
.footer {
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  .tag {
    cursor: pointer;
    &:hover {
      background-color: v-bind('themeVars.buttonColor2');
    }
  }
}

.left-side {
  .item-card-left {
    // width: 100px;
    img {
      height: 100%;
      width: 100%;
    }
  }
}

.middle-side {
  .item-card-middle-wrapper {
    display: flex;
    flex-direction: column;
    .item-card-middle-time {
      color: v-bind('themeVars.textColor3');
    }
    .item-card-middle-title {
      font-size: 1.5em;
      font-weight: 600;
      line-height: 2em;
    }
    .item-card-middle-content {
      display: -webkit-box;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      overflow: hidden;
    }
  }
}
</style>

<!-- <div class="like">
  <span>{{ state.count.like }} 点赞</span>
</div>
<span>·</span>
<div class="comment">
  <span class="comment-txt">{{ state.count.comment }} 评论</span>
</div>  -->
