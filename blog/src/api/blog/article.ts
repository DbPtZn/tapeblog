import { REST } from '../enum/REST'
import { baxios } from './index'
// export enum articleListOption {
//   ALL = 'all',
//   RECOMMEND = 'recommend',
//   COLLECT = 'collect'
// }
interface GetArticleListDto {
  UID: string
  take: number
  skip: number
  collectionId?: string
  type?: 'course' | 'note'
}
export const article = {
  /**
   * 获取作品
   * @param articleId 作品id
   * @returns 作品数据
   */
  get<T>(articleId: string) {
    return baxios.get<T>(`/blog/${REST.R}/product/${articleId}`)
  },
  getList<T>(dto: GetArticleListDto) {
    // console.log('999')
    return baxios.post<T>(`/blog/${REST.R}/product/list`, dto)
  },
  getQuantity<T>(dto: { account: string, option: 'all' | 'recommend' | 'collect' }) {
    return baxios.post<T>(`/blog/${REST.R}/product/list/quantity`, dto)
  },
}
