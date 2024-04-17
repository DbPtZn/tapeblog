import { baxios } from './index'

interface CreateUserDto {
  email: string
  password: string
  username: string
}

export const user = {
  // getInfo<T>() {
  //   return baxios({
  //     method: 'get',
  //     url: '/user/read/info/'
  //   })
  // }
  // login<T>(data: any) {
  //   // console.log(data)
  //   return axios.post<T>('/user/read/login', { data })
  // },
  // retain<T>() {
  //   return axios.get<T>('/user/read/retain')
  // },
  // logout<T>() {
  //   return axios.put<T>('/user/read/logout')
  // },
  // updateAvator<T>(src: string) {
  //   return axios.put<T>('/user/update/avator', { data: { avator: src } })
  // },
  // updateNickname<T>(nickname: string) {
  //   return axios.put<T>('/user/update/nickname', { data: { nickname: nickname } })
  // },
  // updateDesc<T>(desc: string) {
  //   return axios.put<T>('/user/update/desc', { data: { desc } })
  // }
}
