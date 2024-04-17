import { REST } from '../enum/REST'
import { maxios } from './index'
interface AllocationDto {
  id: string,
  collectionId: string
  isPublish: boolean
}

interface UpdateTitleDto {
  id: string,
  title: string
}

interface ParseDto {
  id: string
  firstPicture: string
  content: string
  duration: number
  promoterSequence: string[]
  keyframeSequence: number[]
  subtitleSequence: string[]
  subtitleKeyframeSequence: number[]
}

export const product = {
  /**
   * 获取产品
   * @param productId 产品id
   * @returns 产品数据
   */
  get<T>(id: string) {
    return maxios.get<T>('/product/read/' + id)
  },
  allocation<T>(dto: AllocationDto) {
    console.log(dto)
    return maxios.patch<T>(`/product/${REST.U}/allocation`, dto)
  },
  revoke<T>(id: string) {
    return maxios.patch<T>(`/product/${REST.U}/revoke/${id}`)
  },
  parse<T>(dto: ParseDto) {
    return maxios.patch<T>(`/product/${REST.U}/parse`, dto)
  },
  getUnparsedFile<T>(filename: string, progressCallback?: (progressEvent: number) => void) {
    return maxios.get<T>(`/product/${REST.R}/unparsed/` + filename, {
      onDownloadProgress: progressEvent => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total!)
        progressCallback && progressCallback(percentCompleted)
      }
    })
  }

  // remove<T>(productId: string) {
  //   return maxios.patch<T>('/product/update/remove/' + productId)
  // },
  // restore<T>(productId: string) {
  //   return maxios.patch<T>('/product/update/restore/' + productId)
  // },
  // delete<T>(productId: string) {
  //   return maxios.delete<T>('/product/delete/' + productId)
  // },
  // move<T>(productId: string, folderId: string) {
  //   return maxios.patch<T>('/product/update/move/' + productId, { folderId })
  // },
  // copy<T>(productId: string, folderId: string) {
  //   return maxios.post<T>('/product/write/copy/' + productId, { folderId })
  // },
  // /** product update */
  // updateTitle<T>(dto: UpdateTitleDto) {
  //   return maxios.patch<T>('/product/update/title', dto)
  // },
  // updateContent<T>(dto: UpdateContentDto) {
  //   return maxios.patch<T>('/product/update/content', dto)
  // },
  // push<T>(dto: { id: string, title: string, msg: string, ssoToken: string }) {
  //   return maxios.post<T>('/product/push/', dto)
  // }
}
