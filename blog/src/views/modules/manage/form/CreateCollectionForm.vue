<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { FormInst, FormItemRule, FormRules } from 'naive-ui'
interface ModelType {
  name: string
}
type Response = ModelType & Record<string, unknown>
const props = defineProps<{
  // name?: string
  submit: (res: Response) => void
}>()
const formRef = ref<FormInst | null>(null)
/** 表单数据 */
const model = ref<ModelType>({
  name: '',
})
/** 表单规则 */
const rules: FormRules = {
  name: [
    {
      required: true,
      message: '合辑名称不能为空',
      trigger: 'blur'
    },
    {
      message: '合辑名称长度不能超过18个字符',
      trigger: 'blur',
      validator: (rule: FormItemRule, value: string) => {
        return value.length < 18
      }
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
        <n-form-item path="name" label="合辑名称">
          <n-input class="form-input" v-model:value="model.name" type="text" placeholder="请输入合辑名称" maxlength="18" show-count />
        </n-form-item>
      </n-form>
      <n-button class="confirm" @click="handleSubmit">创建</n-button>
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
