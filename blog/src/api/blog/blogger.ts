// import { BASE_URL } from '../BASE_URL'
import { REST } from '../enum/REST'
import { baxios } from './index'


export const blogger = {
  get<T>(UID: string) {
    return baxios({
      method: 'get',
      url: `/blog/${REST.R}/blogger/${UID}`
    })
  }
}
