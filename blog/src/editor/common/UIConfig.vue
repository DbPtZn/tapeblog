<template>
  <n-config-provider :theme="theme" :style="{ width: '100%' }">
    <n-message-provider>
      <slot />
    </n-message-provider>
  </n-config-provider>
</template>
<script lang="ts" setup>
import { inject, onUnmounted, ref } from 'vue'
import { GlobalTheme, darkTheme } from 'naive-ui'
import { Injector } from '@textbus/core'
import { ConfigProvider } from '@/editor'
const injector = inject<Injector>('injector')
const configProvider = injector?.get(ConfigProvider)
const theme = ref<GlobalTheme | null | undefined>(configProvider?.theme === 'dark' ? darkTheme : null)
const sub = configProvider?.onThemeUpdate.subscribe(themeState => {
  switch (themeState) {
    case 'dark':
      theme.value = darkTheme
      break
    case 'light':
      theme.value = null
      break
    default:
      return
  }
})
onUnmounted(() => {
  sub?.unsubscribe()
})
</script>

<style scoped></style>
