<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { NavView } from '..'
import { useThemeVars } from 'naive-ui'

const themeVars = useThemeVars()
onMounted(() => {
 
})
onUnmounted(() => {
  // console.log('destory render page')
})
</script>
<template>
  <div class="blog">
    <NavView />
    <router-view />
  </div>
</template>

<style lang="scss" scoped>
.blog {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: hidden;
  background-color: var(--dpz-bodyColor);
}

</style>
