import { DropdownMixedOption, DropdownOption } from 'naive-ui/es/dropdown/src/interface'
import { computed, nextTick, reactive, ref } from 'vue'

export function useDropdown() {
  const dropdownState = reactive({
    xRef: ref<number>(0),
    yRef: ref<number>(0),
    showDropdownRef: ref<boolean>(false),
    showArrowRef: ref<boolean>(false),
    placementRef: ref<'bottom' | 'bottom-start'>('bottom-start')
  })
  let current: HTMLElement | null = null
  function handleClickoutside() {
    dropdownState.showDropdownRef = false
  }
  function handleSelect() {
    dropdownState.showDropdownRef = false
  }

  function handleContextmenu(ev: MouseEvent) {
    ev.preventDefault()
    ev.stopPropagation()
    dropdownState.showDropdownRef = false
    nextTick().then(() => {
      dropdownState.showDropdownRef = true
      dropdownState.xRef = ev.clientX
      dropdownState.yRef = ev.clientY
      dropdownState.showArrowRef = false
      dropdownState.placementRef = 'bottom-start'
    })
  }

  function handleItemMore(ev: MouseEvent) {
    ev.preventDefault()
    ev.stopPropagation()
    dropdownState.showDropdownRef = false
    const el = ev.target as HTMLElement
    const rect = el.getBoundingClientRect()
    nextTick().then(() => {
      dropdownState.showDropdownRef = true
      dropdownState.xRef = rect.x + 9
      dropdownState.yRef = rect.y + 15
      dropdownState.showArrowRef = true
      dropdownState.placementRef = 'bottom'
    })
  }

  function handleShowOptions(ev: MouseEvent) {
    ev.preventDefault()
    ev.stopPropagation()
    const target = ev.target as HTMLElement
    if (current === target)  {
      dropdownState.showArrowRef = false
      current = null
      return 
    }
    current = target
    dropdownState.showDropdownRef = false
    const el = ev.target as HTMLElement
    const rect = el.getBoundingClientRect()
    nextTick().then(() => {
      dropdownState.showDropdownRef = true
      dropdownState.xRef = rect.x + 9
      dropdownState.yRef = rect.y + 15
      dropdownState.showArrowRef = true
      dropdownState.placementRef = 'bottom'
    })
  }

  const options = computed<DropdownOption[]>(() => {
    return [
      {
        key: 'paging',
        label: '分页模式',
        value: 'paging'
      },
      {
        key: 'sort',
        disabled: true,
        label: () => '按时间倒序',
        value: 'reverse'
      },
      // {
      //   key: '3',
      //   label: '选项3',
      //   value: '选项3'
      // }
    ]
  })
  return {
    dropdownState,
    options,
    handleClickoutside,
    handleSelect,
    handleContextmenu,
    handleItemMore,
    handleShowOptions
  }
}
