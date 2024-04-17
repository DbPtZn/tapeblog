export * from './manage/_index'
export * from './blog/_index'
export * from './defalut/_index'
import { useManageStore } from './manage/_index'
import { useBlogStore } from './blog/_index'
import { useDefaultStore } from './defalut/_index'

function useStore(): ReturnType<typeof useDefaultStore>
function useStore(key: 'manage'): ReturnType<typeof useManageStore>
function useStore(key: 'blog'):  ReturnType<typeof useBlogStore>
function useStore(key?: 'manage' | 'blog') {
  // if(!key) return useDefaultStore()
  switch (key) {
    case 'manage':
      return useManageStore()
    case 'blog':
      return useBlogStore()
    default:
      return useDefaultStore()
  }
}

export default useStore

// export * from './modules/_api'
// import {
//   useSettingStore,
//   useCollectionsDataStore,
//   useCollectionStore,
//   useUserStore,
//   useProductStore,
//   useAuthcodeStore
// } from './modules/_api'

// const useStore = () => ({
//   userStore: useUserStore(),
//   settingStore: useSettingStore(),
//   collectionsDataStore: useCollectionsDataStore(),
//   collectionStore: useCollectionStore(),
//   productStore: useProductStore(),
//   authcodeStore: useAuthcodeStore()
// })
