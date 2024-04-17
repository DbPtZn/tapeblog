<script lang="ts" setup>
import useStore from '@/store'
import dayjs from 'dayjs'
import { parser } from './hooks/_index'
import { useDialog, useMessage } from 'naive-ui'
import { onMounted } from 'vue'
import { useShell } from '@/renderer'
import { ManagerShell } from '@/views'
const { collectionStore, productStore, userStore } = useStore('manage')
const shell = useShell<ManagerShell>()
const props = defineProps<{
  id: string
}>()
const dialog = useDialog()
const message = useMessage()
// const data = collectionStore.subfiles.filter((item) => item.id === props.id)?.[0]
onMounted(() => {
  productStore.fetchAndSet(props.id)
})
function handleParse() {
  const product = productStore.get(props.id)
  if (!product) {
    message.error('目标作品不存在！')
    return
  }
  const managerToken = sessionStorage.getItem('managerToken')
  if (!managerToken) {
    message.error('权限不足')
    return
  }
  productStore.fetchUnparsedFile(product.content, (progress: number) => {
    // 下载进度
    message.info(`下载进度：${progress}%`)
  }).then(res => {
    console.log(res.data)
    const uploadImgUrl = '/upload/img' // 上传图片的 API 接口
    parser.parseContent({
      content: res.data.content,
      hostname: userStore.hostname,
      accessToken: managerToken,
      uploadImgUrl: uploadImgUrl
    }).then(result => {
      const { content, firstPicture } = result
      console.log(content)
      productStore.parse({
        id: props.id,
        firstPicture: firstPicture,
        content: content,
        duration: res.data.duration,
        promoterSequence: res.data.promoterSequence,
        keyframeSequence: res.data.keyframeSequence,
        subtitleSequence: res.data.subtitleSequence,
        subtitleKeyframeSequence: res.data.subtitleKeyframeSequence
      }).then(res => {
        message.success('解析成功！')
        shell.useWorkbench()
        shell.workbench.setById({ id: props.id }, 'product', true)
      })
    })
  })
}
function handleReject() {
  //TODO 可以研究如何在拒收后快捷通过邮件或其它方式向作者发送信息
  dialog.create({
    title: '是否拒绝该作品？',
    content: '拒绝后将无法恢复！',
    positiveText: '放弃',
    negativeText: '取消',
  })
}
</script>

<template>
  <div class="unparsed">
    <div>
      <n-descriptions class="desc" label-style="white-space: nowrap;" label-placement="left" label-align="center" :column="1" :bordered="true" title="作品详情">
        <n-descriptions-item label="作者"> {{productStore.get(id)?.penname}} </n-descriptions-item>
        <n-descriptions-item label="邮箱"> {{productStore.get(id)?.email}} </n-descriptions-item>
        <n-descriptions-item label="作者主页"> {{productStore.get(id)?.homepage}} </n-descriptions-item>
        <n-descriptions-item label="投稿时间"> {{dayjs(productStore.get(id)?.createAt).format('YYYY-MM-DD HH:mm:ss')}} </n-descriptions-item>
        <n-descriptions-item label="字数"> {{productStore.get(id)?.detial.wordage}} </n-descriptions-item>
        <n-descriptions-item label="文本质量"> {{productStore.get(id)?.detial.filesize}} </n-descriptions-item>
        <n-descriptions-item label="音频质量"> {{productStore.get(id)?.detial.audiosize}} </n-descriptions-item>
        <n-descriptions-item label="备注信息"> {{productStore.get(id)?.msg}} </n-descriptions-item>
        <n-descriptions-item label="状态"> {{productStore.get(id)?.isParsed ? '已解析' : '未解析'}} </n-descriptions-item>
      </n-descriptions>
      <div class="btn">
        <n-flex>
          <n-button v-if="!productStore.get(id)?.isParsed" :size="'large'" type="success" @click="handleParse()"> {{'解析'}} </n-button>
          <n-button v-if="!productStore.get(id)?.isParsed" :size="'large'" @click="handleReject()"> {{'拒稿'}} </n-button>
        </n-flex>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.unparsed {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.desc {
  min-width: 600px;
}
.btn {
  width: 100%;
  display: flex;
  // align-items: end;
  justify-content: end;
  margin-top: 10px;
}
</style>
