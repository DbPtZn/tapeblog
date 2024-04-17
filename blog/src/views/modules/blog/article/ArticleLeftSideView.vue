<script setup lang="ts">
import { useThemeVars } from 'naive-ui'
import useStore from '@/store'
import { useRouter } from 'vue-router'
import { computed, onMounted, reactive, ref } from 'vue'
import { CollectionCard } from './private/_api'
import { CollectionCardData } from './private/CollectionCard.vue'
import * as utils from '@/utils'
import { RouteNameEnum } from '@/enums'
import bridge from './bridge'
import anime from 'animejs'
import { OutlineService } from '@/editor'
import { auditTime } from '@tanbo/stream'
const props = defineProps<{
  id: string
}>()
const elementRef = ref<HTMLElement>()
const { articleStore, collectionStore } = useStore('blog')
const router = useRouter()
const outlineRef = ref()
const themeVars = useThemeVars()
const collectionRef = ref<HTMLElement>()
onMounted(() => {
  bridge.onEditorReady.pipe(auditTime(100)).subscribe((editor) => {
    const outlineService = editor.get(OutlineService)
    outlineService.setHost(outlineRef.value)
  })
})
const state = reactive({
  //
})
const { handleDirCollapseChange } = {
  handleDirCollapseChange() {
    if (!bridge.habit.state.dir.isCollapse) {
      anime({
      targets: collectionRef.value,
      translateX: [0, -280],
      opacity: [1, 0.8],
      easing: 'easeOutQuad',
      }).complete = () => {
        bridge.habit.state.dir.isCollapse = true
      }
    } else {
      // if (articleStore.collectionId && collectionStore.id !== articleStore.collectionId) {
      //   collectionStore.fetchAndSet(articleStore.collectionId)
      // }
      bridge.habit.state.dir.isCollapse = false
      anime({
        targets: collectionRef.value,
        translateX: [-200, 0],
        opacity: [0.8, 1],
        easing: 'easeOutQuad',
      })
    }
  },
}
const cardData = computed<CollectionCardData[]>(() => {
  return collectionStore.subfiles.map(product => {
    return {
      id: product.id,
      date: product.createAt,
      title: product.title,
      content: product.abbrev,
      image: product.image || ''
    }
  })
})
</script>

<template>
  <div ref="elementRef" class="article-left-side">
    <!-- 头部 -->
    <Header :height="'8%'">
      <!-- <div class="article-left-header" @click="router.push({ name: RouteNameEnum.HOME })">返回主页</div> -->
    </Header>
    <!-- 核心 -->
    <Main :flex="1" class="main">
      <div v-show="!bridge.habit.state.platform.isOutlineHide" ref="outlineRef" :style="{ marginLeft: '12px' }" />
      <!-- <n-space v-if="!bridge.habit.state.platform.isOutlineHide" id="article-outline" class="article-outline" vertical>
        <div v-for="(item, index) in bridge.outline.state.data" :key="index" :class="['outline-heading-item', `outline-heading-${item.tagName}`]">
          <a
            :class="['outline-heading-text', bridge.outline.state.activeIndex === index ? 'active' : '']"
            href="javascript:;"
            @click="bridge.outline.scrollTo(item.offsetTop)"
          >
            {{ item.text }}
          </a>
        </div>
      </n-space> -->
    </Main>
    <!-- 底部 -->
    <Footer :height="'10%'"></Footer>
  </div>
  <!-- 合辑目录 -->
  <div class="article-dir" :style="{ width: `${bridge.habit.state.dir.isCollapse ? 0 : '100%'}` }">
    <div class="article-dir-expand" ref="collectionRef" :style="{ minWidth: `${bridge.habit.state.dir.isCollapse ? 0 : '280px'}` }">
      <n-card class="article-dir-wrapper" v-show="!bridge.habit.state.dir.isCollapse" :size="'small'">
        <template #header>
          <span>{{ collectionStore.name }}</span>
        </template>
        <template #header-extra>
          <n-button text class="article-dir-collapse-btn">
            <DpzIcon :icon="'material-icons-outlined-menu_open'" :size="26" @click="handleDirCollapseChange" />
          </n-button>
        </template>
        <n-scrollbar style="max-height: 78vh">
          <CollectionCard v-for="card in cardData" :key="card.id" class="article-dir-card" :data="card" :height="120" />
        </n-scrollbar>
      </n-card>
    </div>
    <div class="article-dir-collapse" v-show="bridge.habit.state.dir.isCollapse">
      <n-button text @click="handleDirCollapseChange">
        <DpzIcon icon="material-icons-outlined-read_more" size="26" />
      </n-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.article-left-side {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}
.header {
  .article-left-header {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.6em;
    cursor: pointer;
    opacity: 0;
    transition: all 0.5s ease-in-out;
  }
  &:hover {
    .article-left-header {
      opacity: 1;
    }
  }
}
.main {
  display: flex;
  // flex-direction: row;
  // justify-content: flex-end;
  .article-outline {
    width: 100%;
    padding: 10px;
    box-sizing: border-box;
  }
  .outline-heading-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: v-bind('themeVars.textColor3');
    &:hover {
      color: v-bind('themeVars.textColor1');
    }
  }
  .active {
    color: v-bind('themeVars.textColor1');
  }
}
.article-dir {
  position: absolute;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  .article-dir-expand {
    position: fixed;
    display: flex;
    align-items: center;
    height: 100%;
    min-width: 280px;
    z-index: 1;
    .article-dir-wrapper {
      height: 85vh;
      :deep(.n-card__content) {
        padding: 0;
        .n-scrollbar {
          padding: 12px;
          box-sizing: border-box;
        }
      }
      .article-dir-card {
        margin-bottom: 10px;
      }
      .article-dir-collapse-btn {
        opacity: 0;
      }
      &:hover {
        .article-dir-collapse-btn {
          opacity: 1;
        }
      }
    }
    :deep(.n-card-header__main) {
      line-height: normal;
    }
  }
  .article-dir-collapse {
    position: fixed;
    left: -20px;
    display: flex;
    flex-direction: column;
    border-radius: 90px;
    background-color: v-bind('themeVars.cardColor');
    animation: lightSpeedInLeft 0.8s ease-in-out;
    .n-button {
      height: 45px;
      width: 45px;
    }
  }
}
/** 标题大小 */
.outline-heading-h1 {
  line-height: 2;
  padding-left: 0em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.outline-heading-h2 {
  line-height: 2;
  padding-left: 1em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.outline-heading-h3 {
  line-height: 2;
  padding-left: 2em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.outline-heading-h4 {
  line-height: 2;
  padding-left: 3em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.outline-heading-h5 {
  line-height: 2;
  padding-left: 4em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.outline-heading-h6 {
  line-height: 2;
  padding-left: 5em;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
