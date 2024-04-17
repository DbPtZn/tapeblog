
<script lang="ts" setup>
import { NInput } from 'naive-ui'
import { nextTick, ref, ComponentInstance } from 'vue'
const props = defineProps<{
  show: () => boolean
}>()


</script>

<template>
  <n-button v-show="show()" strong tertiary size="small">取消</n-button>
</template>

<style lang="scss" scoped>

</style>
