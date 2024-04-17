import { defineStore } from 'pinia'
import { manageApi } from '@/api'
interface AuthCode {
  id: string
  name: string
  code: string
  desc: string
  disabled: boolean
  createAt: string
  updateAt: string
}
interface State {
  data: AuthCode[]
}
export const useAuthcodeStore = defineStore('authcodeStore', {
  state(): State {
    return {
      data: []
    }
  },
  actions: {
    fetch() {
      return manageApi.authcode.get<AuthCode[]>()
    },
    setMany(data: any[]) {
      const state: AuthCode[] = data.map((item) => {
        return {
          id: item._id || '',
          name: item.name || '',
          code: item.code || '',
          desc: item.desc || '',
          disabled:item.disabled || false,
          createAt: item.createAt || '',
          updateAt: item.updateAt || ''
        }
      })
      this.data.push(...state)
    },
    set(data: any) {
      const state: AuthCode = {
        id: data._id || '',
        name: data.name || '',
        code: data.code || '',
        desc: data.desc || '',
        disabled: data.disabled || false,
        createAt: data.createAt || '',
        updateAt: data.updateAt || ''
      }
      this.data.push(state)
    },
    fetchAndSet() {
      if(this.data.length === 0) {
        return this.fetch().then((res) => {
          this.setMany(res.data)
        })
      }
    },
    add() {
      return manageApi.authcode.add().then((res) => {
        this.set(res.data)
      })
    },
    update(dto: Parameters<typeof manageApi.authcode.update>[0]) {
      return manageApi.authcode.update(dto).then((res) => {
        const data = res.data as any
        this.data.some((item, index, arr) => {
          if (item.id === data._id) {
            arr[index].name = data.name
            arr[index].code = data.code
            arr[index].desc = data.desc
            arr[index].disabled = data.disabled
            arr[index].updateAt = data.updateAt
            return true
          }
        })
      })
    },
    delete(id: string) {
      return manageApi.authcode.delete(id).then((res) => {
        this.data.some((item, index, arr) => {
          if (item.id === id) {
            arr.splice(index, 1)
            return true
          }
        })
      })
    },
  },
  getters: {
    //
  }
})
