
import { maxios } from './index'

interface CreateUserDto {
  email: string
  password: string
  username: string
}

export const user = {
  get<T>() {
    return maxios.get<T>('/user/read/info')
  },
  // getDir<T>() {
  //   return maxios.get('/user/read/dir/')
  // }
  // login<T>(data: any) {
  //   // console.log(data)
  //   return maxios.post<T>('/user/read/login', { data })
  // },
  // retain<T>() {
  //   return maxios.get<T>('/user/read/retain')
  // },
  // logout<T>() {
  //   return maxios.put<T>('/user/read/logout')
  // },
  updateReceiverStatus<T>(status: number) {
    return maxios.patch<T>('/user/update/receiver/' + status)
  },
  // updateNickname<T>(nickname: string) {
  //   return maxios.put<T>('/user/update/nickname', { data: { nickname: nickname } })
  // },
  // updateDesc<T>(desc: string) {
  //   return maxios.put<T>('/user/update/desc', { data: { desc } })
  // }
}
