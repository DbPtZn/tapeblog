import { Injectable } from '@nestjs/common'
import { hxMap } from './utils/hx.map'
// import { hxMap1 } from './utils/hx1.map'
// import { hxMap2 } from './utils/hx2.map'
@Injectable()
export class ApiService {
  constructor() {}

  zhToMartian(txt: string) {
    let result = ''
    for (const char of txt) {
      // 使用正则表达式检查字符是否为中文
      if (/[\u4e00-\u9fa5]/.test(char)) {
        // 如果是中文字符，则检查映射表中是否存在对应的火星文字符，如果存在则替换，否则保持不变
        result += hxMap.get(char) || char
      } else {
        // 如果不是中文字符，则保持不变
        result += char
      }
    }
    return result
  }
}
