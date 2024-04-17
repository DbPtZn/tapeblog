import { useSettingStore } from './setting'

export const useDefaultStore = () => ({
  settingStore: useSettingStore()
})