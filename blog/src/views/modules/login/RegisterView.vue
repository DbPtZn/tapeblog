<script lang="ts" setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import useStore from '@/store'
import { RoutePathEnum } from '@/enums'
import { FormInst, FormItemRule, FormRules, useMessage } from 'naive-ui'
interface ModelType {
  hostname: string
  nickname: string
  account: string
  password: string
}
// const shell = useShell<CreatorShell>()
const router = useRouter()
const { userStore } = useStore('manage')
const formRef = ref<FormInst | null>(null)
const message = useMessage()
/** 表单数据 */
// const model = ref<ModelType>({
//   hostname: 'http://110.41.83.140:3080',
//   nickname: '',
//   account: '',
//   password: ''
// })
const model = ref<ModelType>({
  hostname: 'http://localhost:8081',
  nickname: 'dbx',
  account: '261849747@qq.com',
  password: 'dbx5201314'
})
/** 表单规则 */
const rules: FormRules = {
  hostname: [
    {
      required: true,
      message: '请输入服务器主机地址'
    }
  ],
  nickname: [
    {
      required: true,
      message: '请输入用户昵称',
      trigger: 'blur'
    },
    {
      message: '姓名长度不能超过18个字符',
      trigger: 'blur',
      validator: (rule: FormItemRule, value: string) => {
        return value.length < 18
      }
    }
  ],
  account: [
    {
      required: true,
      message: '请输入账号',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },
    {
      message: '密码长度应该在8~24个字符之间',
      trigger: 'blur',
      validator: (rule: FormItemRule, value: string) => {
        return value.length >= 8 && value.length <= 24 
      }
    }
  ]
}
/** 自动补全邮箱地址 */
const autoCompleteOptions = computed(() => {
  // 可能还需要清理空格（空字符），防止用户输入的时候多了空字符
  return ['@gmail.com', '@163.com', '@qq.com'].map(suffix => {
    const prefix = model.value.account!.split('@')[0]
    return {
      label: prefix + suffix,
      value: prefix + suffix
    }
  })
})
/** 提交注册 */
function handleRegister(e: MouseEvent) {
  e.preventDefault()
  formRef.value?.validate(errors => {
    if (!errors) {
      userStore
        .register(
          {
            account: model.value.account,
            password: model.value.password,
            nickname: model.value.nickname
          },
          model.value.hostname
        )
        .then(res => {
          console.log(res)
          router.push(RoutePathEnum.LOGIN)
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      message.error('表单校验失败！')
      console.log(errors)
    }
  })
}

function handleToLogin() {
  router.push(RoutePathEnum.LOGIN)
}
</script>

<template>
  <n-card class="register">
    <n-space vertical>
      <div class="tip">注册</div>
      <n-form ref="formRef" :model="model" :rules="rules" :show-require-mark="false">
        <n-form-item path="hostname" label="服务器地址">
          <n-input class="form-input" v-model:value="model.hostname" type="text" placeholder="https://" />
        </n-form-item>
        <n-form-item path="nickname" label="昵称">
          <n-input class="form-input" v-model:value="model.nickname" type="text" placeholder="请输入姓名" />
        </n-form-item>
        <n-form-item path="account" label="账号">
          <n-auto-complete v-model:value="model.account" :options="autoCompleteOptions" placeholder="请输入邮箱" />
        </n-form-item>
        <n-form-item path="password" label="密码">
          <n-input class="form-input" v-model:value="model.password" type="password" placeholder="密码" :show-password-on="'click'" />
        </n-form-item>
      </n-form>
      <n-button class="confirm" @click="handleRegister">注册</n-button>
      <div class="footer">
        <span>已有帐号？<a @click="handleToLogin">去登录</a></span>
      </div>
    </n-space>
  </n-card>
</template>

<style lang="scss" scoped>
.register {
  position: relative;
  width: 350px;
  height: 580px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 15px;
  margin: auto;
  z-index: 1;
  .tip {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 26px;
    margin: 25px auto 30px auto;
  }
  .confirm {
    width: 280px;
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
