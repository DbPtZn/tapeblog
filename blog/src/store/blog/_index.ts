import { useSettingStore } from '../defalut/setting'
import { useBolggerListStore } from './blogger-list'
import { useCollectionStore } from './collection'
import { useCollectionListStore } from './collection-list'
import { useArticleStore } from './article'
import { useArticleListStore } from './article-list'
import { useBloggerStore } from './blogger'

export const useBlogStore = () => ({
  // outlineStore: useOutlineStore(),
  // settingStore: useSettingStore(),
  bloggerStore: useBloggerStore(),
  articleStore: useArticleStore(),
  collectionStore: useCollectionStore(),
  articleListStore: useArticleListStore(),
  collectionListStore: useCollectionListStore(),
  // bolggerListStore: useBolggerListStore()
})
