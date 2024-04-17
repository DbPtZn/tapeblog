import { nextTick, ref } from 'vue'

export function useDropdown() {
  const xRef = ref(0)
  const yRef = ref(0)
  const isShow = ref(false)
  return {
    handleContextmenu(ev: MouseEvent) {
      ev.preventDefault()
      ev.stopPropagation()
      isShow.value = false
      nextTick().then(() => {
        isShow.value = true
        xRef.value = ev.clientX
        yRef.value = ev.clientY
      })
    },
    handleHide() {
      isShow.value = false
    },
    getX() {
      return xRef.value
    },
    getY() {
      return yRef.value
    },
    getShowState() {
      return isShow.value
    },
    options() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const that = this
      return [
        {
          label: '下一页',
          key: 'next-page',
          props: {
            onClick: () => {
              that.handleHide()
            }
          }
        },
      ]
    }
  }
}
