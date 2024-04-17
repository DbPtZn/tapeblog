import { useRenderer, useShell } from '@/renderer'
import { ref } from 'vue'

export function usePage() {
  const renderer = useRenderer()
  const pageCount = ref(10)
  const pageNum = ref(1)
  function handleUpdate(num: number) {
    renderer.implementRef?.scrollTo({ top: 0 })
  }
  return {
    pageCount,
    pageNum,
    handleUpdate,
    handleLast() {
      if (pageNum.value === 1) return
      pageNum.value = pageNum.value - 1
      handleUpdate(pageNum.value)
    },
    handleNext() {
      if (pageNum.value === pageCount.value) return
      pageNum.value = pageNum.value + 1
      handleUpdate(pageNum.value)
    }
  }
}
