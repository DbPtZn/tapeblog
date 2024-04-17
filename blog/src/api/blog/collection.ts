import { REST } from '../enum/REST'
import { baxios } from './index'
interface CreateCollectionDto {
  label: string
}

interface UpdateTitleDto {
  id: string,
  title: string
}

export const collection = {
  /**
   * 获取指定合辑
   * @param collectionId 合辑id
   * @returns 合辑数据
   */
  get<T>(collectionId: string) {
    return baxios.get<T>(`/collection/blog/${REST.R}/${collectionId}`)
  },
  getList<T>(UID: string) {
    return baxios.get<T>(`/blog/${REST.R}/collection/list/${UID}`)
  }
}
