<script lang="ts" setup>
import useStore, { useDefaultStore } from '@/store'
import { darkThemeOverrides, lightThemeOverrides } from './theme'
import { computed, onMounted, provide, watch } from 'vue'
import { useRouter } from 'vue-router'
const { settingStore } = useStore()
const router = useRouter()
// const theme = computed(() => router.currentRoute.value.query.theme as string)
// watch(() => theme, () => {
//   switch (theme.value) {
//     case 'dark':
//       settingStore.useDark()
//       break
//     case 'light':
//       settingStore.useLight()
//       break
//     default:
//       settingStore.useDark()
//       return
//   }
// }, { deep: true })
// console.log(settingStore.theme)
onMounted(() => {
  // const { settingStore } = useStore()
  // console.log(useStore())
})
</script>
<template>
  <n-config-provider :theme="settingStore.theme" :theme-overrides="settingStore.theme ? darkThemeOverrides : lightThemeOverrides">
    <n-dialog-provider>
      <n-message-provider>
        <n-layout>
          <div ref="rootRef" class="root-page" :data-theme="settingStore.theme ? 'dark-theme' : 'light-theme'">
            <n-message-provider>
              <router-view />
            </n-message-provider>
          </div>
        </n-layout>
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<style lang="scss" scoped>
.n-layout {
  height: 100%;
  width: 100%;
}
.n-config-provider {
  width: 100%;
  height: 100%;
}
.root-page {
  overflow-y: auto;
  overflow-x: hidden;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}
</style>
./theme