<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import useStore from '@/store'
import { FormInst, useMessage, FormRules, FormItemRule } from 'naive-ui'
import { RouteNameEnum, RoutePathEnum } from '@/enums'
interface ModelType {
  hostname: string
  account: string
  password: string
}
const router = useRouter()
const { userStore } = useStore('manage')
const message = useMessage()
// const props = defineProps<{
//   default?: {
//     hostname: string
//     account: string
//     password: string
//   }
// }>()
const formRef = ref<FormInst | null>(null)
//   const model = ref<ModelType>({
//   hostname: 'http://110.41.83.140:3080',
//   account: '',
//   password: '',
// })
const model = ref<ModelType>({
  hostname: 'http://localhost:8081',
  account: '261849747@qq.com',
  password: 'dbx5201314',
})
const rules: FormRules = {
  hostname: [
    {
      required: true,
      message: '请输入服务器主机地址'
    }
  ],
  account: [
    {
      required: true,
      message: '不能包含 & 符号',
      validator(rule: FormItemRule, value: string) {
        if (value.includes('&')) return false
        return true
      },
      trigger: ['input', 'blur']
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码'
    }
  ]
}
function handleLogin() {
  submit()
}

const submit = () => {
  formRef.value?.validate(errors => {
    if (!errors) {
      // 先判断是否已经登录
      userStore.login({
        account: model.value.account,
        password: model.value.password,
      }, model.value.hostname).then((res) => {
        router.push(RoutePathEnum.MANAGE)
        message.success('登录成功')
      }).catch(err => {
        console.log(err)
        message.error('登录失败！')
      })
    } else {
      message.error('表单校验失败！')
      console.log(errors)
    }
  })
}

function handleToRegister() {
  router.push(RoutePathEnum.REGISTER)
}
</script>

<template>
  <n-card class="login">
    <n-space vertical>
      <div class="tip">登录</div>
      <n-form ref="formRef" :model="model" :rules="rules" :show-require-mark="false">
        <n-form-item path="hostname" label="服务器地址">
          <n-input class="form-input" v-model:value="model.hostname" type="text" placeholder="https://" />
        </n-form-item>
        <n-form-item path="account" label="账号">
          <n-input class="form-input" v-model:value="model.account" type="text" placeholder="帐号" />
        </n-form-item>
        <n-form-item path="password" label="密码">
          <n-input class="form-input" v-model:value="model.password" type="password" placeholder="密码" />
        </n-form-item>
      </n-form>
      <n-button class="confirm" @click="handleLogin">登录</n-button>
      <div class="footer">
        <span>没有帐号？<a @click="handleToRegister">去注册</a></span>
      </div>
    </n-space>
  </n-card>
</template>

<style lang="scss" scoped>
.svg-code {
  display: flex;
  align-items: center;
}
.code {
  height: 100%;
  display: flex;
  align-items: center;
}
.login {
  position: relative;
  width: 350px;
  height: 500px;
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
    margin: 15px auto 20px auto;
  }
  .form-input {
    // width: 280px;
    transition: border-bottom 0.5s;
  }
  .confirm {
    width: 280px;
    height: 40px;
    border: none;
    color: #ffffff;
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
