// import maxios from "maxios"
import { maxios } from './index'

interface UpdateDto {
  id: string
  name: string
  code: string
  disabled: boolean
}

export const authcode = {
  get<T>() {
    return maxios.get<T>('/authcode/read/all')
  },
  add<T>() {
    return maxios.post<T>('/authcode/write/add')
  },
  update<T>(dto: UpdateDto) {
    return maxios.patch<T>('/authcode/update', dto)
  },
  delete<T>(id: string) {
    return maxios.delete<T>('/authcode/delete/' + id)
  },
}
