// import { TrashNameEnum } from '@/enums'
import { maxios } from './index'

export const trash = {
  get<T>() {
    return maxios.get<T>(`/trash/read`)
  },
  // restore<T>(id: string, trashName: TrashNameEnum) {
  //   return axios.patch<T>(`/trash/update/restore/${trashName}/`+ id)
  // },
  // delete(id: string, trashName: TrashNameEnum) {
  //   return axios.delete(`/trash/delete/${trashName}/` + id)
  // }
}
