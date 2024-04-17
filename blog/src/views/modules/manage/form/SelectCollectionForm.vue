<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { FormInst, FormItemRule, FormRules } from 'naive-ui'
interface ModelType {
  collectionId: string | null,
  isPublish: boolean
}
type Response = ModelType & Record<string, unknown>
const props = defineProps<{
  data: { id: string, label: string }[]
  submit: (res: Response) => void
}>()
const formRef = ref<FormInst | null>(null)
/** 表单数据 */
const model = ref<ModelType>({
  collectionId: null,
  isPublish: false
})
const options = props.data.map(item => {
  return {
    value: item.id,
    label: item.label
  }
})
onMounted(() => {
  console.log(options)
})
/** 表单规则 */
const rules: FormRules = {
  collectionId: [
    {
      required: true,
      message: '请选择合辑',
      trigger: 'blur'
    }
  ]
}
/** 提交 */
function handleSubmit(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(errors => {
    if (!errors) {
      props.submit(model.value)
    } else {
      console.log(errors)
    }
  })
}
</script>

<template>
  <div class="folder-form">
    <n-space vertical>
      <!-- <div class="tip">新建文件夹</div> -->
      <n-form ref="formRef" :model="model" :rules="rules" :show-require-mark="false">
        <n-form-item path="collectionId" label="合辑">
          <n-select v-model:value="model.collectionId" placeholder="请选择" :options="options" />
        </n-form-item>
        <!-- <n-form-item path="collection" label="是否立即发布"> -->
        <!-- <n-checkbox v-model:checked="model.isPublish">立即发布</n-checkbox> -->
        <!-- </n-form-item> -->
      </n-form>
      <n-button class="confirm" @click="handleSubmit">确认</n-button>
    </n-space>
  </div>
</template>

<style lang="scss" scoped>
.folder-form {
  position: relative;
  // width: 350px;
  // height: 500px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  // align-items: center;
  // border-radius: 15px;
  margin: 30px 0 0;
  z-index: 1;
  .tip {
    width: 100%;
    display: flex;
    align-items: center;
    // justify-content: center;
    font-size: 26px;
    margin: 25px auto 30px auto;
  }
  .confirm {
    width: 100%;
    height: 40px;
    border: none;
    font-weight: bold;
    letter-spacing: 8px;
    border-radius: 10px;
    cursor: pointer;
  }
}
.footer {
  width: 100%;
  display: flex;
  justify-content: center;
  a {
    cursor: pointer;
    color: plum;
  }
}
</style>
