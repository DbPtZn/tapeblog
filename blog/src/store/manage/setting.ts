import { ThemeEnum } from '@/enums'
import { darkTheme } from 'naive-ui'
import { defineStore } from 'pinia'

interface State {
  theme: typeof darkTheme | null
  isSidebarCollapse: boolean
  isItemListCollapse: boolean
}
export const useSettingStore = defineStore('settingStore', {
  state(): State {
    return {
      theme: darkTheme,
      isSidebarCollapse: false,
      isItemListCollapse: false
    }
  },
  actions: {
    useDark() {
      this.theme = darkTheme
    },
    useLight() {
      this.theme = null
    },
    getCurrentTheme(): ThemeEnum {
      return this.theme ? ThemeEnum.DARK : ThemeEnum.LIGHT
    }
  },
  getters: {
    //
  }
})
