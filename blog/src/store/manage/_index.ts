import { useAuthcodeStore } from './authcode'
import { useCollectionStore } from './collection'
import { useCollectionsDataStore } from './collections-data'
import { useProductStore } from './product'
import { useSettingStore } from './setting'
import { useUserStore } from './user'

// import {
//   useAuthcodeStore,
//   useCollectionStore,
//   useCollectionsDataStore,
//   useProductStore,
//   useSettingStore,
//   useUserStore
// } from '..'

export const useManageStore = () => ({
  userStore: useUserStore(),
  collectionsDataStore: useCollectionsDataStore(),
  collectionStore: useCollectionStore(),
  productStore: useProductStore(),
  authcodeStore: useAuthcodeStore(),
  settingStore: useSettingStore()
})

export * from './_types'
// export default useManagerStore
