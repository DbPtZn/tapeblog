import { maxios } from './index'

interface CreateCollectionDto {
  label: string
}

interface UpdateTitleDto {
  id: string,
  title: string
}

export const collection = {
  /**
   * 新建笔记
   * @param folderId 文件夹 id
   * @param account 账户
   * @returns 新建笔记的数据
   */
  create<T>(dto: CreateCollectionDto) {
    return maxios.post<T>('/collection/write/create', dto)
  },

  /**
   * 获取全部合辑
   * @param collectionId 合辑id
   * @returns 所有合辑项
   */
  getAll<T>() {
    return maxios.get<T>('/collection/read/all')
  },
  
  /**
   * 获取指定合辑
   * @param collectionId 合辑id
   * @returns 合辑数据
   */
  get<T>(collectionId: string) {
    return maxios.get<T>('/collection/read/' + collectionId)
  },

  /**
   * 获取未分配文档
   * @param collectionId 合辑id
   * @returns 合辑数据
   */
  getUnfiled<T>() {
    return maxios.get<T>('/collection/read/unfiled')
  },

  // remove<T>(collectionId: string) {
  //   return maxios.patch<T>('/collection/update/remove/' + collectionId)
  // },
  // restore<T>(collectionId: string) {
  //   return maxios.patch<T>('/collection/update/restore/' + collectionId)
  // },
  // delete<T>(collectionId: string) {
  //   return maxios.delete<T>('/collection/delete/' + collectionId)
  // },
  // move<T>(collectionId: string, folderId: string) {
  //   return maxios.patch<T>('/collection/update/move/' + collectionId, { folderId })
  // },
  // copy<T>(collectionId: string, folderId: string) {
  //   return maxios.post<T>('/collection/write/copy/' + collectionId, { folderId })
  // },
  // /** collection update */
  // updateTitle<T>(dto: UpdateTitleDto) {
  //   return maxios.patch<T>('/collection/update/title', dto)
  // },
  // updateContent<T>(dto: UpdateContentDto) {
  //   return maxios.patch<T>('/collection/update/content', dto)
  // },
  // push<T>(dto: { id: string, title: string, msg: string, ssoToken: string }) {
  //   return maxios.post<T>('/collection/push/', dto)
  // }
}
